<?php
	$url="https://mityurl.com/y/TEDT/r";
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); // Must be set to true so that PHP follows any "Location:" header
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$a = curl_exec($ch); // $a will contain all headers

	$url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL); // This is what you need, it will return you the last effective URL
	preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $url, $match);
	$id = $match[1];

	function youtube_title($id) {
		$id = $id;
		$get_context_options = array(
			"ssl" => array(
				"verify_peer"=>false,
				"verify_peer_name"=>false,
			),
		);

		$videotitle = file_get_contents("https://www.googleapis.com/youtube/v3/videos?id=".$id."&key=AIzaSyA6aWCqJIKCIeMXN-MrOxT9HOUPSy1BPpo&fields=items(id,snippet(title),statistics)&part=snippet,statistics", false, stream_context_create($get_context_options));
		error_log($videotitle);

		if ($videotitle) {
			$json = json_decode($videotitle, true);
			return $json['items'][0]['snippet']['title'];
		} else {
			return false;
		}
	}

	$title = youtube_title($id);

	$response = array(
		'url' => $url,
		'title' => $title);

	echo json_encode($response);
