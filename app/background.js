
$( document ).ready(function() {
  var player = $("#player");
  if (player){
    console.log(player);
    btnHolder = $(".player-button-holder");
    console.log(btnHolder);
    btnHolder.append('<div class="play-icon" id="test123"><span class="sr-only">Afspil</span></div>');
    $("#test123").append(getCastImg());
    

    $("#castimg").click(function(){
      clickChromeCast();
    });
    $("body").append(getScript("https://www.gstatic.com/cv/js/sender/v1/cast_sender.js"));
    $("body").append(getScript(chrome.extension.getURL("js/cast.js")));
  }

  function getSlug(){
    var array = window.location.pathname.split("/");
    console.log("length " + array.length);

    return array[array.length-1];
  }

  function clickChromeCast(){
    $(".content-overlay").empty();
    var slug = getSlug();
    console.log(slug);

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
  
  function getScript(src){
    var script = $('<script>');
    script.attr("type", "text/javascript");
    script.attr("src", src);
    return script;
  }

  function getCastImg(){
    var img = $('<img>'); 
    img.attr('id', 'castimg');
    img.attr('src', chrome.extension.getURL("img/1.png"));
    img.attr('height', 40);
    return img;
  }

});



