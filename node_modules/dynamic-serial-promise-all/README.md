# dynamic-serial-promise-all
Promise.all() for the senario where serially dependent promises are dynamically defined

# Use Case
This module is helpful in cases where we wish to wait for a dynamically dependent promise. In other words, when we have a set of promises that are dependent on an initial promise (or set of initial promises) and **must** be defined dynamically (the dependent promises can not be returned in the promise chains).

# Usage
```js
    var promise_all_manager = new (require("dynamic-serial-promise-all"))();
    promise_all_manager.wait_for(initial_promise);
    initial_promise.then(()=>{
        /* ... logic ... */
        promise_all_manager.wait_for(dependent_promise);
    })
    promise_all_manager.promise_all.then(()=>{
        console.log("all have been loaded!");
    })
```

*See the `/test` directory for specific examples*

# Overview
- handles situations where we want to wait for a dynamic amount of serially dependent processes
- since we do not know in advance what processes we will want to wait for after a prior process resolves, we will have to "re-check" the promise list
    - recheck :
        - after original promises resolve
        - if on recheck all promises resolve, wait another 100microseconds and recheck
        - if second recheck succeeds, then we can be fairly confident we are done
