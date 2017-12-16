<?
$MESS["CLU_SLAVE_LIST_TITLE"] = "Slave Databases";
$MESS["CLU_SLAVE_LIST_ID"] = "ID";
$MESS["CLU_SLAVE_LIST_FLAG"] = "Stat";
$MESS["CLU_SLAVE_NOCONNECTION"] = "Sambungan terputus";
$MESS["CLU_SLAVE_UPTIME"] = "uptime";
$MESS["CLU_SLAVE_LIST_BEHIND"] = "Latency (sec)";
$MESS["CLU_SLAVE_LIST_STATUS"] = "Status";
$MESS["CLU_SLAVE_LIST_NAME"] = "Nama";
$MESS["CLU_SLAVE_LIST_DB_HOST"] = "Server";
$MESS["CLU_SLAVE_LIST_DB_NAME"] = "database";
$MESS["CLU_SLAVE_LIST_DB_LOGIN"] = "pemakai";
$MESS["CLU_SLAVE_LIST_WEIGHT"] = "Berat";
$MESS["CLU_SLAVE_LIST_DESCRIPTION"] = "Deskripsi";
$MESS["CLU_SLAVE_LIST_ADD"] = "Add Slave Database";
$MESS["CLU_SLAVE_LIST_ADD_TITLE"] = "Run New Slave Database Wizard";
$MESS["CLU_SLAVE_LIST_MASTER_ADD"] = "Add master/slave database";
$MESS["CLU_SLAVE_LIST_MASTER_ADD_TITLE"] = "Runs the new master/slave database Wizard";
$MESS["CLU_SLAVE_LIST_EDIT"] = "Edit";
$MESS["CLU_SLAVE_LIST_START_USING_DB"] = "Use Database";
$MESS["CLU_SLAVE_LIST_SKIP_SQL_ERROR"] = "Ignore Error";
$MESS["CLU_SLAVE_LIST_SKIP_SQL_ERROR_ALT"] = "Ignore a single SQL error and continue replication";
$MESS["CLU_SLAVE_LIST_DELETE"] = "Hapus";
$MESS["CLU_SLAVE_LIST_DELETE_CONF"] = "Delete connection?";
$MESS["CLU_SLAVE_LIST_PAUSE"] = "Berhenti sebentar";
$MESS["CLU_SLAVE_LIST_RESUME"] = "Lanjut";
$MESS["CLU_SLAVE_LIST_REFRESH"] = "Segarkan";
$MESS["CLU_SLAVE_LIST_STOP"] = "Disuse Database";
$MESS["CLU_SLAVE_BACKUP"] = "backup";
$MESS["CLU_MAIN_LOAD"] = "Minimum Load";
$MESS["CLU_SLAVE_LIST_NOTE"] = "<p>Database replication is the creation and maintenance of multiple copies of the same database which provides the two major features:</p>
</p> 
1) distribute load between a master database and one or more slave databases;<br>
2) use slaves as a hot standby.<br>
</p> 
<p>Important!<br
- Use only the stand-alone servers with fastest possible connectivity for replication.<br>
- The process of replication starts by copying the database contents. For that period of time, the website's public section will be unavailable, but Control Panel will be still accessible. Any data modification occurring during replication may affect proper operation of the website.<br>
</p> 
<p>Replication Guidelines<br>
Step 1: Start the wizard by clicking \"Add Slave Database\". The wizard will check the server configuration and suggest that you add a slave database.<br>
Step 2: Find a required database in the list and select the command \"Use Database\" in the action menu.<br>
Step 3: Follow the wizard instructions.<br>
</p> 
";
?>