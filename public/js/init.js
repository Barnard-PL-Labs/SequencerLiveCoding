const beatMod = require('./beat')
const synthMod = require('./synthesis')
const drawMod = require('./draw')
const kitMod = require('./kit')
const impulseMod = require('./impulse')
const handlersMod = require('./handlers')
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
    for (var i  = 0; i < numKits; i++) {
        tmp[i] = new kitMod.Kit(kitMod.kitName[i]);
    }
    kitMod.setKits(tmp)

    // Start loading the assets used by the presets first, in order of the presets.
    for (var demoIndex = 0; demoIndex < 5; ++demoIndex) {
        var effect = impulseMod.impulseResponseList[beatMod.beatDemo[demoIndex].effectIndex];
        var kit = kitMod.kits[beatMod.beatDemo[demoIndex].kitIndex];

        // These effects and kits will keep track of a particular demo, so we can change
        // the loading status in the UI.
        effect.setDemoIndex(demoIndex);
        kit.setDemoIndex(demoIndex);

        effect.load();
        kit.load();
    }

    // Then load the remaining assets.
    // Note that any assets which have previously started loading will be skipped over.
    for (var i  = 0; i < numKits; i++) {
        kitMod.kits[i].load();
    }

    // Start at 1 to skip "No Effect"
    for (i = 1; i < impulseMod.impulseResponseInfoList.length; i++) {
        impulseMod.impulseResponseList[i].load();
    }

    // Setup initial drumkit
    kitMod.setCurrentKit(kitMod.kits[kitMod.kInitialKitIndex]);
}

function demoButtonURL(demoIndex) {
    var n = demoIndex + 1;
    var demoName = "demo" + n;
    var url = "images/btn_" + demoName + ".png";
    return url;
}

// This gets rid of the loading spinner in each of the demo buttons.
function showDemoAvailable(demoIndex /* zero-based */) {
    var url = demoButtonURL(demoIndex);
    var n = demoIndex + 1;
    var demoName = "demo" + n;
    var demo = document.getElementById(demoName);
    demo.src = url;

    // Enable play button and assign it to demo 2.
    if (demoIndex == 1) {
        showPlayAvailable();
        handlersMod.loadBeat(beatMod.beatDemo[1]);

    // Uncomment to allow autoplay
    //     handlePlay();
    }
}

// This gets rid of the loading spinner on the play button.
function showPlayAvailable() {
    var play = document.getElementById("play");
    play.src = "images/btn_play.png";
}

exports.initDrums = function(cmInstance) {
    synthMod.setCMInstance(cmInstance);

    // Let the beat demos know when all of their assets have been loaded.
    // Add some new methods to support this.
    for (var i = 0; i < beatMod.beatDemo.length; ++i) {
        beatMod.beatDemo[i].index = i;
        beatMod.beatDemo[i].isKitLoaded = false;
        beatMod.beatDemo[i].isEffectLoaded = false;

        beatMod.beatDemo[i].setKitLoaded = function() {
            this.isKitLoaded = true;
            this.checkIsLoaded();
        };

        beatMod.beatDemo[i].setEffectLoaded = function() {
            this.isEffectLoaded = true;
            this.checkIsLoaded();
        };

        beatMod.beatDemo[i].checkIsLoaded = function() {
            if (this.isLoaded()) {
                showDemoAvailable(this.index);
            }
        };

        beatMod.beatDemo[i].isLoaded = function() {
            return this.isKitLoaded && this.isEffectLoaded;
        };
    }

    startLoadingAssets();

    // NOTE: THIS NOW RELIES ON THE MONKEYPATCH LIBRARY TO LOAD
    // IN CHROME AND SAFARI (until they release unprefixed)
    contextMod.setContext(new AudioContext());

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

    initControls();
    drawMod.updateControls();

    var timerWorkerBlob = new Blob([
        "var timeoutID=0;function schedule(){timeoutID=setTimeout(function(){postMessage('schedule'); schedule();},100);} onmessage = function(e) { if (e.data == 'start') { if (!timeoutID) schedule();} else if (e.data == 'stop') {if (timeoutID) clearTimeout(timeoutID); timeoutID=0;};}"]);

    // Obtain a blob URL reference to our worker 'file'.
    var timerWorkerBlobURL = window.URL.createObjectURL(timerWorkerBlob);

    tmp = new Worker(timerWorkerBlobURL);
    tmp.onmessage = function(e) {
      playMod.schedule();
    };
    tmp.postMessage('init'); // Start the worker.
    handlersMod.setTimerWorker(tmp);

}

function initControls() {
    // Initialize note buttons
    initButtons();
    makeKitList();
    makeEffectList();

    // sliders
    document.getElementById('effect_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);
    document.getElementById('tom1_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);
    document.getElementById('tom2_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);
    document.getElementById('tom3_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);
    document.getElementById('hihat_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);
    document.getElementById('snare_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);
    document.getElementById('kick_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);
    document.getElementById('swing_thumb').addEventListener('mousedown', handlersMod.handleSliderMouseDown, true);

    document.getElementById('effect_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);
    document.getElementById('tom1_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);
    document.getElementById('tom2_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);
    document.getElementById('tom3_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);
    document.getElementById('hihat_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);
    document.getElementById('snare_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);
    document.getElementById('kick_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);
    document.getElementById('swing_thumb').addEventListener('dblclick', handlersMod.handleSliderDoubleClick, true);

    // tool buttons
    document.getElementById('play').addEventListener('mousedown', handlersMod.handlePlay, true);
    document.getElementById('stop').addEventListener('mousedown', handlersMod.handleStop, true);
    document.getElementById('save').addEventListener('mousedown', handlersMod.handleSave, true);
    document.getElementById('save_ok').addEventListener('mousedown', handlersMod.handleSaveOk, true);
    document.getElementById('load').addEventListener('mousedown', handlersMod.handleLoad, true);
    document.getElementById('load_ok').addEventListener('mousedown', handlersMod.handleLoadOk, true);
    document.getElementById('load_cancel').addEventListener('mousedown', handlersMod.handleLoadCancel, true);
    document.getElementById('reset').addEventListener('mousedown', handlersMod.handleReset, true);
    document.getElementById('demo1').addEventListener('mousedown', handlersMod.handleDemoMouseDown, true);
    document.getElementById('demo2').addEventListener('mousedown', handlersMod.handleDemoMouseDown, true);
    document.getElementById('demo3').addEventListener('mousedown', handlersMod.handleDemoMouseDown, true);
    document.getElementById('demo4').addEventListener('mousedown', handlersMod.handleDemoMouseDown, true);
    document.getElementById('demo5').addEventListener('mousedown', handlersMod.handleDemoMouseDown, true);

    var elBody = document.getElementById('body');
    elBody.addEventListener('mousemove', handlersMod.handleMouseMove, true);
    elBody.addEventListener('mouseup', handlersMod.handleMouseUp, true);

    document.getElementById('tempoinc').addEventListener('mousedown', beatMod.tempoIncrease, true);
    document.getElementById('tempodec').addEventListener('mousedown', beatMod.tempoDecrease, true);
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





//
