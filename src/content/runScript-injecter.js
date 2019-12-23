
var elementForInjectingScript = document.createElement("script");
elementForInjectingScript.src = browser.runtime.getURL("page/runScript.js");
(document.head || document.documentElement).appendChild(elementForInjectingScript);

window.addEventListener("message", function(event) {
	if (event.source.top == window && event.data && event.data.direction == "from-page-runscript") {
		selenium.browserbot.runScriptResponse = true;
		selenium.browserbot.runScriptMessage = event.data.result;
	}
});