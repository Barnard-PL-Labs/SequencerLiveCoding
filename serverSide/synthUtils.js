function zipWithIndex(xs, startIndex=0) {
    return xs.map((v, i) => [i+startIndex, v]);
}
exports.zipWithIndex = zipWithIndex;
//look for subarrays with constant values to remove these from the sygus synthesis query
function findMaxSubseq(xs) {
    var startMaxSubseq = 0;
    var endMaxSubseq = 0;
    var valMaxSubseq = xs[0];
    var startCurrentSubseq = 0;
    var endCurrentSubseq = 0;
    var valCurrentSubseq = xs[0];
    for (let i = 1; i < xs.length; i++) {
        //if another in current seq
        if (xs[i] == valCurrentSubseq) {
            endCurrentSubseq = i;
        }
        //if new seq starts, start counting new seq, and
        else {
            // if current seq is longer than max seq, save value
            if (currentIsLongerThanMax()) {
                saveCurrentAsMax();
            }
            //start counting new seq
            startCurrentSubseq = i;
            endCurrentSubseq = i;
            valCurrentSubseq = xs[i];
        }
    }
    if (currentIsLongerThanMax()) {
        saveCurrentAsMax();
    }
    return {
        "startMaxSubseq": startMaxSubseq,
        "lengthMaxSubseq": endMaxSubseq - startMaxSubseq + 1,
        "valMaxSubseq": valMaxSubseq
    };

    function saveCurrentAsMax() {
        endMaxSubseq = endCurrentSubseq;
        startMaxSubseq = startCurrentSubseq;
        valMaxSubseq = valCurrentSubseq;
    }

    function currentIsLongerThanMax() {
        return (endMaxSubseq - startMaxSubseq) <= (endCurrentSubseq - startCurrentSubseq);
    }
}
exports.findMaxSubseq = findMaxSubseq;

function countElem(v, xs) {
    return xs.filter((x) => x==v).length
}
exports.checkForSingleEdit = function(xs) {
    var counts = [0,1,2].map((x) => countElem(x, xs))
    
    if (counts.some((x) => x == 15)) {
        var hasOneChangedIndex = true;
        var fillVal = counts.indexOf(15);
        var editVal = counts.indexOf(1);
        var editLoc = xs.indexOf(editVal);
        return {"hasOneChangedIndex" : hasOneChangedIndex,
                "fillVal" : fillVal, 
                "editVal" : editVal, 
                "editLoc" : editLoc}
    }
    return {"hasOneChangedIndex": false};
}