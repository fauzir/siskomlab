
; /* Start:"a:4:{s:4:"full";s:81:"/bitrix/components/bitrix/meeting.list/templates/.default/script.js?1511316533414";s:6:"source";s:67:"/bitrix/components/bitrix/meeting.list/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
window.meetingMenuPopup = {};

function ShowMenuPopup(meetingId, bindElement)
{
	if (meetingMenuPopup[meetingId])
		BX.PopupMenu.show(meetingId, bindElement, meetingMenuPopup[meetingId], {events: {onPopupClose: __onMenuPopupClose}});

	BX.addClass(bindElement, "meeting-menu-button-selected");

	return false;
} 

function __onMenuPopupClose()
{
	BX.removeClass(this.bindElement, "meeting-menu-button-selected");
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:100:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js?151131652313983";s:6:"source";s:80:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.js";s:3:"min";s:84:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js";s:3:"map";s:84:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.map.js";}"*/
(function(){if(window.IntranetUsers)return;window.IntranetUsers=function(e,t,a){this.name=e;this.multiple=t;this.arSelected=[];this.arFixed=[];this.bSubordinateOnly=a;this.ajaxUrl="";this.lastSearchTime=0};IntranetUsers.arStructure={};IntranetUsers.bSectionsOnly=false;IntranetUsers.arEmployees={group:{}};IntranetUsers.arEmployeesData={};IntranetUsers.ajaxUrl="";IntranetUsers.prototype.loadGroup=function(e){var t=BX(this.name+"_group_section_"+e);function a(t){IntranetUsers.arEmployees["group"][e]=t;this.show(e,t,"g")}e=parseInt(e);if(IntranetUsers.arEmployees["group"][e]!=null){this.show(e,IntranetUsers.arEmployees["group"][e],"g")}else{var s=this.getAjaxUrl()+"&MODE=EMPLOYEES&GROUP_ID="+e;BX.ajax.loadJSON(s,BX.proxy(a,this))}BX.toggleClass(t,"company-department-opened");BX.toggleClass(BX(this.name+"_gchildren_"+e),"company-department-children-opened")};IntranetUsers.prototype.load=function(e,t,a,s){this.bSectionsOnly=s;function n(t){IntranetUsers.arStructure[e]=t.STRUCTURE;IntranetUsers.arEmployees[e]=t.USERS;this.show(e,false,"",this.bSectionsOnly)}if(null==t)t=false;if(null==a)a=false;if(null==s)s=false;if(e!="extranet")e=parseInt(e);var r=BX(this.name+"_employee_section_"+e);if(!r.BX_LOADED){if(IntranetUsers.arEmployees[e]!=null){this.show(e,false,"",this.bSectionsOnly)}else{var i=this.getAjaxUrl()+"&MODE=EMPLOYEES&SECTION_ID="+e;BX.ajax.loadJSON(i,BX.proxy(n,this))}}if(a){BX(this.name+"_employee_search_layout").scrollTop=r.offsetTop-40}BX.toggleClass(r,"company-department-opened");BX.toggleClass(BX(this.name+"_children_"+e),"company-department-children-opened")};IntranetUsers.prototype.show=function(e,t,a,s){s=!!s;a=a||"";var n=BX(this.name+"_"+a+"employee_section_"+e);var r=t||IntranetUsers.arEmployees[e];if(n!==null){n.BX_LOADED=true}var i=BX(this.name+"_"+a+"employees_"+e);if(i){if(IntranetUsers.arStructure[e]!=null&&!a){var l=IntranetUsers.arStructure[e];var o=BX(this.name+"_"+a+"children_"+e);if(o){for(var c=0;c<l.length;c++){obSectionRow1=BX.create("div",{props:{className:"company-department"},children:[s?BX.create("span",{props:{className:"company-department-inner",id:this.name+"_employee_section_"+l[c].ID},children:[BX.create("div",{props:{className:"company-department-arrow"},attrs:{onclick:"O_"+this.name+".load("+l[c].ID+", false, false, true)"}}),BX.create("div",{props:{className:"company-department-text"},attrs:{"data-section-id":l[c].ID,onclick:"O_"+this.name+".selectSection("+this.name+"_employee_section_"+l[c].ID+")"},text:l[c].NAME})]}):BX.create("span",{props:{className:"company-department-inner",id:this.name+"_employee_section_"+l[c].ID},attrs:{onclick:"O_"+this.name+".load("+l[c].ID+")"},children:[BX.create("div",{props:{className:"company-department-arrow"}}),BX.create("div",{props:{className:"company-department-text"},text:l[c].NAME})]})]});obSectionRow2=BX.create("div",{props:{className:"company-department-children",id:this.name+"_children_"+l[c].ID},children:[BX.create("div",{props:{className:"company-department-employees",id:this.name+"_employees_"+l[c].ID},children:[BX.create("span",{props:{className:"company-department-employees-loading"},text:BX.message("INTRANET_EMP_WAIT")})]})]});o.appendChild(obSectionRow1);o.appendChild(obSectionRow2)}o.appendChild(i)}}i.innerHTML="";for(var c=0;c<r.length;c++){var d;var p=false;IntranetUsers.arEmployeesData[r[c].ID]={id:r[c].ID,name:r[c].NAME,sub:r[c].SUBORDINATE=="Y"?true:false,sup:r[c].SUPERORDINATE=="Y"?true:false,position:r[c].WORK_POSITION,photo:r[c].PHOTO};var m=BX.create("input",{props:{className:"intranet-hidden-input"}});if(this.multiple){m.name=this.name+"[]";m.type="checkbox"}else{m.name=this.name;m.type="radio"}var h=document.getElementsByName(m.name);var u=0;while(!p&&u<h.length){if(h[u].value==r[c].ID&&h[u].checked){p=true}u++}m.value=r[c].ID;d=BX.create("div",{props:{className:"company-department-employee"+(p?" company-department-employee-selected":"")},events:{click:BX.proxy(this.select,this)},children:[m,BX.create("div",{props:{className:"company-department-employee-avatar"},style:{background:r[c].PHOTO?"url('"+r[c].PHOTO+"') no-repeat center center":"",backgroundSize:r[c].PHOTO?"cover":""}}),BX.create("div",{props:{className:"company-department-employee-icon"}}),BX.create("div",{props:{className:"company-department-employee-info"},children:[BX.create("div",{props:{className:"company-department-employee-name"},text:r[c].NAME}),BX.create("div",{props:{className:"company-department-employee-position"},html:!r[c].HEAD&&!r[c].WORK_POSITION?"&nbsp;":BX.util.htmlspecialchars(r[c].WORK_POSITION)+(r[c].HEAD&&r[c].WORK_POSITION?", ":"")+(r[c].HEAD?BX.message("INTRANET_EMP_HEAD"):"")})]})]});i.appendChild(d)}}};IntranetUsers.prototype.select=function(e){var t;var a=0;var s=e.target||e.srcElement;if(e.currentTarget){t=e.currentTarget}else{t=s;while(!BX.hasClass(t,"finder-box-item")&&!BX.hasClass(t,"company-department-employee")){t=t.parentNode}}var n=BX.findChild(t,{tag:"input"});if(!this.multiple){var r=document.getElementsByName(this.name);for(var a=0;a<r.length;a++){if(r[a].value!=n.value){BX.removeClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}else{BX.addClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}n.checked=true;BX.addClass(t,BX.hasClass(t,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected");this.searchInput.value=IntranetUsers.arEmployeesData[n.value].name;this.arSelected=[];this.arSelected[n.value]={id:n.value,name:IntranetUsers.arEmployeesData[n.value].name,sub:IntranetUsers.arEmployeesData[n.value].sub,sup:IntranetUsers.arEmployeesData[n.value].sup,position:IntranetUsers.arEmployeesData[n.value].position,photo:IntranetUsers.arEmployeesData[n.value].photo}}else{var r=document.getElementsByName(this.name+"[]");if(!BX.util.in_array(n,r)&&!BX.util.in_array(n.value,this.arFixed)){n.checked=false;BX.toggleClass(n.parentNode,BX.hasClass(n.parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}for(var a=0;a<r.length;a++){if(r[a].value==n.value&&!BX.util.in_array(n.value,this.arFixed)){r[a].checked=false;BX.toggleClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}if(BX.hasClass(n.parentNode,"finder-box-item-selected")||BX.hasClass(n.parentNode,"company-department-employee-selected")){n.checked=true}if(n.checked){var i=BX.findChild(BX(this.name+"_selected_users"),{className:"finder-box-selected-items"});if(!BX(this.name+"_employee_selected_"+n.value)){var l=BX.create("DIV");l.id=this.name+"_employee_selected_"+n.value;l.className="finder-box-selected-item";var o=BX.findChild(t,{tag:"DIV",className:"finder-box-item-text"},true)||BX.findChild(t,{tag:"DIV",className:"company-department-employee-name"},true);l.innerHTML='<div class="finder-box-selected-item-icon" id="'+this.name+"-user-selector-unselect-"+n.value+'" onclick="O_'+this.name+".unselect("+n.value+', this);"></div><span class="finder-box-selected-item-text">'+o.innerHTML+"</span>";i.appendChild(l);var c=BX(this.name+"_current_count");c.innerHTML=parseInt(c.innerHTML)+1;this.arSelected[n.value]={id:n.value,name:IntranetUsers.arEmployeesData[n.value].name,sub:IntranetUsers.arEmployeesData[n.value].sub,sup:IntranetUsers.arEmployeesData[n.value].sup,position:IntranetUsers.arEmployeesData[n.value].position,photo:IntranetUsers.arEmployeesData[n.value].photo}}}else{BX.remove(BX(this.name+"_employee_selected_"+n.value));var c=BX(this.name+"_current_count");c.innerHTML=parseInt(c.innerHTML)-1;this.arSelected[n.value]=null}}var d=BX.util.array_search(n.value,IntranetUsers.lastUsers);if(d>=0)IntranetUsers.lastUsers.splice(d,1);IntranetUsers.lastUsers.unshift(n.value);BX.userOptions.save("intranet","user_search","last_selected",IntranetUsers.lastUsers.slice(0,10));if(this.onSelect){var p=this.arSelected.pop();this.arSelected.push(p);this.onSelect(p)}BX.onCustomEvent(this,"on-change",[this.toObject(this.arSelected)]);if(this.onChange){this.onChange(this.arSelected)}};IntranetUsers.prototype.toObject=function(e){var t={};for(var a in e){a=parseInt(a);if(typeof a=="number"&&e[a]!==null){t[a]=BX.clone(e[a])}}return t};IntranetUsers.prototype.selectSection=function(e){var t=BX(e);if(!t){return false}else{var a=BX.findChild(t,{tag:"div",className:"company-department-text"});if(a){if(this.onSectionSelect){this.onSectionSelect({id:a.getAttribute("data-section-id"),name:a.innerHTML})}}}};IntranetUsers.prototype.unselect=function(e){var t=BX(this.name+"-user-selector-unselect-"+e);var a=document.getElementsByName(this.name+(this.multiple?"[]":""));for(var s=0;s<a.length;s++){if(a[s].value==e){a[s].checked=false;BX.removeClass(a[s].parentNode,BX.hasClass(a[s].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}if(this.multiple){if(t){BX.remove(t.parentNode)}var n=BX(this.name+"_current_count");n.innerHTML=parseInt(n.innerHTML)-1}this.arSelected[e]=null;BX.onCustomEvent(this,"on-change",[this.toObject(this.arSelected)]);if(this.onChange){this.onChange(this.arSelected)}};IntranetUsers.prototype.getSelected=function(){return this.arSelected};IntranetUsers.prototype.setSelected=function(e){for(var t=0,a=this.arSelected.length;t<a;t++){if(this.arSelected[t]&&this.arSelected[t].id)this.unselect(this.arSelected[t].id)}if(!this.multiple){e=[e[0]]}this.arSelected=[];for(var t=0,a=e.length;t<a;t++){this.arSelected[e[t].id]=e[t];var s=BX.create("input",{props:{className:"intranet-hidden-input",value:e[t].id,checked:"checked",name:this.name+(this.multiple?"[]":"")}});BX(this.name+"_last").appendChild(s);if(this.multiple){var n=BX.findChild(BX(this.name+"_selected_users"),{className:"finder-box-selected-items"});var r=BX.create("div",{props:{className:"finder-box-selected-item",id:this.name+"_employee_selected_"+e[t].id},html:'<div class="finder-box-selected-item-icon" id="'+this.name+"-user-selector-unselect-"+e[t].id+'" onclick="O_'+this.name+".unselect("+e[t].id+', this);"></div><span class="finder-box-selected-item-text">'+BX.util.htmlspecialchars(e[t].name)+"</span>"});n.appendChild(r)}var i=document.getElementsByName(this.name+(this.multiple?"[]":""));for(var l=0;l<i.length;l++){if(i[l].value==e[t].id){BX.toggleClass(i[l].parentNode,BX.hasClass(i[l].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}}if(this.multiple){BX.adjust(BX(this.name+"_current_count"),{text:e.length})}};IntranetUsers.prototype.setFixed=function(e){if(typeof e!="object")e=[];this.arFixed=e;var t=BX.findChildren(BX(this.name+"_selected_users"),{className:"finder-box-selected-item-icon"},true);for(i=0;i<t.length;i++){var a=t[i].id.replace(this.name+"-user-selector-unselect-","");BX.adjust(t[i],{style:{visibility:BX.util.in_array(a,this.arFixed)?"hidden":"visible"}})}};IntranetUsers.prototype.search=function(e){this.searchRqstTmt=clearTimeout(this.searchRqstTmt);if(typeof this.searchRqst=="object"){this.searchRqst.abort();this.searchRqst=false}if(!e)e=window.event;if(this.searchInput.value.length>0){this.displayTab("search");var t=this.getAjaxUrl()+"&MODE=SEARCH&SEARCH_STRING="+encodeURIComponent(this.searchInput.value);if(this.bSubordinateOnly)t+="&S_ONLY=Y";var a=this;this.searchRqstTmt=setTimeout(function(){var e=(new Date).getTime();a.lastSearchTime=e;a.searchRqst=BX.ajax.loadJSON(t,BX.proxy(function(t){if(a.lastSearchTime==e)a.showResults(t)},a))},400)}};IntranetUsers.prototype.showResults=function(e){var t=e;var a=BX(this.name+"_search");var s=a.getElementsByTagName("input");for(var n=0,r=s.length;n<r;n++){if(s[n].checked){BX(this.name+"_last").appendChild(s[n])}}if(a){a.innerHTML="";var i=BX.create("table",{props:{className:"finder-box-tab-columns",cellspacing:"0"},children:[BX.create("tbody")]});var l=BX.create("tr");i.firstChild.appendChild(l);var o=BX.create("td");l.appendChild(o);a.appendChild(i);for(var n=0;n<t.length;n++){var c;var d=false;IntranetUsers.arEmployeesData[t[n].ID]={id:t[n].ID,name:t[n].NAME,sub:t[n].SUBORDINATE=="Y"?true:false,sup:t[n].SUPERORDINATE=="Y"?true:false,position:t[n].WORK_POSITION,photo:t[n].PHOTO};var p=BX.create("input",{props:{className:"intranet-hidden-input"}});if(this.multiple){p.name=this.name+"[]";p.type="checkbox"}else{p.name=this.name;p.type="radio"}var s=document.getElementsByName(p.name);var m=0;while(!d&&m<s.length){if(s[m].value==t[n].ID&&s[m].checked){d=true}m++}p.value=t[n].ID;var h=t[n].NAME;var u="finded_anchor_user_id_"+t[n].ID;c=BX.create("div",{props:{className:"finder-box-item"+(d?" finder-box-item-selected":""),id:u},events:{click:BX.proxy(this.select,this)},children:[p,BX.create("div",{props:{className:"finder-box-item-text"},text:h}),BX.create("div",{props:{className:"finder-box-item-icon"}})]});o.appendChild(c);if(n==Math.ceil(t.length/2)-1){o=BX.create("td");i.firstChild.appendChild(o)}BX.tooltip(t[n].ID,u,"")}}};IntranetUsers.prototype.displayTab=function(e){BX.removeClass(BX(this.name+"_last"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_search"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_structure"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_groups"),"finder-box-tab-content-selected");BX.addClass(BX(this.name+"_"+e),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_tab_last"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_search"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_structure"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_groups"),"finder-box-tab-selected");BX.addClass(BX(this.name+"_tab_"+e),"finder-box-tab-selected")};IntranetUsers.prototype._onFocus=function(){this.searchInput.value=""};IntranetUsers.prototype.getAjaxUrl=function(){return this.ajaxUrl||IntranetUsers.ajaxUrl}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:102:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.min.js?15113165826649";s:6:"source";s:83:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.js";s:3:"min";s:87:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.min.js";s:3:"map";s:87:"/bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.map.js";}"*/
(function(t){var e={};BX.GroupsPopup={searchTimeout:null,oXHR:null,create:function(t,i,o){if(!e[t])e[t]=new s(t,i,o);return e[t]},abortSearchRequest:function(){if(this.oXHR){this.oXHR.abort()}}};var s=function(e,s,i){this.tabs=[];this.items2Objects=[];this.selected=[];this.lastGroups=[];this.myGroups=[];this.featuresPerms=null;var o=[];if(i){if(i.lastGroups){this.lastGroups=i.lastGroups}if(i.myGroups){this.myGroups=i.myGroups}if(i.featuresPerms){this.featuresPerms=i.featuresPerms}if(i.events){for(var a in i.events){if(i.events.hasOwnProperty(a)){BX.addCustomEvent(this,a,i.events[a])}}}if(i.selected&&i.selected.length){this.selected=i.selected;BX.onCustomEvent(this,"onGroupSelect",[this.selected,{onInit:true}])}if(i.searchInput){this.searchInput=i.searchInput}else{this.searchInput=BX.create("input",{props:{className:"bx-finder-box-search-textbox"}});o.push(BX.create("div",{props:{className:"bx-finder-box-search"},style:{},children:[this.searchInput]}))}}BX.adjust(this.searchInput,{events:{keyup:BX.proxy(function(e){if(!e)e=t.event;this.search((e.target||e.srcElement).value)},this),focus:function(){this.value=""},blur:BX.proxy(function(){setTimeout(BX.proxy(function(){if(this.selected[0]){this.searchInput.value=this.selected[0].title}},this),150)},this)}});this.ajaxURL="/bitrix/components/bitrix/socialnetwork.group.selector/ajax.php";if(this.lastGroups.length>0){this.addTab("last",this.lastGroups)}if(this.myGroups.length>0){this.addTab("my",this.myGroups)}this.addTab("search");this.tabsOuter=BX.create("div",{props:{className:"bx-finder-box-tabs"}});this.tabsContentOuter=BX.create("td",{props:{className:"bx-finder-box-tabs-content-cell"}});o.splice(o.length,0,this.tabsOuter,BX.create("div",{props:{className:"popup-window-hr popup-window-buttons-hr"},html:"<i></i>"}),BX.create("div",{props:{className:"bx-finder-box-tabs-content"},children:[BX.create("table",{props:{className:"bx-finder-box-tabs-content-table"},children:[BX.create("tr",{children:[this.tabsContentOuter]})]})]}));this.content=BX.create("div",{props:{className:"bx-finder-box bx-lm-box sonet-groups-finder-box"},style:{padding:"2px 6px 6px 6px",minWidth:"500px"},children:o});this.popupWindow=BX.PopupWindowManager.create(e,s,{content:"",autoHide:true,events:{onPopupFirstShow:BX.proxy(function(t){t.setContent(this.content)},this),onPopupShow:BX.proxy(function(t){this.__render()},this)},buttons:[new BX.PopupWindowButton({text:BX.message("SONET_GROUP_BUTTON_CLOSE"),className:"popup-window-button-accept task-edit-popup-close-but",events:{click:function(){this.popupWindow.close()}}})]})};s.prototype.show=function(){this.popupWindow.show();this.searchInput.focus()};s.prototype.selectTab=function(t){for(var e in this.tabs){if(this.tabs.hasOwnProperty(e)){BX.removeClass(this.tabs[e].tab,"bx-finder-box-tab-selected");BX.adjust(this.tabs[e].content,{style:{display:"none"}})}}BX.addClass(t.tab,"bx-finder-box-tab-selected");BX.adjust(t.content,{style:{display:"block"}})};s.prototype.addTab=function(t,e,s){var i=BX.create("div",{props:{className:"bx-finder-box-tab-content bx-lm-box-tab-content-sonetgroup"}});if(s){BX.adjust(i,{style:{display:"block"}})}var o=BX.create("span",{props:{className:"bx-finder-box-tab"+(s?" bx-finder-box-tab-selected":"")},text:BX.message("SONET_GROUP_TABS_"+t.toUpperCase())});this.tabs[t]={tab:o,content:i};BX.adjust(this.tabs[t].tab,{events:{click:BX.proxy(function(){this.selectTab(this.tabs[t])},this)}});if(e){this.setItems(this.tabs[t],e)}};s.prototype.setItems=function(t,e){BX.cleanNode(t.content);if(!!e){for(var s=0,i=e.length;s<i;s++){t.content.appendChild(this.__renderItem(e[s]))}}};s.prototype.select=function(t){this.selected=[t];var e=0;var s=0;clearTimeout(BX.GroupsPopup.searchTimeout);if(this.items2Objects[t.id]){for(e=0,s=this.items2Objects[t.id].length;e<s;e++){BX.addClass(this.items2Objects[t.id][e],"bx-finder-box-item-t7-selected")}}BX.onCustomEvent(this,"onGroupSelect",[this.selected,{onInit:false}]);var i=[t.id];for(e=0,s=this.lastGroups.length;e<s;e++){if(!BX.util.in_array(this.lastGroups[e].id,i)){i.push(this.lastGroups[e].id)}}BX.userOptions.save("socialnetwork","groups_popup","last_selected",i.slice(0,10));if(this.selected[0]){this.searchInput.value=this.selected[0].title}this.popupWindow.close()};s.prototype.deselect=function(t){this.selected=[];if(t&&this.items2Objects[t]){for(var e=0,s=this.items2Objects[t].length;e<s;e++){BX.removeClass(this.items2Objects[t][e],"bx-finder-box-item-t7-selected")}}this.searchInput.value=""};s.prototype.search=function(t){if(t.length>0){clearTimeout(BX.GroupsPopup.searchTimeout);BX.GroupsPopup.abortSearchRequest();this.selectTab(this.tabs["search"]);var e=this.ajaxURL+"?mode=search&SITE_ID="+__bx_group_site_id+"&query="+encodeURIComponent(t);if(this.featuresPerms){e+="&features_perms[0]="+encodeURIComponent(this.featuresPerms[0]);e+="&features_perms[1]="+encodeURIComponent(this.featuresPerms[1])}BX.GroupsPopup.searchTimeout=setTimeout(BX.delegate(function(){BX.GroupsPopup.oXHR=BX.ajax.loadJSON(e,BX.proxy(function(t){this.setItems(this.tabs["search"],t)},this))},this),1e3)}else{clearTimeout(BX.GroupsPopup.searchTimeout)}};s.prototype.__render=function(){var t=false;BX.cleanNode(this.tabsOuter);BX.cleanNode(this.tabsContentOuter);for(var e in this.tabs){if(this.tabs.hasOwnProperty(e)){if(!t){t=BX.hasClass(this.tabs[e].tab,"bx-finder-box-tab-selected")}this.tabsOuter.appendChild(this.tabs[e].tab);this.tabsContentOuter.appendChild(this.tabs[e].content)}}if(!t){this.selectTab(this.tabs["last"]||this.tabs["my"]||this.tabs["search"])}};s.prototype.__renderItem=function(t){var e=BX.create("div",{props:{className:"bx-finder-box-item-t7-avatar bx-finder-box-item-t7-group-avatar"}});if(t.image){BX.adjust(e,{style:{background:"url('"+t.image+"') no-repeat center center",backgroundSize:"24px 24px"}})}var s=false;for(var i=0;i<this.selected.length;i++){if(this.selected[i].id==t.id){s=true;break}}var o=BX.create("div",{props:{className:"bx-finder-box-item-t7 bx-finder-element bx-lm-element-sonetgroup"+(typeof t.IS_EXTRANET!="undefined"&&t.IS_EXTRANET=="Y"?" bx-lm-element-extranet":"")+(s?" bx-finder-box-item-t7-selected":"")},children:[e,BX.create("div",{props:{className:"bx-finder-box-item-t7-space"}}),BX.create("div",{props:{className:"bx-finder-box-item-t7-info"},children:[BX.create("div",{text:t.title,props:{className:"bx-finder-box-item-t7-name"}})]})],events:{click:BX.proxy(function(){this.select(t)},this)}});if(!this.items2Objects[t.id]){this.items2Objects[t.id]=[o]}else if(!BX.util.in_array(o,this.items2Objects[t.id])){this.items2Objects[t.id].push(o)}return o}})(window);
/* End */
;; /* /bitrix/components/bitrix/meeting.list/templates/.default/script.js?1511316533414*/
; /* /bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js?151131652313983*/
; /* /bitrix/components/bitrix/socialnetwork.group.selector/templates/.default/script.min.js?15113165826649*/

//# sourceMappingURL=page_0238b537b13e33933ed390a377b4d381.map.js