{"version":3, "file":"kernel_rest.js", "sections": [{"offset": { "line": 4, "column": 0 }, "map": {"version":3,"file":"/bitrix/js/rest/applayout.min.js","sources":["/bitrix/js/rest/applayout.js"],"names":["BX","namespace","rest","AppLayout","params","this","firstRun","appHost","appProto","authId","authExpires","refreshId","placement","formName","frameName","loaderName","layoutName","ajaxUrl","controlUrl","isAdmin","staticHtml","id","appId","appV","appI","appSid","memberId","restPath","proto","userOptions","appOptions","placementOptions","userSelectorControl","userSelectorControlCallback","bAccessLoaded","_appOptionsStack","expandPopup","expandPopupContent","_inited","_destroyed","deniedInterface","selectUserCallback_1_value","messageInterface","initializePlacement","bind","window","proxy","receiveMessage","prototype","init","document","forms","loader","addClass","removeClass","setTimeout","remove","src","action","submit","destroy","unbind","parentNode","removeChild","e","event","origin","cmd","split","data","args","JSON","parse","util","in_array","cb","_cb","DoNothing","delegate","res","f","contentWindow","postMessage","stringify","apply","denyInterface","deniedList","array_merge","sendAppOptions","length","stack","opts","i","push","name","value","sessid","bitrix_sessid","options","ajax","method","dataType","url","onsuccess","loadControl","control","processScriptsConsecutive","reInstall","setInstallFinish","selectUserCallback_0","v","array_values","defer","close","selectUserCallback_1","hideUpdate","version","save","adjustPopup","isShown","node","wnd","GetWindowInnerSize","style","height","innerHeight","width","innerWidth","adjustPosition","initizalizePlacementInterface","parent","extend","events","clone","superclass","toUpperCase","placementInterface","MessageInterface","MessageInterfacePlacement","initializePlacementByEvent","addCustomEvent","PlacementInterface","hasOwnProperty","getInitData","LANG","message","DOMAIN","location","host","PROTOCOL","PATH","AUTH_ID","AUTH_EXPIRES","REFRESH_ID","MEMBER_ID","FIRST_RUN","IS_ADMIN","INSTALL","USER_OPTIONS","APP_OPTIONS","PLACEMENT","PLACEMENT_OPTIONS","getInterface","result","command","refreshAuth","loadJSON","alert","resizeWindow","parseInt","p","pos","setTitle","setTitleBar","title","UpdatePageTitle","setScroll","scroll","scrollTo","GetWindowScrollPos","scrollLeft","setUserOption","setAppOption","setInstall","h","href","replace","indexOf","selectUser","mult","show","onchange","Math","random","site_id","PopupWindowManager","create","autoHide","content","zIndex","setButtons","PopupWindowButton","text","className","click","display","selectAccess","Access","Init","groups","disabled","startValue","SetSelected","ShowForm","callback","arRights","provider","selectCRM","loaded","entityType","multiple","obCrm","Open","AddOnSaveListener","Clear","reloadWindow","reload","imCallTo","BXIM","callTo","userId","video","imPhoneTo","phoneTo","phone","imOpenMessenger","openMessenger","dialogId","imOpenHistory","openHistory","openApplication","PopupWindow","closeByEsc","closeIcon","titleBar","onPopupClose","get","overlay","opacity","props","html","setContent","post","popup","param","parentsid","innerHTML","closeApplication","placementBindEvent","arguments","removeCustomEvent","layoutList","placementList","set","sid","getPlacement","setPlacement","ob","initialize","layout","s","ss","r","slice","join"],"mappings":"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"}},{"offset": { "line": 8, "column": 0 }, "map": {"version":3,"file":"/bitrix/js/rest/marketplace.min.js","sources":["/bitrix/js/rest/marketplace.js"],"names":["BX","namespace","rest","Marketplace","ajaxPath","query","action","data","callback","sessid","bitrix_sessid","ajax","dataType","method","url","onsuccess","onfailure","error_type","error","install","params","location","href","loaded","popup","PopupWindowManager","create","autoHide","zIndex","offsetLeft","offsetTop","overlay","draggable","restrict","closeByEsc","closeIcon","right","top","buttons","button","PopupWindowButton","text","message","className","events","click","checked","innerHTML","hasClass","buttonNode","form","document","forms","addClass","queryParam","code","CODE","VERSION","version","CHECK_HASH","check_hash","install_hash","INSTALL_HASH","delegate","result","error_description","show","redirect","util","remove_url_param","this","PopupWindowButtonLink","popupWindow","close","content","onAfterPopupShow","post","setContent","defer","adjustPosition","uninstallConfirm","uninstall","clean","alert","reload","reinstall","id","buy","bindElement","priceList","menu","i","length","push","TEXT","LINK","PopupMenu","angle","setRights","appId","siteId","Access","Init","other","disabled","disabled_g2","disabled_cr","groups","socnetgroups","p","app_id","site_id","SetSelected","ShowForm","bind","showSelected","arRights","rights"],"mappings":"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"}}]}