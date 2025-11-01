<?php
header('Content-Type: application/json');
$dir = './gal/';
$files = array_filter(scandir($dir), fn($file) => in_array(pathinfo($file, PATHINFO_EXTENSION), ['jpg', 'png']));
$images = array_map(fn($file) => ['id' => pathinfo($file, PATHINFO_FILENAME), 'filename' => $file, 'category' => 'all'], array_values($files));
echo json_encode($images);
?>