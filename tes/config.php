<?
header("Content-Type: application/x-javascript");
$hash = "12345678";
$config = array("appmap" =>
	array("main" => "/tes/",
		"left" => "/tes/menu.php",
		"settings" => "/tes/settings.php",
		"hash" => substr($hash, rand(1, strlen($hash)))
	)
);
echo json_encode($config);