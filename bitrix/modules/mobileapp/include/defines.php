<?
define("MOBILE_APP_ADMIN", true);
define("MOBILE_APP_ADMIN_PATH","/bnpt/admin/mobile");
define("MOBILE_APP_MENU_FILE","/bnpt/admin/mobile/.mobile_menu.php");
define("MOBILE_APP_BUILD_MENU_EVENT_NAME","OnBeforeAdminMobileMenuBuild");

define("BX_SKIP_SESSION_EXPAND", true);
define('BX_PULL_MOBILE', true);
define('BX_PULL_SKIP_LS', true);
define('BX_PULL_SKIP_WEBSOCKET', true);
if (!defined('BX_DONT_SKIP_PULL_INIT'))
	define("BX_PULL_SKIP_INIT", true);
?>
