
var isWanted = false
window.onerror = function(msg){
	if(isWanted){
		window.postMessage({
			direction: "from-page-runscript",
			result: msg
		}, "*");
		isWanted = false;
	}
};
window.addEventListener("message", function(event) {
	if (event.source == window && event.data && event.data.direction == "from-content-runscript") {
		isWanted = true;
		var doc = window.document;
		var scriptTag = doc.createElement("script");
		scriptTag.type = "text/javascript"
		scriptTag.text = event.data.script;
		doc.body.appendChild(scriptTag);
	}
});
