
; /* Start:"a:4:{s:4:"full";s:90:"/bitrix/components/bitrix/intranet.configs/templates/.default/script.min.js?15113165237025";s:6:"source";s:71:"/bitrix/components/bitrix/intranet.configs/templates/.default/script.js";s:3:"min";s:75:"/bitrix/components/bitrix/intranet.configs/templates/.default/script.min.js";s:3:"map";s:75:"/bitrix/components/bitrix/intranet.configs/templates/.default/script.map.js";}"*/
BX.namespace("BX.Bitrix24.Configs");BX.Bitrix24.Configs.LogoClass=function(){var e=function(e){this.ajaxPath=e};e.prototype.LogoChange=function(){BX("config-wait").style.display="inline-block";BX.ajax.submit(BX("configLogoPostForm"),function(e){try{var t=JSON.parse(e);if(t.error){BX("config_logo_error_block").style.display="block";var i=BX.findChild(BX("config_logo_error_block"),{"class":"content-edit-form-notice-text"},true,false);i.innerHTML="<span class='content-edit-form-notice-icon'></span>"+t.error}else if(t.path){BX("config_logo_error_block").style.display="none";BX("logo_24_text").style.display="none";BX("logo_24_img").src=t.path;BX("logo_24_img").style.display="block";BX("config_logo_img").src=t.path;BX("config_logo_img_div").style.display="inline-block";BX("config_logo_delete_link").style.display="inline-block"}BX("config-wait").style.display="none"}catch(o){BX("config-wait").style.display="none";return false}})};e.prototype.LogoDelete=function(e){if(confirm(BX.message("LogoDeleteConfirm"))){BX("config-wait").style.display="inline-block";BX.ajax.post(this.ajaxPath,{client_delete_logo:"Y",sessid:BX.bitrix_sessid()},function(){BX("logo_24_img").src="";BX("logo_24_img").style.display="none";BX("logo_24_text").style.display="block";BX("config_logo_img_div").style.display="none";e.style.display="none";BX("config_error_block").style.display="none";BX("config-wait").style.display="none"})}};return e}();BX.Bitrix24.Configs.LiveFeedRightClass=function(){var e=function(e){this.arToAllRights=e};e.prototype.DeleteToAllAccessRow=function(e){var t=BX("RIGHTS_div",true);var i=BX.findParent(e,{tag:"div",className:"toall-right"},t);if(i)var o=i.getAttribute("data-bx-right");if(i&&o){BX.remove(i);var r=[];for(var s=0;s<this.arToAllRights.length;s++)if(this.arToAllRights[s]!=o)r[r.length]=this.arToAllRights[s];this.arToAllRights=BX.clone(r);var a=BX("livefeed_toall_rights_"+o);if(a)BX.remove(a)}};e.prototype.ShowToAllAccessPopup=function(e){var t=this;e=e||[];BX.Access.Init({other:{disabled:false,disabled_g2:true,disabled_cr:true},groups:{disabled:true},socnetgroups:{disabled:true}});var i={};for(var o=0;o<e.length;o++)i[e[o]]=true;BX.Access.SetSelected(i);BX.Access.ShowForm({callback:function(e){var i=BX("RIGHTS_div",true);var o=false;for(var r in e){o=BX.Access.GetProviderName(r);for(var s in e[r]){i.appendChild(BX.create("div",{attrs:{"data-bx-right":s},props:{className:"toall-right"},children:[BX.create("span",{html:(o.length>0?o+": ":"")+e[r][s].name+"&nbsp;"}),BX.create("a",{attrs:{href:"javascript:void(0);",title:BX.message("SLToAllDel")},props:{className:"access-delete"},events:{click:function(){t.DeleteToAllAccessRow(this)}}})]}));BX("configPostForm").appendChild(BX.create("input",{attrs:{type:"hidden"},props:{name:"livefeed_toall_rights[]",id:"livefeed_toall_rights_"+s,value:s}}));t.arToAllRights[t.arToAllRights.length]=e[r][s].id}}}})};return e}();BX.Bitrix24.Configs.ImGeneralChatClass=function(){var e=function(e){this.arToAllRights=e};e.prototype.DeleteToAllAccessRow=function(e){var t=BX("chat_RIGHTS_div",true);var i=BX.findParent(e,{tag:"div",className:"toall-right"},t);if(i)var o=i.getAttribute("data-bx-right");if(i&&o){BX.remove(i);var r=[];for(var s=0;s<this.arToAllRights.length;s++)if(this.arToAllRights[s]!=o)r[r.length]=this.arToAllRights[s];this.arToAllRights=BX.clone(r);var a=BX("imchat_toall_rights_"+o);if(a)BX.remove(a)}};e.prototype.ShowToAllAccessPopup=function(e){var t=this;e=e||[];BX.Access.Init({other:{disabled:false,disabled_g2:true,disabled_cr:true},groups:{disabled:true},socnetgroups:{disabled:true}});var i={};for(var o=0;o<e.length;o++)i[e[o]]=true;BX.Access.SetSelected(i);BX.Access.ShowForm({callback:function(e){var i=BX("chat_RIGHTS_div",true);var o=false;for(var r in e){o=BX.Access.GetProviderName(r);for(var s in e[r]){i.appendChild(BX.create("div",{attrs:{"data-bx-right":s},props:{className:"toall-right"},children:[BX.create("span",{html:(o.length>0?o+": ":"")+e[r][s].name+"&nbsp;"}),BX.create("a",{attrs:{href:"javascript:void(0);",title:BX.message("SLToAllDel")},props:{className:"access-delete"},events:{click:function(){t.DeleteToAllAccessRow(this)}}})]}));BX("configPostForm").appendChild(BX.create("input",{attrs:{type:"hidden"},props:{name:"imchat_toall_rights[]",id:"imchat_toall_rights_"+s,value:s}}));t.arToAllRights[t.arToAllRights.length]=e[r][s].id}}}})};return e}();BX.Bitrix24.Configs.IpSettingsClass=function(){var e=function(e){this.arCurIpRights=e};e.prototype.DeleteIpAccessRow=function(e){var t=e.parentNode.parentNode;BX.remove(e.parentNode);var i=BX.findChildren(t,{tagName:"div"},true);if(i.length<=0){var o=t.parentNode.getAttribute("data-bx-right");var r=[];for(var s=0;s<this.arCurIpRights.length;s++)if(this.arCurIpRights[s]!=o)r.push(this.arCurIpRights[s]);this.arCurIpRights=r;BX.remove(t.parentNode)}};e.prototype.ShowIpAccessPopup=function(e){var t=this;e=e||[];BX.Access.Init({other:{disabled:false,disabled_g2:true,disabled_cr:true},groups:{disabled:true},socnetgroups:{disabled:true}});var i={};for(var o=0;o<e.length;o++)i[e[o]]=true;BX.Access.SetSelected(i);BX.Access.ShowForm({callback:function(e){var i=false;for(var o in e){i=BX.Access.GetProviderName(o);for(var r in e[o]){var s=BX.create("tr",{attrs:{"data-bx-right":r},children:[BX.create("td",{html:(i.length>0?i+": ":"")+e[o][r].name+"&nbsp;",props:{className:"content-edit-form-field-name"}}),BX.create("td",{props:{className:"content-edit-form-field-input",colspan:2},children:[BX.create("div",{children:[BX.create("input",{attrs:{type:"text",name:"ip_access_rights_"+r+"[]",size:"30"},props:{},events:{click:function(){t.addInputForIp(this)}}}),BX.create("a",{attrs:{href:"javascript:void(0);",title:BX.message("SLToAllDel")},props:{className:"access-delete"},events:{click:function(){t.DeleteIpAccessRow(this)}}})]})]})]});BX("ip_add_right_button").parentNode.insertBefore(s,BX("ip_add_right_button"));t.arCurIpRights.push(r)}}}})};e.prototype.addInputForIp=function(e){var t=this;var i=e.parentNode;if(BX.nextSibling(i))return;var o=BX.clone(i);var r=BX.firstChild(o);r.value="";r.onclick=function(){t.addInputForIp(this)};BX.nextSibling(r).onclick=function(){t.DeleteIpAccessRow(this)};i.parentNode.appendChild(o)};return e}();BX.Bitrix24.Configs.Functions={otpSwitchOffInfo:function(e){if(!e.checked){BX.PopupWindowManager.create("otpSwitchOffInfo",e,{autoHide:true,offsetLeft:-100,offsetTop:15,overlay:false,draggable:{restrict:true},closeByEsc:true,closeIcon:{right:"12px",top:"10px"},content:'<div style="padding: 15px; width: 300px; font-size: 13px">'+BX.message("CONFIG_OTP_SECURITY_SWITCH_OFF_INFO")+"</div>"}).show()}},adminOtpIsRequiredInfo:function(e){BX.PopupWindowManager.create("adminOtpIsRequiredInfo",e,{autoHide:true,offsetLeft:-100,offsetTop:15,overlay:false,draggable:{restrict:true},closeByEsc:true,closeIcon:{right:"12px",top:"10px"},content:'<div style="padding: 15px; width: 300px; font-size: 13px">'+BX.message("CONFIG_OTP_ADMIN_IS_REQUIRED_INFO")+"</div>"}).show()}};
/* End */
;; /* /bitrix/components/bitrix/intranet.configs/templates/.default/script.min.js?15113165237025*/

//# sourceMappingURL=page_8cd1fa3bfc604d1fb9663d273b13e827.map.js