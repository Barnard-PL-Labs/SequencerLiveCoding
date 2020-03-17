process.env.src_root = __dirname + "/../src";
var sleep = function(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }
var assert = require("assert");

describe('syntax', function(){
    it("should load", function(){
        var Dynamic_Serial_Promise_All = require(process.env.src_root);
    })
    it("should initialize", function(){
        var promise_all_manager = new (require(process.env.src_root))();
    })
})

describe('basics', function(){
    it('should be able to add promise to promise list with wait_for', function(){
        var promise_all_manager = new (require(process.env.src_root))();
        promise_all_manager.wait_for(Promise.resolve(true));
        assert.equal(promise_all_manager.promise_list.length, 1);
    })
    it('should be able to generate a promise_all promise', function(){
        var promise_all_manager = new (require(process.env.src_root))();
        promise_all_manager.wait_for(Promise.resolve(true));
        assert.equal(promise_all_manager.promise_list.length, 1);
    })
    it('should be able to reset the promise list', function(){
        var promise_all_manager = new (require(process.env.src_root))();
        assert.equal(promise_all_manager.promise_list.length, 0, "ensure at beginning promise list length is zero");
        promise_all_manager.wait_for(Promise.resolve(true));
        assert.equal(promise_all_manager.promise_list.length, 1, "ensure after loading promise list length is one");
        promise_all_manager.reset();
        assert.equal(promise_all_manager.promise_list.length, 0, "ensure after reseting promise list length is zero")
    })
})
describe('cases', function(){
    it('should handle slow dependent processes', async function(){
        var promise_all_manager = new (require(process.env.src_root))();

        // define list that will be used to track order of promise resolution
        var resolution_list = [];

        // define initial promise
        var initial_promise = sleep(500).then(()=>{
            var identifier = "initial";
            resolution_list.push(identifier);
            return identifier;
        });

        // define dependent promise
        initial_promise.then(()=>{
            var dependent_promise = sleep(100).then(()=>{
                var identifier = "dep_1";
                resolution_list.push(identifier);
                return identifier;
            });
            promise_all_manager.wait_for(dependent_promise);
        })

        // add initial promise to waiting list
        promise_all_manager.wait_for(initial_promise);

        // wait for promises to resolve
        var result = await promise_all_manager.promise_all;

        // analyze results
        assert.equal(result.length, 2);
        assert.equal(result[0], "initial");
        assert.equal(result[1], "dep_1");
        assert.equal(resolution_list.length, 2);
        assert.equal(resolution_list[0], "initial");
        assert.equal(resolution_list[1], "dep_1");
    })
    it('should handle fast dependent processes', async function(){
        var promise_all_manager = new (require(process.env.src_root))();

        // define list that will be used to track order of promise resolution
        var resolution_list = [];

        // define initial promise
        var initial_promise = Promise.resolve().then(()=>{
            var identifier = "initial";
            resolution_list.push(identifier);
            return identifier;
        });

        // define dependent promise
        initial_promise.then(()=>{
            var dependent_promise = Promise.resolve().then(()=>{
                var identifier = "dep_1";
                resolution_list.push(identifier);
                return identifier;
            });
            promise_all_manager.wait_for(dependent_promise);
        })

        // add initial promise to waiting list
        promise_all_manager.wait_for(initial_promise);

        // wait for promises to resolve
        var result = await promise_all_manager.promise_all;

        // analyze results
        assert.equal(result.length, 2);
        assert.equal(result[0], "initial");
        assert.equal(result[1], "dep_1");
        assert.equal(resolution_list.length, 2);
        assert.equal(resolution_list[0], "initial");
        assert.equal(resolution_list[1], "dep_1");
    })
    it('should handle fast-slow dependent processes', async function(){
        var promise_all_manager = new (require(process.env.src_root))();

        // define list that will be used to track order of promise resolution
        var resolution_list = [];

        // define initial promise
        var initial_promise = Promise.resolve().then(()=>{
            var identifier = "initial";
            resolution_list.push(identifier);
            return identifier;
        });

        // define dependent promise
        initial_promise.then(()=>{
            var dependent_promise = sleep(200).then(()=>{
                var identifier = "dep_1";
                resolution_list.push(identifier);
                return identifier;
            });
            promise_all_manager.wait_for(dependent_promise);
        })

        // add initial promise to waiting list
        promise_all_manager.wait_for(initial_promise);

        // wait for promises to resolve
        var result = await promise_all_manager.promise_all;

        // analyze results
        assert.equal(result.length, 2);
        assert.equal(result[0], "initial");
        assert.equal(result[1], "dep_1");
        assert.equal(resolution_list.length, 2);
        assert.equal(resolution_list[0], "initial");
        assert.equal(resolution_list[1], "dep_1");
    })
    it('should handle fast-slow-slow dependent processes', async function(){
        var promise_all_manager = new (require(process.env.src_root))();

        // define list that will be used to track order of promise resolution
        var resolution_list = [];

        // define initial promise
        var initial_promise = Promise.resolve().then(()=>{
            var identifier = "initial";
            resolution_list.push(identifier);
            return identifier;
        });

        // define dependent promise
        initial_promise.then(()=>{
            var dependent_promise = sleep(200).then(()=>{
                var identifier = "dep_1";
                resolution_list.push(identifier);
                return identifier;
            });
            dependent_promise.then(()=>{
                var dependent_promise_2 = sleep(200).then(()=>{
                    var identifier = "dep_2";
                    resolution_list.push(identifier);
                    return identifier;
                })
                promise_all_manager.wait_for(dependent_promise_2);
            })
            promise_all_manager.wait_for(dependent_promise);
        })

        // add initial promise to waiting list
        promise_all_manager.wait_for(initial_promise);

        // wait for promises to resolve
        var result = await promise_all_manager.promise_all;

        // analyze results
        assert.equal(result.length, 3);
        assert.equal(result[0], "initial");
        assert.equal(result[1], "dep_1");
        assert.equal(result[2], "dep_2");
        assert.equal(resolution_list.length, 3);
        assert.equal(resolution_list[0], "initial");
        assert.equal(resolution_list[1], "dep_1");
        assert.equal(resolution_list[2], "dep_2");
    })
})
