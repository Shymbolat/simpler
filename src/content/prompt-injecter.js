
var elementForInjectingScript = document.createElement("script");
elementForInjectingScript.src = browser.runtime.getURL("page/prompt.js");
(document.head || document.documentElement).appendChild(elementForInjectingScript);


if (window === window.top) {
    window.addEventListener("message", function(event) {
        if (event.source.top == window && event.data &&
            event.data.direction == "from-page-script") {
            if (event.data.recordedType) {
                switch (event.data.recordedType) {
                    case "prompt":
                        if (event.data.recordedResult != null) {
                            recorder.record("answerOnNextPrompt", [[event.data.recordedResult]], "", true, event.data.frameLocation);
                        } else {
                            recorder.record("chooseCancelOnNextPrompt", [[""]], "", true, event.data.frameLocation);
                        }
                        recorder.record("assertPrompt", [[event.data.recordedMessage]], "", false, event.data.frameLocation);
                        break;
                    case "confirm":
                        if (event.data.recordedResult == true) {
                            recorder.record("chooseOkOnNextConfirmation", [[""]], "", true, event.data.frameLocation);
                        } else {
                            recorder.record("chooseCancelOnNextConfirmation", [[""]], "", true, event.data.frameLocation);
                        }
                        recorder.record("assertConfirmation", [[event.data.recordedMessage]], "", false, event.data.frameLocation);
                        break;
                    case "alert":
                        //record("answerOnNextAlert",[[event.data.recordedResult]],"",true);
                        recorder.record("assertAlert", [[event.data.recordedMessage]], "", false, event.data.frameLocation);
                        break;
                }
            }
            if (event.data.response) {
                switch (event.data.response) {
                    case "prompt":
                        selenium.browserbot.promptResponse = true;
                        if (event.data.value)
                            selenium.browserbot.promptMessage = event.data.value;
                        break;
                    case "confirm":
                        selenium.browserbot.confirmationResponse = true;
                        if (event.data.value)
                            selenium.browserbot.confirmationMessage = event.data.value;
                        break;
                    case "alert":
                        selenium.browserbot.alertResponse = true;
                        if(event.data.value)
                            selenium.browserbot.alertMessage = event.data.value;
                        break;
                }
            }
        }
    })
}