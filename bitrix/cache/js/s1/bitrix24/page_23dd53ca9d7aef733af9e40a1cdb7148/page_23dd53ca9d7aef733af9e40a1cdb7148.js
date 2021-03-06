
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
; /* Start:"a:4:{s:4:"full";s:89:"/bitrix/components/bitrix/main.file.input/templates/.default/script.min.js?15113164728860";s:6:"source";s:70:"/bitrix/components/bitrix/main.file.input/templates/.default/script.js";s:3:"min";s:74:"/bitrix/components/bitrix/main.file.input/templates/.default/script.min.js";s:3:"map";s:74:"/bitrix/components/bitrix/main.file.input/templates/.default/script.map.js";}"*/
(function(){var e=window.BX;if(e["MFInput"])return;var t={},i=function(){var i=function(i){try{this.params=i;this.controller=e("mfi-"+i.controlId);this.button=e("mfi-"+i.controlId+"-button");this.editor=null;if(e("mfi-"+i.controlId+"-editor")){this.editor=new e.AvatarEditor;e.addCustomEvent(this.editor,"onApply",e.delegate(this.addFile,this));e.bind(e("mfi-"+i.controlId+"-editor"),"click",e.delegate(this.editor.click,this.editor))}this.init(i);t[i.controlId]=this;this.template=e.message("MFI_THUMB2").replace("#input_name#",this.params.inputName);window["FILE_INPUT_"+i.controlId]=this;this.INPUT=e("file_input_"+i["controlId"])}catch(a){e.debug(a)}};i.prototype={init:function(t){this.agent=e.Uploader.getInstance({id:t["controlId"],CID:t["controlUid"],streams:1,uploadFormData:"N",uploadMethod:"immediate",uploadFileUrl:t["urlUpload"],allowUpload:t["allowUpload"],allowUploadExt:t["allowUploadExt"],uploadMaxFilesize:t["uploadMaxFilesize"],showImage:false,sortItems:false,input:e("file_input_"+t["controlId"]),dropZone:this.controller.parentNode,placeHolder:this.controller,fields:{thumb:{tagName:"",template:e.message("MFI_THUMB")}}});this.fileEvents={onFileIsAttached:e.delegate(this.onFileIsAttached,this),onFileIsAppended:e.delegate(this.onFileIsAppended,this),onFileIsBound:e.delegate(this.onFileIsBound,this),onFileIsReadyToFrame:e.delegate(this.onFileIsReadyToFrame,this),onUploadStart:e.delegate(this.onUploadStart,this),onUploadProgress:e.delegate(this.onUploadProgress,this),onUploadDone:e.delegate(this.onUploadDone,this),onUploadError:e.delegate(this.onUploadError,this),onUploadRestore:e.delegate(this.onUploadRestore,this)};e.addCustomEvent(this.agent,"onAttachFiles",e.delegate(this.onAttachFiles,this));e.addCustomEvent(this.agent,"onQueueIsChanged",e.delegate(this.onQueueIsChanged,this));e.addCustomEvent(this.agent,"onFileIsInited",e.delegate(this.onFileIsInited,this));e.addCustomEvent(this.agent,"onPackageIsInitialized",e.delegate(function(e){var t={mfi_mode:"upload",cid:this.agent.CID,moduleId:this.params["moduleId"],forceMd5:this.params["forceMd5"],allowUpload:this.agent.limits["allowUpload"],allowUploadExt:this.agent.limits["allowUploadExt"],uploadMaxFilesize:this.agent.limits["uploadMaxFilesize"],mfi_sign:this.params["controlSign"]},i;for(i in t){if(t.hasOwnProperty(i)&&t[i]){e.post.data[i]=t[i];e.post.size+=(i+"").length+(t[i]+"").length}}},this));var i=[],a=[],n,s,r=e.findChildren(this.controller,{tagName:"LI"});for(var o=0;o<r.length;o++){n=e.findChild(r[o],{attribute:{"data-bx-role":"file-name"}},true);s=e.findChild(r[o],{attribute:{"data-bx-role":"file-id"}},true);if(n&&s){i.push({name:n.innerHTML,file_id:s.value});a.push(r[o])}}this.agent.onAttach(i,a);this.inited=true;this.checkUploadControl()},checkUploadControl:function(){if(e(this.button)){if(!(this.params["maxCount"]>0&&this.params["maxCount"]<=this.agent.getItems().length)){this.button.removeAttribute("disable")}else if(this.params["maxCount"]==1){}else{this.button.setAttribute("disable","Y")}}},onQueueIsChanged:function(){if(this.params["maxCount"]>0){this.checkUploadControl()}},onAttachFiles:function(t){var i=false,a;if(t&&this.inited===true&&this.params["maxCount"]>0){if(this.params["maxCount"]==1&&t.length>0){while(this.agent.getItems().length>0){this.deleteFile(this.agent.getItems().getFirst(),false)}while(t.length>1)t.pop()}var n=this.params["maxCount"]-this.agent.getItems().length;n=n>0?n:0;while(t.length>n){t.pop();i=true}}if(i){this.onError("Too much files.")}e.onCustomEvent(this,"onFileUploaderChange",[t,this]);return t},onFileIsInited:function(t,i){for(var a in this["fileEvents"]){if(this["fileEvents"].hasOwnProperty(a))e.addCustomEvent(i,a,this["fileEvents"][a])}},onFileIsAppended:function(e,t){var i=this.agent.getItem(e);this.bindEventsHandlers(i.node,t)},onFileIsBound:function(e,t){var i=this.agent.getItem(e);this.bindEventsHandlers(i.node,t)},bindEventsHandlers:function(t,i){var a=e.findChild(t,{attribute:{"data-bx-role":"file-delete"}},true),n;if(a)e.bind(a,"click",e.proxy(function(){this.deleteFile(i)},this));a=e.findChild(t,{attribute:{"data-bx-role":"file-preview"}},true);if(a){a.removeAttribute("data-bx-role");if(i.file.parentCanvas){var s=e.UploaderUtils.scaleImage(i.file.parentCanvas,{width:100,height:100},"exact"),r=e.create("CANVAS",{props:{width:100,height:100}});a.appendChild(r);r.getContext("2d").drawImage(i.file.parentCanvas,s.source.x,s.source.y,s.source.width,s.source.height,0,0,s.destin.width,s.destin.height);i.canvas=r}}i.file.parentCanvas=null;a=e.findChild(t,{tagName:"A",attribute:{"data-bx-role":"file-name"}},true);if(a){if(this.editor&&((n=e.findChild(t,{tagName:"CANVAS"},true))&&n||(n=e.findChild(t,{tagName:"IMG"},true))&&n)){e.bind(a,"click",e.proxy(function(t){e.PreventDefault(t);this.editor.showFile({name:a.innerHTML,tmp_url:a.href});return false},this))}else if(a.getAttribute("href")==="#"){e.bind(a,"click",e.proxy(function(t){e.PreventDefault(t);return false},this))}}},addFile:function(e,t){e.name=e["name"]||"image.png";e.parentCanvas=t;this.agent.onAttach([e])},deleteFile:function(t){var i=t?this.agent.getItem(t.id):false;if(!i)return;t=i.item;var a=i.node;if(t.file["justUploaded"]===true&&t.file["file_id"]>0){var n={fileID:t.file["file_id"],sessid:e.bitrix_sessid(),cid:this.agent.CID,mfi_mode:"delete"};e.ajax.post(this.agent.uploadFileUrl,n)}else{var s=a.parentNode.parentNode,r=e.findChild(a,{tagName:"INPUT",attribute:{"data-bx-role":"file-id"}},true);if(r){var o=r.name,l=r.value,d=o+"_del";if(o.indexOf("[")>0)d=o.substr(0,o.indexOf("["))+"_del"+o.substr(o.indexOf("["));var h=e.create("INPUT",{props:{name:o,type:"hidden",value:l}});s.appendChild(h);h=e.create("INPUT",{props:{name:d,type:"hidden",value:"Y"}});s.appendChild(h)}}for(var p in this["fileEvents"]){if(this["fileEvents"].hasOwnProperty(p))e.addCustomEvent(t,p,this["fileEvents"][p])}e.unbindAll(a);var f=t.file?t.file["file_id"]:null;delete t.hash;t.deleteFile("deleteFile");if(f){e.onCustomEvent(this,"onDeleteFile",[f,t,this]);e.onCustomEvent(this,"onFileUploaderChange",[[f],this])}},_deleteFile:function(){},clear:function(){while(this.agent.getItems().length>0){this.deleteFile(this.agent.getItems().getFirst(),false)}},onUploadStart:function(t){var i=this.agent.getItem(t.id).node;if(i)e.addClass(i,"uploading")},onUploadProgress:function(t,i){i=Math.min(i,98);var a=t.id;if(!t.__progressBarWidth)t.__progressBarWidth=5;if(i>t.__progressBarWidth){t.__progressBarWidth=Math.ceil(i);t.__progressBarWidth=t.__progressBarWidth>100?100:t.__progressBarWidth;if(e("wdu"+a+"Progressbar"))e.adjust(e("wdu"+a+"Progressbar"),{style:{width:t.__progressBarWidth+"%"}});if(e("wdu"+a+"ProgressbarText"))e.adjust(e("wdu"+a+"ProgressbarText"),{text:t.__progressBarWidth+"%"})}},onUploadDone:function(t,i){var a=this.agent.getItem(t.id).node,n=i["file"];if(e(a)){e.removeClass(a,"uploading");e.addClass(a,"saved");var s=this.template,r;n["ext"]=t.ext;n["preview_url"]=t.canvas?t.canvas.toDataURL("image/png"):"/bitrix/images/1.gif";t.canvas=null;delete t.canvas;for(var o in n){if(n.hasOwnProperty(o)){r=n[o];if(o.toLowerCase()==="size")r=e.UploaderUtils.getFormattedSize(r,0);else if(o.toLowerCase()==="name")r=n["originalName"];s=s.replace(new RegExp("#"+o.toLowerCase()+"#","gi"),r).replace(new RegExp("#"+o.toUpperCase()+"#","gi"),r)}}t.file.file_id=n["file_id"];t.file.justUploaded=true;t.name=n["originalName"];a.innerHTML=s;this.bindEventsHandlers(a,t);if(this.params.inputName.indexOf("[")<0){e.remove(e.findChild(a.parentNode.parentNode,{tagName:"INPUT",attr:{name:this.params.inputName}},false));e.remove(e.findChild(a.parentNode.parentNode,{tagName:"INPUT",attr:{name:this.params.inputName+"_del"}},false))}e.onCustomEvent(this,"onAddFile",[n["file_id"],this,n,a]);e.onCustomEvent(this,"onUploadDone",[i["file"],t,this])}else{this.onUploadError(t,i,this.agent)}},onUploadError:function(t,i,a){var n=this.agent.getItem(t.id).node,s=e.message("MFI_UPLOADING_ERROR");if(i&&i.error)s=i.error;e.removeClass(n,"uploading");e.addClass(n,"error");n.appendChild(e.create("DIV",{attrs:{className:"upload-file-error"},html:s}));e.onCustomEvent(this,"onErrorFile",[t["file"],this])},onError:function(t,i,a){var n="Uploading error.",s=n,r,o;if(a){if(a["error"]&&typeof a["error"]=="string")s=a["error"];else if(a["message"]&&typeof a["message"]=="string")s=a["message"];else if(e.type.isArray(a["errors"])&&a["errors"].length>0){s=[];for(var l=0;l<a["errors"].length;l++){if(typeof a["errors"][l]=="object"&&a["errors"][l]["message"])s.push(a["errors"][l]["message"])}if(s.length<=0)s.push("Uploading error.");s=s.join(" ")}}t.files=t.files||{};for(o in t.files){if(t.files.hasOwnProperty(o)){r=this.agent.queue.items.getItem(o);this.onUploadError(r,{error:s},s!=n)}}}};return i}();e.MFInput={init:function(e){return new i(e)},get:function(e){return t[e]||null}}})();
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15113165822527*/
; /* /bitrix/components/bitrix/main.file.input/templates/.default/script.min.js?15113164728860*/

//# sourceMappingURL=page_23dd53ca9d7aef733af9e40a1cdb7148.map.js