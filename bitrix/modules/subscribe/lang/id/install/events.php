<?
$MESS["SUBSCRIBE_CONFIRM_NAME"] = "Konfirmasi berlangganan";
$MESS["SUBSCRIBE_CONFIRM_DESC"] = "# ID # - ID langganan
# EMAIL # - email berlangganan
# CONFIRM_CODE # - kode konfirmasi
# SUBSCR_SECTION # - bagian dengan halaman edit berlangganan (ditentukan dalam pengaturan)
# USER_NAME # - nama pelanggan (opsional)
# DATE_SUBSCR # - tanggal penambahan / perubahan alamat

";
$MESS["SUBSCRIBE_CONFIRM_SUBJECT"] = "# SITE_NAME #: Konfirmasi langganan
";
$MESS["SUBSCRIBE_CONFIRM_MESSAGE"] = "Pesan informasi dari # SITE_NAME #
12:01
 
Halo.
 
Anda telah menerima pesan ini karena permintaan berlangganan dibuat untuk alamat Anda untuk berita dari # SERVER_NAME #.
 
Berikut adalah info rinci tentang langganan Anda:
 
Email langganan .............. E-mail:
Tanggal penambahan / pengeditan email .... # DATE_SUBSCR #
 
Kode konfirmasi anda: # CONFIRM_CODE #
 
Silahkan klik pada link yang diberikan dalam surat ini untuk mengkonfirmasi kepelangganan anda.
http: //#SERVER_NAME##SUBSCR_SECTION#subscr_edit.php? ID = # ID # & CONFIRM_CODE = # CONFIRM_CODE #
 
Atau buka halaman ini dan masukkan kode konfirmasi Anda secara manual:
http: //#SERVER_NAME##SUBSCR_SECTION#subscr_edit.php? ID = # ID #
 
Anda tidak akan menerima pesan apapun sampai Anda mengirimkan konfirmasi kepada Anda.
 
Lampiran 1
Harap simpan pesan ini karena berisi informasi untuk otorisasi.
Dengan menggunakan kode konfirmasi, Anda dapat mengubah parameter berlangganan atau
Berhenti berlangganan
 
Edit parameter:
http: //#SERVER_NAME##SUBSCR_SECTION#subscr_edit.php? ID = # ID # & CONFIRM_CODE = # CONFIRM_CODE #
 
Berhenti berlangganan
http: //#SERVER_NAME##SUBSCR_SECTION#subscr_edit.php? ID = # ID # & CONFIRM_CODE = # CONFIRM_CODE # & action = berhenti berlangganan
Lampiran 1
 
Ini adalah pesan yang dibuat secara otomatis.
";
?>