#Synthesis Enabled Live Coding

Try it live here: http://161.35.14.211

This is a live programming-by-demonstration system for live coding music.

Read the papers here:

- [Human-in-the-Loop Program Synthesis for Live Coding](http://www.marksantolucito.com/papers/farm2021.pdf)
- [Demo: Synthesis-Enabled Live Coding on the Web](http://www.marksantolucito.com/papers/plie2021.pdf)

#Hardware

One goal is to use this with a hardware sequencer (though a in-browser software sequencer is provided for your convenience). Playing a hardware sequencer is similar to live coding in that it constructively builds a piece from a blank loop. However the interface of a sequencer does not allow for algorithmic changes (e.g. shift all notes by one beat, or every other note up a half step). The goal of this project is to augment the direct physical sensation of the hardware interface with the flexibility of code (or, to augment the virtual with the physical).

The overall flow is that as a performer can construct a loop on the sequencer manually, and the system continuously synthesizes code that generates the current pattern. The performer can edit this code and push the changes back to the hardware sequencer, which then changes its pattern to reflect the code. As the pattern changes on the physical device, the code is again synthesized and automatically updated.

The implementation so far is using a software sequencer that can be controlled with a Livid Instruments CNTRLR. Since I don't have a Livid Instruments CNTRLR, support for the Novation Circuit (which I do have) should be coming soon. For now, the software interface gives a nice mock experience.

Synthesis uses an SyGuS solver called CVC4 (which is more generally an SMT solver). This allows us to automatically construct code that fits the pattern at any given time.

# install

First clone this repo:

    git clone https://github.com/santolucito/SequencerLiveCoding
    cd SequencerLiveCoding

The app uses node, you will need to install that using the following command (on linux, if you are on mac you will use a different install process)

    sudo apt install nodejs

you will also need the awk-sdk npm package installed, as on prod at least, we call a serverless function on aws to run cvc5.
If you don't want to use this you still need to install it, but dont need to do anything else.
if you do want to call the serverless function, you will need the credentials - reach out to @santolucito for that.
  
   sudo npm install aws-sdk 

We use browserify to "compile" the node code so that it can run client-side. This way,
even if you lose your connection to the internet in the middle of a set, the system doesnt completely crash and still can play the beat.

    sudo npm install -g browserify
    browserify public/js/main.js -o public/js/compiled.js

Synthesis uses the SMT solver CVC5 (which is a crazy optimized behemoth of C code), so needs to run server side. You can download the binary from the CVC5 github page https://github.com/cvc5/cvc5/releases/). The tool expects the executable to be named cvc5 and be in /usr/local/bin/. You will also need chmod a+x to change permissions of the executable. If you are working on a Mac, this instructions will be a bit different.

    sudo mv cvc5Linux /usr/local/bin/cvc5 # the name of your download might be different!
    sudo chmod a+x /usr/local/bin/cvc5

Then install everything

    npm install

To deploy (either locally, or on a server), first run the setup.sh script.
Passing dev will setup to serve on port 3000
Passing prod will server on por 80 (along with suppressing some logging info)
Passing serverless as a second option wlll use aws lambda for CVC5 
any other second option (e.g. local) will use a local install of CVC5

    ./setup.sh #to deploy locally
    ./setup.sh prod #to deploy on a production server 
    ./setup.sh dev serverless #to deploy locally with serverless CVC5
    ./setup.sh prod serverless #to deploy on prod with serverless CVC5 (prod always runs serverless)

# TODOs

see issues on github
