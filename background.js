var author_name;
var video_title;
var data = {};
var urls;

function append_youtube(url) {
	full_url = "http://www.youtube.com" + url
	return full_url;
}

function click(tabId, changeInfo, tab) {
	if(changeInfo.status == 'complete') {
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

		chrome.tabs.sendMessage(tab.id, message, function(response){
			switch (state) {
				case 1:
					// chrome.tabs.update(tab.id, {"url": append_youtube(response)});
					// to marran:
					// chrome.tabs.update(tab.id, {"url": "http://www.youtube.com/inbox?action_compose=1&to_user_ext_ids=WsVH7N34j-N4av5yFedlTg"});
					// to bencina:
					chrome.tabs.update(tab.id, {"url": "https://www.youtube.com/inbox?to_user_ext_ids=HSiivBQaAMqosd2wfU10pw&action_compose=1"});
				case 2:
					console.log(response)
			}
		});
		data[tab.id].state = state;
	}
}

function update_new_tab(tab) {
	console.log('created now updating');
	chrome.tabs.update(tab.id, {});
}

function raro(info) {
	return function after_tab_creation(tab) {
		data[tab.id] = info;
	}
}

function get_response_init(response) {
	// callback from response, print
	console.log('response: ' + response);
	for (var i = 0; i < response.length; i++) {
		var url = append_youtube(response[i].author_url + '/about');
		response[i]["state"] = 0;
		chrome.tabs.create({"url": url}, raro(response[i]));
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