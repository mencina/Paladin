chrome.runtime.onMessage.addListener(
	// message listener
	function(request, sender, sendResponse) {
		// see if message was sent from content script running on a tab or an extension
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");

		$('#search-results').children().each( function () {

			video_title = $(this).find("a .yt-ui-ellipsis-wrapper").text()
			author = $(this).find(".yt-user-name")
			author_url = author.attr("href")
			author_name = author.text()

			console.log ('Video Title: ' + video_title)
			console.log ('Video URL: ' + author_url)
			console.log ('Author Name: ' + author_name)

		});

		// see if the message was sent from desired extension
		if (request.greeting == "hello")
			// call sendResponse
			sendResponse({farewell: "goodbye"});
	}
);