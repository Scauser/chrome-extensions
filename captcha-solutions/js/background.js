//Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason == "install") {
		console.log("This is a first install!");
		chrome.storage.local.set({
			captchaSolutionsEnable: true
		});
		getCaptchaSolutionsEnabled();
		chrome.tabs.create({url: "forms/options.html"});
	} 
//	else if(details.reason == "update"){
//	var thisVersion = chrome.runtime.getManifest().version;
//	console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
//	}
});


//region key functions
function get_rumola_key1() {
	var key = "db7669d04f6430b5";
	if (localStorage['rumola:key'])
		key = (""+localStorage['rumola:key']).substr(0,16);
	return key;
}
function get_rumola_key2() {
	var key = "edf384db051f5d18";
	if (localStorage['rumola:key'])
		key = (""+localStorage['rumola:key']).substr(16);
	return key;
}
function get_rumola_key2_sum() {
	var key = get_rumola_key2();
	var s=0;
	for (var i=0; i<16; i++) {
		s += key.charCodeAt(i);
	}
	return s;
}

function set_rumola_key(key) {
	localStorage['rumola:key'] = key;
}
//endregion key functions

var enabled = false;

function getCaptchaSolutionsEnabled() {
	return true;
//	if(flag) {
//	return enabled;
//	}
////	chrome.storage.local.get('captchaSolutionsEnable', getCaptchaEnabled);
////	return enabled;
//	chrome.storage.local.get('captchaSolutionsEnable', function (result) {
//	console.log('1. captchaSolutionsEnable %s', result && result.captchaSolutionsEnable);
//	enabled = result && result.captchaSolutionsEnable;
////	getCaptchaSolutionsEnabled(true);
//	});
////	console.log('2. enabled %s', enabled);

////	return enabled;
}

function getCaptchaEnabled(a) {
	console.log('captchaSolutionsEnable %s', a && a.captchaSolutionsEnable);
	enabled = a && a.captchaSolutionsEnable;
}


//region auto search functions
function get_rumola_enabled() {
	var enabled = true;
	if (localStorage['rumola:enabled'])
		enabled = (localStorage['rumola:enabled'] == 'true');
	return enabled;
}
function set_rumola_enabled(enabled) {
	localStorage['rumola:enabled'] = enabled ? "true" : "false";
//	chrome.browserAction.setIcon({"path": (enabled ? "images/on.png" : "images/off.png")});
//	chrome.browserAction.setTitle({"title": chrome.i18n.getMessage(enabled ? "hint1" : "hint2")});
}
function change_rumola_enabled() {
	var enabled = !get_rumola_enabled();
	set_rumola_enabled(enabled);
	if (!enabled) {
		// TODO: may be make function sendMessage like in Safari
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action:"Cancel"});
		});
	}
}
//endregion auto search functions
set_rumola_enabled(get_rumola_enabled());

//region voice notifications
function get_rumola_voice() {
	var voice = false;
	if (localStorage['rumola:voice'])
		voice = (localStorage['rumola:voice'] == 'true');
	return voice;
}
function set_rumola_voice(v) {
	var value = v ? "true" : "false";
	localStorage['rumola:voice'] = value;
	if (v) {
		voice_notification("notifications/on.wav");
		notify(chrome.i18n.getMessage("voice_on"), false);
	} else {
		notify(chrome.i18n.getMessage("voice_off"), false);
	}
}

audio_object = null;
function voice_notification(f) {
	if (!get_rumola_voice())
		return;
	try
	{
		if (audio_object === null)
		{
			audio_object = new Audio();
		}
		audio_object.src = f;
		audio_object.play();
	}
	catch (exc) {}
}
//endregion voice notifications

//region switcher position
function get_switcher_position() {
	var pos = 'p';
	if (localStorage['rumola:switcher'])
		pos = localStorage['rumola:switcher'];
	return pos;
}
//endregion switcher position

//region of captcha regexes
function get_regexes_string() {
	var line = "[ck]apt?cha|robot|random|rnd|code|kod|geraimag|verif|captcha||solvemedia||solvemedia||capt?cha|IdMainDiv|realperson||capt?cha||[ck]ap|chal|check|code|kod|confir|guess|guven|ivc|response|secur|solu|spam|test|token|validat|verif|vrfcd|result|respuesta|Turing||logo";
	if (localStorage['rumola:filter_string_new'])
		line = localStorage['rumola:filter_string_new'];
	// 0 - img  | [ck]apt?cha|robot|random|rnd|code|kod|geraimag|verif|captcha
	// 1 - object | solvemedia
	// 2 - frame | solvemedia
	// 3 - label/div  | capt?cha|IdMainDiv|realperson
	// 4 - div        | capt?cha
	// 5 - input    | [ck]ap|chal|check|code|kod|confir|guess|guven|ivc|response|secur|solu|spam|test|token|validat|verif|vrfcd|result|respuesta
	// 6 - image anti regex

	return line;
}
function get_regexes_version() {
	var v = 5;
	if (localStorage['rumola:filter_version_new'])
		v = localStorage['rumola:filter_version_new'];
	return v;
}
function set_regexes_string_and_version(s, v) {
	localStorage['rumola:filter_string_new'] = s;
	localStorage['rumola:filter_version_new'] = v;
}
//endregion of captcha regexes

//region cached balance functions
function get_cached_balance() {
	var balance = "?";
	if (localStorage['rumola:balance'])
		balance = ""+localStorage['rumola:balance'];
	return balance;
}
function update_cached_balance(b) {
	localStorage['rumola:balance'] = b;
}
//endregion cached balance functions

//region all connect to server functions
gate_urls = new Array();
gate_urls.push("https://gate1a.skipinput.com/q_gate.php?b=chrome&v=3005&l="+chrome.i18n.getMessage("@@ui_locale")+"&key=");
gate_urls.push("https://gate2a.skipinput.com/q_gate.php?b=chrome&v=3005&l="+chrome.i18n.getMessage("@@ui_locale")+"&key=");
gate_urls.push("https://gate.rumola.com/q_gate.php?b=chrome&v=3005&l="+chrome.i18n.getMessage("@@ui_locale")+"&key=");

tmp_variable = Math.round((new Date()).getTime()/100);
gate_url_index = (get_rumola_key1() == 'db7669d04f6430b5') ? 0 : tmp_variable % 3;
gate_url_vector = (tmp_variable % 2)*2-1;
gate_suggested_index = -1;
gate_url = gate_urls[gate_url_index];
n_bad_responses_from_first_gate = 0;

function change_rumola_gate_url(bNotify, bUseSuggested) {
	if (bNotify)
		n_bad_responses_from_first_gate++;
	if ((n_bad_responses_from_first_gate == 3)&&(bNotify)) {
		notify(chrome.i18n.getMessage("conn_error"), false);
	}
	if (get_rumola_key1() == 'db7669d04f6430b5') {
		return;
	}
	gate_url_index = bUseSuggested ? gate_suggested_index : ((gate_url_index+gate_url_vector+6) % 3);
	gate_url = gate_urls[gate_url_index];
}

function process_response_heads(objHTTP) {
	if (objHTTP.getResponseHeader("rumola_key"))
		set_rumola_key(objHTTP.getResponseHeader("rumola_key"));
	if (objHTTP.getResponseHeader("rumola_credits"))
		update_cached_balance(objHTTP.getResponseHeader("rumola_credits"));
	if (objHTTP.getResponseHeader("DraftFilterVersion") && objHTTP.getResponseHeader("DraftFilterString"))
		set_regexes_string_and_version(objHTTP.getResponseHeader("DraftFilterString"), objHTTP.getResponseHeader("DraftFilterVersion"));
	if (objHTTP.getResponseHeader("ChangeGateSuggest") && (gate_suggested_index == -1)) {
		gate_suggested_index = parseInt(objHTTP.getResponseHeader("ChangeGateSuggest"));
		change_rumola_gate_url(false, true);
	}
}

function send_activation_request(post_data, tab_id, frame_id) {
	var objHTTP = new XMLHttpRequest();
	objHTTP.sender_tab_id = tab_id;
	objHTTP.frame_id = frame_id;
	objHTTP.open('POST', gate_url+get_rumola_key1()+"&action=install&c1="+check_cheater_1()+"&c2="+check_cheater_2(), false);
	objHTTP.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	try
	{
		objHTTP.send(post_data);
	}
	catch (exc) {
		notify(chrome.i18n.getMessage("conn_error"), false);
		return false;
	}
	if (objHTTP.status != 200) {
		notify(chrome.i18n.getMessage("conn_error"), false);
		return false;
	}
	process_response_heads(objHTTP);
	if (get_rumola_key1() == 'db7669d04f6430b5') {
		notify(chrome.i18n.getMessage("conn_error"), false);
		return false;
	}
	process_good_response_from_first_gate(""+objHTTP.responseText, objHTTP.sender_tab_id, objHTTP.frame_id, objHTTP.getResponseHeader("BGate"));
	return true;
}

function send_request_to_first_gate(toGate, tab_id, frame_id, step_id) {

	console.log('tab_id: %s, frame_id: %s, step_id: %s \n toGate: %s', 
			tab_id, frame_id, step_id, toGate);

	var regex = new Array();

	var regexArray = get_regexes_string().split('||');
	for (var i=0; i<regexArray.length; i++) {
		regex[i] = new RegExp(regexArray[i]);
	}

	if(toGate) {
		var lines = toGate.split('\n');
		var zero = null;
		var first = null;
		var inputIndex = -1;
		var captchaIndex = -1;
		// iterate each line
		for(var i = 0; i < lines.length; i++) {
			console.log('lines[%s]: %s', i, lines[i]);
			if(!lines[i]) {
				continue;
			}
			var tags = lines[i].split('||');
			if(tags && tags.length > 2) {
				for(var j = 2; j < tags.length; j++) {
					console.log('tags[%s]: %s', j, tags[j]);

					if(tags[j].substring(0, 2) == 'T:') {
						console.log('regext input %s', regex[5].test(tags[j]));
						if(regex[5].test(tags[j])) {
							inputIndex = j - 2;
							continue;
						}
					} else if(tags[j].substring(0, 2) == 'I:') {
						console.log('regext image %s; and anti regex %s', regex[0].test(tags[j]), !regex[6].test(tags[j]));
						if(regex[0].test(tags[j]) && !regex[6].test(tags[j])) {
							captchaIndex = j - 2;
							continue;
						}
					}
//					zero = null;
//					first = null;
//					inputIndex = -1;
//					captchaIndex = -1;
				}
			}
			console.log('1. %s %s %s %s', zero, first, inputIndex, captchaIndex);
			if(inputIndex != -1 && captchaIndex != -1) {
				zero = tags[0];
				first = tags[1];
			} else {
				zero = null;
				first = null;
				inputIndex = -1;
				captchaIndex = -1;
			}

			if(inputIndex > -1 && captchaIndex > -1 && zero && first) {
				console.log('2. found!! %s %s %s %s', zero, first, inputIndex, captchaIndex);
				break;
			}
		}

		// if t_field and i_field not found in one form, try to find in different forms
		if(inputIndex == -1 && captchaIndex == -1 && !zero && !first) {
			console.log('try again!!');
			for(var i = 0; i < lines.length; i++) {
				console.log('lines[%s]: %s', i, lines[i]);
				if(!lines[i]) {
					continue;
				}
				var tags = lines[i].split('||');
				if(tags && tags.length > 2) {
					for(var j = 2; j < tags.length; j++) {
						console.log('tags[%s]: %s', j, tags[j]);

						if(tags[j].substring(0, 2) == 'T:') {
							console.log('regext input %s', regex[5].test(tags[j]));
							if(regex[5].test(tags[j])) {
								//inputIndex = j - 2;
								if(captchaIndex > -1) {
									inputIndex = captchaIndex + 1;
								} else {
									inputIndex = j - 2;
								}
								console.log('inputIndex=%s', inputIndex);
								if((!zero && !first) || first > tags[1]) {
									zero = tags[0];
									first = tags[1];
								}
								continue;
							}
						} else if(tags[j].substring(0, 2) == 'I:') {
							console.log('regext image %s; and anti regex %s', regex[0].test(tags[j]), !regex[6].test(tags[j]));
							if(regex[0].test(tags[j]) && !regex[6].test(tags[j])) {
								if(inputIndex > -1) {
									captchaIndex = inputIndex + 1;
								} else {
									captchaIndex = j - 2;
								}
								console.log('captchaIndex=%s', captchaIndex);
								if((!zero && !first) || first > tags[1]) {
									zero = tags[0];
									first = tags[1];
								} 
								continue;
							}
						}
					}
				}
			}

			console.log('3. %s %s %s %s', zero, first, inputIndex, captchaIndex);
		}

		var data = '|CAPTCHA(s) NOT found on this page.';
		if(inputIndex > -1 && captchaIndex > -1 && zero && first) {
			data = '|CAPTCHA(s) found on this page.||' + zero + '||' + first + '||' + inputIndex + '||' + captchaIndex + '||vQVMBh';
			process_good_response_from_first_gate(data, tab_id, frame_id, 'https://gate1a.skipinput.com/b_gate.php?b=chrome&v=3005&key=');
		}
	}
}

function response_from_first_gate(aEvent) {
	var objHTTP = aEvent.target;
	if (objHTTP.readyState != 4)
		return;
	if (objHTTP.status != 200) {
		if (objHTTP.gate_url == gate_url) {
			change_rumola_gate_url(true, false);
		}
		if (objHTTP.step_id == 1) {
			setTimeout(function() {
				send_request_to_first_gate(objHTTP.toGate, objHTTP.sender_tab_id, objHTTP.frame_id, 2);
			}, 250);
		}
		return;
	}
	process_response_heads(objHTTP);
	process_good_response_from_first_gate(""+objHTTP.responseText, objHTTP.sender_tab_id, objHTTP.frame_id, objHTTP.getResponseHeader("BGate"));
}
function response_from_second_gate(aEvent) {
	console.log('>>>>>> response_from_second_gate');
	var objHTTP = aEvent.target;
	if (objHTTP.readyState != 4)
		return;

	console.log('rspText: %s', objHTTP.responseText);
	
	if (objHTTP.status != 200 || (objHTTP.responseText != null && objHTTP.responseText.length > 10)) {
		if (objHTTP.redo) {
			setTimeout(function() {

//				objHTTP1.sender_tab_id = objHTTP.sender_tab_id;
//				objHTTP1.frame_id = objHTTP.frame_id;
//				objHTTP1.redo = 0;

//				objHTTP1.open(objHTTP.method, objHTTP.url, true);
//				objHTTP1.addEventListener("readystatechange", response_from_second_gate, true);
//				objHTTP1.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//				objHTTP1.send(objHTTP.data);

				var formData = new FormData();

				var objHTTP1 = new XMLHttpRequest();
				
				objHTTP1.sender_tab_id = objHTTP.sender_tab_id;
				objHTTP1.frame_id = objHTTP.frame_id;
				
				objHTTP1.open(objHTTP.method, endpoint, true);    // plug-in desired URL
//				objHTTP1.setRequestHeader('Content-Type', 'multipart/form-data');
//				objHTTP.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');

				objHTTP1.addEventListener("readystatechange", response_from_second_gate, true);

				formData.append("p", "extension");
				formData.append("key", key);
				formData.append("secret", secret);
//				formData.append("captcha", base64toBlob(objHTTP.data, 'image/png'), "captcha.png");
				formData.append("captcha", ('data:image/png;base64,' + objHTTP.data));

//				objHTTP1.send(formData);

				var params = "p=extension&key=" + key + "&secret=" + secret + "&captcha=" + encodeURIComponent('data:image/png;base64,' + objHTTP.data);
				console.log('params: %s', params);
				objHTTP1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				objHTTP1.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
//				objHTTP1.setRequestHeader("Content-length", params.length);

				objHTTP1.send(params);

			}, 1500);
			return;
		}
		notify(chrome.i18n.getMessage("conn_error"), false);
		chrome.tabs.sendRequest(objHTTP.sender_tab_id, {action:"Cancel"});
		return;
	}

	console.log('rsp: %s', objHTTP.responseText);

	var parseXml;

	if (typeof window.DOMParser != "undefined") {
		parseXml = function(xmlStr) {
			return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
		};
	} else if (typeof window.ActiveXObject != "undefined" &&
			new window.ActiveXObject("Microsoft.XMLDOM")) {
		parseXml = function(xmlStr) {
			var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML(xmlStr);
			return xmlDoc;
		};
	} else {
		throw new Error("No XML parser found");
	}

	var solved = null;
	var xml = parseXml(replaceAll(objHTTP.responseText, '&', ''));
//	alert(objHTTP.responseText.tr);
	solved = xml.documentElement.getElementsByTagName("decaptcha")[0].firstChild.nodeValue;

//	xmlDoc = $.parseXML( objHTTP.responseText ),
//	$xml = $( xmlDoc );
//	var solved = $xml.find( "decaptcha" );

	console.log('solved: %s', solved);

	var tagsStr = 'Captcha Solutions|';
	if(!solved || solved.split(' ').length > 1) {
		if(solved.trim() === 'Error: You have 0 balance left in your account.') {
			tagsStr = tagsStr + solved.trim() + ' You can recharge you account <a href="http://www.captchasolutions.com/pricing/">on this page</a>';	
		} else {
			tagsStr = tagsStr + solved.trim();	
		}
		solved = null;
	} else {
		solved = solved.trim();
	}

	if(solved) {
		tagsStr = tagsStr + 'entered the CAPTCHA characters for you.||' + objHTTP.frame_id + '||0||OK||||' + solved;
	} else {
		tagsStr = tagsStr + '||' + objHTTP.frame_id + '||0||ERR||||';
	}

	//Rumola|entered the CAPTCHA characters for you.||2||0||OK||||Wn9g
	// 0 - notice
	// 1 - 
	// 2 - 
	// 3 - ERR, OK, WAIT, TMP
	// 4 - timeout
	// 5 - solved captcha text

	var tags = (tagsStr).split("||");

	chrome.tabs.get(objHTTP.sender_tab_id, function(ttt) {
		if (!ttt)
			return;

		if ((tags.length == 1)&&(tags[0])) {
			notify(tags[0]);
		}

		if (tags.length > 1) {
			chrome.tabs.sendRequest(objHTTP.sender_tab_id, {action:"ResponseFromSecondGate", tags:tags, frame_id:objHTTP.frame_id}, 
					function() {
				if (tags[0])
					notify(tags[0]);
			});
		}
	});
}

function base64toBlob(b64Data, contentType, sliceSize) {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, {type: contentType});
	return blob;
}

function process_good_response_from_first_gate(data, tab_id, frame_id, b_gate_url) {
	// data=|CAPTCHA(s) found on this page.||2||1||3||4||mmGLD2, tabId=2, frame_id=::1450066669826::0.00466102990321815, b_gate_url=https://gate1a.skipinput.com/b_gate.php?b=chrome&v=3005&key=
	console.log("process_good_response_from_first_gate");
	console.log("data=%s, tabId=%s, frame_id=%s, b_gate_url=%s", data, tab_id, frame_id, b_gate_url);
	n_bad_responses_from_first_gate = 0;
	var tags = data.split("||");

	console.log("tags.length: " + tags.length);
	if (tab_id == -1) {
		if (tags[0])
			notify(tags[0], false);
	} else {
		chrome.tabs.get(tab_id, function(ttt) {
			if (!ttt)
				return;

			if ((tags.length >= 1)&&(tags[0])) {
				if (tags.length == 6) {
					last_founded_captcha_tab_id = tab_id;
					last_founded_captcha_frame_id = frame_id;
				}
				notify(tags[0], tags.length == 6);
			}

			if (tags.length > 1) {
				chrome.tabs.sendRequest(tab_id, {action:"ResponseFromFirstGate", tags:tags, b_gate_url:b_gate_url, frame_id:frame_id});
			}
		});
	}
}

//endregion all connect to server functions

//region notifications + notification clicks functions
global_buttons = new Array();
last_founded_captcha_tab_id = -1;
last_founded_captcha_frame_id = null;
global_notify_counter = 0;
try
{
	chrome.notifications.onClicked.addListener(function(notificationId) {
		if (notificationId != 'RumolaNotification')
			return;
		chrome.notifications.clear("RumolaNotification", function(b) {});
		// TODO: solve captcha if last message was about captcha
	}); 
	chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
		if (notificationId != 'RumolaNotification')
			return;
		chrome.notifications.clear("RumolaNotification", function(b) {});
		if (global_buttons[buttonIndex]) {
			chrome.tabs.create({url:global_buttons[buttonIndex][3], "active":true});
			return;
		}
		chrome.tabs.sendRequest(last_founded_captcha_tab_id, {action:"StartLastCaptchaRecognition", frame_id:last_founded_captcha_frame_id});
	}); 
}
catch (exc) {}
function notify(s, need_solve_button) {
	var opt = {
			type: "basic",
			title: "Captcha Solutions",
			message: "",
			iconUrl: "images/icons/48.png",
			buttons: new Array(),
	};
	global_buttons = new Array();
	var wait_time = 2600;
	var b = s.match(/{{[^}]+}}/g);
	if (b) {
		for (var i=0; i<b.length; i++) {
			var x = b[i].split("|");
			if (x[1] == "V") {
				voice_notification(x[2]);
			}
			if (x[1] == "T") {
				wait_time = parseInt(x[2]);
			}
			if (x[1] == "B") {
				if (x.length == 5)
					opt.buttons.push({title:x[2]});
				else
					opt.buttons.push({title:x[2], iconUrl:x[4]});
				global_buttons.push(x);
			}
		}
	}
	if (need_solve_button) {
		opt.buttons.push({title:'Click to solve it now'});
	} else {
		last_founded_captcha_tab_id = -1;
	}
	s = s.replace(/{{[^}]+}}/g, '');
	var ts = s.split(/\|/);
	if (ts.length == 2) {
		opt.title = ts[0];
		opt.message = ts[1];
	} else {
		opt.message = s;
	}
	try
	{
		var local_notify_counter = ++global_notify_counter;
		chrome.notifications.create("RumolaNotification", opt, function(b) {});
		setTimeout(function() {
			if (local_notify_counter == global_notify_counter)
				chrome.notifications.clear("RumolaNotification", function(b) {}) 
		}, wait_time);
	}
	catch (exc) {
		var notification = webkitNotifications.createNotification(
				'images/icons/48.png',
				opt.title, opt.message);
		notification.show();
		setTimeout(function() {notification.cancel();}, (global_buttons.length == 0) ? 2300 : 30000);
	}
}
//endregion notifications + notification clicks functions

//region cheat control - just 1 time running on activation
function check_cheater_1() {
	try {
		var _0xa0e2=["\x4E\x74\x74","\x77\x69\x64\x74\x68","\x2E","\x68\x65\x69\x67\x68\x74","\x0A","\x72\x65\x70\x6C\x61\x63\x65","","\x6C\x65\x6E\x67\x74\x68","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x30\x30\x30\x30\x30\x30\x30\x30\x20\x37\x37\x30\x37\x33\x30\x39\x36\x20\x45\x45\x30\x45\x36\x31\x32\x43\x20\x39\x39\x30\x39\x35\x31\x42\x41\x20\x30\x37\x36\x44\x43\x34\x31\x39\x20\x37\x30\x36\x41\x46\x34\x38\x46\x20\x45\x39\x36\x33\x41\x35\x33\x35\x20\x39\x45\x36\x34\x39\x35\x41\x33\x20\x30\x45\x44\x42\x38\x38\x33\x32\x20\x37\x39\x44\x43\x42\x38\x41\x34\x20\x45\x30\x44\x35\x45\x39\x31\x45\x20\x39\x37\x44\x32\x44\x39\x38\x38\x20\x30\x39\x42\x36\x34\x43\x32\x42\x20\x37\x45\x42\x31\x37\x43\x42\x44\x20\x45\x37\x42\x38\x32\x44\x30\x37\x20\x39\x30\x42\x46\x31\x44\x39\x31\x20\x31\x44\x42\x37\x31\x30\x36\x34\x20\x36\x41\x42\x30\x32\x30\x46\x32\x20\x46\x33\x42\x39\x37\x31\x34\x38\x20\x38\x34\x42\x45\x34\x31\x44\x45\x20\x31\x41\x44\x41\x44\x34\x37\x44\x20\x36\x44\x44\x44\x45\x34\x45\x42\x20\x46\x34\x44\x34\x42\x35\x35\x31\x20\x38\x33\x44\x33\x38\x35\x43\x37\x20\x31\x33\x36\x43\x39\x38\x35\x36\x20\x36\x34\x36\x42\x41\x38\x43\x30\x20\x46\x44\x36\x32\x46\x39\x37\x41\x20\x38\x41\x36\x35\x43\x39\x45\x43\x20\x31\x34\x30\x31\x35\x43\x34\x46\x20\x36\x33\x30\x36\x36\x43\x44\x39\x20\x46\x41\x30\x46\x33\x44\x36\x33\x20\x38\x44\x30\x38\x30\x44\x46\x35\x20\x33\x42\x36\x45\x32\x30\x43\x38\x20\x34\x43\x36\x39\x31\x30\x35\x45\x20\x44\x35\x36\x30\x34\x31\x45\x34\x20\x41\x32\x36\x37\x37\x31\x37\x32\x20\x33\x43\x30\x33\x45\x34\x44\x31\x20\x34\x42\x30\x34\x44\x34\x34\x37\x20\x44\x32\x30\x44\x38\x35\x46\x44\x20\x41\x35\x30\x41\x42\x35\x36\x42\x20\x33\x35\x42\x35\x41\x38\x46\x41\x20\x34\x32\x42\x32\x39\x38\x36\x43\x20\x44\x42\x42\x42\x43\x39\x44\x36\x20\x41\x43\x42\x43\x46\x39\x34\x30\x20\x33\x32\x44\x38\x36\x43\x45\x33\x20\x34\x35\x44\x46\x35\x43\x37\x35\x20\x44\x43\x44\x36\x30\x44\x43\x46\x20\x41\x42\x44\x31\x33\x44\x35\x39\x20\x32\x36\x44\x39\x33\x30\x41\x43\x20\x35\x31\x44\x45\x30\x30\x33\x41\x20\x43\x38\x44\x37\x35\x31\x38\x30\x20\x42\x46\x44\x30\x36\x31\x31\x36\x20\x32\x31\x42\x34\x46\x34\x42\x35\x20\x35\x36\x42\x33\x43\x34\x32\x33\x20\x43\x46\x42\x41\x39\x35\x39\x39\x20\x42\x38\x42\x44\x41\x35\x30\x46\x20\x32\x38\x30\x32\x42\x38\x39\x45\x20\x35\x46\x30\x35\x38\x38\x30\x38\x20\x43\x36\x30\x43\x44\x39\x42\x32\x20\x42\x31\x30\x42\x45\x39\x32\x34\x20\x32\x46\x36\x46\x37\x43\x38\x37\x20\x35\x38\x36\x38\x34\x43\x31\x31\x20\x43\x31\x36\x31\x31\x44\x41\x42\x20\x42\x36\x36\x36\x32\x44\x33\x44\x20\x37\x36\x44\x43\x34\x31\x39\x30\x20\x30\x31\x44\x42\x37\x31\x30\x36\x20\x39\x38\x44\x32\x32\x30\x42\x43\x20\x45\x46\x44\x35\x31\x30\x32\x41\x20\x37\x31\x42\x31\x38\x35\x38\x39\x20\x30\x36\x42\x36\x42\x35\x31\x46\x20\x39\x46\x42\x46\x45\x34\x41\x35\x20\x45\x38\x42\x38\x44\x34\x33\x33\x20\x37\x38\x30\x37\x43\x39\x41\x32\x20\x30\x46\x30\x30\x46\x39\x33\x34\x20\x39\x36\x30\x39\x41\x38\x38\x45\x20\x45\x31\x30\x45\x39\x38\x31\x38\x20\x37\x46\x36\x41\x30\x44\x42\x42\x20\x30\x38\x36\x44\x33\x44\x32\x44\x20\x39\x31\x36\x34\x36\x43\x39\x37\x20\x45\x36\x36\x33\x35\x43\x30\x31\x20\x36\x42\x36\x42\x35\x31\x46\x34\x20\x31\x43\x36\x43\x36\x31\x36\x32\x20\x38\x35\x36\x35\x33\x30\x44\x38\x20\x46\x32\x36\x32\x30\x30\x34\x45\x20\x36\x43\x30\x36\x39\x35\x45\x44\x20\x31\x42\x30\x31\x41\x35\x37\x42\x20\x38\x32\x30\x38\x46\x34\x43\x31\x20\x46\x35\x30\x46\x43\x34\x35\x37\x20\x36\x35\x42\x30\x44\x39\x43\x36\x20\x31\x32\x42\x37\x45\x39\x35\x30\x20\x38\x42\x42\x45\x42\x38\x45\x41\x20\x46\x43\x42\x39\x38\x38\x37\x43\x20\x36\x32\x44\x44\x31\x44\x44\x46\x20\x31\x35\x44\x41\x32\x44\x34\x39\x20\x38\x43\x44\x33\x37\x43\x46\x33\x20\x46\x42\x44\x34\x34\x43\x36\x35\x20\x34\x44\x42\x32\x36\x31\x35\x38\x20\x33\x41\x42\x35\x35\x31\x43\x45\x20\x41\x33\x42\x43\x30\x30\x37\x34\x20\x44\x34\x42\x42\x33\x30\x45\x32\x20\x34\x41\x44\x46\x41\x35\x34\x31\x20\x33\x44\x44\x38\x39\x35\x44\x37\x20\x41\x34\x44\x31\x43\x34\x36\x44\x20\x44\x33\x44\x36\x46\x34\x46\x42\x20\x34\x33\x36\x39\x45\x39\x36\x41\x20\x33\x34\x36\x45\x44\x39\x46\x43\x20\x41\x44\x36\x37\x38\x38\x34\x36\x20\x44\x41\x36\x30\x42\x38\x44\x30\x20\x34\x34\x30\x34\x32\x44\x37\x33\x20\x33\x33\x30\x33\x31\x44\x45\x35\x20\x41\x41\x30\x41\x34\x43\x35\x46\x20\x44\x44\x30\x44\x37\x43\x43\x39\x20\x35\x30\x30\x35\x37\x31\x33\x43\x20\x32\x37\x30\x32\x34\x31\x41\x41\x20\x42\x45\x30\x42\x31\x30\x31\x30\x20\x43\x39\x30\x43\x32\x30\x38\x36\x20\x35\x37\x36\x38\x42\x35\x32\x35\x20\x32\x30\x36\x46\x38\x35\x42\x33\x20\x42\x39\x36\x36\x44\x34\x30\x39\x20\x43\x45\x36\x31\x45\x34\x39\x46\x20\x35\x45\x44\x45\x46\x39\x30\x45\x20\x32\x39\x44\x39\x43\x39\x39\x38\x20\x42\x30\x44\x30\x39\x38\x32\x32\x20\x43\x37\x44\x37\x41\x38\x42\x34\x20\x35\x39\x42\x33\x33\x44\x31\x37\x20\x32\x45\x42\x34\x30\x44\x38\x31\x20\x42\x37\x42\x44\x35\x43\x33\x42\x20\x43\x30\x42\x41\x36\x43\x41\x44\x20\x45\x44\x42\x38\x38\x33\x32\x30\x20\x39\x41\x42\x46\x42\x33\x42\x36\x20\x30\x33\x42\x36\x45\x32\x30\x43\x20\x37\x34\x42\x31\x44\x32\x39\x41\x20\x45\x41\x44\x35\x34\x37\x33\x39\x20\x39\x44\x44\x32\x37\x37\x41\x46\x20\x30\x34\x44\x42\x32\x36\x31\x35\x20\x37\x33\x44\x43\x31\x36\x38\x33\x20\x45\x33\x36\x33\x30\x42\x31\x32\x20\x39\x34\x36\x34\x33\x42\x38\x34\x20\x30\x44\x36\x44\x36\x41\x33\x45\x20\x37\x41\x36\x41\x35\x41\x41\x38\x20\x45\x34\x30\x45\x43\x46\x30\x42\x20\x39\x33\x30\x39\x46\x46\x39\x44\x20\x30\x41\x30\x30\x41\x45\x32\x37\x20\x37\x44\x30\x37\x39\x45\x42\x31\x20\x46\x30\x30\x46\x39\x33\x34\x34\x20\x38\x37\x30\x38\x41\x33\x44\x32\x20\x31\x45\x30\x31\x46\x32\x36\x38\x20\x36\x39\x30\x36\x43\x32\x46\x45\x20\x46\x37\x36\x32\x35\x37\x35\x44\x20\x38\x30\x36\x35\x36\x37\x43\x42\x20\x31\x39\x36\x43\x33\x36\x37\x31\x20\x36\x45\x36\x42\x30\x36\x45\x37\x20\x46\x45\x44\x34\x31\x42\x37\x36\x20\x38\x39\x44\x33\x32\x42\x45\x30\x20\x31\x30\x44\x41\x37\x41\x35\x41\x20\x36\x37\x44\x44\x34\x41\x43\x43\x20\x46\x39\x42\x39\x44\x46\x36\x46\x20\x38\x45\x42\x45\x45\x46\x46\x39\x20\x31\x37\x42\x37\x42\x45\x34\x33\x20\x36\x30\x42\x30\x38\x45\x44\x35\x20\x44\x36\x44\x36\x41\x33\x45\x38\x20\x41\x31\x44\x31\x39\x33\x37\x45\x20\x33\x38\x44\x38\x43\x32\x43\x34\x20\x34\x46\x44\x46\x46\x32\x35\x32\x20\x44\x31\x42\x42\x36\x37\x46\x31\x20\x41\x36\x42\x43\x35\x37\x36\x37\x20\x33\x46\x42\x35\x30\x36\x44\x44\x20\x34\x38\x42\x32\x33\x36\x34\x42\x20\x44\x38\x30\x44\x32\x42\x44\x41\x20\x41\x46\x30\x41\x31\x42\x34\x43\x20\x33\x36\x30\x33\x34\x41\x46\x36\x20\x34\x31\x30\x34\x37\x41\x36\x30\x20\x44\x46\x36\x30\x45\x46\x43\x33\x20\x41\x38\x36\x37\x44\x46\x35\x35\x20\x33\x31\x36\x45\x38\x45\x45\x46\x20\x34\x36\x36\x39\x42\x45\x37\x39\x20\x43\x42\x36\x31\x42\x33\x38\x43\x20\x42\x43\x36\x36\x38\x33\x31\x41\x20\x32\x35\x36\x46\x44\x32\x41\x30\x20\x35\x32\x36\x38\x45\x32\x33\x36\x20\x43\x43\x30\x43\x37\x37\x39\x35\x20\x42\x42\x30\x42\x34\x37\x30\x33\x20\x32\x32\x30\x32\x31\x36\x42\x39\x20\x35\x35\x30\x35\x32\x36\x32\x46\x20\x43\x35\x42\x41\x33\x42\x42\x45\x20\x42\x32\x42\x44\x30\x42\x32\x38\x20\x32\x42\x42\x34\x35\x41\x39\x32\x20\x35\x43\x42\x33\x36\x41\x30\x34\x20\x43\x32\x44\x37\x46\x46\x41\x37\x20\x42\x35\x44\x30\x43\x46\x33\x31\x20\x32\x43\x44\x39\x39\x45\x38\x42\x20\x35\x42\x44\x45\x41\x45\x31\x44\x20\x39\x42\x36\x34\x43\x32\x42\x30\x20\x45\x43\x36\x33\x46\x32\x32\x36\x20\x37\x35\x36\x41\x41\x33\x39\x43\x20\x30\x32\x36\x44\x39\x33\x30\x41\x20\x39\x43\x30\x39\x30\x36\x41\x39\x20\x45\x42\x30\x45\x33\x36\x33\x46\x20\x37\x32\x30\x37\x36\x37\x38\x35\x20\x30\x35\x30\x30\x35\x37\x31\x33\x20\x39\x35\x42\x46\x34\x41\x38\x32\x20\x45\x32\x42\x38\x37\x41\x31\x34\x20\x37\x42\x42\x31\x32\x42\x41\x45\x20\x30\x43\x42\x36\x31\x42\x33\x38\x20\x39\x32\x44\x32\x38\x45\x39\x42\x20\x45\x35\x44\x35\x42\x45\x30\x44\x20\x37\x43\x44\x43\x45\x46\x42\x37\x20\x30\x42\x44\x42\x44\x46\x32\x31\x20\x38\x36\x44\x33\x44\x32\x44\x34\x20\x46\x31\x44\x34\x45\x32\x34\x32\x20\x36\x38\x44\x44\x42\x33\x46\x38\x20\x31\x46\x44\x41\x38\x33\x36\x45\x20\x38\x31\x42\x45\x31\x36\x43\x44\x20\x46\x36\x42\x39\x32\x36\x35\x42\x20\x36\x46\x42\x30\x37\x37\x45\x31\x20\x31\x38\x42\x37\x34\x37\x37\x37\x20\x38\x38\x30\x38\x35\x41\x45\x36\x20\x46\x46\x30\x46\x36\x41\x37\x30\x20\x36\x36\x30\x36\x33\x42\x43\x41\x20\x31\x31\x30\x31\x30\x42\x35\x43\x20\x38\x46\x36\x35\x39\x45\x46\x46\x20\x46\x38\x36\x32\x41\x45\x36\x39\x20\x36\x31\x36\x42\x46\x46\x44\x33\x20\x31\x36\x36\x43\x43\x46\x34\x35\x20\x41\x30\x30\x41\x45\x32\x37\x38\x20\x44\x37\x30\x44\x44\x32\x45\x45\x20\x34\x45\x30\x34\x38\x33\x35\x34\x20\x33\x39\x30\x33\x42\x33\x43\x32\x20\x41\x37\x36\x37\x32\x36\x36\x31\x20\x44\x30\x36\x30\x31\x36\x46\x37\x20\x34\x39\x36\x39\x34\x37\x34\x44\x20\x33\x45\x36\x45\x37\x37\x44\x42\x20\x41\x45\x44\x31\x36\x41\x34\x41\x20\x44\x39\x44\x36\x35\x41\x44\x43\x20\x34\x30\x44\x46\x30\x42\x36\x36\x20\x33\x37\x44\x38\x33\x42\x46\x30\x20\x41\x39\x42\x43\x41\x45\x35\x33\x20\x44\x45\x42\x42\x39\x45\x43\x35\x20\x34\x37\x42\x32\x43\x46\x37\x46\x20\x33\x30\x42\x35\x46\x46\x45\x39\x20\x42\x44\x42\x44\x46\x32\x31\x43\x20\x43\x41\x42\x41\x43\x32\x38\x41\x20\x35\x33\x42\x33\x39\x33\x33\x30\x20\x32\x34\x42\x34\x41\x33\x41\x36\x20\x42\x41\x44\x30\x33\x36\x30\x35\x20\x43\x44\x44\x37\x30\x36\x39\x33\x20\x35\x34\x44\x45\x35\x37\x32\x39\x20\x32\x33\x44\x39\x36\x37\x42\x46\x20\x42\x33\x36\x36\x37\x41\x32\x45\x20\x43\x34\x36\x31\x34\x41\x42\x38\x20\x35\x44\x36\x38\x31\x42\x30\x32\x20\x32\x41\x36\x46\x32\x42\x39\x34\x20\x42\x34\x30\x42\x42\x45\x33\x37\x20\x43\x33\x30\x43\x38\x45\x41\x31\x20\x35\x41\x30\x35\x44\x46\x31\x42\x20\x32\x44\x30\x32\x45\x46\x38\x44","\x30\x78","\x73\x75\x62\x73\x74\x72"];str=_0xa0e2[0]+screen[_0xa0e2[1]]+_0xa0e2[2]+screen[_0xa0e2[3]];str=str[_0xa0e2[5]](/\r\n/g,_0xa0e2[4]);var utftext=_0xa0e2[6];for(var n=0;n<str[_0xa0e2[7]];n++){var c=str[_0xa0e2[8]](n);if(c<128){utftext+=String[_0xa0e2[9]](c);} else {if((c>127)&&(c<2048)){utftext+=String[_0xa0e2[9]]((c>>6)|192);utftext+=String[_0xa0e2[9]]((c&63)|128);} else {utftext+=String[_0xa0e2[9]]((c>>12)|224);utftext+=String[_0xa0e2[9]](((c>>6)&63)|128);utftext+=String[_0xa0e2[9]]((c&63)|128);} ;} ;} ;str=utftext;var table=_0xa0e2[10];var crc=0;var x=0;var y=0;crc=crc^(-1);for(var i=0,iTop=str[_0xa0e2[7]];i<iTop;i++){y=(crc^str[_0xa0e2[8]](i))&0xFF;x=_0xa0e2[11]+table[_0xa0e2[12]](y*9,8);crc=(crc>>>8)^x;} ;global_variable=crc^(-1);
		return parseInt(global_variable);
	} catch (exc) {return 0;}
}

function check_cheater_2() {
	try {
		var _0xa701=["","\x70\x6C\x75\x67\x69\x6E\x73","\x6C\x65\x6E\x67\x74\x68","\x66\x69\x6C\x65\x6E\x61\x6D\x65","\x0A","\x72\x65\x70\x6C\x61\x63\x65","\x63\x68\x61\x72\x43\x6F\x64\x65\x41\x74","\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65","\x30\x30\x30\x30\x30\x30\x30\x30\x20\x37\x37\x30\x37\x33\x30\x39\x36\x20\x45\x45\x30\x45\x36\x31\x32\x43\x20\x39\x39\x30\x39\x35\x31\x42\x41\x20\x30\x37\x36\x44\x43\x34\x31\x39\x20\x37\x30\x36\x41\x46\x34\x38\x46\x20\x45\x39\x36\x33\x41\x35\x33\x35\x20\x39\x45\x36\x34\x39\x35\x41\x33\x20\x30\x45\x44\x42\x38\x38\x33\x32\x20\x37\x39\x44\x43\x42\x38\x41\x34\x20\x45\x30\x44\x35\x45\x39\x31\x45\x20\x39\x37\x44\x32\x44\x39\x38\x38\x20\x30\x39\x42\x36\x34\x43\x32\x42\x20\x37\x45\x42\x31\x37\x43\x42\x44\x20\x45\x37\x42\x38\x32\x44\x30\x37\x20\x39\x30\x42\x46\x31\x44\x39\x31\x20\x31\x44\x42\x37\x31\x30\x36\x34\x20\x36\x41\x42\x30\x32\x30\x46\x32\x20\x46\x33\x42\x39\x37\x31\x34\x38\x20\x38\x34\x42\x45\x34\x31\x44\x45\x20\x31\x41\x44\x41\x44\x34\x37\x44\x20\x36\x44\x44\x44\x45\x34\x45\x42\x20\x46\x34\x44\x34\x42\x35\x35\x31\x20\x38\x33\x44\x33\x38\x35\x43\x37\x20\x31\x33\x36\x43\x39\x38\x35\x36\x20\x36\x34\x36\x42\x41\x38\x43\x30\x20\x46\x44\x36\x32\x46\x39\x37\x41\x20\x38\x41\x36\x35\x43\x39\x45\x43\x20\x31\x34\x30\x31\x35\x43\x34\x46\x20\x36\x33\x30\x36\x36\x43\x44\x39\x20\x46\x41\x30\x46\x33\x44\x36\x33\x20\x38\x44\x30\x38\x30\x44\x46\x35\x20\x33\x42\x36\x45\x32\x30\x43\x38\x20\x34\x43\x36\x39\x31\x30\x35\x45\x20\x44\x35\x36\x30\x34\x31\x45\x34\x20\x41\x32\x36\x37\x37\x31\x37\x32\x20\x33\x43\x30\x33\x45\x34\x44\x31\x20\x34\x42\x30\x34\x44\x34\x34\x37\x20\x44\x32\x30\x44\x38\x35\x46\x44\x20\x41\x35\x30\x41\x42\x35\x36\x42\x20\x33\x35\x42\x35\x41\x38\x46\x41\x20\x34\x32\x42\x32\x39\x38\x36\x43\x20\x44\x42\x42\x42\x43\x39\x44\x36\x20\x41\x43\x42\x43\x46\x39\x34\x30\x20\x33\x32\x44\x38\x36\x43\x45\x33\x20\x34\x35\x44\x46\x35\x43\x37\x35\x20\x44\x43\x44\x36\x30\x44\x43\x46\x20\x41\x42\x44\x31\x33\x44\x35\x39\x20\x32\x36\x44\x39\x33\x30\x41\x43\x20\x35\x31\x44\x45\x30\x30\x33\x41\x20\x43\x38\x44\x37\x35\x31\x38\x30\x20\x42\x46\x44\x30\x36\x31\x31\x36\x20\x32\x31\x42\x34\x46\x34\x42\x35\x20\x35\x36\x42\x33\x43\x34\x32\x33\x20\x43\x46\x42\x41\x39\x35\x39\x39\x20\x42\x38\x42\x44\x41\x35\x30\x46\x20\x32\x38\x30\x32\x42\x38\x39\x45\x20\x35\x46\x30\x35\x38\x38\x30\x38\x20\x43\x36\x30\x43\x44\x39\x42\x32\x20\x42\x31\x30\x42\x45\x39\x32\x34\x20\x32\x46\x36\x46\x37\x43\x38\x37\x20\x35\x38\x36\x38\x34\x43\x31\x31\x20\x43\x31\x36\x31\x31\x44\x41\x42\x20\x42\x36\x36\x36\x32\x44\x33\x44\x20\x37\x36\x44\x43\x34\x31\x39\x30\x20\x30\x31\x44\x42\x37\x31\x30\x36\x20\x39\x38\x44\x32\x32\x30\x42\x43\x20\x45\x46\x44\x35\x31\x30\x32\x41\x20\x37\x31\x42\x31\x38\x35\x38\x39\x20\x30\x36\x42\x36\x42\x35\x31\x46\x20\x39\x46\x42\x46\x45\x34\x41\x35\x20\x45\x38\x42\x38\x44\x34\x33\x33\x20\x37\x38\x30\x37\x43\x39\x41\x32\x20\x30\x46\x30\x30\x46\x39\x33\x34\x20\x39\x36\x30\x39\x41\x38\x38\x45\x20\x45\x31\x30\x45\x39\x38\x31\x38\x20\x37\x46\x36\x41\x30\x44\x42\x42\x20\x30\x38\x36\x44\x33\x44\x32\x44\x20\x39\x31\x36\x34\x36\x43\x39\x37\x20\x45\x36\x36\x33\x35\x43\x30\x31\x20\x36\x42\x36\x42\x35\x31\x46\x34\x20\x31\x43\x36\x43\x36\x31\x36\x32\x20\x38\x35\x36\x35\x33\x30\x44\x38\x20\x46\x32\x36\x32\x30\x30\x34\x45\x20\x36\x43\x30\x36\x39\x35\x45\x44\x20\x31\x42\x30\x31\x41\x35\x37\x42\x20\x38\x32\x30\x38\x46\x34\x43\x31\x20\x46\x35\x30\x46\x43\x34\x35\x37\x20\x36\x35\x42\x30\x44\x39\x43\x36\x20\x31\x32\x42\x37\x45\x39\x35\x30\x20\x38\x42\x42\x45\x42\x38\x45\x41\x20\x46\x43\x42\x39\x38\x38\x37\x43\x20\x36\x32\x44\x44\x31\x44\x44\x46\x20\x31\x35\x44\x41\x32\x44\x34\x39\x20\x38\x43\x44\x33\x37\x43\x46\x33\x20\x46\x42\x44\x34\x34\x43\x36\x35\x20\x34\x44\x42\x32\x36\x31\x35\x38\x20\x33\x41\x42\x35\x35\x31\x43\x45\x20\x41\x33\x42\x43\x30\x30\x37\x34\x20\x44\x34\x42\x42\x33\x30\x45\x32\x20\x34\x41\x44\x46\x41\x35\x34\x31\x20\x33\x44\x44\x38\x39\x35\x44\x37\x20\x41\x34\x44\x31\x43\x34\x36\x44\x20\x44\x33\x44\x36\x46\x34\x46\x42\x20\x34\x33\x36\x39\x45\x39\x36\x41\x20\x33\x34\x36\x45\x44\x39\x46\x43\x20\x41\x44\x36\x37\x38\x38\x34\x36\x20\x44\x41\x36\x30\x42\x38\x44\x30\x20\x34\x34\x30\x34\x32\x44\x37\x33\x20\x33\x33\x30\x33\x31\x44\x45\x35\x20\x41\x41\x30\x41\x34\x43\x35\x46\x20\x44\x44\x30\x44\x37\x43\x43\x39\x20\x35\x30\x30\x35\x37\x31\x33\x43\x20\x32\x37\x30\x32\x34\x31\x41\x41\x20\x42\x45\x30\x42\x31\x30\x31\x30\x20\x43\x39\x30\x43\x32\x30\x38\x36\x20\x35\x37\x36\x38\x42\x35\x32\x35\x20\x32\x30\x36\x46\x38\x35\x42\x33\x20\x42\x39\x36\x36\x44\x34\x30\x39\x20\x43\x45\x36\x31\x45\x34\x39\x46\x20\x35\x45\x44\x45\x46\x39\x30\x45\x20\x32\x39\x44\x39\x43\x39\x39\x38\x20\x42\x30\x44\x30\x39\x38\x32\x32\x20\x43\x37\x44\x37\x41\x38\x42\x34\x20\x35\x39\x42\x33\x33\x44\x31\x37\x20\x32\x45\x42\x34\x30\x44\x38\x31\x20\x42\x37\x42\x44\x35\x43\x33\x42\x20\x43\x30\x42\x41\x36\x43\x41\x44\x20\x45\x44\x42\x38\x38\x33\x32\x30\x20\x39\x41\x42\x46\x42\x33\x42\x36\x20\x30\x33\x42\x36\x45\x32\x30\x43\x20\x37\x34\x42\x31\x44\x32\x39\x41\x20\x45\x41\x44\x35\x34\x37\x33\x39\x20\x39\x44\x44\x32\x37\x37\x41\x46\x20\x30\x34\x44\x42\x32\x36\x31\x35\x20\x37\x33\x44\x43\x31\x36\x38\x33\x20\x45\x33\x36\x33\x30\x42\x31\x32\x20\x39\x34\x36\x34\x33\x42\x38\x34\x20\x30\x44\x36\x44\x36\x41\x33\x45\x20\x37\x41\x36\x41\x35\x41\x41\x38\x20\x45\x34\x30\x45\x43\x46\x30\x42\x20\x39\x33\x30\x39\x46\x46\x39\x44\x20\x30\x41\x30\x30\x41\x45\x32\x37\x20\x37\x44\x30\x37\x39\x45\x42\x31\x20\x46\x30\x30\x46\x39\x33\x34\x34\x20\x38\x37\x30\x38\x41\x33\x44\x32\x20\x31\x45\x30\x31\x46\x32\x36\x38\x20\x36\x39\x30\x36\x43\x32\x46\x45\x20\x46\x37\x36\x32\x35\x37\x35\x44\x20\x38\x30\x36\x35\x36\x37\x43\x42\x20\x31\x39\x36\x43\x33\x36\x37\x31\x20\x36\x45\x36\x42\x30\x36\x45\x37\x20\x46\x45\x44\x34\x31\x42\x37\x36\x20\x38\x39\x44\x33\x32\x42\x45\x30\x20\x31\x30\x44\x41\x37\x41\x35\x41\x20\x36\x37\x44\x44\x34\x41\x43\x43\x20\x46\x39\x42\x39\x44\x46\x36\x46\x20\x38\x45\x42\x45\x45\x46\x46\x39\x20\x31\x37\x42\x37\x42\x45\x34\x33\x20\x36\x30\x42\x30\x38\x45\x44\x35\x20\x44\x36\x44\x36\x41\x33\x45\x38\x20\x41\x31\x44\x31\x39\x33\x37\x45\x20\x33\x38\x44\x38\x43\x32\x43\x34\x20\x34\x46\x44\x46\x46\x32\x35\x32\x20\x44\x31\x42\x42\x36\x37\x46\x31\x20\x41\x36\x42\x43\x35\x37\x36\x37\x20\x33\x46\x42\x35\x30\x36\x44\x44\x20\x34\x38\x42\x32\x33\x36\x34\x42\x20\x44\x38\x30\x44\x32\x42\x44\x41\x20\x41\x46\x30\x41\x31\x42\x34\x43\x20\x33\x36\x30\x33\x34\x41\x46\x36\x20\x34\x31\x30\x34\x37\x41\x36\x30\x20\x44\x46\x36\x30\x45\x46\x43\x33\x20\x41\x38\x36\x37\x44\x46\x35\x35\x20\x33\x31\x36\x45\x38\x45\x45\x46\x20\x34\x36\x36\x39\x42\x45\x37\x39\x20\x43\x42\x36\x31\x42\x33\x38\x43\x20\x42\x43\x36\x36\x38\x33\x31\x41\x20\x32\x35\x36\x46\x44\x32\x41\x30\x20\x35\x32\x36\x38\x45\x32\x33\x36\x20\x43\x43\x30\x43\x37\x37\x39\x35\x20\x42\x42\x30\x42\x34\x37\x30\x33\x20\x32\x32\x30\x32\x31\x36\x42\x39\x20\x35\x35\x30\x35\x32\x36\x32\x46\x20\x43\x35\x42\x41\x33\x42\x42\x45\x20\x42\x32\x42\x44\x30\x42\x32\x38\x20\x32\x42\x42\x34\x35\x41\x39\x32\x20\x35\x43\x42\x33\x36\x41\x30\x34\x20\x43\x32\x44\x37\x46\x46\x41\x37\x20\x42\x35\x44\x30\x43\x46\x33\x31\x20\x32\x43\x44\x39\x39\x45\x38\x42\x20\x35\x42\x44\x45\x41\x45\x31\x44\x20\x39\x42\x36\x34\x43\x32\x42\x30\x20\x45\x43\x36\x33\x46\x32\x32\x36\x20\x37\x35\x36\x41\x41\x33\x39\x43\x20\x30\x32\x36\x44\x39\x33\x30\x41\x20\x39\x43\x30\x39\x30\x36\x41\x39\x20\x45\x42\x30\x45\x33\x36\x33\x46\x20\x37\x32\x30\x37\x36\x37\x38\x35\x20\x30\x35\x30\x30\x35\x37\x31\x33\x20\x39\x35\x42\x46\x34\x41\x38\x32\x20\x45\x32\x42\x38\x37\x41\x31\x34\x20\x37\x42\x42\x31\x32\x42\x41\x45\x20\x30\x43\x42\x36\x31\x42\x33\x38\x20\x39\x32\x44\x32\x38\x45\x39\x42\x20\x45\x35\x44\x35\x42\x45\x30\x44\x20\x37\x43\x44\x43\x45\x46\x42\x37\x20\x30\x42\x44\x42\x44\x46\x32\x31\x20\x38\x36\x44\x33\x44\x32\x44\x34\x20\x46\x31\x44\x34\x45\x32\x34\x32\x20\x36\x38\x44\x44\x42\x33\x46\x38\x20\x31\x46\x44\x41\x38\x33\x36\x45\x20\x38\x31\x42\x45\x31\x36\x43\x44\x20\x46\x36\x42\x39\x32\x36\x35\x42\x20\x36\x46\x42\x30\x37\x37\x45\x31\x20\x31\x38\x42\x37\x34\x37\x37\x37\x20\x38\x38\x30\x38\x35\x41\x45\x36\x20\x46\x46\x30\x46\x36\x41\x37\x30\x20\x36\x36\x30\x36\x33\x42\x43\x41\x20\x31\x31\x30\x31\x30\x42\x35\x43\x20\x38\x46\x36\x35\x39\x45\x46\x46\x20\x46\x38\x36\x32\x41\x45\x36\x39\x20\x36\x31\x36\x42\x46\x46\x44\x33\x20\x31\x36\x36\x43\x43\x46\x34\x35\x20\x41\x30\x30\x41\x45\x32\x37\x38\x20\x44\x37\x30\x44\x44\x32\x45\x45\x20\x34\x45\x30\x34\x38\x33\x35\x34\x20\x33\x39\x30\x33\x42\x33\x43\x32\x20\x41\x37\x36\x37\x32\x36\x36\x31\x20\x44\x30\x36\x30\x31\x36\x46\x37\x20\x34\x39\x36\x39\x34\x37\x34\x44\x20\x33\x45\x36\x45\x37\x37\x44\x42\x20\x41\x45\x44\x31\x36\x41\x34\x41\x20\x44\x39\x44\x36\x35\x41\x44\x43\x20\x34\x30\x44\x46\x30\x42\x36\x36\x20\x33\x37\x44\x38\x33\x42\x46\x30\x20\x41\x39\x42\x43\x41\x45\x35\x33\x20\x44\x45\x42\x42\x39\x45\x43\x35\x20\x34\x37\x42\x32\x43\x46\x37\x46\x20\x33\x30\x42\x35\x46\x46\x45\x39\x20\x42\x44\x42\x44\x46\x32\x31\x43\x20\x43\x41\x42\x41\x43\x32\x38\x41\x20\x35\x33\x42\x33\x39\x33\x33\x30\x20\x32\x34\x42\x34\x41\x33\x41\x36\x20\x42\x41\x44\x30\x33\x36\x30\x35\x20\x43\x44\x44\x37\x30\x36\x39\x33\x20\x35\x34\x44\x45\x35\x37\x32\x39\x20\x32\x33\x44\x39\x36\x37\x42\x46\x20\x42\x33\x36\x36\x37\x41\x32\x45\x20\x43\x34\x36\x31\x34\x41\x42\x38\x20\x35\x44\x36\x38\x31\x42\x30\x32\x20\x32\x41\x36\x46\x32\x42\x39\x34\x20\x42\x34\x30\x42\x42\x45\x33\x37\x20\x43\x33\x30\x43\x38\x45\x41\x31\x20\x35\x41\x30\x35\x44\x46\x31\x42\x20\x32\x44\x30\x32\x45\x46\x38\x44","\x30\x78","\x73\x75\x62\x73\x74\x72"];str=function (){var _0x44f5x1=_0xa701[0];try{var _0x44f5x2=navigator[_0xa701[1]];for(var i=0;i<_0x44f5x2[_0xa701[2]];i++){_0x44f5x1+=_0x44f5x2[i][_0xa701[3]];} ;} catch(e){} ;return _0x44f5x1;} ();str=str[_0xa701[5]](/\r\n/g,_0xa701[4]);var utftext=_0xa701[0];for(var n=0;n<str[_0xa701[2]];n++){var c=str[_0xa701[6]](n);if(c<128){utftext+=String[_0xa701[7]](c);} else {if((c>127)&&(c<2048)){utftext+=String[_0xa701[7]]((c>>6)|192);utftext+=String[_0xa701[7]]((c&63)|128);} else {utftext+=String[_0xa701[7]]((c>>12)|224);utftext+=String[_0xa701[7]](((c>>6)&63)|128);utftext+=String[_0xa701[7]]((c&63)|128);} ;} ;} ;str=utftext;var table=_0xa701[8];var crc=0;var x=0;var y=0;crc=crc^(-1);for(var i=0,iTop=str[_0xa701[2]];i<iTop;i++){y=(crc^str[_0xa701[6]](i))&0xFF;x=_0xa701[9]+table[_0xa701[10]](y*9,8);crc=(crc>>>8)^x;} ;global_variable=crc^(-1);
		return parseInt(global_variable);
	} catch (exc) {return 0;}
}
//endregion



//****** abuses ****** //
function send_abuse(type, comm) {
	var value = (type == 1) ? get_abuse_captcha_params() : comm;
	if (!value)
		return;
	var objHTTP = new XMLHttpRequest();
	objHTTP.open('GET', "https://gate1a.skipinput.com/abuse_gate_new.php?b=chrome&v=3005&key="+get_rumola_key1()+"&a="+value, true);
	objHTTP.addEventListener("readystatechange", response_from_abuse_gate, true);
	objHTTP.send(null);
	if (type == 1) {
		localStorage["rumola:last_recognised_captcha_time"] = 0;
	}
}
function response_from_abuse_gate(aEvent) {
	var objHTTP = aEvent.target;
	if (objHTTP.readyState != 4)
		return;


	if (objHTTP.responseText) {
		notify(objHTTP.responseText);
	}
}
function get_abuse_captcha_params() {
	if (!localStorage["rumola:last_recognised_captcha_time"])
		return null;
	var t = localStorage["rumola:last_recognised_captcha_time"];
	var ct = (new Date()).getTime()/1000;
	if ((ct - 600) > t)
		return null;
	return escape(localStorage["rumola:last_recognised_captcha_id"] + ":" + localStorage["rumola:last_recognised_captcha_value"]);
}

//***** popup ***** //
function popup_clicked(t) {
	switch (t) {
	case 1: // AutoSearch
		// TODO: may be make function sendMessage like in Safari
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action:"AutoSearch"});
		});
		break;
	case 2:	// Cancel
		// TODO: may be make function sendMessage like in Safari
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {action:"Cancel"});
		});
		break;
	case 3: // PageAbuse
		chrome.tabs.getSelected(null, function(tab) {
			var abused_url = tab.url;
			var comm=prompt("To send a complaint about "+abused_url, "Please enter a short description of what you were doing. This will help us understand the problem (optional)");
			if (comm !== null) {
				send_abuse(2, escape(abused_url)+"&c="+escape(comm));
			}
		});
		break;
	case 4: // CaptchaAbuse
		send_abuse(1, null);
		break;
	case 5: // visit website
		chrome.tabs.create({url:"http://skipinput.com/", "active":true});
		break;
	case 7: // purchase
		chrome.tabs.create({url:"https://client.skipinput.com/?k="+get_rumola_key1()+"&v="+get_rumola_key2_sum(), "active":true});
		break;
	case 8: // tie
		chrome.tabs.create({url:"https://client.skipinput.com/?a=t&k="+get_rumola_key1()+"&v="+get_rumola_key2_sum(), "active":true});
		break;
	case 9: // like
		chrome.tabs.create({url:"https://client.skipinput.com/like.php?k="+get_rumola_key1()+"&v="+get_rumola_key2_sum(), "active":true});
		break;
	}
}

//region active tab functions
active_tab_ids = new Array();
active_tab_err = false;
function tab_is_active(windowId, tabId) {
	if ((active_tab_ids[windowId] != null)&&(active_tab_ids[windowId] != tabId)) {
		chrome.tabs.sendRequest(active_tab_ids[windowId], {action:"JustDeactivated"});
	}
	active_tab_ids[windowId] = tabId;
	chrome.tabs.sendRequest(tabId, {action:"JustActivated"});
}
try
{
	chrome.tabs.onActivated.addListener(function(i) {
		tab_is_active(i.windowId, i.tabId);
	});
	chrome.tabs.query({"active":true}, function(tabs) {
		for (var i=0; i<tabs.length; i++) {
			tab_is_active(tabs[i].windowId, tabs[i].id);
		}
	});
}
catch (exc) {
	active_tab_err = true;
}
//endregion active tab functions

//region messages processing
wait_box_unique_message_id = "rumola_show_wait_box::"+(new Date()).getTime()+"::"+Math.random();
function receiveMessage(request, sender, sendResponse) {
	console.log('action: %s, tabId=%s, frame_id=%s', request.action, sender.tab.id, request.frame_id);
	switch (request.action) {
	case "PleaseSendPrefs":
		console.log('enabled: %s', getCaptchaSolutionsEnabled());
		sendResponse({enabled:getCaptchaSolutionsEnabled(), switcher_position:get_switcher_position(), filter_string: get_regexes_string(),
			wait_box_unique_message_id:wait_box_unique_message_id,
			b_active_tab:(active_tab_err ? false : (active_tab_ids[sender.tab.windowId] == sender.tab.id)),
			client_area_link:((get_rumola_key1() == 'db7669d04f6430b5') ? "" : "https://client.skipinput.com/?k="+get_rumola_key1()+"&v="+get_rumola_key2_sum())});
		break;
	case "RequestToFirstGate":
		send_request_to_first_gate(request.toGate, sender.tab.id, request.frame_id, 1);
		break;
	case "CaptureNow":
		chrome.tabs.captureVisibleTab(sender.tab.windowId, {format:"png"}, function(dataUrl) {
			sendResponse({dataUrl:dataUrl});
		});
		break;
	case "StartResolve":
		if(key && secret) {
			var formData = new FormData();
			var objHTTP = new XMLHttpRequest();

			objHTTP.sender_tab_id = sender.tab.id;
			objHTTP.frame_id = request.frame_id;
			objHTTP.method = request.method;
			objHTTP.url = request.url;
			objHTTP.data = request.data;
			objHTTP.redo = 1;
			// for sync call
			objHTTP.open('POST', endpoint, true);    // plug-in desired URL
//			objHTTP.setRequestHeader('Content-Type', 'multipart/form-data');
//			objHTTP.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
//			objHTTP.setRequestHeader('Upgrade-Insecure-Requests', '1');

			console.log('1. data:image/png;base64,' + request.data);

			var blob = base64toBlob(request.data, 'image/png');

//			var myReader = new FileReader();
//			myReader.onload = function(event){
//			console.log(JSON.stringify(myReader.result));
//			};
//			myReader.readAsText(blob);


//			var csv = JSON.stringify(myReader.result);
//			var csvData = 'data:image/png;charset=utf-8,' 
//			+ encodeURIComponent(csv);
//			this.href = csvData;
//			this.target = '_blank';
//			this.download = 'img2222.png';
//			var reader = new window.FileReader();
//			reader.readAsDataURL(blob); 
//			reader.onloadend = function() {
//			base64data = reader.result;
//			console.log('2. ' + base64data);
//			}

			objHTTP.addEventListener("readystatechange", response_from_second_gate, true);

			formData.append("p", "extension");
			formData.append("key", key);
			formData.append("secret", secret);
			console.log('blob: %s', blob);
//			formData.append("captcha", request.data, "captcha.png");
			formData.append("captcha", 'data:image/png;base64,' + request.data);
//			objHTTP.send(formData);

			var params = "p=extension&key=" + key + "&secret=" + secret + "&captcha=" + encodeURIComponent('data:image/png;base64,' + request.data);
			console.log('params: %s', params);
			objHTTP.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			objHTTP.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
//			objHTTP.setRequestHeader("Content-length", params.length);

			objHTTP.send(params);
		} else {
			notify('Captcha Solutions|please enter API key and secret key on the options page of the extension', false);
		}
		break;
	case "SaveCaptchaResult":
		localStorage["rumola:last_recognised_captcha_id"] = request.captcha_id;
		localStorage["rumola:last_recognised_captcha_value"] = request.value;
		localStorage["rumola:last_recognised_captcha_time"] = Math.round((new Date()).getTime()/1000);
		// no reply
		sendResponse({});
		break;
	case "PlaySound":
		voice_notification(request.file);
		break;
		// todo: create switcher position function
	case "SetSwitcherValue":
		var value = request.value == 'q' ? 'q' : 'p';
		localStorage['rumola:switcher'] = value;
		break;
	case "ChangeRumolaGateUrl":
		change_rumola_gate_url(false, false);
		// no reply
		sendResponse({});
		break;
	case "SetContextMenuFrameId":
		context_frame_id = request.frame_id;
		break;
	}
}

chrome.extension.onRequest.addListener(receiveMessage);
//endregion messages processing

//region context menu
context_frame_id = "";
function i_selected(info, tab) {
	chrome.tabs.sendRequest(tab.id, {action:"ISelected", frame_id:context_frame_id});
}
function t_selected(info, tab) {
	chrome.tabs.sendRequest(tab.id, {action:"TSelected", frame_id:context_frame_id});
}

//TODO: it will be good to make custom function for context
//context_menu_i_id = chrome.contextMenus.create({
//"title" : chrome.i18n.getMessage("context1"),
//"type" : "normal",
//"contexts" : ["image"],
//"onclick" : i_selected
//});
//context_menu_t_id = chrome.contextMenus.create({
//"title" : chrome.i18n.getMessage("context2"),
//"type" : "normal",
//"contexts" : ["editable"],
//"onclick" : t_selected
//});
//endregion context menu

var endpoint = "http://api.captchasolutions.com/solve";
var key = null;
var secret = null;

initializeSavedDetails();

function initializeSavedDetails() {
	chrome.storage.local.get('userData', initializeUserDataControls);
}

function initializeUserDataControls(a) {
	if (a && (a = a['userData'])) {
		key = a.apiKey;
		secret = a.secretKey;
	}
}

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(find, 'g'), replace);
}
