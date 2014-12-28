$( document ).ready(function() {

	var player = $("#player");
	if (player){
		$("#castimg").click(function(){
			clickChromeCast();
		});
	}

});

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

function startStreaming(title, imageUri, streamUri, subtitleUri){
		//subtitleUri = "http://192.168.0.7:8888/test.vtt";


		console.log("streamUri is " + streamUri);
		console.log("subtitle Uri is " + subtitleUri);
		console.log("title " + title);
		console.log("imageUri " + imageUri);

		if (app.session!==null){

			var mediaInfo = new chrome.cast.media.MediaInfo(streamUri);

			mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
			mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
			mediaInfo.contentType = 'video/mp4';
			mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
			mediaInfo.metadata.title = title;
			mediaInfo.metadata.images = [{'url': imageUri}];


			mediaInfo.duration = null;


			if (subtitleUri){
		      	var danishSubtitle = new chrome.cast.media.Track(1, // track ID
		      		chrome.cast.media.TrackType.TEXT);
		      	danishSubtitle.trackContentId = subtitleUri;
		      	danishSubtitle.trackContentType = 'text/vtt';
		      	danishSubtitle.subtype = chrome.cast.media.TextTrackType.SUBTITLES;
		      	danishSubtitle.name = 'Danske undertekster';
		      	danishSubtitle.language = 'da';
		      	danishSubtitle.customData = null;
		      	var tracks = [danishSubtitle];
		      	mediaInfo.tracks = tracks;
		      	mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle();

		      } else {
		      	console.log("no subtitles");
		      }




		      console.log(mediaInfo);

		      var request = new chrome.cast.media.LoadRequest(mediaInfo);
		      request.autoplay = true;
		      request.currentTime = 0;
		      if (subtitleUri){
		      	request.activeTrackIds=[1];
		      }

		      app.session.loadMedia(request,
		      	onMediaDiscovered.bind(this, 'loadMedia'),
		      	onMediaError);



		  }
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
			app.session = e;
			console.log("got a session " + e);
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




















		function getSlug(url){
			var array = url.split("/");
			console.log("length " + array.length);

			return array[array.length-1];
		}

		function clickChromeCast(){
			$(".content-overlay").empty();
			startPlayIng(window.location.pathname);

			
		}

		function startPlayIng(url){
			var slug = getSlug(url);
			$.get( "http://www.dr.dk/mu-online/api/1.2/programcard/"+slug, function( data ) {
				handleProgramCard(data);
			});
		}

		function handleProgramCard(programcard){
			console.log(programcard);
			console.log(programcard.PrimaryAsset.Uri);
			$.get( programcard.PrimaryAsset.Uri, function( data ) {
				var streamUri = getStreamUri(data);
				var subtitleUri = getSubtitleUri(data);
				console.log("streamUri is " + streamUri);
				console.log("subtitle Uri is " + subtitleUri);
				console.log("title " + programcard.Title);
				console.log("imageUri " + programcard.PrimaryImageUri);
				startStreaming(programcard.Title, programcard.PrimaryImageUri, streamUri, subtitleUri);
			});

		}

		function getSubtitleUri(manifest){
			console.log("getSubtitleUri");
			console.log(manifest);
			console.log(manifest.SubtitlesList);
			for (var i=0; i<manifest.SubtitlesList.length; i++){
				var current = manifest.SubtitlesList[i];
				console.log(current);
				if (current.Language==="Danish"){
					return current.Uri;
				}
			}
		}

		function getStreamUri(manifest){
			console.log("getStreamUri");
			console.log(manifest);
			for (var i=0; i<manifest.Links.length; i++){
				var current = manifest.Links[i];
				if (current.Target === "HLS"){
					return current.Uri;
				}
			}
		}







