const beatMod = require('./beat')
const drawMod = require('./draw')
const kitMod = require('./kit')
const impulseMod = require('./impulse')
const handlersMod = require('./handlers')
const logger = require('./logger')
const playMod = require('./play')
const contextMod = require('./context')

var timeoutId;

function startLoadingAssets() {

    let tmp = new Array();

    for (i = 0; i < impulseMod.impulseResponseInfoList.length; i++) {
        tmp[i] = new impulseMod.ImpulseResponse(impulseMod.impulseResponseInfoList[i].url, i);
    }
    impulseMod.setImpulseResponseList(tmp);

    // Initialize drum kits
    var numKits = kitMod.kitName.length;
    tmp = new Array(numKits);
    for (var i = 0; i < numKits; i++) {
        tmp[i] = new kitMod.Kit(kitMod.kitName[i]);
    }
    kitMod.setKits(tmp)

    // Then load the remaining assets.
    // Note that any assets which have previously started loading will be skipped over.
    for (var i = 0; i < numKits; i++) {
        kitMod.kits[i].load();
    }

    // Start at 1 to skip "No Effect"
    for (i = 0; i < impulseMod.impulseResponseInfoList.length; i++) {
        impulseMod.impulseResponseList[i].load();
    }


    // Setup initial drumkit
    kitMod.setCurrentKit(kitMod.kits[kitMod.kInitialKitIndex]);
    beatMod.setBeat(beatMod.cloneBeat(beatMod.beatReset));
}

exports.initDrums = function (cmInstance) {


    // NOTE: THIS NOW RELIES ON THE MONKEYPATCH LIBRARY TO LOAD
    // IN CHROME AND SAFARI (until they release unprefixed)
    contextMod.setContext(new AudioContext());
    startLoadingAssets();

    var finalMixNode;
    if (contextMod.context.createDynamicsCompressor) {
        // Create a dynamics compressor to sweeten the overall mix.
        contextMod.setCompressor(contextMod.context.createDynamicsCompressor());
        contextMod.connectNodes(contextMod.compressor, contextMod.context.destination);
        finalMixNode = contextMod.compressor;
    } else {
        // No compressor available in this implementation.
        finalMixNode = contextMod.context.destination;
    }

    recorder = new WebAudioRecorder(finalMixNode, { workerDir: "js/web-audio-recorder/lib/" });

    //add buttons (start/stop, play, save)
    const recordButton = document.querySelector('.record-button');
    const playButton = document.querySelector('.play-button');
    const saveButton = document.querySelector('.save-button');
    //var pressed = document.querySelector(".active");

    recordButton.addEventListener('click', function () {
        recordButton.classList.toggle('active');
        txtChange();

        if (recorder.isRecording()) {
            recorder.finishRecording();
            playButton.classList.add('show')
            saveButton.classList.add('show')
        }
        else {
            recorder.startRecording();
            playButton.classList.remove('show')
            saveButton.classList.remove('show')
        }
    });

    playButton.addEventListener('click', function () {
        recordedAudio.play()
    });

    playButton.addEventListener('keyup', event => {
      if (event.key === ' ' && event.target === document.body) {
        event.preventDefault();
        recordedAudio.play()
        console.log('Space pressed')
      }
    });

    saveButton.addEventListener('click', function () {
        var au = document.createElement('audio');
        var li = document.createElement('li');
        var link = document.createElement('a');

        //name of .wav file to use during upload and download
        var filename = new Date().toISOString();

        //add controls to the <audio> element
        au.controls = true;
        au.src = recordedAudio.src;

        //save to disk link
        link.href = recordedAudio;
        link.download = filename + ".wav"; //download forces the browser to donwload the file using the  filename

        //add the new audio element to li
        li.appendChild(au);

        //add the filename to the li
        li.appendChild(document.createTextNode(filename + ".wav "))

        //add the save to disk link to li
        li.appendChild(link);

        //add the li element to the ol
        recordingsList.appendChild(li);
    });

    function txtChange() {
        if (document.getElementById("recBtn").innerHTML == "Record Sound") {
            document.getElementById("recBtn").innerHTML = "Stop Recording";
        }
        else {
            document.getElementById("recBtn").innerHTML = "Record Sound";
        }
    }


    // create master filter node
    let tmp = contextMod.context.createBiquadFilter();
    tmp.type = "lowpass";
    tmp.frequency.value = 0.5 * contextMod.context.sampleRate;
    tmp.Q.value = 1;
    contextMod.setFilterNode(tmp);
    contextMod.connectNodes(contextMod.filterNode, finalMixNode);

    // Create master volume.
    tmp = contextMod.context.createGain();
    tmp.gain.value = 0.7; // reduce overall volume to avoid clipping
    contextMod.setMasterGainNode(tmp);
    contextMod.connectNodes(contextMod.masterGainNode, contextMod.filterNode);

    // Create effect volume.
    tmp = contextMod.context.createGain();
    tmp.gain.value = 1.0; // effect level slider controls this
    contextMod.setEffectLevelNode(tmp);
    contextMod.connectNodes(contextMod.effectLevelNode, contextMod.masterGainNode);

    // Create convolver for effect
    tmp = contextMod.context.createConvolver();
    contextMod.setConvolver(tmp);
    contextMod.connectNodes(contextMod.convolver, contextMod.effectLevelNode);


    var elKitCombo = document.getElementById('kitcombo');
    elKitCombo.addEventListener("mousedown", handlersMod.handleKitComboMouseDown, true);

    var elEffectCombo = document.getElementById('effectcombo');
    elEffectCombo.addEventListener("mousedown", handlersMod.handleEffectComboMouseDown, true);

    document.body.addEventListener("mousedown", handlersMod.handleBodyMouseDown, true);

    document.body.addEventListener("keydown", logger.logKeyEvent, true);
    document.body.addEventListener("mousedown", logger.logMouseEvent, true);

    var timerWorkerBlob = new Blob([
        "var timeoutID=0;function schedule(){timeoutID=setTimeout(function(){postMessage('schedule'); schedule();},100);} onmessage = function(e) { if (e.data == 'start') { if (!timeoutID) schedule();} else if (e.data == 'stop') {if (timeoutID) clearTimeout(timeoutID); timeoutID=0;};}"]);

    // Obtain a blob URL reference to our worker 'file'.
    var timerWorkerBlobURL = window.URL.createObjectURL(timerWorkerBlob);

    timerWorker = new Worker(timerWorkerBlobURL);
    timerWorker.onmessage = function (e) {
        playMod.schedule();
    };
    timerWorker.postMessage('init'); // Start the worker.

    initControls(timerWorker);
    drawMod.updateControls();

}

function initControls(timerWorker) {
    // Initialize note buttons
    initButtons();
    makeKitList();
    makeEffectList();

    function setMouseDownHandler(elemId, handlerFxn) {
        document.getElementById(elemId).addEventListener('mousedown', handlerFxn, true)
    }
    function seDoubleClickHandler(elemId, handlerFxn) {
        document.getElementById(elemId).addEventListener('dblclick', handlerFxn, true)
    }
    // sliders
    sliderIdNames = ['effect_thumb', 'track1_thumb', 'track2_thumb', 'track3_thumb', 'track4_thumb', 'track5_thumb', 'track6_thumb', 'swing_thumb']
    sliderIdNames.map(idName => setMouseDownHandler(idName, handlersMod.handleSliderMouseDown));
    sliderIdNames.map(idName => seDoubleClickHandler(idName, handlersMod.handleSliderDoubleClick));

    // tool buttons
    setMouseDownHandler('play', ev => handlersMod.handlePlay(timerWorker, ev));
    setMouseDownHandler('stop', ev => handlersMod.handleStop(timerWorker, ev));
    setMouseDownHandler('save', handlersMod.handleSave);
    setMouseDownHandler('save_ok', handlersMod.handleSaveOk);
    setMouseDownHandler('load', handlersMod.handleLoad);
    setMouseDownHandler('load_ok', handlersMod.handleLoadOk);
    setMouseDownHandler('load_cancel', handlersMod.handleLoadCancel);
    setMouseDownHandler('reset', handlersMod.handleReset);
    setMouseDownHandler('tempoinc', beatMod.tempoIncrease);
    setMouseDownHandler('tempodec', beatMod.tempoDecrease);

    demos = ['demo1', 'demo2', 'demo3', 'demo4', 'demo5']
    demos.map(demoName => setMouseDownHandler(demoName, handlersMod.handleDemoMouseDown));

    var elBody = document.getElementById('body');

    elBody.addEventListener('mousemove', handlersMod.handleMouseMove, true);
    elBody.addEventListener('mouseup', handlersMod.handleMouseUp, true);

    var standardView = document.getElementById('standardView');
    var liveCodingView = document.getElementById('liveCodingView');
    var drumRackView = document.getElementById('drumRackView');

    standardView.addEventListener('click', function () { stateInterface('standardView') });
    liveCodingView.addEventListener('click', function () { stateInterface('liveCodingView') });
    drumRackView.addEventListener('click', function () { stateInterface('drumRackView') });

}

//var stateInterface = function(state){return state;}

var storestate = 'test';


function stateInterface(state) {
    storestate = state;
    var x = document.getElementById("liveCodeWindow");
    if (storestate == 'drumRackView') {
        x.style.visibility = "hidden";
    } else {
        x.style.visibility = "visible";
    }
    var buttonDiv = document.getElementById("pad")
    if (storestate == "liveCodingView") {
        buttonDiv.style.visibility = "hidden";
    } else {
        buttonDiv.style.visibility = "visible";
    }
}

function getStoreState() {
    console.log("getter: ", storestate);
    return storestate;
}

function initButtons() {
    var elButton;

    for (i = 0; i < beatMod.loopLength; ++i) {
        for (j = 0; j < kitMod.kNumInstruments; j++) {
            elButton = document.getElementById(kitMod.instruments[j] + '_' + i);
            elButton.addEventListener("mousedown", handlersMod.handleButtonMouseDown, true);
        }
    }
}

function makeEffectList() {
    var elList = document.getElementById('effectlist');
    var numEffects = impulseMod.impulseResponseInfoList.length;


    var elItem = document.createElement('li');
    elItem.innerHTML = 'None';
    elItem.addEventListener("mousedown", handlersMod.handleEffectMouseDown, true);

    for (var i = 0; i < numEffects; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = impulseMod.impulseResponseInfoList[i].name;
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handlersMod.handleEffectMouseDown, true);
    }
}

function makeKitList() {
    var elList = document.getElementById('kitlist');
    var numKits = kitMod.kitName.length;

    for (var i = 0; i < numKits; i++) {
        var elItem = document.createElement('li');
        elItem.innerHTML = kitMod.kitNamePretty[i];
        elList.appendChild(elItem);
        elItem.addEventListener("mousedown", handlersMod.handleKitMouseDown, true);
    }
}

exports.getStoreState = getStoreState;
//
