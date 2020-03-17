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
