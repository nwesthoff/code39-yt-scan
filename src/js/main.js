jQuery(document).ready(onDocReady);

function onDocReady () {
	console.log('jQuery done');
	initScan();
}

var code;
var lastResult;

function initScan(){
	Quagga.init({
	  inputStream : {
	    name : "Live",
	    type : "LiveStream",
			constraints: {
          facingMode: "environment",
      },
	    target: document.getElementById('interactive')    // Or '#yourElement' (optional)
	  },
	  decoder : {
	    readers : ["code_39_reader"]
	  }
	}, function(err) {
	    if (err) {
	        console.log(err);
	        return
	    }
			displayStatus("Finished set-up, ready to scan.");
	    Quagga.start();
	});

	Quagga.onDetected(function(data){
		code = data.codeResult.code;

		if (lastResult !== code) {
			displayStatus("Barcode Detected");
      lastResult = code;
			getUrl(code);
    }
	});
}

function getUrl(code){
	var barcode = code;

	$.getJSON( "/barcode-to-youtube/static/databases/videos.json", function( data ) {
		var	videos = data;

		function videoExists(arr, val) {
			return arr.some(function(arrVal) {
				return val === arrVal.id;
			});
		}

		function videoUrl(arr, val){
			return arr.find(function(arrVal) {
				return val === arrVal.id
			});
		}

		if (videoExists(videos, barcode)) {
			displayStatus("Video found.");
			var url = videoUrl(videos, barcode).url,
				title = videoUrl(videos, barcode).title;

			displayLink(url, title)
		} else {
			displayStatus("Retrieving new video url.");
			$.ajax({
				type: 'GET',
				url: '/barcode-to-youtube/get-url.php',
				dataType: 'json',
				cache: false,
				success: function(data){
					addVideo(videos, barcode, data.url, data.title);
				}
			});
		}
	});
};

function displayLink(url, title){
	$('#youtube-url').html($('<a href="'+url+'">'+title+'</a>'));
};

function displayStatus(status){
	$('#youtube-url').html($('<div class="loader"></div><span>'+status+'</span>'));
};

function addVideo(videos, id, url, title) {
	videos.push({
		"id" : id,
		"title" : title,
		"url" : url
	});

	var newvideos = JSON.stringify(videos);
	displayLink(url, title);

	$.post('/barcode-to-youtube/save-json.php', {
		newvideos: newvideos
	}, function(response){
		// ???
	});

}

function getNewURL() {

}
