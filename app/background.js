
$( document ).ready(function() {
  var player = $("#player");
  if (player){
        console.log(player);
    btnHolder = $(".player-button-holder");
    console.log(btnHolder);
    btnHolder.append('<div class="play-icon" id="test123"><span class="sr-only">Afspil</span></div>');
    $("#test123").append(getCastImg());
    

    $("body").append(getScript("https://www.gstatic.com/cv/js/sender/v1/cast_sender.js"));
    $("body").append(getScript(chrome.extension.getURL("js/cast.js")));
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



