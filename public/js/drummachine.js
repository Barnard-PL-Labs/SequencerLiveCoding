const beatMod = require('./beat')
const synthMod = require('./synthesis')
const drawMod = require('./draw')
const kitMod = require('./kit')
const impulseMod = require('./impulse')
const handlersMod = require('./handlers')
const playMod = require('./play')
const slidersMod = require('./sliders')

// Events
// init() once the page has finished loading.
//window.onload = init;


var context; exports.context = context;
var convolver; exports.convolver = convolver;
var compressor; exports.compressor = compressor;
var masterGainNode; exports.masterGainNode = masterGainNode;
var effectLevelNode; exports.effectLevelNode = effectLevelNode;
var filterNode; exports.filterNode = filterNode;


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
        loadBeat(beatMod.beatDemo[1]);

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
    context = new AudioContext(); exports.context = context;

    var finalMixNode;
    if (context.createDynamicsCompressor) {
        // Create a dynamics compressor to sweeten the overall mix.
        compressor = context.createDynamicsCompressor();
        compressor.connect(context.destination);
        finalMixNode = compressor;
    } else {
        // No compressor available in this implementation.
        finalMixNode = context.destination;
    }

    // create master filter node
    filterNode = context.createBiquadFilter();
    filterNode.type = "lowpass";
    filterNode.frequency.value = 0.5 * context.sampleRate;
    filterNode.Q.value = 1;
    filterNode.connect(finalMixNode);

    // Create master volume.
    masterGainNode = context.createGain();
    masterGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
    masterGainNode.connect(filterNode);

    // Create effect volume.
    effectLevelNode = context.createGain();
    effectLevelNode.gain.value = 1.0; // effect level slider controls this
    effectLevelNode.connect(masterGainNode);

    // Create convolver for effect
    convolver = context.createConvolver();
    convolver.connect(effectLevelNode);

    exports.filterNode = filterNode;
    exports.finalMixNode = finalMixNode;
    exports.compressor = compressor;
    exports.masterGainNode = masterGainNode;
    exports.effectLevelNode = effectLevelNode;
    exports.convolver = convolver;

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

    handlersMod.setTimerWorker(tmp)

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







function setEffect(index) {
    if (index > 0 && !impulseMod.impulseResponseList[index].isLoaded()) {
        alert('Sorry, this effect is still loading.  Try again in a few seconds :)');
        return;
    }

    beatMod.setBeatEffectIndex(index)
    impulseMod.setEffectDryMix(impulseMod.impulseResponseInfoList[index].dryMix);
    impulseMod.setEffectWetMix(impulseMod.impulseResponseInfoList[index].wetMix);
    convolver.buffer = impulseMod.impulseResponseList[index].buffer;

  // Hack - if the effect is meant to be entirely wet (not unprocessed signal)
  // then put the effect level all the way up.
    if (impulseMod.effectDryMix == 0)
        beatMod.setBeatEffectMix(1);

    setEffectLevel(beatMod.theBeat);
    slidersMod.sliderSetValue('effect_thumb', beatMod.theBeat.effectMix);
    drawMod.updateControls();

    document.getElementById('effectname').innerHTML = impulseMod.impulseResponseInfoList[index].name;
}
exports.setEffect = setEffect;

function setEffectLevel() {
    // Factor in both the preset's effect level and the blending level (effectWetMix) stored in the effect itself.
    effectLevelNode.gain.value = beatMod.theBeat.effectMix * impulseMod.effectWetMix;
    exports.effectLevelNode = effectLevelNode;
}
exports.setEffectLevel = setEffectLevel;


function loadBeat(beat) {
    // Check that assets are loaded.
    if (beat != beatMod.beatReset && !beat.isLoaded())
        return false;

    handlersMod.handleStop();

    beatMod.setBeat(beatMod.cloneBeat(beat));
    kitMod.setCurrentKit(kitMod.kits[beatMod.theBeat.kitIndex]);
    setEffect(beatMod.theBeat.effectIndex);

    // apply values from sliders
    slidersMod.sliderSetValue('effect_thumb', beatMod.theBeat.effectMix);
    slidersMod.sliderSetValue('kick_thumb', beatMod.theBeat.kickPitchVal);
    slidersMod.sliderSetValue('snare_thumb', beatMod.theBeat.snarePitchVal);
    slidersMod.sliderSetValue('hihat_thumb', beatMod.theBeat.hihatPitchVal);
    slidersMod.sliderSetValue('tom1_thumb', beatMod.theBeat.tom1PitchVal);
    slidersMod.sliderSetValue('tom2_thumb', beatMod.theBeat.tom2PitchVal);
    slidersMod.sliderSetValue('tom3_thumb', beatMod.theBeat.tom3PitchVal);
    slidersMod.sliderSetValue('swing_thumb', beatMod.theBeat.swingFactor);

    drawMod.updateControls();
    setActiveInstrument(0);

    return true;
}
exports.loadBeat = loadBeat;




function filterFrequencyFromCutoff( cutoff ) {
    var nyquist = 0.5 * context.sampleRate;

    // spreads over a ~ten-octave range, from 20Hz - 20kHz.
    var filterFrequency = Math.pow(2, (11 * cutoff)) * 40;

    if (filterFrequency > nyquist)
        filterFrequency = nyquist;
    return filterFrequency;
}

function setFilterCutoff( cutoff ) {
    if (filterNode){
        filterNode.frequency.value = filterFrequencyFromCutoff( cutoff );
        exports.filterNode = filterNode;
    }
}

function setFilterQ( Q ) {
    if (filterNode){
        filterNode.Q.value = Q;
        exports.filterNode = filterNode;
    }
}







//
