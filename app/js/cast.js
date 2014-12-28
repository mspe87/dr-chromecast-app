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



	var danishSubtitle = new chrome.cast.media.Track(1, // track ID
		chrome.cast.media.TrackType.TEXT);
	danishSubtitle.trackContentId = 'https://www.dr.dk/mu-online/api/1.2/bar/548062936187a20d7cf48704';
	danishSubtitle.contentType = 'text/vtt';
	danishSubtitle.subtype = chrome.cast.media.TextTrackType.SUBTITLES;
	danishSubtitle.name = 'Danish Subtitles';
	danishSubtitle.language = 'da';
	danishSubtitle.customData = null;
	var tracks = [danishSubtitle];


	var mediaInfo = new chrome.cast.media.MediaInfo("http://drod09k-vh.akamaihd.net/i/all/clear/streaming/d3/549ca479a11f9d1b0c32acd3/Hele-Danmarks-X-Factor_6d413d9a964941028dcadcb14e403a08_,1126,562,248,.mp4.csmil/master.m3u8");

	mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
	mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
	mediaInfo.contentType = 'video/mp4';
	mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
	mediaInfo.metadata.title = "Arvingerne (10:10)";
	mediaInfo.metadata.images = [{'url': "http://www.dr.dk/mu-online/api/1.2/bar/530b09bca11f9d08c8cc3d4c"}];
	
	mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();
	mediaInfo.duration = null;
	mediaInfo.tracks = tracks;

	console.log(mediaInfo);

	var request = new chrome.cast.media.LoadRequest(mediaInfo);
	request.autoplay = true;
	request.currentTime = 0;
	request.activeTrackIds=[1];

	session.loadMedia(request,
		onMediaDiscovered.bind(this, 'loadMedia'),
		onMediaError);



}
function onLaunchError(){
	console.log("sa");
}

function onMediaError(){
	console.log("error ");

}

function onMediaDiscovered(how, media) {
	console.log("onMediaDiscovered");
	currentMedia = media;
}
