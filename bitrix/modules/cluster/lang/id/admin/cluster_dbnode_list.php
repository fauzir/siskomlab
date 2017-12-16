<?
$MESS["CLU_DBNODE_LIST_TITLE"] = "Vertical Sharding: Module Databases";
$MESS["CLU_DBNODE_LIST_ID"] = "ID";
$MESS["CLU_DBNODE_LIST_FLAG"] = "Stat";
$MESS["CLU_DBNODE_NOCONNECTION"] = "Sambungan terputus";
$MESS["CLU_DBNODE_UPTIME"] = "uptime";
$MESS["CLU_DBNODE_UPTIME_UNKNOWN"] = "tidak diketahui";
$MESS["CLU_DBNODE_LIST_ACTIVE"] = "Aktif";
$MESS["CLU_DBNODE_LIST_STATUS"] = "Status";
$MESS["CLU_DBNODE_LIST_NAME"] = "Nama";
$MESS["CLU_DBNODE_LIST_DB_HOST"] = "Server";
$MESS["CLU_DBNODE_LIST_DB_NAME"] = "database";
$MESS["CLU_DBNODE_LIST_DB_LOGIN"] = "pemakai";
$MESS["CLU_DBNODE_LIST_MODULES"] = "modul";
$MESS["CLU_DBNODE_LIST_DESCRIPTION"] = "Deskripsi";
$MESS["CLU_DBNODE_LIST_ADD"] = "Add New Database";
$MESS["CLU_DBNODE_LIST_ADD_TITLE1"] = "Run database connection wizard";
$MESS["CLU_DBNODE_LIST_ADD_TITLE2"] = "Add New Database Connection";
$MESS["CLU_DBNODE_LIST_EDIT"] = "Edit";
$MESS["CLU_DBNODE_LIST_START_USING_DB"] = "Use Database";
$MESS["CLU_DBNODE_LIST_STOP_USING_DB"] = "Stop Using This Database";
$MESS["CLU_DBNODE_LIST_NOTE1"] = "The data tables of certain modules may be moved to a separate database thus distributing the database load among several servers. To move the tables, first click \"Add New Database\". After you have added a database, you have to transfer the module data using one of the following methods.</p>
<p>The first way is applicable to MySQL only. Find the required database in the list and select the command \"Use Database\" in the menu action. Then, follow the wizard instructions.</p>
<p>Alternatively, you can uninstall the module and install in anew. At the wizard's first step, select the database the module will use. The currently existing database tables will not be transfered.</p>
The following modules support clustering:";
$MESS["CLU_DBNODE_LIST_NOTE2"] = "<p><i>Vertical sharding involves delegation of queries from selected modules being divided among 2 or more databases. Each selected module has a designated database connection.</i></p>
<p><i>Horizontal sharding implies distributing uniform data (e.g. user profiles) across separate databases.</i></p>";
$MESS["CLU_DBNODE_LIST_DELETE"] = "Hapus";
$MESS["CLU_DBNODE_LIST_DELETE_CONF"] = "Delete connection?";
$MESS["CLU_DBNODE_LIST_REFRESH"] = "Segarkan";
?>