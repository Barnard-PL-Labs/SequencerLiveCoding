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
