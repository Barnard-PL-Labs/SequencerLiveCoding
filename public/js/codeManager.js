

exports.bootCodeMirror = function () {

	var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("codingWindow"),
		{
			lineNumbers: true,
			mode: "javascript"
		});
	//TODO fix function header and return statement outside code window so user cannot change it, but still sees it
	myCodeMirror.setValue('function genBeat(b, s, currentTimestep){\n\n  return {beat:b, sliders:s};\n};');
	return myCodeMirror;
};



