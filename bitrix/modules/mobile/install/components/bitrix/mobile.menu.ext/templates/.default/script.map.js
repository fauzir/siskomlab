{"version":3,"file":"script.min.js","sources":["script.js"],"names":["BX","Menu","BXMobileApp","addCustomEvent","proxy","window","bCalendarShowMobileHelp","this","calendarList","MenuSettings","userId","pullParams","enable","pulltext","message","downtext","loadtext","app","enableInVersion","action","callback","document","location","reload","pullDown","delegate","command","params","USER_ID","COLOR","style","counterCode","ob","updateCounters","counters","obZeroCounter","lang","siteDir","canInvite","calendarFirstVisit","profileUrl","helpUrl","timemanUrl","marketPlaceApps","set","settings","type","isNotEmptyString","onCustomEvent","getMarketPlaceAppName","id","apps","count","length","i","currentItem","init","items","getElementById","that","FastButton","event","onItemClick","buttons","menu-user-accounts","exec","eventCancelBubble","menu-user-help","PageManager","loadPageStart","url","menu-user-timeman","bx24ModernStyle","menu-user-logout","logOut","buttonId","button","bind","addClass","removeClass","page_id","target","isChild","hasClass","parentNode","nodeType","unselectItem","selectItem","getAttribute","setTimeout","name","mpAppFlag","mpAppId","mpAppName","pageId","sideNotifyPanel","pageParams","protocol","host","onclick","item","counterType","value","zeroCounterTS","totalCount","counter","toLowerCase","plus","valueContainer","findChild","className","innerHTML","test","zeroCounter","key","parseInt","prototype","userList","isExtranetUser","listUserSettings","isroot","table_settings","alphabet_index","outsection","openNewPage","openBXTable","closeMenu","platform","localStorage","get","confirm","text","buttonIndex","ajax","json","console","log","response","JSON","parse","token","urlPath","openUrl","bpList","p","useTagsInSearch","webdavList","diskList","storageData","path","encodeURIComponent","entityId","MobileUI","List","show","showTitle","overflowmenu","undefined","table_id","cache","use_sections","loadPage","MobileMenu","addListener","eventName","listObject","Events","ON_ITEM_MORE_CHOOSED","showMenu","title","sort","NAME","ID","post","objectId","sessid","bitrix_sessid","link","alert"],"mappings":"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"}