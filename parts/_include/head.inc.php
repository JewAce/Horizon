<?php
$documentRoot = $_SERVER["DOCUMENT_ROOT"];
$serverName = $_SERVER["SERVER_NAME"];
$curFile = rtrim(substr($_SERVER["SCRIPT_NAME"], strrpos($_SERVER["SCRIPT_NAME"], "/") + 1), ".php");

//if ($serverName == "localhost") {
//    $local = true;
//    $serverName = $serverName . "/path/to/localhost";
//}
?>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
  <meta name="author" content="Azimuth 360" />

  <?php
  // META INFO
  if (isset($pageName))
    $title = "" . $pageName;
  
  if(isset($title))
  echo '<title>' .  $title . '</title>';
  
  if (isset($description))
    echo '<meta name="description" content="' . $description . '" />';
  
  if (isset($keywords))
    echo '<meta name="keywords" content="' . $keywords . '" />';

  if (file_exists("./favicon.png"))
    echo '<link rel="shortcut icon" type="image/x-icon" href="//<?php echo $serverName; ?>/favicon.png" />';
?>
  
  <link media="screen, projection" rel="stylesheet" type="text/css" href="//<?php echo $serverName; ?>/css/style.css" />
  <? if(file_exists("/css/jquery-ui.min.css")) ?>
    <link media="screen, projection" rel="stylesheet" type="text/css" href="//<?php echo $serverName; ?>/css/jquery-ui.min.css" />

<?php if(file_exists("./css/" . $_GET['page'] . ".css")) ?>
  <link media="screen, projection" rel="stylesheet" type="text/css" href="//'.   $serverName .'/css/' . $_GET['page'] .'.css" />

  <!-- IE HACKS -->
<? if (file_exists('./css/ie')) {
  if (file_exists("./css/ie/ie6.css")) {
      echo '<!--[if IE 6]><link media="screen, projection" rel="stylesheet" type="text/css" href="//<?php echo $serverName; ?>/css/ie/ie6.css" /><![endif]-->';
  }
  if (file_exists("./css/ie/ie7.css")) {
      echo '<!--[if IE 7]><link media="screen, projection" rel="stylesheet" type="text/css" href="//<?php echo $serverName; ?>/css/ie/ie7.css" /><![endif]-->';
  }
  if (file_exists('./css/ie/ie8.css')) {
      echo '<!--[if IE 8]><link media="screen, projection" rel="stylesheet" type="text/css" href="//<?php echo $serverName; ?>/css/ie/ie8.css" /><![endif]-->';
  }
} ?>
  <!-- END HACKS -->