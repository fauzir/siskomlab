
; /* Start:"a:4:{s:4:"full";s:97:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/script.min.js?151131647237595";s:6:"source";s:77:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/script.js";s:3:"min";s:81:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/script.min.js";s:3:"map";s:81:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/script.map.js";}"*/
BX.namespace("BX.Main");if(typeof BX.Main.interfaceButtons==="undefined"){BX.Main.interfaceButtons=function(t,e){this.classItem="main-buttons-item";this.classItemSublink="main-buttons-item-sublink";this.classItemText="main-buttons-item-text";this.classItemCounter="main-buttons-item-counter";this.classItemIcon="main-buttons-item-icon";this.classItemMore="main-buttons-item-more";this.classOnDrag="main-buttons-drag";this.classDropzone="main-buttons-submenu-dropzone";this.classSeporator="main-buttons-submenu-separator";this.classHiddenLabel="main-buttons-hidden-label";this.classSubmenuItem="main-buttons-submenu-item";this.classItemDisabled="main-buttons-disabled";this.classItemOver="over";this.classItemActive="main-buttons-item-active";this.classSubmenu="main-buttons-submenu";this.classSecret="secret";this.classItemLocked="locked";this.submenuIdPrefix="main_buttons_popup_";this.submenuWindowIdPrefix="menu-popup-";this.classSettingMenuItem="main-buttons-submenu-setting";this.classEditState="main-buttons-edit";this.classEditItemButton="main-buttons-item-edit-button";this.classDragItemButton="main-buttons-item-drag-button";this.classSettingsApplyButton="main-buttons-submenu-settings-apply";this.classSettingsResetButton="main-buttons-submenu-settings-reset";this.classSetHome="main-buttons-set-home";this.classSetHide="main-buttons-set-hide";this.classManage="main-buttons-manage";this.classContainer="main-buttons";this.classSubmenuNoHiddenItem="main-buttons-submenu-item-no-hidden";this.classDefaultSubmenuItem="menu-popup-item";this.classInner="main-buttons-inner-container";this.listContainer=null;this.pinContainer=null;this.dragItem=null;this.overItem=null;this.moreButton=null;this.messages=null;this.licenseParams=null;this.isSubmenuShown=false;this.isSubmenuShownOnDragStart=false;this.isSettingsEnabled=true;this.containerId=e.containerId;this.tmp={};this.init(t,e);return{getItemById:BX.delegate(this.getItemById,this),getAllItems:BX.delegate(this.getAllItems,this),getHiddenItems:BX.delegate(this.getHiddenItems,this),getVisibleItems:BX.delegate(this.getVisibleItems,this),getDisabledItems:BX.delegate(this.getDisabledItems,this),getMoreButton:BX.delegate(this.getMoreButton,this),adjustMoreButtonPosition:BX.delegate(this.adjustMoreButtonPosition,this),showSubmenu:BX.delegate(this.showSubmenu,this),closeSubmenu:BX.delegate(this.closeSubmenu,this),refreshSubmenu:BX.delegate(this.refreshSubmenu,this),getCurrentSettings:BX.delegate(this.getCurrentSettings,this),saveSettings:BX.delegate(this.saveSettings,this),setCounterValueByItemId:BX.delegate(this.setCounterValueByItemId,this),getCounterValueByItemId:BX.delegate(this.getCounterValueByItemId,this),updateCounter:BX.delegate(this.updateCounter,this),getActive:BX.delegate(this.getActive,this),isEditEnabled:BX.delegate(this.isEditEnabled,this),isActiveInMoreMenu:BX.delegate(this.isActiveInMoreMenu,this),isSettingsEnabled:this.isSettingsEnabled,classes:{item:this.classItem,itemText:this.classItemText,itemCounter:this.classItemCounter,itemIcon:this.classItemIcon,itemDisabled:this.classItemDisabled,itemOver:this.classItemOver,itemActive:this.classItemActive,itemLocked:this.classItemLocked,submenu:this.classSubmenu,submenuItem:this.classSubmenuItem,containerOnDrag:this.classOnDrag,classSettingMenuItem:this.classSettingMenuItem},itemsContainer:this.listContainer,itemsContainerId:this.listContainer.id}};BX.Main.interfaceButtons.prototype={init:function(t,e){this.listContainer=BX(this.getId());if(!BX.type.isPlainObject(e)){throw"BX.MainButtons: params is not Object"}if(!("containerId"in e)||!BX.type.isNotEmptyString(e.containerId)){throw"BX.MainButtons: containerId not set in params"}if(!BX.type.isDomNode(this.listContainer)){throw"BX.MainButtons: #"+e.containerId+" is not dom node"}if("classes"in e&&BX.type.isPlainObject(e.classes)){this.setCustomClasses(e.classes)}if("messages"in e&&BX.type.isPlainObject(e.messages)){this.setMessages(e.messages)}if("licenseWindow"in e&&BX.type.isPlainObject(e.licenseWindow)){this.setLicenseWindowParams(e.licenseWindow)}if("disableSettings"in e&&e.disableSettings==="true"){this.isSettingsEnabled=false;this.visibleControlMoreButton()}this.moreButton=this.getMoreButton();if(this.isSettingsEnabled){this.dragAndDropInit()}this.adjustMoreButtonPosition();this.bindOnClickOnMoreButton();this.bindOnScrollWindow();this.setContainerHeight();BX.bind(this.getContainer(),"click",BX.delegate(this._onDocumentClick,this));BX.addCustomEvent("onPullEvent-main",BX.delegate(this._onPush,this));this.updateMoreButtonCounter();if(this.isActiveInMoreMenu()){this.activateItem(this.moreButton)}var s=this.getVisibleItems();var i=BX.type.isArray(s)&&s.length>0?s[0]:null;var n=BX.Buttons.Utils.getByTag(i,"a");if(!BX.type.isDomNode(n)){return}var a=n.getAttribute("href");if(a.charAt(0)==="?"){a=n.pathname+n.search}if(!this.lastHomeLink){this.lastHomeLink=a}this.bindOnResizeFrame()},_onDocumentClick:function(t){var e=this.getItem(t);var s,i,n,a,o,u;if(this.isDragButton(t.target)){t.preventDefault();t.stopPropagation()}if(BX.type.isDomNode(e)){if(!this.isSublink(t.target)){s=this.dataValue(e,"onclick");if(BX.type.isNotEmptyString(s)){t.preventDefault();this.execScript(s)}}if(this.isSettings(e)){this.enableEdit();BX.hide(this.getSettingsButton());BX.show(this.getSettingsApplyButton())}if(this.isApplySettingsButton(e)){t.preventDefault();t.stopPropagation();this.disableEdit();BX.show(this.getSettingsButton());BX.hide(this.getSettingsApplyButton())}if(this.isResetSettingsButton(e)){this.resetSettings()}if(this.isLocked(e)){t.preventDefault();this.showLicenseWindow()}if(this.isEditButton(t.target)){var r,h;t.preventDefault();t.stopPropagation();if(this.isSubmenuItem(e)){e=this.getItemAlias(e)}try{r=JSON.parse(BX.data(e,"item"))}catch(l){}h=this.getItemEditMenu();if(h&&h.popupWindow.isShown()&&this.lastEditNode===e){h.popupWindow.close()}else{this.showItemEditMenu(r,t.target)}this.lastEditNode=e}if(this.isSetHide(e)){o=this.getVisibleItems();u=BX.type.isArray(o)?o.length:null;a=this.editItemData.ID.replace(this.listContainer.id+"_","");i=this.getItemById(a);n=this.getItemAlias(i);i=this.isVisibleItem(i)?i:n;if(this.isDisabled(n)){this.enableItem(n)}else if(!this.isDisabled(n)&&u>2){this.disableItem(n)}if(u===2){BX.onCustomEvent(window,"BX.Main.InterfaceButtons:onHideLastVisibleItem",[i,this])}this.refreshSubmenu();this.saveSettings();this.adjustMoreButtonPosition();if(this.isEditEnabled()){this.enableEdit();BX.hide(this.getSettingsButton());BX.show(this.getSettingsApplyButton())}this.editMenu.popupWindow.close()}if(this.isSetHome(e)){a=this.editItemData.ID.replace(this.listContainer.id+"_","");i=this.getItemById(a);n=this.getItemAlias(i);if(this.isDisabled(n)){this.enableItem(n)}this.listContainer.insertBefore(i,BX.firstChild(this.listContainer));this.adjustMoreButtonPosition();this.refreshSubmenu();this.saveSettings();if(this.isEditEnabled()){this.enableEdit();BX.hide(this.getSettingsButton());BX.show(this.getSettingsApplyButton())}this.editMenu.popupWindow.close()}}if(this.isEditEnabled()){this.getSubmenu().popupWindow.setAutoHide(false)}},isActiveInMoreMenu:function(){var t=this.getHiddenItems();var e=this.getDisabledItems();var s=t.concat(e);return s.some(function(t){var e;try{e=JSON.parse(BX.data(t,"item"))}catch(s){}return BX.type.isPlainObject(e)&&("IS_ACTIVE"in e&&e.IS_ACTIVE===true||e.IS_ACTIVE==="true"||e.IS_ACTIVE==="Y")},this)},_onPush:function(t,e){if(t==="user_counter"&&e&&BX.message("SITE_ID")in e){var s=e[BX.message("SITE_ID")];for(var i in s){if(s.hasOwnProperty(i)){this.updateCounter(i,s[i])}}}},bindOnScrollWindow:function(){BX.bind(window,"scroll",BX.delegate(this._onScroll,this))},getActive:function(){var t=this.getAllItems();var e,s;var i=null;if(BX.type.isArray(t)){t.forEach(function(t){try{e=JSON.parse(BX.data(t,"item"))}catch(s){e=null}if(BX.type.isPlainObject(e)&&"IS_ACTIVE"in e&&(e.IS_ACTIVE===true||e.IS_ACTIVE==="true"||e.IS_ACTIVE==="Y")){i=e}},this)}if(BX.type.isPlainObject(i)){s=BX(i.ID);if(BX.type.isDomNode(s)){i.NODE=s}else{i.NODE=null}}return i},isSetHome:function(t){return BX.hasClass(t,this.classSetHome)},isSetHide:function(t){return BX.hasClass(t,this.classSetHide)},getSettingsButton:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSettingMenuItem)},getSettingsApplyButton:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSettingsApplyButton)},isApplySettingsButton:function(t){return BX.hasClass(t,this.classSettingsApplyButton)},enableEdit:function(){var t=this.getSubmenu();if(t&&"popupWindow"in t){t.popupWindow.setAutoHide(false)}BX.addClass(this.listContainer,this.classEditState);BX.addClass(this.getSubmenuContainer(),this.classEditState);this.isEditEnabledState=true},disableEdit:function(){var t=this.getSubmenu();if(t&&"popupWindow"in t){t.popupWindow.setAutoHide(true)}BX.removeClass(this.listContainer,this.classEditState);BX.removeClass(this.getSubmenuContainer(),this.classEditState);this.isEditEnabledState=false},isEditEnabled:function(){return this.isEditEnabledState},showItemEditMenu:function(t,e){if(BX.type.isPlainObject(t)&&"ID"in t){var s=[this.listContainer.id,"_edit_item"].join("");var i=BX.PopupMenu.getMenuById(s);if(i){BX.PopupMenu.destroy(s)}i=this.createItemEditMenu(t,s,e);i.popupWindow.show()}},getContainer:function(){if(!BX.type.isDomNode(this.container)){this.container=BX(this.containerId).parentNode}return this.container},getItemEditMenu:function(){return BX.PopupMenu.getMenuById([this.listContainer.id,"_edit_item"].join(""))},createItemEditMenu:function(t,e,s){var i;var n=[{text:this.message("MIB_SET_HOME"),className:"main-buttons-set-home menu-popup-no-icon"}];var a=t.ID.replace(this.listContainer.id+"_","");var o=this.getItemById(a);if(this.isDisabled(o)){n.push({text:this.message("MIB_SET_SHOW"),className:"main-buttons-set-hide menu-popup-no-icon"})}else{n.push({text:this.message("MIB_SET_HIDE"),className:"main-buttons-set-hide menu-popup-no-icon"})}var u=BX.pos(s);var r={menuId:e,anchor:s,menuItems:n,settings:{autoHide:true,offsetTop:0,offsetLeft:u.width/2,zIndex:20,angle:{position:"top",offset:u.width/2}}};i=BX.PopupMenu.create(r.menuId,r.anchor,r.menuItems,r.settings);if(this.isVisibleItem(o)){t.NODE=o}else{t.NODE=this.getItemAlias(o)}this.editItemData=t;if("menuItems"in i&&BX.type.isArray(i.menuItems)){i.menuItems.forEach(function(t){BX.bind(t.layout.item,"click",BX.delegate(this._onDocumentClick,this))},this)}BX.onCustomEvent(window,"BX.Main.InterfaceButtons:onBeforeCreateEditMenu",[i,t,this]);this.editMenu=i;return i},setHome:function(){var t=this.getVisibleItems();var e=BX.type.isArray(t)&&t.length>0?t[0]:null;var s=BX.Buttons.Utils.getByTag(e,"a");if(!BX.type.isDomNode(s)){return}var i=s.getAttribute("href");if(i.charAt(0)==="?"){i=s.pathname+s.search}if(!this.lastHomeLink){this.lastHomeLink=i}if(this.lastHomeLink!==i){BX.userOptions.save("ui",this.listContainer.id,"firstPageLink",i);BX.onCustomEvent("BX.Main.InterfaceButtons:onFirstItemChange",[i,e])}this.lastHomeLink=i},isEditButton:function(t){return BX.hasClass(t,this.classEditItemButton)},isDragButton:function(t){return BX.hasClass(t,this.classDragItemButton)},isResetSettingsButton:function(t){return BX.hasClass(t,this.classSettingsResetButton)},getContainerHeight:function(){var t=this.getAllItems().map(function(t){var e=getComputedStyle(t);return BX.height(t)+parseInt(e.marginTop)+parseInt(e.marginBottom)});return Math.max.apply(Math,t)},setContainerHeight:function(){var t=this.getContainerHeight();BX.height(this.listContainer,t)},setLicenseWindowParams:function(t){this.licenseParams=t||{}},message:function(t){var e;try{e=this.messages[t]}catch(s){e=""}return e},setCustomClasses:function(t){if(!BX.type.isPlainObject(t)){return}this.classItem=t.item||this.classItem;this.classItemSublink=t.itemSublink||this.classItemSublink;this.classItemText=t.itemText||this.classItemText;this.classItemCounter=t.itemCounter||this.classItemCounter;this.classItemIcon=t.itemIcon||this.classItemIcon;this.classItemMore=t.itemMore||this.classItemMore;this.classItemOver=t.itemOver||this.classItemOver;this.classItemActive=t.itemActive||this.classItemActive;this.classItemDisabled=t.itemDisabled||this.classItemDisabled;this.classOnDrag=t.onDrag||this.classOnDrag;this.classDropzone=t.dropzone||this.classDropzone;this.classSeporator=t.separator||this.classSeporator;this.classSubmenuItem=t.submenuItem||this.classSubmenuItem;this.classSubmenu=t.submenu||this.classSubmenu;this.classSecret=t.secret||this.classSecret;this.classItemLocked=t.itemLocked||this.classItemLocked},setMessages:function(t){if(!BX.type.isPlainObject(t)){return}this.messages=t},makeFullItemId:function(t){if(!BX.type.isNotEmptyString(t)){return}return[this.listContainer.id,t.replace("-","_")].join("_")},getItemById:function(t){var e=null;var s;if(BX.type.isNotEmptyString(t)){s=this.makeFullItemId(t);e=BX.Buttons.Utils.getBySelector(this.listContainer,"#"+s)}return e},getItemCounterObject:function(t){var e=null;if(BX.type.isDomNode(t)){e=BX.Buttons.Utils.getByClass(t,this.classItemCounter)}return e},setCounterValue:function(t,e){var s=this.getItemCounterObject(t);if(BX.type.isDomNode(s)){s.innerText=e>99?"99+":e>0?e:"";t.dataset.counter=e}this.updateMoreButtonCounter()},updateCounter:function(t,e){var s,i,n;var a=null;var o=this.getAllItems();if(BX.type.isArray(o)){o.forEach(function(e){try{i=JSON.parse(BX.data(e,"item"))}catch(s){i={}}if(BX.type.isPlainObject(i)&&"COUNTER_ID"in i&&i.COUNTER_ID===t){a=e}},this)}s=this.getItemCounterObject(a);if(BX.type.isDomNode(s)){a=this.getItem(s);s.innerText=e>99?"99+":e>0?e:"";a.dataset.counter=e}n=this.getItemAlias(a);if(BX.type.isDomNode(n)){s=this.getItemCounterObject(n);if(BX.type.isDomNode(s)){s.innerText=e>99?"99+":e>0?e:"";n.dataset.counter=e}}this.updateMoreButtonCounter()},setCounterValueByItemId:function(t,e){var s=e!==null?parseFloat(e):null;var i,n;if(!BX.type.isNotEmptyString(t)){throw"Bad first arg. Need string as item id"}if(s!==null&&!BX.type.isNumber(s)){throw"Bad two arg. Need number counter value - Integer, Float or string with number"}i=this.getItemById(t);if(!BX.type.isDomNode(i)){console.info("Not found node with id #"+t);return}n=this.getItemAlias(i);this.setCounterValue(i,s);this.setCounterValue(n,s)},getCounterValueByItemId:function(t){var e,s;var i=NaN;if(!BX.type.isNotEmptyString(t)){throw"Bad first arg. Need string item id"}else{e=this.getItemById(t);i=this.dataValue(e,"counter");i=parseFloat(i);if(!BX.type.isNumber(i)){s=this.getItemCounterObject(e);i=parseFloat(s.innerText)}}return i},setMoreButtonCounter:function(t){var e=this.getItemCounterObject(this.moreButton);var s=t>99?"99+":t>0?t:"";s=parseInt(s);s=BX.type.isNumber(s)?s:"";e.innerText=s},bindOnClickOnMoreButton:function(){BX.bind(this.moreButton,"click",BX.delegate(this._onClickMoreButton,this))},bindOnResizeFrame:function(){window.frames["maininterfacebuttonstmpframe-"+this.getId()].onresize=BX.throttle(this._onResizeHandler,20,this)},getId:function(){return BX.Buttons.Utils.getByClass(this.getContainer(),this.classInner).id},getAllItems:function(){return BX.Buttons.Utils.getByClass(this.listContainer,this.classItem,true)},getVisibleItems:function(){var t=this.getAllItems();var e=this;var s=[];if(t&&t.length){s=t.filter(function(t){return e.isVisibleItem(t)&&!e.isDisabled(t)})}return s},getHiddenItems:function(){var t=this.getAllItems();var e=[];var s=this;if(t&&t.length){e=t.filter(function(t){return!s.isVisibleItem(t)&&!s.isDisabled(t)})}return e},getDisabledItems:function(){return this.getAllItems().filter(function(t){return this.isDisabled(t)},this)},getMoreButton:function(){var t=null;this.getAllItems().forEach(function(e){!t&&BX.hasClass(e,this.classItemMore)&&(t=e)},this);return t},getLastVisibleItem:function(){var t=this.getVisibleItems();var e=null;if(BX.type.isArray(t)&&t.length){e=t[t.length-1]}if(!BX.type.isDomNode(e)){e=null}return e},adjustMoreButtonPosition:function(){var t=this.getLastVisibleItem();var e=this.isMoreButton(t);if(!e){this.listContainer.insertBefore(this.moreButton,t)}this.updateMoreButtonCounter()},getSubmenuId:function(t){var e="";if(BX.type.isDomNode(this.listContainer)&&BX.type.isNotEmptyString(this.listContainer.id)){e=this.submenuIdPrefix+this.listContainer.id}if(t){e=this.submenuWindowIdPrefix+e}return e},getSubmenuItemText:function(t){var e,s,i;if(!BX.type.isDomNode(t)){return null}e=this.findChildrenByClassName(t,this.classItemText);s=this.findChildrenByClassName(t,this.classItemCounter);if(BX.type.isDomNode(s)&&BX.type.isDomNode(e)){s.dataset.counter=this.dataValue(t,"counter");i=e.outerHTML+s.outerHTML}else{e=this.dataValue(t,"text");s=this.dataValue(t,"counter");i=e}return i},getLockedClass:function(t){var e="";if(BX.type.isDomNode(t)&&this.isLocked(t)){e=this.classItemLocked}return e},getSubmenuItems:function(){var t=this.getAllItems();var e=this.getHiddenItems();var s=this.getDisabledItems();var i=[];var n,a;if(t.length){t.forEach(function(t){if(e.indexOf(t)===-1&&s.indexOf(t)===-1){i.push({text:this.getSubmenuItemText(t),href:this.dataValue(t,"url"),title:t.getAttribute("title"),className:[this.classSubmenuItem,this.getIconClass(t),this.classSecret,this.getAliasLink(t),this.getLockedClass(t)].join(" ")})}},this)}if(e.length){e.forEach(function(t){try{n=JSON.parse(this.dataValue(t,"item"))}catch(e){n=null}a=[this.classSubmenuItem,this.getIconClass(t),this.getAliasLink(t),this.getLockedClass(t)];if(BX.type.isPlainObject(n)&&("IS_ACTIVE"in n&&n.IS_ACTIVE===true||n.IS_ACTIVE==="true"||n.IS_ACTIVE==="Y")){a.push(this.classItemActive)}i.push({text:this.getSubmenuItemText(t),href:this.dataValue(t,"url"),title:t.getAttribute("title"),className:a.join(" ")})},this)}if(this.isSettingsEnabled){i.push({text:"<span>"+this.message("MIB_HIDDEN")+"</span>",className:[this.classSeporator,this.classSubmenuItem,this.classHiddenLabel].join(" ")});if(!s.length){i.push({text:"<span>"+this.message("MIB_NO_HIDDEN")+"</span>",className:[this.classSubmenuItem,this.classSubmenuNoHiddenItem].join(" ")})}if(s.length){s.forEach(function(t){try{n=JSON.parse(this.dataValue(t,"item"))}catch(e){n=null}a=[this.classSubmenuItem,this.classItemDisabled,this.getIconClass(t),this.getAliasLink(t),this.getLockedClass(t)];if(BX.type.isPlainObject(n)&&("IS_ACTIVE"in n&&n.IS_ACTIVE===true||n.IS_ACTIVE==="true"||n.IS_ACTIVE==="Y")){a.push(this.classItemActive)}i.push({text:this.getSubmenuItemText(t),href:this.dataValue(t,"url"),title:t.getAttribute("title"),className:a.join(" ")})},this)}i.push({text:"<span>"+this.message("MIB_MANAGE")+"</span>",className:[this.classSeporator,this.classSubmenuItem,this.classHiddenLabel,this.classManage].join(" ")});i.push({text:this.message("MIB_SETTING_MENU_ITEM"),className:[this.classSettingMenuItem,this.classSubmenuItem].join(" ")});i.push({text:this.message("MIB_APPLY_SETTING_MENU_ITEM"),className:[this.classSettingsApplyButton,this.classSubmenuItem].join(" ")});i.push({text:this.message("MIB_RESET_SETTINGS"),className:[this.classSettingsResetButton,this.classSubmenuItem].join(" ")})}return i},getSubmenuArgs:function(){var t=this.getSubmenuId();var e=this.moreButton;var s=BX.pos(e);var i=this.getSubmenuItems();var n={autoHide:true,offsetLeft:s.width/2-80,angle:{position:"top",offset:100},zIndex:20,events:{onPopupClose:BX.delegate(this._onSubmenuClose,this)}};return[t,e,i,n]},visibleControlMoreButton:function(){var t=this.getHiddenItems();if(!t.length||t.length===1&&this.isMoreButton(t[0])){this.getMoreButton().style.display="none"}else{this.getMoreButton().style.display=""}},createSubmenu:function(){var t=BX.PopupMenu.create.apply(BX.PopupMenu,this.getSubmenuArgs());if(this.isSettingsEnabled){this.dragAndDropInitInSubmenu()}t.menuItems.forEach(function(t){BX.bind(t.layout.item,"click",BX.delegate(this._onDocumentClick,this))},this);return t},showSubmenu:function(){var t=this.getSubmenu();if(t!==null){t.popupWindow.show()}else{this.destroySubmenu();t=this.createSubmenu();t.popupWindow.show()}this.setSubmenuShown(true);this.activateItem(this.moreButton);if(this.isEditEnabled()){t.popupWindow.setAutoHide(false)}},closeSubmenu:function(){var t=this.getSubmenu();if(t===null){return}t.popupWindow.close();if(!this.isActiveInMoreMenu()){this.deactivateItem(this.moreButton)}this.setSubmenuShown(false)},getSubmenu:function(){return BX.PopupMenu.getMenuById(this.getSubmenuId())},destroySubmenu:function(){BX.PopupMenu.destroy(this.getSubmenuId())},refreshSubmenu:function(){var t=this.getSubmenu();var e;if(t===null){return}e=this.getSubmenuArgs();if(BX.type.isArray(e)){this.destroySubmenu();this.createSubmenu();this.showSubmenu()}},setSubmenuShown:function(t){this.isSubmenuShown=false;if(BX.type.isBoolean(t)){this.isSubmenuShown=t}},activateItem:function(t){if(!BX.type.isDomNode(t)){return}if(!BX.hasClass(t,this.classItemActive)){BX.addClass(t,this.classItemActive)}},deactivateItem:function(t){if(!BX.type.isDomNode(t)){return}if(BX.hasClass(t,this.classItemActive)){BX.removeClass(t,this.classItemActive)}},getCurrentSettings:function(){var t={};this.getAllItems().forEach(function(e,s){t[e.id]={sort:s,isDisabled:this.isDisabled(e)}},this);return t},saveSettings:function(){var t=this.getCurrentSettings();var e="settings";var s;if(!BX.type.isPlainObject(t)){return}if(BX.type.isDomNode(this.listContainer)){if("id"in this.listContainer){s=this.listContainer.id;t=JSON.stringify(t);BX.userOptions.save("ui",s,e,t);this.setHome()}}},resetSettings:function(){var t=null;var e=BX.PopupWindowManager.create(this.listContainer.id+"_reset_popup",null,{content:this.message("MIB_RESET_ALERT"),autoHide:false,overlay:true,closeByEsc:true,closeIcon:true,draggable:{restrict:true},titleBar:this.message("MIB_RESET_SETTINGS"),buttons:[t=new BX.PopupWindowButton({text:this.message("MIB_RESET_BUTTON"),className:"popup-window-button-create",events:{click:function(){if(BX.hasClass(t.buttonNode,"popup-window-button-wait")){return}BX.addClass(t.buttonNode,"popup-window-button-wait");this.handleResetSettings(function(s){if(s){BX.removeClass(t.buttonNode,"popup-window-button-wait");e.setContent(s)}else{var i="settings";BX.userOptions.save("ui",this.listContainer.id,i,JSON.stringify({}));BX.userOptions.save("ui",this.listContainer.id,"firstPageLink","");window.location.reload()}}.bind(this))}.bind(this)}}),new BX.PopupWindowButtonLink({text:this.message("MIB_CANCEL_BUTTON"),className:"popup-window-button-link-cancel",events:{click:function(){this.popupWindow.close()}}})]});e.show()},handleResetSettings:function(t){var e=[];BX.onCustomEvent("BX.Main.InterfaceButtons:onBeforeResetMenu",[e,this]);var s=new BX.Promise;var i=s;for(var n=0;n<e.length;n++){s=s.then(e[n])}s.then(function(e){t(null,e)},function(e){t(e,null)});i.fulfill()},moveButtonAlias:function(t){var e,s;if(!t||!this.dragItem){return}e=this.getItemAlias(this.dragItem);s=this.getItemAlias(t);if(this.isListItem(e)){if(!s){this.listContainer.appendChild(e)}else{this.listContainer.insertBefore(e,s)}}},moveButton:function(t){var e;if(!BX.type.isDomNode(t)||!BX.type.isDomNode(this.dragItem)){return}if(this.isListItem(t)){if(this.isDisabled(this.dragItem)){this.dragItem.dataset.disabled="false"}if(BX.type.isDomNode(t)){this.listContainer.insertBefore(this.dragItem,t)}else{this.listContainer.appendChild(this.dragItem)}}if(this.isSubmenuItem(t)){if(this.isDisabled(this.dragItem)&&!this.isDisabled(t)){this.enableItem(this.dragItem)}e=this.getSubmenuContainer();e.insertBefore(this.dragItem,t)}},getSubmenuContainer:function(){var t=this.getSubmenu();var e=null;if(t!==null){e=t.itemsContainer}return e},findNextSiblingByClass:function(t,e){var s=t;for(;!!t;t=t.nextElementSibling){if(e){if(BX.hasClass(t,e)&&t!==s){return t}}else{return null}}},findParentByClassName:function(t,e){for(;t&&t!==document;t=t.parentNode){if(e){if(BX.hasClass(t,e)){return t}}else{return null}}},findChildrenByClassName:function(t,e){var s=null;if(BX.type.isDomNode(t)&&BX.type.isNotEmptyString(e)){s=BX.Buttons.Utils.getByClass(t,e)}return s},dragAndDropInit:function(){this.getAllItems().forEach(function(t,e){if(!this.isSeparator(t)&&!this.isSettings(t)&&!this.isApplySettingsButton(t)&&!this.isResetSettingsButton(t)){t.setAttribute("draggable","true");t.setAttribute("tabindex","-1");t.dataset.link="item"+e;BX.bind(t,"dragstart",BX.delegate(this._onDragStart,this));BX.bind(t,"dragend",BX.delegate(this._onDragEnd,this));BX.bind(t,"dragenter",BX.delegate(this._onDragEnter,this));BX.bind(t,"dragover",BX.delegate(this._onDragOver,this));BX.bind(t,"dragleave",BX.delegate(this._onDragLeave,this));BX.bind(t,"drop",BX.delegate(this._onDrop,this))}BX.bind(t,"mouseover",BX.delegate(this._onMouse,this));BX.bind(t,"mouseout",BX.delegate(this._onMouse,this))},this)},dragAndDropInitInSubmenu:function(){var t=this.getSubmenu();var e=t.menuItems;e.forEach(function(t){if(!this.isSeparator(t.layout.item)&&!this.isSettings(t.layout.item)&&!this.isApplySettingsButton(t.layout.item)&&!this.isResetSettingsButton(t.layout.item)){t.layout.item.draggable=true;t.layout.item.dataset.sortable=true;BX.bind(t.layout.item,"dragstart",BX.delegate(this._onDragStart,this));BX.bind(t.layout.item,"dragenter",BX.delegate(this._onDragEnter,this));BX.bind(t.layout.item,"dragover",BX.delegate(this._onDragOver,this));BX.bind(t.layout.item,"dragleave",BX.delegate(this._onDragLeave,this));BX.bind(t.layout.item,"dragend",BX.delegate(this._onDragEnd,this));BX.bind(t.layout.item,"drop",BX.delegate(this._onDrop,this))}if(BX.hasClass(t.layout.item,this.classHiddenLabel)&&!BX.hasClass(t.layout.item,this.classManage)){BX.bind(t.layout.item,"dragover",BX.delegate(this._onDragOver,this))}},this)},getItem:function(t){if(!BX.type.isDomNode(t)){if(!t||!BX.type.isDomNode(t.target)){return null}}else{t={target:t}}var e=this.findParentByClassName(t.target,this.classItem);if(!BX.type.isDomNode(e)){e=this.findParentByClassName(t.target,this.classDefaultSubmenuItem)}return e},setOpacity:function(t){if(!BX.type.isDomNode(t)){return}BX.style(t,"opacity",".1")},unsetOpacity:function(t){if(!BX.type.isDomNode(t)){return}BX.style(t,"opacity","1")},setDragStyles:function(){BX.addClass(this.listContainer,this.classOnDrag);BX.addClass(BX(this.getSubmenuId(true)),this.classOnDrag);this.setOpacity(this.dragItem)},unsetDragStyles:function(){var t=this.getSubmenu();this.getAllItems().forEach(function(t){this.unsetOpacity(t);BX.removeClass(t,"over")},this);if(t&&"menuItems"in t&&BX.type.isArray(t.menuItems)&&t.menuItems.length){t.menuItems.forEach(function(t){this.unsetOpacity(t);BX.removeClass(t.layout.item,"over")},this)}BX.removeClass(this.listContainer,this.classOnDrag);BX.removeClass(BX(this.getSubmenuId(true)),this.classOnDrag)},getIconClass:function(t){var e="";if(BX.type.isDomNode(t)&&"dataset"in t&&"class"in t.dataset&&BX.type.isNotEmptyString(t.dataset.class)){e=t.dataset.class}return e},disableItem:function(t){var e=this.getItemAlias(t);if(t&&"dataset"in t){t.dataset.disabled="true";if(e){e.dataset.disabled="true"}}},enableItem:function(t){var e;if(!BX.type.isDomNode(t)){return}if(this.isSubmenuItem(t)){BX.removeClass(t,this.classItemDisabled);e=this.getItemAlias(t);if(BX.type.isDomNode(e)){e.dataset.disabled="false"}}},getAliasLink:function(t){return this.dataValue(t,"link")||""},getItemAlias:function(t){var e=null;if(!BX.type.isDomNode(t)){return e}var s=this.getAllItems();var i=this.isSubmenuItem(t);var n=this.isListItem(t);if(!i&&!n){return e}if(i){s.forEach(function(s){BX.hasClass(t,this.getAliasLink(s))&&(e=s)},this)}if(n){e=BX.Buttons.Utils.getByClass(document,this.getAliasLink(t))}return e},hideItem:function(t){!!t&&BX.addClass(t,this.classSecret)},showItem:function(t){!!t&&BX.removeClass(t,this.classSecret)},fakeDragItem:function(){var t=null;if(!BX.type.isDomNode(this.dragItem)||!BX.type.isDomNode(this.overItem)){return}if(this.isDragToSubmenu()){t=this.getItemAlias(this.dragItem);if(t!==this.dragItem){this.listContainer.appendChild(this.dragItem);this.dragItem=t;this.showItem(this.dragItem);this.adjustMoreButtonPosition();this.updateSubmenuItems();this.tmp.moved=false;this.tmp.movetToSubmenu=true;this.setOpacity(this.dragItem)}}if(this.isDragToList()&&!this.tmp.movetToSubmenu){t=this.getItemAlias(this.dragItem);if(t!==this.dragItem){this.hideItem(this.dragItem);this.dragItem=t;this.adjustMoreButtonPosition();this.updateSubmenuItems();this.setOpacity(this.dragItem)}}this.tmp.movetToSubmenu=false},updateSubmenuItems:function(){var t=this.getHiddenItems();var e=this.getDisabledItems();var s=this;var i=[];var n,a,o;n=this.getSubmenu();if(n===null){return}a=n.menuItems;if(!BX.type.isArray(a)||!a.length){return}i=e.concat(t);a.forEach(function(t){o=[].some.call(i,function(e){return BX.hasClass(t.layout.item,s.dataValue(e,"link"))||s.isDisabled(t.layout.item)||s.isSeparator(t.layout.item)||s.isDropzone(t.layout.item)});if(o||(s.isSettings(t.layout.item)||s.isApplySettingsButton(t.layout.item)||s.isResetSettingsButton(t.layout.item)||s.isNotHiddenItem(t.layout.item)||s.isSeparator(t.layout.item)||t.layout.item===s.dragItem)&&!s.isMoreButton(t.layout.item)){s.showItem(t.layout.item)}else{s.hideItem(t.layout.item)}})},isNotHiddenItem:function(t){return BX.hasClass(t,this.classSubmenuNoHiddenItem)},getNotHidden:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSubmenuNoHiddenItem)},setOverStyles:function(t){if(BX.type.isDomNode(t)&&!BX.hasClass(t,this.classItemOver)){BX.addClass(t,this.classItemOver)}},unsetOverStyles:function(t){if(BX.type.isDomNode(t)&&BX.hasClass(t,this.classItemOver)){BX.removeClass(t,this.classItemOver)}},dataValue:function(t,e){var s="";var i;if(BX.type.isDomNode(t)){i=BX.data(t,e);if(typeof i!=="undefined"){s=i}}return s},execScript:function(script){if(BX.type.isNotEmptyString(script)){eval(script)}},showLicenseWindow:function(){var t;if(!B24.licenseInfoPopup){return}t=B24.licenseInfoPopup;t.init({B24_LICENSE_BUTTON_TEXT:this.message("MIB_LICENSE_BUY_BUTTON"),B24_TRIAL_BUTTON_TEXT:this.message("MIB_LICENSE_TRIAL_BUTTON"),IS_FULL_DEMO_EXISTS:this.licenseParams.isFullDemoExists,HOST_NAME:this.licenseParams.hostname,AJAX_URL:this.licenseParams.ajaxUrl,LICENSE_ALL_PATH:this.licenseParams.licenseAllPath,LICENSE_DEMO_PATH:this.licenseParams.licenseDemoPath,FEATURE_GROUP_NAME:this.licenseParams.featureGroupName,AJAX_ACTIONS_URL:this.licenseParams.ajaxActionsUrl,B24_FEATURE_TRIAL_SUCCESS_TEXT:this.message("MIB_LICENSE_WINDOW_TRIAL_SUCCESS_TEXT")});t.show("main-buttons",this.message("MIB_LICENSE_WINDOW_HEADER_TEXT"),this.message("MIB_LICENSE_WINDOW_TEXT"))},_onDragStart:function(t){var e=this.getVisibleItems();var s=BX.type.isArray(e)?e.length:null;this.dragItem=this.getItem(t);if(!BX.type.isDomNode(this.dragItem)){return}if(s===2&&this.isListItem(this.dragItem)){t.preventDefault();BX.onCustomEvent(window,"BX.Main.InterfaceButtons:onHideLastVisibleItem",[this.dragItem,this]);return}if(this.isMoreButton(this.dragItem)||this.isSeparator(this.dragItem)||this.isNotHiddenItem(this.dragItem)){t.preventDefault();return}this.isSubmenuShownOnDragStart=!!this.isSubmenuShown;if(this.isListItem(this.dragItem)){this.showSubmenu()}this.setDragStyles();if(!this.isEditEnabled()){this.enableEdit()}},_onDragEnd:function(t){t.preventDefault();var e=this.getItem(t);var s,i;if(!BX.type.isDomNode(e)){return}this.unsetDragStyles();if(!this.isSubmenuShownOnDragStart){this.refreshSubmenu();if(!this.isEditEnabled()){this.closeSubmenu()}}else{this.refreshSubmenu()}s=BX.findNextSibling(this.dragItem,BX.delegate(function(t){return this.isVisibleItem(t)},this));i=BX.findPreviousSibling(this.dragItem,BX.delegate(function(t){return this.isVisibleItem(t)},this));if(BX.type.isDomNode(i)&&(BX.hasClass(i,this.classHiddenLabel)||this.isDisabled(i)&&this.isSubmenuItem(i))||(BX.type.isDomNode(s)&&BX.hasClass(s,this.classManage)||this.isDisabled(s)&&this.isSubmenuItem(s))){this.disableItem(this.dragItem);this.refreshSubmenu()}if(this.isEditEnabled()){this.enableEdit();BX.show(this.getSettingsApplyButton());BX.hide(this.getSettingsButton())}else{this.disableEdit();

BX.hide(this.getSettingsApplyButton());BX.show(this.getSettingsButton())}this.updateMoreButtonCounter();this.saveSettings();this.dragItem=null;this.overItem=null;this.tmp.moved=false},updateMoreButtonCounter:function(){var t,e,s,i;t=this.getHiddenItems();i=this.getDisabledItems();t=t.concat(i);e=0;if(BX.type.isArray(t)){t.forEach(function(t){e+=parseInt(this.dataValue(t,"counter"))||0},this)}if(BX.type.isNumber(e)){this.setMoreButtonCounter(e)}},_onDragEnter:function(t){var e=this.getItem(t);if(BX.type.isDomNode(e)&&this.isNotHiddenItem(e)){this.setOverStyles(e)}},_onDragOver:function(t){t.preventDefault();var e=null;this.overItem=this.getItem(t);if(!BX.type.isDomNode(this.overItem)||!BX.type.isDomNode(this.dragItem)||this.overItem===this.dragItem||this.isNotHiddenItem(this.overItem)){return}this.fakeDragItem();if(this.isNext(t)&&this.isGoodPosition(t)&&!this.isMoreButton(this.overItem)){e=this.findNextSiblingByClass(this.overItem,this.classItem);if(this.isMoreButton(e)&&!this.tmp.moved){e=e.previousElementSibling;this.tmp.moved=true}if(!BX.type.isDomNode(e)){e=this.findNextSiblingByClass(this.overItem,this.classSubmenuItem)}if(BX.type.isDomNode(e)){this.moveButton(e);this.moveButtonAlias(e);this.adjustMoreButtonPosition();this.updateSubmenuItems()}}if(!this.isNext(t)&&this.isGoodPosition(t)&&!this.isMoreButton(this.overItem)||!this.isGoodPosition(t)&&this.isMoreButton(this.overItem)&&this.getVisibleItems().length===1){this.moveButton(this.overItem);this.moveButtonAlias(this.overItem);this.adjustMoreButtonPosition();this.updateSubmenuItems()}},_onDragLeave:function(t){var e=this.getItem(t);if(BX.type.isDomNode(e)){this.unsetOverStyles(t.target)}},_onDrop:function(t){var e=this.getItem(t);if(!BX.type.isDomNode(e)){return}if(this.isNotHiddenItem(e)||this.isDisabled(e)){this.disableItem(this.dragItem);this.adjustMoreButtonPosition()}this.unsetDragStyles();t.preventDefault()},getIndex:function(t,e){return[].indexOf.call(t||[],e)},_onSubmenuClose:function(){this.setSubmenuShown(false);if(this.isEditEnabled()){this.activateItem(this.moreButton)}else{if(!this.isActiveInMoreMenu()){this.deactivateItem(this.moreButton)}}},_onResizeHandler:function(){this.adjustMoreButtonPosition();this.updateSubmenuItems();if(!this.isSettingsEnabled){this.visibleControlMoreButton()}},_onClickMoreButton:function(t){t.preventDefault();this.showSubmenu()},_onMouse:function(t){var e=this.getItem(t);if(t.type==="mouseover"&&!BX.hasClass(e,this.classItemOver)){BX.addClass(e,this.classItemOver)}if(t.type==="mouseout"&&BX.hasClass(e,this.classItemOver)){BX.removeClass(e,this.classItemOver)}},getSettingsResetButton:function(){return BX.Buttons.Utils.getByClass(this.getSubmenuContainer(),this.classSettingsResetButton)},_onScroll:function(){if(BX.style(this.pinContainer,"position")==="fixed"){this.closeSubmenu()}},isDisabled:function(t){var e=false;if(BX.type.isDomNode(t)){e=this.dataValue(t,"disabled")==="true"||BX.hasClass(t,this.classItemDisabled)}return e},isSettings:function(t){var e=false;if(BX.type.isDomNode(t)){e=BX.hasClass(t,this.classSettingMenuItem)}return e},isLocked:function(t){var e=false;if(BX.type.isDomNode(t)){e=this.dataValue(t,"locked")==="true"||BX.hasClass(t,this.classItemLocked)}return e},isDropzone:function(t){return BX.hasClass(t,this.classDropzone)},isNext:function(t){var e=this.dragItem.getBoundingClientRect();var s=this.overItem.getBoundingClientRect();var i=getComputedStyle(this.dragItem);var n=parseInt(i.marginRight.replace("px",""));var a=null;if(this.isListItem(this.overItem)){a=t.clientX>s.left-n&&t.clientX>e.right}if(this.isSubmenuItem(this.overItem)){a=t.clientY>e.top}return a},isGoodPosition:function(t){var e=this.overItem;var s,i;if(!BX.type.isDomNode(e)){return false}s=e.getBoundingClientRect();if(this.isListItem(e)){i=this.isNext(t)&&t.clientX>=s.left+s.width/2||!this.isNext(t)&&t.clientX<=s.left+s.width/2}if(this.isSubmenuItem(e)){i=this.isNext(t)&&t.clientY>=s.top+s.height/2||!this.isNext(t)&&t.clientY<=s.top+s.height/2}return i},isSubmenuItem:function(t){return BX.hasClass(t,this.classSubmenuItem)},isVisibleItem:function(t){if(!BX.type.isDomNode(t)){return false}return t.offsetTop===0},isMoreButton:function(t){var e=false;if(BX.type.isDomNode(t)&&BX.hasClass(t,this.classItemMore)){e=true}return e},isListItem:function(t){var e=false;if(BX.type.isDomNode(t)&&BX.hasClass(t,this.classItem)){e=true}return e},isSublink:function(t){var e=false;if(BX.type.isDomNode(t)){e=BX.hasClass(t,this.classItemSublink)}return e},isSeparator:function(t){var e=false;if(BX.type.isDomNode(t)){e=BX.hasClass(t,this.classSeporator)}return e},isDragToSubmenu:function(){return!this.isSubmenuItem(this.dragItem)&&this.isSubmenuItem(this.overItem)},isDragToList:function(){return this.isSubmenuItem(this.dragItem)&&!this.isSubmenuItem(this.overItem)}}}if(typeof BX.Main.interfaceButtonsManager==="undefined"){BX.Main.interfaceButtonsManager={data:{},init:function(t){var e=null;if(!BX.type.isPlainObject(t)||!("containerId"in t)){throw"BX.Main.interfaceButtonsManager: containerId not set in params Object"}e=BX(t.containerId);if(BX.type.isDomNode(e)){this.data[t.containerId]=new BX.Main.interfaceButtons(e,t)}else{BX(BX.delegate(function(){e=BX(t.containerId);if(!BX.type.isDomNode(e)){throw"BX.Main.interfaceButtonsManager: container is not dom node"}this.data[t.containerId]=new BX.Main.interfaceButtons(e,t)},this))}},getById:function(t){var e=null;if(BX.type.isString(t)&&BX.type.isNotEmptyString(t)){try{e=this.data[t]}catch(s){}}return e},getObjects:function(){return this.data}}}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:94:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.min.js?1511316472575";s:6:"source";s:76:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.js";s:3:"min";s:80:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.min.js";s:3:"map";s:80:"/bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.map.js";}"*/
(function(){"use strict";BX.namespace("BX.Buttons");BX.Buttons.Utils={getByClass:function(e,t,l){var n=[];if(t){n=(e||document.body).getElementsByClassName(t);if(!l){n=n.length?n[0]:null}else{n=[].slice.call(n)}}return n},getByTag:function(e,t,l){var n=[];if(t){n=(e||document.body).getElementsByTagName(t);if(!l){n=n.length?n[0]:null}else{n=[].slice.call(n)}}return n},getBySelector:function(e,t,l){var n=[];if(t){if(!l){n=(e||document.body).querySelector(t)}else{n=(e||document.body).querySelectorAll(t);n=[].slice.call(n)}}return n}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:93:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15113165822527";s:6:"source";s:78:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var waitDiv = null;
var waitPopup = null;
var waitTimeout = null;
var waitTime = 500;

function __SASSetAdmin()
{
	__SASShowWait();
	BX.ajax({
		url: '/bitrix/components/bitrix/socialnetwork.admin.set/ajax.php',
		method: 'POST',
		dataType: 'json',
		data: {'ACTION': 'SET', 'sessid': BX.bitrix_sessid(), 'site': BX.util.urlencode(BX.message('SASSiteId'))},
		onsuccess: function(data) { __SASProcessAJAXResponse(data); }
	});
}

function __SASProcessAJAXResponse(data)
{
	if (data["SUCCESS"] != "undefined" && data["SUCCESS"] == "Y")
	{
		BX.reload();
		return false;
	}
	else if (data["ERROR"] != "undefined" && data["ERROR"].length > 0)
	{
		if (data["ERROR"].indexOf("SESSION_ERROR", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorSessionWrong'));
			BX.reload();
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_ADMIN", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorNotAdmin'));
			return false;
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_AUTH", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorCurrentUserNotAuthorized'));
			return false;
		}
		else if (data["ERROR"].indexOf("SONET_MODULE_NOT_INSTALLED", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorModuleNotInstalled'));
			return false;
		}
		else
		{
			__SASShowError(data["ERROR"]);
			return false;		
		}
	}
}
				
function __SASShowError(errorText) 
{
	__SASCloseWait();

	var errorPopup = new BX.PopupWindow('sas-error' + Math.random(), window, {
		autoHide: true,
		lightShadow: false,
		zIndex: 2,
		content: BX.create('DIV', {props: {'className': 'sonet-adminset-error-text-block'}, html: errorText}),
		closeByEsc: true,
		closeIcon: true
	});
	errorPopup.show();

}

function __SASShowWait(timeout)
{
	if (timeout !== 0)
	{
		return (waitTimeout = setTimeout(function(){
			__SASShowWait(0)
		}, 50));
	}

	if (!waitPopup)
	{
		waitPopup = new BX.PopupWindow('sas_wait', window, {
			autoHide: true,
			lightShadow: true,
			zIndex: 2,
			content: BX.create('DIV', {
				props: {
					className: 'sonet-adminset-wait-cont'
				},
				children: [
					BX.create('DIV', {
						props: {
							className: 'sonet-adminset-wait-icon'
						}
					}),
					BX.create('DIV', {
						props: {
							className: 'sonet-adminset-wait-text'
						},
						html: BX.message('SASWaitTitle')
					})
				]
			})
		});
	}
	else
		waitPopup.setBindElement(window);

	waitPopup.show();
}

function __SASCloseWait()
{
	if (waitTimeout)
	{
		clearTimeout(waitTimeout);
		waitTimeout = null;
	}

	if (waitPopup)
		waitPopup.close();
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:95:"/bitrix/components/bitrix/photogallery.section.list/templates/.default/script.js?15113165377387";s:6:"source";s:80:"/bitrix/components/bitrix/photogallery.section.list/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function EditAlbum(url)
{
	var oEditAlbumDialog = new BX.CDialog({
		title : '',
		content_url: url + (url.indexOf('?') !== -1 ? "&" : "?") + "AJAX_CALL=Y",
		buttons: [BX.CDialog.btnSave, BX.CDialog.btnCancel],
		width: 600,
		height: 400
	});
	oEditAlbumDialog.Show();

	BX.addCustomEvent(oEditAlbumDialog, "onWindowRegister", function(){
		oEditAlbumDialog.adjustSizeEx();
		var pName = BX('bxph_name');

		if (pName) // Edit album properies
		{
			BX.focus(pName);
			if (BX('bxph_pass_row'))
			{
				BX('bxph_use_password').onclick = function()
				{
					var ch = !!this.checked;
					BX('bxph_pass_row').style.display = ch ? '' : 'none';
					BX('bxph_photo_password').disabled = !ch;
					if (ch)
						BX.focus(BX('bxph_photo_password'));

					oEditAlbumDialog.adjustSizeEx();
				};
			}
		}
		else // Edit album icon
		{
		}
	});

	oEditAlbumDialog.ClearButtons();
	oEditAlbumDialog.SetButtons([
		new BX.CWindowButton(
		{
			title: BX.message('JS_CORE_WINDOW_SAVE'),
			id: 'savebtn',
			action: function()
			{
				var pForm = oEditAlbumDialog.Get().getElementsByTagName('form')[0];
				if (pForm.action.indexOf('icon') == -1)
					CheckForm(pForm);
				else // Edit album icon
					CheckFormEditIcon(pForm);
			}
		}),
		oEditAlbumDialog.btnCancel
	]);

	window.oPhotoEditAlbumDialog = oEditAlbumDialog;
}

function CheckForm(form)
{
	if (typeof form != "object")
		return false;

	oData = {"AJAX_CALL" : "Y"};
	for (var ii in form.elements)
	{
		if (form.elements[ii] && form.elements[ii].name)
		{
			if (form.elements[ii].type && form.elements[ii].type.toLowerCase() == "checkbox")
			{
				if (form.elements[ii].checked == true)
					oData[form.elements[ii].name] = form.elements[ii].value;
			}
			else
				oData[form.elements[ii].name] = form.elements[ii].value;
		}
	}

	BX.showWait('photo_window_edit');
	window.oPhotoEditAlbumDialogError = false;

	BX.ajax.post(
		form.action,
		oData,
		function(data)
		{
			setTimeout(function(){
				BX.closeWait('photo_window_edit');
				result = {};

				if (window.oPhotoEditAlbumDialogError !== false)
				{
					var errorTr = BX("bxph_error_row");
					errorTr.style.display = "";
					errorTr.cells[0].innerHTML = window.oPhotoEditAlbumDialogError;
					window.oPhotoEditAlbumDialog.adjustSizeEx();
				}
				else
				{
					try
					{
						eval("result = " + data + ";");
						if (result['url'] && result['url'].length > 0)
							BX.reload(result['url']);

						var arrId = {"NAME" : "photo_album_name_", "DATE" : "photo_album_date_", "DESCRIPTION" : "photo_album_description_"};
						for (var ID in arrId)
						{
							if (BX(arrId[ID] + result['ID']))
								BX(arrId[ID] + result['ID']).innerHTML = result[ID];
						}
						var res = BX('photo_album_info_' + result['ID']);

						if (res)
						{
							if (result['PASSWORD'].length <= 0)
								res.className = res.className.replace("photo-album-password", "");
							else
								res.className += " photo-album-password ";
						}
						window.oPhotoEditAlbumDialog.Close();
					}
					catch(e)
					{
						var errorTr = BX("bxph_error_row");
						errorTr.style.display = "";
						errorTr.cells[0].innerHTML = BXPH_MESS.UnknownError;
						window.oPhotoEditAlbumDialog.adjustSizeEx();
					}
				}
			}, 200);
		}
	);
}

function CheckFormEditIcon(form)
{
	if (typeof form != "object")
		return false;

	oData = {"AJAX_CALL" : "Y"};
	for (var ii in form.elements)
	{
		if (form.elements[ii] && form.elements[ii].name)
		{
			if (form.elements[ii].type && form.elements[ii].type.toLowerCase() == "checkbox")
			{
				if (form.elements[ii].checked == true)
					oData[form.elements[ii].name] = form.elements[ii].value;
			}
			else
				oData[form.elements[ii].name] = form.elements[ii].value;
		}
	}
	oData["photos"] = [];
	for (var ii = 0; ii < form.elements["photos[]"].length; ii++)
	{
		if (form.elements["photos[]"][ii].checked == true)
			oData["photos"].push(form.elements["photos[]"][ii].value);
	}

	BX.showWait('photo_window_edit');
	window.oPhotoEditIconDialogError = false;

	BX.ajax.post(
		form.action,
		oData,
		function(data)
		{
			setTimeout(function(){
				BX.closeWait('photo_window_edit');
				var result = {};

				if (window.oPhotoEditIconDialogError !== false)
				{
					var errorCont = BX("bxph_error_cont");
					errorCont.style.display = "";
					errorCont.innerHTML = window.oPhotoEditIconDialogError + "<br/>";
					window.oPhotoEditAlbumDialog.adjustSizeEx();
				}
				else
				{
					try
					{
						eval("result = " + data + ";");
					}
					catch(e)
					{
						result = {};
					}

					if (parseInt(result["ID"]) > 0)
					{
						if (BX("photo_album_img_" + result['ID']))
							BX("photo_album_img_" + result['ID']).src = result['SRC'];
						else if (BX("photo_album_cover_" + result['ID']))
							BX("photo_album_cover_" + result['ID']).style.backgroundImage = "url('" + result['SRC'] + "')";
						window.oPhotoEditAlbumDialog.Close();
					}
					else
					{
						var errorTr = BX("bxph_error_row");
						errorTr.style.display = "";
						errorTr.cells[0].innerHTML = BXPH_MESS.UnknownError;
						window.oPhotoEditAlbumDialog.adjustSizeEx();
					}
				}
			}, 200);
		}
	);
}

function DropAlbum(url, id)
{
	BX.showWait('photo_window_edit');
	window.oPhotoEditAlbumDialogError = false;

	if (id > 0)
	{
		var pAlbum = BX("photo_album_info_" + id);
		if (pAlbum)
			pAlbum.style.display = "none";
	}

	BX.ajax.post(
		url,
		{"AJAX_CALL" : "Y"},
		function(data)
		{
			setTimeout(function(){
				BX.closeWait('photo_window_edit');

				if (window.oPhotoEditAlbumDialogError !== false)
					return alert(window.oPhotoEditAlbumDialogError);

				try
				{
					eval("result = " + data + ";");
					if (result['ID'])
					{
						var pAlbum = BX("photo_album_info_" + result['ID']);
						if (pAlbum && pAlbum.parentNode)
							pAlbum.parentNode.removeChild(pAlbum);
					}
				}
				catch(e)
				{
					if (id > 0)
					{
						var pAlbum = BX("photo_album_info_" + id);
						if (pAlbum && pAlbum.parentNode)
							pAlbum.style.display = "";
					}

					if (window.BXPH_MESS)
						return alert(window.BXPH_MESS.UnknownError);
				}
			}, 200);
		}
	);

	return false;
}

window.__photo_check_name_length_count = 0;
function __photo_check_name_length()
{
	var nodes = document.getElementsByTagName('a');
	var result = false;
	for (var ii = 0; ii < nodes.length; ii++)
	{
		var node = nodes[ii];
		if (!node.id.match(/photo\_album\_name\_(\d+)/gi))
			continue;
		result = true;
		if (node.offsetHeight <= node.parentNode.offsetHeight)
			continue;
		var div = node.parentNode;
		var text = node.innerHTML.replace(/\<wbr\/\>/gi, '').replace(/\<wbr\>/gi, '').replace(/\&shy\;/gi, '');
		while (div.offsetHeight < node.offsetHeight || div.offsetWidth < node.offsetWidth)
		{
			if ((div.offsetHeight  < (node.offsetHeight / 2)) || (div.offsetWidth < (node.offsetWidth / 2)))
				text = text.substr(0, parseInt(text.length / 2));
			else
				text = text.substr(0, (text.length - 2));
			node.innerHTML = text;
		}
		node.innerHTML += '...';
		if (div.offsetHeight < node.offsetHeight || div.offsetWidth < node.offsetWidth)
			node.innerHTML = text.substr(0, (text.length - 3)) + '...';
	}
	if (!result)
	{
		window.__photo_check_name_length_count++;
		if (window.__photo_check_name_length_count < 7)
			setTimeout(__photo_check_name_length, 250);
	}
}
setTimeout(__photo_check_name_length, 250);
/* End */
;
; /* Start:"a:4:{s:4:"full";s:82:"/bitrix/components/bitrix/photogallery/templates/.default/script.js?15113165376106";s:6:"source";s:67:"/bitrix/components/bitrix/photogallery/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function debug_info(text)
{
	container_id = 'debug_info_forum';
	var div = document.getElementById(container_id);
	if (!div || div == null)
	{
		div = document.body.appendChild(document.createElement("DIV"));
		div.id = container_id;
//		div.className = "forum-debug";
		div.style.position = "absolute";
		div.style.width = "170px";
		div.style.padding = "5px";
		div.style.backgroundColor = "#FCF7D1";
		div.style.border = "1px solid #EACB6B";
		div.style.textAlign = "left";
		div.style.zIndex = '7900'; 
		div.style.fontSize = '11px'; 
		
		div.style.left = document.body.scrollLeft + (document.body.clientWidth - div.offsetWidth) - 5 + "px";
		div.style.top = document.body.scrollTop + 5 + "px";
	}
	if (typeof text == "object")
	{
		for (var ii in text)
		{
			div.innerHTML += ii + ': ' + text[ii] + "<br />";
		}
	}
	else
	{
		div.innerHTML += text + "<br />";
	}
	return;
}
/************************************************/

function PhotoPopupMenu()
{
	var _this = this;
	this.active = null;
	this.just_hide_item = false;
	this.events = null;
	
	this.PopupShow = function(div, pos, set_width, set_shadow, events)
	{
		this.PopupHide();
		if (!div) { return; } 
		if (typeof(pos) != "object") { pos = {}; } 

		this.active = div.id;
		
		if (set_width !== false && !div.style.width)
		{
			div.style.width = div.offsetWidth + 'px';
		}
		
		this.events = ((events && typeof events == "object") ? events : null);

		var res = jsUtils.GetWindowSize();
		
		pos['top'] = (pos['top'] ? pos['top'] : parseInt(res["scrollTop"] + res["innerHeight"]/2 - div.offsetHeight/2));
		pos['left'] = (pos['left'] ? pos['left'] : parseInt(res["scrollLeft"] + res["innerWidth"]/2 - div.offsetWidth/2));
		
		jsFloatDiv.Show(div, pos["left"], pos["top"], set_shadow, true, false);
		div.style.display = '';
		
		jsUtils.addEvent(document, "keypress", _this.OnKeyPress);
		
		var substrate = document.getElementById("photo_substrate");
		if (!substrate)
		{
			substrate = document.createElement("DIV");
			substrate.id = 	"photo_substrate";
			substrate.style.position = "absolute";
			substrate.style.display = "none";
			substrate.style.background = "#052635";
			substrate.style.opacity = "0.5";
			substrate.style.top = "0";
			substrate.style.left = "0";
			if (substrate.style.MozOpacity)
				substrate.style.MozOpacity = '0.5';
			else if (substrate.style.KhtmlOpacity)
				substrate.style.KhtmlOpacity = '0.5';
			if (jsUtils.IsIE())
		 		substrate.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity=50)";
			document.body.appendChild(substrate);
		}
		
		substrate.style.width = res["scrollWidth"] + "px";
		substrate.style.height = res["scrollHeight"] + "px";
		substrate.style.zIndex = 7500;
		substrate.style.display = 'block';
	}

	this.PopupHide = function()
	{
		this.active = (this.active == null && arguments[0] ? arguments[0] : this.active);
		
		this.CheckEvent('BeforeHide');
		
		var div = document.getElementById(this.active);
		if (div)
		{
			jsFloatDiv.Close(div);
			div.style.display = 'none';
			if (!this.just_hide_item) {div.parentNode.removeChild(div); } 
		}
		var substrate = document.getElementById("photo_substrate");
		if (substrate) { substrate.style.display = 'none'; } 

		this.active = null;
		
		jsUtils.removeEvent(document, "keypress", _this.OnKeyPress);
		
		this.CheckEvent('AfterHide');
		this.events = null;
	}

	this.CheckClick = function(e)
	{
		var div = document.getElementById(_this.active);
		
		if (!div || !_this.IsVisible()) { return; }
		if (!jsUtils.IsIE() && e.target.tagName == 'OPTION') { return false; }
		
		var x = e.clientX + document.body.scrollLeft;
		var y = e.clientY + document.body.scrollTop;

		/*menu region*/
		var posLeft = parseInt(div.style.left);
		var posTop = parseInt(div.style.top);
		var posRight = posLeft + div.offsetWidth;
		var posBottom = posTop + div.offsetHeight;
		
		if (x >= posLeft && x <= posRight && y >= posTop && y <= posBottom) { return; }

		if(_this.controlDiv)
		{
			var pos = jsUtils.GetRealPos(_this.controlDiv);
			if(x >= pos['left'] && x <= pos['right'] && y >= pos['top'] && y <= pos['bottom'])
				return;
		}
		_this.PopupHide();
	}

	this.OnKeyPress = function(e)
	{
		if(!e) e = window.event
		if(!e) return;
		if(e.keyCode == 27)
			_this.PopupHide();
	},

	this.IsVisible = function()
	{
		return (document.getElementById(this.active).style.visibility != 'hidden');
	}, 
	
	this.CheckEvent = function()
	{
		if (!this.events || this.events == null)
		{
			return false;
		}
		
		eventName = arguments[0];
		
		if (this.events[eventName]) 
		{ 
			return this.events[eventName](arguments); 
		} 
		return true;
	}
}
var PhotoMenu;
if (!PhotoMenu) 
	PhotoMenu = new PhotoPopupMenu();

var jsUtilsPhoto = {
	GetElementParams : function(element)
	{
		if (!element) return false;
		if (element.style.display != 'none' && element.style.display != null)
			return {width: element.offsetWidth, height: element.offsetHeight};
		var originstyles = {position: element.style.position, visibility : element.style.visibility, display: element.style.display};
		element.style.position = 'absolute';
		element.style.visibility = 'hidden';
		element.style.display = 'block';
		var result = {width: element.offsetWidth, height: element.offsetHeight};
		element.style.display = originstyles.display;
		element.style.visibility = originstyles.visibility;
		element.style.position = originstyles.position;
		return result;
	}, 
	ClassCreate : function(parent, properties)
	{
		function oClass() { 
			this.init.apply(this, arguments); 
		}
		
		if (parent) 
		{
			var temp = function() { };
			temp.prototype = parent.prototype;
			oClass.prototype = new temp;
		}
		
		for (var property in properties)
			oClass.prototype[property] = properties[property];
		if (!oClass.prototype.init)
			oClass.prototype.init = function() {};
		
		oClass.prototype.constructor = oClass;
		
		return oClass;
	}, 
	ObjectsMerge : function(arr1, arr2)
	{
		var arr3 = {};
		for (var key in arr1)
			arr3[key] = arr1[key];
		for (var key in arr2)
			arr3[key] = arr2[key];
		return arr3;
	}
}; 

window.bPhotoMainLoad = true;
/* End */
;; /* /bitrix/components/bitrix/main.interface.buttons/templates/.default/script.min.js?151131647237595*/
; /* /bitrix/components/bitrix/main.interface.buttons/templates/.default/utils.min.js?1511316472575*/
; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15113165822527*/
; /* /bitrix/components/bitrix/photogallery.section.list/templates/.default/script.js?15113165377387*/
; /* /bitrix/components/bitrix/photogallery/templates/.default/script.js?15113165376106*/

//# sourceMappingURL=page_0fa9596164c8e76a3c446c4c86f3481f.map.js