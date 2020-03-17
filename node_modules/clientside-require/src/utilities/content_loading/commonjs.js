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
