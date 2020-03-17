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
