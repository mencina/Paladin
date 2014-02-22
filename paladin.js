chrome.runtime.onMessage.addListener(
	// message listener
	function(request, sender, sendResponse) {
		// see if message was sent from content script running on a tab or an extension
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
			"from the extension");
		var response = []
		
		if (request == "init") {
			$('#search-results').children().each( function () {

				video_title = $(this).find("a .yt-ui-ellipsis-wrapper").text()
				author = $(this).find(".yt-user-name")
				author_url = author.attr("href")
				author_name = author.text()

				console.log ('Video Title: ' + video_title)
				console.log ('Author URL: ' + author_url)
				console.log ('Author Name: ' + author_name)

				var data = {
					'video_title': video_title,
					'author_url': author_url,
					'author_name': author_name
				};

				response.push(data)
			});
		}

		if (request == "click send message") {
			console.log("click send message");
			response = $('a.about-action').attr('href');
		}

		if (request.command == "populate fields"){
			jQuery( document ).ready(function() {
				$("#compose_subject").val(request.subject);
				$("#compose_message").val(request.message);
				

				// choose video to attach
				$("#field_reference_video").val("_leKVxyPBrU")

				// send message
				$('#inbox_send_message').click();

			});

			response = "done"
		}

		sendResponse(response);
	}
);