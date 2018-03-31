<?php
	$updatedData = $_POST['newvideos'];
	file_put_contents('static/databases/videos.json', $updatedData);
	//return the url to the saved file
