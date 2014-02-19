// browser action clicked
chrome.browserAction.onClicked.addListener(function() {
	// query for active tabs on this window
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// callback from query, send message to active tab
		chrome.tabs.sendMessage(tabs[0].id, "init", function(response) {
			// callback from response, print
			console.log(response);

			var url = "http://www.youtube.com" + response[0].author_url
			chrome.tabs.create({"url": url})

		});
	});
}); 