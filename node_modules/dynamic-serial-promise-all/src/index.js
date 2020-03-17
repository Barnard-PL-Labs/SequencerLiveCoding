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
