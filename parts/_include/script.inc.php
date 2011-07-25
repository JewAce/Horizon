<!-- JS source -->
<script type="text/javascript" src="//<?php echo $serverName; ?>/_modules/javascript/jquery/jquery.min.js"></script>

<?php if(file_exists("/_modules/javascript/jquery/jquery-ui.min.js")) ?>
  <script type="text/javascript" src="//<?php echo $serverName; ?>/_modules/javascript/jquery/jquery-ui-1.8.11.custom.min.js"></script>

<!-- Misc Plugins -->
<script type="text/javascript" src="//<?php echo $serverName; ?>/_modules/javascript/jquery/jq.plugins.js?<?php echo $revision; ?>"></script>
<!-- AZIMUTH Object -->
<script type="text/javascript" src="//<?php echo $serverName; ?>/_modules/javascript/azimuth/azimuth-0.0.1.js?<?php echo $revision; ?>"></script>

<script type="text/javascript" src="//<?php echo $serverName; ?>/_modules/javascript/page/common.js?<?php echo $revision; ?>"></script>
<!--default page Javascript include-->
<?php
if (file_exists("./_modules/javascript/page/" . $_GET['page'] . ".js")) { ?>
    <script type="text/javascript" src="//<?php echo $serverName; ?>/_modules/javascript/page/<?php echo $_GET['page']; ?>.js?v=<?php echo $revision; ?>"></script>
<?php } ?>