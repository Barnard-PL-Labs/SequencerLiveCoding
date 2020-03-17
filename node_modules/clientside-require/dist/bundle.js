(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var sleep = function(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

/*
    Dynamic_Serial_Promise_All :
    - handles situations where we want to wait for a dynamic amount of serially dependent processes
    - since we do not know in advance what processes we will want to wait for after a prior process resolves, we will have to "re-check" the promise list
        - recheck :
            - after original promises resolve
            - if on recheck all promises resolve, wait another 100microseconds and recheck
            - if second recheck succeeds, then we can be fairly confident we are done
*/
var Dynamic_Serial_Promise_All = function(safety_lap_wait_time){
    if(typeof safety_lap_wait_time != "number") safety_lap_wait_time = 100;
    this.safety_lap_wait_time = safety_lap_wait_time;
    this.promise_list = [];
}
Dynamic_Serial_Promise_All.prototype = {
    get promise_all(){
        return this.promise_all_promises_have_resolved();
    },
    wait_for : function(promise){
        this.promise_list.push(promise);
    },
    promise_all_promises_have_resolved : async function(bool_safety_lap){
        /*
            this function conducts Promise.all() on all current promises
            after resolving, it checks if there are any new promises added.
                - if added, run self again
                - if not added, sleep for 100 milliseconds and run self again
                    - if safty_lap run resolves and still no new promises, resolve completely.
        */
        // run promise all on all current promises
        var original_promise_count = this.promise_list.length;
        var result = await Promise.all(this.promise_list);

        // check if promise count has changed
        var now_promises_count = this.promise_list.length;
        var promises_added = (original_promise_count != now_promises_count);

        // act on change
        if(promises_added){ // promises were added, wait untill all resolve again
            return this.promise_all_promises_have_resolved();
        } else if(bool_safety_lap===true){ // saftey lap was run and no change in promise count
            return result;
        } else {
            await sleep(this.safety_lap_wait_time); // wait for 100 ms
            return this.promise_all_promises_have_resolved(true); // run safety lap
        }
    },
    reset : function(){
        /*
            utility function to cleanly empty the promise_list 
        */
        this.promise_list = [];
    },
}
module.exports = Dynamic_Serial_Promise_All;

},{}],2:[function(require,module,exports){
var normalize_path = require("./utilities/request_analysis/normalize_path.js");

module.exports = {
    /*
        data structures
    */
    _data : {promise : {}, content : {}}, // promise for async, content for sync
    _unique_requests : [], // list of unique cache_paths for self analysis

    /*
        methods
    */
    generate_cache_path_for_request : function(request, modules_root, options){
        var [path, analysis] = normalize_path(request, modules_root, options.relative_path_root);
        var cache_path = path; // define cachepath as path to file with content. For modules, defines path to package.json
        if(analysis.is_a_module) cache_path = "module:" + cache_path; // since modules return package.json request, distinguish between module requests and actual requests to package.json
        return cache_path;
    },
    get : function(cache_path, type){
        if(typeof type == "undefined") type = "promise"; // default to promise
        if(type !== "content" && type !== "promise") throw new Error("get type requested from cache is invalid");
        if(type == "content") var data = this._data.content[cache_path]; // used for sync requires
        if(type == "promise") var data = this._data.promise[cache_path]; // used for async requires
        if(typeof data == "undefined") data = null; // normalize undefined data
        return data;
    },
    set : function(cache_path, promise_content){
        this._unique_requests.push(cache_path); // store this set request
        this._data.promise[cache_path] = promise_content; // set promise
        this._data.promise[cache_path]
            .then((content)=>{
                this._data.content[cache_path] = content; // set content after promise resolves
            })
            .catch((error)=>{ // remove self from cache if there was an error
                delete this._data.promise[cache_path];
            })
        return true;
    },
    reset : function(){
        this._data = {promise : {}, content : {}},
        this._unique_requests = [];
    },
}

},{"./utilities/request_analysis/normalize_path.js":10}],3:[function(require,module,exports){
/*
    Clientside Require Module
        - supports CommonJS require functionality in the browser
            by providing an asynchronoused require and scoping loaded data
        - note: the require functions in this module are expected to
            be parsed through either 1. webpack or 2. node require - as it cant use itself to build itself
------------------------------------------------------------------------------------------------------------------------------
*/

/*
    define object - a singleton
        - singleton specifically to preserve cache across instantiations
*/
var clientside_require = {
    /*
        define modules root
    */
    modules_root : (typeof window.node_modules_root == "undefined")?
        window.location.origin + "/node_modules/" : // default assumes that the node_modules root is at location origin
        window.node_modules_root, // else if defined use defined root

    /*
        define the cache - a singleton
    */
    cache : require("./cache.js"),

    /*
        define retreival manager - a singleton
    */
    retreiver : require("./retreive.js"),

    /*
        define the `promise_all` property, enabling users to determine when all `load`ing has completed
            - this is useful for contexts such as server side rendering
    */
    promise_manager : new (require('dynamic-serial-promise-all'))(),
    get promise_all(){
        return this.promise_manager.promise_all;
    },

    /*
        asynchronous_require - the main method used
            - returns a promise which resolves with the requested content
            - places the request into cache so that content is only loaded once
            - injects require functions into requested js files to support requires in required files
                - supports sync and async require injections
    */
    asynchronous_require : async function(module_or_path, options){
        // normalize and analyze request
        var options = this.util.normalize_request_options(options);
        var cache_path = this.cache.generate_cache_path_for_request(module_or_path, this.modules_root, options);

        // ensure request is cached
        if(this.cache.get(cache_path) == null){ // if not in cache, build into cache
            var promise_content = this.retreiver.promise_to_retreive_content(module_or_path, this.modules_root, options);
            this.promise_manager.wait_for(promise_content); // ensure promise_manager waits for each `load` promise when determining all is loaded
            this.cache.set(cache_path, promise_content)
        }

        // resolve with content
        return this.cache.get(cache_path, "promise");
    },

    /*
        synchronous require -
            - only usable by js contexts which were created by a clientside
                require load that provisioned the environment with all of its dependencies
            - the function is automatically injected into said environment
            - synchronous require expects all dependencies to already be loaded into cache
    */
    synchronous_require : function(module_or_path, options){
        var options = this.util.normalize_request_options(options);
        var cache_path = this.cache.generate_cache_path_for_request(module_or_path, this.modules_root, options);
        return this.cache.get(cache_path, "content");
    },

    /*
        helper utilities
    */
    util : {
        normalize_request_options : require("./utilities/normalize_request_options"),
    }

}

/*
    inject "require" and "require_global" into browser context globally
*/
if(typeof window.require_global == "undefined") window.require_global = {}; // initialize require_global by default if not already initialized
window.clientside_require = clientside_require; // provision `clientside_require` to global scope
window.load = clientside_require.asynchronous_require.bind(clientside_require); // provision `require` to global scope
if(typeof module !== "undefined" && typeof module.exports != "undefined") module.exports = clientside_require; // export module if module.exports is defined

},{"./cache.js":2,"./retreive.js":4,"./utilities/normalize_request_options":8,"dynamic-serial-promise-all":1}],4:[function(require,module,exports){
/*
    retreival_manager handles placing requests to load content. handles sync and async requires.
*/
module.exports = {
    /*
        define utils
    */
    utils : {
        loader_functions : require("./utilities/content_loading/scoped.js"),
        promise_to_decompose_request : require("./utilities/request_analysis/decompose_request.js"),
    },

    /*
        the bread and butter
            - parse the request, load the file, resolve the content
    */
    promise_to_retreive_content : async function(request, modules_root, options){
        /*
            extract request details for this request
        */
        var request_details = await this.utils.promise_to_decompose_request(
            request, // a relative path, absolute path, or module name
            modules_root, // defines where to look for modules
            options.relative_path_root, // defines where the relative path should start from
            options.search_for_dependencies // modules can define to not search for dependencies on their own, overriding the user
        );

        /*
            load dependencies into cache before loading the main file
                - recursive operation
        */
        if(request_details.search_for_dependencies){
            // this is the main (and most obvious) downside to synchronous_require; waiting until all dependencies load.
            var dependency_relative_path_root = request_details.path.substring(0, request_details.path.lastIndexOf("/")) + "/";
            await this.promise_dependencies_are_loaded(request_details.dependencies, dependency_relative_path_root, request_details.search_for_dependencies); // wait untill dependencies are loaded
        }

        /*
            retreive content with loader functions
                - handles scoping and env setup of js files (retreives content based on CommonJS exports)
                - supports js, css, html, json, txt, etc
        */
        var content = await this.utils.loader_functions[request_details.type](request_details.path);

        /*
            resolve with content
        */
        return content;
    },

    /*
        promise dependencies are loaded
            - PURPOSE: to preload dependencies for synchronous require injections
            - takes list of 'dependencies' as input and loads each of them into cache
            - waits untill all are fully loaded in cache before resolving
    */
    promise_dependencies_are_loaded : async function(dependencies, relative_path_root, search_for_dependencies){ // load dependencies for synchronous injected require types
        /*
            normalize input
        */
        if(typeof dependencies == "undefined") dependencies = [];

        /*
            define dependency options to be used for caching the modules
                - pass relative path root
        */
        var dependency_options = {
            relative_path_root:relative_path_root, // pass relative path root
            search_for_dependencies:search_for_dependencies, // NOTE: this will always be : true. We inject it though to make it clear why that is the case.
                                                             //     and do not worry - if a future module states that it should search for its dependencies, we still will, as the option will be overwritten by that modules settings
        };

        /*
            create promises to cache each
        */
        var promises_to_cache_each = [];
        for(var i = 0; i < dependencies.length; i++){ // promise to load each dependency
            let dependency = dependencies[i]; //
            var this_promise = window.clientside_require.asynchronous_require(dependency, dependency_options) // call async require to cache the module
                .catch((err)=>{
                    console.warn("could not load dependency " + dependency + " found in " + relative_path_root);
                })
            promises_to_cache_each.push(this_promise);
        }

        /*
            resolve only after all are loaded
        */
        return Promise.all(promises_to_cache_each); // note that we do not await each promise individually so that multiple dependencies can load at a time
    },

}

},{"./utilities/content_loading/scoped.js":7,"./utilities/request_analysis/decompose_request.js":9}],5:[function(require,module,exports){
/*
    basic resource loading methods that do not nessesarily preserve scope
*/
var basic_loaders = {
    promise_to_load_script_into_document : function(script_src, target_document){
        if(typeof target_document == "undefined") target_document = window.document; // if no document is specified, assume its the window's document
        var loading_promise = new Promise((resolve, reject)=>{
            var script = target_document.createElement('script');
            script.setAttribute("src", script_src);
            script.onload = function(){
                resolve(target_document);
            };
            script.onerror = function(error){
                reject(error);
            }
            target_document.getElementsByTagName('head')[0].appendChild(script);
        })
        return loading_promise;
    },
    promise_to_load_css_into_document : function(styles_href, target_document){
        if(typeof target_document == "undefined") target_document = window.document; // if no document is specified, assume its the window's document
        // <link rel="stylesheet" type="text/css" href="/_global/CSS/spinners.css">
        return new Promise((resolve, reject)=>{
            var styles = target_document.createElement('link');
            styles.type = "text/css";
            styles.rel = 'stylesheet';
            styles.href = styles_href;
            styles.onload = function(){
                resolve(target_document);
            };
            styles.onerror = function(error){
                reject(error);
            };
            target_document.getElementsByTagName('head')[0].appendChild(styles);
        })
    },
    promise_to_get_content_from_file : function(destination_path){
        return new Promise((resolve, reject)=>{
            var xhr = new window.XMLHttpRequest();
            xhr.open("GET", destination_path, true);
            xhr.onload = function(){
                var status_string = this.status + "";
                if(status_string[0] == "4") return reject(generate_xhr_error(this.status, destination_path));
                if(status_string[0] == "5") return reject(generate_xhr_error(this.status, destination_path));
                resolve(this.responseText)
            };
            xhr.onerror = function(error){
                if(typeof error == "undefined") error = this.statusText; // if error is not defined, atleast resolve with status text
                if(error.code == "ENOENT") return reject(generate_xhr_error(404, destination_path)); // maps not found node file:/// requests to 404 response
                return reject(error);
            };
            xhr.send();
        })
    },
    promise_to_retreive_json : async function(json_source){
        // get text from file
        var content = await this.promise_to_get_content_from_file(json_source);

        // cast data to json
        try {
            var data = (JSON.parse(content));
        } catch (err){
            console.error(err);
            throw (err);
        }

        // resolve with response
        return data;
    },
}
module.exports = basic_loaders;


/*
// Testing Utility
var proxy_handler = {
    get: function(obj, prop) {
        return function(arg_1, arg_2){
            console.log("getting file at path :" + arg_1);
            return obj[prop](arg_1, arg_2);
        }
    }
};
var proxied_loaders = new Proxy(basic_loaders, proxy_handler);
module.exports = proxied_loaders;
*/


/*
    helper function
*/
var generate_xhr_error = function(status_code, path){
    var message = "Request Error : 404 : " + path;
    var code = status_code;
    var error = new Error(message);
    error.code = code;
    return error;
}

},{}],6:[function(require,module,exports){
var basic_loaders = require("./basic.js");
/*
    meat and potatoes of clientside-require:
        1. loads modules in an iframe to preserve scope and returns the "exports" from the module
            - passes environmental variables expected to be present for browsers
                - console
                - alert
                - confirm
                - prompt
            - passes environmental variables expected to be present for CommonJS modules
                - module
                - exports
                - require
        2. determines whether to inject a synchronous or asynchronous require function
            - if synchronous then we have already recursivly parsed all dependencies that the loaded file has and all dependencies are already cached and ready to use synchronously
            - if asynchronous then we pass the regular clientside_require function which loads as usual
*/

/*
    NOTE (important) : the contentWindow properties defined will be availible in the loaded modules BUT NOT availible to the clientside-module-manager;
                        clientside module manager is only accessible by the contentWindow.require  function that is passed;
                        the clientside-module-manager (this object) will have the same global window as the main file at ALL times.
*/

const is_jsdom_environment = window.navigator.userAgent.includes("Node.js") || window.navigator.userAgent.includes("jsdom");
module.exports = {
    promise_to_retreive_exports : async function(path){
        //create frame and define environmental variables
        var frame = await this.helpers.promise_to_create_frame();

        // generate require function to inject
        var load_function = this.helpers.generate_require_function_to_inject(path, "async");
        var require_function = this.helpers.generate_require_function_to_inject(path, "sync");

        // provision the environment of the frame
        this.provision.clientside_require_variables(frame, load_function);
        this.provision.browser_variables(frame, path);
        this.provision.commonjs_variables(frame, require_function);

        // load the javascript into the environment
        await this.helpers.load_module_into_frame(path, frame);

        // extract the CommonJS-specified exports
        var exports = await this.helpers.extract_exports_from_frame(frame);

        // destroy the frame now that we have the exports, if not in jsdom environment
        if(!is_jsdom_environment) this.helpers.remove_frame(frame); // do not remove iframe if we are using in node context (meaning we are using jsdom). TODO (#29) - figure how to preserve the window object (specifically window.document) after iframe is removed from parent

        // if in jsdom environment, then create a public list of frames accessible for removal
        if(is_jsdom_environment){
            if(typeof window.frames_to_remove == "undefined") window.frames_to_remove = [];
            window.frames_to_remove.push(frame);
        }

        // return the exports
        return exports;
    },

    /*
        provisioning utilities
    */
    provision : {
        clientside_require_variables : function(frame, load_function){ // clientside_require specific variables
            frame.contentWindow.require_global = window.require_global; // pass by reference require global
            frame.contentWindow.clientside_require = window.clientside_require; // pass by reference the clientside_require object
            frame.contentWindow.root_window = window; // pass the root window (browser window) to the module so it can use it if needed
            frame.contentWindow.load = load_function; // inject the load function
            frame.contentWindow.env = frame.contentWindow; // pass the window property of the iframe as the env property
        },
        browser_variables : function(frame, path){ // browser environment variables (those not present in iframes)
            frame.contentWindow.console = window.console; // pass the console functionality
            frame.contentWindow.alert = window.alert; // pass the alert functionality
            frame.contentWindow.confirm = window.confirm; // pass the confirm functionality
            frame.contentWindow.prompt = window.prompt; // pass the prompt functionality
            frame.contentWindow.HTMLElement = window.HTMLElement; // pass HTMLElement object
            frame.contentWindow.XMLHttpRequest = window.XMLHttpRequest; // pass the XMLHttpRequest functionality; using iframe's will result in an error as we delete the iframe that it is from

            // define window.location; https://stackoverflow.com/a/736970/3068233
            var anchor = window.document.createElement("a");
            anchor.href = path;
            frame.contentWindow.script_location = {
                href : anchor.href,
                origin : anchor.origin,
                protocol : anchor.protocol,
                host : anchor.host,
                hostname : anchor.hostname,
                port : anchor.port,
                pathname : anchor.pathname,
                pathdir : anchor.pathname.substring(0, anchor.pathname.lastIndexOf("/")) + "/", //  path to this file without the filename
            };
        },
        commonjs_variables : function(frame, require_function){ // CommonJS environment variables
            frame.contentWindow.module = {exports : {}};
            frame.contentWindow.exports = frame.contentWindow.module.exports; // create a reference from "exports" to modules.exports
            frame.contentWindow.require = require_function; // inject the require function
        },
    },

    /*
        helper utilities
    */
    helpers : {
        remove_frame : function(frame){
            frame.parentNode.removeChild(frame);
        },
        extract_exports_from_frame : async function(frame){
            var frame_document = frame.contentWindow.document;
            var frame_window = frame_document.defaultView;
            var exports = await frame_window.module.exports;
            return exports;
        },
        load_module_into_frame : async function(path_to_file, frame){
            var frame_document = frame.contentWindow.document;
            await basic_loaders.promise_to_load_script_into_document(path_to_file, frame_document); // load the js into the document and wait untill completed
        },
        generate_require_function_to_inject : function(path_to_file, injection_type){ // handle passing of relative_path_root
            // extract relative path root
            var relative_path_root = path_to_file.substring(0, path_to_file.lastIndexOf("/")) + "/"; //  path to this file without the filename

            // get require function based on injection type
            if(injection_type == "async") var require_function = window.clientside_require.asynchronous_require.bind(window.clientside_require);
            if(injection_type == "sync") var require_function = window.clientside_require.synchronous_require.bind(window.clientside_require);
            if(typeof require_function == "undefined") throw new Error("require function definition invalid");

            // build the require function to inject
            var require_function_to_inject = function(request, options){
                if(typeof options == "undefined") options = {}; // define options if not yet defined
                options.relative_path_root = relative_path_root; // overwrite user defined rel path root - TODO - make this a private property
                return require_function(request, options);
            }

            // return require function
            return require_function_to_inject;
        },
        promise_to_create_frame : function(){
            return new Promise((resolve, reject)=>{
                //console.log("building promise");
                var frame = window.document.createElement('iframe'); // always create the iframe in the root document
                frame.onload = function(){resolve(frame)};
                frame.style.display = "none"; // dont display the iframe
                window.document.querySelector("html").appendChild(frame); // stick the document in the html element
            })
        }
    }

}

},{"./basic.js":5}],7:[function(require,module,exports){
var basic_loaders = require("./basic.js");
var commonjs_loader = require("./commonjs.js");
/*
    loading functionality which preserves scope
        - notably preserves scope when loading js content with CommonJS style exports

    TODO: find way to preserve scope with css styles
*/
module.exports = {
    js : function(path){ return commonjs_loader.promise_to_retreive_exports(path) },
    json : function(path){ return basic_loaders.promise_to_retreive_json(path) },
    html : function(path){ return basic_loaders.promise_to_get_content_from_file(path) },
    css : function(path){ return basic_loaders.promise_to_load_css_into_document(path) },
}

},{"./basic.js":5,"./commonjs.js":6}],8:[function(require,module,exports){
module.exports = function(options){
    if(typeof options == "undefined") options = {}; // ensure options are defined
    if(typeof options.relative_path_root == "undefined"){ // if relative path root not defined, default to dir based on location path
        var current_path = window.location.href;
        options.relative_path_root = current_path.substring(0, current_path.lastIndexOf("/")) + "/";
    };
    if(typeof options.async !== "undefined" && options.async === true) options.search_for_dependencies = false; // cast options.async = true into require_type = async
    if(typeof options.search_for_dependencies == "undefined"){ // if search_for_dependencies is not defined, default to true
        options.search_for_dependencies = true; // search for all require() dependencies
    }
    return options;
}

},{}],9:[function(require,module,exports){
var basic_loaders = require("./../content_loading/basic.js");
var normalize_path = require("./normalize_path.js");
/*
    extract request details
        - utilizes path_analis to extract normalized request path and anaylsis
        - is it an npm module reference? if so then we need to generate the path to the main file
        - what filetype should we load?
*/
var decomposer = {
    promise_to_decompose_module_request : async function(request){
        var package_json = await basic_loaders.promise_to_retreive_json(request)

        /*
            extract path for file
        */
        var base_path = request.substring(0, request.lastIndexOf("/")) + "/"; // get dir from filepath
        var main = (package_json.main)? package_json.main : "index.js"; // if main not defined, its index.js
        var path = base_path + main; // generate path based on the "main" data in the package json

        /*
            determine if we should skip looking for dependencies for this package
        */
        var search_for_dependencies = (typeof package_json == "undefined" || package_json.require_mode != "async");

        /*
            return the data
        */
        return {extension:"js", path:path, search_for_dependencies:search_for_dependencies}; // promise all data to be generated
    },
    promise_to_decompose_valid_file_request : function(request, extension, search_for_dependencies){
        var path = request; // since its not defining a module, the request has path information
        if(extension != "js") search_for_dependencies = false; // default to false if extension not js
        return {extension:extension, path:path, search_for_dependencies:search_for_dependencies};
    },

    /*
        parse a js file to extract all dependencies
            - dependencies are defined as module_or_path content found inside of a require() statment in the js file
            - PURPOSE: to enable preloading of modules for sync require injection
    */
    find_dependencies_in_js_file : async function(path){
        var content = await basic_loaders.promise_to_get_content_from_file(path)
        /*
            extract all require requests from js file manually
                - use a regex to match between require(["'] ... ["'])
        */
        //console.log("conducting regex to extract requires from content...");
        var regex = /(?:require\(\s*["'])(.*?)(?:["']\s*\))/g // plug into https://regex101.com/ for description; most important is (.*?) and g flag
        var matches = [];
        while (m = regex.exec(content)){ matches.push(m[1]) };
        return matches
    }

}
var decompose_request = async function(request, modules_root, relative_path_root, search_for_dependencies){
    var [request, analysis] = normalize_path(request, modules_root, relative_path_root);

    /*
        retreive based on request anaylsis
    */
    if(analysis.is_a_module){ // if not a path and no file extension, assume its a node_module.
        var details = await decomposer.promise_to_decompose_module_request(request);
    } else if(analysis.is_a_path && analysis.exists_valid_extension){ // if its an acceptable extension and not defining a module
        var details = await decomposer.promise_to_decompose_valid_file_request(request, analysis.extension, search_for_dependencies);
    } else {
        throw new Error("request is not a module and is not a path with a valid extension. it can not be fulfilled.");
    }

    /*
        retreive dependencies if nessesary
    */
    if(details.search_for_dependencies && details.extension == "js"){
        var path_dependencies = await decomposer.find_dependencies_in_js_file(details.path); // get paths this main file is dependent on (recursivly)
    } else {
        var path_dependencies = [];
    }

    /*
        return details in standard format
    */
    var finalized_details = {
        type : details.extension,
        path : details.path,
        search_for_dependencies : details.search_for_dependencies, // tells the loader what kind of require function to inject for js files
        dependencies : path_dependencies,
    }
    return finalized_details;
}

module.exports = decompose_request;

},{"./../content_loading/basic.js":5,"./normalize_path.js":10}],10:[function(require,module,exports){
/*
    analyze and normalize path
        - used for cache_path
        - used for generate requst details (where to load file)
*/
var normalize_path = function(path, modules_root, relative_path_root){
    /*
        validate that path is a potentially usable string
    */
    if(typeof path == "undefined") throw new Error("path is undefined");
    if(path == null) throw new Error("path is null");
    if(path.replace(/\s/g,'') == "") throw new Error("path is empty - all whitespace");

    /*
        normalize modules_root and relative_path_root
    */
    if(modules_root.slice(-1) != "/") var modules_root = modules_root + "/"; // append the "/" to the end
    if(relative_path_root.slice(-1) != "/") var relative_path_root = relative_path_root + "/"; // append the "/" to the end

    var extension_whitelist = ["js", "json", "css", "html"];

    /*
        analyze path
    */
    var orig_path = path;
    var is_relative_path_type_1 = path.indexOf("./") == 0; // then it is a path of form "./somepath", a relative path as defined by node
    var is_relative_path_type_2 = path.indexOf("../") == 0; // then it is a path of form "../somepath", a relative path as defined by node
    var is_relative_path = is_relative_path_type_1 || is_relative_path_type_2;

    var is_a_path = path.indexOf("/") > -1; // make sure not node_relative_path
    var is_a_module = !is_a_path;

    var extension = path.slice(1).split('.').pop(); // slice(1) to skip the first letter - avoids error of assuming extension exists if is_relative_path
    var exists_file_extension = extension != path.slice(1); // if the "extension" is the full evaluated string, then there is no extension
    var exists_valid_extension = exists_file_extension && extension_whitelist.indexOf(extension) > -1; // extension is valid if it is fron the extension whitelist


    /*
        modify path based on analysis (make assumptions)
    */
    if(is_a_path && !exists_valid_extension){  // if not a node module (i.e., is a path) and there is no valid extension,
        extension = "js"; // then it implies a js file
        exists_file_extension = true;
        exists_valid_extension = true;
        path += ".js";
        // TODO (#11) - sometimes this referes to a directory, how to detect whether directory or file?
            // if directory we need to go to path/index.js
            // may want to just attempt to load it and if we find an error assume its a directory and try that too
    }
    if(is_relative_path){ // if its a relative path,
        if(is_relative_path_type_1) path = path.slice(2); //  remove the "./" at the begining
        path = relative_path_root + path; // if relative path, use the relative_path_root to generate an absolute path
    }
    if(is_a_module){
        path = modules_root + path + "/package.json"; // convert path to packagejson path
        extension = "json";
        exists_file_extension = true;
        exists_valid_extension = true;
    }
    if(path.indexOf("://") == -1){ // if :// does not exist in string, assume that no origin is defined (origin = protocol + host)
        path = window.location.origin + path; // and simply append the locations origin. that is how the browser would treat the path in the first place
    }

    /*
        clean the path, mimicking the browser in this functionality
    */
    var parts = path.split("://");
    path_origin = parts[0];
    path_uri = parts[1];
    path_uri = path_uri.replace(/\/\/+/g, "/"); // replace all "//+" with "/"
    path = [path_origin, path_uri].join("://");

    /*
        build analysis object after all modifications and respond
    */
    var analysis = {
        orig_path : orig_path,
        is_relative_path:is_relative_path,
        is_a_path:is_a_path,
        extension:extension,
        exists_file_extension:exists_file_extension,
        exists_valid_extension:exists_valid_extension,
        is_a_module:is_a_module,
        relative_path_root : relative_path_root,
    }
    return [path, analysis];
};

module.exports = normalize_path;

},{}]},{},[3]);
