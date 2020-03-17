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
