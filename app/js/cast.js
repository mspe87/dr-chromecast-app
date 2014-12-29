(function() {


	/**
 * Constants of states for Chromecast device 
 **/
 var DEVICE_STATE = {
 	'IDLE' : 0, 
 	'ACTIVE' : 1, 
 	'WARNING' : 2, 
 	'ERROR' : 3,
 };


 var PLAYER_STATE = {
 	'IDLE' : 'IDLE', 
 	'LOADING' : 'LOADING', 
 	'LOADED' : 'LOADED', 
 	'PLAYING' : 'PLAYING',
 	'PAUSED' : 'PAUSED',
 	'STOPPED' : 'STOPPED',
 	'SEEKING' : 'SEEKING',
 	'ERROR' : 'ERROR'
 };


 var Caster = function() {




 	/* device variables */
  // @type {DEVICE_STATE} A state for device
  this.deviceState = DEVICE_STATE.IDLE;

  /* receivers available */
  // @type {boolean} A boolean to indicate availability of receivers
  this.receivers_available = false;

  /* Cast player variables */
  // @type {Object} a chrome.cast.media.Media object
  this.currentMediaSession = null;
  // @type {Number} volume
  this.currentVolume = 0.5;
  // @type {Boolean} A flag for autoplay after load
  this.autoplay = true;
  // @type {string} a chrome.cast.Session object
  this.session = null;
  // @type {PLAYER_STATE} A state for Cast media player
  this.castPlayerState = PLAYER_STATE.IDLE;

  /* Local player variables */
  // @type {PLAYER_STATE} A state for local media player
  this.localPlayerState = PLAYER_STATE.IDLE;


  /* Current media variables */
  // @type {Boolean} Audio on and off
  this.audio = true;
  // @type {Number} A number for current media index
  this.currentMediaIndex = 0;
  // @type {Number} A number for current media time
  this.currentMediaTime = 0;
  // @type {Number} A number for current media duration
  this.currentMediaDuration = -1;
  // @type {Timer} A timer for tracking progress of media
  this.timer = null;
  // @type {Boolean} A boolean to stop timer update of progress when triggered by media status event 
  this.progressFlag = true;
  // @type {Number} A number in milliseconds for minimal progress update
  this.timerStep = 1000;

  /* media contents from JSON */
  this.mediaContents = null;

  this.initializeCaster();



};

Caster.prototype.initializeCaster = function(){

	if (!chrome.cast || !chrome.cast.isAvailable) {
		setTimeout(this.initializeCaster.bind(this), 1000);
		return;
	}

	var sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
	var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
		this.sessionListener.bind(this),
		this.receiverListener.bind(this),
		chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED);
	chrome.cast.initialize(apiConfig, this.onInitSuccess.bind(this), this.onError.bind(this));
	this.initializeUI();
};

Caster.prototype.sessionListener = function(e){
	this.session=e;
	console.log("sessionListener " + e);
	console.log("sessionListener this" + this.session);
	console.log(this);

};
Caster.prototype.receiverListener = function(e){
	console.log("receiverListener " + e);

};

Caster.prototype.onInitSuccess = function(){
	console.log("onInitSuccess init");
	console.log(this);
	console.log(this.session);
	console.log("session " + this.session);
};

Caster.prototype.onError = function(){
	console.log("onError error");
};

Caster.prototype.onRequestSessionSuccess = function(e){
	this.session = e;
	console.log("got a session " + e);
};

Caster.prototype.onLaunchError = function(){
	console.log("onLaunchError error");
};

Caster.prototype.launchApp = function() {
	console.log("launching app...");
	chrome.cast.requestSession(
		this.sessionListener.bind(this),
		this.onLaunchError.bind(this));
};


/**
 * Stops the running receiver application associated with the session.
 */
 Caster.prototype.stopApp = function() {
 	console.log(this);
 	this.session.stop(this.onStopAppSuccess.bind(this, 'Session stopped'),
 		this.onError.bind(this));    

 };

/**
 * Callback function for stop app success 
 */
 Caster.prototype.onStopAppSuccess = function(message) {
 	console.log(message);
 	this.deviceState = DEVICE_STATE.IDLE;
 	this.castPlayerState = PLAYER_STATE.IDLE;
 	this.currentMediaSession = null;
  //clearInterval(this.timer);
  //this.updateDisplayMessage();

  // continue to play media locally
  console.log("current time: " + this.currentMediaTime);
  //this.playMediaLocally();
  //this.updateMediaControlUI();
};

Caster.prototype.startStreaming = function(title, imageUri, streamUri, subtitleUri){
	console.log("streamUri is " + streamUri);
	console.log("subtitle Uri is " + subtitleUri);
	console.log("title " + title);
	console.log("imageUri " + imageUri);

	if (this.session!==null){

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

		      this.session.loadMedia(request,
		      	this.onMediaDiscovered.bind(this, 'loadMedia'),
		      	this.onMediaError.bind(this));

		  }
		};



		Caster.prototype.onMediaDiscovered = function(how, media) {
			console.log("onMediaDiscovered");
			currentMedia = media;
		};

		Caster.prototype.onMediaError = function() {
			console.log("onMediaError ");
		};

		Caster.prototype.initializeUI = function() {
			document.getElementById("casticonidle").addEventListener('click', this.launchApp.bind(this));
			document.getElementById("casticonactive").addEventListener('click', this.stopApp.bind(this));

		};





		window.Caster = Caster;
	})();