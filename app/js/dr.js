		$( document ).ready(function() {

			var player = $("#player");
			if (player){
				$("#castimg").click(function(){
					clickChromeCast();
				});
			}

		});

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
				updateForm(programcard.Title, programcard.PrimaryImageUri, streamUri, subtitleUri);
				//startStreaming(programcard.Title, programcard.PrimaryImageUri, streamUri, subtitleUri);
			});

		}

		function updateForm(title, primaryImageUri, streamUri, subtitleUri){
			$("#streamTitle").val(title);
			$("#streamUrl").val(streamUri);
			$("#streamImageUrl").val(primaryImageUri);
			$("#streamSubUrl").val(subtitleUri);
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