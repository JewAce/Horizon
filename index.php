<?php
// Include Neptune
//require_once "./_modules/com/Neptune/model/framework/framework.php";

$message = urlencode("We're sorry, this page cannot be found!");

if(isset($_GET['page'])){
    if(!file_exists("./parts/content/" . $_GET['page'] . ".php")){
        header("Location: index.php?page=home&msg=" . $message . "");
    }
} else {
    header("Location: index.php?page=home");
}


if (file_exists("./parts/meta/" . $_GET['page'] . ".php")) {
    include "./parts/meta/" . $_GET['page'] . ".php";
}
?>
<html>
    <?php include "./parts/_include/head.inc.php"; ?>
    <body>
        <?php include "./parts/content/" . $_GET[ 'page' ] . ".php";?>
        <?php include "./parts/_include/script.inc.php"; ?>
    </body>
</html>