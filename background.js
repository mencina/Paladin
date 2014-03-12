chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request == "kill me")
			chrome.tabs.remove(sender.tab.id)
	}
);


var author_name;
var video_title;
var data = {};
var urls;

function append_youtube(url) {
	full_url = "http://www.youtube.com" + url
	return full_url;
}

function click(tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete' && data[tab.id]) {
		console.log('updated tab');
		var state = data[tab.id].state;
		var author_name = data[tab.id].author_name;
		var video_title = data[tab.id].video_title;
		var message;
		switch (state) {
			case 0:
				state = 1;
				message = "click send message";
				break;
			case 1:
				state = 2
				message = {
					'command': "populate fields",
					'subject': "Hi " + author_name,
					'message': "Hi " + author_name + ". I really enjoyed the " + video_title + " video! Please check www.klooff.com and follow me! Good luck your you and us! =) By the way, this is one of my favorite videos, it's Dj Tiesto."
				};
				break;
			default:
				return;
		}

		data[tab.id].state = state;

		chrome.tabs.sendMessage(tab.id, message, function(response){
			switch (state) {
				case 1:
					// prod
					// chrome.tabs.update(tab.id, {"url": append_youtube(response)});
					// to marran:
					chrome.tabs.update(tab.id, {"url": "http://www.youtube.com/inbox?action_compose=1&to_user_ext_ids=WsVH7N34j-N4av5yFedlTg"});
					// to bencina:
					// chrome.tabs.update(tab.id, {"url": "https://www.youtube.com/inbox?to_user_ext_ids=HSiivBQaAMqosd2wfU10pw&action_compose=1"});
					break;
				case 2:
					console.log(response)
					// chrome.tabs.remove(tab.id)
					break;
				default:
					console.log("default")
					break;
			}
		});
	}
}

function update_new_tab(tab) {
	console.log('created now updating');
	chrome.tabs.update(tab.id, {});
}

function wrapper(info) {
	return function after_tab_creation(tab) {
		data[tab.id] = info;
	}
}

function get_response_init(response) {
	// callback from response, print
	console.log('response: ' + response);
	console.log(response.length)
	for (var i = 19; i < response.length; i++) {
		console.log(i)
		var url = append_youtube(response[i].author_url + '/about');
		response[i]["state"] = 0;
		chrome.tabs.create({"url": url}, wrapper(response[i]));
	};
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