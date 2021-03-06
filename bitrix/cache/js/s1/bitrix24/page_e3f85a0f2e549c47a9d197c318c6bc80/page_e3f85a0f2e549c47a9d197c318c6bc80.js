
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
; /* Start:"a:4:{s:4:"full";s:100:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js?151131652313983";s:6:"source";s:80:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.js";s:3:"min";s:84:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js";s:3:"map";s:84:"/bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.map.js";}"*/
(function(){if(window.IntranetUsers)return;window.IntranetUsers=function(e,t,a){this.name=e;this.multiple=t;this.arSelected=[];this.arFixed=[];this.bSubordinateOnly=a;this.ajaxUrl="";this.lastSearchTime=0};IntranetUsers.arStructure={};IntranetUsers.bSectionsOnly=false;IntranetUsers.arEmployees={group:{}};IntranetUsers.arEmployeesData={};IntranetUsers.ajaxUrl="";IntranetUsers.prototype.loadGroup=function(e){var t=BX(this.name+"_group_section_"+e);function a(t){IntranetUsers.arEmployees["group"][e]=t;this.show(e,t,"g")}e=parseInt(e);if(IntranetUsers.arEmployees["group"][e]!=null){this.show(e,IntranetUsers.arEmployees["group"][e],"g")}else{var s=this.getAjaxUrl()+"&MODE=EMPLOYEES&GROUP_ID="+e;BX.ajax.loadJSON(s,BX.proxy(a,this))}BX.toggleClass(t,"company-department-opened");BX.toggleClass(BX(this.name+"_gchildren_"+e),"company-department-children-opened")};IntranetUsers.prototype.load=function(e,t,a,s){this.bSectionsOnly=s;function n(t){IntranetUsers.arStructure[e]=t.STRUCTURE;IntranetUsers.arEmployees[e]=t.USERS;this.show(e,false,"",this.bSectionsOnly)}if(null==t)t=false;if(null==a)a=false;if(null==s)s=false;if(e!="extranet")e=parseInt(e);var r=BX(this.name+"_employee_section_"+e);if(!r.BX_LOADED){if(IntranetUsers.arEmployees[e]!=null){this.show(e,false,"",this.bSectionsOnly)}else{var i=this.getAjaxUrl()+"&MODE=EMPLOYEES&SECTION_ID="+e;BX.ajax.loadJSON(i,BX.proxy(n,this))}}if(a){BX(this.name+"_employee_search_layout").scrollTop=r.offsetTop-40}BX.toggleClass(r,"company-department-opened");BX.toggleClass(BX(this.name+"_children_"+e),"company-department-children-opened")};IntranetUsers.prototype.show=function(e,t,a,s){s=!!s;a=a||"";var n=BX(this.name+"_"+a+"employee_section_"+e);var r=t||IntranetUsers.arEmployees[e];if(n!==null){n.BX_LOADED=true}var i=BX(this.name+"_"+a+"employees_"+e);if(i){if(IntranetUsers.arStructure[e]!=null&&!a){var l=IntranetUsers.arStructure[e];var o=BX(this.name+"_"+a+"children_"+e);if(o){for(var c=0;c<l.length;c++){obSectionRow1=BX.create("div",{props:{className:"company-department"},children:[s?BX.create("span",{props:{className:"company-department-inner",id:this.name+"_employee_section_"+l[c].ID},children:[BX.create("div",{props:{className:"company-department-arrow"},attrs:{onclick:"O_"+this.name+".load("+l[c].ID+", false, false, true)"}}),BX.create("div",{props:{className:"company-department-text"},attrs:{"data-section-id":l[c].ID,onclick:"O_"+this.name+".selectSection("+this.name+"_employee_section_"+l[c].ID+")"},text:l[c].NAME})]}):BX.create("span",{props:{className:"company-department-inner",id:this.name+"_employee_section_"+l[c].ID},attrs:{onclick:"O_"+this.name+".load("+l[c].ID+")"},children:[BX.create("div",{props:{className:"company-department-arrow"}}),BX.create("div",{props:{className:"company-department-text"},text:l[c].NAME})]})]});obSectionRow2=BX.create("div",{props:{className:"company-department-children",id:this.name+"_children_"+l[c].ID},children:[BX.create("div",{props:{className:"company-department-employees",id:this.name+"_employees_"+l[c].ID},children:[BX.create("span",{props:{className:"company-department-employees-loading"},text:BX.message("INTRANET_EMP_WAIT")})]})]});o.appendChild(obSectionRow1);o.appendChild(obSectionRow2)}o.appendChild(i)}}i.innerHTML="";for(var c=0;c<r.length;c++){var d;var p=false;IntranetUsers.arEmployeesData[r[c].ID]={id:r[c].ID,name:r[c].NAME,sub:r[c].SUBORDINATE=="Y"?true:false,sup:r[c].SUPERORDINATE=="Y"?true:false,position:r[c].WORK_POSITION,photo:r[c].PHOTO};var m=BX.create("input",{props:{className:"intranet-hidden-input"}});if(this.multiple){m.name=this.name+"[]";m.type="checkbox"}else{m.name=this.name;m.type="radio"}var h=document.getElementsByName(m.name);var u=0;while(!p&&u<h.length){if(h[u].value==r[c].ID&&h[u].checked){p=true}u++}m.value=r[c].ID;d=BX.create("div",{props:{className:"company-department-employee"+(p?" company-department-employee-selected":"")},events:{click:BX.proxy(this.select,this)},children:[m,BX.create("div",{props:{className:"company-department-employee-avatar"},style:{background:r[c].PHOTO?"url('"+r[c].PHOTO+"') no-repeat center center":"",backgroundSize:r[c].PHOTO?"cover":""}}),BX.create("div",{props:{className:"company-department-employee-icon"}}),BX.create("div",{props:{className:"company-department-employee-info"},children:[BX.create("div",{props:{className:"company-department-employee-name"},text:r[c].NAME}),BX.create("div",{props:{className:"company-department-employee-position"},html:!r[c].HEAD&&!r[c].WORK_POSITION?"&nbsp;":BX.util.htmlspecialchars(r[c].WORK_POSITION)+(r[c].HEAD&&r[c].WORK_POSITION?", ":"")+(r[c].HEAD?BX.message("INTRANET_EMP_HEAD"):"")})]})]});i.appendChild(d)}}};IntranetUsers.prototype.select=function(e){var t;var a=0;var s=e.target||e.srcElement;if(e.currentTarget){t=e.currentTarget}else{t=s;while(!BX.hasClass(t,"finder-box-item")&&!BX.hasClass(t,"company-department-employee")){t=t.parentNode}}var n=BX.findChild(t,{tag:"input"});if(!this.multiple){var r=document.getElementsByName(this.name);for(var a=0;a<r.length;a++){if(r[a].value!=n.value){BX.removeClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}else{BX.addClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}n.checked=true;BX.addClass(t,BX.hasClass(t,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected");this.searchInput.value=IntranetUsers.arEmployeesData[n.value].name;this.arSelected=[];this.arSelected[n.value]={id:n.value,name:IntranetUsers.arEmployeesData[n.value].name,sub:IntranetUsers.arEmployeesData[n.value].sub,sup:IntranetUsers.arEmployeesData[n.value].sup,position:IntranetUsers.arEmployeesData[n.value].position,photo:IntranetUsers.arEmployeesData[n.value].photo}}else{var r=document.getElementsByName(this.name+"[]");if(!BX.util.in_array(n,r)&&!BX.util.in_array(n.value,this.arFixed)){n.checked=false;BX.toggleClass(n.parentNode,BX.hasClass(n.parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}for(var a=0;a<r.length;a++){if(r[a].value==n.value&&!BX.util.in_array(n.value,this.arFixed)){r[a].checked=false;BX.toggleClass(r[a].parentNode,BX.hasClass(r[a].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}if(BX.hasClass(n.parentNode,"finder-box-item-selected")||BX.hasClass(n.parentNode,"company-department-employee-selected")){n.checked=true}if(n.checked){var i=BX.findChild(BX(this.name+"_selected_users"),{className:"finder-box-selected-items"});if(!BX(this.name+"_employee_selected_"+n.value)){var l=BX.create("DIV");l.id=this.name+"_employee_selected_"+n.value;l.className="finder-box-selected-item";var o=BX.findChild(t,{tag:"DIV",className:"finder-box-item-text"},true)||BX.findChild(t,{tag:"DIV",className:"company-department-employee-name"},true);l.innerHTML='<div class="finder-box-selected-item-icon" id="'+this.name+"-user-selector-unselect-"+n.value+'" onclick="O_'+this.name+".unselect("+n.value+', this);"></div><span class="finder-box-selected-item-text">'+o.innerHTML+"</span>";i.appendChild(l);var c=BX(this.name+"_current_count");c.innerHTML=parseInt(c.innerHTML)+1;this.arSelected[n.value]={id:n.value,name:IntranetUsers.arEmployeesData[n.value].name,sub:IntranetUsers.arEmployeesData[n.value].sub,sup:IntranetUsers.arEmployeesData[n.value].sup,position:IntranetUsers.arEmployeesData[n.value].position,photo:IntranetUsers.arEmployeesData[n.value].photo}}}else{BX.remove(BX(this.name+"_employee_selected_"+n.value));var c=BX(this.name+"_current_count");c.innerHTML=parseInt(c.innerHTML)-1;this.arSelected[n.value]=null}}var d=BX.util.array_search(n.value,IntranetUsers.lastUsers);if(d>=0)IntranetUsers.lastUsers.splice(d,1);IntranetUsers.lastUsers.unshift(n.value);BX.userOptions.save("intranet","user_search","last_selected",IntranetUsers.lastUsers.slice(0,10));if(this.onSelect){var p=this.arSelected.pop();this.arSelected.push(p);this.onSelect(p)}BX.onCustomEvent(this,"on-change",[this.toObject(this.arSelected)]);if(this.onChange){this.onChange(this.arSelected)}};IntranetUsers.prototype.toObject=function(e){var t={};for(var a in e){a=parseInt(a);if(typeof a=="number"&&e[a]!==null){t[a]=BX.clone(e[a])}}return t};IntranetUsers.prototype.selectSection=function(e){var t=BX(e);if(!t){return false}else{var a=BX.findChild(t,{tag:"div",className:"company-department-text"});if(a){if(this.onSectionSelect){this.onSectionSelect({id:a.getAttribute("data-section-id"),name:a.innerHTML})}}}};IntranetUsers.prototype.unselect=function(e){var t=BX(this.name+"-user-selector-unselect-"+e);var a=document.getElementsByName(this.name+(this.multiple?"[]":""));for(var s=0;s<a.length;s++){if(a[s].value==e){a[s].checked=false;BX.removeClass(a[s].parentNode,BX.hasClass(a[s].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}if(this.multiple){if(t){BX.remove(t.parentNode)}var n=BX(this.name+"_current_count");n.innerHTML=parseInt(n.innerHTML)-1}this.arSelected[e]=null;BX.onCustomEvent(this,"on-change",[this.toObject(this.arSelected)]);if(this.onChange){this.onChange(this.arSelected)}};IntranetUsers.prototype.getSelected=function(){return this.arSelected};IntranetUsers.prototype.setSelected=function(e){for(var t=0,a=this.arSelected.length;t<a;t++){if(this.arSelected[t]&&this.arSelected[t].id)this.unselect(this.arSelected[t].id)}if(!this.multiple){e=[e[0]]}this.arSelected=[];for(var t=0,a=e.length;t<a;t++){this.arSelected[e[t].id]=e[t];var s=BX.create("input",{props:{className:"intranet-hidden-input",value:e[t].id,checked:"checked",name:this.name+(this.multiple?"[]":"")}});BX(this.name+"_last").appendChild(s);if(this.multiple){var n=BX.findChild(BX(this.name+"_selected_users"),{className:"finder-box-selected-items"});var r=BX.create("div",{props:{className:"finder-box-selected-item",id:this.name+"_employee_selected_"+e[t].id},html:'<div class="finder-box-selected-item-icon" id="'+this.name+"-user-selector-unselect-"+e[t].id+'" onclick="O_'+this.name+".unselect("+e[t].id+', this);"></div><span class="finder-box-selected-item-text">'+BX.util.htmlspecialchars(e[t].name)+"</span>"});n.appendChild(r)}var i=document.getElementsByName(this.name+(this.multiple?"[]":""));for(var l=0;l<i.length;l++){if(i[l].value==e[t].id){BX.toggleClass(i[l].parentNode,BX.hasClass(i[l].parentNode,"finder-box-item")?"finder-box-item-selected":"company-department-employee-selected")}}}if(this.multiple){BX.adjust(BX(this.name+"_current_count"),{text:e.length})}};IntranetUsers.prototype.setFixed=function(e){if(typeof e!="object")e=[];this.arFixed=e;var t=BX.findChildren(BX(this.name+"_selected_users"),{className:"finder-box-selected-item-icon"},true);for(i=0;i<t.length;i++){var a=t[i].id.replace(this.name+"-user-selector-unselect-","");BX.adjust(t[i],{style:{visibility:BX.util.in_array(a,this.arFixed)?"hidden":"visible"}})}};IntranetUsers.prototype.search=function(e){this.searchRqstTmt=clearTimeout(this.searchRqstTmt);if(typeof this.searchRqst=="object"){this.searchRqst.abort();this.searchRqst=false}if(!e)e=window.event;if(this.searchInput.value.length>0){this.displayTab("search");var t=this.getAjaxUrl()+"&MODE=SEARCH&SEARCH_STRING="+encodeURIComponent(this.searchInput.value);if(this.bSubordinateOnly)t+="&S_ONLY=Y";var a=this;this.searchRqstTmt=setTimeout(function(){var e=(new Date).getTime();a.lastSearchTime=e;a.searchRqst=BX.ajax.loadJSON(t,BX.proxy(function(t){if(a.lastSearchTime==e)a.showResults(t)},a))},400)}};IntranetUsers.prototype.showResults=function(e){var t=e;var a=BX(this.name+"_search");var s=a.getElementsByTagName("input");for(var n=0,r=s.length;n<r;n++){if(s[n].checked){BX(this.name+"_last").appendChild(s[n])}}if(a){a.innerHTML="";var i=BX.create("table",{props:{className:"finder-box-tab-columns",cellspacing:"0"},children:[BX.create("tbody")]});var l=BX.create("tr");i.firstChild.appendChild(l);var o=BX.create("td");l.appendChild(o);a.appendChild(i);for(var n=0;n<t.length;n++){var c;var d=false;IntranetUsers.arEmployeesData[t[n].ID]={id:t[n].ID,name:t[n].NAME,sub:t[n].SUBORDINATE=="Y"?true:false,sup:t[n].SUPERORDINATE=="Y"?true:false,position:t[n].WORK_POSITION,photo:t[n].PHOTO};var p=BX.create("input",{props:{className:"intranet-hidden-input"}});if(this.multiple){p.name=this.name+"[]";p.type="checkbox"}else{p.name=this.name;p.type="radio"}var s=document.getElementsByName(p.name);var m=0;while(!d&&m<s.length){if(s[m].value==t[n].ID&&s[m].checked){d=true}m++}p.value=t[n].ID;var h=t[n].NAME;var u="finded_anchor_user_id_"+t[n].ID;c=BX.create("div",{props:{className:"finder-box-item"+(d?" finder-box-item-selected":""),id:u},events:{click:BX.proxy(this.select,this)},children:[p,BX.create("div",{props:{className:"finder-box-item-text"},text:h}),BX.create("div",{props:{className:"finder-box-item-icon"}})]});o.appendChild(c);if(n==Math.ceil(t.length/2)-1){o=BX.create("td");i.firstChild.appendChild(o)}BX.tooltip(t[n].ID,u,"")}}};IntranetUsers.prototype.displayTab=function(e){BX.removeClass(BX(this.name+"_last"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_search"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_structure"),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_groups"),"finder-box-tab-content-selected");BX.addClass(BX(this.name+"_"+e),"finder-box-tab-content-selected");BX.removeClass(BX(this.name+"_tab_last"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_search"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_structure"),"finder-box-tab-selected");BX.removeClass(BX(this.name+"_tab_groups"),"finder-box-tab-selected");BX.addClass(BX(this.name+"_tab_"+e),"finder-box-tab-selected")};IntranetUsers.prototype._onFocus=function(){this.searchInput.value=""};IntranetUsers.prototype.getAjaxUrl=function(){return this.ajaxUrl||IntranetUsers.ajaxUrl}})();
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15113165822527*/
; /* /bitrix/components/bitrix/intranet.user.selector.new/templates/.default/users.min.js?151131652313983*/

//# sourceMappingURL=page_e3f85a0f2e549c47a9d197c318c6bc80.map.js