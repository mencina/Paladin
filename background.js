var state = 0;

function append_youtube(url) {
	full_url = "http://www.youtube.com" + url
	return full_url;
}

function click(tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete') {
		console.log('updated tab');
		var message;
		switch (state) {
			case 0:
				state = 1;
				message = "click about";
				break;
			case 1:
				state = 2;
				message = "click send message";
				break;
			default:
				return;
		}

		chrome.tabs.sendMessage(tab.id, message, function(response){
			chrome.tabs.update(tab.id, {"url": append_youtube(response)});
		});
	}
}

function update_new_tab(tab) {
	console.log('created now updating');
	chrome.tabs.update(tab.id, {});
}

function get_response_init(response) {
	// callback from response, print
	console.log('response: ' + response);

	var url = append_youtube(response[0].author_url)
	chrome.tabs.create({"url": url})
}

function init(tabs) {
	// callback from query, send message to active tab
	console.log('init')
	chrome.tabs.sendMessage(tabs[0].id, "init", get_response_init);
}

function main() {
	// query for active tabs on this window
	console.log('main')
	chrome.tabs.onCreated.addListener(update_new_tab);
	chrome.tabs.onUpdated.addListener(click);

	chrome.tabs.query({active: true, currentWindow: true}, init);
}

// browser action clicked
chrome.browserAction.onClicked.addListener(main);