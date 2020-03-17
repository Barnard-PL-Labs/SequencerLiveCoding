
WebMidi.enable(function (err) {
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);
    var output = WebMidi.outputs[1];
    output.playNote("C5",1,{duration:100});
    output.playNote("E5",1,{duration:100});
    output.playNote("G5",1,{duration:100,time:"+100"});

    var input = WebMidi.inputs[1];
 
    input.addListener('noteon', "all", function(e) {
       console.log("Pitch value: " + e.note.number);
    });

    var deltas = new Array(100);
    var last = 0
    input.addListener('clock', "all", function(e) {
       delta = e.timestamp - last
       last = e.timestamp  
       deltas.push(delta);
       deltas.shift();
       console.log("time: " + (Math.max(...deltas) - Math.min(...deltas)));
    });

});

