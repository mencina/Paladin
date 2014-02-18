chrome.runtime.onMessage.addListener(
	// message listener
	function(request, sender, sendResponse) {
		// see if message was sent from content script running on a tab or an extension
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");

		// see if the message was sent from desired extension
		if (request.greeting == "hello")
			// call sendResponse
			sendResponse({farewell: "goodbye"});
	}
);