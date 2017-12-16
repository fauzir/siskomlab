<?
$MESS["STATISTIC_ACTIVITY_EXCEEDING_NAME"] = "Batas aktivitas pengunjung terlampaui";
$MESS["STATISTIC_ACTIVITY_EXCEEDING_DESC"] = "# ACTIVITY_TIME_LIMIT # - uji periode waktu (detik)
# ACTIVITY_HITS # - jumlah klik untuk periode pengujian
# ACTIVITY_HITS_LIMIT # - jumlah maksimal klik untuk periode pengujian
# ACTIVITY_EXCEEDING # - aktivitas melebihi
# CURRENT_TIME # - waktu pemblokiran (waktu server)
# DELAY_TIME # - periode pemblokiran
# USER_AGENT # - UserAgent
# SESSION_ID # - ID sesi
# SESSION_LINK # - link ke laporan sesi
# SERACHER_ID # - ID mesin pencari
# SEARCHER_NAME # - nama mesin telusur
# SEARCHER_LINK # - link ke daftar hit mesin pencari
# VISITOR_ID # - ID pengunjung
# VISITOR_LINK # - link ke profil pengunjung
# STOPLIST_LINK # - link untuk menambahkan pengunjung ke daftar-stop ";
$MESS["STATISTIC_DAILY_REPORT_NAME"] = "Laporan statistik situs harian";
$MESS["STATISTIC_DAILY_REPORT_DESC"] = "# EMAIL_TO # - email administrator situs
# SERVER_TIME # - waktu server selama pengiriman laporan
# HTML_HEADER # - header HTML
# HTML_COMMON # - tabel lalu lintas situs (klik, sesi, host, tamu, acara) (HTML)
# HTML_ADV # - tabel kampanye iklan (TOP 10) (HTML)
# HTML_EVENTS # - daftar nama acara (TOP 10) (HTML)
# HTML_REFERERS # - daftar situs pengarah (TOP 10) (HTML)
# HTML_PHRASES # - tabel frase pencarian (TOP 10) (HTML)
# HTML_SEARCHERS # - tabel pengindeksan situs (TOP 10) (HTML)
# HTML_FOOTER # - HTML footer
";
$MESS["STATISTIC_DAILY_REPORT_SUBJECT"] = "# SERVER_NAME #: Statistik situs (# SERVER_TIME #)";
$MESS["STATISTIC_DAILY_REPORT_MESSAGE"] = "# HTML_HEADER #
<font class = 'h2'> Statistik diringkas untuk <font color = '# A52929'> # SITE_NAME # </ font> situs <br>
Data pada <font color = '# 0D716F'> # SERVER_TIME # </ font> </ font>
<br> <br>
<a class='tablebodylink' href='http://#SERVER_NAME#/bitrix/admin/stat_list.php?lang=#LANGUAGE_ID#'> http: //#SERVER_NAME#/bitrix/admin/stat_list.php? lang = # LANGUAGE_ID # </a>
<br
<hr> <br>
# HTML_COMMON #
<br
# HTML_ADV #
<br
# HTML_REFERERS #
<br
# HTML_PHRASES #
<br
# HTML_SEARCHERS #
<br
# HTML_EVENTS #
<br
<hr>
<a class='tablebodylink' href='http://#SERVER_NAME#/bitrix/admin/stat_list.php?lang=#LANGUAGE_ID#'> http: //#SERVER_NAME#/bitrix/admin/stat_list.php? lang = # LANGUAGE_ID # </a>
# HTML_FOOTER #
";
$MESS["STATISTIC_ACTIVITY_EXCEEDING_SUBJECT"] = "# SERVER_NAME #: Batas aktivitas terlampaui";
$MESS["STATISTIC_ACTIVITY_EXCEEDING_MESSAGE"] = "Batas aktivitas terlampaui oleh pengunjung di situs # SERVER_NAME #.
 
Mulai dari # CURRENT_TIME # pengunjung diblokir untuk # DELAY_TIME # detik.
 
Aktivitas - # ACTIVITY_HITS # klik per # ACTIVITY_TIME_LIMIT # detik. (batas - # ACTIVITY_HITS_LIMIT #)
Pengunjung - # VISITOR_ID #
Sesi - # SESSION_ID #
Pencari - [# SERACHER_ID #] # SEARCHER_NAME #
UserAgent - # USER_AGENT #
 
00:10:34.800 --> 00:10:37.400
Gunakan link berikut untuk ditambahkan ke daftar stop:
http: // # SERVER_NAME ## STOPLIST_LINK #
Gunakan link berikut untuk melihat sesi:
http: // # SERVER_NAME ## SESSION_LINK #
Gunakan link berikut untuk melihat profil pengunjung:
http: // # SERVER_NAME ## VISITOR_LINK #
Gunakan tautan berikut untuk melihat klik pencari:
http: // # SERVER_NAME ## SEARCHER_LINK # ";
?>