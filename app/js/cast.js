var app = {};



if (!chrome.cast || !chrome.cast.isAvailable) {
	setTimeout(initializeCastApi, 1000);
}

function initializeCastApi() {
	var sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
	var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
		sessionListener,
		receiverListener,
		chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED);
	chrome.cast.initialize(apiConfig, onInitSuccess, onError);
}




function onInitSuccess(){
	console.log("onInitSuccess init");
	chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
}

function onError(){
	console.log("onError error");
}

function sessionListener(e){
	console.log("sessionListener " + e);
}

function receiverListener(e){
	console.log("receiverListener " + e);
}
function onRequestSessionSuccess(e){
	session = e;
	console.log("got a session " + e);

	var mediaInfo = new chrome.cast.media.MediaInfo("http://dr04-lh.akamaihd.net/i/dr04_0@147057/master.m3u8?b=100-1600");

	mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
	mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
	mediaInfo.contentType = 'video/mp4';

	mediaInfo.metadata.title = "test";
	mediaInfo.metadata.images = [{'url': "http://img2.wikia.nocookie.net/__cb20140523031547/american-revolutionary-war/images/e/ec/Ok-icon.png"}];
	var request = new chrome.cast.media.LoadRequest(mediaInfo);
	request.autoplay = true;
	request.currentTime = 0;

	session.loadMedia(request,
		onMediaDiscovered.bind(this, 'loadMedia'),
		onMediaError);
}
function onLaunchError(){
	alert("sa");
}

function onMediaError(){
	console.log("error ");

}

function onMediaDiscovered(how, media) {
	console.log("onMediaDiscovered");
	currentMedia = media;
}
