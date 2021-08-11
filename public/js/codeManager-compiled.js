

window.onload = function() {

var myCodeMirror = CodeMirror.fromTextArea( document.getElementById("codingWindow"),
	{
	lineNumbers: true, 
	mode:  "javascript"
	}).setValue('var msg = "Hi";');
};




},{}]},{},[1]);
