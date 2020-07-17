# Live Coding Sequencers

Live Coding for the Novation Circuit

This is a live programming-by-demonstration system for use with a hardware sequencer (though a in-browser software sequencer is provided for your convenience). Playing a hardware sequencer is similar to live coding in that it constructively builds a piece from a blank loop. However the interface of a sequencer does not allow for algorithmic changes (e.g. shift all notes by one beat, or every other note up a half step). The goal of this project is to augment the direct physical sensation of the hardware interface with the flexibility of code (or, to augment the virtual with the physical).

The overall flow is that as a performer can construct a loop on the sequencer manually, and the system continuously synthesizes code that generates the current pattern. The performer can edit this code and push the changes back to the hardware sequencer, which then changes its pattern to reflect the code. As the pattern changes on the physical device, the code is again synthesized and automatically updated.

The implementation so far is using a software sequencer that can be controlled with a Livid Instruments CNTRLR. Since I don't have a Livid Instruments CNTRLR, support for the Novation Circuit (which I do have) should be coming soon. For now, the software interface gives a nice mock experience.

Synthesis uses an SyGuS solver called CVC4 (which is more generally an SMT solver). This allows us to automatically construct code that fits the pattern at any given time.

# install
to build, first

   browserify public/js/main.js -o public/js/compiled.js

this turns the js file into one that can run client-side in-browser by inlining all the necessary npm modules.
Synthesis uses the SMT solver CVC4 (which is a crazy optimized behemoth of C code), so needs to run server side.
First download the latest copy of CVC4, put the executable in your path, then to start the server

   node app.js
