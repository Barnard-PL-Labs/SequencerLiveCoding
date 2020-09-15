# Live Coding Sequencers

Live Coding for the Novation Circuit

Try it live here: http://161.35.14.211:3000/

This is a live programming-by-demonstration system for use with a hardware sequencer (though a in-browser software sequencer is provided for your convenience). Playing a hardware sequencer is similar to live coding in that it constructively builds a piece from a blank loop. However the interface of a sequencer does not allow for algorithmic changes (e.g. shift all notes by one beat, or every other note up a half step). The goal of this project is to augment the direct physical sensation of the hardware interface with the flexibility of code (or, to augment the virtual with the physical).

The overall flow is that as a performer can construct a loop on the sequencer manually, and the system continuously synthesizes code that generates the current pattern. The performer can edit this code and push the changes back to the hardware sequencer, which then changes its pattern to reflect the code. As the pattern changes on the physical device, the code is again synthesized and automatically updated.

The implementation so far is using a software sequencer that can be controlled with a Livid Instruments CNTRLR. Since I don't have a Livid Instruments CNTRLR, support for the Novation Circuit (which I do have) should be coming soon. For now, the software interface gives a nice mock experience.

Synthesis uses an SyGuS solver called CVC4 (which is more generally an SMT solver). This allows us to automatically construct code that fits the pattern at any given time.

# install
The app uses node, you will need to install that first

   sudo apt install nodejs

We need some extra stuff to run client-side, to make sure the system doesnt completely crash, even if you lose your connection to the internet in the middle of a set.

   npm install -g browserify
   browserify public/js/main.js -o public/js/compiled.js

Synthesis uses the SMT solver CVC4 (which is a crazy optimized behemoth of C code), so needs to run server side. You can download using below commands, then change permissions. Make sure the cvc4 executable is in the root directory of this repo.
   
   wget https://cvc4.cs.stanford.edu/downloads/builds/x86_64-linux-opt/unstable/cvc4-2020-08-09-x86_64-linux-opt
   mv cvc4-2020-08-09-x86_64-linux-opt cvc4
   chmod u+x cvc4

Then install everything and get playing!

   npm install
   node app.js # or, on a server, nohup node app.js &

