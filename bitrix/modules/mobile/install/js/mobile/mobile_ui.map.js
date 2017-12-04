{"version":3,"file":"mobile_ui.min.js","sources":["mobile_ui.js"],"names":["window","BX","MobileUI","TextField","show","params","userId","message","panelParams","smileButton","useImageButton","mentionDataSource","outsection","url","attachFileSettings","resize","quality","destinationType","sourceType","targetWidth","targetHeight","encodingType","mediaType","allowsEdit","correctOrientation","saveToPhotoAlbum","popoverOptions","cameraDirection","showAttachedFiles","sendLocalFileMethod","maxAttachedFilesCount","attachButton","items","id","name","dataSource","multiple","TABLE_SETTINGS","searchField","showtitle","modal","text","action","callback","BXMPage","TextPanel","createLoader","loader","this","setText","view","parentNode","overlay","style","top","document","body","scrollTop","screen","height","appendChild","addEventListener","_prevent","hide","removeChild","removeEventListener","e","preventDefault","onCancel","textView","innerHTML","_onCancel","loaderView","create","props","className","children","attrs","html","events","click","bottomPanel","bindHover","node","bind","addClass","removeClass","panel","holderContainer","holder","buttons","setButtons","buttonsArray","clear","i","length","push","FastClick","attach","firstChild","addCopyableDialog","textBlockClass","getTextFunction","MobileApp","Gesture","addLongTapListener","BXMobileApp","UI","ActionSheet","title","textBlock","copyableBlock","findChild","app","exec","NotificationBar","color","textColor","groupId","maxLines","align","isGlobal","useCloseButton","autoHideTimeout","hideOnTap","setTimeout","List","onEvent","data","list","objectId","ListObject","internalId","showMenu","instance","onCustomEvent","eventName","Events","ON_ITEM_MORE_CHOOSED","ON_MENU_ITEM_CHOOSED","enableInVersion","Table","addListener","listener","addCustomEvent","BXCordovaPlugin","eventListener","proxy","jsCallbackProvider"],"mappings":"CAAC,WAMA,GAAIA,OAAOC,GAAGC,SACb,MAEDF,QAAOC,GAAGC,UAETC,WAaCC,KAAM,SAAUC,GAEf,GAAIC,GAASL,GAAGM,QAAQ,UACxB,IAAIC,IACHC,eACAC,eAAgB,KAChBC,mBACCC,WAAc,MACdC,IAAO,mEAERC,oBACCC,QACCC,QAAW,GACXC,gBAAmB,EACnBC,WAAc,EACdC,YAAe,IACfC,aAAgB,IAChBC,aAAgB,EAChBC,UAAa,EACbC,WAAc,KACdC,mBAAsB,MACtBC,iBAAoB,KACpBC,eAAkB,KAClBC,gBAAmB,GAEpBC,kBAAqB,KACrBC,oBAAuB,SACvBC,sBAAyB,GAE1BC,cACCC,QAEEC,GAAM,OACNC,KAAQjC,GAAGM,QAAQ,eACnB4B,YACCC,SAAY,KACZvB,IAAO,qEAAuEP,EAC9E+B,gBACCC,YAAe,KACfC,UAAa,KACbC,MAAS,MACTN,KAAQjC,GAAGM,QAAQ,6BAKrB0B,GAAM,YACNC,KAAQjC,GAAGM,QAAQ,sBAGnB0B,GAAM,SACNC,KAAQjC,GAAGM,QAAQ,sBAMvB,IAAIF,EAAO,QACX,CACCG,EAAYiC,KAAOpC,EAAO,QAG3B,GAAIA,EAAO,cAAgBA,EAAO,cAAgB,KAClD,CACCG,EAAYC,YAAc,GAG3B,GAAIJ,EAAO,gBAAkBA,EAAO,gBAAkB,KACtD,CACCG,EAAYG,qBAGb,GAAIN,EAAO,wBAA2BA,GAAO,kBAAqB,WAClE,OACQG,GAAY,eACnBA,GAAY,cAAgBH,EAAO,qBAE/B,IAAIA,EAAO,iBAAmBA,EAAO,iBAAmB,KAC7D,OACQG,GAAY,oBAEf,CACJ,GAAIH,EAAO,iBACX,CACCG,EAAY,sBAAsB,UAAYH,EAAO,iBAGtD,GAAIA,EAAO,oBAAsBA,EAAO,oBAAsB,KAC9D,CACCG,EAAY,sBAAsB,uBAAyB,SAG5D,GAAIH,EAAO,iBACX,CACCG,EAAY,sBAAsB,SAAWH,EAAO,kBAItD,UAAYA,EAAO,WAAc,YACjC,CACCG,EAAYkC,OAASrC,EAAO,UAE7B,UAAYA,EAAO,YAAe,YAClC,CACCG,EAAYmC,SAAWtC,EAAO,WAG/BuC,QAAQC,UAAUzC,KAAKI,EAEvB,OAAOA,KAGTsC,aAAc,WAEb,GAAIC,IACH3C,KAAM,SAAUqC,GAEf,GAAIA,EACJ,CACCO,KAAKC,QAAQR,GAGd,IAAKO,KAAKE,KAAKC,WACf,CACCH,KAAKI,QAAQC,MAAMC,IAAMC,SAASC,KAAKC,UAAY,IACnDT,MAAKE,KAAKG,MAAMC,IAAMC,SAASC,KAAKC,UAAYC,OAAOC,OAAS,EAAI,IAAM,IAE1EJ,UAASC,KAAKI,YAAYZ,KAAKI,QAC/BG,UAASC,KAAKI,YAAYZ,KAAKE,KAC/BK,UAASC,KAAKK,iBAAiB,YAAab,KAAKc,UAGlD,MAAOd,OAERe,KAAM,WAEL,GAAIf,KAAKE,KAAKC,WACd,CAECJ,EAAOG,KAAKC,WAAWa,YAAYhB,KAAKI,QACxCL,GAAOG,KAAKC,WAAWa,YAAYhB,KAAKE,KACxCK,UAASC,KAAKS,oBAAoB,YAAajB,KAAKc,YAGtDA,SAAU,SAAUI,GAEnBA,EAAEC,kBAEHC,SAAU,WAET,MAAO,OAERlB,KAAM,KACNmB,SAAU,KACVpB,QAAS,SAAUR,GAElBO,KAAKqB,SAASC,UAAY7B,GAI5B,IAAI8B,GAAY,WAGf,GAAIxB,EAAOqB,WACX,CACCrB,EAAOgB,QAIT,IAAIS,GAAavE,GAAGwE,OAAO,SAC1BC,OACCC,UAAW,yBAEZC,UACC3E,GAAGwE,OAAO,MACTG,UACC3E,GAAGwE,OAAO,MACTI,OACClB,OAAQ,OACRN,MAAO,4CAERuB,UACC3E,GAAGwE,OAAO,OACTC,OACCC,UAAW,4BAOjB1E,GAAGwE,OAAO,MACTG,UACC3E,GAAGwE,OAAO,MACTI,OACClB,OAAQ,OACRN,MAAO,4CAERuB,UACC7B,EAAOsB,SAAWpE,GAAGwE,OAAO,OAC3BC,OACCC,UAAW,oCAOjB1E,GAAGwE,OAAO,MACTG,UACC3E,GAAGwE,OAAO,MACTC,SACAG,OACClB,OAAQ,OACRN,MAAO,sBAERuB,UACC3E,GAAGwE,OAAO,UACTK,KAAM7E,GAAGM,QAAQ,cACjBwE,QACCC,MAAST,aAWjBxB,GAAOG,KAAOsB,CACdzB,GAAOK,QAAUnD,GAAGwE,OAAO,OAC1BC,OACCC,UAAW,6BAGb,OAAO5B,IAGRkC,YAAa,WAGZ,GAAIC,GAAY,SAAUC,GAEzBlF,GAAGmF,KAAKD,EAAM,aAAc,WAE3BlF,GAAGoF,SAASF,EAAM,yBAEnBlF,IAAGmF,KAAKD,EAAM,WAAY,WAEzBlF,GAAGqF,YAAYH,EAAM,0BAIvB,IAAII,IACHC,gBAAiB,KACjBC,OAAQxF,GAAGwE,OAAO,OACjBC,OACCC,UAAW,0BAGbQ,KAAMlF,GAAGwE,OAAO,OACfC,OACCC,UAAW,kBAGbe,WAKAC,WAAY,SAAUC,GAErB5C,KAAK6C,OAEL,KAAK,GAAIC,GAAI,EAAGA,EAAIF,EAAaG,OAAQD,IACzC,CACC,GAAIA,EAAI,EACR,CACC9C,KAAKmC,KAAKvB,YAAY3D,GAAGwE,OAAO,OAC/BC,OACCC,UAAW,6BAKd3B,KAAK0C,QAAQM,KAAK/F,GAAGwE,OAAO,OAC3BK,KAAMc,EAAaE,GAAG5D,KACtB6C,QACCC,MAASY,EAAaE,GAAGnD,YAK3B,IAAIiD,EAAaE,GAAGnB,UACpB,CACC1E,GAAGoF,SAASrC,KAAK0C,QAAQ1C,KAAK0C,QAAQK,OAAS,GAAIH,EAAaE,GAAGnB,WAGpEO,EAAUlC,KAAK0C,QAAQ1C,KAAK0C,QAAQK,OAAS,GAC7CE,WAAUC,OAAOlD,KAAK0C,QAAQ1C,KAAK0C,QAAQK,OAAS,GACpD9F,IAAGoF,SAASrC,KAAK0C,QAAQ1C,KAAK0C,QAAQK,OAAS,GAAI,gBAEnD/C,MAAKmC,KAAKvB,YAAYZ,KAAK0C,QAAQ1C,KAAK0C,QAAQK,OAAS,IAG1DxC,SAASC,KAAKI,YAAYZ,KAAKmC,KAC/B,IAAIK,GAAkBxC,KAAKwC,iBAAmB,KAAOxC,KAAKwC,gBAAkBjC,SAASC,IACrF,KAAKR,KAAKyC,OAAOtC,WACjB,CACCqC,EAAgB5B,YAAYZ,KAAKyC,UAKnCI,MAAO,WAGN,GAAI7C,KAAKmC,MAAQnC,KAAKmC,KAAKhC,WAC3B,CACCH,KAAKmC,KAAKhC,WAAWa,YAAYhB,KAAKmC,KACtC,OAAOnC,KAAKmC,KAAKgB,WAAY,CAC5BnD,KAAKmC,KAAKnB,YAAYhB,KAAKmC,KAAKgB,aAIlC,GAAInD,KAAKyC,OAAOtC,WAChB,CACCH,KAAKyC,OAAOtC,WAAWa,YAAYhB,KAAKyC,UAK3C,OAAOF,MAGRa,kBAAmB,SAAUjB,EAAMkB,EAAgBC,GAElDrG,GAAGsG,UAAUC,QAAQC,mBAAmBtB,EAAM,WAE7ClF,GAAGoF,SAASF,EAAM,oBAClB,IAAKuB,aAAYC,GAAGC,aACnBlB,UAEEmB,MAAO5G,GAAGM,QAAQ,YAClBoC,SAAU,WAET,GAAImE,EACJ,IAAIT,EACJ,CACC,GAAIU,GAAgB9G,GAAG+G,UAAU7B,GAAOR,UAAW0B,GAAiB,KACpE,IAAIU,EACJ,CACCD,EAAYC,OAIT,CACJD,EAAY3B,EAGb,GAAI2B,EACJ,CACC,GAAIrE,GAAO,IAEX,UAAW6D,KAAoB,WAC/B,CACC7D,EAAO6D,EAAgBQ,OAEnB,CACJrE,EAAOqE,EAAUxC,UAGlB,GAAI7B,IAAS,KACb,CACCwE,IAAIC,KAAK,mBAAoBzE,KAAMA,GAEnC,IAAKiE,aAAYC,GAAGQ,iBACnB5G,QAASN,GAAGM,QAAQ,mBACpB6G,MAAO,UACPC,UAAW,UACXC,QAAS,YACTC,SAAU,EACVC,MAAO,SACPC,SAAU,KACVC,eAAgB,KAChBC,gBAAiB,IACjBC,UAAW,MACT,QAASxH,aAQf,cAAeA,MAElByH,YAAW,WAEV5H,GAAGqF,YAAYH,EAAM,sBACnB,QAML2C,KAAM,GAAI,YAET,GAAIC,GAAU,SAAUC,GAEvB,GAAIC,GAAO,IAEX,IAAID,EAAKE,SACT,CACCD,EAAO,GAAI,SAAUE,GAAWC,EAAYnG,GAE3Ce,KAAKoF,WAAaA,CAClBpF,MAAKf,GAAKA,CACVe,MAAKqF,SAAW,SAAUrG,EAAO6E,GAEhC7G,OAAOC,GAAGC,SAAS4H,KAAKQ,SAASpB,KAAK,YACpCL,MAAOA,EAAO7E,MAAOA,EAAOoG,WAAYpF,KAAKoF,eAE9CJ,EAAKE,SAASE,WAAYJ,EAAKE,SAASjG,IAE5ChC,GAAGsI,cACF,sBAAyBP,GAAKE,SAASjG,IAAM,YAAc,IAAM+F,EAAKE,SAASjG,GAAK,KACnF+F,EAAKQ,UAAWR,EAAK3H,OAAQ4H,IAGhCjF,MAAKyF,QACJC,qBAAsB,uBACtBC,qBAAsB,2BAEvB3F,MAAK5C,KAAO,SAAU4H,EAAM/F,GAE3B+F,EAAK/F,GAAKA,CAEV,IAAGgF,IAAI2B,gBAAgB,IACvB,CACC5I,OAAOC,GAAGC,SAAS4H,KAAKQ,SAASpB,KAAK,OAAQc,OAG/C,CACC,GAAKtB,aAAYC,GAAGkC,MAAMb,GAAO5H,QAInC4C,MAAK8F,YAAc,SAAUC,EAAU9G,GAEtChC,GAAG+I,eAAe,sBAAyB/G,IAAM,YAAc,IAAMA,EAAK,IAAK8G,GAGhF/F,MAAKsF,SAAW,GAAIW,iBAAgB,oBACpCjG,MAAKsF,SAASpB,KAAK,QAClBgC,cAAejJ,GAAGkJ,MAAMpB,EAAS/E,MACjCoG,mBAAoB"}