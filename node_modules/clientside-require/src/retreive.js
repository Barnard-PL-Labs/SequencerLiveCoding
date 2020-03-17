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
