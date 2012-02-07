<?php
$imagesPath = @$_GET['path'];
$imagesUrlPrefix = @$_GET['url_prefix'];

if (!$imagesPath) {
	$imagesPath = '';
}

if (!$imagesUrlPrefix) {
	$imagesUrlPrefix = '';
}

$images = array_merge(
		glob($imagesPath.'*.gif'),
		glob($imagesPath.'*.jpg'),
		glob($imagesPath.'*.png')
		);
		
echo 'window.__preloadResources = [';
for ($i=0; $i<count($images); $i++) {
	echo "\t".$imagesUrlPrefix.'\''.$images[$i].'\'';
	if ($i+1<count($images)) {
		echo ',';
	}
	echo "\n";
}
echo '];';