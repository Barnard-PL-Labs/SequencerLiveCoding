# Clientside Require

[![npm](https://img.shields.io/npm/v/clientside-require.svg?style=flat-square)](https://www.npmjs.com/package/clientside-require)
[![npm](https://img.shields.io/npm/dm/clientside-require.svg)](https://www.npmjs.com/package/clientside-require)

`require()` `node_modules`, `js`, `css`, `html`, and `json` in the browser with as little effort as loading jquery. (No building, compiling, etc required).


Simply serve the `clientside-require.js` file to a browser and enjoy one of life's greatest pleasures, `npm modules`, in the browser:

```html
<script src = "/path/to/clientside-require.js"></script>
<script>
    var promise_request = load("clientside-request") // loads the `clientside-request` npm package
    var promise_utility = load("/path/to/utility.js") // loads a custom js script without poluting global scope
</script>
```

If the npm package you are loading contains `require()` statements, the clientside-require module's `load` method will automatically resolve (i.e., load) each dependency before loading the script - enabling the `require()` statement in the `load()`'ed script.

For example, `/path/to/utility.js` can contain `require('relevant-npm-module')`, `require('./another_utility.js')`, or `require('./configuration.json')`.


## Benefits
1. `npm` modules in the browser (i.e., reusability!)  
    - the package looks in the `node_modules` folder for module_names
2. easy importing of static content (e.g., js, html, image, etc)
    - e.g., `require('path/to/whatever')`
    - supports relative and absolute paths
3. importing JS files does not pollute global scope
    - each js file has its own global scope
    - content is explicitly exported (CommonJS format - like used in Node.js)
        - `module.exports= ... `
4. all imported content (load and require) is stored in the same cache and is only loaded once

#### `load()`? What about `require()`?

Short Version: `require()` is available to `load()`'ed scripts.

See [this explanation](#load--vs--require) for the long version.



# Usage

### Installation
#### with npm

1. install the module
    - `npm install clientside-require --save`
2. load the module into your page
    - ```<script src = "node_modules/clientside-require/dist/bundle.js"></script>```

#### from scratch
1. copy the `/dist/bundle.js` file to your server
2. load it as any other script
    - ```<script src = "path/to/clientside-require/dist/bundle.js"></script>```


### Initialization

If you intend to use node modules, please read this [configuration detail](#node_modules) to ensure the module works in all contexts. Otherwise, everything is setup by default already.

# Examples

### Loading NPM Modules
This package enables utilizing `npm` for clientside development. The node modules you `npm install` all the time can be utilized out of the box:

```js
load("qs") // asynchronously load a node module by module name; module was installed with `npm install qs`
    .then((qs)=>{
        var query_string = qs.stringify({foo:bar}); // foo=bar
    })
```

or


```js
load("color-name")
    .then((color_name)=>{
        console.log(color_name.blue); // outputs  [0, 0, 255]
    })
```

### Loading JS files
In addition, you can load your own JS content into the browser without polluting the global scope:
```js
load("./util.js") // require a js file with a relative path
    .then((exports)=>{
        exports.awesome_functionality(); // where `exports` is defined by `model.exports` in `util.js`
    })
```

### Loading static content
Further we can import any file type  (e.g., `js`, `json`, `html`, `css`, `txt`, etc):

```js
load("/path/to/config.json") // get contents of a json file file with an absolute path
    .then((html)=>{
        console.log(html)
    })
```

### Utilizing `require()` in JS scripts
If we load a JS script with `load()`, we can use `require()` statements (in addition to `load()` statements) in the script. This allows us to write functionality just as we would on the serverside with node.js:

`random_name_generator.js`:
```js
var list_of_names = require("./list_of_names.json");
var random_selector = require("./random_selector.js");
var random_name = random_selector.select(list_of_names);
module.exports = random_name;
```

`index.html`:
```js
load("/path/to/random_name_generator.js")
    .then((random_name)=>{
        console.log(random_name)
    })
```

### Creating a view element with [`clientside-view-loader`](https://github.com/uladkasach/clientside-view-loader)
*This uses the [clientside-view-modal-login_signup](https://github.com/uladkasach/clientside-view-modal-login_signup) npm package. **Use the repo as an example for how you can create your own view module!***
```sh
npm install clientside-view-modal-login_signup
```
```js
load("clientside-view-loader")
    .then(view=>view.load("clientside-view-modal-login_signup").generate())
    .then((dom)=>{
        document.body.appendChild(dom); // append the dom to the document body
        dom.show("login"); // display the login view
    })
```
generates a fully functional one of these:

![screenshot_2018-02-10_15-42-31](https://user-images.githubusercontent.com/10381896/36066524-0dc14f7a-0e79-11e8-86c5-10a10b695185.png)






# Technical Overview

### load() -vs- require()

Browsers do not permit dynamic synchronous loading as it as it ruins user experience. The only way to dynamically load a file into a web page requires asynchronous operations. The `load` method loads content in this way and returns a promise that resolves with the requested content.

When a script is `load()`'ed, we give it the `require()` method as the clientside-require module reads the file in advance, loads all of the `require()`'ed dependencies, and only after loading the dependencies does it load the target script. By doing so, all of the dependencies are available by the time the script needs them.

This allows us, after `load()`ing, to use the synchronous `require()` function in the browser.

### caching requests
All `require`'ed modules are cached to eliminate duplicate requests. The `require` function is injected into loaded scripts (e.g., module scripts) so that the cache is maintained in every file and module loaded.



### Paths

The `request` argument in `require(request)` and `load(request)` expects an absolute path,  a relative path, or a node_module name.

For the following examples, lets assume the following directory structure:
```
awesome_directory/
    awesome_file.js
    awesome_helper.js
node_modules/
    clientside-view-loader/
root.html
```

##### absolute path
Absolute paths operate exactly as one would expect. A request to retrieve the file will be sent directly to that path.
```js
// inside `root.html`
require("/awesome_directory/awesome_file.js")
    .then((exports)=>{/* ...magic... */})
```

##### relative path
Relative paths operate exactly like you would expect, too! The `require()` function utilizes the `clientside-require` to keep track of the `path` to each file its loaded in.

Not only can you do this:
```js
// inside `root.html`
require("./awesome_directory/awesome_file.js")
    .then((exports)=>{/* ...magic... */})
```

But inside `awesome_directory/awesome_file.js`, which is eventually loaded by `root.html`, we can do this:

```js
// inside awesome_directory/awesome_file.js
require("./awesome_helper.js")
    .then((helper_exports)=>{ /* ... use the other scripts for even more magic ... */ })
```

##### node_module name

The `require(request)` function will assume any `request` that does not start with "/" and has no file extension is a `node_module` name. It will:
1. find the root of the `node_module` by utilizing the [`node_module_root`](#node_modules)
2. parse the `package.json` file to find the `main` script
3. load the main script


### Supported Files
The `require()` loader is capable of loading `html`, `css`, `json`, `txt`, and `js`. Notably for `js` we load the contents of the script without polluting the global scope.

##### comments on importing `js`
The content returned from a `js` file is what is included in the `module.exports` object. This is in line with what one would expect with if they worked with node modules.

The way that the `clientside-require` imports `js` enables the user to protect the global scope. By loading the script into an iframe and extracting the `module.exports` object from the iframe we protect the global scope from any global variable definitions that may exist in the target `js` script.

##### comments on importing `css`
As there is no way to provide scoping for `css`, `css` is loaded directly into the main window with global scope.


# Configuration

### node_modules


By default, the `clientside-require` expects the `node_modules` directory to be in the same directory as the file it is loaded in e.g.:
```
node_modules/
this_file.html
```
in this case (above) it will work by default.


If your `node_modules` is ***not*** in the same directory as the file that the `clientside-require` is loaded you, e.g.:
```
node_modules/
a_directory/
    this_file.html
```

 you will need to define the path to the `node_modules` directory by defining `window.node_modules_root`, e.g.:
```js
    window.node_modules_root = '/../node_modules' // if node_modules is in parent directory of this file's directory
```

**This must be defined before you load the `clientside-require` script.**



### Restrictions

#### scope
Note, scope goes two ways. Not only does the namespace that you load not enter the main window, the namespace of the main window does not enter the namespace that you load. E.g., the clientside-require passes a reference to console so that it can output to the main window console and not an unreachable console.


# Example Native Packages
npm packages written for the browser utilizing `clientside-require`:
- [clientside-view-loader](https://github.com/uladkasach/clientside-view-loader)
- [clientside-view-button](https://github.com/uladkasach/clientside-view-button)
- [clientside-request](https://github.com/uladkasach/clientside-request) - mimics the npm `request` package for the browser
