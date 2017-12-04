var VoxImplant =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var Client_1 = __webpack_require__(1);
	// import '../node_modules/webrtc-adapter/out/adapter_no_edge.js';
	__webpack_require__(40);
	var Messenger_1 = __webpack_require__(52);
	var Authenticator_1 = __webpack_require__(5);
	var Events_1 = __webpack_require__(2);
	exports.Events = Events_1.Events;
	var CallEvents_1 = __webpack_require__(18);
	exports.CallEvents = CallEvents_1.CallEvents;
	var MessagingEvents_1 = __webpack_require__(55);
	exports.MessagingEvents = MessagingEvents_1.MessagingEvents;
	var Structures_1 = __webpack_require__(57);
	exports.OperatorACDStatuses = Structures_1.OperatorACDStatuses;
	var Logger_1 = __webpack_require__(4);
	exports.LogCategory = Logger_1.LogCategory;
	exports.LogLevel = Logger_1.LogLevel;
	/**
	 * Get VoxImplant.Client instance to use platform functions
	 * @example <script src="https://gist.github.com/irbisadm/97b2009d736d6daf27486f342e1d2445.js"></script>
	 */
	function getInstance() {
	  return Client_1.Client.getInstance();
	}
	exports.getInstance = getInstance;
	/**
	 * VoxImplant Web SDK lib version
	 */
	exports.version = Client_1.Client.getInstance().version;
	/**
	 * Get instance of messaging subsystem
	 * @returns {Messenger}
	 */
	function getMessenger() {
	  if (!Authenticator_1.Authenticator.get().authorized()) throw new Error("NOT_AUTHORIZED");
	  return Messenger_1.Messenger.getInstance();
	}
	exports.getMessenger = getMessenger;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Events_1 = __webpack_require__(2);
	var Utils_1 = __webpack_require__(3);
	var VoxSignaling_1 = __webpack_require__(6);
	var UserMediaManager_1 = __webpack_require__(11);
	var Authenticator_1 = __webpack_require__(5);
	var BrowserSpecific_1 = __webpack_require__(7);
	var Logger_1 = __webpack_require__(4);
	var PCFactory_1 = __webpack_require__(13);
	var CallManager_1 = __webpack_require__(16);
	var Renderer_1 = __webpack_require__(15);
	var Callbackable_1 = __webpack_require__(36);
	var RemoteFunction_1 = __webpack_require__(20);
	var RemoteEvent_1 = __webpack_require__(24);
	var CallstatsIo_1 = __webpack_require__(26);
	var MediaCache_1 = __webpack_require__(10);
	var ZingayaAPI_1 = __webpack_require__(37);
	var PushService_1 = __webpack_require__(38);
	var GUID_1 = __webpack_require__(39);
	/**
	 * Client class used to control platform functions. Can't be instantiated directly (singleton), please use <a href="../globals.html#getinstance">VoxImplant.getInstance</a> to get the class instance.
	 */
	var Client = function () {
	    function Client() {
	        var _this = this;
	        /**
	         * WS connected flag
	         * @type {boolean}
	         * @private
	         * @hidden
	         */
	        this._connected = false;
	        /**
	         * Template for progress tone
	         * @type {{US: string, RU: string}}
	         * @hidden
	         */
	        this.progressToneScript = {
	            US: "440@-19,480@-19;*(2/4/1+2)",
	            RU: "425@-19;*(1/3/1)"
	        };
	        /**
	         * Flag of now playing progress tone
	         * @type {boolean}
	         * @hidden
	         */
	        this.playingNow = false;
	        /**
	         * List of available servers, returned by balancer
	         * @type {Array}
	         * @hidden
	         */
	        this.serversList = [];
	        /**
	         * Global voluem level
	         * @type {number}
	         * @private
	         * @hidden
	         */
	        this._vol = 100;
	        /**
	         * Require microphone on getUserMedia
	         * @type {boolean}
	         * @hidden
	         */
	        this.micRequired = false;
	        /**
	         * Video settings to getUserMedia
	         * @type {null}
	         * @hidden
	         */
	        this.videoConstraints = null;
	        /**
	         * Country for progress tone
	         * now supported only "US" and "RU"
	         * @type {string}
	         * @hidden
	         */
	        this.progressToneCountry = "US";
	        /**
	         * Play progress tone on outgoing call
	         * @type {boolean}
	         * @hidden
	         */
	        this.progressTone = true;
	        /**
	         * If true - set log level to TRACE
	         * @type {boolean}
	         * @hidden
	         */
	        this.showDebugInfo = false;
	        /**
	         * If true - set log level to WARNING
	         * @type {boolean}
	         * @hidden
	         */
	        this.showWarnings = false;
	        /**
	         * Is xRTC supported by this browser
	         * @type {boolean}
	         * @hidden
	         */
	        this.RTCsupported = false;
	        /**
	         * @hidden
	         * @type {boolean}
	         * @private
	         */
	        this._deviceEnumAPI = false;
	        /**
	         * For Calbacable mixin
	         * @hidden
	         * @type {{}}
	         */
	        this.eventListeners = {};
	        this.applyMixins(Client, [Callbackable_1.Callbackable]);
	        if (Client.instance) {
	            throw new Error("Error - use VoxImplant.getInstance()");
	        }
	        Client.instance = this;
	        this._promises = {};
	        BrowserSpecific_1.default.init();
	        var pc = PCFactory_1.PCFactory.get();
	        pc.requireMedia = false;
	        this.voxSignaling = VoxSignaling_1.VoxSignaling.get();
	        this.voxMediaManager = UserMediaManager_1.UserMediaManager.get();
	        this.voxCallManager = CallManager_1.CallManager.get();
	        this.mediacache = MediaCache_1.MediaCache.get();
	        this.renderer = Renderer_1.Renderer.get();
	        this.setLogLevelAll(Logger_1.LogLevel.NONE);
	        Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.CLIENT, 'SDK ver.', Logger_1.LogLevel.TRACE, this.version);
	        VoxSignaling_1.VoxSignaling.get().setRPCHandler(RemoteEvent_1.RemoteEvent.onPCStats, function (id, stats) {
	            if (PCFactory_1.PCFactory.get().getPeerConnect(id)) _this.dispatchEvent({
	                name: "NetStatsReceived",
	                stats: stats
	            });
	        });
	        this._defaultSinkId = null;
	    }
	    /**
	     * Helper for apply mixins
	     * @hidden
	     * @param derivedCtor
	     * @param baseCtors
	     */
	    Client.prototype.applyMixins = function (derivedCtor, baseCtors) {
	        baseCtors.forEach(function (baseCtor) {
	            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
	                derivedCtor.prototype[name] = baseCtor.prototype[name];
	            });
	        });
	    };
	    /**
	     @hidden
	     */
	    Client.prototype.deviceEnumAPI = function () {
	        var _this = this;
	        this.voxMediaManager.getDevices().then(function () {
	            _this._deviceEnumAPI = true;
	            _this.dispatchEvent({ name: Events_1.Events.SourcesInfoUpdated });
	        }).catch(function (err) {
	            this._deviceEnumAPI = false;
	        });
	    };
	    /**
	     * Plays progress tone according to specified country in config.progressToneCountry
	     * @hidden
	     */
	    Client.prototype.playProgressTone = function () {
	        if (this.progressToneScript[this.progressToneCountry] !== null) {
	            if (!this.playingNow) this.playToneScript(this.progressToneScript[this.progressToneCountry]);
	            this.playingNow = true;
	        }
	    };
	    /**
	     * Stop progress tone
	     * @hidden
	     */
	    Client.prototype.stopProgressTone = function () {
	        if (this.playingNow) {
	            this.stopPlayback();
	            this.playingNow = false;
	        }
	    };
	    /**
	     * @hidden
	     */
	    Client.prototype.onIncomingCall = function (id, callerid, displayName, headers, hasVideo) {
	        this.dispatchEvent({
	            name: Events_1.Events.IncomingCall,
	            call: CallManager_1.CallManager.get().calls[id],
	            headers: headers,
	            video: hasVideo
	        });
	    };
	    /**
	     * @hidden
	     */
	    Client.prototype.checkConnection = function () {
	        if (!this._connected) throw new Error("NOT_CONNECTED_TO_VOXIMPLANT");
	    };
	    /**
	     * Initialize SDK. SDKReady event will be dispatched after successful SDK initialization. SDK can't be used until it's initialized
	     * @param {VoxImplant.Config} [config] Client configuration options
	     */
	    Client.prototype.init = function (config) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            //if (this.config !== null) throw ("VoxImplant.Client has been already initialized");
	            _this._config = typeof config !== 'undefined' ? config : {};
	            if (_this._config.progressToneCountry !== undefined) _this.progressToneCountry = _this._config.progressToneCountry;
	            if (_this._config.progressTone !== true) _this.progressTone = false;
	            if (_this._config.serverIp !== undefined) _this.serverIp = _this._config.serverIp;
	            if (_this._config.showDebugInfo !== undefined) _this.showDebugInfo = _this._config.showDebugInfo;
	            if (_this._config.showWarnings !== false) _this.showWarnings = true;
	            if (typeof _this._config.videoContainerId === "string") _this.remoteVideoContainerId = _this._config.videoContainerId;
	            if (typeof _this._config.remoteVideoContainerId === "string") _this.remoteVideoContainerId = _this._config.remoteVideoContainerId;
	            if (typeof _this._config.localVideoContainerId === "string") _this.localVideoContainerId = _this._config.localVideoContainerId;
	            if (_this._config.micRequired !== false) _this.micRequired = true;
	            if (typeof _this._config.videoSupport != "undefined") _this.videoSupport = _this._config.videoSupport;else _this.videoSupport = false;
	            if (typeof _this._config.H264first != "undefined") _this._h264first = _this._config.H264first;else _this._h264first = false;
	            if (typeof _this._config.VP8first != "undefined") _this._VP8first = _this._config.VP8first;else _this._VP8first = false;
	            if (typeof _this._config.rtcStatsCollectionInterval != "undefined") CallManager_1.CallManager.get().rtcStatsCollectionInterval = _this._config.rtcStatsCollectionInterval;else CallManager_1.CallManager.get().rtcStatsCollectionInterval = 10000;
	            if (_this.showWarnings) _this.setLogLevelAll(Logger_1.LogLevel.WARNING);
	            if (_this.showDebugInfo) _this.setLogLevelAll(Logger_1.LogLevel.TRACE);
	            if (_this._config.protocolVersion && (_this._config.protocolVersion === "2" || _this._config.protocolVersion === "3")) {
	                _this._callProtocolVersion = _this._config.protocolVersion;
	                CallManager_1.CallManager.get().setProtocolVersion(_this._callProtocolVersion);
	            } else _this._callProtocolVersion = "3";
	            if (_this._config.callstatsIoParams) CallstatsIo_1.CallstatsIo.get(_this._config.callstatsIoParams);
	            if (_this._config.prettyPrint) Logger_1.LogManager.get().setPrettyPrint(_this._config.prettyPrint);
	            if (_this._config.videoConstraints !== undefined) {
	                _this.videoConstraints = _this._config.videoConstraints;
	                UserMediaManager_1.UserMediaManager.get().setConstraints(_this.videoConstraints, false);
	            }
	            //Fix always asking for webcam
	            UserMediaManager_1.UserMediaManager.get().enableAudio(_this.micRequired);
	            UserMediaManager_1.UserMediaManager.get().enableVideo(_this.videoSupport);
	            // Show warning about getUserMedia w/o https
	            if (window.location.hostname != "127.0.0.1" && window.location.hostname != "localhost" && window.location.protocol != "https:") {
	                if (typeof console.error != "undefined" && _this.showWarnings) console.error("WARNING: getUserMedia() is deprecated on insecure origins, and support will be removed in the future. You should consider switching your application to a secure origin, such as HTTPS. See https://goo.gl/rStTGz for more details.");
	            }
	            /* Check if WebRTC is supported */
	            if (typeof webkitRTCPeerConnection != 'undefined' || typeof mozRTCPeerConnection != 'undefined' || typeof RTCPeerConnection != 'undefined' || typeof RTCIceGatherer != "undefined") {
	                if (typeof mozRTCPeerConnection != 'undefined') {
	                    try {
	                        new mozRTCPeerConnection({ "iceServers": [] });
	                        _this.RTCsupported = true;
	                    } catch (e) {}
	                } else _this.RTCsupported = true;
	            }
	            if (_this.RTCsupported) {
	                var ts;
	                // Show warning about WebRTC security restrictions
	                if (window.location.href.match(/^file\:\/{3}.*$/g) != null) {
	                    if (typeof console.error != "undefined" && _this.showWarnings) console.error("WebRTC requires application to be loaded from a web server");
	                }
	                // work with low-level API
	                _this.voxAuth = Authenticator_1.Authenticator.get();
	                _this.voxAuth.setHandler({
	                    onLoginSuccessful: function (displayName, tokens) {
	                        _this._promises["login"].resolve({
	                            name: Events_1.Events.AuthResult,
	                            displayName: displayName,
	                            result: true
	                        });
	                        _this.dispatchEvent({ name: Events_1.Events.AuthResult, displayName: displayName, result: true, tokens: tokens });
	                    },
	                    onLoginFailed: function (statusCode) {
	                        _this._promises["login"].reject({ name: Events_1.Events.AuthResult, code: statusCode, result: false });
	                        _this.dispatchEvent({ name: Events_1.Events.AuthResult, code: statusCode, result: false });
	                    },
	                    onSecondStageInitiated: function () {
	                        _this._promises["login"].reject({ name: Events_1.Events.AuthResult, code: 301, result: false });
	                        _this.dispatchEvent({ name: Events_1.Events.AuthResult, code: 301, result: false });
	                    },
	                    onOneTimeKeyGenerated: function (key) {
	                        _this._promises["loginkey"].resolve({
	                            name: Events_1.Events.AuthResult,
	                            key: key,
	                            code: 302,
	                            result: false
	                        });
	                        _this.dispatchEvent({ name: Events_1.Events.AuthResult, key: key, code: 302, result: false });
	                    },
	                    onRefreshTokenFailed: function (code) {
	                        _this.dispatchEvent({ name: Events_1.Events.RefreshTokenResult, code: code, result: false });
	                    },
	                    onRefreshTokenSuccess: function (oauth) {
	                        _this.dispatchEvent({ name: Events_1.Events.RefreshTokenResult, tokens: oauth, result: true });
	                    }
	                });
	                _this.voxSignaling.addHandler(_this);
	                ts = setInterval(function () {
	                    if (typeof document != 'undefined') {
	                        clearInterval(ts);
	                        _this.deviceEnumAPI();
	                        _this.dispatchEvent({ name: Events_1.Events.SDKReady, version: _this.version });
	                        resolve({ name: Events_1.Events.SDKReady, version: _this.version });
	                    }
	                }, 100);
	            } else {
	                reject(new Error("NO_WEBRTC_SUPPORT"));
	                throw new Error("NO_WEBRTC_SUPPORT");
	            }
	        });
	    };
	    /**
	     * Create call
	     * @name VoxImplant.Client.call
	     * @param {String} num The number to call. For SIP compatibility reasons it should be a non-empty string even if the number itself is not used by a Voximplant cloud scenario.
	     * @param {Boolean} [useVideo=false] Tells if video should be supported for the call
	     * @param {String} [customData] Custom string associated with the call session. It can be later obtained from Call History using HTTP API
	     * @param {Object} [extraHeaders] Optional custom parameters (SIP headers) that should be passed with call (INVITE) message. Parameter names must start with "X-" to be processed by application. IMPORTANT: Headers size limit is 200 bytes.
	     * @function
	     * @returns {VoxImplant.Call}
	     */
	    Client.prototype.call = function (num, useVideo, customData, extraHeaders) {
	        Utils_1.Utils.checkCA();
	        var sets = {};
	        if (typeof num == "string") {
	            sets = {
	                number: num,
	                video: useVideo,
	                customData: customData,
	                extraHeaders: extraHeaders
	            };
	        } else {
	            sets = num;
	        }
	        if (typeof sets.video === "boolean") sets.video = { sendVideo: sets.video, receiveVideo: sets.video };
	        if (typeof sets.H264first == "undefined") sets.H264first = this._h264first;
	        if (typeof sets.VP8first == "undefined") sets.VP8first = this._VP8first;
	        var newCall = this.voxCallManager.call(sets);
	        return newCall;
	    };
	    /**
	     * Get current config
	     */
	    Client.prototype.config = function () {
	        return this._config;
	    };
	    /**
	     * Connect to VoxImplant Cloud
	     */
	    Client.prototype.connect = function (connectivityCheck) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            _this._promises["connect"] = { resolve: resolve, reject: reject };
	            if (_this.serverIp !== undefined) {
	                var host = void 0;
	                if (typeof _this.serverIp === "object") {
	                    _this.serversList = _this.serverIp;
	                    host = _this.serversList[0];
	                } else host = _this.serverIp;
	                _this.connectTo(host, null, connectivityCheck);
	            } else {
	                var balancerResult = function (data) {
	                    var ind = String(data).indexOf(";"),
	                        host;
	                    if (ind == -1) {
	                        // one IP available
	                        host = data;
	                    } else {
	                        this.serversList = data.split(";");
	                        host = this.serversList[0];
	                    }
	                    this.connectTo(host, null, connectivityCheck);
	                };
	                Utils_1.Utils.getServers(balancerResult.bind(_this), false, _this);
	            }
	        });
	    };
	    /**
	     * Connect to specific VoxImplant Cloud host
	     * @name VoxImplant.Client.connectTo
	     * @hidden
	     */
	    Client.prototype.connectTo = function (host, omitMicDetection, connectivityCheck) {
	        var _this = this;
	        if (this._connected) {
	            throw new Error("ALREADY_CONNECTED_TO_VOXIMPLANT");
	        }
	        this.host = host;
	        if (!this.micRequired || omitMicDetection === true) this.voxSignaling.connectTo(host, true, true, connectivityCheck, this._callProtocolVersion); //this.zingayaAPI.connectTo(host, "platform");
	        else {
	                this.voxMediaManager.queryMedia().then(function (stream) {
	                    _this.deviceEnumAPI();
	                    if (_this.micRequired) _this.voxSignaling.connectTo(_this.host, true, true, connectivityCheck, _this._callProtocolVersion);
	                    _this.dispatchEvent({ name: Events_1.Events.MicAccessResult, result: true, stream: stream });
	                }).catch(function (err) {
	                    _this.dispatchEvent({ name: Events_1.Events.MicAccessResult, result: false, reason: err });
	                });
	            }
	    };
	    /**
	     * Disconnect from VoxImplant Cloud
	     */
	    Client.prototype.disconnect = function () {
	        this.checkConnection();
	        this.voxSignaling.disconnect();
	        this.voxMediaManager.stopLocalStream();
	        this.voxSignaling.removeRPCHandler(RemoteEvent_1.RemoteEvent.onCallRemoteFunctionError);
	        this.voxSignaling.removeRPCHandler(RemoteEvent_1.RemoteEvent.handleError);
	    };
	    /**
	     * Set ACD status
	     * @param {OperatorACDStatuses} Automatic call distributor status
	     */
	    Client.prototype.setOperatorACDStatus = function (status) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            Utils_1.Utils.checkCA();
	            _this._promises["acd_status"] = { resolve: resolve, reject: reject };
	            _this.voxSignaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.setOperatorACDStatus, status);
	        });
	    };
	    /**
	     * Login into application
	     * @param {String} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
	     * @param {String} password
	     * @param {VoxImplant.LoginOptions} [options]
	     */
	    Client.prototype.login = function (username, password, options) {
	        var _this = this;
	        //Sentry.getInstance().setUserContext(username);
	        return new Promise(function (resolve, reject) {
	            _this._promises["login"] = { resolve: resolve, reject: reject };
	            options = typeof options !== 'undefined' ? options : {};
	            options = Utils_1.Utils.extend({}, options);
	            if (!_this._connected) {
	                reject(new Error("NOT_CONNECTED_TO_VOXIMPLANT"));
	                throw new Error("NOT_CONNECTED_TO_VOXIMPLANT");
	            }
	            //if (this.RTCsupported) this.zingayaAPI.login(username, password, options);
	            _this.voxAuth.basicLogin(username, password, options);
	        });
	    };
	    /**
	     * Login into application using 'code' auth method
	     * <br>
	     * Please, read <a href="http://voximplant.com/docs/quickstart/24/automated-login/">howto page</a>
	     * @param {String} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
	     * @param {String} code
	     * @param {VoxImplant.LoginOptions} [options]
	     * @hidden
	     */
	    Client.prototype.loginWithCode = function (username, code, options) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            _this._promises["login"] = { resolve: resolve, reject: reject };
	            options = typeof options !== 'undefined' ? options : {};
	            options = Utils_1.Utils.extend({ serverPresenceControl: false }, options);
	            if (!_this._connected) {
	                reject(new Error("NOT_CONNECTED_TO_VOXIMPLANT"));
	                throw new Error("NOT_CONNECTED_TO_VOXIMPLANT");
	            }
	            //if (this.RTCsupported) this.zingayaAPI.loginStage2(username, code, options);
	            _this.voxAuth.loginStage2(username, code, options);
	        });
	    };
	    /**
	     * Login into application using accessToken
	     * @param {String} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
	     * @param {String} token
	     * @param {VoxImplant.LoginOptions} [options]
	     */
	    Client.prototype.loginWithToken = function (username, token, options) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            _this._promises["login"] = { resolve: resolve, reject: reject };
	            options = typeof options !== 'undefined' ? options : {};
	            options = Utils_1.Utils.extend({ serverPresenceControl: false }, options);
	            options.accessToken = token;
	            if (!_this._connected) {
	                reject(new Error("NOT_CONNECTED_TO_VOXIMPLANT"));
	                throw new Error("NOT_CONNECTED_TO_VOXIMPLANT");
	            }
	            //if (this.RTCsupported) this.zingayaAPI.loginStage2(username, code, options);
	            _this.voxAuth.tokenLogin(username, options);
	        });
	    };
	    /**
	     * Refresh expired access token
	     * @param {String} username Fully-qualified username that includes Voximplant user, application and account names. The format is: "username@appname.accname.voximplant.com".
	     * @param {String} refreshToken
	     * @param {String} deviceToken A unique token for the current device
	     */
	    Client.prototype.tokenRefresh = function (username, refreshToken, deviceToken) {
	        this.voxAuth.tokenRefresh(username, refreshToken, deviceToken);
	    };
	    /**
	     * Request a key for 'onetimekey' auth method.
	     * Server will send the key in AuthResult event with code 302
	     * <br/>
	     * Please, read <a href="http://voximplant.com/docs/quickstart/24/automated-login/">howto page</a>
	     * @param {String} username
	     */
	    Client.prototype.requestOneTimeLoginKey = function (username) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            _this._promises["loginkey"] = { resolve: resolve, reject: reject };
	            if (!_this._connected) {
	                reject(new Error("NOT_CONNECTED_TO_VOXIMPLANT"));
	                throw new Error("NOT_CONNECTED_TO_VOXIMPLANT");
	            }
	            //if (this.RTCsupported) this.zingayaAPI.loginGenerateOneTimeKey(username);
	            _this.voxAuth.generateOneTimeKey(username);
	        });
	    };
	    /**
	     * Login into application using 'onetimekey' auth method.
	     * Hash should be calculated with the key received in AuthResult event
	     * <br/>
	     * Please, read <a href="http://voximplant.com/docs/quickstart/24/automated-login/">howto page</a>
	     * @param {String} username
	     * @param {String} hash
	     * @param {VoxImplant.LoginOptions} [options]
	     */
	    Client.prototype.loginWithOneTimeKey = function (username, hash, options) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            _this._promises["login"] = { resolve: resolve, reject: reject };
	            options = typeof options !== 'undefined' ? options : {};
	            options = Utils_1.Utils.extend({ serverPresenceControl: false }, options);
	            if (!_this._connected) {
	                reject(new Error("NOT_CONNECTED_TO_VOXIMPLANT"));
	                throw new Error("NOT_CONNECTED_TO_VOXIMPLANT");
	            }
	            //if (this.RTCsupported) this.zingayaAPI.loginUsingOneTimeKey(username, hash, options);
	            _this.voxAuth.loginUsingOneTimeKey(username, hash, options);
	        });
	    };
	    /**
	     * Check if connected to VoxImplant Cloud
	     */
	    Client.prototype.connected = function () {
	        return this._connected;
	    };
	    /**
	     * Show/hide local video
	     * @param {Boolean} [flag=true] Show/hide - true/false
	     * @param {Boolean} [mirror=false] Mirror local video
	     * @param {Boolean} [detachCamera=false] Detach camera on hide local video
	     */
	    Client.prototype.showLocalVideo = function (flag, mirror, detachCamera) {
	        if (flag === void 0) {
	            flag = true;
	        }
	        if (mirror === void 0) {
	            mirror = false;
	        }
	        if (detachCamera === void 0) {
	            detachCamera = false;
	        }
	        this.voxMediaManager.showLocalVideo(flag, mirror, detachCamera);
	    };
	    /**
	     * Set local video position
	     * @param {Number} x Horizontal position (px)
	     * @param {Number} y Vertical position (px)
	     * @function
	     * @hidden
	     * @name VoxImplant.Client.setLocalVideoPosition
	     */
	    Client.prototype.setLocalVideoPosition = function (x, y) {
	        throw new Error("Deprecated: please use CSS to position '#voximplantlocalvideo' element");
	    };
	    /**
	     * Set local video size
	     * @param {Number} width Width in pixels
	     * @param {Number} height Height in pixels
	     * @function
	     * @hidden
	     * @name VoxImplant.Client.setLocalVideoSize
	     */
	    Client.prototype.setLocalVideoSize = function (width, height) {
	        throw new Error("Deprecated: please use CSS to set size of '#voximplantlocalvideo' element");
	    };
	    /**
	     * Set video settings globally. This settings will be used for the next call.
	     * @param {VoxImplant.VideoSettings|VoxImplant.FlashVideoSettings} settings Video settings
	     * @param {Function} [successCallback] Success callback function has MediaStream object as its argument
	     * @param {Function} [failedCallback] Failed callback function
	     */
	    Client.prototype.setVideoSettings = function (settings, successCallback, failedCallback) {
	        var _this = this;
	        UserMediaManager_1.UserMediaManager.get().setConstraints(settings, true).then(function (stream) {
	            if (document.getElementById("voximplantlocalvideo") !== null) BrowserSpecific_1.default.attachMedia(_this.voxMediaManager.currentStream, document.getElementById("voximplantlocalvideo"));
	            if (typeof successCallback == "function") successCallback(stream);
	        }).catch(function (err) {
	            if (typeof failedCallback == "function") failedCallback(err);
	        });
	    };
	    /**
	     * Set bandwidth limit for video calls. Currently supported by Chrome/Chromium. (WebRTC mode only). The limit will be applied for the next call.
	     * @param {Number} bandwidth Bandwidth limit in kilobits per second (kbps)
	     */
	    Client.prototype.setVideoBandwidth = function (bandwidth) {
	        this.checkConnection();
	        PCFactory_1.PCFactory.get().setBandwidthParams(bandwidth);
	        this.voxSignaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.setDesiredVideoBandwidth, bandwidth);
	    };
	    /**
	     * Play ToneScript using WebAudio API
	     * @param {String} script Tonescript string
	     * @param {Boolean} [loop=false] Loop playback if true
	     */
	    Client.prototype.playToneScript = function (script, loop) {
	        if (loop === void 0) {
	            loop = false;
	        }
	        Utils_1.Utils.playToneScript(script, loop);
	    };
	    /**
	     * Stop playing ToneScript using WebAudio API
	     */
	    Client.prototype.stopPlayback = function () {
	        if (Utils_1.Utils.stopPlayback()) this.dispatchEvent({ name: Events_1.Events.PlaybackFinished });
	    };
	    /**
	     * Get current global sound volume
	     * @function
	     * @hidden
	     * @returns {Number}
	     */
	    /**
	     * Change current global sound volume
	     * @param {Number} vol New sound volume value between 0 and 100
	     * @function
	     * @hidden
	     */
	    Client.prototype.volume = function (vol) {
	        if (vol === undefined) {
	            return this._vol;
	        } else {
	            if (vol > 100) vol = 100;
	            if (vol < 0) vol = 0;
	            Renderer_1.Renderer.get().setPlaybackVolume(vol / 100);
	            this._vol = vol;
	        }
	    };
	    /**
	     * Get a list of all currently available audio sources / microphones
	     */
	    Client.prototype.audioSources = function () {
	        //if (!this._deviceEnumAPI) throw new Error("NOT_SUPPORTED: enumerateDevices");
	        return this.voxMediaManager.audioSourcesList;
	    };
	    /**
	     * Get a list of all currently available video sources / cameras
	     */
	    Client.prototype.videoSources = function () {
	        //if (!this._deviceEnumAPI) throw new Error("NOT_SUPPORTED: enumerateDevices");
	        return this.voxMediaManager.videoSourcesList;
	    };
	    /**
	     * Get a list of all currently available audio playback devices
	     */
	    Client.prototype.audioOutputs = function () {
	        //if (!this._deviceEnumAPI) throw new Error("NOT_SUPPORTED: enumerateDevices");
	        return this.voxMediaManager.audioOutputsList;
	    };
	    /**
	     * Use specified audio source, use <a href="#audiosources">audioSources</a> to get the list of available audio sources
	     * If SDK was init with micRequired: false, force attach microphone.
	     * @param {String} id Id of the audio source
	     * @param {Function} [successCallback] Called in WebRTC mode if audio source changed successfully
	     * @param {Function} [failedCallback] Called in WebRTC mode if audio source couldn't changed successfully
	     */
	    Client.prototype.useAudioSource = function (id, successCallback, failedCallback) {
	        var _this = this;
	        //this.zingayaAPI.useAudioSource(id, successCallback, failedCallback);
	        return new Promise(function (resolve, reject) {
	            _this.voxMediaManager.useAudioInputDevice(id);
	            _this.voxMediaManager.enableAudio(true);
	            _this.voxMediaManager.queryMedia().then(function (stream) {
	                if (typeof successCallback == "function") successCallback(stream);
	                resolve(stream);
	                UserMediaManager_1.UserMediaManager.get().updateLocalVideo(stream);
	            }).catch(function (err) {
	                if (typeof failedCallback == "function") failedCallback(err);
	                reject(err);
	            });
	        });
	    };
	    /**
	     * Use specified video source, use <a href="#videosources">videoSources</a> to get the list of available video sources
	     * @param {String} id Id of the video source
	     * @param {Function} [successCallback] Called if video source changed successfully, has MediaStream object as its argument
	     * @param {Function} [failedCallback] Called if video source couldn't be changed successfully, has MediaStreamError object as its argument
	     */
	    Client.prototype.useVideoSource = function (id, successCallback, failedCallback) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            _this.voxMediaManager.useVideoDevice(id);
	            if (UserMediaManager_1.UserMediaManager.get().isVideoEnabled()) {
	                _this.voxMediaManager.queryMedia().then(function (stream) {
	                    if (typeof successCallback == "function") successCallback(stream);
	                    UserMediaManager_1.UserMediaManager.get().updateLocalVideo(stream);
	                    resolve(stream);
	                }).catch(function (err) {
	                    if (typeof failedCallback == "function") failedCallback(err);
	                    reject(err);
	                });
	            } else {
	                UserMediaManager_1.UserMediaManager.get().updateLocalVideo();
	            }
	        });
	    };
	    /**
	     * Use specified audio output for new calls, use <a href="#audiooutputs">audioOutputs</a> to get the list of available audio output
	     * @param {String} id Id of the audio source
	     */
	    Client.prototype.useAudioOutput = function (id) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (BrowserSpecific_1.default.getWSVendor(true) !== "chrome") reject(new Error("Unsupported browser. Only Google Chrome 49 and above."));
	            _this._defaultSinkId = id;
	            resolve();
	        });
	    };
	    /**
	     * Enable microphone/camera if micRequired in <a href="../interfaces/config.html">VoxImplant.Config</a> was set to false
	     * @param {Function} [successCallback] Called if selected recording devices were attached successfully, has MediaStream object as its argument
	     * @param {Function} [failedCallback] Called if selected recording devices couldn't be attached, has MediaStreamError object as its argument
	     */
	    Client.prototype.attachRecordingDevice = function (successCallback, failedCallback) {
	        var _this = this;
	        this.voxMediaManager.enableAudio(true);
	        if (this._config.videoSupport) this.voxMediaManager.enableVideo(true);
	        return new Promise(function (resolve, reject) {
	            return _this.voxMediaManager.queryMedia().then(function (stream) {
	                if (typeof successCallback == "function") successCallback(stream);
	                _this.dispatchEvent({ name: Events_1.Events.MicAccessResult, result: true, stream: stream });
	            }).catch(function (err) {
	                if (typeof failedCallback == "function") failedCallback(err);
	                _this.dispatchEvent({ name: Events_1.Events.MicAccessResult, result: false, reason: err });
	            });
	        });
	    };
	    /**
	     * Disable microphone/camera if micRequired in <a href="../interfaces/config.html">VoxImplant.Config</a> was set to false
	     */
	    Client.prototype.detachRecordingDevice = function () {
	        UserMediaManager_1.UserMediaManager.get().stopLocalStream();
	    };
	    /**
	     * Set active call
	     * @param {VoxImplant.Call} call VoxImplant call instance
	     * @param {Boolean} [active=true] If true make call active, otherwise make call inactive
	     */
	    Client.prototype.setCallActive = function (call, active) {
	        if (active === void 0) {
	            active = true;
	        }
	        return new Promise(function (resolve, reject) {
	            Utils_1.Utils.checkCA();
	            if (call) return call.setActive(active);else reject("trying to hold unknown call " + call);
	        });
	    };
	    /**
	     * Start/stop sending local video to remote party/parties
	     * @param {Boolean} [flag=true] Start/stop - true/false
	     */
	    Client.prototype.sendVideo = function (flag) {
	        if (flag === void 0) {
	            flag = true;
	        }
	        this.voxMediaManager.sendVideo(flag);
	    };
	    /**
	     * Check if WebRTC support is available
	     * @returns {Boolean}
	     */
	    Client.prototype.isRTCsupported = function () {
	        var window_1 = window;
	        return window_1.RTCPeerConnection || window_1.mozRTCPeerConnection || window_1.webkitRTCPeerConnection || navigator.userAgent.match(/Edge\/(\d+).(\d+)$/);
	    };
	    /**
	     * Transfer call, depending on the result <a href="../enums/callevents.html#transfercomplete">VoxImplant.CallEvents.TransferComplete</a> or <a href="../enums/callevents.html#transferfailed">VoxImplant.CallEvents.TransferFailed</a> event will be dispatched.
	     * @param {VoxImplant.Call} call1 Call which will be transferred
	     * @param {VoxImplant.Call} call2 Call where call1 will be transferred
	     */
	    Client.prototype.transferCall = function (call1, call2) {
	        Utils_1.Utils.checkCA();
	        this.voxCallManager.transferCall(call1, call2);
	    };
	    /**
	     * @hidden
	     */
	    Client.getInstance = function () {
	        if (typeof Client.instance == "undefined") Client.instance = new Client();
	        return Client.instance;
	    };
	    Object.defineProperty(Client.prototype, "version", {
	        /**
	         * Return VoxImplant Web SDK version
	         * @function
	         * @hidden
	         */
	        get: function () {
	            return "4.0.6799-b24";
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Set log levels for specified log categories
	     * @param {LogCategory} category Log category
	     * @param {LogLevel} level Log level
	     * @hidden
	     */
	    Client.prototype.setLogLevel = function (category, level) {
	        Logger_1.LogManager.get().setLogLevel(category, level);
	    };
	    /**
	     * @hidden
	     * @param level
	     */
	    Client.prototype.setLogLevelAll = function (level) {
	        this.setLogLevel(Logger_1.LogCategory.SIGNALING, level);
	        this.setLogLevel(Logger_1.LogCategory.RTC, level);
	        this.setLogLevel(Logger_1.LogCategory.ORTC, level);
	        this.setLogLevel(Logger_1.LogCategory.USERMEDIA, level);
	        this.setLogLevel(Logger_1.LogCategory.CALL, level);
	        this.setLogLevel(Logger_1.LogCategory.CALLEXP2P, level);
	        this.setLogLevel(Logger_1.LogCategory.CALLEXSERVER, level);
	        this.setLogLevel(Logger_1.LogCategory.CALLMANAGER, level);
	        this.setLogLevel(Logger_1.LogCategory.CLIENT, level);
	        this.setLogLevel(Logger_1.LogCategory.AUTHENTICATOR, level);
	        this.setLogLevel(Logger_1.LogCategory.PCFACTORY, level);
	        this.setLogLevel(Logger_1.LogCategory.UTILS, level);
	        this.setLogLevel(Logger_1.LogCategory.MESSAGING, level);
	    };
	    /**
	     * @hidden
	     */
	    Client.prototype.onSignalingConnected = function () {
	        this._connected = true;
	        if (this._promises["connect"] !== undefined) this._promises["connect"].resolve({ name: Events_1.Events.ConnectionEstablished });
	        this.dispatchEvent({ name: Events_1.Events.ConnectionEstablished });
	    };
	    ;
	    /**
	     * @hidden
	     */
	    Client.prototype.onSignalingClosed = function () {
	        this._connected = false;
	        this.dispatchEvent({ name: Events_1.Events.ConnectionClosed });
	        if (this.progressTone) this.stopProgressTone();
	    };
	    ;
	    /**
	     * @hidden
	     */
	    Client.prototype.onSignalingConnectionFailed = function (reason) {
	        this._connected = false;
	        if (this.serversList.length > 1 && (typeof this.serverIp === "undefined" || typeof this.serverIp === "object")) {
	            this.serversList.splice(0, 1);
	            this.connectTo(this.serversList[0], true);
	        } else {
	            if (this._promises["connect"] !== undefined) this._promises["connect"].reject({
	                name: Events_1.Events.ConnectionFailed,
	                message: reason
	            });
	            this.dispatchEvent({ name: Events_1.Events.ConnectionFailed, message: reason });
	        }
	    };
	    /**
	     * @hidden
	     */
	    Client.prototype.onMediaConnectionFailed = function () {};
	    ;
	    /**
	     * Not documented function for backward compatibility
	     * @hidden
	     * @param string call_id Call ID
	     * @returns {Call}
	     */
	    Client.prototype.getCall = function (call_id) {
	        return CallManager_1.CallManager.get().calls[call_id];
	    };
	    /**
	     * Not documented function for backward compatibility
	     * Remove call from calls array
	     * @param string call_id Call id
	     * @hidden
	     */
	    Client.prototype.removeCall = function (call_id) {
	        CallManager_1.CallManager.get().removeCall(call_id);
	    };
	    /**
	     * @hidden
	     */
	    Client.prototype.dispatchEvent = function (e) {
	        return undefined;
	    };
	    /**
	     * Register handler for specified event
	     * @param event Event class (i.e. <a href="/docs/references/websdk/enums/events.html#sdkready">VoxImplant.Events.SDKReady</a>). See <a href="/docs/references/websdk/enums/events.html">VoxImplant.Events</a>
	     * @param handler Handler function. A single parameter is passed - object with event information
	     */
	    Client.prototype.addEventListener = function (event, handler) {};
	    /**
	     * Remove handler for specified event
	     * @param {Function} event Event class (i.e. <a href="docs/references/websdk/enums/events.html#sdkready">VoxImplant.Events.SDKReady</a>). See <a href="/docs/references/websdk/enums/events.html">VoxImplant.Events</a>
	     * @param {Function} [handler] Handler function, if not specified all event handlers will be removed
	     * @function
	     */
	    Client.prototype.removeEventListener = function (event, handler) {};
	    /**
	     * Register handler for specified event
	     * @param {Function} event Event class (i.e. <a href="/docs/references/websdk/enums/events.html#sdkready">VoxImplant.Events.SDKReady</a>). See <a href="/docs/references/websdk/enums/events.html">VoxImplant.Events</a>
	     * @param {Function} handler Handler function. A single parameter is passed - object with event information
	     * @function
	     */
	    Client.prototype.on = function (event, handler) {};
	    /**
	     * Remove handler for specified event
	     * @param {Function} event Event class (i.e. <a href="/docs/references/websdk/enums/events.html#sdkready">VoxImplant.Events.SDKReady</a>). See <a href="/docs/references/websdk/enums/events.html">VoxImplant.Events</a>
	     * @param {Function} [handler] Handler function, if not specified all event handlers will be removed
	     * @function
	     */
	    Client.prototype.off = function (event, handler) {};
	    /**
	     * @hidden
	     * @param val
	     */
	    Client.prototype.sslset = function (val) {
	        this.voxSignaling.writeLog = val;
	    };
	    /**
	     * @hidden
	     * @returns {Array<string>}
	     */
	    Client.prototype.sslget = function () {
	        return this.voxSignaling.getLog();
	    };
	    /**
	     * @hidden
	     */
	    Client.prototype.getZingayaAPI = function () {
	        return new ZingayaAPI_1.ZingayaAPI(this);
	    };
	    /**
	     * @hidden
	     */
	    Client.prototype.getMediaCache = function () {
	        return MediaCache_1.MediaCache.get();
	    };
	    /**
	    * Register for push notifications. Application will receive push notifications from VoxImplant Server after first log in.
	    * @hidden
	    * @param token FCM registration token that can be retrieved by calling firebase.messaging().getToken() inside a service worker
	    * @returns {Promise<void>}
	    */
	    Client.prototype.registerForPushNotificatuons = function (token) {
	        return PushService_1.PushService.register(token);
	    };
	    /**
	    * Unregister from push notifications. Application will no longer receive push notifications from VoxImplant server.
	    * @hidden
	    * @param token FCM registration token that was used to register for push notifications
	    * @returns {Promise<void>}
	    */
	    Client.prototype.unregisterForPushNotificatuons = function (token) {
	        return PushService_1.PushService.unregister(token);
	    };
	    /**
	    * Handle incoming push notification
	    * @hidden
	    * @param message  Incoming push notification that comes from the firebase.messaging().setBackgroundMessageHandler callback inside a service worker
	    * @returns {Promise<void>}
	    */
	    Client.prototype.handlePushNotification = function (message) {
	        return PushService_1.PushService.incomingPush(message);
	    };
	    /**
	    * Generate a new GUID identifier. Unique each time.
	    * @hidden
	    */
	    Client.prototype.getGUID = function () {
	        return new GUID_1.GUID().toString();
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "deviceEnumAPI", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "playProgressTone", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "stopProgressTone", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "onIncomingCall", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "checkConnection", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "init", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "call", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "config", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "connect", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "connectTo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "disconnect", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setOperatorACDStatus", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "login", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "loginWithCode", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "loginWithToken", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "tokenRefresh", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "requestOneTimeLoginKey", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "loginWithOneTimeKey", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "connected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "showLocalVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setLocalVideoPosition", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setLocalVideoSize", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setVideoSettings", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setVideoBandwidth", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "playToneScript", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "stopPlayback", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "volume", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "audioSources", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "videoSources", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "audioOutputs", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "useAudioSource", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "useVideoSource", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "useAudioOutput", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "attachRecordingDevice", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "detachRecordingDevice", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setCallActive", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "sendVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "isRTCsupported", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "transferCall", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setLogLevel", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "setLogLevelAll", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "onSignalingConnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "onSignalingClosed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "onSignalingConnectionFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "onMediaConnectionFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "getCall", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "removeCall", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "dispatchEvent", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "addEventListener", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "removeEventListener", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "on", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client.prototype, "off", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Client, "getInstance", null);
	    return Client;
	}();
	exports.Client = Client;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Events enum
	 */
	
	(function (Events) {
	    Events[Events["SDKReady"] = "SDKReady"] = "SDKReady";
	    Events[Events["ConnectionEstablished"] = "ConnectionEstablished"] = "ConnectionEstablished";
	    Events[Events["ConnectionFailed"] = "ConnectionFailed"] = "ConnectionFailed";
	    Events[Events["ConnectionClosed"] = "ConnectionClosed"] = "ConnectionClosed";
	    Events[Events["AuthResult"] = "AuthResult"] = "AuthResult";
	    Events[Events["RefreshTokenResult"] = "RefreshTokenResult"] = "RefreshTokenResult";
	    Events[Events["PlaybackFinished"] = "PlaybackFinished"] = "PlaybackFinished";
	    Events[Events["MicAccessResult"] = "MicAccessResult"] = "MicAccessResult";
	    Events[Events["IncomingCall"] = "IncomingCall"] = "IncomingCall";
	    Events[Events["SourcesInfoUpdated"] = "SourcesInfoUpdated"] = "SourcesInfoUpdated";
	    Events[Events["NetStatsReceived"] = "NetStatsReceived"] = "NetStatsReceived";
	})(exports.Events || (exports.Events = {}));
	var Events = exports.Events;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Logger_1 = __webpack_require__(4);
	var Client_1 = __webpack_require__(1);
	var Authenticator_1 = __webpack_require__(5);
	var UserMediaManager_1 = __webpack_require__(11);
	/**
	 * @hidden
	 */
	var Utils = function () {
	    function Utils() {}
	    /**
	     * @param objects Objects for merging
	     * @hidden
	     * @returns {Object}
	     */
	    Utils.extend = function () {
	        var objects = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            objects[_i - 0] = arguments[_i];
	        }
	        var extended = {};
	        var merge = function (obj) {
	            for (var prop in obj) {
	                if (Object.prototype.hasOwnProperty.call(obj, prop)) {
	                    extended[prop] = obj[prop];
	                }
	            }
	        };
	        merge(arguments[0]);
	        for (var i = 1; i < arguments.length; i++) {
	            var obj = arguments[i];
	            merge(obj);
	        }
	        return extended;
	    };
	    /**
	     * Convert <tt>headersObj</tt> to string
	     * @param {Object} headersObj Object contains headers (as properties) to stringify
	     * @returns {String}
	     * @hidden
	     */
	    Utils.stringifyExtraHeaders = function (headersObj) {
	        if (Object.prototype.toString.call(headersObj) == '[object Object]') headersObj = JSON.stringify(headersObj);else headersObj = null;
	        return headersObj;
	    };
	    /**
	     * Parse cadence sections
	     * @param {String} script
	     * @retruns {Object}
	     * @hidden
	     */
	    Utils.cadScript = function (script) {
	        var cads = script.split(';');
	        return cads.map(function (cad) {
	            if (cad.length === 0) {
	                return;
	            }
	            var matchParens = cad.match(/\([0-9\/\.,\*\+]*\)$/),
	                ringLength = cad.substring(0, matchParens.index),
	                segments = matchParens.pop();
	            if (matchParens.length) {
	                throw new Error('cadence script should be of the form `%f(%f/%f[,%f/%f])`');
	            }
	            ringLength = ringLength === '*' ? Infinity : parseFloat(ringLength);
	            if (isNaN(ringLength)) {
	                throw new Error('cadence length should be of the form `%f`');
	            }
	            segments = segments.slice(1, segments.length - 1).split(',').map(function (segment) {
	                try {
	                    var onOff = segment.split('/');
	                    if (onOff.length > 3) {
	                        throw new Error();
	                    }
	                    onOff = onOff.map(function (string, i) {
	                        if (i === 2) {
	                            // Special rules for frequencies
	                            var freqs = string.split('+').map(function (f) {
	                                var integer = parseInt(f, 10);
	                                if (isNaN(integer)) {
	                                    throw new Error();
	                                }
	                                return integer - 1;
	                            });
	                            return freqs;
	                        }
	                        var flt;
	                        // Special rules for Infinity;
	                        if (string == '*') {
	                            flt = Infinity;
	                        }
	                        flt = flt ? flt : parseFloat(string);
	                        if (isNaN(flt)) {
	                            throw new Error();
	                        }
	                        return flt;
	                    });
	                    return {
	                        on: onOff[0],
	                        off: onOff[1],
	                        // frequency is an extension for full toneScript.
	                        frequencies: onOff[2]
	                    };
	                } catch (err) {
	                    throw new Error('cadence segments should be of the form `%f/%f[%d[+%d]]`');
	                }
	            });
	            return {
	                duration: ringLength,
	                sections: segments
	            };
	        });
	    };
	    /**
	     * Parse frequency sections
	     * @param {String} script
	     * @returns {Object}
	     * @hidden
	     */
	    Utils.freqScript = function (script) {
	        var freqs = script.split(',');
	        return freqs.map(function (freq) {
	            try {
	                var tonePair = freq.split('@'),
	                    frequency = parseInt(tonePair.shift()),
	                    dB = parseFloat(tonePair.shift());
	                if (tonePair.length) {
	                    throw Error();
	                }
	                return {
	                    frequency: frequency,
	                    decibels: dB
	                };
	            } catch (err) {
	                throw new Error('freqScript pairs are expected to be of the form `%d@%f[,%d@%f]`');
	            }
	        });
	    };
	    /**
	     * Parse full tonescripts
	     * @param {String} script Tonescript string
	     * @returns {Object} Object with frequencies and cadences properties
	     * @hidden
	     */
	    Utils.toneScript = function (script) {
	        var sections = script.split(';'),
	            frequencies = this.freqScript(sections.shift()),
	            cadences = this.cadScript(sections.join(';'));
	        return {
	            frequencies: frequencies,
	            cadences: cadences
	        };
	    };
	    /**
	     * Plays tonescript using WebAudio API
	     * @param {String} script Tonescript string to be parsed and played
	     * @param {Boolean} [loop=false] Plays tonescript audio in a loop if true
	     * @hidden
	     */
	    Utils.playToneScript = function (script, loop) {
	        if (loop === void 0) {
	            loop = false;
	        }
	        if (typeof window.AudioContext != 'undefined' || typeof window.webkitAudioContext != 'undefined') {
	            var context = UserMediaManager_1.UserMediaManager.get().audioContext,
	                parsedToneScript = this.toneScript(script),
	                samples = [],
	                fullDuration = 0;
	            var addSilence = function (sec) {
	                for (var t = 0; t < context.sampleRate * sec; t++) samples.push(0);
	            };
	            var addSound = function (freq, sec) {
	                for (var t = 0; t < context.sampleRate * sec; t++) {
	                    var sample = 0;
	                    for (var f = 0; f < freq.length; f++) {
	                        sample += Math.pow(10, parsedToneScript.frequencies[freq[f]].decibels / 20) * Math.sin((samples.length + t) * (3.14159265359 / context.sampleRate) * parsedToneScript.frequencies[freq[f]].frequency);
	                        if (t < 10) sample *= t / 10;
	                        if (t > context.sampleRate * sec - 10) sample *= (context.sampleRate * sec - t) / 10;
	                    }
	                    samples.push(sample);
	                }
	            };
	            var processSection = function (section, duration) {
	                if (duration != Infinity) var t = duration;else t = duration = 20;
	                if (section.off !== 0 && section.off != Infinity) {
	                    while (t > 0) {
	                        addSound(section.frequencies, section.on);
	                        t -= section.on;
	                        addSilence(section.off);
	                        t -= section.off;
	                        var tt = t * 10;
	                        t = parseInt(String(t * 10)) / 10;
	                    }
	                } else {
	                    addSound(section.frequencies, duration);
	                }
	            };
	            var processCadence = function (cadence) {
	                if (cadence.duration != Infinity) fullDuration += cadence.duration;else fullDuration += 20;
	                for (var i = 0; i < cadence.sections.length; i++) {
	                    processSection(cadence.sections[i], cadence.duration);
	                }
	            };
	            this.source = context.createBufferSource();
	            for (var k = 0; k < parsedToneScript.cadences.length; k++) {
	                if (parsedToneScript.cadences[k].duration == Infinity) this.source.loop = true;
	                processCadence(parsedToneScript.cadences[k]);
	            }
	            this.source.connect(context.destination);
	            var sndBuffer = context.createBuffer(1, fullDuration * context.sampleRate, context.sampleRate);
	            var bufferData = sndBuffer.getChannelData(0);
	            for (var i = 0; i < fullDuration * context.sampleRate; i++) {
	                bufferData[i] = samples[i];
	            }
	            samples = null;
	            this.source.buffer = sndBuffer;
	            if (loop === true) this.source.loop = true;
	            this.source.start(0);
	        }
	    };
	    /**
	     * Stops tonescript audio playback
	     * @returns {Boolean} True if audio playback was stopped
	     * @hidden
	     */
	    Utils.stopPlayback = function () {
	        if (this.source !== null) {
	            this.source.stop(0);
	            this.source = null;
	            return true;
	        }
	        return false;
	    };
	    /**
	     * Makes cross-browser XmlHttpRequest
	     * @param {String} url URL for HTTP request
	     * @param {Function} [callback] Function to be called on compvarion
	     * @param {Function} [error] Function to be called in case of error
	     * @param {String} [postData] Data to be sent with POST request
	     * @hidden
	     */
	    Utils.sendRequest = function (url, callback, error, postData) {
	        var xdr = false;
	        var createXMLHTTPObject = function () {
	            var XMLHttpFactories = [
	            //function() { return new XDomainRequest(); },
	            function () {
	                return new XMLHttpRequest();
	            }, function () {
	                return new ActiveXObject("Msxml2.XMLHTTP");
	            }, function () {
	                return new ActiveXObject("Msxml3.XMLHTTP");
	            }, function () {
	                return new ActiveXObject("Microsoft.XMLHTTP");
	            }];
	            var xmlhttp;
	            for (var i = 0; i < XMLHttpFactories.length; i++) {
	                try {
	                    xmlhttp = XMLHttpFactories[i]();
	                    if (i === 0) xdr = true;
	                } catch (e) {
	                    continue;
	                }
	                break;
	            }
	            return xmlhttp;
	        };
	        var req = createXMLHTTPObject();
	        if (!req) return;
	        var method = postData ? "POST" : "GET";
	        if (!xdr) {
	            req.open(method, url, true);
	            if (postData) req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	            req.onreadystatechange = function () {
	                if (req.readyState != 4) return;
	                if (req.status != 200 && req.status != 304) {
	                    error(req);
	                    return;
	                }
	                callback(req);
	            };
	            if (req.readyState == 4) return;
	            req.send(postData);
	        } else {
	            req.onerror = function () {
	                error(req);
	            };
	            req.ontimeout = function () {
	                error(req);
	            };
	            req.onload = function () {
	                callback(req);
	            };
	            req.open(method, url);
	            req.timeout = 5000;
	            req.send();
	        }
	    };
	    /**
	     * Makes request to VoxImplant Load Balancer to get media gateway IP address
	     * @param {Function} callback Function to be called on compvarion
	     * @param {Boolean} [reservedBalancer=false] Try reserved balancer if true
	     * @hidden
	     */
	    Utils.getServers = function (callback, reservedBalancer, vi) {
	        if (reservedBalancer === void 0) {
	            reservedBalancer = false;
	        }
	        var protocol = 'https:' == document.location.protocol ? 'https://' : 'http://';
	        if (reservedBalancer === true) var balancer_url = protocol + "balancer.voximplant.com/getNearestHost";else balancer_url = protocol + "balancer.voximplant.com/getNearestHost";
	        this.sendRequest(balancer_url, function (XHR) {
	            balancerCompvare(XHR.responseText);
	        }, function (XHR) {
	            balancerCompvare(null);
	        });
	        function balancerCompvare(data) {
	            if (data !== null) callback(data);else if (reservedBalancer !== true) this.getServers(callback, true, vi);else vi.dispatchEvent({ name: 'ConnectionFailed', message: "VoxImplant Cloud is unavailable" });
	        }
	    };
	    /**
	     * @hidden
	     * The simplest function to get an UUID string.
	     * @returns {string} A version 4 UUID string.
	     */
	    Utils.generateUUID = function () {
	        var rand = this._gri,
	            hex = this._ha;
	        return hex(rand(32), 8) + "-" + hex(rand(16), 4) + "-" + hex(0x4000 | rand(12), 4) + "-" + hex(0x8000 | rand(14), 4) + "-" + hex(rand(48), 12);
	    };
	    /**
	     * Returns an unsigned x-bit random integer.
	     * @hidden
	     * @param {int} x A positive integer ranging from 0 to 53, inclusive.
	     * @returns {int} An unsigned x-bit random integer (0 <= f(x) < 2^x).
	     */
	    Utils._gri = function (x) {
	        if (x < 0) return NaN;
	        if (x <= 30) return 0 | Math.random() * (1 << x);
	        if (x <= 53) return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << x - 30)) * (1 << 30);
	        return NaN;
	    };
	    /**
	     * Converts an integer to a zero-filled hexadecimal string.
	     * @hidden
	     * @param {int} num
	     * @param {int} length
	     * @returns {string}
	     */
	    Utils._ha = function (num, length) {
	        var str = num.toString(16),
	            i = length - str.length,
	            z = "0";
	        for (; i > 0; i >>>= 1, z += z) {
	            if (i & 1) {
	                str = z + str;
	            }
	        }
	        return str;
	    };
	    Utils.filterXSS = function (content) {
	        var div = document.createElement("div");
	        div.appendChild(document.createTextNode(content));
	        content = div.innerHTML;
	        return content;
	    };
	    /**
	     * Check if !connected
	     * @hidden
	     */
	    Utils.checkCA = function () {
	        if (!Client_1.Client.getInstance().connected()) throw new Error("NOT_CONNECTED_TO_VOXIMPLANT");
	        if (!Authenticator_1.Authenticator.get().authorized()) throw new Error("NOT_AUTHORIZED");
	    };
	    /**
	     * Promise to check browser compability level
	     * @param level 'webrtc'|'signaling'
	     */
	    Utils.canRTC = function (level) {
	        return;
	    };
	    /**
	     * Complite defaults with settings
	     * @param left defaults
	     * @param right settings
	     * @returns {Object}
	     */
	    Utils.mixObjectToLeft = function (left, right) {
	        for (var left_key in left) {
	            if (typeof right[left_key] == "undefined") continue;
	            left[left_key] = right[left_key];
	        }
	        return left;
	    };
	    Utils.makeRandomString = function (length) {
	        var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/";
	        var randomSrtring = '';
	        for (var i = 0; i < length; i++) {
	            randomSrtring += possible.charAt(Math.floor(Math.random() * possible.length));
	        }
	        return randomSrtring;
	    };
	    Utils.source = null;
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "extend", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "stringifyExtraHeaders", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "cadScript", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "freqScript", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "toneScript", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "playToneScript", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "stopPlayback", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "sendRequest", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "getServers", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "generateUUID", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "_gri", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "_ha", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "filterXSS", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.UTILS)], Utils, "checkCA", null);
	    return Utils;
	}();
	exports.Utils = Utils;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	
	(function (LogLevel) {
	    LogLevel[LogLevel["NONE"] = 0] = "NONE";
	    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
	    LogLevel[LogLevel["WARNING"] = 2] = "WARNING";
	    LogLevel[LogLevel["INFO"] = 3] = "INFO";
	    LogLevel[LogLevel["TRACE"] = 4] = "TRACE";
	})(exports.LogLevel || (exports.LogLevel = {}));
	var LogLevel = exports.LogLevel;
	/**
	 * @hidden
	 */
	(function (LogCategory) {
	    LogCategory[LogCategory["SIGNALING"] = 0] = "SIGNALING";
	    LogCategory[LogCategory["RTC"] = 1] = "RTC";
	    LogCategory[LogCategory["USERMEDIA"] = 2] = "USERMEDIA";
	    LogCategory[LogCategory["CALL"] = 3] = "CALL";
	    LogCategory[LogCategory["CALLEXP2P"] = 4] = "CALLEXP2P";
	    LogCategory[LogCategory["CALLEXSERVER"] = 5] = "CALLEXSERVER";
	    LogCategory[LogCategory["CALLMANAGER"] = 6] = "CALLMANAGER";
	    LogCategory[LogCategory["CLIENT"] = 7] = "CLIENT";
	    LogCategory[LogCategory["AUTHENTICATOR"] = 8] = "AUTHENTICATOR";
	    LogCategory[LogCategory["PCFACTORY"] = 9] = "PCFACTORY";
	    LogCategory[LogCategory["UTILS"] = 10] = "UTILS";
	    LogCategory[LogCategory["ORTC"] = 11] = "ORTC";
	    LogCategory[LogCategory["MESSAGING"] = 12] = "MESSAGING";
	})(exports.LogCategory || (exports.LogCategory = {}));
	var LogCategory = exports.LogCategory;
	/**
	 * Common logger
	 * @hidden
	 */
	var Logger = function () {
	    function Logger(category, label, provider) {
	        this.category = category;
	        this.label = label;
	        this.provider = provider;
	    }
	    Logger.prototype.log = function (level, message) {
	        this.provider.writeMessage(this.category, this.label, level, message);
	    };
	    Logger.prototype.error = function (message) {
	        this.log(LogLevel.ERROR, message);
	    };
	    Logger.prototype.warning = function (message) {
	        this.log(LogLevel.WARNING, message);
	    };
	    Logger.prototype.info = function (message) {
	        this.log(LogLevel.INFO, message);
	    };
	    Logger.prototype.trace = function (message) {
	        this.log(LogLevel.TRACE, message);
	    };
	    return Logger;
	}();
	exports.Logger = Logger;
	/**
	 * @hidden
	 */
	var LogManager = function () {
	    function LogManager() {
	        this.levels = {};
	    }
	    LogManager.get = function () {
	        if (typeof this.inst == "undefined") {
	            this.inst = new LogManager();
	            this.inst.prettyPrint = false;
	        }
	        return this.inst;
	    };
	    LogManager.prototype.setPrettyPrint = function (state) {
	        this.prettyPrint = state;
	    };
	    LogManager.prototype.setLogLevel = function (category, level) {
	        this.levels[LogCategory[category]] = level;
	    };
	    LogManager.prototype.writeMessage = function (category, label, level, message) {
	        LogManager.tick++;
	        var sampleMessage = LogManager.tick + " " + new Date().toString() + " " + LogLevel[level] + " " + label + ": " + message;
	        var currentLevel = LogLevel.NONE;
	        if (typeof this.levels[LogCategory[category]] != "undefined") currentLevel = this.levels[LogCategory[category]];
	        if (level <= currentLevel) {
	            if (typeof console.debug != "undefined" && typeof console.info != "undefined" && typeof console.error != "undefined" && typeof console.warn != "undefined") {
	                if (this.prettyPrint) {
	                    if (typeof message != "string") message = JSON.stringify(message);
	                    console.log("%c " + new Date().toUTCString() + " [" + LogLevel[level] + "] %c" + label + ": %c" + message.replace("\r\n", "<br>"), 'color:#ccc', 'color:#2375a2', 'color:#000');
	                } else {
	                    if (level === LogLevel.ERROR) console.error(sampleMessage);else if (level === LogLevel.WARNING) console.warn(sampleMessage);else if (level === LogLevel.INFO) console.info(sampleMessage);else if (level === LogLevel.TRACE) console.debug(sampleMessage);else console.log(sampleMessage);
	                }
	            } else console.log(sampleMessage);
	        }
	    };
	    LogManager.prototype.createLogger = function (category, label) {
	        return new Logger(category, label, this);
	    };
	    //# decorator 4 trace
	    LogManager.d_trace = function (category) {
	        return function (target, key, value) {
	            return {
	                value: function () {
	                    var args = [];
	                    for (var _i = 0; _i < arguments.length; _i++) {
	                        args[_i - 0] = arguments[_i];
	                    }
	                    var a = "";
	                    try {
	                        a = args.map(function (a) {
	                            return JSON.stringify(a);
	                        }).join();
	                    } catch (e) {
	                        a = "circular structure";
	                    }
	                    var result = value.value.apply(this, args);
	                    var r;
	                    try {
	                        r = JSON.stringify(r);
	                    } catch (e) {
	                        r = "circular structure";
	                    }
	                    if (typeof r == "undefined") LogManager.get().writeMessage(category, '', LogLevel.TRACE, "Call: " + key + "(" + a + ")");else LogManager.get().writeMessage(category, '', LogLevel.TRACE, "Call: " + key + "(" + a + ") => " + r);
	                    //if(typeof  console.groupEnd !=="undefined")
	                    //     console.groupEnd();
	                    return result;
	                }
	            };
	        };
	    };
	    LogManager.tick = 0;
	    return LogManager;
	}();
	exports.LogManager = LogManager;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var VoxSignaling_1 = __webpack_require__(6);
	var Logger_1 = __webpack_require__(4);
	var PCFactory_1 = __webpack_require__(13);
	var RemoteFunction_1 = __webpack_require__(20);
	var RemoteEvent_1 = __webpack_require__(24);
	var CallstatsIo_1 = __webpack_require__(26);
	/**
	 * @hidden
	 */
	(function (AuthenticatorState) {
	    AuthenticatorState[AuthenticatorState["IDLE"] = 0] = "IDLE";
	    AuthenticatorState[AuthenticatorState["IN_PROGRESS"] = 1] = "IN_PROGRESS";
	})(exports.AuthenticatorState || (exports.AuthenticatorState = {}));
	var AuthenticatorState = exports.AuthenticatorState;
	;
	/**
	 * Class that performs user login
	 * Implemented as singleton
	 * @hidden
	 */
	var Authenticator = function () {
	    function Authenticator() {
	        var _this = this;
	        this.FAIL_CODE_SECOND_STAGE = 301;
	        this.FAIL_CODE_ONE_TIME_KEY = 302;
	        this._displayName = null;
	        this._username = null;
	        this._authorized = false;
	        this.signaling = VoxSignaling_1.VoxSignaling.get();
	        this.currentState = AuthenticatorState.IDLE;
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.SIGNALING, "Authenticator");
	        //Register handlers for Server->Client RPC
	        this.signaling.setRPCHandler(RemoteEvent_1.RemoteEvent.loginFailed, function (code, extra) {
	            _this.onLoginFailed(code, extra);
	        });
	        this.signaling.setRPCHandler(RemoteEvent_1.RemoteEvent.loginSuccessful, function (displayName, params) {
	            _this.onLoginSuccesful(displayName, params);
	        });
	        this.signaling.setRPCHandler(RemoteEvent_1.RemoteEvent.refreshOauthTokenFailed, function (code) {
	            _this.handler.onRefreshTokenFailed(code);
	        });
	        this.signaling.setRPCHandler(RemoteEvent_1.RemoteEvent.refreshOauthTokenSuccessful, function (oauth) {
	            _this.handler.onRefreshTokenSuccess(oauth.OAuth);
	        });
	        this.signaling.addHandler(this);
	    }
	    Authenticator.get = function () {
	        if (typeof this.inst == "undefined") {
	            this.inst = new Authenticator();
	        }
	        return this.inst;
	    };
	    Authenticator.prototype.setHandler = function (h) {
	        this.handler = h;
	    };
	    Authenticator.prototype.onLoginFailed = function (code, extra) {
	        this.currentState = AuthenticatorState.IDLE;
	        switch (code) {
	            case this.FAIL_CODE_ONE_TIME_KEY:
	                this.handler.onOneTimeKeyGenerated(extra);
	                break;
	            case this.FAIL_CODE_SECOND_STAGE:
	                this.handler.onSecondStageInitiated();
	                break;
	            default:
	                this.handler.onLoginFailed(code);
	                break;
	        }
	    };
	    Authenticator.prototype.onLoginSuccesful = function (displayName, params) {
	        this.currentState = AuthenticatorState.IDLE;
	        this._authorized = true;
	        if (params) PCFactory_1.PCFactory.get().iceConfig = params.iceConfig;
	        this._displayName = displayName;
	        CallstatsIo_1.CallstatsIo.get().init({ userName: this._username, aliasName: this._displayName });
	        this.handler.onLoginSuccessful(displayName, params.OAuth);
	    };
	    Object.defineProperty(Authenticator.prototype, "displayName", {
	        /**
	         * User display name. Is returned by server`
	         */
	        get: function () {
	            return this._displayName;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Authenticator.prototype.basicLogin = function (username, password, options) {
	        if (this.currentState != AuthenticatorState.IDLE) {
	            this.log.error("Login operation already in progress");
	            return;
	        }
	        this._username = username;
	        this.currentState = AuthenticatorState.IN_PROGRESS;
	        this.signaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.login, username, password, options);
	    };
	    Authenticator.prototype.tokenLogin = function (username, options) {
	        if (this.currentState != AuthenticatorState.IDLE) {
	            this.log.error("Login operation already in progress");
	            return;
	        }
	        this._username = username;
	        this.currentState = AuthenticatorState.IN_PROGRESS;
	        this.signaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.login, username, '', options);
	    };
	    Authenticator.prototype.tokenRefresh = function (username, refreshToken, deviceToken) {
	        if (deviceToken) this.signaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.refreshOauthToken, username, { refreshToken: refreshToken, deviceToken: deviceToken });else this.signaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.refreshOauthToken, username, refreshToken);
	    };
	    Authenticator.prototype.loginUsingOneTimeKey = function (username, hash, options) {
	        if (this.currentState != AuthenticatorState.IDLE) {
	            this.log.error("Login operation already in progress");
	            return;
	        }
	        this._username = username;
	        this.currentState = AuthenticatorState.IN_PROGRESS;
	        this.signaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.loginUsingOneTimeKey, username, hash, options);
	    };
	    Authenticator.prototype.loginStage2 = function (username, code, options) {
	        if (this.currentState != AuthenticatorState.IDLE) {
	            this.log.error("Login operation already in progress");
	            return;
	        }
	        this._username = username;
	        this.currentState = AuthenticatorState.IN_PROGRESS;
	        this.signaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.loginStage2, username, code, options);
	    };
	    Authenticator.prototype.generateOneTimeKey = function (username) {
	        if (this.currentState != AuthenticatorState.IDLE) {
	            this.log.error("Login operation already in progress");
	            return;
	        }
	        this.currentState = AuthenticatorState.IN_PROGRESS;
	        this.signaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.loginGenerateOneTimeKey, username);
	    };
	    Authenticator.prototype.username = function () {
	        return this._username;
	    };
	    Authenticator.prototype.authorized = function () {
	        return this._authorized;
	    };
	    Authenticator.prototype.onSignalingConnected = function () {};
	    ;
	    Authenticator.prototype.onSignalingConnectionFailed = function (errorMessage) {};
	    ;
	    Authenticator.prototype.onSignalingClosed = function () {
	        this._authorized = false;
	        this._displayName = null;
	        this._username = null;
	    };
	    ;
	    Authenticator.prototype.onMediaConnectionFailed = function () {};
	    Authenticator.prototype.ziAuthorized = function (state) {
	        this._authorized = state;
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "setHandler", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "onLoginFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "onLoginSuccesful", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "basicLogin", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "tokenLogin", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "tokenRefresh", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "loginUsingOneTimeKey", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "loginStage2", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "generateOneTimeKey", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "username", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "authorized", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "onSignalingConnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "onSignalingConnectionFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "onSignalingClosed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.AUTHENTICATOR)], Authenticator.prototype, "onMediaConnectionFailed", null);
	    return Authenticator;
	}();
	exports.Authenticator = Authenticator;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Logger_1 = __webpack_require__(4);
	var BrowserSpecific_1 = __webpack_require__(7);
	var PCFactory_1 = __webpack_require__(13);
	var CallManager_1 = __webpack_require__(16);
	var RemoteFunction_1 = __webpack_require__(20);
	var RemoteEvent_1 = __webpack_require__(24);
	var MsgSignaling_1 = __webpack_require__(34);
	var Client_1 = __webpack_require__(1);
	/**
	 * @hidden
	 */
	(function (VoxSignalingState) {
	    VoxSignalingState[VoxSignalingState["IDLE"] = 0] = "IDLE";
	    VoxSignalingState[VoxSignalingState["CONNECTING"] = 1] = "CONNECTING";
	    VoxSignalingState[VoxSignalingState["WSCONNECTED"] = 2] = "WSCONNECTED";
	    VoxSignalingState[VoxSignalingState["CONNECTED"] = 3] = "CONNECTED";
	    VoxSignalingState[VoxSignalingState["CLOSING"] = 4] = "CLOSING";
	})(exports.VoxSignalingState || (exports.VoxSignalingState = {}));
	var VoxSignalingState = exports.VoxSignalingState;
	/**
	 * Websocket-based implementation of signaling protocol
	 * Singleton
	 * IDLE => CONNECTING => WSCONNECTED => CONNECTED => CLOSING => IDLE
	 *                 ||        ||      /\           \--(close() called)
	 * (WS connection  ||        ||       |
	 *      failed)    \/        ||       \-- (__connectionSuccessful RPC)
	 *                IDLE       ||
	 *                           ||
	 * (__connectionFailed RPC)  ||
	 *                           ||
	 *                           \/
	 *                          IDLE
	 *
	 * (Simplified graph)
	 *
	 * @hidden
	 */
	var VoxSignaling = function () {
	    function VoxSignaling() {
	        var _this = this;
	        /**
	         * ver 2 - old version
	         * ver 3 - new call scheme
	         * @type {string}
	         */
	        this.ver = "3";
	        this.handlers = [];
	        this.rpcHandlers = {};
	        /**
	         * Link for ping timer
	         * @type {null}
	         */
	        this.pingTimer = null;
	        /**
	         * Link for pong await timer
	         * @type {null}
	         */
	        this.pongTimer = null;
	        this.manualDisconnect = false;
	        this.platform = 'platform';
	        this.referrer = 'platform';
	        this.extra = '';
	        this.writeLog = false;
	        this._opLog = [];
	        this.token = '';
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.SIGNALING, "VoxSignaling");
	        this.currentState = VoxSignalingState.IDLE;
	        this.setRPCHandler(RemoteEvent_1.RemoteEvent.connectionSuccessful, function (token) {
	            _this.onConnectionSuccessfulRPC(token);
	        });
	        this.setRPCHandler(RemoteEvent_1.RemoteEvent.connectionFailed, function () {
	            _this.onConnectionFailedRPC();
	        });
	        this.setRPCHandler(RemoteEvent_1.RemoteEvent.createConnection, function (token) {
	            _this.onConnectionSuccessfulRPC(token);
	        });
	    }
	    VoxSignaling.get = function () {
	        if (typeof this.inst == "undefined") {
	            this.inst = new VoxSignaling();
	        }
	        return this.inst;
	    };
	    /**
	     * Add signaling event handler
	     * @param h
	     */
	    VoxSignaling.prototype.addHandler = function (h) {
	        this.handlers.push(h);
	    };
	    /**
	     * Disconnect WS and run onWSClosed
	     */
	    VoxSignaling.prototype.close = function () {
	        if (this.ws) {
	            this.ws.onclose = null;
	            this.ws.close();
	            this.onWSClosed(null);
	        } else {
	            this.log.warning("Try close unused WS in state " + VoxSignalingState[this.currentState]);
	        }
	    };
	    /**
	     * clear ping&pong timeouts
	     */
	    VoxSignaling.prototype.cleanup = function () {
	        PCFactory_1.PCFactory.get().closeAll();
	        if (this.pingTimer) clearTimeout(this.pingTimer);
	        if (this.pongTimer) clearTimeout(this.pongTimer);
	    };
	    /**
	     * Change synthetical state and fire userEvent wher WS connecting
	     */
	    VoxSignaling.prototype.onConnectionSuccessfulRPC = function (token) {
	        if (this.currentState != VoxSignalingState.WSCONNECTED) {
	            this.log.error("Can't handle __connectionSuccessful while in state " + VoxSignalingState[this.currentState]);
	            return;
	        }
	        if (token) this.token = token;
	        this.currentState = VoxSignalingState.CONNECTED;
	        if (this.handlers.length > 0) {
	            for (var i = 0; i < this.handlers.length; ++i) {
	                try {
	                    this.handlers[i].onSignalingConnected();
	                } catch (e) {
	                    this.log.warning("Error in onSignalingConnected callback: " + e);
	                }
	            }
	        } else {
	            this.log.warning("No VoxSignaling handler specified");
	        }
	    };
	    /**
	     * Change synthetical state and fire userEvent wher WS disconnecting
	     */
	    VoxSignaling.prototype.onConnectionFailedRPC = function () {
	        if (this.currentState != VoxSignalingState.WSCONNECTED) {
	            this.log.error("Can't handle __connectionSuccessful while in state " + VoxSignalingState[this.currentState]);
	            return;
	        }
	        this.ws.onerror = null;
	        this.ws.close();
	        this.ws = null;
	        this.currentState = VoxSignalingState.IDLE;
	        if (this.handlers.length > 0) {
	            for (var i = 0; i < this.handlers.length; ++i) {
	                try {
	                    this.handlers[i].onMediaConnectionFailed();
	                } catch (e) {
	                    this.log.warning("Error in onMediaConnectionFailed callback: " + e);
	                }
	            }
	        } else {
	            this.log.warning("No VoxSignaling handler specified");
	        }
	    };
	    /**
	     * Connect to selected WS server and bind WSEvents
	     * @param host
	     * @param isVideo
	     * @param secure
	     * @param connectivityCheck
	     */
	    VoxSignaling.prototype.connectTo = function (host, isVideo, secure, connectivityCheck, version) {
	        var _this = this;
	        if (isVideo === void 0) {
	            isVideo = false;
	        }
	        if (secure === void 0) {
	            secure = true;
	        }
	        //Sentry.setLastHost(host);
	        this.manualDisconnect = false;
	        this.ver = version;
	        if (this.currentState != VoxSignalingState.IDLE) {
	            this.log.error("Can't establish connection while in state " + VoxSignalingState[this.currentState]);
	            return;
	        }
	        this.currentState = VoxSignalingState.CONNECTING;
	        var browser = BrowserSpecific_1.default.getWSVendor(connectivityCheck);
	        this.ws = new WebSocket("ws" + (secure ? 's' : '') + "://" + host + "/" + this.platform + "?version=" + this.ver + "&client=" + browser + "&referrer=" + this.referrer + "&referrer=" + this.extra + "&video" + (isVideo ? "true" : "false") + "&client_version=" + Client_1.Client.getInstance().version);
	        this.ws.onopen = function (e) {
	            return _this.onWSConnected(e);
	        };
	        this.ws.onclose = function (e) {
	            return _this.onWSClosed(e);
	        };
	        this.ws.onerror = function (e) {
	            return _this.onWSError(e);
	        };
	        this.ws.onmessage = function (e) {
	            return _this.onWSData(e.data);
	        };
	    };
	    /**
	     * Set handler for Server -> Client RPC
	     */
	    VoxSignaling.prototype.setRPCHandler = function (name, callback) {
	        if (typeof this.rpcHandlers[name] != "undefined") {
	            this.log.warning("Overwriting RPC handler for function " + name);
	        }
	        this.rpcHandlers[name] = callback;
	    };
	    /**
	     * Set handler for Server -> Client RPC
	     * @param name
	     */
	    VoxSignaling.prototype.removeRPCHandler = function (name) {
	        if (typeof this.rpcHandlers[name] == "undefined") {
	            this.log.warning("There is no RPC handler for function " + name);
	        }
	        delete this.rpcHandlers[name];
	    };
	    /**
	     * Invoke Client->Server RPC
	     * @param name
	     * @param params
	     */
	    VoxSignaling.prototype.callRemoteFunction = function (name) {
	        var params = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            params[_i - 1] = arguments[_i];
	        }
	        if (this.currentState != VoxSignalingState.CONNECTED && this.currentState != VoxSignalingState.WSCONNECTED) {
	            this.log.error("Can't make a RPC call in state " + VoxSignalingState[this.currentState]);
	            return false;
	        }
	        if (typeof this.ws != "undefined") {
	            if (this.writeLog) this._opLog.push("send:" + JSON.stringify({ "name": name, "params": params }));
	            var data = JSON.stringify({ "name": name, "params": params });
	            this.ws.send(data);
	            Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.SIGNALING, '[wsdataout]', Logger_1.LogLevel.INFO, data);
	            return true;
	        }
	    };
	    /**
	     * WebSocket callbacks
	     */
	    VoxSignaling.prototype.onWSData = function (data) {
	        Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.SIGNALING, '[wsdatain]', Logger_1.LogLevel.INFO, data);
	        if (this.writeLog) this._opLog.push("recv:" + data);
	        var parsedData;
	        try {
	            parsedData = JSON.parse(data);
	        } catch (e) {
	            this.log.error("Can't parse JSON data: " + data);
	            return;
	        }
	        if (typeof parsedData['service'] != "undefined") this.onWSMessData(parsedData);else this.onWSVoipData(parsedData);
	    };
	    /**
	     * Handle new messaging protocol
	     * @hidden
	     * @param parsedData
	     */
	    VoxSignaling.prototype.onWSMessData = function (parsedData) {
	        MsgSignaling_1.MsgSignaling.get().handleWsData(parsedData);
	    };
	    /**
	     * Send WS message to default old flow
	     * @hidden
	     * @param parsedData
	     */
	    VoxSignaling.prototype.onWSVoipData = function (parsedData) {
	        var functionName = parsedData["name"];
	        var callParams = parsedData["params"];
	        if (typeof this.rpcHandlers[functionName] != "undefined") {
	            try {
	                this.rpcHandlers[functionName].apply(null, callParams);
	            } catch (e) {
	                this.log.warning("Error in '" + functionName + "' handler : " + e);
	            }
	        } else {
	            this.log.warning("No handler for " + functionName);
	        }
	    };
	    /**
	     * Manually disconnect transport proto
	     */
	    VoxSignaling.prototype.disconnect = function () {
	        this.manualDisconnect = true;
	        this.onWSClosed(null);
	        this.cleanup();
	    };
	    VoxSignaling.prototype.onWSClosed = function (e) {
	        if (this.currentState != VoxSignalingState.CONNECTED && this.currentState != VoxSignalingState.CONNECTING && this.currentState != VoxSignalingState.CLOSING) {
	            this.log.warning("onWSClosed in state " + VoxSignalingState[this.currentState]);
	        }
	        if (this.ws) {
	            this.ws.close();
	            delete this.ws;
	        }
	        var oldState = this.currentState;
	        //unbind __ping and __pong timeouts
	        if (this.pingTimer) {
	            clearTimeout(this.pingTimer);
	        }
	        if (this.pongTimer) {
	            clearTimeout(this.pongTimer);
	        }
	        this.cleanup();
	        this.currentState = VoxSignalingState.IDLE;
	        if (this.handlers.length > 0) {
	            for (var i = 0; i < this.handlers.length; ++i) {
	                if ((oldState == VoxSignalingState.CONNECTING || oldState == VoxSignalingState.WSCONNECTED || oldState == VoxSignalingState.IDLE) && !this.manualDisconnect) {
	                    try {
	                        this.handlers[i].onSignalingConnectionFailed(e.reason);
	                    } catch (e) {
	                        this.log.warning("Error in onSignalingConnectionFailed callback: " + e);
	                    }
	                } else {
	                    try {
	                        this.handlers[i].onSignalingClosed();
	                    } catch (e) {
	                        this.log.warning("Error in onSignalingClosed callback: " + e);
	                    }
	                }
	            }
	        } else {
	            this.log.warning("No VoxSignaling handler specified");
	        }
	    };
	    VoxSignaling.prototype.onWSConnected = function (e) {
	        var _this = this;
	        if (this.currentState != VoxSignalingState.CONNECTING) {
	            this.log.warning("onWSConnected in state " + VoxSignalingState[this.currentState]);
	        }
	        this.currentState = VoxSignalingState.WSCONNECTED;
	        this.pingTimer = setTimeout(function () {
	            return _this.doPing();
	        }, VoxSignaling.PING_DELAY);
	        //Set inner message handlers
	        this.setRPCHandler(RemoteEvent_1.RemoteEvent.pong, function () {
	            return _this.pongReceived();
	        });
	        //Set deprecated message handlers
	        this.setRPCHandler(RemoteEvent_1.RemoteEvent.increaseGain, function () {
	            _this.log.info("Deprecated increaseGain");
	        });
	    };
	    /**
	     * Event for error on main signaling socket
	     * @param e
	     */
	    VoxSignaling.prototype.onWSError = function (e) {
	        if (this.currentState != VoxSignalingState.CONNECTING) {
	            this.log.warning("onWSError in state " + this.currentState);
	        }
	        this.ws.close();
	        delete this.ws;
	        //unbind __ping and __pong timeouts
	        if (this.pingTimer) {
	            clearTimeout(this.pingTimer);
	        }
	        if (this.pongTimer) {
	            clearTimeout(this.pongTimer);
	        }
	        this.cleanup();
	        this.currentState = VoxSignalingState.IDLE;
	        if (typeof this.handlers != "undefined") {
	            for (var i = 0; i < this.handlers.length; ++i) {
	                try {
	                    this.handlers[i].onSignalingConnectionFailed("Error connecting to VoxImplant server");
	                } catch (e) {
	                    this.log.warning("Error in onSignalingConnectionFailed callback: " + e);
	                }
	            }
	        } else {
	            this.log.warning("No VoxSignaling handler specified");
	        }
	    };
	    /**
	     * Fx run every PING_TIMEOUT ms
	     */
	    VoxSignaling.prototype.doPing = function () {
	        var _this = this;
	        this.pingTimer = null;
	        this.callRemoteFunction(RemoteFunction_1.RemoteFunction.ping, []);
	        this.pongTimer = setTimeout(function () {
	            if (CallManager_1.CallManager.get().numCalls > 0) {
	                _this.pongReceived();
	                return;
	            }
	            _this.pongTimer = null;
	            _this.currentState = VoxSignalingState.IDLE;
	            for (var i = 0; i < _this.handlers.length; ++i) {
	                if (_this.currentState == VoxSignalingState.CONNECTED) {
	                    try {
	                        _this.handlers[i].onSignalingClosed();
	                    } catch (e) {
	                        _this.log.warning("Error in onSignalingClosed callback: " + e);
	                    }
	                } else {
	                    try {
	                        _this.handlers[i].onSignalingConnectionFailed("Connection closed");
	                    } catch (e) {
	                        _this.log.warning("Error in onSignalingConnectionFailed callback: " + e);
	                    }
	                }
	            }
	        }, VoxSignaling.PING_DELAY);
	    };
	    /**
	     * Reciver for pong
	     * @see doPing()
	     */
	    VoxSignaling.prototype.pongReceived = function () {
	        var _this = this;
	        if (this.pongTimer) {
	            clearTimeout(this.pongTimer);
	            this.pongTimer = null;
	            this.pingTimer = setTimeout(function () {
	                return _this.doPing();
	            }, VoxSignaling.PING_DELAY);
	        }
	    };
	    VoxSignaling.prototype.sendRaw = function (data) {
	        if (this.writeLog) this._opLog.push("send:" + JSON.stringify(data));
	        var xdata = JSON.stringify(data);
	        this.ws.send(xdata);
	        Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.SIGNALING, '[wsdataout]', Logger_1.LogLevel.INFO, xdata);
	        return true;
	    };
	    VoxSignaling.prototype.getLog = function () {
	        return this._opLog;
	    };
	    VoxSignaling.prototype.lagacyConnectTo = function (server, referrer, extra, appName) {
	        this.ver = '2';
	        this.platform = appName;
	        this.referrer = referrer;
	        this.connectTo(server, false, true, true, '2');
	    };
	    /**
	     * Timeout for __ping and __pong method
	     * @type {number}
	     */
	    VoxSignaling.PING_DELAY = 30000;
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "addHandler", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "close", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "cleanup", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onConnectionSuccessfulRPC", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onConnectionFailedRPC", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "connectTo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "setRPCHandler", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "removeRPCHandler", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "callRemoteFunction", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onWSData", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onWSMessData", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onWSVoipData", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "disconnect", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onWSClosed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onWSConnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "onWSError", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "doPing", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.SIGNALING)], VoxSignaling.prototype, "pongReceived", null);
	    return VoxSignaling;
	}();
	exports.VoxSignaling = VoxSignaling;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var Logger_1 = __webpack_require__(4);
	var FF_1 = __webpack_require__(8);
	var Webkit_1 = __webpack_require__(28);
	var WebRTCPC_1 = __webpack_require__(29);
	var Edge_1 = __webpack_require__(32);
	var SignalingDTMFSender_1 = __webpack_require__(27);
	var Safari_1 = __webpack_require__(33);
	/**
	 * Browser-specific implementation of webrtc functionality
	 * @hidden
	 */
	var BrowserSpecific;
	(function (BrowserSpecific) {
	    var Vendor;
	    (function (Vendor) {
	        Vendor[Vendor["Firefox"] = 1] = "Firefox";
	        Vendor[Vendor["Webkit"] = 2] = "Webkit";
	        Vendor[Vendor["Edge"] = 3] = "Edge";
	        Vendor[Vendor["Safari"] = 4] = "Safari";
	    })(Vendor || (Vendor = {}));
	    var vendor;
	    function applyExactConstraint(constraints, name, value) {
	        var r = constraints;
	        if (typeof r != "object") {
	            r = {};
	        }
	        r[name] = { ideal: value };
	        return r;
	    }
	    function peerConnectionFactory(id, mode, videoEnabled) {
	        switch (vendor) {
	            case Vendor.Firefox:
	                return new WebRTCPC_1.WebRTCPC(id, mode, videoEnabled);
	            case Vendor.Webkit:
	                return new WebRTCPC_1.WebRTCPC(id, mode, videoEnabled);
	            case Vendor.Safari:
	                return new WebRTCPC_1.WebRTCPC(id, mode, videoEnabled);
	            case Vendor.Edge:
	                return new WebRTCPC_1.WebRTCPC(id, mode, videoEnabled);
	            //return new ORTC(id, mode, videoEnabled);
	            default:
	                Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.RTC, "Core", Logger_1.LogLevel.INFO, "Unsupported browser " + navigator.userAgent);
	                return null;
	        }
	    }
	    BrowserSpecific.peerConnectionFactory = peerConnectionFactory;
	    function isScreenSharingSupported() {
	        return vendor === Vendor.Firefox || vendor === Vendor.Webkit;
	    }
	    BrowserSpecific.isScreenSharingSupported = isScreenSharingSupported;
	    function defaultGetUserMedia(constraints) {
	        return navigator.mediaDevices.getUserMedia(constraints);
	    }
	    function defaultGetDTMFSender(pc, callId) {
	        return new SignalingDTMFSender_1.SignalingDTMFSender(callId);
	    }
	    //Convert user specified config to constraints object that can be recognized by browser
	    function composeConstraintsDefault(config) {
	        var audioConstraints = false;
	        var videoConstraints = false;
	        if (config.audioEnabled) {
	            audioConstraints = true;
	            if (config.audioInputId) audioConstraints = applyExactConstraint(audioConstraints, "deviceId", config.audioInputId);
	        }
	        if (config.videoEnabled) {
	            videoConstraints = true;
	            if (config.videoSettings) {
	                videoConstraints = config.videoSettings;
	            }
	            if (config.videoInputId) videoConstraints = applyExactConstraint(videoConstraints, "deviceId", config.videoInputId);
	        }
	        return { peerIdentity: null, audio: audioConstraints, video: videoConstraints };
	    }
	    function getWSVendor(connectivityCheck) {
	        if (connectivityCheck === void 0) {
	            connectivityCheck = true;
	        }
	        if (connectivityCheck === false) {
	            return "voxmobile";
	        }
	        if (!vendor) {
	            detectVendor();
	        }
	        switch (vendor) {
	            case Vendor.Firefox:
	                return "firefox";
	            case Vendor.Webkit:
	                return "chrome";
	            case Vendor.Safari:
	                return "safari";
	            case Vendor.Edge:
	                return "voxmobile";
	            default:
	                return "";
	        }
	    }
	    BrowserSpecific.getWSVendor = getWSVendor;
	    function detectVendor() {
	        if (navigator["mozGetUserMedia"]) {
	            vendor = Vendor.Firefox;
	        } else if (navigator["webkitGetUserMedia"]) {
	            vendor = Vendor.Webkit;
	        } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
	            vendor = Vendor.Edge;
	        } else if (navigator["getUserMedia"]) {
	            vendor = Vendor.Safari;
	        }
	    }
	    function detectFirefoxVersion() {}
	    //This function must be called before usage
	    function init() {
	        if (!vendor) {
	            detectVendor();
	        }
	        if (vendor) {
	            Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.RTC, "Core", Logger_1.LogLevel.INFO, "Detected browser " + Vendor[vendor]);
	        }
	        BrowserSpecific.getUserMedia = defaultGetUserMedia;
	        BrowserSpecific.getDTMFSender = defaultGetDTMFSender;
	        switch (vendor) {
	            case Vendor.Firefox:
	                BrowserSpecific.attachMedia = FF_1.FF.attachStream;
	                BrowserSpecific.detachMedia = FF_1.FF.detachStream;
	                BrowserSpecific.getScreenMedia = FF_1.FF.getScreenMedia;
	                BrowserSpecific.getRTCStats = FF_1.FF.getRTCStats;
	                BrowserSpecific.getUserMedia = FF_1.FF.getUserMedia;
	                BrowserSpecific.getDTMFSender = FF_1.FF.getDTMFSender;
	                break;
	            case Vendor.Webkit:
	                BrowserSpecific.attachMedia = Webkit_1.Webkit.attachStream;
	                BrowserSpecific.detachMedia = Webkit_1.Webkit.detachStream;
	                BrowserSpecific.getScreenMedia = Webkit_1.Webkit.getScreenMedia;
	                BrowserSpecific.getRTCStats = Webkit_1.Webkit.getRTCStats;
	                BrowserSpecific.getUserMedia = FF_1.FF.getUserMedia;
	                BrowserSpecific.getDTMFSender = Webkit_1.Webkit.getDTMFSender;
	                break;
	            case Vendor.Safari:
	                BrowserSpecific.attachMedia = Safari_1.Safari.attachStream;
	                BrowserSpecific.detachMedia = Safari_1.Safari.detachStream;
	                BrowserSpecific.getScreenMedia = Safari_1.Safari.getScreenMedia;
	                BrowserSpecific.getRTCStats = Safari_1.Safari.getRTCStats;
	                BrowserSpecific.getUserMedia = FF_1.FF.getUserMedia;
	                BrowserSpecific.getDTMFSender = Safari_1.Safari.getDTMFSender;
	                break;
	            case Vendor.Edge:
	                BrowserSpecific.attachMedia = Edge_1.Edge.attachStream;
	                BrowserSpecific.detachMedia = Edge_1.Edge.detachStream;
	                BrowserSpecific.getScreenMedia = Edge_1.Edge.getScreenMedia;
	                BrowserSpecific.getRTCStats = Edge_1.Edge.getRTCStats;
	                break;
	            default:
	                Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.RTC, "Core", Logger_1.LogLevel.INFO, "Unsupported browser " + navigator.userAgent);
	        }
	        BrowserSpecific.composeConstraints = composeConstraintsDefault;
	    }
	    BrowserSpecific.init = init;
	})(BrowserSpecific || (BrowserSpecific = {}));
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = BrowserSpecific;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var md5_1 = __webpack_require__(9);
	var MediaCache_1 = __webpack_require__(10);
	var SignalingDTMFSender_1 = __webpack_require__(27);
	/**
	 * Firefox specific implementation
	 * @hidden
	 */
	var FF = function () {
	    function FF() {}
	    FF.attachStream = function (stream, element) {
	        element["mozSrcObject"] = stream;
	        element.load();
	        element.play();
	    };
	    FF.detachStream = function (element) {
	        element["mozSrcObject"] = null;
	        element.load();
	        element.src = "";
	    };
	    FF.getScreenMedia = function () {
	        return navigator.mediaDevices.getUserMedia({
	            "audio": false,
	            "video": { mediaSource: 'window' || 'screen' }
	        });
	    };
	    FF.getRTCStats = function (pc) {
	        return new Promise(function (resolve, reject) {
	            pc.getStats().then(function (e) {
	                var resultArray = [];
	                e.forEach(function (result) {
	                    if (result.type == "inboundrtp" || result.type == "outboundrtp") resultArray.push(result);
	                });
	                resolve(resultArray);
	            }).catch(reject);
	        });
	    };
	    FF.getUserMedia = function (constraints) {
	        return new Promise(function (globResolve, globReject) {
	            var ms = new MediaStream();
	            var cache = MediaCache_1.MediaCache.get();
	            var promiseList = [];
	            new Promise(function (resolve, reject) {
	                var tracks = [];
	                if (typeof constraints.audio !== "undefined" && constraints.audio !== false) {
	                    var deviceId_1 = md5_1.Md5.hashStr(JSON.stringify(constraints.audio));
	                    cache.getTrack(deviceId_1, 'audio').then(function (track) {
	                        if (typeof track !== "undefined" && track.readyState !== "ended") {
	                            tracks.push(track);
	                            resolve(tracks);
	                        } else {
	                            var subconstraint = JSON.parse(JSON.stringify(constraints));
	                            subconstraint.video = false;
	                            navigator.mediaDevices.getUserMedia(subconstraint).then(function (mediastream) {
	                                for (var _i = 0, _a = mediastream.getTracks(); _i < _a.length; _i++) {
	                                    var track_1 = _a[_i];
	                                    cache.setTrack(deviceId_1, 'audio', track_1);
	                                    tracks.push(track_1);
	                                }
	                                resolve(tracks);
	                            }).catch(function (e) {
	                                resolve([]);
	                            });
	                        }
	                    });
	                } else {
	                    resolve([]);
	                }
	            }).then(function (tracks) {
	                return new Promise(function (secResolve, secReject) {
	                    if (typeof constraints.video !== "undefined" && constraints.video !== false) {
	                        var deviceId_2 = md5_1.Md5.hashStr(JSON.stringify(constraints.video));
	                        promiseList.push(new Promise(function (resolve, reject) {
	                            cache.getTrack(deviceId_2, 'video').then(function (track) {
	                                if (typeof track !== "undefined" && track.readyState !== "ended") {
	                                    tracks.push(track);
	                                    secResolve(tracks);
	                                } else {
	                                    var subconstraint = JSON.parse(JSON.stringify(constraints));
	                                    subconstraint.audio = false;
	                                    navigator.mediaDevices.getUserMedia(subconstraint).then(function (mediastream) {
	                                        for (var _i = 0, _a = mediastream.getTracks(); _i < _a.length; _i++) {
	                                            var track_2 = _a[_i];
	                                            cache.setTrack(deviceId_2, 'video', track_2);
	                                            tracks.push(track_2);
	                                            secResolve(tracks);
	                                        }
	                                    }).catch(function (e) {
	                                        secResolve(tracks);
	                                    });
	                                }
	                            });
	                        }));
	                    } else {
	                        secResolve(tracks);
	                    }
	                });
	            }).then(function (result) {
	                for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
	                    var item = result_1[_i];
	                    if (typeof item !== "undefined") ms.addTrack(item);
	                }
	                if (result.length > 0) globResolve(ms);else globReject();
	            }).catch(function (e) {
	                globReject(e);
	            });
	        });
	    };
	    FF.getDTMFSender = function (pc, callId) {
	        var pattern = /Firefox\/([0-9\.]+)(?:\s|$)/;
	        var ua = navigator.userAgent;
	        if (pattern.test(ua)) {
	            var browser = pattern.exec(ua);
	            var version = browser[1].split('.');
	            if (+version[0] >= 53) {
	                var dtmfSenders = pc.getSenders().map(function (sender) {
	                    if (sender.track.kind === "audio" && !!sender.dtmf) return sender.dtmf;
	                });
	                if (dtmfSenders.length > 0) return dtmfSenders[0];
	            }
	        }
	        return new SignalingDTMFSender_1.SignalingDTMFSender(callId);
	    };
	    return FF;
	}();
	exports.FF = FF;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	/*
	
	TypeScript Md5
	==============
	
	Based on work by
	* Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
	* André Cruz: https://github.com/satazor/SparkMD5
	* Raymond Hill: https://github.com/gorhill/yamd5.js
	
	Effectively a TypeScrypt re-write of Raymond Hill JS Library
	
	The MIT License (MIT)
	
	Copyright (C) 2014 Raymond Hill
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	
	
	            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
	                    Version 2, December 2004
	
	 Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>
	
	 Everyone is permitted to copy and distribute verbatim or modified
	 copies of this license document, and changing it is allowed as long
	 as the name is changed.
	
	            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
	   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
	
	  0. You just DO WHAT THE FUCK YOU WANT TO.
	  
	
	*/
	var Md5 = (function () {
	    function Md5() {
	        this._state = new Int32Array(4);
	        this._buffer = new ArrayBuffer(68);
	        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
	        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
	        this.start();
	    }
	    // One time hashing functions
	    Md5.hashStr = function (str, raw) {
	        if (raw === void 0) { raw = false; }
	        return this.onePassHasher
	            .start()
	            .appendStr(str)
	            .end(raw);
	    };
	    ;
	    Md5.hashAsciiStr = function (str, raw) {
	        if (raw === void 0) { raw = false; }
	        return this.onePassHasher
	            .start()
	            .appendAsciiStr(str)
	            .end(raw);
	    };
	    ;
	    Md5.prototype.start = function () {
	        this._dataLength = 0;
	        this._bufferLength = 0;
	        this._state.set(Md5.stateIdentity);
	        return this;
	    };
	    // Char to code point to to array conversion:
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
	    // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
	    Md5.prototype.appendStr = function (str) {
	        var buf8 = this._buffer8, buf32 = this._buffer32, bufLen = this._bufferLength, code, i;
	        for (i = 0; i < str.length; i += 1) {
	            code = str.charCodeAt(i);
	            if (code < 128) {
	                buf8[bufLen++] = code;
	            }
	            else if (code < 0x800) {
	                buf8[bufLen++] = (code >>> 6) + 0xC0;
	                buf8[bufLen++] = code & 0x3F | 0x80;
	            }
	            else if (code < 0xD800 || code > 0xDBFF) {
	                buf8[bufLen++] = (code >>> 12) + 0xE0;
	                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
	                buf8[bufLen++] = (code & 0x3F) | 0x80;
	            }
	            else {
	                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
	                if (code > 0x10FFFF) {
	                    throw 'Unicode standard supports code points up to U+10FFFF';
	                }
	                buf8[bufLen++] = (code >>> 18) + 0xF0;
	                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
	                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
	                buf8[bufLen++] = (code & 0x3F) | 0x80;
	            }
	            if (bufLen >= 64) {
	                this._dataLength += 64;
	                Md5._md5cycle(this._state, buf32);
	                bufLen -= 64;
	                buf32[0] = buf32[16];
	            }
	        }
	        this._bufferLength = bufLen;
	        return this;
	    };
	    Md5.prototype.appendAsciiStr = function (str) {
	        var buf8 = this._buffer8, buf32 = this._buffer32, bufLen = this._bufferLength, i, j = 0;
	        for (;;) {
	            i = Math.min(str.length - j, 64 - bufLen);
	            while (i--) {
	                buf8[bufLen++] = str.charCodeAt(j++);
	            }
	            if (bufLen < 64) {
	                break;
	            }
	            this._dataLength += 64;
	            Md5._md5cycle(this._state, buf32);
	            bufLen = 0;
	        }
	        this._bufferLength = bufLen;
	        return this;
	    };
	    Md5.prototype.appendByteArray = function (input) {
	        var buf8 = this._buffer8, buf32 = this._buffer32, bufLen = this._bufferLength, i, j = 0;
	        for (;;) {
	            i = Math.min(input.length - j, 64 - bufLen);
	            while (i--) {
	                buf8[bufLen++] = input[j++];
	            }
	            if (bufLen < 64) {
	                break;
	            }
	            this._dataLength += 64;
	            Md5._md5cycle(this._state, buf32);
	            bufLen = 0;
	        }
	        this._bufferLength = bufLen;
	        return this;
	    };
	    Md5.prototype.getState = function () {
	        var self = this, s = self._state;
	        return {
	            buffer: String.fromCharCode.apply(null, self._buffer8),
	            buflen: self._bufferLength,
	            length: self._dataLength,
	            state: [s[0], s[1], s[2], s[3]]
	        };
	    };
	    Md5.prototype.setState = function (state) {
	        var buf = state.buffer, x = state.state, s = this._state, i;
	        this._dataLength = state.length;
	        this._bufferLength = state.buflen;
	        s[0] = x[0];
	        s[1] = x[1];
	        s[2] = x[2];
	        s[3] = x[3];
	        for (i = 0; i < buf.length; i += 1) {
	            this._buffer8[i] = buf.charCodeAt(i);
	        }
	    };
	    Md5.prototype.end = function (raw) {
	        if (raw === void 0) { raw = false; }
	        var bufLen = this._bufferLength, buf8 = this._buffer8, buf32 = this._buffer32, i = (bufLen >> 2) + 1, dataBitsLen;
	        this._dataLength += bufLen;
	        buf8[bufLen] = 0x80;
	        buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
	        buf32.set(Md5.buffer32Identity.subarray(i), i);
	        if (bufLen > 55) {
	            Md5._md5cycle(this._state, buf32);
	            buf32.set(Md5.buffer32Identity);
	        }
	        // Do the final computation based on the tail and length
	        // Beware that the final length may not fit in 32 bits so we take care of that
	        dataBitsLen = this._dataLength * 8;
	        if (dataBitsLen <= 0xFFFFFFFF) {
	            buf32[14] = dataBitsLen;
	        }
	        else {
	            var matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/), lo = parseInt(matches[2], 16), hi = parseInt(matches[1], 16) || 0;
	            buf32[14] = lo;
	            buf32[15] = hi;
	        }
	        Md5._md5cycle(this._state, buf32);
	        return raw ? this._state : Md5._hex(this._state);
	    };
	    Md5._hex = function (x) {
	        var hc = Md5.hexChars, ho = Md5.hexOut, n, offset, j, i;
	        for (i = 0; i < 4; i += 1) {
	            offset = i * 8;
	            n = x[i];
	            for (j = 0; j < 8; j += 2) {
	                ho[offset + 1 + j] = hc.charAt(n & 0x0F);
	                n >>>= 4;
	                ho[offset + 0 + j] = hc.charAt(n & 0x0F);
	                n >>>= 4;
	            }
	        }
	        return ho.join('');
	    };
	    Md5._md5cycle = function (x, k) {
	        var a = x[0], b = x[1], c = x[2], d = x[3];
	        // ff()
	        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
	        a = (a << 7 | a >>> 25) + b | 0;
	        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
	        d = (d << 12 | d >>> 20) + a | 0;
	        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
	        c = (c << 17 | c >>> 15) + d | 0;
	        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
	        b = (b << 22 | b >>> 10) + c | 0;
	        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
	        a = (a << 7 | a >>> 25) + b | 0;
	        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
	        d = (d << 12 | d >>> 20) + a | 0;
	        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
	        c = (c << 17 | c >>> 15) + d | 0;
	        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
	        b = (b << 22 | b >>> 10) + c | 0;
	        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
	        a = (a << 7 | a >>> 25) + b | 0;
	        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
	        d = (d << 12 | d >>> 20) + a | 0;
	        c += (d & a | ~d & b) + k[10] - 42063 | 0;
	        c = (c << 17 | c >>> 15) + d | 0;
	        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
	        b = (b << 22 | b >>> 10) + c | 0;
	        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
	        a = (a << 7 | a >>> 25) + b | 0;
	        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
	        d = (d << 12 | d >>> 20) + a | 0;
	        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
	        c = (c << 17 | c >>> 15) + d | 0;
	        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
	        b = (b << 22 | b >>> 10) + c | 0;
	        // gg()
	        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
	        a = (a << 5 | a >>> 27) + b | 0;
	        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
	        d = (d << 9 | d >>> 23) + a | 0;
	        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
	        c = (c << 14 | c >>> 18) + d | 0;
	        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
	        b = (b << 20 | b >>> 12) + c | 0;
	        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
	        a = (a << 5 | a >>> 27) + b | 0;
	        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
	        d = (d << 9 | d >>> 23) + a | 0;
	        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
	        c = (c << 14 | c >>> 18) + d | 0;
	        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
	        b = (b << 20 | b >>> 12) + c | 0;
	        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
	        a = (a << 5 | a >>> 27) + b | 0;
	        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
	        d = (d << 9 | d >>> 23) + a | 0;
	        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
	        c = (c << 14 | c >>> 18) + d | 0;
	        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
	        b = (b << 20 | b >>> 12) + c | 0;
	        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
	        a = (a << 5 | a >>> 27) + b | 0;
	        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
	        d = (d << 9 | d >>> 23) + a | 0;
	        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
	        c = (c << 14 | c >>> 18) + d | 0;
	        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
	        b = (b << 20 | b >>> 12) + c | 0;
	        // hh()
	        a += (b ^ c ^ d) + k[5] - 378558 | 0;
	        a = (a << 4 | a >>> 28) + b | 0;
	        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
	        d = (d << 11 | d >>> 21) + a | 0;
	        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
	        c = (c << 16 | c >>> 16) + d | 0;
	        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
	        b = (b << 23 | b >>> 9) + c | 0;
	        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
	        a = (a << 4 | a >>> 28) + b | 0;
	        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
	        d = (d << 11 | d >>> 21) + a | 0;
	        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
	        c = (c << 16 | c >>> 16) + d | 0;
	        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
	        b = (b << 23 | b >>> 9) + c | 0;
	        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
	        a = (a << 4 | a >>> 28) + b | 0;
	        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
	        d = (d << 11 | d >>> 21) + a | 0;
	        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
	        c = (c << 16 | c >>> 16) + d | 0;
	        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
	        b = (b << 23 | b >>> 9) + c | 0;
	        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
	        a = (a << 4 | a >>> 28) + b | 0;
	        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
	        d = (d << 11 | d >>> 21) + a | 0;
	        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
	        c = (c << 16 | c >>> 16) + d | 0;
	        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
	        b = (b << 23 | b >>> 9) + c | 0;
	        // ii()
	        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
	        a = (a << 6 | a >>> 26) + b | 0;
	        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
	        d = (d << 10 | d >>> 22) + a | 0;
	        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
	        c = (c << 15 | c >>> 17) + d | 0;
	        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
	        b = (b << 21 | b >>> 11) + c | 0;
	        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
	        a = (a << 6 | a >>> 26) + b | 0;
	        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
	        d = (d << 10 | d >>> 22) + a | 0;
	        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
	        c = (c << 15 | c >>> 17) + d | 0;
	        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
	        b = (b << 21 | b >>> 11) + c | 0;
	        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
	        a = (a << 6 | a >>> 26) + b | 0;
	        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
	        d = (d << 10 | d >>> 22) + a | 0;
	        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
	        c = (c << 15 | c >>> 17) + d | 0;
	        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
	        b = (b << 21 | b >>> 11) + c | 0;
	        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
	        a = (a << 6 | a >>> 26) + b | 0;
	        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
	        d = (d << 10 | d >>> 22) + a | 0;
	        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
	        c = (c << 15 | c >>> 17) + d | 0;
	        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
	        b = (b << 21 | b >>> 11) + c | 0;
	        x[0] = a + x[0] | 0;
	        x[1] = b + x[1] | 0;
	        x[2] = c + x[2] | 0;
	        x[3] = d + x[3] | 0;
	    };
	    Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
	    Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	    Md5.hexChars = '0123456789abcdef';
	    Md5.hexOut = [];
	    // Permanent instance is to use for one-call hashing
	    Md5.onePassHasher = new Md5();
	    return Md5;
	})();
	exports.Md5 = Md5;
	if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
	    console.error('Md5 self test failed.');
	}
	//# sourceMappingURL=md5.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Created by i on 11.01.2017.
	 */
	"use strict";
	
	var UserMediaManager_1 = __webpack_require__(11);
	/**
	 * Singleton that provides audio/video media
	 * Reuses audio/video tracks
	 * @hidden
	 */
	var MediaCache = function () {
	    function MediaCache() {
	        this.audioCache = {};
	        this.videoCache = {};
	    }
	    MediaCache.get = function () {
	        if (!this.inst) this.inst = new MediaCache();
	        return this.inst;
	    };
	    MediaCache.prototype.clear = function () {
	        for (var _i = 0, _a = this.videoCache; _i < _a.length; _i++) {
	            var track = _a[_i];
	            track.stop();
	        }
	        for (var _b = 0, _c = this.audioCache; _b < _c.length; _b++) {
	            var track = _c[_b];
	            track.stop();
	        }
	    };
	    MediaCache.prototype.getTrack = function (source, kind) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (source == '') source = 'def';
	            switch (kind) {
	                case "audio":
	                    resolve(_this.audioCache[source]);
	                    break;
	                case "video":
	                    resolve(_this.videoCache[source]);
	                    break;
	                default:
	                    resolve();
	                    break;
	            }
	        });
	    };
	    MediaCache.prototype.setTrack = function (source, kind, track) {
	        if (source == '') source = 'def';
	        switch (kind) {
	            case "audio":
	                this.audioCache[source] = track;
	                break;
	            case "video":
	                this.videoCache[source] = track;
	                break;
	            default:
	                return;
	        }
	        track.onmute = function (e) {
	            MediaCache.get().removeTrackByTrack(e.target);
	        };
	    };
	    MediaCache.prototype.removeTrackByTrack = function (track) {
	        switch (track.kind) {
	            case "audio":
	                this.deleteTrackFromCache(this.audioCache, track);
	                break;
	            case "video":
	                this.deleteTrackFromCache(this.videoCache, track);
	                break;
	            default:
	                return;
	        }
	        UserMediaManager_1.UserMediaManager.get().resetLocalVideo();
	    };
	    MediaCache.prototype.deleteTrackFromCache = function (cache, track) {
	        for (var id in cache) {
	            if (cache.hasOwnProperty(id)) {
	                if (cache[id].id === track.id) delete cache[id];
	            }
	        }
	        track.stop();
	    };
	    MediaCache.prototype.getAudioCache = function () {
	        return this.audioCache;
	    };
	    MediaCache.prototype.getVideoCache = function () {
	        return this.videoCache;
	    };
	    return MediaCache;
	}();
	exports.MediaCache = MediaCache;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Logger_1 = __webpack_require__(4);
	var MediaCaptureConfig_1 = __webpack_require__(12);
	var BrowserSpecific_1 = __webpack_require__(7);
	var PCFactory_1 = __webpack_require__(13);
	var Client_1 = __webpack_require__(1);
	/**
	 * @hidden
	 */
	(function (MediaDirection) {
	    MediaDirection[MediaDirection["LOCAL"] = -1] = "LOCAL";
	    MediaDirection[MediaDirection["ANY"] = 0] = "ANY";
	    MediaDirection[MediaDirection["REMOTE"] = 1] = "REMOTE";
	})(exports.MediaDirection || (exports.MediaDirection = {}));
	var MediaDirection = exports.MediaDirection;
	/**
	 * Singleton that manages local media streams
	 * After configuration changes (enableAudio, enableVideo, ...)
	 * one MUST call queryMedia() to apply new settings.
	 * If user media access with new settings can't be acquired,
	 * last successful configuration will be restored
	 * @hidden
	 */
	var UserMediaManager = function () {
	    function UserMediaManager() {
	        this.audioSourcesList = [];
	        this.videoSourcesList = [];
	        this.audioOutputsList = [];
	        /**
	         * Video container id for local video
	         * @type {string}
	         */
	        this.videoContainerId = 'voximplantlocalvideo';
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.USERMEDIA, "");
	        this.config = new MediaCaptureConfig_1.MediaCaptureConfig();
	        this.clearConstraints();
	        this.enableAudio(true);
	        this.enableVideo(true);
	        this.handlers = new Array();
	        this.mediaAccessGranted = false;
	        this._localVideos = new Array();
	        if (typeof window.AudioContext != 'undefined' || typeof window.webkitAudioContext != 'undefined') {
	            window.AudioContext = window.AudioContext || window.webkitAudioContext;
	            this.audioContext = new AudioContext();
	        }
	    }
	    UserMediaManager.get = function () {
	        if (!this.inst) this.inst = new UserMediaManager();
	        return this.inst;
	    };
	    UserMediaManager.prototype.clearConstraints = function () {};
	    UserMediaManager.prototype.addHandler = function (h) {
	        this.handlers.push(h);
	    };
	    UserMediaManager.prototype.enableAudio = function (doEnable) {
	        this.config.audioEnabled = doEnable;
	    };
	    UserMediaManager.prototype.enableVideo = function (doEnable) {
	        this.config.videoEnabled = doEnable;
	    };
	    //Set new local stream
	    UserMediaManager.prototype.setLocalStream = function (stream) {
	        //fix ended tracks
	        //Get audio and video tracks from new stream
	        if (stream.getAudioTracks().length > 0) {
	            this.currentAudioTrack = stream.getAudioTracks()[0];
	        }
	        if (stream.getVideoTracks().length > 0) {
	            this.currentVideoTrack = stream.getVideoTracks()[0];
	        }
	        if (!this._currentStream) {
	            this._currentStream = stream;
	        } else {
	            //Remove all tracks from old streamz
	            //and copy tracks from new stream to old stream
	            //This will not work in FF<44.0
	            while (this._currentStream.getTracks().length > 0) this._currentStream.removeTrack(this._currentStream.getTracks()[0]);
	            if (this.currentAudioTrack) this._currentStream.addTrack(this.currentAudioTrack);
	            if (this.currentVideoTrack) this._currentStream.addTrack(this.currentVideoTrack);
	        }
	        //refresh in active connections
	        for (var i in PCFactory_1.PCFactory.get().peerConnections) {
	            this.attachTo(PCFactory_1.PCFactory.get().peerConnections[i]);
	        }
	    };
	    //Request media access with configuration
	    UserMediaManager.prototype.queryMedia = function () {
	        var constraints = BrowserSpecific_1.default.composeConstraints(this.config);
	        this.muteAllLocal();
	        return this.getQueryMedia(constraints);
	    };
	    //Request media access with configuration
	    UserMediaManager.prototype.queryMediaSilent = function () {
	        var constraints = BrowserSpecific_1.default.composeConstraints(this.config);
	        this.muteAllLocal();
	        return this.getQueryMediaSilent(constraints);
	    };
	    UserMediaManager.prototype.getConstrainWithSendFlag = function (sendAudio, sendVideo) {
	        var fixconfig = JSON.parse(JSON.stringify(this.config));
	        if (sendAudio != null) fixconfig.audioEnabled = sendAudio;
	        if (sendVideo != null) fixconfig.videoEnabled = sendVideo;
	        return BrowserSpecific_1.default.composeConstraints(fixconfig);
	    };
	    UserMediaManager.prototype.getQueryMedia = function (constraints) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            BrowserSpecific_1.default.getUserMedia(constraints).then(function (stream) {
	                _this.validConstraints = constraints;
	                _this.mediaAccessGranted = true;
	                _this.log.info("Media access granted");
	                _this.processGrantedMedia(stream);
	                resolve(stream);
	            }).catch(function (error) {
	                _this.handlers.forEach(function (h) {
	                    try {
	                        h.onMediaAccessRejected();
	                    } catch (e) {
	                        _this.log.error("Error in callback " + e);
	                    }
	                });
	                if (error.name) _this.log.info("Media access rejected: " + error.name);else _this.log.info("Media access rejected");
	                if (_this.validConstraints) {
	                    //Try to restore media stream using previous constraints
	                    BrowserSpecific_1.default.getUserMedia(_this.validConstraints).then(function (stream) {
	                        _this.log.info("Regained media access using previous settings");
	                        _this.processGrantedMedia(stream);
	                        resolve(stream);
	                    }).catch(function (error) {
	                        reject(error);
	                        _this.log.error("Failed to regain media access with previously valid constraints");
	                    });
	                }
	                reject(error);
	            });
	        });
	    };
	    UserMediaManager.prototype.getQueryMediaSilent = function (constraints) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            BrowserSpecific_1.default.getUserMedia(constraints).then(function (stream) {
	                _this.validConstraints = constraints;
	                _this.log.info("Media access granted");
	                resolve(stream);
	            }).catch(function (error) {
	                _this.log.info("Media access rejected: " + error.name);
	                if (_this.validConstraints) {
	                    //Try to restore media stream using previous constraints
	                    BrowserSpecific_1.default.getUserMedia(_this.validConstraints).then(function (stream) {
	                        _this.log.info("Regained media access using previous settings");
	                        resolve(stream);
	                    }).catch(function (error) {
	                        reject(error);
	                        _this.log.error("Failed to regain media access with previously valid constraints");
	                    });
	                }
	                reject(error);
	            });
	        });
	    };
	    UserMediaManager.prototype.processGrantedMedia = function (stream) {
	        var _this = this;
	        this.stopLocalStream();
	        this.setLocalStream(stream);
	        this.handlers.forEach(function (h) {
	            try {
	                h.onMediaAccessGranted(stream);
	            } catch (e) {
	                _this.log.error("Error in callback " + e);
	            }
	        });
	    };
	    UserMediaManager.prototype.muteAllLocal = function () {
	        if (this.currentAudioTrack) {
	            this.currentAudioTrack.stop();
	            this.currentAudioTrack = null;
	        }
	        if (this.currentVideoTrack) {
	            this.currentVideoTrack.stop();
	            this.currentVideoTrack = null;
	        }
	    };
	    //get list of all devices (input and output) optionally filtered by device kind
	    UserMediaManager.prototype.getDevices = function () {
	        if (UserMediaManager.get().audioSourcesList.length !== 0) this.audioSourcesList = [];
	        if (UserMediaManager.get().videoSourcesList.length !== 0) this.videoSourcesList = [];
	        if (UserMediaManager.get().audioOutputsList.length !== 0) this.audioOutputsList = [];
	        var q = new Promise(function (resolve, reject) {
	            navigator.mediaDevices.enumerateDevices().then(function (devices) {
	                for (var i = 0; i != devices.length; ++i) {
	                    var counter = [0, 0, 0];
	                    var sourceInfo = devices[i];
	                    if (sourceInfo.kind === 'audio' || sourceInfo.kind === 'audioinput') UserMediaManager.get().audioSourcesList.push({
	                        id: sourceInfo.id || sourceInfo.deviceId,
	                        name: sourceInfo.label || 'Audio recording device ' + counter[0]++
	                    });else if (sourceInfo.kind === 'video' || sourceInfo.kind === 'videoinput') UserMediaManager.get().videoSourcesList.push({
	                        id: sourceInfo.id || sourceInfo.deviceId,
	                        name: sourceInfo.label || 'Video recording device ' + counter[1]++
	                    });else if (sourceInfo.kind === 'audiooutput') UserMediaManager.get().audioOutputsList.push({
	                        id: sourceInfo.id || sourceInfo.deviceId,
	                        name: sourceInfo.label || 'Audio playback device ' + counter[2]++
	                    });
	                }
	                resolve();
	            }).catch(function (err) {
	                reject(err);
	            });
	        });
	        return q;
	    };
	    //Set video device to use by id
	    UserMediaManager.prototype.useVideoDevice = function (id) {
	        this.config.videoInputId = id;
	    };
	    //Set audio input device
	    UserMediaManager.prototype.useAudioInputDevice = function (id) {
	        this.config.audioInputId = id;
	    };
	    Object.defineProperty(UserMediaManager.prototype, "currentStream", {
	        //Get current local media stream
	        get: function () {
	            return this._currentStream;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    UserMediaManager.prototype.attachTo = function (peerConnection) {
	        //TODO: Client media test & improve
	        // if (typeof(this._currentStream.clone) != "undefined") {
	        //     this.log.trace("clone _currentStream in UserMediaManager.attachTo");
	        //     this._legacySoundControll = false;
	        //     peerConnection.bindLocalMedia(this._currentStream.clone());
	        // }
	        // else {
	        this._legacySoundControll = true;
	        peerConnection.bindLocalMedia(this._currentStream);
	        // }
	    };
	    UserMediaManager.prototype.attachToSound = function (peerConnection) {
	        //TODO: Client media test & improve
	        // if (typeof(this._currentStream.clone) != "undefined") {
	        //     this.log.trace("clone _currentStream in UserMediaManager.attachTo");
	        //     this._legacySoundControll = false;
	        //     peerConnection.bindLocalMedia(this._currentStream.clone());
	        // }
	        // else {
	        this._legacySoundControll = true;
	        peerConnection.bindLocalMedia(new MediaStream(this._currentStream.getAudioTracks()));
	        // }
	    };
	    Object.defineProperty(UserMediaManager.prototype, "legacySoundControll", {
	        /**
	         * Marker for legacy sound controls in Chrome
	         * @returns {boolean}
	         */
	        get: function () {
	            return this._legacySoundControll;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    UserMediaManager.prototype.sendVideo = function (state) {
	        if (this.currentVideoTrack) this.currentVideoTrack.enabled = state;
	    };
	    UserMediaManager.prototype.isVideoEnabled = function () {
	        return this.config.videoEnabled;
	    };
	    UserMediaManager.updateMuteState = function (call_id, direction, newstate) {
	        var pcs = PCFactory_1.PCFactory.get().peerConnections;
	        for (var i in pcs) {
	            switch (direction) {
	                case MediaDirection.ANY:
	                    this.updateMuteState(call_id, MediaDirection.LOCAL, newstate);
	                    this.updateMuteState(call_id, MediaDirection.REMOTE, newstate);
	                    break;
	                case MediaDirection.LOCAL:
	                    //VoxSignaling.get().callRemoteFunction(RemoteFunction.muteLocal, call_id, !newstate);
	                    UserMediaManager.getAudioTracks(pcs[i].localStream).map(function (track) {
	                        track.enabled = newstate;
	                    });
	                    break;
	                case MediaDirection.REMOTE:
	                    pcs[i].remoteStreams.map(function (stream) {
	                        UserMediaManager.getAudioTracks(stream).map(function (track) {
	                            track.enabled = newstate;
	                        });
	                    });
	                    return;
	                default:
	                    return false;
	            }
	        }
	    };
	    UserMediaManager.prototype.stopLocalStream = function () {
	        if (this._currentStream) {
	            this.stopStream(this._currentStream);
	            this._currentStream = null;
	            for (var i in PCFactory_1.PCFactory.get().peerConnections) PCFactory_1.PCFactory.get().peerConnections[i].bindLocalMedia(null);
	        }
	    };
	    UserMediaManager.prototype.stopStream = function (stream) {
	        stream.getTracks().forEach(function (track) {
	            track.stop();
	        });
	    };
	    UserMediaManager.prototype.setConstraints = function (config, apply) {
	        var _this = this;
	        this.config.videoEnabled = true;
	        return new Promise(function (resolve, reject) {
	            _this.config.setVideoSettings(config);
	            if (apply === true) _this.queryMedia().then(function (stream) {
	                resolve(stream);
	            }).catch(function (error) {
	                reject(error);
	            });
	        });
	    };
	    UserMediaManager.getAudioTracks = function (stream) {
	        if (stream) {
	            if (stream.audioTracks) return stream.audioTracks;
	            if (stream.getAudioTracks) return stream.getAudioTracks();
	        }
	        return null;
	    };
	    ;
	    UserMediaManager.getVideoTracks = function (stream) {
	        if (stream) {
	            if (stream.videoTracks) return stream.videoTracks;
	            if (stream.getVideoTracks) return stream.getVideoTracks();
	        }
	        return null;
	    };
	    ;
	    /**
	     * Show video container with local video stream, if gained
	     *
	     * @param flag
	     * @param mirror
	     * @param detachCamera
	     */
	    UserMediaManager.prototype.showLocalVideo = function (flag, mirror, detachCamera) {
	        var _this = this;
	        if (flag === void 0) {
	            flag = true;
	        }
	        if (mirror === void 0) {
	            mirror = false;
	        }
	        if (detachCamera === void 0) {
	            detachCamera = false;
	        }
	        this.currentLocalVideoSets = {
	            flag: flag,
	            mirror: mirror,
	            detachCamera: detachCamera
	        };
	        if (typeof this.currentStream != "undefined") {
	            var containerToUse = document.getElementById(Client_1.Client.getInstance().localVideoContainerId) || document.body;
	            var videoContainer_1 = document.getElementById(this.videoContainerId);
	            if (flag) {
	                if (videoContainer_1 === null) {
	                    videoContainer_1 = document.createElement('video');
	                    videoContainer_1.id = this.videoContainerId;
	                    videoContainer_1.autoplay = true;
	                    videoContainer_1.muted = true;
	                    if (containerToUse.firstChild) containerToUse.insertBefore(videoContainer_1, containerToUse.firstChild);else containerToUse.appendChild(videoContainer_1);
	                } else {
	                    videoContainer_1.style.display = "block";
	                }
	                BrowserSpecific_1.default.getUserMedia(UserMediaManager.get().getConstrainWithSendFlag(false, true)).then(function (stream) {
	                    _this._localVideos.push(stream);
	                    BrowserSpecific_1.default.attachMedia(stream, videoContainer_1);
	                });
	            } else {
	                videoContainer_1.style.display = "none";
	                if (detachCamera) for (var i = 0; i < this._localVideos.length; i++) this.stopStream(this._localVideos[i]);
	            }
	            //fix for local mirrored video
	            if (mirror) videoContainer_1.style.cssText += "transform: rotateY(180deg);" + "-webkit-transform:rotateY(180deg);" + "-moz-transform:rotateY(180deg);";
	        }
	    };
	    UserMediaManager.prototype.resetLocalVideo = function () {
	        this._localVideos = [];
	        this.showLocalVideo(this.currentLocalVideoSets.flag, this.currentLocalVideoSets.mirror, this.currentLocalVideoSets.detachCamera);
	    };
	    UserMediaManager.prototype.updateLocalVideo = function (stream) {
	        if (stream === void 0) {
	            stream = null;
	        }
	        var element = document.getElementById(this.videoContainerId);
	        if (stream === null && element !== null && element.style.display != "none") this.showLocalVideo(true);else {
	            if (element === null || stream.getVideoTracks().length == 0) {
	                return false;
	            } else
	                // this._localVideos.push(stream);
	                BrowserSpecific_1.default.attachMedia(stream, element);
	        }
	    };
	    UserMediaManager.prototype.testLocalStream = function (haveAudio, haveVideo) {
	        var realAudio = false;
	        var realVideo = false;
	        for (var _i = 0, _a = this._currentStream.getTracks(); _i < _a.length; _i++) {
	            var stream = _a[_i];
	            if (stream.kind === "audio") realAudio = true;
	            if (stream.kind === "video") realVideo = true;
	        }
	        return haveAudio === realAudio && haveVideo === realVideo;
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "clearConstraints", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "addHandler", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "enableAudio", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "enableVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "setLocalStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "queryMedia", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "queryMediaSilent", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "processGrantedMedia", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "muteAllLocal", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "getDevices", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "useVideoDevice", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "useAudioInputDevice", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "attachTo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "attachToSound", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "sendVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "stopLocalStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "stopStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "setConstraints", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "showLocalVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "updateLocalVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager.prototype, "testLocalStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager, "updateMuteState", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager, "getAudioTracks", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], UserMediaManager, "getVideoTracks", null);
	    return UserMediaManager;
	}();
	exports.UserMediaManager = UserMediaManager;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Configuration of capture devices
	 * @hidden
	 */
	
	var MediaCaptureConfig = function () {
	    function MediaCaptureConfig() {}
	    MediaCaptureConfig.prototype.clone = function () {
	        var r = new MediaCaptureConfig();
	        r.videoInputId = this.videoInputId;
	        r.audioInputId = this.audioInputId;
	        r.audioEnabled = this.audioEnabled;
	        r.videoEnabled = this.videoEnabled;
	        r.videoSettings = this.videoSettings;
	        return r;
	    };
	    MediaCaptureConfig.prototype.setVideoSettings = function (settings) {
	        this.videoSettings = settings;
	        if (typeof settings.deviceId != "undefined") this.videoInputId = settings.deviceId;
	    };
	    return MediaCaptureConfig;
	}();
	exports.MediaCaptureConfig = MediaCaptureConfig;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var PeerConnection_1 = __webpack_require__(14);
	var VoxSignaling_1 = __webpack_require__(6);
	var UserMediaManager_1 = __webpack_require__(11);
	var Logger_1 = __webpack_require__(4);
	var CallManager_1 = __webpack_require__(16);
	var Call_1 = __webpack_require__(17);
	var BrowserSpecific_1 = __webpack_require__(7);
	var RemoteFunction_1 = __webpack_require__(20);
	var RemoteEvent_1 = __webpack_require__(24);
	/**
	 * Peer connection manager
	 * @hidden
	 */
	var PCFactory = function () {
	    function PCFactory() {
	        var _this = this;
	        this.iceConfig = null;
	        this._peerConnections = {};
	        this.waitingPeerConnections = {};
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.RTC, "PCFactory");
	        this._requireMedia = true;
	        VoxSignaling_1.VoxSignaling.get().setRPCHandler(RemoteEvent_1.RemoteEvent.createPC, function (id, sdpOffer) {
	            _this.rpcHandlerCreatePC(id, sdpOffer);
	        });
	        VoxSignaling_1.VoxSignaling.get().setRPCHandler(RemoteEvent_1.RemoteEvent.destroyPC, function (id) {
	            _this.rpcHandlerDestroyPC(id);
	        });
	        VoxSignaling_1.VoxSignaling.get().addHandler(this);
	    }
	    PCFactory.get = function () {
	        if (this.inst === null) {
	            this.inst = new PCFactory();
	        }
	        return this.inst;
	    };
	    /**
	     * Check if SDP contains video media
	     */
	    PCFactory.sdpOffersVideo = function (sdpOffer) {
	        return { receiveVideo: sdpOffer.indexOf("m=video") !== -1, sendVideo: true };
	    };
	    PCFactory.prototype.rpcHandlerCreatePC = function (id, sdpOffer) {
	        if (UserMediaManager_1.UserMediaManager.get().currentStream || !this._requireMedia) {
	            VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.muteLocal, id, false);
	            VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.muteLocal, id, false);
	            return this.createPC(id, sdpOffer, PeerConnection_1.PeerConnectionMode.CLIENT_SERVER_V1, PCFactory.sdpOffersVideo(sdpOffer));
	        } else {
	            //Postpone creating new PeerConnection until we have local media stream
	            this.waitingPeerConnections[id] = sdpOffer;
	        }
	    };
	    PCFactory.prototype.rpcHandlerDestroyPC = function (id) {
	        if (this._peerConnections[id]) {
	            this._peerConnections[id].close();
	            delete this._peerConnections[id];
	        }
	        delete this.waitingPeerConnections[id];
	    };
	    //Create new peer connection with remote SDP offer
	    PCFactory.prototype.createPC = function (id, sdpOffer, mode, videoEnabled) {
	        var _this = this;
	        var r = BrowserSpecific_1.default.peerConnectionFactory(id, mode, videoEnabled);
	        UserMediaManager_1.UserMediaManager.get().attachTo(r);
	        this._peerConnections[id] = r;
	        var call = CallManager_1.CallManager.get().calls[id];
	        if (sdpOffer) {
	            r.processRemoteOffer(sdpOffer).then(function (localAnswer) {
	                if (typeof call === "undefined" || call.checkCallMode(Call_1.CallMode.SERVER)) VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.confirmPC, id, localAnswer);else VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.acceptCall, [id, CallManager_1.CallManager.cleanHeaders(call.headers()), localAnswer]);
	                if (id !== "__default" && typeof CallManager_1.CallManager.get().calls[id] !== "undefined") {
	                    CallManager_1.CallManager.get().calls[id].peerConnection = r;
	                }
	            }).catch(function (err) {
	                _this.log.error("Error during PC creation: " + err);
	            });
	        }
	        return r;
	    };
	    PCFactory.prototype.setupDirectPC = function (id, mode, videoEnabled, pcHold) {
	        var peerConnection = BrowserSpecific_1.default.peerConnectionFactory(id, mode, videoEnabled);
	        peerConnection.setHoldKey(pcHold);
	        if (!videoEnabled.sendVideo) UserMediaManager_1.UserMediaManager.get().attachToSound(peerConnection);else UserMediaManager_1.UserMediaManager.get().attachTo(peerConnection);
	        this._peerConnections[id] = peerConnection;
	        return peerConnection.getLocalOffer();
	    };
	    PCFactory.prototype.incomeDirectPC = function (id, videoEnabled, sdp, pcHold) {
	        var peerConnection = BrowserSpecific_1.default.peerConnectionFactory(id, PeerConnection_1.PeerConnectionMode.P2P, videoEnabled);
	        peerConnection.setHoldKey(pcHold);
	        peerConnection._setRemoteDescription(sdp);
	        this._peerConnections[id] = peerConnection;
	        return peerConnection;
	    };
	    PCFactory.prototype.getPeerConnect = function (id) {
	        return this._peerConnections[id];
	    };
	    PCFactory.prototype.onMediaAccessRejected = function () {};
	    PCFactory.prototype.onMediaAccessGranted = function (stream) {
	        for (var i in this.waitingPeerConnections) {
	            this.createPC(i, this.waitingPeerConnections[i], PeerConnection_1.PeerConnectionMode.CLIENT_SERVER_V1, PCFactory.sdpOffersVideo(this.waitingPeerConnections[i]));
	        }
	        this.waitingPeerConnections = {};
	    };
	    PCFactory.prototype.onSignalingConnected = function () {};
	    PCFactory.prototype.onSignalingClosed = function () {
	        this.log.info("Closing all peer connections because signaling connection has closed");
	        this.waitingPeerConnections = {};
	        for (var i in this._peerConnections) {
	            this._peerConnections[i].close();
	        }
	        this._peerConnections = {};
	    };
	    PCFactory.prototype.onSignalingConnectionFailed = function (errorMessage) {};
	    PCFactory.prototype.onMediaConnectionFailed = function () {};
	    Object.defineProperty(PCFactory.prototype, "requireMedia", {
	        //Specifies if user media access is required in current application.
	        get: function () {
	            return this._requireMedia;
	        },
	        set: function (b) {
	            this._requireMedia = b;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PCFactory.prototype, "peerConnections", {
	        get: function () {
	            return this._peerConnections;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Close all current peer connections
	     * @hidden
	     */
	    PCFactory.prototype.closeAll = function () {
	        for (var i in this._peerConnections) this._peerConnections[i].close();
	        this._peerConnections = {};
	    };
	    PCFactory.prototype.setBandwidthParams = function (bandwidt) {
	        this._bandwidthParams = bandwidt;
	    };
	    PCFactory.prototype.addBandwidthParams = function (sdp) {
	        if (this._bandwidthParams) sdp.sdp = sdp.sdp.replace(/(a=mid:video.*\r\n)/g, '$1b=AS:' + this._bandwidthParams + '\r\n');
	        return sdp;
	    };
	    PCFactory.inst = null;
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "rpcHandlerCreatePC", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "rpcHandlerDestroyPC", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "createPC", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "setupDirectPC", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "incomeDirectPC", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "getPeerConnect", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "onMediaAccessRejected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "onMediaAccessGranted", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "onSignalingConnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "onSignalingClosed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "onSignalingConnectionFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "onMediaConnectionFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "closeAll", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "setBandwidthParams", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.PCFACTORY)], PCFactory.prototype, "addBandwidthParams", null);
	    return PCFactory;
	}();
	exports.PCFactory = PCFactory;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Logger_1 = __webpack_require__(4);
	var VoxSignaling_1 = __webpack_require__(6);
	var Renderer_1 = __webpack_require__(15);
	var CallManager_1 = __webpack_require__(16);
	var Constants_1 = __webpack_require__(19);
	var RemoteFunction_1 = __webpack_require__(20);
	/**
	 * @hidden
	 */
	(function (PeerConnectionState) {
	    PeerConnectionState[PeerConnectionState["IDLE"] = 0] = "IDLE";
	    PeerConnectionState[PeerConnectionState["REMOTEOFFER"] = 1] = "REMOTEOFFER";
	    PeerConnectionState[PeerConnectionState["LOCALOFFER"] = 2] = "LOCALOFFER";
	    PeerConnectionState[PeerConnectionState["ESTABLISHING"] = 3] = "ESTABLISHING";
	    PeerConnectionState[PeerConnectionState["ESTABLISHED"] = 4] = "ESTABLISHED";
	    PeerConnectionState[PeerConnectionState["CLOSED"] = 5] = "CLOSED";
	})(exports.PeerConnectionState || (exports.PeerConnectionState = {}));
	var PeerConnectionState = exports.PeerConnectionState;
	/**
	 * @hidden
	 */
	(function (PeerConnectionMode) {
	    PeerConnectionMode[PeerConnectionMode["CLIENT_SERVER_V1"] = 0] = "CLIENT_SERVER_V1";
	    PeerConnectionMode[PeerConnectionMode["P2P"] = 1] = "P2P";
	})(exports.PeerConnectionMode || (exports.PeerConnectionMode = {}));
	var PeerConnectionMode = exports.PeerConnectionMode;
	/**
	 * Peer connection wrapper. Will have implementations for WebRTC/ORTC
	 * @hidden
	 */
	var PeerConnection = function () {
	    function PeerConnection(id, mode, videoEnabled) {
	        this.id = id;
	        this.mode = mode;
	        this.videoEnabled = videoEnabled;
	        this.SEND_CANDIDATE_DELAY = 1000;
	        /**
	         * @hidden
	         * @param state
	         */
	        this.onHold = false;
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.RTC, "PeerConnection " + id);
	        this.state = PeerConnectionState.IDLE;
	        this.log.info("Created PC");
	        this.renderers = [];
	        this.pendingCandidates = [];
	    }
	    PeerConnection.prototype.getId = function () {
	        return this.id;
	    };
	    PeerConnection.prototype.setState = function (st) {
	        this.log.info("Transmitting from " + PeerConnectionState[this.state] + " to " + PeerConnectionState[st]);
	        this.state = st;
	    };
	    PeerConnection.prototype.getState = function () {
	        return this.state;
	    };
	    PeerConnection.prototype.processRemoteAnswer = function (headers, sdp) {
	        // if (this.state == PeerConnectionState.ESTABLISHING) {
	        this.log.info("Called processRemoteAnswer");
	        this.state = PeerConnectionState.ESTABLISHING;
	        return this._processRemoteAnswer(headers, sdp);
	        // } else {
	        //     this.log.error("Called processRemoteAnswer in state " + PeerConnectionState[this.state]);
	        // }
	    };
	    PeerConnection.prototype.getLocalOffer = function () {
	        if (this.state === PeerConnectionState.IDLE || this.state === PeerConnectionState.ESTABLISHED || PeerConnectionState.LOCALOFFER) {
	            this.log.info("Called getLocalOffer");
	            this.state = PeerConnectionState.LOCALOFFER;
	            return this._getLocalOffer();
	        } else {
	            this.log.error("Called getLocalOffer in state " + PeerConnectionState[this.state]);
	            return new Promise(function (resolve, reject) {
	                reject("Invalid state");
	            });
	        }
	    };
	    PeerConnection.prototype.getLocalAnswer = function () {
	        return this._getLocalAnswer();
	    };
	    PeerConnection.prototype.processRemoteOffer = function (sdp) {
	        if (this.state === PeerConnectionState.IDLE || this.state === PeerConnectionState.ESTABLISHED) {
	            this.log.info("Called processRemoteOffer");
	            this.state = PeerConnectionState.ESTABLISHING;
	            return this._processRemoteOffer(sdp);
	        } else {
	            this.log.error("Called processRemoteOffer in state " + PeerConnectionState[this.state]);
	            return new Promise(function (resolve, reject) {
	                reject("Invalid state");
	            });
	        }
	    };
	    PeerConnection.prototype.close = function () {
	        this.log.info("Called close");
	        this._close();
	        this.renderers.forEach(function (renderer) {
	            return Renderer_1.Renderer.get().releaseElement(renderer);
	        });
	    };
	    PeerConnection.prototype.addRemoteCandidate = function (candidate, mLineIndex) {
	        this.log.info("Called addRemoteCandidate");
	        return this._addRemoteCandidate(candidate, mLineIndex);
	    };
	    PeerConnection.prototype.sendLocalCandidateToPeer = function (cand, mLineIndex) {
	        this._call = CallManager_1.CallManager.get().calls[this.id];
	        switch (this.mode) {
	            case PeerConnectionMode.P2P:
	                //this.getLocalOffer().then((localDescription)=> {
	                //     this.addCandidateToSend(cand,mLineIndex);
	                CallManager_1.CallManager.get().calls[this.id].sendInfo(Constants_1.Constants.P2P_SPD_FRAG_MIME_TYPE, JSON.stringify([[mLineIndex, cand]]), {});
	                //});
	                break;
	            case PeerConnectionMode.CLIENT_SERVER_V1:
	                VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.addCandidate, this.id, cand, mLineIndex);
	                break;
	        }
	    };
	    PeerConnection.prototype.bindLocalMedia = function (localStream) {
	        if (typeof this._localStream !== "undefined") this._unbindLocalMegia();
	        if (typeof localStream !== "undefined") {
	            // let allTracks:Array<MediaStreamTrack> = localStream.getTracks();
	            // for(var i=0,maxi = allTracks.length;i<maxi;i++){
	            //     if(allTracks[i].kind == "audio"){
	            //         localStream.removeTrack(allTracks[i]);
	            //     }
	            // }
	            var newMs = new MediaStream(localStream.getTracks().map(function (item) {
	                if (typeof item.clone !== "undefined") return item.clone();else return item;
	            }));
	            this._localStream = newMs;
	            this._bindLocalMedia();
	        }
	    };
	    Object.defineProperty(PeerConnection.prototype, "localStream", {
	        get: function () {
	            return this._localStream;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PeerConnection.prototype, "remoteStreams", {
	        get: function () {
	            return this._remoteStreams;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PeerConnection.prototype, "videoRenderer", {
	        get: function () {
	            var result = null;
	            this.renderers.forEach(function (item) {
	                if (item.tagName.toLowerCase() === "video") result = item;
	            });
	            return result;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PeerConnection.prototype, "audioRenderer", {
	        get: function () {
	            this.renderers.forEach(function (item) {
	                if (item.tagName.toLowerCase() === "audio") return item;
	            });
	            return null;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PeerConnection.prototype.handleReinvite = function (headers, sdp, hasVideo) {
	        return this._handleReinvite(headers, sdp, hasVideo);
	    };
	    PeerConnection.prototype.addCandidateToSend = function (attrString, mLineIndex) {
	        this.pendingCandidates.push([mLineIndex, attrString]);
	        if (this.canSendCandidates) this.startCandidateSendTimer();
	    };
	    PeerConnection.prototype.startCandidateSendTimer = function () {
	        var _this = this;
	        if (this.candidateSendTimer === null || typeof this.candidateSendTimer === "undefined") {
	            this.candidateSendTimer = setTimeout(function () {
	                _this.candidateSendTimer = null;
	                if (_this.pendingCandidates.length > 0) {
	                    CallManager_1.CallManager.get().calls[_this.id].sendInfo(Constants_1.Constants.P2P_SPD_FRAG_MIME_TYPE, JSON.stringify(_this.pendingCandidates), {});
	                }
	                _this.pendingCandidates = [];
	            }, this.SEND_CANDIDATE_DELAY);
	        }
	    };
	    PeerConnection.prototype.canStartSendingCandidates = function () {
	        this.canSendCandidates = true;
	        this.startCandidateSendTimer();
	    };
	    ;
	    PeerConnection.prototype.sendDTMF = function (key) {
	        // const duration = 3000;
	        var duration = 500;
	        var gap = 50;
	        this._sendDTMF(key, duration, gap);
	    };
	    /**
	     * Hold/Unhold action for protocol v3 (Fully implement RFC 4566
	     * @param newState
	     */
	    PeerConnection.prototype.hold = function (newState) {
	        this._hold(newState);
	    };
	    PeerConnection.prototype.setVideoEnabled = function (newVal) {
	        var oldvalRecieve = this.videoEnabled.receiveVideo;
	        this.videoEnabled = newVal;
	        if (oldvalRecieve != newVal.receiveVideo) {
	            this._hold(this.onHold);
	        }
	    };
	    PeerConnection.prototype.setVideoFlags = function (newFlags) {
	        this.videoEnabled = newFlags;
	    };
	    PeerConnection.prototype.updateRenderersSink = function (sinkId) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            _this.sinkId = sinkId;
	            var renderers = [];
	            for (var _i = 0, _a = _this.renderers; _i < _a.length; _i++) {
	                var item = _a[_i];
	                renderers.push(item.setSinkId(sinkId));
	            }
	            Promise.all(renderers).then(function () {
	                resolve();
	            }, reject);
	        });
	    };
	    /**
	     * Get sdp audio/video directions from sdp
	     * @hidden
	     */
	    PeerConnection.prototype.getDirections = function () {
	        return this._getDirections();
	    };
	    /**
	     * @hidden
	     * @param state
	     */
	    PeerConnection.prototype.setHoldKey = function (state) {
	        this.onHold = state;
	    };
	    PeerConnection.prototype.getTrackKind = function () {
	        return this._getTrackKind();
	    };
	    PeerConnection.prototype.stopSharing = function () {
	        this._stopSharing();
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "setState", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "getState", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "processRemoteAnswer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "getLocalOffer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "getLocalAnswer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "processRemoteOffer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "close", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "addRemoteCandidate", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "sendLocalCandidateToPeer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "bindLocalMedia", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "addCandidateToSend", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "startCandidateSendTimer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "canStartSendingCandidates", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], PeerConnection.prototype, "hold", null);
	    return PeerConnection;
	}();
	exports.PeerConnection = PeerConnection;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var BrowserSpecific_1 = __webpack_require__(7);
	var Logger_1 = __webpack_require__(4);
	/**
	 * Singleton that provides audio/video rendering
	 * Reuses audio/video elements
	 * @hidden
	 */
	var Renderer = function () {
	    function Renderer() {
	        this.videoElements = new Array();
	        this.audioElements = new Array();
	        //this.usedElements = {};     
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.RTC, "Renderer");
	    }
	    Renderer.get = function () {
	        if (!this.inst) this.inst = new Renderer();
	        return this.inst;
	    };
	    Object.defineProperty(Renderer.prototype, "defaultContainer", {
	        get: function () {
	            return this._defaultContainer;
	        },
	        set: function (d) {
	            this._defaultContainer = d;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Get new renderer element and put it into specified container
	     */
	    Renderer.prototype.getElement = function (id, video, container) {
	        var containerToUse = container || this._defaultContainer || document.body;
	        if (document.getElementById(id)) {
	            // this.log.info("Element with id " + id + " already exists");
	            var exist = document.getElementById(id);
	            if (containerToUse) exist.parentElement.removeChild(exist);
	        }
	        var elementToUse;
	        // let reusables:Array<HTMLMediaElement> = video ? this.videoElements : this.audioElements;
	        // if (reusables.length > 0) {
	        //     elementToUse = reusables.pop();
	        // } else {
	        elementToUse = document.createElement(video ? "video" : "audio");
	        //sink
	        if (video) {
	            this.videoElements.push(elementToUse);
	            elementToUse.width = 400;
	            elementToUse.height = 300;
	        } else {
	            this.audioElements.push(elementToUse);
	        }
	        // }
	        elementToUse.id = id;
	        if (containerToUse) {
	            containerToUse.appendChild(elementToUse);
	        }
	        return elementToUse;
	    };
	    Renderer.prototype.getElementId = function (id, video) {};
	    /**
	     * Get new renderer element and attach it to specified media stream.
	     */
	    Renderer.prototype.renderStream = function (stream, container) {
	        var elementToUse = this.getElement(stream.id, stream.getVideoTracks().length > 0, container);
	        BrowserSpecific_1.default.attachMedia(stream, elementToUse);
	        return elementToUse;
	    };
	    Renderer.prototype.setPlaybackVolume = function (vol) {
	        for (var i in this.audioElements) {
	            this.audioElements[i].volume = vol;
	        }
	        for (var i in this.videoElements) {
	            this.videoElements[i].volume = vol;
	        }
	    };
	    /**
	     * Remove renderer element from parent and detach it from media stream
	     *  */
	    Renderer.prototype.releaseElement = function (el) {
	        if (el) {
	            el.id = "";
	            if (typeof el.parentElement != "undefined" && el.parentElement !== null) {
	                if (el.parentElement) el.parentElement.removeChild(el);
	            } else if (el.parentNode) {
	                if (el.parentNode) el.parentNode.removeChild(el);
	            }
	            BrowserSpecific_1.default.detachMedia(el);
	        }
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], Renderer.prototype, "getElement", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], Renderer.prototype, "getElementId", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], Renderer.prototype, "renderStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], Renderer.prototype, "setPlaybackVolume", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.USERMEDIA)], Renderer.prototype, "releaseElement", null);
	    return Renderer;
	}();
	exports.Renderer = Renderer;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Call_1 = __webpack_require__(17);
	var CallEvents_1 = __webpack_require__(18);
	var VoxSignaling_1 = __webpack_require__(6);
	var Utils_1 = __webpack_require__(3);
	var Authenticator_1 = __webpack_require__(5);
	var Constants_1 = __webpack_require__(19);
	var Logger_1 = __webpack_require__(4);
	var PCFactory_1 = __webpack_require__(13);
	var Client_1 = __webpack_require__(1);
	var PeerConnection_1 = __webpack_require__(14);
	var CallExServer_1 = __webpack_require__(22);
	var CallExP2P_1 = __webpack_require__(23);
	var RemoteFunction_1 = __webpack_require__(20);
	var RemoteEvent_1 = __webpack_require__(24);
	var CallExMedia_1 = __webpack_require__(25);
	var CallstatsIo_1 = __webpack_require__(26);
	var PendingUpdate = CallEvents_1.CallEvents.PendingUpdate;
	/**
	 * Implenets signaling protocol and local call management'
	 * Singleton
	 * All call manipulation MUST be there
	 * @hidden
	 */
	var CallManager = function () {
	    function CallManager() {
	        var _this = this;
	        this.protocolVersion = "3";
	        this._calls = {};
	        this.voxSignaling = VoxSignaling_1.VoxSignaling.get();
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.SIGNALING, "CallManager");
	        this.voxSignaling.addHandler(this);
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleIncomingConnection, function (id, callerid, displayName, headers, sdp) {
	            _this.handleIncomingConnection(id, callerid, displayName, headers, sdp);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleConnectionConnected, function (id, headers, sdp) {
	            _this.handleConnectionConnected(id, headers, sdp);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleConnectionDisconnected, function (id, headers, params) {
	            _this.handleConnectionDisconnected(id, headers, params);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleRingOut, function (id) {
	            _this.handleRingOut(id);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.stopRinging, function (id) {
	            _this.stopRinging(id);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleConnectionFailed, function (id, code, reason, headers) {
	            _this.handleConnectionFailed(id, code, reason, headers);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleSIPInfo, function (callId, type, subType, body, headers) {
	            _this.handleSIPInfo(callId, type, subType, body, headers);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleSipEvent, function (callId) {
	            _this.handleSipEvent(callId);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleTransferStarted, function (callId) {
	            _this.handleTransferStarted(callId);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleTransferComplete, function (callId) {
	            _this.handleTransferComplete(callId);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleTransferFailed, function (callId) {
	            _this.handleTransferFailed(callId);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleReInvite, function (callid, headers, sdp) {
	            _this.handleInReinvite(callid, headers, sdp);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleAcceptReinvite, function (callid, headers, sdp) {
	            _this.handleReinvite(callid, headers, sdp);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.handleRejectReinvite, function (callid, headers, sdp) {
	            _this.handleRejectReinvite(callid, headers, sdp);
	        });
	        this.voxSignaling.setRPCHandler(RemoteEvent_1.RemoteEvent.startEarlyMedia, function (id, headers, sdp) {
	            _this.startEarlyMedia(id, headers, sdp);
	        });
	    }
	    Object.defineProperty(CallManager.prototype, "numCalls", {
	        /**
	         * Get active call count
	         * @hidden
	         * @returns {number}
	         */
	        get: function () {
	            return this._numCalls;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ;
	    Object.defineProperty(CallManager.prototype, "calls", {
	        get: function () {
	            return this._calls;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    CallManager.get = function () {
	        if (typeof this.inst == "undefined") {
	            this.inst = new CallManager();
	        }
	        return this.inst;
	    };
	    /**
	     * Place an outgoing call
	     * @param {string} number Number to place call
	     * @param {object} headers Additional headers
	     * @param {boolean} video Initial state of video - enabled/disabled
	     * @param {object} extraParams DEPRECATED
	     */
	    CallManager.prototype.
	    // call(num: string, headers: { [id: string]: string } = {}, video: boolean = false, extraParams: { [id: string]: string } = {}): Call {
	    call = function (sets) {
	        var _this = this;
	        if (typeof sets.video === "boolean") {
	            sets.video = { sendVideo: sets.video, receiveVideo: sets.video };
	        }
	        var defaults = {
	            number: null,
	            video: { sendVideo: false, receiveVideo: false },
	            customData: null,
	            extraHeaders: {},
	            wiredLocal: true,
	            wiredRemote: true,
	            H264first: false,
	            VP8first: false,
	            forceActive: false
	        };
	        //here will media pain
	        var settings = Utils_1.Utils.mixObjectToLeft(defaults, sets);
	        settings = CallManager.addCustomDataToHeaders(settings);
	        var id = Utils_1.Utils.generateUUID();
	        if (this._calls[id]) {
	            this.log.error("Call " + id + " already exists");
	            throw new Error("Internal error");
	        }
	        var call;
	        if (this.protocolVersion == "3") {
	            call = new CallExMedia_1.CallExMedia(id, Authenticator_1.Authenticator.get().displayName, false, settings);
	        } else if (typeof settings.extraHeaders[Constants_1.Constants.DIRECT_CALL_HEADER] != "undefined") {
	            call = new CallExP2P_1.CallExP2P(id, Authenticator_1.Authenticator.get().displayName, false, settings);
	        } else {
	            call = new CallExServer_1.CallExServer(id, Authenticator_1.Authenticator.get().displayName, false, settings);
	        }
	        this._calls[id] = call;
	        if (CallstatsIo_1.CallstatsIo.isModuleEnabled()) {
	            settings.extraHeaders[Constants_1.Constants.CALLSTATSIOID_HEADER] = id;
	        }
	        if (settings.VP8first) {
	            call.rearangeCodecs = function (codecList) {
	                return new Promise(function (resolve, reject) {
	                    for (var i = 0; i < codecList.sections.length; i++) {
	                        if (codecList.sections[i].kind.toLowerCase() == "video") {
	                            codecList.sections[i].codec.sort(function (a, b) {
	                                if (a.toLowerCase().indexOf("vp8") != -1) return -1;
	                                if (b.toLowerCase().indexOf("vp8") != -1) return 1;
	                                return 0;
	                            });
	                        }
	                    }
	                    resolve(codecList);
	                });
	            };
	        }
	        if (settings.H264first) {
	            call.rearangeCodecs = function (codecList) {
	                return new Promise(function (resolve, reject) {
	                    for (var i = 0; i < codecList.sections.length; i++) {
	                        if (codecList.sections[i].kind.toLowerCase() == "video") {
	                            codecList.sections[i].codec.sort(function (a, b) {
	                                if (a.toLowerCase().indexOf("h264") != -1 && a.toLowerCase().indexOf("uc") == -1) return -1;
	                                if (b.toLowerCase().indexOf("h264") != -1 && b.toLowerCase().indexOf("uc") == -1) return 1;
	                                return 0;
	                            });
	                        }
	                    }
	                    resolve(codecList);
	                });
	            };
	        }
	        //
	        var pcHold = false;
	        if (Object.keys(this._calls).length > 1) {
	            call.setActiveForce(false);
	            pcHold = true;
	        }
	        if (typeof settings.extraHeaders[Constants_1.Constants.DIRECT_CALL_HEADER] === "undefined" && this.protocolVersion == "2") {
	            this.voxSignaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.createCall, -1, settings.number, settings.video, id, null, null, settings.extraHeaders, settings.extraParams);
	        } else {
	            PCFactory_1.PCFactory.get().setupDirectPC(id, PeerConnection_1.PeerConnectionMode.P2P, sets.video, pcHold).then(function (sdpOffer) {
	                call.peerConnection = PCFactory_1.PCFactory.get().peerConnections[id];
	                var extra = { tracks: call.peerConnection.getTrackKind() };
	                _this.voxSignaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.createCall, -1, settings.number, settings.video, id, null, null, settings.extraHeaders, "", sdpOffer.sdp, extra);
	            });
	        }
	        return call;
	    };
	    /**
	     * snipet to process customData into CallSettings
	     * @param settings
	     * @returns {CallSettings}
	     */
	    CallManager.addCustomDataToHeaders = function (settings) {
	        if (typeof settings.customData != "undefined") {
	            if (typeof settings.extraHeaders == 'undefined') settings.extraHeaders = {};
	            settings.extraHeaders["VI-CallData"] = settings.customData;
	        }
	        return settings;
	    };
	    /**
	     * Handle incoming call
	     * @hidden
	     * @param id
	     * @param callerid
	     * @param displayName
	     * @param headers
	     * @param sdp
	     */
	    CallManager.prototype.handleIncomingConnection = function (id, callerid, displayName, headers, sdp) {
	        if (this._calls[id]) {
	            this.log.error("Call " + id + " already exists");
	            throw new Error("Internal error");
	        }
	        var call;
	        var hasVideo = Client_1.Client.getInstance().videoSupport;
	        var settings = {
	            number: callerid,
	            extraHeaders: headers,
	            video: hasVideo,
	            wiredLocal: true,
	            wiredRemote: true,
	            forceActive: false
	        };
	        if (this.protocolVersion == "3") {
	            call = new CallExMedia_1.CallExMedia(id, displayName, true, settings);
	        } else if (typeof settings.extraHeaders[Constants_1.Constants.DIRECT_CALL_HEADER] != "undefined") call = new CallExP2P_1.CallExP2P(id, displayName, true, settings);else call = new CallExServer_1.CallExServer(id, displayName, true, settings);
	        this._calls[id] = call;
	        //
	        var pcHold = false;
	        if (Object.keys(this._calls).length > 1) {
	            call.setActiveForce(false);
	            pcHold = true;
	        }
	        if (typeof settings.extraHeaders[Constants_1.Constants.DIRECT_CALL_HEADER] === "undefined" && this.protocolVersion == "2") {
	            call.peerConnection = PCFactory_1.PCFactory.get().getPeerConnect(id);
	        } else {
	            call.peerConnection = PCFactory_1.PCFactory.get().incomeDirectPC(id, { receiveVideo: true, sendVideo: true }, sdp, pcHold);
	        }
	        Client_1.Client.getInstance().onIncomingCall(id, callerid, displayName, headers, hasVideo);
	    };
	    /**
	     * Check if sdp have video section with send flow
	     * @param sdp
	     * @returns {boolean}
	     */
	    CallManager.prototype.isSDPHasVideo = function (sdp) {
	        var videoPos = sdp.indexOf('m=video');
	        if (videoPos === -1) return false;
	        var sendresvPos = sdp.indexOf('a=sendrecv', videoPos);
	        var sendonlyPos = sdp.indexOf('a=sendonly', videoPos);
	        var nextM = sdp.indexOf('m=', videoPos);
	        if (sendresvPos !== -1 && (sendresvPos < nextM || nextM === -1) || sendonlyPos !== -1 && (sendonlyPos < nextM || nextM === -1)) return true;
	        return false;
	    };
	    CallManager.prototype.findCall = function (id, functionName) {
	        var c = this._calls[id];
	        if (id === "") c = this._calls[Object.keys(this._calls)[0]];
	        if (typeof c == "undefined") {
	            this.log.warning("Received " + functionName + " for unknown call " + id);
	            return null;
	        }
	        return c;
	    };
	    CallManager.prototype.handleRingOut = function (id) {
	        var c = this.findCall(id, "handleRingOut");
	        if (typeof c == "undefined") return;
	        Client_1.Client.getInstance().playProgressTone();
	        c.onRingOut();
	        c.canStartSendingCandidates();
	    };
	    ;
	    CallManager.prototype.handleConnectionConnected = function (id, headers, sdp) {
	        var c = this.findCall(id, "handleConnectionConnected");
	        if (typeof c == "undefined") {
	            return;
	        }
	        c.signalingConnected = true;
	        c.onConnected(headers, sdp);
	        c.canStartSendingCandidates();
	        if (typeof sdp != "undefined" && sdp.length > 0) {
	            //TODO:REMOVE THIS AFTER IVAN PATCH!!!
	            var videoPos = sdp.indexOf('m=video');
	            if (videoPos !== -1) {
	                var sendresvPos = sdp.indexOf('a=sendrecv', videoPos);
	                var sendonlyPos = sdp.indexOf('a=sendonly', videoPos);
	                var recvonlyPos = sdp.indexOf('a=recvonly', videoPos);
	                var inactivePos = sdp.indexOf('a=inactive', videoPos);
	                if (sendresvPos === -1 && sendonlyPos === -1 && recvonlyPos === -1 && inactivePos === -1) sdp += "a=inactive\r\n";
	            }
	            //ENDTODO
	            c.peerConnection.processRemoteAnswer(headers, sdp);
	        }
	        Client_1.Client.getInstance().stopProgressTone();
	    };
	    CallManager.prototype.startEarlyMedia = function (id, headers, sdp) {
	        var c = this.findCall(id, "startEarlyMedia");
	        if (typeof sdp != "undefined") {
	            c.peerConnection.processRemoteAnswer(headers, sdp);
	        }
	        Client_1.Client.getInstance().stopProgressTone();
	    };
	    CallManager.prototype.handleConnectionDisconnected = function (id, headers, params) {
	        var c = this.findCall(id, "handleConnectionDisconnected");
	        if (!c) return;
	        Client_1.Client.getInstance().stopProgressTone();
	        c.onDisconnected(headers, params);
	        delete this._calls[id];
	    };
	    CallManager.prototype.handleSIPInfo = function (callId, type, subType, body, headers) {
	        var c = this.findCall(callId, "handleSIPInfo");
	        if (typeof c == "undefined") return;
	        c.onInfo(c, type, subType, body, headers);
	    };
	    CallManager.prototype.stopRinging = function (id) {
	        var c = this.findCall(id, "stopRinging");
	        c.canStartSendingCandidates();
	        if (typeof c == "undefined") return;
	        Client_1.Client.getInstance().stopProgressTone();
	        c.onStopRinging();
	    };
	    CallManager.prototype.handleSipEvent = function (id) {};
	    CallManager.prototype.handleTransferStarted = function (id) {};
	    CallManager.prototype.handleTransferComplete = function (id) {
	        var c = this.findCall(id, "handleTransferComplete");
	        if (typeof c == "undefined") return;
	        c.onTransferComplete();
	    };
	    CallManager.prototype.handleTransferFailed = function (id) {
	        var c = this.findCall(id, "handleTransferFailed");
	        if (typeof c == "undefined") return;
	        c.onTransferFailed();
	    };
	    CallManager.prototype.handleReinvite = function (id, headers, sdp) {
	        var c = this.findCall(id, "handleReinvite");
	        if (typeof c == "undefined") return;
	        var hasVideo = this.isSDPHasVideo(sdp);
	        c.peerConnection.handleReinvite(headers, sdp, hasVideo);
	    };
	    CallManager.prototype.handleRejectReinvite = function (id, headers, sdp) {
	        var c = this.findCall(id, "handleReinvite");
	        if (typeof c == "undefined") return;
	        c.dispatchEvent({ code: 20, call: c });
	    };
	    CallManager.prototype.handleInReinvite = function (id, headers, sdp) {
	        var c = this.findCall(id, "handleReinvite");
	        if (typeof c == "undefined") return;
	        c.runIncomingReInvite(headers, sdp);
	        c.dispatchEvent({ name: PendingUpdate, result: true, call: c });
	    };
	    CallManager.prototype.handleConnectionFailed = function (id, code, reason, headers) {
	        var c = this.findCall(id, "handleConnectionFailed");
	        if (typeof c == "undefined") return;
	        delete this._calls[id];
	        Client_1.Client.getInstance().stopProgressTone();
	        c.onFailed(code, reason, headers);
	    };
	    CallManager.prototype.onSignalingConnected = function () {};
	    CallManager.prototype.onSignalingClosed = function () {
	        for (var i in this._calls) {
	            this._calls[i].hangup();
	        }
	    };
	    CallManager.prototype.onSignalingConnectionFailed = function (errorMessage) {};
	    CallManager.prototype.onMediaConnectionFailed = function () {};
	    // Recalculate active call count
	    CallManager.prototype.recalculateNumCalls = function () {
	        this._numCalls = 0;
	        for (var i in this._calls) this._numCalls++;
	    };
	    CallManager.prototype.transferCall = function (call1, call2) {
	        var x = [call1, call2];
	        for (var i = 0; i < x.length; i++) {
	            var call = this._calls[x[i].id()];
	            if (call) {
	                if (call.stateValue != Call_1.CallState.CONNECTED) {
	                    this.log.error("trying to transfer call " + call.id() + " in state " + call.state());
	                    return;
	                }
	            } else {
	                this.log.error("trying to transfer unknown call " + call.id());
	                return;
	            }
	        }
	        this.voxSignaling.callRemoteFunction(RemoteFunction_1.RemoteFunction.transferCall, [call1, call2]);
	    };
	    /**
	     * Fx for backward compatibility with hidden Fx Client.removeCall
	     * @param call_id
	     */
	    CallManager.prototype.removeCall = function (call_id) {
	        delete this._calls[call_id];
	    };
	    /**
	     * Remove all non X- headers
	     * @param headers
	     * @returns {{}}
	     */
	    CallManager.cleanHeaders = function (headers) {
	        var res = {};
	        for (var key in headers) {
	            if (key.substring(0, 2) == "X-" || key == Constants_1.Constants.CALL_DATA_HEADER) {
	                res[key] = headers[key];
	            }
	        }
	        return res;
	    };
	    ;
	    CallManager.prototype.setProtocolVersion = function (ver) {
	        this.protocolVersion = ver;
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "call", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleIncomingConnection", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "findCall", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleRingOut", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleConnectionConnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleConnectionDisconnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLEXSERVER)], CallManager.prototype, "handleSIPInfo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "stopRinging", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleSipEvent", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleTransferStarted", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleTransferComplete", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleTransferFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleReinvite", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleRejectReinvite", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleInReinvite", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "handleConnectionFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "onSignalingConnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "onSignalingClosed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "onSignalingConnectionFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager.prototype, "removeCall", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLMANAGER)], CallManager, "addCustomDataToHeaders", null);
	    return CallManager;
	}();
	exports.CallManager = CallManager;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var CallEvents_1 = __webpack_require__(18);
	var VoxSignaling_1 = __webpack_require__(6);
	var Constants_1 = __webpack_require__(19);
	var Logger_1 = __webpack_require__(4);
	var UserMediaManager_1 = __webpack_require__(11);
	var PCFactory_1 = __webpack_require__(13);
	var CallManager_1 = __webpack_require__(16);
	var BrowserSpecific_1 = __webpack_require__(7);
	var RemoteFunction_1 = __webpack_require__(20);
	var ReusableRenderer_1 = __webpack_require__(21);
	var Client_1 = __webpack_require__(1);
	/**
	 * @hidden
	 */
	(function (CallState) {
	    CallState[CallState["ALERTING"] = "ALERTING"] = "ALERTING";
	    CallState[CallState["PROGRESSING"] = "PROGRESSING"] = "PROGRESSING";
	    CallState[CallState["CONNECTED"] = "CONNECTED"] = "CONNECTED";
	    CallState[CallState["UPDATING"] = "UPDATING"] = "UPDATING";
	    CallState[CallState["ENDED"] = "ENDED"] = "ENDED";
	})(exports.CallState || (exports.CallState = {}));
	var CallState = exports.CallState;
	/**
	 * @hidden
	 */
	(function (CallMode) {
	    CallMode[CallMode["P2P"] = 0] = "P2P";
	    CallMode[CallMode["SERVER"] = 1] = "SERVER";
	})(exports.CallMode || (exports.CallMode = {}));
	var CallMode = exports.CallMode;
	/**
	 *
	 */
	var Call = function () {
	    /**
	     * @hidden
	     */
	    function Call(id, dn, incoming, settings) {
	        var _this = this;
	        /**
	         * @hidden
	         */
	        this.eventListeners = {};
	        /**
	         * @hidden
	         * @type {Array}
	         */
	        this.pendingReinvites = [];
	        this.signalingConnected = false;
	        this._id = id;
	        this._num = settings.number;
	        this._displayName = dn;
	        this._headers = settings.extraHeaders;
	        this._state = incoming ? CallState.ALERTING : CallState.PROGRESSING;
	        this._mode = CallMode.P2P;
	        // settings for wired
	        this._setupWiredLocal = settings.wiredLocal;
	        this._wiredLocal = settings.wiredLocal;
	        this._setupWiredRemote = settings.wiredLocal;
	        this._wiredRemote = settings.wiredLocal;
	        this._active = true;
	        this._usedSinkId = null;
	        this._promise = new Promise(function (resolve, reject) {
	            _this._promiseFunctions = { resolve: resolve, reject: reject };
	        });
	        this._renegotiationPromise = null;
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.CALL, "Call " + id);
	        this._callManager = CallManager_1.CallManager.get();
	        if (typeof settings.video === "boolean") {
	            this.videoDirections = { sendVideo: settings.video, receiveVideo: true };
	        } else {
	            this.videoDirections = settings.video;
	        }
	    }
	    /**
	     * Returns call id
	     * @returns {String}
	     */
	    Call.prototype.id = function () {
	        return this._id;
	    };
	    /**
	     * Returns dialed number or caller id
	     * @returns {String}
	     */
	    Call.prototype.number = function () {
	        return this._num;
	    };
	    /**
	     * Returns display name
	     */
	    Call.prototype.displayName = function () {
	        return this._displayName;
	    };
	    /**
	     * Returns headers
	     * @returns {Object}
	     */
	    Call.prototype.headers = function () {
	        return this._headers;
	    };
	    /**
	     * Returns information about the call's media state (active/inactive)
	     */
	    Call.prototype.active = function () {
	        return this._active;
	    };
	    /**
	     * Get call's current state
	     * may be "ALERTING", "PROGRESSING", "CONNECTED", "ENDED"
	     * @returns {String}
	     */
	    Call.prototype.state = function () {
	        return CallState[this._state];
	    };
	    Object.defineProperty(Call.prototype, "stateValue", {
	        /**
	         * @hidden
	         * @returns {CallState}
	         */
	        get: function () {
	            return this._state;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Answer on incoming call
	     * @param {String} [customData] Set custom string associated with call session. It can be later obtained from Call History using HTTP API
	     * @param {Object} extraHeaders Optional custom parameters (SIP headers) that should be sent after accepting incoming call. Parameter names must start with "X-" to be processed by application
	     * @param {boolean} useVideo Optional parameter that can attach or detach video for current call. By default equal Config.videoSupport flag
	     */
	    Call.prototype.answer = function (customData, extraHeaders, useVideo) {
	        if (typeof customData != 'undefined') {
	            if (typeof extraHeaders == 'undefined') extraHeaders = {};
	            extraHeaders[Constants_1.Constants.CALL_DATA_HEADER] = customData;
	        }
	        if (typeof useVideo !== "undefined") useVideo = {
	            sendVideo: Client_1.Client.getInstance().config().videoSupport,
	            receiveVideo: Client_1.Client.getInstance().config().videoSupport
	        };
	        if (this._state != CallState.ALERTING) throw new Error("WRONG_CALL_STATE");
	        if (typeof useVideo != "undefined") {
	            this._peerConnection.setVideoFlags(useVideo);
	        }
	    };
	    /**
	     * @name VoxImplant.Call.decline
	     * Reject incoming call
	     * @param {Object} extraHeaders Optional custom parameters (SIP headers) that should be sent after rejecting incoming call. Parameter names must start with "X-" to be processed by application
	     * @deprecated Since version 2. You should now use reject.
	     * @function
	     * @hidden
	     */
	    Call.prototype.decline = function (extraHeaders) {
	        this.reject(extraHeaders);
	    };
	    /**
	     * Reject incoming call
	     * @param {Object} extraHeaders Optional custom parameters (SIP headers) that should be sent after rejecting incoming call. Parameter names must start with "X-" to be processed by application
	     */
	    Call.prototype.reject = function (extraHeaders) {
	        if (this._state != CallState.ALERTING) throw new Error("WRONG_CALL_STATE");
	        VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.rejectCall, this._id, true, CallManager_1.CallManager.cleanHeaders(extraHeaders));
	    };
	    /**
	     * Hangup call
	     * @param {[id:string]:string} extraHeaders Optional custom parameters (SIP headers) that should be sent after disconnecting/cancelling call. Parameter names must start with "X-" to be processed by application
	     */
	    Call.prototype.hangup = function (extraHeaders) {
	        if (this._state == CallState.CONNECTED || this._state == CallState.UPDATING || this._state == CallState.PROGRESSING) VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.disconnectCall, this._id, CallManager_1.CallManager.cleanHeaders(extraHeaders));else if (this._state == CallState.ALERTING) VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.rejectCall, this._id, true, CallManager_1.CallManager.cleanHeaders(extraHeaders));else throw new Error("WRONG_CALL_STATE");
	    };
	    /**
	     * Send tone (DTMF)
	     * @param {String} key Send tone according to pressed key: 0-9 , * , #
	     */
	    Call.prototype.sendTone = function (key) {
	        this._peerConnection.sendDTMF(key);
	    };
	    /**
	     * Mute sound
	     */
	    Call.prototype.mutePlayback = function () {
	        UserMediaManager_1.UserMediaManager.updateMuteState(this._id, UserMediaManager_1.MediaDirection.REMOTE, false);
	    };
	    /**
	     * Mute microphone
	     */
	    Call.prototype.muteMicrophone = function () {
	        this.peerConnection.localStream.getAudioTracks().forEach(function (track) {
	            track.enabled = false;
	        });
	    };
	    /**
	     * Unmute sound
	     */
	    Call.prototype.unmutePlayback = function () {
	        UserMediaManager_1.UserMediaManager.updateMuteState(this._id, UserMediaManager_1.MediaDirection.REMOTE, true);
	    };
	    /**
	     * Unmute microphone
	     */
	    Call.prototype.unmuteMicrophone = function () {
	        this.peerConnection.localStream.getAudioTracks().forEach(function (track) {
	            track.enabled = true;
	        });
	    };
	    /**
	     * Show/hide remote party video
	     * @param {Boolean} [flag=true] Show/hide - true/false
	     */
	    Call.prototype.showRemoteVideo = function (flag) {
	        if (flag === void 0) {
	            flag = true;
	        }
	        if (typeof flag == "undefined") flag = true;
	        if (this.peerConnection.videoRenderer) this.peerConnection.videoRenderer.style.display = flag ? "block" : "none";
	    };
	    /**
	     * Set remote video position
	     * @name VoxImplant.Call.setRemoteVideoPosition
	     * @param {Number} x Horizontal position (px)
	     * @param {Number} y Vertical position (px)
	     * @function
	     * @hidden
	     */
	    Call.prototype.setRemoteVideoPosition = function (x, y) {
	        throw new Error("Deprecated: please use CSS to position '#voximplantcontainer' element");
	    };
	    /**
	     * Set remote video size
	     * @name VoxImplant.Call.setRemoteVideoSize
	     * @param {Number} width Width in pixels
	     * @param {Number} height Height in pixels
	     * @function
	     * @hidden
	     */
	    Call.prototype.setRemoteVideoSize = function (width, height) {
	        throw new Error("Deprecated: please use CSS to set size of '#voximplantcontainer' element");
	    };
	    /**
	     * Send Info (SIP INFO) message inside the call
	     * <br>
	     * You can receive this message by <a href="http://voximplant.com/docs/references/appengine/CallEvents.html#CallEvents_InfoReceived">VoxEngine CallEvents.InfoReceived</a> in our cloud.
	     * <br>
	     * You can receive this message by <a href="../enums/callevents.html#inforeceived">CallEvents.InfoReceived</a> in WebSDK on other side.
	     * @param {String} mimeType MIME type of the message
	     * @param {String} body Message content
	     * @param {[id:string]:string} extraHeaders Optional headers to be passed with the message
	     */
	    Call.prototype.sendInfo = function (mimeType, body, extraHeaders) {
	        var type,
	            subtype,
	            i = mimeType.indexOf('/');
	        if (i == -1) {
	            type = "application";
	            subtype = mimeType;
	        } else {
	            type = mimeType.substring(0, i);
	            subtype = mimeType.substring(i + 1);
	        }
	        //if (this._state != CallState.CONNECTED)
	        //    throw new Error("WRONG_CALL_STATE");
	        VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.sendSIPInfo, this._id, type, subtype, body, CallManager_1.CallManager.cleanHeaders(extraHeaders));
	    };
	    /**
	     * Send text message
	     * @param {String} msg Message text
	     */
	    Call.prototype.sendMessage = function (msg) {
	        this.sendInfo(Constants_1.Constants.ZINGAYA_IM_MIME_TYPE, msg, {});
	    };
	    /**
	     * Set video settings
	     * @param {VoxImplant.VideoSettings|VoxImplant.FlashVideoSettings} settings Video settings for current call
	     * @param {Function} [successCallback] Called in WebRTC mode if video settings were applied successfully
	     * @param {Function} [failedCallback] Called in WebRTC mode if video settings couldn't be applied
	     */
	    Call.prototype.setVideoSettings = function (settings, successCallback, failedCallback) {
	        //this.zingayaAPI().setConstraints(settings, successCallback, failedCallback, true);
	        UserMediaManager_1.UserMediaManager.get().setConstraints(settings, true).then(function (stream) {
	            if (typeof successCallback == "function") successCallback(stream);
	        }).catch(function (err) {
	            if (typeof failedCallback == "function") failedCallback(err);
	        });
	    };
	    /**
	     * Returns HTML video element's id for the call
	     */
	    Call.prototype.getVideoElementId = function () {
	        if (this.peerConnection && this._wiredRemote) {
	            var videoRender = this.peerConnection.videoRenderer;
	            return videoRender != null ? videoRender.id : null;
	        } else {
	            return null;
	        }
	    };
	    /**
	     * Register handler for specified event
	     * <br>
	     * Example:
	     * <script src="https://gist.github.com/irbisadm/5d4ceec909be7bbcb14361ee8bba5e6d.js"></script>
	     * @param {Function} event Event class (i.e. {<a href="../enums/callevents.html#connected">VoxImplant.CallEvents.Connected</a>). See <a href="../enums/callevents.html#connected">VoxImplant.CallEvents</a>
	     * @param {Function} handler Handler function. A single parameter is passed - object with event information
	     */
	    Call.prototype.addEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] == 'undefined') this.eventListeners[event] = [];
	        this.eventListeners[event].push(handler);
	    };
	    /**
	     * Register handler for specified event
	     * @param {Function} event Event class (i.e. <a href="../enums/callevents.html#connected">VoxImplant.CallEvents.Connected</a>). See <a href="../enums/callevents.html">VoxImplant.CallEvents</a>
	     * @param {Function} handler Handler function. A single parameter is passed - object with event information
	     */
	    Call.prototype.on = function (event, handler) {
	        this.addEventListener(event, handler);
	    };
	    /**
	     * Remove handler for specified event
	     * @param {Function} event Event class (i.e. <a href="../enums/callevents.html#connected">VoxImplant.CallEvents.Connected</a>). See <a href="../enums/callevents.html">VoxImplant.CallEvents</a>
	     * @param {Function} handler Handler function, if not specified all event handlers will be removed
	     */
	    Call.prototype.removeEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] == 'undefined') return;
	        if (typeof handler === "function") {
	            for (var i = 0; i < this.eventListeners[event].length; i++) {
	                if (this.eventListeners[event][i] == handler) {
	                    this.eventListeners[event].splice(i, 1);
	                    break;
	                }
	            }
	        } else {
	            this.eventListeners[event] = [];
	        }
	    };
	    /**
	     * Remove handler for specified event
	     * @param {Function} event Event class (i.e. {@link VoxImplant.CallEvents.Connected}). See {@link VoxImplant.CallEvents}
	     * @param {Function} handler Handler function, if not specified all event handlers will be removed
	     * @function
	     */
	    Call.prototype.off = function (event, handler) {
	        this.removeEventListener(event, handler);
	    };
	    /**
	     * @hidden
	     */
	    Call.prototype.dispatchEvent = function (e) {
	        var event = e.name;
	        if (event === CallEvents_1.CallEvents.Updated || event === CallEvents_1.CallEvents.UpdateFailed) {
	            this._state = CallState.CONNECTED;
	        }
	        if (event === CallEvents_1.CallEvents.Updated && this._renegotiationPromise !== null) {
	            if (e.result) this._renegotiationPromise.resolve(e);else this._renegotiationPromise.reject({ code: 20, call: this });
	            this._renegotiationPromise = null;
	        }
	        if (event === CallEvents_1.CallEvents.UpdateFailed && this._renegotiationPromise !== null) {
	            this._renegotiationPromise.reject(e);
	            this._renegotiationPromise = null;
	        }
	        if (event === CallEvents_1.CallEvents.Updated || event === CallEvents_1.CallEvents.UpdateFailed) {
	            this._renegotiationPromise = null;
	            this.runPendingReinvite();
	        }
	        if (typeof this.eventListeners[event] != 'undefined') {
	            for (var i = 0; i < this.eventListeners[event].length; i++) {
	                if (typeof this.eventListeners[event][i] == "function") {
	                    this.eventListeners[event][i](e);
	                }
	            }
	        }
	    };
	    /**
	     *
	     * @param validState
	     * @param functionName
	     * @returns {boolean}
	     * @hidden
	     */
	    Call.prototype.checkState = function (validState, functionName) {
	        if (validState) {
	            if (typeof validState != "string") {
	                var valid = false;
	                var validStateList = validState;
	                for (var i = 0; i < validStateList.length; i++) {
	                    if (validStateList[i] == this._state) {
	                        valid = true;
	                    }
	                }
	                if (!valid) {
	                    this.log.warning("Received " + functionName + " in invalid state " + this._state);
	                    return false;
	                }
	            } else if (this._state != validState) {
	                this.log.warning("Received " + functionName + " in invalid state " + this._state);
	                return false;
	            }
	        }
	        return true;
	    };
	    /**
	     * @hidden
	     * @param headers
	     * @param sdp
	     * @returns {boolean}
	     */
	    Call.prototype.onConnected = function (headers, sdp) {
	        var _this = this;
	        if (!this.checkState([CallState.PROGRESSING, CallState.ALERTING], "onConnected")) return false;
	        this._state = CallState.CONNECTED;
	        setTimeout(function () {
	            _this.dispatchEvent({ name: 'Connected', call: _this, headers: headers });
	        }, 800);
	        return true;
	    };
	    /**
	     * @hidden
	     * @param headers
	     * @param params
	     * @returns {boolean}
	     */
	    Call.prototype.onDisconnected = function (headers, params) {
	        if (!this.checkState([CallState.CONNECTED, CallState.ALERTING, CallState.PROGRESSING, CallState.UPDATING], "onDisconnected")) return false;
	        this._state = CallState.ENDED;
	        this.dispatchEvent({ name: 'Disconnected', call: this, headers: headers, params: params });
	        ReusableRenderer_1.ReusableRenderer.get().freeRendersByCallId(this._id);
	        return true;
	    };
	    /**
	     * @hidden
	     * @param code
	     * @param reason
	     * @param headers
	     * @returns {boolean}
	     */
	    Call.prototype.onFailed = function (code, reason, headers) {
	        // if (!this.checkState(CallState.PROGRESSING, "onFailed"))
	        //     return false;
	        this.dispatchEvent({ name: 'Failed', call: this, headers: headers, code: code, reason: reason });
	        this._state = CallState.ENDED;
	        ReusableRenderer_1.ReusableRenderer.get().freeRendersByCallId(this._id);
	        //this._promiseFunctions.reject({name: 'Failed', call: this, headers: headers, code: code, reason: reason});
	        return true;
	    };
	    /**
	     * @hidden
	     * @returns {boolean}
	     */
	    Call.prototype.onStopRinging = function () {
	        if (!this.checkState([CallState.PROGRESSING, CallState.CONNECTED], "onStopRinging")) return false;
	        this.dispatchEvent({ name: 'ProgressToneStop', call: this });
	        return true;
	    };
	    /**
	     * @hidden
	     * @returns {boolean}
	     */
	    Call.prototype.onRingOut = function () {
	        if (!this.checkState(CallState.PROGRESSING, "onRingOut")) return false;
	        this.dispatchEvent({ name: 'ProgressToneStart', call: this });
	        return true;
	    };
	    /**
	     * @hidden
	     * @returns {boolean}
	     */
	    Call.prototype.onTransferComplete = function () {
	        if (!this.checkState(CallState.CONNECTED, "onTransferComplete")) return false;
	        this.dispatchEvent({ name: 'TransferComplete', call: this });
	        return true;
	    };
	    /**
	     * @hidden
	     * @returns {boolean}
	     */
	    Call.prototype.onTransferFailed = function () {
	        if (!this.checkState(CallState.CONNECTED, "onTransferFailed")) return false;
	        this.dispatchEvent({ name: 'TransferFailed', call: this });
	        return true;
	    };
	    /**
	     * @hidden
	     * @param call
	     * @param type
	     * @param subType
	     * @param body
	     * @param headers
	     * @returns {boolean}
	     */
	    Call.prototype.onInfo = function (call, type, subType, body, headers) {
	        if (call.stateValue == CallState.CONNECTED || call.stateValue == CallState.PROGRESSING || call.stateValue == CallState.ALERTING) {
	            var mimeType = type + "/" + subType;
	            if (mimeType == Constants_1.Constants.ZINGAYA_IM_MIME_TYPE) {
	                this.dispatchEvent({ name: 'onSendMessage', call: this, text: body });
	            } else if (mimeType == Constants_1.Constants.P2P_SPD_FRAG_MIME_TYPE) {
	                var candidates = JSON.parse(body);
	                for (var i in candidates) {
	                    call.peerConnection.addRemoteCandidate(candidates[i][1], candidates[i][0]);
	                }
	            } else if (mimeType == Constants_1.Constants.VI_SPD_OFFER_MIME_TYPE) {
	                call.peerConnection.processRemoteOffer(body);
	            } else if (mimeType == Constants_1.Constants.VI_SPD_ANSWER_MIME_TYPE) {
	                call.peerConnection.processRemoteAnswer({}, body);
	            } else {
	                this.dispatchEvent({
	                    name: 'InfoReceived',
	                    call: this,
	                    body: body,
	                    headers: headers,
	                    mimeType: mimeType
	                });
	            }
	            return true;
	        } else {
	            this.log.warning("received handleSIPInfo for call: " + call.id() + " in invalid state: " + call.state());
	        }
	    };
	    Call.prototype.setActive = function (flag) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (!_this.signalingConnected) reject({ code: 11, call: _this });
	            if (BrowserSpecific_1.default.getWSVendor() === "firefox") {
	                _this.sendInfo(Constants_1.Constants.VI_HOLD_EMUL, JSON.stringify({ hold: !flag }));
	                resolve({ call: _this, result: true });
	                return;
	            }
	            if (_this._state === CallState.UPDATING) {
	                _this.addPendingReinvite({ action: "setActive", resolve: resolve, reject: reject, params: flag });
	            } else {
	                if (_this._state == CallState.CONNECTED) {
	                    _this._state = CallState.UPDATING;
	                    _this._active = flag;
	                    if (!flag) VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.hold, _this._id);else VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.unhold, _this._id);
	                    resolve({ result: true, call: _this });
	                } else {
	                    reject({ code: 11, call: _this });
	                }
	            }
	        });
	    };
	    Object.defineProperty(Call.prototype, "promise", {
	        /**
	         * @hidden
	         * @returns {Promise<Object>}
	         */
	        get: function () {
	            return this._promise;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Call.prototype, "peerConnection", {
	        /**
	         * @hidden
	         * @returns {PeerConnection}
	         */
	        get: function () {
	            return this._peerConnection;
	        },
	        /**
	         * @hidden
	         * @param peerConnection
	         */
	        set: function (peerConnection) {
	            this._peerConnection = peerConnection;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * @hidden
	     */
	    Call.prototype.checkCallMode = function (mode) {
	        return this._mode == mode;
	    };
	    /**
	     * @hidden
	     */
	    Call.prototype.canStartSendingCandidates = function () {
	        if (typeof this._peerConnection == "undefined") this._peerConnection = PCFactory_1.PCFactory.get().peerConnections[this._id];
	        this._peerConnection.canStartSendingCandidates();
	    };
	    ;
	    /**
	     * @hidden
	     */
	    Call.prototype.notifyICETimeout = function () {
	        this.dispatchEvent({ name: 'ICETimeout', call: this });
	    };
	    /**
	     *
	     * @param flag
	     */
	    Call.prototype.sendVideo = function (flag) {
	        if (this.videoDirections.sendVideo === flag) return;
	        return this.sendMedia(null, flag);
	    };
	    /**
	     * @hidden
	     */
	    Call.prototype.receiveVideo = function () {
	        var _this = this;
	        if (this.videoDirections.receiveVideo === true) return;
	        return new Promise(function (resolve, reject) {
	            _this.videoDirections.receiveVideo = true;
	            if (_this._state === CallState.UPDATING) _this.addPendingReinvite({ action: "receiveVideo", resolve: resolve, reject: reject, params: {} });else {
	                _this._state = CallState.UPDATING;
	                if (_this._renegotiationPromise !== null) {
	                    reject({ code: 12, call: _this });
	                }
	                _this._renegotiationPromise = { resolve: resolve, reject: reject };
	                _this._peerConnection._hdnFRS();
	            }
	        });
	    };
	    /**
	     * @hidden
	     * @param audio
	     * @param video
	     */
	    Call.prototype.sendMedia = function (audio, video) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (video != null) _this.videoDirections.sendVideo = video;
	            if (_this._state === CallState.UPDATING) _this.addPendingReinvite({ action: "sendMedia", resolve: resolve, reject: reject, params: { audio: audio, video: video } });else {
	                _this._state = CallState.UPDATING;
	                if (_this._renegotiationPromise !== null) {
	                    reject({ code: 12, call: _this });
	                }
	                _this._renegotiationPromise = { resolve: resolve, reject: reject };
	                var constraints = UserMediaManager_1.UserMediaManager.get().getConstrainWithSendFlag(audio, video);
	                _this.peerConnection.setVideoEnabled(_this.videoDirections);
	                UserMediaManager_1.UserMediaManager.get().getQueryMediaSilent(constraints).then(function (stream) {
	                    _this.peerConnection.bindLocalMedia(stream);
	                }).catch(function (e) {
	                    reject({ code: 13, call: _this, event: e });
	                });
	            }
	        });
	    };
	    // @LogManager.d_trace(LogCategory.CALL)
	    // public receiveVideo(flag:boolean): Promise<Updated>{
	    //     return new Promise((resolve,reject)=>{
	    //         if(this.videoDirections.receiveVideo != flag){
	    //             this.videoDirections = JSON.parse(JSON.stringify(this.videoDirections));
	    //             this.videoDirections.receiveVideo = flag;
	    //             if (this._state === CallState.UPDATING)
	    //                 this.addPendingReinvite(<pendingReinviteStruct>{action:"receiveVideo",resolve:resolve, reject:reject,params:{flag:flag}});
	    //             else{
	    //                 this._state = CallState.UPDATING;
	    //                 if (this._renegotiationPromise !== null) {
	    //                     reject(<UpdateFailed>{code: 12, call: this});
	    //                 }
	    //                 this._renegotiationPromise = {resolve: resolve, reject: reject};
	    //                 this.peerConnection.setVideoEnabled(this.videoDirections);
	    //
	    //             }
	    //         }else{
	    //             resolve();
	    //         }
	    //     })
	    // }
	    /**
	     * @hidden
	     * @param flag
	     */
	    Call.prototype.sendAudio = function (flag) {
	        return this.sendMedia(flag, null);
	    };
	    // New stream api
	    /**
	     * Get current PeerConnection LocalStream OR if set wiredLocal === false - try get newOne from UserMediaManager
	     * @hidden
	     */
	    Call.prototype.getLocalStream = function () {
	        var _this = this;
	        if (this._wiredLocal) return new Promise(function (resolve, reject) {
	            if (_this.peerConnection) resolve(_this.peerConnection.localStream);else reject(new Error('We have no PC for this call yet'));
	        });else return UserMediaManager_1.UserMediaManager.get().queryMedia();
	    };
	    /**
	     * @hidden
	     * @param stream
	     * @returns {Promise<void>|Promise}
	     */
	    Call.prototype.setLocalStream = function (stream) {
	        //TODO: Not implemented
	        return new Promise(function (resolve, reject) {
	            reject(new Error('Not implemented'));
	        });
	    };
	    /**
	     * @hidden
	     * @param domain
	     */
	    Call.prototype.shareScreen = function () {
	        var _this = this;
	        if (BrowserSpecific_1.default.isScreenSharingSupported) BrowserSpecific_1.default.getScreenMedia().then(function (media) {
	            _this.peerConnection._addMediaStream(media);
	        });else Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.CALL, 'SCREEN SHARING', Logger_1.LogLevel.WARNING, "Sorry, this browser does not support screen sharing.");
	    };
	    Call.prototype.stopSharingScreen = function () {
	        if (BrowserSpecific_1.default.isScreenSharingSupported) this.peerConnection.stopSharing();else Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.CALL, 'SCREEN SHARING', Logger_1.LogLevel.WARNING, "Sorry, this browser does not support screen sharing.");
	    };
	    /**
	     * @hidden
	     * @param stream
	     */
	    Call.prototype.addLocalStream = function (stream) {
	        this.peerConnection._addMediaStream(stream);
	    };
	    /**
	     * @hidden
	     * @returns {Promise<void>|Promise}
	     */
	    Call.prototype.wireRemoteStream = function () {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (_this.peerConnection) {
	                if (typeof _this.peerConnection.remoteStreams[0] != "undefined") {
	                    _this.peerConnection.wireRemoteStream(true).then(function () {
	                        _this._wiredRemote = true;
	                        resolve();
	                    }).catch(reject);
	                } else reject(new Error('We have no remote MediaStream for this call yet'));
	            } else reject(new Error('We have no PC for this call yet'));
	        });
	    };
	    // TODO: fix if many streams
	    /**
	     * @hidden
	     * @returns {Promise<MediaStream>|Promise}
	     */
	    Call.prototype.getRemoteAudioStreams = function () {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (_this.peerConnection) {
	                if (typeof _this.peerConnection.remoteStreams[0] != "undefined" && _this.peerConnection.remoteStreams[0].getAudioTracks().length != 0) resolve(new MediaStream(_this.peerConnection.remoteStreams[0].getAudioTracks()));else reject(new Error('We have no remote MediaStream for this call yet'));
	            } else reject(new Error('We have no PC for this call yet'));
	        });
	    };
	    // TODO: fix if many streams
	    /**
	     * @hidden
	     * @returns {Promise<MediaStream>|Promise}
	     */
	    Call.prototype.getRemoteVideoStreams = function () {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (_this.peerConnection) {
	                if (typeof _this.peerConnection.remoteStreams[0] != "undefined" && _this.peerConnection.remoteStreams[0].getVideoTracks().length != 0) resolve(new MediaStream(_this.peerConnection.remoteStreams[0].getVideoTracks()));else reject(new Error('We have no remote MediaStream for this call yet'));
	            } else reject(new Error('We have no PC for this call yet'));
	        });
	    };
	    /**
	     * get wired state for remote audio streams
	     * @hidden
	     * @returns {boolean}
	     */
	    Call.prototype.getRemoteWiredState = function () {
	        return this._wiredRemote;
	    };
	    /**
	     * get wired state for local audio streams
	     * @hidden
	     * @returns {boolean}
	     */
	    Call.prototype.getLocalWiredState = function () {
	        return this._wiredLocal;
	    };
	    /**
	     * Use specified audio output , use <a href="#audiooutputs">audioOutputs</a> to get the list of available audio output
	     * @param {String} id Id of the audio source
	     */
	    Call.prototype.useAudioOutput = function (id) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (BrowserSpecific_1.default.getWSVendor(true) !== "chrome") reject(new Error("Unsupported browser. Only Google Chrome 49 and above."));
	            return _this.peerConnection.updateRenderersSink(id);
	        });
	    };
	    /**
	     * Returns HTML audio element's id for the audio call
	     * @returns string
	     */
	    Call.prototype.getAudioElementId = function () {
	        if (this._peerConnection.remoteStreams.length = 0) return null;
	        if (this._peerConnection.remoteStreams[0].getAudioTracks().length = 0) return null;
	        return this._peerConnection.remoteStreams[0].getAudioTracks()[0].id;
	    };
	    /**
	     * For testing and debug
	     * @hidden
	     */
	    Call.prototype.getDirections = function () {
	        if (typeof this.peerConnection !== "undefined") return this.peerConnection.getDirections();
	    };
	    /**
	     * For testing and debug
	     * @hidden
	     */
	    Call.prototype.getStreamActivity = function () {
	        return {};
	        // if(typeof this.peerConnection !=="undefined")
	        //     return this.peerConnection.getStreamActivity();
	    };
	    /**
	     * @hidden
	     */
	    Call.prototype.hdnFRS = function () {
	        this.peerConnection._hdnFRS();
	    };
	    /**
	     * @hidden
	     */
	    Call.prototype.hdnFRSPrep = function () {
	        var _this = this;
	        if (typeof this.peerConnection !== "undefined") this.peerConnection._hdnFRSPrep();else setTimeout(function () {
	            _this.hdnFRSPrep();
	        }, 1000);
	    };
	    /**
	     * @hidden
	     * @param headers
	     * @param sdp
	     */
	    Call.prototype.runIncomingReInvite = function (headers, sdp) {
	        if (this._state === CallState.UPDATING) {
	            this.dispatchEvent({ code: 11, call: this });
	        } else {
	            this._state = CallState.UPDATING;
	            var hasVideo = CallManager_1.CallManager.get().isSDPHasVideo(sdp);
	            this.peerConnection.handleReinvite(headers, sdp, hasVideo);
	        }
	    };
	    Call.prototype.addPendingReinvite = function (item) {
	        if (this.pendingReinvites.length > 5) {
	            this.log.info('Update queue overflow.');
	        }
	        this.pendingReinvites.push(item);
	    };
	    /**
	     * @hidden
	     */
	    Call.prototype.runPendingReinvite = function () {
	        var _this = this;
	        if (this.pendingReinvites.length === 0) return;
	        var workReinvite = this.pendingReinvites.splice(0, 1)[0];
	        setTimeout(function () {
	            switch (workReinvite.action) {
	                case 'runIncomingReInvite':
	                    _this.runIncomingReInvite(workReinvite.params.headers, workReinvite.params.sdp);
	                    break;
	                case "setActive":
	                    _this.setActive(workReinvite.params).then(function () {
	                        return workReinvite.resolve();
	                    }).catch(function () {
	                        return workReinvite.reject();
	                    });
	                    break;
	                case "sendMedia":
	                    _this.sendMedia(workReinvite.params.audio, workReinvite.params.video).then(function () {
	                        return workReinvite.resolve();
	                    }).catch(function () {
	                        return workReinvite.reject();
	                    });
	                    break;
	                case "receiveVideo":
	                    _this.receiveVideo().then(function () {
	                        return workReinvite.resolve();
	                    }).catch(function () {
	                        return workReinvite.reject();
	                    });
	                    break;
	            }
	        }, 800);
	    };
	    /**
	     * @hidden
	     * @param state
	     */
	    Call.prototype.setActiveForce = function (state) {
	        this._active = state;
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "id", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "number", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "displayName", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "headers", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "active", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "state", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "answer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "decline", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "reject", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "hangup", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "sendTone", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "mutePlayback", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "muteMicrophone", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "unmutePlayback", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "unmuteMicrophone", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "showRemoteVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "setRemoteVideoPosition", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "setRemoteVideoSize", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "sendInfo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "sendMessage", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "setVideoSettings", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "getVideoElementId", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "addEventListener", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "on", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "removeEventListener", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "off", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "dispatchEvent", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "checkState", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onConnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onDisconnected", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onStopRinging", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onRingOut", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onTransferComplete", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onTransferFailed", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "onInfo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "setActive", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "checkCallMode", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "canStartSendingCandidates", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "notifyICETimeout", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "sendVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "receiveVideo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "sendAudio", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "getLocalStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "setLocalStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "addLocalStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "wireRemoteStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "getRemoteAudioStreams", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "getRemoteVideoStreams", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "getRemoteWiredState", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], Call.prototype, "getLocalWiredState", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "useAudioOutput", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "getAudioElementId", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "getDirections", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "getStreamActivity", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "hdnFRS", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "hdnFRSPrep", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "runIncomingReInvite", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "addPendingReinvite", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "runPendingReinvite", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CLIENT)], Call.prototype, "setActiveForce", null);
	    return Call;
	}();
	exports.Call = Call;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 *
	 */
	
	(function (CallEvents) {
	    CallEvents[CallEvents["Connected"] = "Connected"] = "Connected";
	    CallEvents[CallEvents["Disconnected"] = "Disconnected"] = "Disconnected";
	    CallEvents[CallEvents["Failed"] = "Failed"] = "Failed";
	    CallEvents[CallEvents["ProgressToneStart"] = "ProgressToneStart"] = "ProgressToneStart";
	    CallEvents[CallEvents["ProgressToneStop"] = "ProgressToneStop"] = "ProgressToneStop";
	    CallEvents[CallEvents["MessageReceived"] = "onSendMessage"] = "MessageReceived";
	    CallEvents[CallEvents["InfoReceived"] = "InfoReceived"] = "InfoReceived";
	    CallEvents[CallEvents["TransferComplete"] = "TransferComplete"] = "TransferComplete";
	    CallEvents[CallEvents["TransferFailed"] = "TransferFailed"] = "TransferFailed";
	    CallEvents[CallEvents["ICETimeout"] = "ICETimeout"] = "ICETimeout";
	    CallEvents[CallEvents["RTCStatsReceived"] = "RTCStatsReceived"] = "RTCStatsReceived";
	    CallEvents[CallEvents["MediaElementCreated"] = "MediaElementCreated"] = "MediaElementCreated";
	    CallEvents[CallEvents["VideoPlaybackStarted"] = "VideoPlaybackStarted"] = "VideoPlaybackStarted";
	    CallEvents[CallEvents["ICECompleted"] = "ICECompleted"] = "ICECompleted";
	    CallEvents[CallEvents["Updated"] = "Updated"] = "Updated";
	    CallEvents[CallEvents["PendingUpdate"] = "PendingUpdate"] = "PendingUpdate";
	    CallEvents[CallEvents["UpdateFailed"] = "UpdateFailed"] = "UpdateFailed";
	})(exports.CallEvents || (exports.CallEvents = {}));
	var CallEvents = exports.CallEvents;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * @hidden
	 */
	
	var Constants = function () {
	    function Constants() {}
	    Constants.DIRECT_CALL_HEADER = "X-DirectCall";
	    Constants.VIAMEDIA_CALL_HEADER = "X-ViaMedia";
	    Constants.CALLSTATSIOID_HEADER = "X-CallstatsIOID";
	    Constants.CALL_DATA_HEADER = "VI-CallData";
	    Constants.ZINGAYA_IM_MIME_TYPE = "application/zingaya-im";
	    Constants.P2P_SPD_FRAG_MIME_TYPE = "voximplant/sdpfrag";
	    Constants.VI_HOLD_EMUL = "vi/holdemul";
	    Constants.VI_SPD_OFFER_MIME_TYPE = "vi/sdpoffer";
	    Constants.VI_SPD_ANSWER_MIME_TYPE = "vi/sdpanswer";
	    return Constants;
	}();
	exports.Constants = Constants;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Enum for callRemoteFunction
	 *
	 * @author Igor Sheko
	 * @hidden
	 */
	
	(function (RemoteFunction) {
	    RemoteFunction[RemoteFunction["ping"] = "__ping"] = "ping";
	    RemoteFunction[RemoteFunction["login"] = "login"] = "login";
	    RemoteFunction[RemoteFunction["loginGenerateOneTimeKey"] = "loginGenerateOneTimeKey"] = "loginGenerateOneTimeKey";
	    RemoteFunction[RemoteFunction["loginStage2"] = "loginStage2"] = "loginStage2";
	    RemoteFunction[RemoteFunction["setOperatorACDStatus"] = "setOperatorACDStatus"] = "setOperatorACDStatus";
	    RemoteFunction[RemoteFunction["setDesiredVideoBandwidth"] = "setDesiredVideoBandwidth"] = "setDesiredVideoBandwidth";
	    RemoteFunction[RemoteFunction["rejectCall"] = "rejectCall"] = "rejectCall";
	    RemoteFunction[RemoteFunction["disconnectCall"] = "disconnectCall"] = "disconnectCall";
	    RemoteFunction[RemoteFunction["sendDTMF"] = "sendDTMF"] = "sendDTMF";
	    RemoteFunction[RemoteFunction["sendSIPInfo"] = "sendSIPInfo"] = "sendSIPInfo";
	    RemoteFunction[RemoteFunction["hold"] = "hold"] = "hold";
	    RemoteFunction[RemoteFunction["unhold"] = "unhold"] = "unhold";
	    RemoteFunction[RemoteFunction["acceptCall"] = "acceptCall"] = "acceptCall";
	    RemoteFunction[RemoteFunction["createCall"] = "createCall"] = "createCall";
	    RemoteFunction[RemoteFunction["transferCall"] = "transferCall"] = "transferCall";
	    RemoteFunction[RemoteFunction["muteLocal"] = "__muteLocal"] = "muteLocal";
	    RemoteFunction[RemoteFunction["reInvite"] = "ReInvite"] = "reInvite";
	    RemoteFunction[RemoteFunction["acceptReInvite"] = "AcceptReInvite"] = "acceptReInvite";
	    RemoteFunction[RemoteFunction["confirmPC"] = "__confirmPC"] = "confirmPC";
	    RemoteFunction[RemoteFunction["addCandidate"] = "__addCandidate"] = "addCandidate";
	    RemoteFunction[RemoteFunction["loginUsingOneTimeKey"] = "loginUsingOneTimeKey"] = "loginUsingOneTimeKey";
	    RemoteFunction[RemoteFunction["refreshOauthToken"] = "refreshOauthToken"] = "refreshOauthToken";
	    //    =========================Legacy ZAPI
	    RemoteFunction[RemoteFunction["zPromptFinished"] = "promptFinished"] = "zPromptFinished";
	    RemoteFunction[RemoteFunction["zStartPreFlightCheck"] = "__startPreFlightCheck"] = "zStartPreFlightCheck";
	    //    =========================Legacy ZAPI
	    //    =========================Push service
	    RemoteFunction[RemoteFunction["registerPushToken"] = "registerPushToken"] = "registerPushToken";
	    RemoteFunction[RemoteFunction["unregisterPushToken"] = "unregisterPushToken"] = "unregisterPushToken";
	    RemoteFunction[RemoteFunction["pushFeedback"] = "pushFeedback"] = "pushFeedback";
	})(exports.RemoteFunction || (exports.RemoteFunction = {}));
	var RemoteFunction = exports.RemoteFunction;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var BrowserSpecific_1 = __webpack_require__(7);
	var Logger_1 = __webpack_require__(4);
	/**
	 * @hidden
	 */
	var ReusableStructure = function () {
	    function ReusableStructure(kind) {
	        this.kind = kind;
	        this.inUse = false;
	        this.track = null;
	        this.callId = null;
	    }
	    // public attach(track:MediaStreamTrack,direction:"local"|"remote"){
	    ReusableStructure.prototype.attach = function (track, direction) {
	        BrowserSpecific_1.default.attachMedia(new MediaStream([track]), this.element);
	        this.direction = direction;
	    };
	    ReusableStructure.prototype.free = function () {
	        BrowserSpecific_1.default.detachMedia(this.element);
	        this.inUse = false;
	        this.track = null;
	        this.callId = null;
	    };
	    return ReusableStructure;
	}();
	exports.ReusableStructure = ReusableStructure;
	/**
	 * Singleton that provides audio/video rendering
	 * Reuses audio/video elements
	 * @hidden
	 */
	var ReusableRenderer = function () {
	    function ReusableRenderer() {
	        this.elementList = new Array();
	        this.log = Logger_1.LogManager.get().createLogger(Logger_1.LogCategory.RTC, "Renderer");
	    }
	    ReusableRenderer.get = function () {
	        if (!this.inst) this.inst = new ReusableRenderer();
	        return this.inst;
	    };
	    // private getFreeElements(kind:"all"|"video"|"audio"):Array<ReusableStructure>{
	    ReusableRenderer.prototype.getFreeElements = function (kind) {
	        return this.elementList.filter(function (el) {
	            if (el.inUse && (kind == "all" || kind == el.kind)) return true;
	        });
	    };
	    // public catchRender(track:MediaStreamTrack,callId:number,direction:"local"|"remote"):HTMLMediaElement{
	    ReusableRenderer.prototype.catchRender = function (track, callId, direction) {
	        var freeTracks = this.getFreeElements(track.kind);
	        var activeTrack;
	        if (freeTracks.length) {
	            activeTrack = freeTracks[0];
	        } else {
	            activeTrack = new ReusableStructure(track.kind);
	            this.elementList.push(activeTrack);
	        }
	        activeTrack.inUse = true;
	        activeTrack.track = track;
	        activeTrack.callId = callId;
	        activeTrack.attach(track, direction);
	        return activeTrack.element;
	    };
	    // public catchRenders(stream:MediaStream,callId:number,direction:"local"|"remote"):Array<HTMLMediaElement>{
	    ReusableRenderer.prototype.catchRenders = function (stream, callId, direction) {
	        var tracks = stream.getTracks();
	        var renderers = [];
	        for (var i = 0; i < tracks.length; i++) {
	            renderers.push(this.catchRender(tracks[i], callId, direction));
	        }
	        return renderers;
	    };
	    // public freeRendersByCallId(callId:string,direction:"local"|"remote"|"all"="all"){
	    ReusableRenderer.prototype.freeRendersByCallId = function (callId, direction) {
	        if (direction === void 0) {
	            direction = "all";
	        }
	        this.elementList.map(function (el) {
	            if (el.callId == callId && (direction == "all" || direction == el.direction)) el.free();
	        });
	    };
	    ReusableRenderer.prototype.freeRenderByTrack = function (track) {
	        this.elementList.map(function (el) {
	            if (el.track.id == track.id) el.free();
	        });
	    };
	    // public getRendererByCallId(callId:string,direction:"local"|"remote"|"all"="all"){
	    ReusableRenderer.prototype.getRendererByCallId = function (callId, direction) {
	        if (direction === void 0) {
	            direction = "all";
	        }
	        this.elementList.filter(function (el) {
	            if (el.callId == callId && (direction == "all" || direction == el.direction)) return true;
	        });
	    };
	    return ReusableRenderer;
	}();
	exports.ReusableRenderer = ReusableRenderer;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __extends = this && this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Call_1 = __webpack_require__(17);
	var VoxSignaling_1 = __webpack_require__(6);
	var CallManager_1 = __webpack_require__(16);
	var Logger_1 = __webpack_require__(4);
	var RemoteFunction_1 = __webpack_require__(20);
	/**
	 * @hidden
	 */
	var CallExServer = function (_super) {
	    __extends(CallExServer, _super);
	    function CallExServer(id, dn, incoming, settings) {
	        _super.call(this, id, dn, incoming, settings);
	        this._mode = Call_1.CallMode.SERVER;
	    }
	    CallExServer.prototype.answer = function (customData, extraHeaders) {
	        _super.prototype.answer.call(this, customData, extraHeaders);
	        var extra = { tracks: this.peerConnection.getTrackKind() };
	        VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.acceptCall, this._id, CallManager_1.CallManager.cleanHeaders(extraHeaders), extra);
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLEXSERVER)], CallExServer.prototype, "answer", null);
	    return CallExServer;
	}(Call_1.Call);
	exports.CallExServer = CallExServer;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __extends = this && this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Call_1 = __webpack_require__(17);
	var VoxSignaling_1 = __webpack_require__(6);
	var Logger_1 = __webpack_require__(4);
	var UserMediaManager_1 = __webpack_require__(11);
	var RemoteFunction_1 = __webpack_require__(20);
	var Constants_1 = __webpack_require__(19);
	/**
	 * @hidden
	 */
	var CallExP2P = function (_super) {
	    __extends(CallExP2P, _super);
	    function CallExP2P() {
	        _super.apply(this, arguments);
	    }
	    CallExP2P.prototype.answer = function (customData, extraHeaders, useVideo) {
	        var _this = this;
	        _super.prototype.answer.call(this, customData, extraHeaders);
	        if (typeof customData != 'undefined') {
	            if (typeof extraHeaders == 'undefined') extraHeaders = {};
	            extraHeaders[Constants_1.Constants.CALL_DATA_HEADER] = customData;
	        }
	        var uMedia = UserMediaManager_1.UserMediaManager.get();
	        if (typeof useVideo == "undefined") uMedia.attachTo(this._peerConnection);else if (!useVideo.sendVideo) {
	            uMedia.attachToSound(this._peerConnection);
	        } else {
	            uMedia.attachTo(this._peerConnection);
	        }
	        this._peerConnection.getLocalAnswer().then(function (activeLocalSD) {
	            VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.acceptCall, _this.id(), extraHeaders, activeLocalSD.sdp);
	        });
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALLEXP2P)], CallExP2P.prototype, "answer", null);
	    return CallExP2P;
	}(Call_1.Call);
	exports.CallExP2P = CallExP2P;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Enum for handle remote events
	 * @hidden
	 */
	
	(function (RemoteEvent) {
	    RemoteEvent[RemoteEvent["loginFailed"] = "loginFailed"] = "loginFailed";
	    RemoteEvent[RemoteEvent["loginSuccessful"] = "loginSuccessful"] = "loginSuccessful";
	    RemoteEvent[RemoteEvent["handleError"] = "handleError"] = "handleError";
	    RemoteEvent[RemoteEvent["onPCStats"] = "__onPCStats"] = "onPCStats";
	    RemoteEvent[RemoteEvent["handleIncomingConnection"] = "handleIncomingConnection"] = "handleIncomingConnection";
	    RemoteEvent[RemoteEvent["handleConnectionConnected"] = "handleConnectionConnected"] = "handleConnectionConnected";
	    RemoteEvent[RemoteEvent["handleConnectionDisconnected"] = "handleConnectionDisconnected"] = "handleConnectionDisconnected";
	    RemoteEvent[RemoteEvent["handleRingOut"] = "handleRingOut"] = "handleRingOut";
	    RemoteEvent[RemoteEvent["startEarlyMedia"] = "startEarlyMedia"] = "startEarlyMedia";
	    RemoteEvent[RemoteEvent["stopRinging"] = "stopRinging"] = "stopRinging";
	    RemoteEvent[RemoteEvent["handleConnectionFailed"] = "handleConnectionFailed"] = "handleConnectionFailed";
	    RemoteEvent[RemoteEvent["handleSIPInfo"] = "handleSIPInfo"] = "handleSIPInfo";
	    RemoteEvent[RemoteEvent["handleSipEvent"] = "handleSipEvent"] = "handleSipEvent";
	    RemoteEvent[RemoteEvent["handleTransferStarted"] = "handleTransferStarted"] = "handleTransferStarted";
	    RemoteEvent[RemoteEvent["handleTransferComplete"] = "handleTransferComplete"] = "handleTransferComplete";
	    RemoteEvent[RemoteEvent["handleTransferFailed"] = "handleTransferFailed"] = "handleTransferFailed";
	    RemoteEvent[RemoteEvent["handleReInvite"] = "handleReInvite"] = "handleReInvite";
	    RemoteEvent[RemoteEvent["handleAcceptReinvite"] = "handleAcceptReinvite"] = "handleAcceptReinvite";
	    RemoteEvent[RemoteEvent["handleRejectReinvite"] = "handleRejectReinvite"] = "handleRejectReinvite";
	    RemoteEvent[RemoteEvent["createPC"] = "__createPC"] = "createPC";
	    RemoteEvent[RemoteEvent["destroyPC"] = "__destroyPC"] = "destroyPC";
	    RemoteEvent[RemoteEvent["connectionSuccessful"] = "__connectionSuccessful"] = "connectionSuccessful";
	    RemoteEvent[RemoteEvent["connectionFailed"] = "__connectionFailed"] = "connectionFailed";
	    RemoteEvent[RemoteEvent["createConnection"] = "__createConnection"] = "createConnection";
	    RemoteEvent[RemoteEvent["pong"] = "__pong"] = "pong";
	    RemoteEvent[RemoteEvent["increaseGain"] = "increaseGain"] = "increaseGain";
	    RemoteEvent[RemoteEvent["handlePreFlightCheckResult"] = "handlePreFlightCheckResult"] = "handlePreFlightCheckResult";
	    RemoteEvent[RemoteEvent["handleVoicemail"] = "handleVoicemail"] = "handleVoicemail";
	    RemoteEvent[RemoteEvent["onCallRemoteFunctionError"] = "onCallRemoteFunctionError"] = "onCallRemoteFunctionError";
	    RemoteEvent[RemoteEvent["refreshOauthTokenFailed"] = "refreshOauthTokenFailed"] = "refreshOauthTokenFailed";
	    RemoteEvent[RemoteEvent["refreshOauthTokenSuccessful"] = "refreshOauthTokenSuccessful"] = "refreshOauthTokenSuccessful";
	})(exports.RemoteEvent || (exports.RemoteEvent = {}));
	var RemoteEvent = exports.RemoteEvent;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __extends = this && this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Call_1 = __webpack_require__(17);
	var VoxSignaling_1 = __webpack_require__(6);
	var Logger_1 = __webpack_require__(4);
	var UserMediaManager_1 = __webpack_require__(11);
	var RemoteFunction_1 = __webpack_require__(20);
	var BrowserSpecific_1 = __webpack_require__(7);
	var Constants_1 = __webpack_require__(19);
	/**
	 * @hidden
	 */
	var CallExMedia = function (_super) {
	    __extends(CallExMedia, _super);
	    function CallExMedia() {
	        _super.apply(this, arguments);
	    }
	    CallExMedia.prototype.answer = function (customData, extraHeaders, useVideo) {
	        var _this = this;
	        _super.prototype.answer.call(this, customData, extraHeaders);
	        if (typeof customData != 'undefined') {
	            if (typeof extraHeaders == 'undefined') extraHeaders = {};
	            extraHeaders[Constants_1.Constants.CALL_DATA_HEADER] = customData;
	        }
	        var uMedia = UserMediaManager_1.UserMediaManager.get();
	        if (typeof useVideo == "undefined") uMedia.attachTo(this._peerConnection);else if (!useVideo.sendVideo) {
	            this._peerConnection.setVideoFlags(useVideo);
	            this.videoDirections = useVideo;
	            uMedia.attachToSound(this._peerConnection);
	        } else {
	            this._peerConnection.setVideoFlags(useVideo);
	            this.videoDirections = useVideo;
	            uMedia.attachTo(this._peerConnection);
	        }
	        this._peerConnection.getLocalAnswer().then(function (activeLocalSD) {
	            var extra = { tracks: _this.peerConnection.getTrackKind() };
	            VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.acceptCall, _this.id(), extraHeaders, activeLocalSD.sdp, extra);
	        });
	    };
	    /**
	     * New version of setActive function - attach/detach by changes in SDP
	     * @param newState
	     */
	    CallExMedia.prototype.setActive = function (newState) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (_this._state !== Call_1.CallState.CONNECTED) {
	                _this.addPendingReinvite({ action: "setActive", resolve: resolve, reject: reject, params: newState });
	                return;
	            } else {
	                if (_this._state === Call_1.CallState.UPDATING) {
	                    reject({ code: 11, call: _this });
	                } else {
	                    _this._state = Call_1.CallState.UPDATING;
	                    if (BrowserSpecific_1.default.getWSVendor() === "firefox") {
	                        _this.sendInfo(Constants_1.Constants.VI_HOLD_EMUL, JSON.stringify({ hold: !newState }));
	                    }
	                    if (_this._renegotiationPromise !== null) {
	                        reject({ code: 12, call: _this });
	                        return;
	                    }
	                    if (_this._active == newState) {
	                        reject({ code: 14, call: _this });
	                        return;
	                    }
	                    _this._active = newState;
	                    _this._renegotiationPromise = { resolve: resolve, reject: reject };
	                    _this.peerConnection.hold(!newState);
	                }
	            }
	        });
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], CallExMedia.prototype, "answer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.CALL)], CallExMedia.prototype, "setActive", null);
	    return CallExMedia;
	}(Call_1.Call);
	exports.CallExMedia = CallExMedia;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var Logger_1 = __webpack_require__(4);
	/**
	 * Created by irbisadm on 18/10/2016.
	 */
	/**
	 * @hidden
	 */
	(function (CallstatsIoFabricUsage) {
	    CallstatsIoFabricUsage[CallstatsIoFabricUsage["multiplex"] = "multiplex"] = "multiplex";
	    CallstatsIoFabricUsage[CallstatsIoFabricUsage["audio"] = "audio"] = "audio";
	    CallstatsIoFabricUsage[CallstatsIoFabricUsage["video"] = "video"] = "video";
	    CallstatsIoFabricUsage[CallstatsIoFabricUsage["screen"] = "screen"] = "screen";
	    CallstatsIoFabricUsage[CallstatsIoFabricUsage["data"] = "data"] = "data";
	    CallstatsIoFabricUsage[CallstatsIoFabricUsage["unbundled"] = "unbundled"] = "unbundled";
	})(exports.CallstatsIoFabricUsage || (exports.CallstatsIoFabricUsage = {}));
	var CallstatsIoFabricUsage = exports.CallstatsIoFabricUsage;
	/**
	 * @hidden
	 */
	(function (CallstatsIoFabricEvent) {
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["fabricHold"] = "fabricHold"] = "fabricHold";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["fabricResume"] = "fabricResume"] = "fabricResume";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["audioMute"] = "audioMute"] = "audioMute";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["audioUnmute"] = "audioUnmute"] = "audioUnmute";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["videoPause"] = "videoPause"] = "videoPause";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["videoResume"] = "videoResume"] = "videoResume";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["fabricTerminated"] = "fabricTerminated"] = "fabricTerminated";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["screenShareStart"] = "screenShareStart"] = "screenShareStart";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["screenShareStop"] = "screenShareStop"] = "screenShareStop";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["dominantSpeaker"] = "dominantSpeaker"] = "dominantSpeaker";
	    CallstatsIoFabricEvent[CallstatsIoFabricEvent["activeDeviceList"] = "activeDeviceList"] = "activeDeviceList";
	})(exports.CallstatsIoFabricEvent || (exports.CallstatsIoFabricEvent = {}));
	var CallstatsIoFabricEvent = exports.CallstatsIoFabricEvent;
	/**
	 * @hidden
	 */
	(function (CallstatsioWrtcFuncNames) {
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["getUserMedia"] = "getUserMedia"] = "getUserMedia";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["createOffer"] = "createOffer"] = "createOffer";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["createAnswer"] = "createAnswer"] = "createAnswer";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["setLocalDescription"] = "setLocalDescription"] = "setLocalDescription";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["setRemoteDescription"] = "setRemoteDescription"] = "setRemoteDescription";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["addIceCandidate"] = "addIceCandidate"] = "addIceCandidate";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["iceConnectionFailure"] = "iceConnectionFailure"] = "iceConnectionFailure";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["signalingError"] = "signalingError"] = "signalingError";
	    CallstatsioWrtcFuncNames[CallstatsioWrtcFuncNames["applicationLog"] = "applicationLog"] = "applicationLog";
	})(exports.CallstatsioWrtcFuncNames || (exports.CallstatsioWrtcFuncNames = {}));
	var CallstatsioWrtcFuncNames = exports.CallstatsioWrtcFuncNames;
	/**
	 * @hidden
	 */
	var CallstatsIo = function () {
	    function CallstatsIo(params) {
	        this._params = params;
	        this.inited = false;
	        this.pendingFabric = [];
	        var x_window = window;
	        if (typeof x_window.callstats != "undefined") this.callstats = new x_window.callstats(null, x_window.io);
	    }
	    CallstatsIo.isModuleEnabled = function () {
	        return CallstatsIo.moduleEnabled;
	    };
	    CallstatsIo.get = function (params) {
	        var x_window = window;
	        if (typeof x_window.callstats != "undefined") CallstatsIo.moduleEnabled = true;
	        if (typeof CallstatsIo.instance == "undefined") {
	            CallstatsIo.instance = new CallstatsIo(params);
	        }
	        if (typeof params != "undefined") {
	            CallstatsIo.instance._params = params;
	        }
	        return CallstatsIo.instance;
	    };
	    CallstatsIo.prototype.init = function (userId) {
	        var _this = this;
	        if (!CallstatsIo.moduleEnabled) return false;
	        Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.UTILS, "[CallstatsIo]", Logger_1.LogLevel.INFO, " Callstats.io SDK initialization start");
	        this.callstats.initialize(this._params.AppID, this._params.AppSecret, userId, function () {
	            Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.UTILS, "[CallstatsIo]", Logger_1.LogLevel.INFO, " Callstats.io SDK initialization successful");
	            _this.inited = true;
	            _this.pendingFabric.map(function (item) {
	                _this.callstats.addNewFabric(item.pc, item.remoteUser, item.fabricUsage, item.callID);
	            });
	        }, function () {}, this.packParams());
	        return true;
	    };
	    CallstatsIo.prototype.packParams = function () {
	        var ax = {};
	        if (this._params.disableBeforeUnloadHandler) ax['disableBeforeUnloadHandler'] = this._params.disableBeforeUnloadHandler;
	        if (this._params.applicationVersion) ax['applicationVersion'] = this._params.applicationVersion;
	        return ax;
	    };
	    CallstatsIo.prototype.addNewFabric = function (pc, remoteUser, fabricUsage, callID) {
	        if (!CallstatsIo.moduleEnabled) return false;
	        if (this.inited) {
	            Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.UTILS, "[CallstatsIo]", Logger_1.LogLevel.INFO, " Callstats.io addNewFabric");
	            this.callstats.addNewFabric(pc, remoteUser, fabricUsage, callID);
	        } else {
	            this.pendingFabric.push({ pc: pc, remoteUser: remoteUser, fabricUsage: fabricUsage, callID: callID });
	        }
	    };
	    CallstatsIo.prototype.sendFabricEvent = function (pc, fabricEvent, callID) {
	        if (!CallstatsIo.moduleEnabled) return false;
	        this.callstats.sendFabricEvent(pc, fabricEvent, callID);
	    };
	    CallstatsIo.prototype.reportError = function (pc, callID, wrtcFuncName, domError, localSDP, remoteSDP) {
	        if (!CallstatsIo.moduleEnabled) return false;
	        this.callstats.reportError(pc, callID, wrtcFuncName, domError, localSDP, remoteSDP);
	    };
	    CallstatsIo.moduleEnabled = false;
	    return CallstatsIo;
	}();
	exports.CallstatsIo = CallstatsIo;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var VoxSignaling_1 = __webpack_require__(6);
	var RemoteFunction_1 = __webpack_require__(20);
	/**
	 * @hidden
	 */
	var SignalingDTMFSender = function () {
	    function SignalingDTMFSender(_id) {
	        this._id = _id;
	    }
	    SignalingDTMFSender.prototype.insertDTMF = function (tones, duration, interToneGap) {
	        var _this = this;
	        tones.split('').forEach(function (key) {
	            return _this.sendKey(key);
	        });
	    };
	    SignalingDTMFSender.prototype.sendKey = function (key) {
	        var k;
	        if (key == '*') k = 10;else if (key == '#') k = 11;else {
	            k = parseInt(key);
	        }
	        if (k >= 0 || k <= 11) VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.sendDTMF, this._id, k);
	    };
	    return SignalingDTMFSender;
	}();
	exports.SignalingDTMFSender = SignalingDTMFSender;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var SignalingDTMFSender_1 = __webpack_require__(27);
	var Client_1 = __webpack_require__(1);
	/**
	 * @hidden
	 */
	var Webkit = function () {
	    function Webkit() {}
	    Webkit.attachStream = function (stream, element) {
	        if (element.srcObject) element.srcObject = stream;else element.src = URL.createObjectURL(stream);
	        element.load();
	        if (element instanceof HTMLVideoElement) element.play().catch(function (e) {});else {
	            element.play();
	            var sinkId = Client_1.Client.getInstance()._defaultSinkId;
	            if (sinkId != null) element.setSinkId(sinkId);
	        }
	    };
	    Webkit.detachStream = function (element) {
	        if (element instanceof HTMLVideoElement) {
	            var promice = element.pause();
	            if (typeof promice != "undefined") promice.catch(function (e) {});
	        } else element.pause();
	        element.src = "";
	    };
	    Webkit.getDTMFSender = function (pc, callId) {
	        if (!!pc.createDTMFSender) {
	            var audioTracks_1 = [];
	            pc.getLocalStreams().forEach(function (stream) {
	                stream.getAudioTracks().forEach(function (track) {
	                    audioTracks_1.push(track);
	                });
	            });
	            if (audioTracks_1.length) {
	                return pc.createDTMFSender(audioTracks_1[0]);
	            }
	        } else return new SignalingDTMFSender_1.SignalingDTMFSender(callId);
	    };
	    Webkit.getScreenMedia = function () {
	        return new Promise(function (resolve, reject) {
	            window.postMessage('get-sourceId', '*');
	            var listener = function (event) {
	                if (!event.data) return;
	                if (event.origin == window.location.origin) {
	                    if (event.data == 'PermissionDeniedError') {
	                        reject(new Error('PermissionDeniedError'));
	                    }
	                    if (typeof event.data != 'string' && typeof event.data.sourceId != "undefined") {
	                        window.removeEventListener('message', listener);
	                        var mediaParams = {
	                            audio: false,
	                            video: {
	                                mandatory: {
	                                    chromeMediaSource: 'desktop',
	                                    maxWidth: screen.width > 1920 ? screen.width : 1920,
	                                    maxHeight: screen.height > 1080 ? screen.height : 1080,
	                                    chromeMediaSourceId: event.data.sourceId
	                                },
	                                optional: [{
	                                    googTemporalLayeredScreencast: true
	                                }]
	                            }
	                        };
	                        navigator.mediaDevices.getUserMedia(mediaParams).then(function (stream) {
	                            resolve(stream);
	                        }).catch(function (e) {
	                            reject(e);
	                        });
	                    }
	                }
	            };
	            window.addEventListener('message', listener);
	        });
	    };
	    Webkit.onSharingResult = function (event) {};
	    Webkit.getRTCStats = function (pc) {
	        return new Promise(function (resolve, reject) {
	            var resultArray = [];
	            pc.getStats().then(function (e) {
	                e.forEach(function (result) {
	                    if (result.type == "ssrc") {
	                        var item = {};
	                        item.id = result.id;
	                        item.type = result.type;
	                        item.timestamp = result.timestamp;
	                        resultArray.push(item);
	                    }
	                });
	                resolve(resultArray);
	            }).catch(reject);
	        });
	    };
	    return Webkit;
	}();
	exports.Webkit = Webkit;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __extends = this && this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() {
	        this.constructor = d;
	    }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var PeerConnection_1 = __webpack_require__(14);
	var BrowserSpecific_1 = __webpack_require__(7);
	var UserMediaManager_1 = __webpack_require__(11);
	var Renderer_1 = __webpack_require__(15);
	var PCFactory_1 = __webpack_require__(13);
	var Logger_1 = __webpack_require__(4);
	var VoxSignaling_1 = __webpack_require__(6);
	var CallManager_1 = __webpack_require__(16);
	var RemoteFunction_1 = __webpack_require__(20);
	var CodecSorter_1 = __webpack_require__(30);
	var CallEvents_1 = __webpack_require__(18);
	var CallstatsIo_1 = __webpack_require__(26);
	var Constants_1 = __webpack_require__(19);
	var Updated = CallEvents_1.CallEvents.Updated;
	var SDPMuggle_1 = __webpack_require__(31);
	var Client_1 = __webpack_require__(1);
	var RTCSdpType;
	(function (RTCSdpType) {
	    RTCSdpType[RTCSdpType["offer"] = "offer"] = "offer";
	    RTCSdpType[RTCSdpType["answer"] = "answer"] = "answer";
	    RTCSdpType[RTCSdpType["pranswer"] = "pranswer"] = "pranswer";
	    RTCSdpType[RTCSdpType["rollback"] = "rollback"] = "rollback";
	})(RTCSdpType || (RTCSdpType = {}));
	var RTCIceRole;
	(function (RTCIceRole) {
	    RTCIceRole[RTCIceRole["controlling"] = "controlling"] = "controlling";
	    RTCIceRole[RTCIceRole["controlled"] = "controlled"] = "controlled";
	})(RTCIceRole || (RTCIceRole = {}));
	//WebRTC implementation of PeerConnection
	/**
	 * @hidden
	 */
	var WebRTCPC = function (_super) {
	    __extends(WebRTCPC, _super);
	    function WebRTCPC(id, mode, videoEnabled) {
	        var _this = this;
	        _super.call(this, id, mode, videoEnabled);
	        this.iceTimer = null;
	        this.needTransportRestart = true;
	        /**
	         * Max time to ICE
	         * @type {number}
	         */
	        this.ICE_TIMEOUT = 20000;
	        /**
	         * max renegotiation time
	         * @type {number}
	         */
	        this.RENEGOTIATION_TIMEOUT = 15000;
	        var cfg = PCFactory_1.PCFactory.get().iceConfig;
	        // this.impl = new RTCPeerConnection(cfg, {'optional': [{'DtlsSrtpKeyAgreement': 'true'}]});
	        // this.impl = new RTCPeerConnection(null, {'optional': [{'DtlsSrtpKeyAgreement': 'true'}]});
	        var xconf = cfg;
	        // if(xconf===null)
	        //    xconf = <RTCConfiguration>{gatherPolicy: "all", iceServers: []};
	        if (xconf !== null) xconf.rtcpMuxPolicy = "negotiate";else {
	            xconf = { gatherPolicy: "all", iceServers: [], rtcpMuxPolicy: "negotiate" };
	        }
	        this.impl = new RTCPeerConnection(xconf, { 'optional': [{ 'DtlsSrtpKeyAgreement': 'true' }] });
	        //this.impl = new RTCPeerConnection(<RTCConfiguration>{gatherPolicy: "all", iceServers: [{ "urls": ["turn:192.168.15.40:3478?transport=udp"], "username": "redmond", "credential": "redmond123" }]}, {'optional': [{'DtlsSrtpKeyAgreement': 'true'}]})
	        // FF 44 implementation
	        if (typeof this.impl.ontrack !== "undefined") {
	            this.impl.ontrack = function (e) {
	                return _this.onAddTrack(e);
	            };
	        } else if (typeof this.impl.onaddtrack !== "undefined") {
	            this.impl.onaddtrack = function (e) {
	                return _this.onAddTrack(e);
	            };
	        } else {
	            this.impl.onaddstream = function (e) {
	                return _this.onAddStream(e);
	            };
	        }
	        this.impl.onicecandidate = function (ev) {
	            _this.onICECandidate(ev["candidate"]);
	        };
	        this.rtpSenders = [];
	        this.renegotiationInProgress = false;
	        this.impl.onnegotiationneeded = function (e) {
	            return _this.onRenegotiation();
	        };
	        this.impl.onsignalingstatechange = function (e) {
	            return _this.onSignalingStateChange();
	        };
	        this.impl.oniceconnectionstatechange = function (e) {
	            return _this.onConnectionChange();
	        };
	        this.iceRole = RTCIceRole.controlling;
	        this._remoteStreams = [];
	        this.banReinviteAnswer = false;
	        this._call = CallManager_1.CallManager.get().calls[this.id];
	        //Check if call not active, set HOLD
	        if (typeof this._call != "undefined") this.onHold = !this._call.active();else this.onHold = false;
	        this.rtcCollectingCycle = setInterval(function () {
	            _this.getPCStats();
	        }, CallManager_1.CallManager.get().rtcStatsCollectionInterval);
	        // Callstats.io integration
	        if (typeof this._call !== "undefined") {
	            var CSIOID = this._call.headers()[Constants_1.Constants.CALLSTATSIOID_HEADER];
	            if (typeof CSIOID === "undefined") CSIOID = this._call.id();
	            CallstatsIo_1.CallstatsIo.get().addNewFabric(this.impl, this._call.number(), videoEnabled ? CallstatsIo_1.CallstatsIoFabricUsage.multiplex : CallstatsIo_1.CallstatsIoFabricUsage.audio, CSIOID);
	        }
	        this.needTransportRestart = false;
	    }
	    WebRTCPC.prototype.onSignalingStateChange = function () {
	        this.log.info("Signal state changed to " + this.impl.signalingState + " for PC:" + this.id);
	        if (this.impl.signalingState === "stable") {}
	    };
	    WebRTCPC.prototype.getPCStats = function () {
	        var _this = this;
	        BrowserSpecific_1.default.getRTCStats(this.impl).then(function (statistic) {
	            if (typeof _this._call !== "undefined") _this._call.dispatchEvent({ name: 'RTCStatsReceived', stats: statistic });
	        });
	    };
	    WebRTCPC.prototype.onConnectionChange = function () {
	        if (this.impl.iceConnectionState === "completed") {
	            if (typeof this._call !== "undefined") {
	                this._call.dispatchEvent({ name: 'ICECompleted', call: this._call });
	            }
	        }
	        if (this.impl.iceConnectionState === "completed" || this.impl.iceConnectionState === "connected") {
	            this.iceTimer && clearTimeout(this.iceTimer);
	            this.iceTimer = null;
	        }
	    };
	    /**
	     * Testing variant for renegotiation function
	     *
	     */
	    WebRTCPC.prototype.onRenegotiation = function () {
	        var _this = this;
	        if (typeof this.impl === "undefined") return;
	        if (this.impl.connectionState === "disconnected" || this.impl.connectionState === "failed") {
	            this.log.info("Renegotiation requested on closed PeerConnection");
	            return;
	        }
	        if (this.impl.localDescription === null) {
	            this.log.info("Renegotiation needed, but no local SD, skipping");
	            return;
	        }
	        if (this.impl.iceConnectionState !== "connected" && this.impl.iceConnectionState !== "completed") {
	            this.log.info("Renegotiation requested while ice state is " + this.impl.iceConnectionState + ". Postponing");
	            setTimeout(this.onRenegotiation, 100);
	            return;
	        }
	        if (this.renegotiationInProgress) {
	            this.log.info("Renegotiation in progress. Queueing");
	            return;
	        } else {
	            this.log.info("Renegotiation started");
	        }
	        if (this.renegotiationInProgress === false) {
	            this.renegotiationInProgress = true;
	            this.renegotiationTimer = setTimeout(function () {
	                clearTimeout(_this.renegotiationTimer);
	                _this._call.dispatchEvent({ name: Updated, result: false, call: _this._call });
	                _this.renegotiationInProgress = false;
	            }, this.RENEGOTIATION_TIMEOUT);
	            var offerOption = this.getReceiveOptions();
	            this.updateHoldState();
	            this.impl.createOffer(offerOption).then(function (sdp) {
	                sdp = PCFactory_1.PCFactory.get().addBandwidthParams(sdp);
	                sdp = SDPMuggle_1.SDPMuggle.removeTelephoneEvents(sdp);
	                sdp = SDPMuggle_1.SDPMuggle.removeDoubleOpus(sdp);
	                sdp = SDPMuggle_1.SDPMuggle.fixVideoRecieve(sdp, _this.videoEnabled.receiveVideo);
	                return sdp;
	            }).then(function (sdp) {
	                _this.srcLocalSDP = sdp.sdp;
	                _this.pendingOffer = sdp;
	                return sdp;
	            }).then(function () {
	                var extra = { tracks: _this._getTrackKind() };
	                VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.reInvite, _this._call.id(), {}, _this.pendingOffer.sdp, extra);
	            }).catch(function (e) {
	                _this.log.error("Error when renegatiation start " + e.message);
	            });
	        } else {
	            this.log.error("Another renegatiation in progress");
	        }
	    };
	    WebRTCPC.prototype.getReceiveOptions = function () {
	        return {
	            "offerToReceiveAudio": !this.onHold,
	            "offerToReceiveVideo": this.videoEnabled.receiveVideo && !this.onHold
	        };
	    };
	    WebRTCPC.prototype.updateHoldState = function () {
	        var _this = this;
	        this.impl.getLocalStreams().forEach(function (stream) {
	            stream.getTracks().forEach(function (track) {
	                track.enabled = !_this.onHold;
	            });
	        });
	        this.impl.getRemoteStreams().forEach(function (stream) {
	            stream.getTracks().forEach(function (track) {
	                track.enabled = !_this.onHold;
	            });
	        });
	    };
	    /**
	     * Callback to add new local candidates to send
	     * @param cand
	     */
	    WebRTCPC.prototype.onICECandidate = function (cand) {
	        if (cand && cand !== null) {
	            this.sendLocalCandidateToPeer("a=" + cand.candidate, cand.sdpMLineIndex);
	        } else {
	            this.log.info("End of candidates");
	        }
	    };
	    /**
	     * Callback to add new Track
	     * @param e
	     */
	    WebRTCPC.prototype.onAddTrack = function (e) {
	        var type = e.track.kind;
	        var newStream = new MediaStream([e.track]);
	        var renderer = this.renderStream(newStream, type);
	        if (type === "video" && typeof this.videoRendered === "undefined") this.videoRendered = renderer;else if (typeof this.audioRendered === "undefined") this.audioRendered = renderer;
	        this.updateHoldState();
	        this._remoteStreams.push(newStream);
	        this.renderers.push(renderer);
	        this.mapRenderer(newStream, renderer);
	    };
	    WebRTCPC.prototype.mapRenderer = function (stream, renderer) {
	        var _this = this;
	        stream.getTracks().forEach(function (track) {
	            track.onended = function () {
	                _this.checkStreamActive(stream, renderer);
	            };
	        });
	    };
	    WebRTCPC.prototype.checkStreamActive = function (stream, renderer) {
	        if (!stream.getTracks().some(function (item) {
	            return item.readyState === 'live';
	        })) {
	            Renderer_1.Renderer.get().releaseElement(renderer);
	        }
	    };
	    WebRTCPC.prototype.onAddStream = function (e) {
	        var type = UserMediaManager_1.UserMediaManager.getVideoTracks(e.stream).length ? "video" : "audio";
	        var renderer = this.renderStream(e.stream, type);
	        if (type === "video" && typeof this.videoRendered === "undefined") this.videoRendered = renderer;else if (typeof this.audioRendered === "undefined") this.audioRendered = renderer;
	        this.updateHoldState();
	        this._remoteStreams.push(e.stream);
	        this.renderers.push(renderer);
	        this.mapRenderer(e.stream, renderer);
	    };
	    WebRTCPC.prototype.renderStream = function (stream, type) {
	        var element = document.body;
	        var tracks = stream.getTracks();
	        if (type == "video" && typeof Client_1.Client.getInstance().remoteVideoContainerId !== "undefined") element = document.getElementById(Client_1.Client.getInstance().remoteVideoContainerId);
	        if (this.checkMediaAttached(type)) element = null;
	        var renderer = Renderer_1.Renderer.get().getElement(tracks[0].id, type === "video", element);
	        if (stream.oninactive) stream.oninactive(function () {
	            BrowserSpecific_1.default.detachMedia(renderer);
	        });
	        if (typeof this.sinkId !== "undefined") renderer.setSinkId(this.sinkId);
	        BrowserSpecific_1.default.attachMedia(stream, renderer);
	        if (typeof this._call !== "undefined") this._call.dispatchEvent({ name: CallEvents_1.CallEvents.MediaElementCreated, call: this._call, element: renderer, type: type });
	        return renderer;
	    };
	    WebRTCPC.prototype.checkMediaAttached = function (type) {
	        return this._remoteStreams.length > 0 && this._remoteStreams.reduce(function (last, item) {
	            if (type === "audio") return last && item.getAudioTracks().length > 0;else if (type === "video") return last && item.getVideoTracks().length > 0;else return last;
	        }, true);
	    };
	    WebRTCPC.prototype.wireRemoteStream = function (force) {
	        //TODO: Not implemented
	        return new Promise(function (resolve, reject) {
	            reject(new Error('Not implemented'));
	        });
	    };
	    WebRTCPC.prototype._processRemoteAnswer = function (headers, sdp) {
	        var _this = this;
	        this.iceTimer = setTimeout(function () {
	            _this._call.notifyICETimeout();
	        }, this.ICE_TIMEOUT);
	        this.pendingEvent = [headers, sdp];
	        if (this.impl.remoteDescription !== null) if (this.impl.remoteDescription.sdp != "") return;
	        var d = new RTCSessionDescription({ sdp: sdp, type: RTCSdpType.answer });
	        this.srcRemoteSDP = sdp;
	        d = SDPMuggle_1.SDPMuggle.removeTIAS(d);
	        return this.impl.setRemoteDescription(d);
	    };
	    WebRTCPC.prototype._getLocalOffer = function () {
	        var _this = this;
	        this.iceRole = RTCIceRole.controlling;
	        return new Promise(function (resolve, reject) {
	            var rtcOfferOptions = _this.getReceiveOptions();
	            _this.impl.createOffer(rtcOfferOptions).then(function (sdp) {
	                sdp = PCFactory_1.PCFactory.get().addBandwidthParams(sdp);
	                return _this.codecRearrange(sdp);
	            }).then(function (sdp) {
	                _this.srcLocalSDP = sdp.sdp;
	                return _this.impl.setLocalDescription(sdp);
	            }).then(function () {
	                resolve(_this.impl.localDescription);
	            }).catch(function (e) {
	                reject(e);
	            });
	        });
	    };
	    WebRTCPC.prototype._getLocalAnswer = function () {
	        var _this = this;
	        this.iceRole = RTCIceRole.controlled;
	        return new Promise(function (resolve, reject) {
	            var rtcAnswerOptions = { mandatory: _this.getReceiveOptions() };
	            _this.impl.createAnswer(rtcAnswerOptions).then(function (sdp) {
	                sdp = PCFactory_1.PCFactory.get().addBandwidthParams(sdp);
	                sdp = SDPMuggle_1.SDPMuggle.fixVideoRecieve(sdp, _this.videoEnabled.receiveVideo);
	                return _this.codecRearrange(sdp);
	            }).then(function (sdp) {
	                _this.srcLocalSDP = sdp.sdp;
	                return _this.impl.setLocalDescription(sdp);
	            }).then(function () {
	                resolve({ type: RTCSdpType.answer, sdp: _this.impl.localDescription.sdp });
	            }).catch(function (e) {
	                reject(e);
	            });
	        });
	    };
	    WebRTCPC.prototype._setRemoteDescription = function (sdp) {
	        var d = new RTCSessionDescription({ sdp: sdp, type: RTCSdpType.offer });
	        d = SDPMuggle_1.SDPMuggle.removeTIAS(d);
	        this.srcRemoteSDP = sdp;
	        return this.impl.setRemoteDescription(d);
	    };
	    WebRTCPC.prototype._processRemoteOffer = function (sdp) {
	        var _this = this;
	        this.iceRole = RTCIceRole.controlled;
	        return new Promise(function (resolve, reject) {
	            var d = new RTCSessionDescription({ sdp: sdp, type: RTCSdpType.offer });
	            _this.srcRemoteSDP = sdp;
	            d = SDPMuggle_1.SDPMuggle.removeTIAS(d);
	            _this.impl.setRemoteDescription(d).then(function () {
	                var rtcAnswerOptions = { mandatory: _this.getReceiveOptions() };
	                return _this.impl.createAnswer(rtcAnswerOptions);
	            }).then(function (sdp) {
	                return _this.codecRearrange(sdp);
	            }).then(function (sdp) {
	                _this.srcLocalSDP = sdp.sdp;
	                return _this.impl.setLocalDescription(sdp);
	            }).then(function () {
	                resolve(_this.impl.localDescription.sdp);
	            }).catch(function (e) {
	                reject(e);
	            });
	        });
	    };
	    /**
	     * Close curent PeerConnection
	     *
	     * @private
	     */
	    WebRTCPC.prototype._close = function () {
	        var _this = this;
	        clearInterval(this.rtcCollectingCycle);
	        this.impl.onnegotiationneeded = null;
	        if (this.impl.removeTrack) this.rtpSenders.forEach(function (sender) {
	            _this.impl.removeTrack(sender);
	        });else this.impl.getLocalStreams().forEach(function (stream) {
	            stream.getTracks().forEach(function (track) {
	                track.stop();
	                stream.removeTrack(track);
	            });
	            _this.impl.removeStream(stream);
	        });
	        if (this.impl.signalingState !== 'closed') {
	            this.impl.close();
	        }
	        if (typeof this._call !== "undefined") CallstatsIo_1.CallstatsIo.get().sendFabricEvent(this.impl, CallstatsIo_1.CallstatsIoFabricEvent.fabricTerminated, this._call.id());
	        this._localStream = null;
	        this._remoteStreams = null;
	        // this._unbindLocalMegia();
	        // this.renderers.forEach((item)=>{
	        //     Renderer.get().releaseElement(item);
	        // })
	    };
	    /**
	     * Add remote candidate from peer
	     *
	     * @param candidate
	     * @param mLineIndex
	     * @returns {Promise<void>}
	     * @private
	     */
	    WebRTCPC.prototype._addRemoteCandidate = function (candidate, mLineIndex) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            try {
	                _this.impl.addIceCandidate(new RTCIceCandidate({ candidate: candidate.substring(2), sdpMLineIndex: mLineIndex })).then(function () {
	                    resolve();
	                }).catch(function () {
	                    resolve();
	                });
	            } catch (e) {
	                resolve();
	            }
	        });
	    };
	    /**
	     * Bind local media to this PeerConnection
	     * and create native DTMFSender, if can
	     *
	     * @private
	     */
	    WebRTCPC.prototype._bindLocalMedia = function () {
	        var _this = this;
	        if (typeof this._localStream !== "undefined") {
	            if (typeof this.impl.removeTrack !== "undefined") {
	                this._localStream.getTracks().forEach(function (track) {
	                    _this.rtpSenders.push(_this.impl.addTrack(track, _this._localStream));
	                });
	            } else {
	                this.impl.addStream(this._localStream);
	            }
	            if (!!this._call) {
	                var newSender = BrowserSpecific_1.default.getDTMFSender(this.impl, this._call.id());
	                if (newSender) this.dtmfSender = newSender;
	            }
	            this.updateHoldState();
	        }
	    };
	    WebRTCPC.prototype._addMediaStream = function (stream) {
	        var _this = this;
	        if (typeof this.shareScreenMedia === "undefined") this.shareScreenMedia = [];
	        if (typeof this.shareScreenMediaTracks === "undefined") this.shareScreenMediaTracks = [];
	        this.shareScreenMedia.push(stream);
	        stream.getTracks().forEach(function (track) {
	            _this.shareScreenMediaTracks.push(track.id);
	        });
	        if (typeof this.impl.removeTrack !== "undefined") {
	            stream.getTracks().forEach(function (track) {
	                _this.rtpSenders.push(_this.impl.addTrack(track, _this._localStream));
	            });
	        } else {
	            this.impl.addStream(stream);
	        }
	    };
	    /**
	     * Unbind local media from this PeerConnection
	     *
	     * @private
	     */
	    WebRTCPC.prototype._unbindLocalMegia = function () {
	        var _this = this;
	        this.needTransportRestart = true;
	        if (typeof this.impl.removeTrack !== "undefined") {
	            this.rtpSenders.forEach(function (sender) {
	                if (_this.shareScreenMediaTracks) {
	                    if (_this.shareScreenMediaTracks.indexOf(sender.track.id) === -1) {
	                        _this.impl.removeTrack(sender);
	                    }
	                } else {
	                    _this.impl.removeTrack(sender);
	                }
	            });
	        } else {
	            this.impl.removeStream(this._localStream);
	        }
	        if (this._localStream) this._localStream.getTracks().forEach(function (track) {
	            track.stop();
	            _this._localStream.removeTrack(track);
	        });
	        this._localStream = null;
	    };
	    /**
	     * Action for ReInvite message from server
	     * if incoming sdp empty: start renegotiation - else create answer
	     *
	     * @author Igor Sheko
	     * @param headers
	     * @param sdp
	     * @returns {Promise<void>|Promise}
	     * @private
	     */
	    WebRTCPC.prototype._handleReinvite = function (headers, sdp) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (_this.banReinviteAnswer) {
	                reject();
	                return;
	            }
	            if (_this.renegotiationInProgress === false) {
	                _this.renegotiationInProgress = true;
	                var d = new RTCSessionDescription({ sdp: sdp, type: RTCSdpType.offer });
	                _this.srcRemoteSDP = sdp;
	                d = SDPMuggle_1.SDPMuggle.removeTIAS(d);
	                _this.impl.setRemoteDescription(d).then(function () {
	                    var rtcAnswerOptions = { mandatory: _this.getReceiveOptions() };
	                    return _this.impl.createAnswer(rtcAnswerOptions);
	                }).then(function (sdp) {
	                    sdp = SDPMuggle_1.SDPMuggle.removeDoubleOpus(sdp);
	                    sdp = SDPMuggle_1.SDPMuggle.fixVideoRecieve(sdp, _this.videoEnabled.receiveVideo);
	                    _this.srcLocalSDP = sdp.sdp;
	                    return _this.impl.setLocalDescription(sdp);
	                }).then(function () {
	                    var extra = { tracks: _this._getTrackKind() };
	                    VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.acceptReInvite, _this._call.id(), headers, _this.impl.localDescription.sdp, extra);
	                    _this.renegotiationInProgress = false;
	                    _this._call.dispatchEvent({ name: Updated, result: true, call: _this._call });
	                    _this.updateHoldState();
	                    resolve();
	                }).catch(function (e) {
	                    reject(e);
	                    _this.renegotiationInProgress = false;
	                });
	            } else if (_this.renegotiationInProgress === true) {
	                //get remoteAnswer
	                var d_1 = new RTCSessionDescription({ sdp: sdp, type: RTCSdpType.answer });
	                _this.renegotiationInProgress = false;
	                _this.srcRemoteSDP = sdp;
	                d_1 = SDPMuggle_1.SDPMuggle.removeTIAS(d_1);
	                _this.impl.setLocalDescription(_this.pendingOffer).then(function () {
	                    return _this.impl.setRemoteDescription(d_1);
	                }).then(function () {
	                    clearTimeout(_this.renegotiationTimer);
	                    _this._call.dispatchEvent({ name: Updated, result: true, call: _this._call });
	                    _this.updateHoldState();
	                    resolve();
	                }).catch(function (e) {
	                    clearTimeout(_this.renegotiationTimer);
	                    _this._call.dispatchEvent({ name: Updated, result: false, call: _this._call });
	                    _this.renegotiationInProgress = false;
	                    _this.log.error(JSON.stringify(e));
	                });
	            } else {
	                reject(new Error("Universe was broken!"));
	            }
	        });
	    };
	    /**
	     * Promise to rearrange codec by user
	     *
	     * @author Igor Sheko
	     * @param sdp
	     * @returns {Promise<RTCSessionDescription>|Promise}
	     */
	    WebRTCPC.prototype.codecRearrange = function (sdp) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            var call = CallManager_1.CallManager.get().calls[_this.id];
	            if (typeof call !== "undefined") {
	                var codecSorter_1 = new CodecSorter_1.CodecSorter(sdp.sdp);
	                var userCodecList = codecSorter_1.getUserCodecList();
	                if (typeof call.rearangeCodecs !== "undefined") {
	                    call.rearangeCodecs(userCodecList).then(function (newCodecList) {
	                        codecSorter_1.setUserCodecList(newCodecList);
	                        resolve({ type: sdp.type, sdp: codecSorter_1.getSDP() });
	                    }, function (e) {
	                        _this.log.error(JSON.stringify(e));
	                        reject(e);
	                    });
	                } else {
	                    _this.log.info("No sdp transformer registered");
	                    codecSorter_1.setUserCodecList(userCodecList);
	                    resolve({ type: sdp.type, sdp: codecSorter_1.getSDP() });
	                }
	            } else {
	                resolve(sdp);
	            }
	        });
	    };
	    /**
	     * Sed DTMF via WebRTC if can
	     *
	     * @author Igor Sheko
	     * @param key
	     * @param duration
	     * @param gap
	     * @private
	     */
	    WebRTCPC.prototype._sendDTMF = function (key, duration, gap) {
	        if (typeof this.dtmfSender !== "undefined") {
	            this.dtmfSender.insertDTMF(key, duration, gap);
	        }
	    };
	    /**
	     * Hold call by remove local stream and start renegotiation process
	     * Hold call by add local stream and start renegotiation process
	     * @param newState
	     * @returns {undefined}
	     * @private
	     */
	    WebRTCPC.prototype._hold = function (newState) {
	        CallstatsIo_1.CallstatsIo.get().sendFabricEvent(this.impl, newState ? CallstatsIo_1.CallstatsIoFabricEvent.fabricHold : CallstatsIo_1.CallstatsIoFabricEvent.fabricResume, this._call.id());
	        this.onHold = newState;
	        this.onRenegotiation();
	    };
	    WebRTCPC.prototype._getDirections = function () {
	        var directions = {};
	        directions['local'] = SDPMuggle_1.SDPMuggle.detectDirections(this.impl.localDescription.sdp);
	        directions['remote'] = SDPMuggle_1.SDPMuggle.detectDirections(this.impl.remoteDescription.sdp);
	        return directions;
	    };
	    WebRTCPC.prototype._getStreamActivity = function () {
	        var status = {};
	        status['local'] = this.getMediaActivity(this.impl.getLocalStreams());
	        status['remote'] = this.getMediaActivity(this.impl.getRemoteStreams());
	        return status;
	    };
	    WebRTCPC.prototype.getMediaActivity = function (streams) {
	        return streams.map(function (item) {
	            return item.getTracks().map(function (x_item) {
	                return {
	                    id: x_item.id,
	                    kind: x_item.kind,
	                    mutted: x_item.muted,
	                    active: x_item.enabled,
	                    label: x_item.label
	                };
	            });
	        });
	    };
	    WebRTCPC.prototype._hdnFRSPrep = function () {
	        this.banReinviteAnswer = true;
	    };
	    WebRTCPC.prototype._hdnFRS = function () {
	        this.renegotiationInProgress = false;
	        this.onRenegotiation();
	    };
	    WebRTCPC.prototype._getTrackKind = function () {
	        var _this = this;
	        var tracks = {};
	        this.impl.getLocalStreams().forEach(function (stream) {
	            stream.getTracks().forEach(function (track) {
	                if (track.kind !== "video") tracks[track.id] = track.kind;else if (_this.shareScreenMedia && _this.shareScreenMedia.some(function (sStream) {
	                    return sStream.getTracks().some(function (sTrack) {
	                        return sTrack.id === track.id;
	                    });
	                })) tracks[track.id] = "sharing";else tracks[track.id] = "video";
	            });
	        });
	        return tracks;
	    };
	    WebRTCPC.prototype._stopSharing = function () {
	        var _this = this;
	        if (typeof this.impl.removeTrack !== "undefined") {
	            this.impl.getSenders().forEach(function (sender) {
	                if (_this.shareScreenMediaTracks.indexOf(sender.track.id) !== -1) _this.impl.removeTrack(sender);
	            });
	        } else {
	            this.shareScreenMedia.forEach(function (stream) {
	                _this.impl.removeStream(stream);
	            });
	        }
	        this.shareScreenMedia.forEach(function (stream) {
	            stream.getTracks().forEach(function (track) {
	                track.stop();
	                stream.removeTrack(track);
	            });
	        });
	        this.shareScreenMediaTracks = [];
	        this.shareScreenMedia = [];
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "onSignalingStateChange", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "getPCStats", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "onConnectionChange", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "onRenegotiation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "onICECandidate", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "onAddTrack", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "onAddStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "wireRemoteStream", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_processRemoteAnswer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_getLocalOffer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_getLocalAnswer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_setRemoteDescription", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_processRemoteOffer", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_close", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_addRemoteCandidate", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_bindLocalMedia", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_unbindLocalMegia", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_handleReinvite", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "codecRearrange", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.RTC)], WebRTCPC.prototype, "_sendDTMF", null);
	    return WebRTCPC;
	}(PeerConnection_1.PeerConnection);
	exports.WebRTCPC = WebRTCPC;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	/**
	 * Created by irbisadm on 14/04/16.
	 */
	"use strict";
	/**
	 * @hidden
	 */
	
	var CodecSorter = function () {
	    function CodecSorter(sdp) {
	        this.originalSDP = sdp;
	    }
	    CodecSorter.splitSections = function (blob) {
	        var parts = blob.split('\nm=');
	        return parts.map(function (part, index) {
	            return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
	        });
	    };
	    ;
	    /**
	     * Parcing source sdp to inner codec list
	     *
	     * @autor Igor Sheko
	     * @returns {CodecSorterCodecList}
	     */
	    CodecSorter.prototype.getCodecList = function () {
	        this.originalCodecList = {
	            prefix: '',
	            sections: [],
	            sufix: ''
	        };
	        var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
	        var sections = CodecSorter.splitSections(this.originalSDP);
	        this.originalCodecList.prefix = sections[0];
	        for (var i = 1; i < sections.length; i++) {
	            var mediaCodec = {
	                kind: 'audio',
	                firstLine: '',
	                prefix: '',
	                sufix: '',
	                codec: []
	            };
	            var preparced = sections[i].split('\na=rtpmap');
	            preparced = preparced.map(function (part, index) {
	                return (index > 0 ? 'a=rtpmap' + part : part).trim() + '\r\n';
	            });
	            mediaCodec.prefix = preparced.shift();
	            var tempsufix = preparced.pop();
	            tempsufix = tempsufix.split(/(\r\n|\r|\n)/).filter(validLine);
	            var needparse = true;
	            preparced.push('');
	            while (needparse) {
	                needparse = false;
	                if (tempsufix.length !== 0) {
	                    var el = tempsufix.shift();
	                    if (el.indexOf('a=rtpmap') === 0 || el.indexOf('a=rtcp-fb') === 0 || el.indexOf('a=fmtp') === 0 || el.indexOf('a=x-caps') === 0 || el.indexOf('a=maxptime') === 0) {
	                        preparced[preparced.length - 1] += el + '\r\n';
	                        needparse = true;
	                    } else tempsufix.unshift(el);
	                }
	            }
	            for (var j = 0; j < preparced.length; j++) {
	                mediaCodec.codec.push(preparced[j].split(/(\r\n|\r|\n)/).filter(validLine));
	            }
	            var parsedPrefix = mediaCodec.prefix.split(/(\r\n|\r|\n)/).filter(validLine);
	            mediaCodec.firstLine = parsedPrefix.shift();
	            var firstLineSplited = mediaCodec.firstLine.split(' ');
	            firstLineSplited.splice(-1 * mediaCodec.codec.length, mediaCodec.codec.length);
	            mediaCodec.kind = firstLineSplited[0].substring(2);
	            mediaCodec.prefix = parsedPrefix.join('\r\n') + '\r\n';
	            mediaCodec.firstLine = firstLineSplited.join(' ');
	            if (tempsufix.length > 0) mediaCodec.sufix = tempsufix.join('\r\n') + '\r\n';
	            this.originalCodecList.sections.push(mediaCodec);
	        }
	        return this.originalCodecList;
	    };
	    /**
	     * Return user readable list of sections with list of codec inside
	     *
	     * @autor Igor Sheko
	     * @returns {CodecSorterUserCodecList}
	     */
	    CodecSorter.prototype.getUserCodecList = function () {
	        if (typeof this.originalCodecList === "undefined") this.getCodecList();
	        var userChL = {
	            sections: []
	        };
	        userChL.sections = this.originalCodecList.sections.filter(function (value) {
	            return value.kind === "video" || value.kind === "audio";
	        }).map(function (currentValue, index, array) {
	            var list = {
	                kind: currentValue.kind,
	                codec: currentValue.codec.map(function (item) {
	                    return CodecSorter.codecToUserCodec(item);
	                })
	            };
	            var resultArr = [];
	            for (var _i = 0, _a = list.codec; _i < _a.length; _i++) {
	                var item = _a[_i];
	                if (resultArr.indexOf(item) === -1) resultArr.push(item);
	            }
	            list.codec = resultArr;
	            return list;
	        });
	        return userChL;
	    };
	    CodecSorter.codecToUserCodec = function (item) {
	        var splited = item[0].split(' ');
	        splited.shift();
	        return splited.join(' ');
	    };
	    CodecSorter.prototype.setUserCodecList = function (userCL) {
	        if (typeof this.originalCodecList === "undefined") this.getCodecList();
	        for (var i = 0; i < userCL.sections.length; i++) {
	            for (var j = 0; j < this.originalCodecList.sections.length; j++) {
	                if (userCL.sections[i].kind === this.originalCodecList.sections[j].kind) {
	                    this.originalCodecList.sections[j].codec = CodecSorter.resortSection(userCL.sections[i].codec, this.originalCodecList.sections[j].codec);
	                }
	            }
	        }
	    };
	    CodecSorter.resortSection = function (userCodec, originalCodec) {
	        var newCodecs = [];
	        for (var i = 0; i < userCodec.length; i++) {
	            for (var j = 0; j < originalCodec.length; j++) {
	                if (userCodec[i] === CodecSorter.codecToUserCodec(originalCodec[j])) {
	                    newCodecs.push(originalCodec[j]);
	                }
	            }
	        }
	        return newCodecs;
	    };
	    CodecSorter.prototype.getSDP = function () {
	        var resultSDP = this.originalCodecList.prefix;
	        for (var i = 0; i < this.originalCodecList.sections.length; i++) {
	            var codecPart = '';
	            var codecOrder = [];
	            for (var j = 0; j < this.originalCodecList.sections[i].codec.length; j++) {
	                codecOrder.push(this.originalCodecList.sections[i].codec[j][0].split(" ")[0].substring(9));
	                codecPart += this.originalCodecList.sections[i].codec[j].join('\r\n') + '\r\n';
	            }
	            resultSDP += this.originalCodecList.sections[i].firstLine + " " + codecOrder.join(" ") + '\r\n';
	            resultSDP += this.originalCodecList.sections[i].prefix;
	            resultSDP += codecPart;
	            resultSDP += this.originalCodecList.sections[i].sufix;
	        }
	        return resultSDP;
	    };
	    CodecSorter.downOpusBandwidth = function (sdp) {
	        return new Promise(function (resolve, reject) {
	            var validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
	            var sdpLines = sdp.sdp.split(/(\r\n|\r|\n)/).filter(validLine);
	            var changed = false;
	            for (var i = 0; i < sdpLines.length; i++) {
	                if (sdpLines[i].indexOf('a=fmtp:114') !== -1) {
	                    sdpLines[i] = "a=fmtp:114 minptime=10; useinbandfec=1; sprop-maxcapturerate=8000";
	                    changed = true;
	                }
	                if (sdpLines[i].indexOf('a=fmtp:111') !== -1) {
	                    sdpLines[i] = "a=fmtp:111 minptime=10; useinbandfec=1; sprop-maxcapturerate=8000";
	                    changed = true;
	                }
	            }
	            if (!changed) {
	                reject(sdp);
	            }
	            sdp.sdp = sdpLines.join('\r\n') + '\r\n';
	            resolve(sdp);
	        });
	    };
	    return CodecSorter;
	}();
	exports.CodecSorter = CodecSorter;

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * @hidden
	 */
	
	var SDPMuggle = function () {
	    function SDPMuggle() {}
	    SDPMuggle.detectDirections = function (sdp) {
	        var ret = [];
	        var splitsdp = sdp.split(/(\r\n|\r|\n)/).filter(SDPMuggle.validLine);
	        var currentSection = '';
	        splitsdp.forEach(function (item) {
	            if (item.indexOf('m=') === 0) {
	                var directionStr = item.substr(2);
	                currentSection = directionStr.split(' ')[0];
	            }
	            if (currentSection !== '' && (item === 'a=sendrecv' || item === 'a=sendonly' || item === 'a=recvonly' || item === 'a=inactive')) {
	                ret.push({ type: currentSection, direction: item.substr(2) });
	                currentSection = '';
	            }
	        });
	        return ret;
	    };
	    SDPMuggle.removeTelephoneEvents = function (sdp) {
	        if (sdp.sdp.indexOf('a=rtpmap:127 telephone-event/8000') !== -1) {
	            var sdpLines = sdp.sdp.split(/(\r\n|\r|\n)/).filter(SDPMuggle.validLine);
	            var removenumber = -1;
	            for (var i = 0; i < sdpLines.length; i++) {
	                if (sdpLines[i].indexOf('m=audio') !== -1) {
	                    var line = sdpLines[i];
	                    if (typeof line === "string") sdpLines[i] = line.replace(' 127', '');
	                }
	                if (sdpLines[i].indexOf('a=rtpmap:127 telephone-event/8000') !== -1) removenumber = i;
	            }
	            sdpLines.splice(removenumber, 1);
	            sdp.sdp = sdpLines.join('\r\n') + '\r\n';
	        }
	        return sdp;
	    };
	    SDPMuggle.removeDoubleOpus = function (sdp) {
	        if (sdp.sdp.indexOf('a=rtpmap:109 opus') !== -1 && sdp.sdp.indexOf('a=rtpmap:111 opus') !== -1) {
	            var sdpLines = sdp.sdp.split(/(\r\n|\r|\n)/).filter(SDPMuggle.validLine);
	            var removenumber = -1;
	            for (var i = 0; i < sdpLines.length; i++) {
	                if (sdpLines[i].indexOf('m=audio') !== -1) {
	                    var line = sdpLines[i];
	                    if (typeof line === "string") sdpLines[i] = line.replace(' 109', '');
	                }
	                if (sdpLines[i].indexOf('a=rtpmap:109 opus') !== -1) removenumber = i;
	            }
	            sdpLines.splice(removenumber, 1);
	            sdp.sdp = sdpLines.join('\r\n') + '\r\n';
	        }
	        return sdp;
	    };
	    SDPMuggle.removeTIAS = function (sdp) {
	        if (sdp.sdp.indexOf('b=TIAS') !== -1) {
	            var sdpLines_1 = sdp.sdp.split(/(\r\n|\r|\n)/).filter(SDPMuggle.validLine);
	            var removenumbers_1 = [];
	            sdpLines_1.forEach(function (item, index) {
	                if (item.indexOf('b=TIAS') !== -1) removenumbers_1.unshift(index);
	            });
	            removenumbers_1.forEach(function (item) {
	                return sdpLines_1.splice(item, 1);
	            });
	            sdp.sdp = sdpLines_1.join('\r\n') + '\r\n';
	        }
	        return sdp;
	    };
	    SDPMuggle.fixVideoRecieve = function (sdp, recieveVideo) {
	        var videoPosition = sdp.sdp.indexOf('m=video');
	        if (videoPosition !== -1 && !recieveVideo) {
	            var sdpLines = sdp.sdp.split(/(\r\n|\r|\n)/).filter(SDPMuggle.validLine);
	            var videoindex_1 = null;
	            sdpLines = sdpLines.map(function (item, index) {
	                if (videoindex_1 === null) {
	                    if (item.indexOf('m=video') !== -1) videoindex_1 = index;
	                } else {
	                    if (item === 'a=sendrecv') item = 'a=sendonly';else if (item === 'a=recvonly') item = 'a=inactive';
	                }
	                return item;
	            });
	            sdp.sdp = sdpLines.join('\r\n') + '\r\n';
	        }
	        return sdp;
	    };
	    SDPMuggle.validLine = RegExp.prototype.test.bind(/^([a-z])=(.*)/);
	    return SDPMuggle;
	}();
	exports.SDPMuggle = SDPMuggle;

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Edge specific implementation
	 * @hidden
	 */
	
	var Edge = function () {
	    function Edge() {}
	    Edge.attachStream = function (stream, element) {
	        element.srcObject = stream;
	        element.play();
	    };
	    Edge.detachStream = function (element) {
	        element.pause();
	        element.src = "";
	    };
	    Edge.getScreenMedia = function () {
	        return new Promise(function (resolve, reject) {
	            reject(new Error('Screen sharing not allowed for you platform'));
	        });
	    };
	    Edge.getRTCStats = function (pc) {
	        return new Promise(function (resolve, reject) {
	            reject(new Error('RTCStats sharing not allowed for you platform'));
	        });
	    };
	    return Edge;
	}();
	exports.Edge = Edge;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var SignalingDTMFSender_1 = __webpack_require__(27);
	var Client_1 = __webpack_require__(1);
	/**
	 * @hidden
	 */
	var Safari = function () {
	    function Safari() {}
	    Safari.attachStream = function (stream, element) {
	        element.srcObject = stream;
	        element.load();
	        if (element instanceof HTMLVideoElement) element.play().catch(function (e) {});else {
	            element.play();
	            var sinkId = Client_1.Client.getInstance()._defaultSinkId;
	            if (sinkId != null) element.setSinkId(sinkId);
	        }
	    };
	    Safari.detachStream = function (element) {
	        if (element instanceof HTMLVideoElement) {
	            var promice = element.pause();
	            if (typeof promice != "undefined") promice.catch(function (e) {});
	        } else element.pause();
	        element.src = "";
	    };
	    Safari.getDTMFSender = function (pc, callId) {
	        if (!!pc.createDTMFSender) return pc.createDTMFSender(pc.getLocalStreams()[0].getAudioTracks()[0]);else return new SignalingDTMFSender_1.SignalingDTMFSender(callId);
	    };
	    Safari.getScreenMedia = function () {
	        return new Promise(function (resolve, reject) {
	            window.postMessage('get-sourceId', '*');
	            window.addEventListener('message', function (event) {
	                if (event.origin == window.location.origin) {
	                    if (event.data == 'PermissionDeniedError') {
	                        reject(new Error('PermissionDeniedError'));
	                    }
	                    if (typeof event.data != 'string' && typeof event.data.sourceId != "undefined") {
	                        var mediaParams = {
	                            audio: false,
	                            video: {
	                                mandatory: {
	                                    chromeMediaSource: 'desktop',
	                                    maxWidth: screen.width > 1920 ? screen.width : 1920,
	                                    maxHeight: screen.height > 1080 ? screen.height : 1080,
	                                    chromeMediaSourceId: event.data.sourceId
	                                },
	                                optional: [{
	                                    googTemporalLayeredScreencast: true
	                                }]
	                            }
	                        };
	                        navigator.mediaDevices.getUserMedia(mediaParams).then(function (stream) {
	                            resolve(stream);
	                        }).catch(function (e) {
	                            reject(e);
	                        });
	                    }
	                }
	            });
	        });
	    };
	    Safari.getRTCStats = function (pc) {
	        return new Promise(function (resolve, reject) {
	            var resultArray = [];
	            pc.getStats().then(function (e) {
	                e.forEach(function (result) {
	                    if (result.type == "ssrc") {
	                        var item = {};
	                        item.id = result.id;
	                        item.type = result.type;
	                        item.timestamp = result.timestamp;
	                        resultArray.push(item);
	                    }
	                });
	                resolve(resultArray);
	            }).catch(reject);
	        });
	    };
	    return Safari;
	}();
	exports.Safari = Safari;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Logger_1 = __webpack_require__(4);
	var MsgEnums_1 = __webpack_require__(35);
	var VoxSignaling_1 = __webpack_require__(6);
	/**
	 * Created by irbisadm on 24/10/2016.
	 * @hidden
	 */
	var MsgSignaling = function () {
	    function MsgSignaling() {
	        var _this = this;
	        if (MsgSignaling.instance) {
	            throw new Error("Error - use Client.getMessagingInstance()");
	        }
	        this.eventListeners = [];
	        this.query = [];
	        setInterval(function () {
	            _this.updateQuery();
	        }, 220);
	    }
	    /**
	     * Core event handler
	     * @hidden
	     * @param parsedData
	     */
	    MsgSignaling.prototype.handleWsData = function (parsedData) {
	        var validEvents = ["onCreateConversation", "onEditConversation", "onRemoveConversation", "onJoinConversation", "onLeaveConversation", "onGetConversation", "onSendMessage", "onEditMessage", "onRemoveMessage", "onTyping", "onRetransmitEvents", "onEditUser", "onGetUser", "isRead", "isDelivered", "onError", "onSubscribe", "onUnSubscribe", "onSetStatus"];
	        if (validEvents.indexOf(parsedData.event) != -1) this.dispatchEvent(parsedData.event, parsedData);else throw new Error('Unknown messaging event ' + parsedData.event + ' with payload ' + JSON.stringify(parsedData.payload));
	    };
	    MsgSignaling.get = function () {
	        MsgSignaling.instance = MsgSignaling.instance || new MsgSignaling();
	        return MsgSignaling.instance;
	    };
	    /**
	     * Core messaging sender
	     * @param event
	     * @param payload
	     * @returns {boolean}
	     */
	    MsgSignaling.prototype.sendPayload = function (event, payload) {
	        var rawTemplate = {
	            service: MsgEnums_1.MsgService.Chat,
	            event: event,
	            payload: payload
	        };
	        this.query.push(rawTemplate);
	        return true;
	    };
	    MsgSignaling.prototype.updateQuery = function () {
	        if (this.query.length) {
	            var item = this.query.splice(0, 1);
	            VoxSignaling_1.VoxSignaling.get().sendRaw(item[0]);
	        }
	    };
	    MsgSignaling.prototype.addEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] == 'undefined') this.eventListeners[event] = [];
	        this.eventListeners[event].push(handler);
	    };
	    MsgSignaling.prototype.removeEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] == 'undefined') return;
	        if (typeof handler === "function") for (var i = 0; i < this.eventListeners[event].length; i++) if (this.eventListeners[event][i] == handler) {
	            this.eventListeners[event].splice(i, 1);
	            break;
	        } else this.eventListeners[event] = [];
	    };
	    MsgSignaling.prototype.dispatchEvent = function (event, data) {
	        if (typeof this.eventListeners[event] != 'undefined') for (var i = 0; i < this.eventListeners[event].length; i++) if (typeof this.eventListeners[event][i] == "function") this.eventListeners[event][i](data.payload);
	    };
	    MsgSignaling.prototype.on = function (event, handler) {
	        this.addEventListener(event, handler);
	    };
	    MsgSignaling.prototype.off = function (event, handler) {
	        this.removeEventListener(event, handler);
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], MsgSignaling.prototype, "handleWsData", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], MsgSignaling.prototype, "sendPayload", null);
	    return MsgSignaling;
	}();
	exports.MsgSignaling = MsgSignaling;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Created by irbisadm on 22/09/16.
	 */
	/**
	 * @hidden
	 */
	
	(function (MsgService) {
	  MsgService[MsgService["Chat"] = "chat"] = "Chat";
	})(exports.MsgService || (exports.MsgService = {}));
	var MsgService = exports.MsgService;
	/**
	 * @hidden
	 */
	(function (MsgAction) {
	  MsgAction[MsgAction["createConversation"] = "createConversation"] = "createConversation";
	  MsgAction[MsgAction["editConversation"] = "editConversation"] = "editConversation";
	  MsgAction[MsgAction["removeConversation"] = "removeConversation"] = "removeConversation";
	  MsgAction[MsgAction["joinConversation"] = "joinConversation"] = "joinConversation";
	  MsgAction[MsgAction["leaveConversation"] = "leaveConversation"] = "leaveConversation";
	  MsgAction[MsgAction["getConversation"] = "getConversation"] = "getConversation";
	  MsgAction[MsgAction["getConversations"] = "getConversations"] = "getConversations";
	  MsgAction[MsgAction["sendMessage"] = "sendMessage"] = "sendMessage";
	  MsgAction[MsgAction["editMessage"] = "editMessage"] = "editMessage";
	  MsgAction[MsgAction["removeMessage"] = "removeMessage"] = "removeMessage";
	  MsgAction[MsgAction["typingMessage"] = "typingMessage"] = "typingMessage";
	  MsgAction[MsgAction["editUser"] = "editUser"] = "editUser";
	  MsgAction[MsgAction["getUser"] = "getUser"] = "getUser";
	  MsgAction[MsgAction["getUsers"] = "getUsers"] = "getUsers";
	  MsgAction[MsgAction["retransmitEvents"] = "retransmitEvents"] = "retransmitEvents";
	  MsgAction[MsgAction["isRead"] = "isRead"] = "isRead";
	  MsgAction[MsgAction["isDelivered"] = "isDelivered"] = "isDelivered";
	  MsgAction[MsgAction["addParticipants"] = "addParticipants"] = "addParticipants";
	  MsgAction[MsgAction["editParticipants"] = "editParticipants"] = "editParticipants";
	  MsgAction[MsgAction["removeParticipants"] = "removeParticipants"] = "removeParticipants";
	  MsgAction[MsgAction["addModerators"] = "addModerators"] = "addModerators";
	  MsgAction[MsgAction["removeModerators"] = "removeModerators"] = "removeModerators";
	  MsgAction[MsgAction["subscribe"] = "subscribe"] = "subscribe";
	  MsgAction[MsgAction["unSubscribe"] = "unSubscribe"] = "unSubscribe";
	  MsgAction[MsgAction["setStatus"] = "setStatus"] = "setStatus";
	})(exports.MsgAction || (exports.MsgAction = {}));
	var MsgAction = exports.MsgAction;
	/**
	 * @hidden
	 */
	(function (MsgEvent) {
	  MsgEvent[MsgEvent["onCreateConversation"] = "onCreateConversation"] = "onCreateConversation";
	  MsgEvent[MsgEvent["onEditConversation"] = "onEditConversation"] = "onEditConversation";
	  MsgEvent[MsgEvent["onRemoveConversation"] = "onRemoveConversation"] = "onRemoveConversation";
	  MsgEvent[MsgEvent["onJoinConversation"] = "onJoinConversation"] = "onJoinConversation";
	  MsgEvent[MsgEvent["onLeaveConversation"] = "onLeaveConversation"] = "onLeaveConversation";
	  MsgEvent[MsgEvent["onGetConversation"] = "onGetConversation"] = "onGetConversation";
	  MsgEvent[MsgEvent["onSendMessage"] = "onSendMessage"] = "onSendMessage";
	  MsgEvent[MsgEvent["onEditMessage"] = "onEditMessage"] = "onEditMessage";
	  MsgEvent[MsgEvent["onRemoveMessage"] = "onRemoveMessage"] = "onRemoveMessage";
	  MsgEvent[MsgEvent["onTyping"] = "onTyping"] = "onTyping";
	  MsgEvent[MsgEvent["onRetransmitEvents"] = "onRetransmitEvents"] = "onRetransmitEvents";
	  MsgEvent[MsgEvent["onEditUser"] = "onEditUser"] = "onEditUser";
	  MsgEvent[MsgEvent["onGetUser"] = "onGetUser"] = "onGetUser";
	  MsgEvent[MsgEvent["onError"] = "onError"] = "onError";
	  MsgEvent[MsgEvent["isRead"] = "isRead"] = "isRead";
	  MsgEvent[MsgEvent["isDelivered"] = "isDelivered"] = "isDelivered";
	  MsgEvent[MsgEvent["onSubscribe"] = "onSubscribe"] = "onSubscribe";
	  MsgEvent[MsgEvent["onUnSubscribe"] = "onUnSubscribe"] = "onUnSubscribe";
	  MsgEvent[MsgEvent["onSetStatus"] = "onSetStatus"] = "onSetStatus";
	})(exports.MsgEvent || (exports.MsgEvent = {}));
	var MsgEvent = exports.MsgEvent;

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * @hidden
	 */
	
	var Callbackable = function () {
	    function Callbackable() {
	        this.eventListeners = {};
	    }
	    /**
	     * Register handler for specified event
	     * @param {Function} event Event class (i.e. <a href="VoxImplant.Events.html#VoxImplant_Events_SDKReady">VoxImplant.Events.SDKReady</a>). See <a href="VoxImplant.Events.html">VoxImplant.Events</a>
	     * @param {Function} handler Handler function. A single parameter is passed - object with event information
	     * @function
	     */
	    Callbackable.prototype.addEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] == 'undefined') this.eventListeners[event] = [];
	        this.eventListeners[event].push(handler);
	    };
	    Callbackable.prototype.dispatchEvent = function (e) {
	        var event = e.name;
	        if (typeof this.eventListeners[event] != 'undefined') {
	            for (var i = 0; i < this.eventListeners[event].length; i++) {
	                if (typeof this.eventListeners[event][i] == "function") {
	                    this.eventListeners[event][i](e);
	                }
	            }
	        }
	    };
	    Callbackable.prototype.removeEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] == 'undefined') return;
	        if (typeof handler === "function") {
	            for (var i = 0; i < this.eventListeners[event].length; i++) {
	                if (this.eventListeners[event][i] == handler) {
	                    this.eventListeners[event].splice(i, 1);
	                    break;
	                }
	            }
	        } else {
	            this.eventListeners[event] = [];
	        }
	    };
	    Callbackable.prototype.on = function (event, handler) {
	        this.addEventListener(event, handler);
	    };
	    Callbackable.prototype.off = function (event, handler) {
	        this.removeEventListener(event, handler);
	    };
	    return Callbackable;
	}();
	exports.Callbackable = Callbackable;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var Events_1 = __webpack_require__(2);
	var ConnectionFailed = Events_1.Events.ConnectionFailed;
	var CallManager_1 = __webpack_require__(16);
	var VoxSignaling_1 = __webpack_require__(6);
	var RemoteFunction_1 = __webpack_require__(20);
	var ConnectionEstablished = Events_1.Events.ConnectionEstablished;
	var UserMediaManager_1 = __webpack_require__(11);
	var RemoteEvent_1 = __webpack_require__(24);
	var Authenticator_1 = __webpack_require__(5);
	var CallEvents_1 = __webpack_require__(18);
	/**
	 * Created by irbisadm on 26.04.2017.
	 * @hidden
	 */
	var ZingayaAPI = function () {
	  /**
	   * @hidden
	   * @param client
	   */
	  /**
	   * @hidden
	   * @param client
	   */
	  function ZingayaAPI(client) {
	    var _this = this;
	    this.client = client;
	    /**
	     * @hidden
	     */
	    this.currentCall = null;
	    /**
	     * @hidden
	     */
	    this.onConnectionFailed = null;
	    /**
	     * @hidden
	     */
	    this.onConnectionEstablished = null;
	    /**
	     * @hidden
	     */
	    this.onCheckComplete = null;
	    /**
	     * @hidden
	     */
	    this.onCallFailed = null;
	    /**
	     * @hidden
	     */
	    this.onCallConnected = null;
	    /**
	     * @hidden
	     */
	    this.onCallEnded = null;
	    /**
	     * @hidden
	     */
	    this.onCallRinging = null;
	    /**
	     * @hidden
	     */
	    this.onCallMediaStarted = null;
	    /**
	     * @hidden
	     */
	    this.onVoicemail = null;
	    /**
	     * @hidden
	     */
	    this.onNetStatsReceived = null;
	    //console.log(`[ZA] constructor`);
	    CallManager_1.CallManager.get().protocolVersion == "2";
	    client.on(ConnectionFailed, function (event) {
	      return _this.runLegacyCallback(_this.onConnectionFailed, event);
	    });
	    client.on(ConnectionEstablished, function (event) {
	      return _this.runLegacyCallback(_this.onConnectionEstablished, event);
	    });
	    VoxSignaling_1.VoxSignaling.get().setRPCHandler(RemoteEvent_1.RemoteEvent.handlePreFlightCheckResult, function (a, b, c) {
	      return _this.onCheckComplete(a, b, c);
	    });
	    VoxSignaling_1.VoxSignaling.get().setRPCHandler(RemoteEvent_1.RemoteEvent.handleVoicemail, function (event) {
	      return _this.runLegacyCallback(_this.onVoicemail, event);
	    });
	  }
	  /**
	   * @hidden
	   * @param serverAddress
	   * @param referrer
	   * @param extra
	   * @param appName
	   */
	  ZingayaAPI.prototype.connectTo = function (serverAddress, referrer, extra, appName) {
	    //console.log(`[ZA] connectTo(${serverAddress},${referrer},${extra},${appName}`);
	    var signaling = VoxSignaling_1.VoxSignaling.get();
	    Authenticator_1.Authenticator.get().ziAuthorized(true);
	    signaling.lagacyConnectTo(serverAddress, referrer, extra, appName);
	  };
	  /**
	   * @hidden
	   */
	  ZingayaAPI.prototype.connect = function () {
	    //console.log(`[ZA] connect`);
	  };
	  ;
	  /**
	   * @hidden
	   * @param video
	   * @param onMediaAccessGranted
	   * @param onMediaAccessRejected
	   * @param stopStream
	   */
	  ZingayaAPI.prototype.requestMedia = function (video, onMediaAccessGranted, onMediaAccessRejected, stopStream) {
	    //console.log(`[ZA] requestMedia`);
	    var mediaManager = UserMediaManager_1.UserMediaManager.get();
	    mediaManager.enableAudio(true);
	    mediaManager.queryMedia().then(function (stream) {
	      UserMediaManager_1.UserMediaManager.get().updateLocalVideo(stream);
	      if (typeof onMediaAccessGranted == "function") onMediaAccessGranted(stream);
	    }).catch(function (err) {
	      if (typeof onMediaAccessRejected == "function") onMediaAccessRejected(err);
	    });
	  };
	  ;
	  /**
	   * @hidden
	   * @param callId
	   * @param headers
	   */
	  ZingayaAPI.prototype.hangupCall = function (callId, headers) {
	    //console.log(`[ZA] hangupCall(${callId},${JSON.stringify(headers)})`);
	    CallManager_1.CallManager.get().calls[callId].hangup(headers);
	    VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.disconnectCall, callId, {});
	  };
	  ;
	  /**
	   * @hidden
	   * @param destination
	   * @param useVideo
	   * @param headers
	   * @param extraParams
	   */
	  ZingayaAPI.prototype.callTo = function (destination, useVideo, headers, extraParams) {
	    //console.log(`[ZA] callTo(${destination},${useVideo},${JSON.stringify(headers)},${JSON.stringify(extraParams)})`);
	    this.currentCall = this.client.call({
	      number: destination,
	      video: useVideo,
	      extraHeaders: headers,
	      extraParams: extraParams
	    });
	    this.bindCurrentCall();
	    return this.currentCall.id();
	  };
	  ;
	  /**
	   * @hidden
	   * @param callId
	   */
	  ZingayaAPI.prototype.voicemailPromptFinished = function (callId) {
	    //console.log(`[ZA] voicemailPromptFinished(${callId})`);
	    VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.zPromptFinished, callId);
	  };
	  ;
	  /**
	   * @hidden
	   * @param len
	   */
	  ZingayaAPI.prototype.makeid = function (len) {
	    //console.log(`[ZA] makeid(${len})`);
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for (var i = 0; i < len; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
	    return text;
	  };
	  ;
	  /**
	   * @hidden
	   * @param doMute
	   */
	  ZingayaAPI.prototype.muteMicrophone = function (doMute) {
	    //console.log(`[ZA] muteMicrophone(${doMute})`);
	    var cm = CallManager_1.CallManager.get();
	    for (var call in cm.calls) {
	      if (doMute) cm.calls[call].muteMicrophone();else cm.calls[call].unmuteMicrophone();
	    }
	  };
	  ;
	  /**
	   * @hidden
	   * @param callId
	   * @param digit
	   */
	  ZingayaAPI.prototype.sendDigit = function (callId, digit) {
	    //console.log(`[ZA] sendDigit(${callId},${digit})`);
	    VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.sendDTMF, callId, digit);
	  };
	  ;
	  /**
	   * @hidden
	   * @param mic
	   * @param net
	   */
	  ZingayaAPI.prototype.startPreFlightCheck = function (mic, net) {
	    //console.log(`[ZA] startPreFlightCheck(${mic},${net})`);
	    VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.zStartPreFlightCheck, !!mic, !!net);
	  };
	  ;
	  /**
	   * @hidden
	   * @param callback
	   * @param event
	   */
	  ZingayaAPI.prototype.runLegacyCallback = function (callback, event) {
	    //console.log(`[ZA] runLegacyCallback(${event.name})`);
	    if (typeof callback !== "undefined" && callback !== null) {
	      callback(event);
	    }
	  };
	  /**
	   * @hidden
	   */
	  ZingayaAPI.prototype.bindCurrentCall = function () {
	    var _this = this;
	    window['currentCall'] = this.currentCall;
	    this.currentCall.on(CallEvents_1.CallEvents.Failed, function (event) {
	      _this.runLegacyCallback(_this.onCallFailed, event);
	      _this.unbindCurrentCall();
	    });
	    this.currentCall.on(CallEvents_1.CallEvents.Connected, function (event) {
	      _this.runLegacyCallback(_this.onCallConnected, event);
	      _this.runLegacyCallback(_this.onCallMediaStarted, event);
	      var cm = CallManager_1.CallManager.get();
	      setTimeout(function () {
	        var renderer = document.getElementById(window['currentCall'].peerConnection.impl.getRemoteStreams()[0].getTracks()[0].id);
	        renderer.srcObject = window['currentCall'].peerConnection.impl.getRemoteStreams()[0];
	        renderer.load();
	        renderer.play();
	      }, 1000);
	    });
	    this.currentCall.on(CallEvents_1.CallEvents.Disconnected, function (event) {
	      _this.runLegacyCallback(_this.onCallEnded, event);
	      _this.unbindCurrentCall();
	    });
	    this.client.on(Events_1.Events.NetStatsReceived, function (event) {
	      return _this.onNetStatsReceived(event);
	    });
	  };
	  /**
	   * @hidden
	   */
	  ZingayaAPI.prototype.unbindCurrentCall = function () {
	    this.currentCall.off(CallEvents_1.CallEvents.Failed);
	    this.currentCall.off(CallEvents_1.CallEvents.Connected);
	    this.currentCall.off(CallEvents_1.CallEvents.Disconnected);
	    this.currentCall.off(CallEvents_1.CallEvents.ProgressToneStart);
	    this.currentCall.off(CallEvents_1.CallEvents.Connected);
	    this.client.off(Events_1.Events.NetStatsReceived);
	  };
	  return ZingayaAPI;
	}();
	exports.ZingayaAPI = ZingayaAPI;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var VoxSignaling_1 = __webpack_require__(6);
	var RemoteFunction_1 = __webpack_require__(20);
	/**
	 * @hidden
	 */
	var PushService = function () {
	    function PushService() {}
	    PushService.register = function (token) {
	        return new Promise(function (resolve, reject) {
	            var sendResult = VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.registerPushToken, token);
	            if (sendResult) resolve();else reject();
	        });
	    };
	    PushService.unregister = function (token) {
	        return new Promise(function (resolve, reject) {
	            var sendResult = VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.unregisterPushToken, token);
	            if (sendResult) resolve();else reject();
	        });
	    };
	    PushService.incomingPush = function (data) {
	        return new Promise(function (resolve, reject) {
	            var sendResult = VoxSignaling_1.VoxSignaling.get().callRemoteFunction(RemoteFunction_1.RemoteFunction.pushFeedback, data);
	            if (sendResult) resolve();else reject();
	        });
	    };
	    return PushService;
	}();
	exports.PushService = PushService;

/***/ }),
/* 39 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Created by irbisadm on 23/09/2016.
	 * @hidden
	 */
	
	var GUID = function () {
	    function GUID(str) {
	        this.str = str || GUID.getNewGUIDString();
	    }
	    GUID.prototype.toString = function () {
	        return this.str;
	    };
	    GUID.getNewGUIDString = function () {
	        // your favourite guid generation function could go here
	        // ex: http://stackoverflow.com/a/8809472/188246
	        var d = new Date().getTime();
	        if (window.performance && typeof window.performance.now === "function") {
	            d += performance.now(); //use high-precision timer if available
	        }
	        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	            var r = (d + Math.random() * 16) % 16 | 0;
	            d = Math.floor(d / 16);
	            return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
	        });
	    };
	    return GUID;
	}();
	exports.GUID = GUID;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	
	'use strict';
	
	var adapterFactory = __webpack_require__(41);
	module.exports = adapterFactory({window: global.window});
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	
	'use strict';
	
	// Shimming starts here.
	module.exports = function(dependencies) {
	  var window = dependencies && dependencies.window;
	
	  // Utils.
	  var utils = __webpack_require__(42);
	  var logging = utils.log;
	  var browserDetails = utils.detectBrowser(window);
	
	  // Export to the adapter global object visible in the browser.
	  var adapter = {
	    browserDetails: browserDetails,
	    extractVersion: utils.extractVersion,
	    disableLog: utils.disableLog
	  };
	
	  // Uncomment the line below if you want logging to occur, including logging
	  // for the switch statement below. Can also be turned on in the browser via
	  // adapter.disableLog(false), but then logging from the switch statement below
	  // will not appear.
	  // require('./utils').disableLog(false);
	
	  // Browser shims.
	  var chromeShim = __webpack_require__(43) || null;
	  var edgeShim = __webpack_require__(45) || null;
	  var firefoxShim = __webpack_require__(49) || null;
	  var safariShim = __webpack_require__(51) || null;
	
	  // Shim browser if found.
	  switch (browserDetails.browser) {
	    case 'chrome':
	      if (!chromeShim || !chromeShim.shimPeerConnection) {
	        logging('Chrome shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming chrome.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = chromeShim;
	
	      chromeShim.shimGetUserMedia(window);
	      chromeShim.shimMediaStream(window);
	      utils.shimCreateObjectURL(window);
	      chromeShim.shimSourceObject(window);
	      chromeShim.shimPeerConnection(window);
	      chromeShim.shimOnTrack(window);
	      chromeShim.shimGetSendersWithDtmf(window);
	      break;
	    case 'firefox':
	      if (!firefoxShim || !firefoxShim.shimPeerConnection) {
	        logging('Firefox shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming firefox.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = firefoxShim;
	
	      firefoxShim.shimGetUserMedia(window);
	      utils.shimCreateObjectURL(window);
	      firefoxShim.shimSourceObject(window);
	      firefoxShim.shimPeerConnection(window);
	      firefoxShim.shimOnTrack(window);
	      break;
	    case 'edge':
	      if (!edgeShim || !edgeShim.shimPeerConnection) {
	        logging('MS edge shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming edge.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = edgeShim;
	
	      edgeShim.shimGetUserMedia(window);
	      utils.shimCreateObjectURL(window);
	      edgeShim.shimPeerConnection(window);
	      edgeShim.shimReplaceTrack(window);
	      break;
	    case 'safari':
	      if (!safariShim) {
	        logging('Safari shim is not included in this adapter release.');
	        return adapter;
	      }
	      logging('adapter.js shimming safari.');
	      // Export to the adapter global object visible in the browser.
	      adapter.browserShim = safariShim;
	
	      safariShim.shimCallbacksAPI(window);
	      safariShim.shimAddStream(window);
	      safariShim.shimOnAddStream(window);
	      safariShim.shimGetUserMedia(window);
	      break;
	    default:
	      logging('Unsupported browser!');
	      break;
	  }
	
	  return adapter;
	};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	
	var logDisabled_ = true;
	
	// Utility methods.
	var utils = {
	  disableLog: function(bool) {
	    if (typeof bool !== 'boolean') {
	      return new Error('Argument type: ' + typeof bool +
	          '. Please use a boolean.');
	    }
	    logDisabled_ = bool;
	    return (bool) ? 'adapter.js logging disabled' :
	        'adapter.js logging enabled';
	  },
	
	  log: function() {
	    if (typeof window === 'object') {
	      if (logDisabled_) {
	        return;
	      }
	      if (typeof console !== 'undefined' && typeof console.log === 'function') {
	        console.log.apply(console, arguments);
	      }
	    }
	  },
	
	  /**
	   * Extract browser version out of the provided user agent string.
	   *
	   * @param {!string} uastring userAgent string.
	   * @param {!string} expr Regular expression used as match criteria.
	   * @param {!number} pos position in the version string to be returned.
	   * @return {!number} browser version.
	   */
	  extractVersion: function(uastring, expr, pos) {
	    var match = uastring.match(expr);
	    return match && match.length >= pos && parseInt(match[pos], 10);
	  },
	
	  /**
	   * Browser detector.
	   *
	   * @return {object} result containing browser and version
	   *     properties.
	   */
	  detectBrowser: function(window) {
	    var navigator = window && window.navigator;
	
	    // Returned result object.
	    var result = {};
	    result.browser = null;
	    result.version = null;
	
	    // Fail early if it's not a browser
	    if (typeof window === 'undefined' || !window.navigator) {
	      result.browser = 'Not a browser.';
	      return result;
	    }
	
	    // Firefox.
	    if (navigator.mozGetUserMedia) {
	      result.browser = 'firefox';
	      result.version = this.extractVersion(navigator.userAgent,
	          /Firefox\/(\d+)\./, 1);
	    } else if (navigator.webkitGetUserMedia) {
	      // Chrome, Chromium, Webview, Opera, all use the chrome shim for now
	      if (window.webkitRTCPeerConnection) {
	        result.browser = 'chrome';
	        result.version = this.extractVersion(navigator.userAgent,
	          /Chrom(e|ium)\/(\d+)\./, 2);
	      } else { // Safari (in an unpublished version) or unknown webkit-based.
	        if (navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
	          result.browser = 'safari';
	          result.version = this.extractVersion(navigator.userAgent,
	            /AppleWebKit\/(\d+)\./, 1);
	        } else { // unknown webkit-based browser.
	          result.browser = 'Unsupported webkit-based browser ' +
	              'with GUM support but no WebRTC support.';
	          return result;
	        }
	      }
	    } else if (navigator.mediaDevices &&
	        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
	      result.browser = 'edge';
	      result.version = this.extractVersion(navigator.userAgent,
	          /Edge\/(\d+).(\d+)$/, 2);
	    } else if (navigator.mediaDevices &&
	        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
	        // Safari, with webkitGetUserMedia removed.
	      result.browser = 'safari';
	      result.version = this.extractVersion(navigator.userAgent,
	          /AppleWebKit\/(\d+)\./, 1);
	    } else { // Default fallthrough: not supported.
	      result.browser = 'Not a supported browser.';
	      return result;
	    }
	
	    return result;
	  },
	
	  // shimCreateObjectURL must be called before shimSourceObject to avoid loop.
	
	  shimCreateObjectURL: function(window) {
	    var URL = window && window.URL;
	
	    if (!(typeof window === 'object' && window.HTMLMediaElement &&
	          'srcObject' in window.HTMLMediaElement.prototype)) {
	      // Only shim CreateObjectURL using srcObject if srcObject exists.
	      return undefined;
	    }
	
	    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
	    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
	    var streams = new Map(), newId = 0;
	
	    URL.createObjectURL = function(stream) {
	      if ('getTracks' in stream) {
	        var url = 'polyblob:' + (++newId);
	        streams.set(url, stream);
	        console.log('URL.createObjectURL(stream) is deprecated! ' +
	                    'Use elem.srcObject = stream instead!');
	        return url;
	      }
	      return nativeCreateObjectURL(stream);
	    };
	    URL.revokeObjectURL = function(url) {
	      nativeRevokeObjectURL(url);
	      streams.delete(url);
	    };
	
	    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype,
	                                              'src');
	    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
	      get: function() {
	        return dsc.get.apply(this);
	      },
	      set: function(url) {
	        this.srcObject = streams.get(url) || null;
	        return dsc.set.apply(this, [url]);
	      }
	    });
	
	    var nativeSetAttribute = window.HTMLMediaElement.prototype.setAttribute;
	    window.HTMLMediaElement.prototype.setAttribute = function() {
	      if (arguments.length === 2 &&
	          ('' + arguments[0]).toLowerCase() === 'src') {
	        this.srcObject = streams.get(arguments[1]) || null;
	      }
	      return nativeSetAttribute.apply(this, arguments);
	    };
	  }
	};
	
	// Export.
	module.exports = {
	  log: utils.log,
	  disableLog: utils.disableLog,
	  extractVersion: utils.extractVersion,
	  shimCreateObjectURL: utils.shimCreateObjectURL,
	  detectBrowser: utils.detectBrowser.bind(utils)
	};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	
	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	var utils = __webpack_require__(42);
	var logging = utils.log;
	
	var chromeShim = {
	  shimMediaStream: function(window) {
	    window.MediaStream = window.MediaStream || window.webkitMediaStream;
	  },
	
	  shimOnTrack: function(window) {
	    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
	        window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	        get: function() {
	          return this._ontrack;
	        },
	        set: function(f) {
	          var self = this;
	          if (this._ontrack) {
	            this.removeEventListener('track', this._ontrack);
	            this.removeEventListener('addstream', this._ontrackpoly);
	          }
	          this.addEventListener('track', this._ontrack = f);
	          this.addEventListener('addstream', this._ontrackpoly = function(e) {
	            // onaddstream does not fire when a track is added to an existing
	            // stream. But stream.onaddtrack is implemented so we use that.
	            e.stream.addEventListener('addtrack', function(te) {
	              var receiver;
	              if (window.RTCPeerConnection.prototype.getReceivers) {
	                receiver = self.getReceivers().find(function(r) {
	                  return r.track.id === te.track.id;
	                });
	              } else {
	                receiver = {track: te.track};
	              }
	
	              var event = new Event('track');
	              event.track = te.track;
	              event.receiver = receiver;
	              event.streams = [e.stream];
	              self.dispatchEvent(event);
	            });
	            e.stream.getTracks().forEach(function(track) {
	              var receiver;
	              if (window.RTCPeerConnection.prototype.getReceivers) {
	                receiver = self.getReceivers().find(function(r) {
	                  return r.track.id === track.id;
	                });
	              } else {
	                receiver = {track: track};
	              }
	              var event = new Event('track');
	              event.track = track;
	              event.receiver = receiver;
	              event.streams = [e.stream];
	              this.dispatchEvent(event);
	            }.bind(this));
	          }.bind(this));
	        }
	      });
	    }
	  },
	
	  shimGetSendersWithDtmf: function(window) {
	    if (typeof window === 'object' && window.RTCPeerConnection &&
	        !('getSenders' in window.RTCPeerConnection.prototype) &&
	        'createDTMFSender' in window.RTCPeerConnection.prototype) {
	      window.RTCPeerConnection.prototype.getSenders = function() {
	        return this._senders || [];
	      };
	      var origAddStream = window.RTCPeerConnection.prototype.addStream;
	      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
	
	      if (!window.RTCPeerConnection.prototype.addTrack) {
	        window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
	          var pc = this;
	          if (pc.signalingState === 'closed') {
	            throw new DOMException(
	              'The RTCPeerConnection\'s signalingState is \'closed\'.',
	              'InvalidStateError');
	          }
	          var streams = [].slice.call(arguments, 1);
	          if (streams.length !== 1 ||
	              !streams[0].getTracks().find(function(t) {
	                return t === track;
	              })) {
	            // this is not fully correct but all we can manage without
	            // [[associated MediaStreams]] internal slot.
	            throw new DOMException(
	              'The adapter.js addTrack polyfill only supports a single ' +
	              ' stream which is associated with the specified track.',
	              'NotSupportedError');
	          }
	
	          pc._senders = pc._senders || [];
	          var alreadyExists = pc._senders.find(function(t) {
	            return t.track === track;
	          });
	          if (alreadyExists) {
	            throw new DOMException('Track already exists.',
	                'InvalidAccessError');
	          }
	
	          pc._streams = pc._streams || {};
	          var oldStream = pc._streams[stream.id];
	          if (oldStream) {
	            oldStream.addTrack(track);
	            pc.removeStream(oldStream);
	            pc.addStream(oldStream);
	          } else {
	            var newStream = new window.MediaStream([track]);
	            pc._streams[stream.id] = newStream;
	            pc.addStream(newStream);
	          }
	
	          var sender = {
	            track: track,
	            get dtmf() {
	              if (this._dtmf === undefined) {
	                if (track.kind === 'audio') {
	                  this._dtmf = pc.createDTMFSender(track);
	                } else {
	                  this._dtmf = null;
	                }
	              }
	              return this._dtmf;
	            }
	          };
	          pc._senders.push(sender);
	          return sender;
	        };
	      }
	      window.RTCPeerConnection.prototype.addStream = function(stream) {
	        var pc = this;
	        pc._senders = pc._senders || [];
	        origAddStream.apply(pc, [stream]);
	        stream.getTracks().forEach(function(track) {
	          pc._senders.push({
	            track: track,
	            get dtmf() {
	              if (this._dtmf === undefined) {
	                if (track.kind === 'audio') {
	                  this._dtmf = pc.createDTMFSender(track);
	                } else {
	                  this._dtmf = null;
	                }
	              }
	              return this._dtmf;
	            }
	          });
	        });
	      };
	
	      window.RTCPeerConnection.prototype.removeStream = function(stream) {
	        var pc = this;
	        pc._senders = pc._senders || [];
	        origRemoveStream.apply(pc, [stream]);
	        stream.getTracks().forEach(function(track) {
	          var sender = pc._senders.find(function(s) {
	            return s.track === track;
	          });
	          if (sender) {
	            pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
	          }
	        });
	      };
	    }
	  },
	
	  shimSourceObject: function(window) {
	    var URL = window && window.URL;
	
	    if (typeof window === 'object') {
	      if (window.HTMLMediaElement &&
	        !('srcObject' in window.HTMLMediaElement.prototype)) {
	        // Shim the srcObject property, once, when HTMLMediaElement is found.
	        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	          get: function() {
	            return this._srcObject;
	          },
	          set: function(stream) {
	            var self = this;
	            // Use _srcObject as a private property for this shim
	            this._srcObject = stream;
	            if (this.src) {
	              URL.revokeObjectURL(this.src);
	            }
	
	            if (!stream) {
	              this.src = '';
	              return undefined;
	            }
	            this.src = URL.createObjectURL(stream);
	            // We need to recreate the blob url when a track is added or
	            // removed. Doing it manually since we want to avoid a recursion.
	            stream.addEventListener('addtrack', function() {
	              if (self.src) {
	                URL.revokeObjectURL(self.src);
	              }
	              self.src = URL.createObjectURL(stream);
	            });
	            stream.addEventListener('removetrack', function() {
	              if (self.src) {
	                URL.revokeObjectURL(self.src);
	              }
	              self.src = URL.createObjectURL(stream);
	            });
	          }
	        });
	      }
	    }
	  },
	
	  shimPeerConnection: function(window) {
	    var browserDetails = utils.detectBrowser(window);
	
	    // The RTCPeerConnection object.
	    if (!window.RTCPeerConnection) {
	      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	        // Translate iceTransportPolicy to iceTransports,
	        // see https://code.google.com/p/webrtc/issues/detail?id=4869
	        // this was fixed in M56 along with unprefixing RTCPeerConnection.
	        logging('PeerConnection');
	        if (pcConfig && pcConfig.iceTransportPolicy) {
	          pcConfig.iceTransports = pcConfig.iceTransportPolicy;
	        }
	
	        return new window.webkitRTCPeerConnection(pcConfig, pcConstraints);
	      };
	      window.RTCPeerConnection.prototype =
	          window.webkitRTCPeerConnection.prototype;
	      // wrap static methods. Currently just generateCertificate.
	      if (window.webkitRTCPeerConnection.generateCertificate) {
	        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	          get: function() {
	            return window.webkitRTCPeerConnection.generateCertificate;
	          }
	        });
	      }
	    } else {
	      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
	      var OrigPeerConnection = window.RTCPeerConnection;
	      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	        if (pcConfig && pcConfig.iceServers) {
	          var newIceServers = [];
	          for (var i = 0; i < pcConfig.iceServers.length; i++) {
	            var server = pcConfig.iceServers[i];
	            if (!server.hasOwnProperty('urls') &&
	                server.hasOwnProperty('url')) {
	              console.warn('RTCIceServer.url is deprecated! Use urls instead.');
	              server = JSON.parse(JSON.stringify(server));
	              server.urls = server.url;
	              newIceServers.push(server);
	            } else {
	              newIceServers.push(pcConfig.iceServers[i]);
	            }
	          }
	          pcConfig.iceServers = newIceServers;
	        }
	        return new OrigPeerConnection(pcConfig, pcConstraints);
	      };
	      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
	      // wrap static methods. Currently just generateCertificate.
	      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	        get: function() {
	          return OrigPeerConnection.generateCertificate;
	        }
	      });
	    }
	
	    var origGetStats = window.RTCPeerConnection.prototype.getStats;
	    window.RTCPeerConnection.prototype.getStats = function(selector,
	        successCallback, errorCallback) {
	      var self = this;
	      var args = arguments;
	
	      // If selector is a function then we are in the old style stats so just
	      // pass back the original getStats format to avoid breaking old users.
	      if (arguments.length > 0 && typeof selector === 'function') {
	        return origGetStats.apply(this, arguments);
	      }
	
	      // When spec-style getStats is supported, return those when called with
	      // either no arguments or the selector argument is null.
	      if (origGetStats.length === 0 && (arguments.length === 0 ||
	          typeof arguments[0] !== 'function')) {
	        return origGetStats.apply(this, []);
	      }
	
	      var fixChromeStats_ = function(response) {
	        var standardReport = {};
	        var reports = response.result();
	        reports.forEach(function(report) {
	          var standardStats = {
	            id: report.id,
	            timestamp: report.timestamp,
	            type: {
	              localcandidate: 'local-candidate',
	              remotecandidate: 'remote-candidate'
	            }[report.type] || report.type
	          };
	          report.names().forEach(function(name) {
	            standardStats[name] = report.stat(name);
	          });
	          standardReport[standardStats.id] = standardStats;
	        });
	
	        return standardReport;
	      };
	
	      // shim getStats with maplike support
	      var makeMapStats = function(stats) {
	        return new Map(Object.keys(stats).map(function(key) {
	          return [key, stats[key]];
	        }));
	      };
	
	      if (arguments.length >= 2) {
	        var successCallbackWrapper_ = function(response) {
	          args[1](makeMapStats(fixChromeStats_(response)));
	        };
	
	        return origGetStats.apply(this, [successCallbackWrapper_,
	          arguments[0]]);
	      }
	
	      // promise-support
	      return new Promise(function(resolve, reject) {
	        origGetStats.apply(self, [
	          function(response) {
	            resolve(makeMapStats(fixChromeStats_(response)));
	          }, reject]);
	      }).then(successCallback, errorCallback);
	    };
	
	    // add promise support -- natively available in Chrome 51
	    if (browserDetails.version < 51) {
	      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	          .forEach(function(method) {
	            var nativeMethod = window.RTCPeerConnection.prototype[method];
	            window.RTCPeerConnection.prototype[method] = function() {
	              var args = arguments;
	              var self = this;
	              var promise = new Promise(function(resolve, reject) {
	                nativeMethod.apply(self, [args[0], resolve, reject]);
	              });
	              if (args.length < 2) {
	                return promise;
	              }
	              return promise.then(function() {
	                args[1].apply(null, []);
	              },
	              function(err) {
	                if (args.length >= 3) {
	                  args[2].apply(null, [err]);
	                }
	              });
	            };
	          });
	    }
	
	    // promise support for createOffer and createAnswer. Available (without
	    // bugs) since M52: crbug/619289
	    if (browserDetails.version < 52) {
	      ['createOffer', 'createAnswer'].forEach(function(method) {
	        var nativeMethod = window.RTCPeerConnection.prototype[method];
	        window.RTCPeerConnection.prototype[method] = function() {
	          var self = this;
	          if (arguments.length < 1 || (arguments.length === 1 &&
	              typeof arguments[0] === 'object')) {
	            var opts = arguments.length === 1 ? arguments[0] : undefined;
	            return new Promise(function(resolve, reject) {
	              nativeMethod.apply(self, [resolve, reject, opts]);
	            });
	          }
	          return nativeMethod.apply(this, arguments);
	        };
	      });
	    }
	
	    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
	    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	        .forEach(function(method) {
	          var nativeMethod = window.RTCPeerConnection.prototype[method];
	          window.RTCPeerConnection.prototype[method] = function() {
	            arguments[0] = new ((method === 'addIceCandidate') ?
	                window.RTCIceCandidate :
	                window.RTCSessionDescription)(arguments[0]);
	            return nativeMethod.apply(this, arguments);
	          };
	        });
	
	    // support for addIceCandidate(null or undefined)
	    var nativeAddIceCandidate =
	        window.RTCPeerConnection.prototype.addIceCandidate;
	    window.RTCPeerConnection.prototype.addIceCandidate = function() {
	      if (!arguments[0]) {
	        if (arguments[1]) {
	          arguments[1].apply(null);
	        }
	        return Promise.resolve();
	      }
	      return nativeAddIceCandidate.apply(this, arguments);
	    };
	  }
	};
	
	
	// Expose public methods.
	module.exports = {
	  shimMediaStream: chromeShim.shimMediaStream,
	  shimOnTrack: chromeShim.shimOnTrack,
	  shimGetSendersWithDtmf: chromeShim.shimGetSendersWithDtmf,
	  shimSourceObject: chromeShim.shimSourceObject,
	  shimPeerConnection: chromeShim.shimPeerConnection,
	  shimGetUserMedia: __webpack_require__(44)
	};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	var utils = __webpack_require__(42);
	var logging = utils.log;
	
	// Expose public methods.
	module.exports = function(window) {
	  var browserDetails = utils.detectBrowser(window);
	  var navigator = window && window.navigator;
	
	  var constraintsToChrome_ = function(c) {
	    if (typeof c !== 'object' || c.mandatory || c.optional) {
	      return c;
	    }
	    var cc = {};
	    Object.keys(c).forEach(function(key) {
	      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	        return;
	      }
	      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
	      if (r.exact !== undefined && typeof r.exact === 'number') {
	        r.min = r.max = r.exact;
	      }
	      var oldname_ = function(prefix, name) {
	        if (prefix) {
	          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
	        }
	        return (name === 'deviceId') ? 'sourceId' : name;
	      };
	      if (r.ideal !== undefined) {
	        cc.optional = cc.optional || [];
	        var oc = {};
	        if (typeof r.ideal === 'number') {
	          oc[oldname_('min', key)] = r.ideal;
	          cc.optional.push(oc);
	          oc = {};
	          oc[oldname_('max', key)] = r.ideal;
	          cc.optional.push(oc);
	        } else {
	          oc[oldname_('', key)] = r.ideal;
	          cc.optional.push(oc);
	        }
	      }
	      if (r.exact !== undefined && typeof r.exact !== 'number') {
	        cc.mandatory = cc.mandatory || {};
	        cc.mandatory[oldname_('', key)] = r.exact;
	      } else {
	        ['min', 'max'].forEach(function(mix) {
	          if (r[mix] !== undefined) {
	            cc.mandatory = cc.mandatory || {};
	            cc.mandatory[oldname_(mix, key)] = r[mix];
	          }
	        });
	      }
	    });
	    if (c.advanced) {
	      cc.optional = (cc.optional || []).concat(c.advanced);
	    }
	    return cc;
	  };
	
	  var shimConstraints_ = function(constraints, func) {
	    constraints = JSON.parse(JSON.stringify(constraints));
	    if (constraints && typeof constraints.audio === 'object') {
	      var remap = function(obj, a, b) {
	        if (a in obj && !(b in obj)) {
	          obj[b] = obj[a];
	          delete obj[a];
	        }
	      };
	      constraints = JSON.parse(JSON.stringify(constraints));
	      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
	      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
	      constraints.audio = constraintsToChrome_(constraints.audio);
	    }
	    if (constraints && typeof constraints.video === 'object') {
	      // Shim facingMode for mobile & surface pro.
	      var face = constraints.video.facingMode;
	      face = face && ((typeof face === 'object') ? face : {ideal: face});
	      var getSupportedFacingModeLies = browserDetails.version < 61;
	
	      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
	                    face.ideal === 'user' || face.ideal === 'environment')) &&
	          !(navigator.mediaDevices.getSupportedConstraints &&
	            navigator.mediaDevices.getSupportedConstraints().facingMode &&
	            !getSupportedFacingModeLies)) {
	        delete constraints.video.facingMode;
	        var matches;
	        if (face.exact === 'environment' || face.ideal === 'environment') {
	          matches = ['back', 'rear'];
	        } else if (face.exact === 'user' || face.ideal === 'user') {
	          matches = ['front'];
	        }
	        if (matches) {
	          // Look for matches in label, or use last cam for back (typical).
	          return navigator.mediaDevices.enumerateDevices()
	          .then(function(devices) {
	            devices = devices.filter(function(d) {
	              return d.kind === 'videoinput';
	            });
	            var dev = devices.find(function(d) {
	              return matches.some(function(match) {
	                return d.label.toLowerCase().indexOf(match) !== -1;
	              });
	            });
	            if (!dev && devices.length && matches.indexOf('back') !== -1) {
	              dev = devices[devices.length - 1]; // more likely the back cam
	            }
	            if (dev) {
	              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
	                                                        {ideal: dev.deviceId};
	            }
	            constraints.video = constraintsToChrome_(constraints.video);
	            logging('chrome: ' + JSON.stringify(constraints));
	            return func(constraints);
	          });
	        }
	      }
	      constraints.video = constraintsToChrome_(constraints.video);
	    }
	    logging('chrome: ' + JSON.stringify(constraints));
	    return func(constraints);
	  };
	
	  var shimError_ = function(e) {
	    return {
	      name: {
	        PermissionDeniedError: 'NotAllowedError',
	        InvalidStateError: 'NotReadableError',
	        DevicesNotFoundError: 'NotFoundError',
	        ConstraintNotSatisfiedError: 'OverconstrainedError',
	        TrackStartError: 'NotReadableError',
	        MediaDeviceFailedDueToShutdown: 'NotReadableError',
	        MediaDeviceKillSwitchOn: 'NotReadableError'
	      }[e.name] || e.name,
	      message: e.message,
	      constraint: e.constraintName,
	      toString: function() {
	        return this.name + (this.message && ': ') + this.message;
	      }
	    };
	  };
	
	  var getUserMedia_ = function(constraints, onSuccess, onError) {
	    shimConstraints_(constraints, function(c) {
	      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
	        onError(shimError_(e));
	      });
	    });
	  };
	
	  navigator.getUserMedia = getUserMedia_;
	
	  // Returns the result of getUserMedia as a Promise.
	  var getUserMediaPromise_ = function(constraints) {
	    return new Promise(function(resolve, reject) {
	      navigator.getUserMedia(constraints, resolve, reject);
	    });
	  };
	
	  if (!navigator.mediaDevices) {
	    navigator.mediaDevices = {
	      getUserMedia: getUserMediaPromise_,
	      enumerateDevices: function() {
	        return new Promise(function(resolve) {
	          var kinds = {audio: 'audioinput', video: 'videoinput'};
	          return window.MediaStreamTrack.getSources(function(devices) {
	            resolve(devices.map(function(device) {
	              return {label: device.label,
	                kind: kinds[device.kind],
	                deviceId: device.id,
	                groupId: ''};
	            }));
	          });
	        });
	      },
	      getSupportedConstraints: function() {
	        return {
	          deviceId: true, echoCancellation: true, facingMode: true,
	          frameRate: true, height: true, width: true
	        };
	      }
	    };
	  }
	
	  // A shim for getUserMedia method on the mediaDevices object.
	  // TODO(KaptenJansson) remove once implemented in Chrome stable.
	  if (!navigator.mediaDevices.getUserMedia) {
	    navigator.mediaDevices.getUserMedia = function(constraints) {
	      return getUserMediaPromise_(constraints);
	    };
	  } else {
	    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
	    // function which returns a Promise, it does not accept spec-style
	    // constraints.
	    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = function(cs) {
	      return shimConstraints_(cs, function(c) {
	        return origGetUserMedia(c).then(function(stream) {
	          if (c.audio && !stream.getAudioTracks().length ||
	              c.video && !stream.getVideoTracks().length) {
	            stream.getTracks().forEach(function(track) {
	              track.stop();
	            });
	            throw new DOMException('', 'NotFoundError');
	          }
	          return stream;
	        }, function(e) {
	          return Promise.reject(shimError_(e));
	        });
	      });
	    };
	  }
	
	  // Dummy devicechange event methods.
	  // TODO(KaptenJansson) remove once implemented in Chrome stable.
	  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
	    navigator.mediaDevices.addEventListener = function() {
	      logging('Dummy mediaDevices.addEventListener called.');
	    };
	  }
	  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
	    navigator.mediaDevices.removeEventListener = function() {
	      logging('Dummy mediaDevices.removeEventListener called.');
	    };
	  }
	};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	
	var utils = __webpack_require__(42);
	var shimRTCPeerConnection = __webpack_require__(46);
	
	module.exports = {
	  shimGetUserMedia: __webpack_require__(48),
	  shimPeerConnection: function(window) {
	    var browserDetails = utils.detectBrowser(window);
	
	    if (window.RTCIceGatherer) {
	      // ORTC defines an RTCIceCandidate object but no constructor.
	      // Not implemented in Edge.
	      if (!window.RTCIceCandidate) {
	        window.RTCIceCandidate = function(args) {
	          return args;
	        };
	      }
	      // ORTC does not have a session description object but
	      // other browsers (i.e. Chrome) that will support both PC and ORTC
	      // in the future might have this defined already.
	      if (!window.RTCSessionDescription) {
	        window.RTCSessionDescription = function(args) {
	          return args;
	        };
	      }
	      // this adds an additional event listener to MediaStrackTrack that signals
	      // when a tracks enabled property was changed. Workaround for a bug in
	      // addStream, see below. No longer required in 15025+
	      if (browserDetails.version < 15025) {
	        var origMSTEnabled = Object.getOwnPropertyDescriptor(
	            window.MediaStreamTrack.prototype, 'enabled');
	        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
	          set: function(value) {
	            origMSTEnabled.set.call(this, value);
	            var ev = new Event('enabled');
	            ev.enabled = value;
	            this.dispatchEvent(ev);
	          }
	        });
	      }
	    }
	    window.RTCPeerConnection =
	        shimRTCPeerConnection(window, browserDetails.version);
	  },
	  shimReplaceTrack: function(window) {
	    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
	    if (window.RTCRtpSender &&
	        !('replaceTrack' in window.RTCRtpSender.prototype)) {
	      window.RTCRtpSender.prototype.replaceTrack =
	          window.RTCRtpSender.prototype.setTrack;
	    }
	  }
	};


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	
	var SDPUtils = __webpack_require__(47);
	
	// sort tracks such that they follow an a-v-a-v...
	// pattern.
	function sortTracks(tracks) {
	  var audioTracks = tracks.filter(function(track) {
	    return track.kind === 'audio';
	  });
	  var videoTracks = tracks.filter(function(track) {
	    return track.kind === 'video';
	  });
	  tracks = [];
	  while (audioTracks.length || videoTracks.length) {
	    if (audioTracks.length) {
	      tracks.push(audioTracks.shift());
	    }
	    if (videoTracks.length) {
	      tracks.push(videoTracks.shift());
	    }
	  }
	  return tracks;
	}
	
	// Edge does not like
	// 1) stun:
	// 2) turn: that does not have all of turn:host:port?transport=udp
	// 3) turn: with ipv6 addresses
	// 4) turn: occurring muliple times
	function filterIceServers(iceServers, edgeVersion) {
	  var hasTurn = false;
	  iceServers = JSON.parse(JSON.stringify(iceServers));
	  return iceServers.filter(function(server) {
	    if (server && (server.urls || server.url)) {
	      var urls = server.urls || server.url;
	      if (server.url && !server.urls) {
	        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
	      }
	      var isString = typeof urls === 'string';
	      if (isString) {
	        urls = [urls];
	      }
	      urls = urls.filter(function(url) {
	        var validTurn = url.indexOf('turn:') === 0 &&
	            url.indexOf('transport=udp') !== -1 &&
	            url.indexOf('turn:[') === -1 &&
	            !hasTurn;
	
	        if (validTurn) {
	          hasTurn = true;
	          return true;
	        }
	        return url.indexOf('stun:') === 0 && edgeVersion >= 14393;
	      });
	
	      delete server.url;
	      server.urls = isString ? urls[0] : urls;
	      return !!urls.length;
	    }
	    return false;
	  });
	}
	
	// Determines the intersection of local and remote capabilities.
	function getCommonCapabilities(localCapabilities, remoteCapabilities) {
	  var commonCapabilities = {
	    codecs: [],
	    headerExtensions: [],
	    fecMechanisms: []
	  };
	
	  var findCodecByPayloadType = function(pt, codecs) {
	    pt = parseInt(pt, 10);
	    for (var i = 0; i < codecs.length; i++) {
	      if (codecs[i].payloadType === pt ||
	          codecs[i].preferredPayloadType === pt) {
	        return codecs[i];
	      }
	    }
	  };
	
	  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
	    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
	    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
	    return lCodec && rCodec &&
	        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
	  };
	
	  localCapabilities.codecs.forEach(function(lCodec) {
	    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
	      var rCodec = remoteCapabilities.codecs[i];
	      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
	          lCodec.clockRate === rCodec.clockRate) {
	        if (lCodec.name.toLowerCase() === 'rtx' &&
	            lCodec.parameters && rCodec.parameters.apt) {
	          // for RTX we need to find the local rtx that has a apt
	          // which points to the same local codec as the remote one.
	          if (!rtxCapabilityMatches(lCodec, rCodec,
	              localCapabilities.codecs, remoteCapabilities.codecs)) {
	            continue;
	          }
	        }
	        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
	        // number of channels is the highest common number of channels
	        rCodec.numChannels = Math.min(lCodec.numChannels,
	            rCodec.numChannels);
	        // push rCodec so we reply with offerer payload type
	        commonCapabilities.codecs.push(rCodec);
	
	        // determine common feedback mechanisms
	        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
	          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
	            if (lCodec.rtcpFeedback[j].type === fb.type &&
	                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
	              return true;
	            }
	          }
	          return false;
	        });
	        // FIXME: also need to determine .parameters
	        //  see https://github.com/openpeer/ortc/issues/569
	        break;
	      }
	    }
	  });
	
	  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
	    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
	         i++) {
	      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
	      if (lHeaderExtension.uri === rHeaderExtension.uri) {
	        commonCapabilities.headerExtensions.push(rHeaderExtension);
	        break;
	      }
	    }
	  });
	
	  // FIXME: fecMechanisms
	  return commonCapabilities;
	}
	
	// is action=setLocalDescription with type allowed in signalingState
	function isActionAllowedInSignalingState(action, type, signalingState) {
	  return {
	    offer: {
	      setLocalDescription: ['stable', 'have-local-offer'],
	      setRemoteDescription: ['stable', 'have-remote-offer']
	    },
	    answer: {
	      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
	      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
	    }
	  }[type][action].indexOf(signalingState) !== -1;
	}
	
	module.exports = function(window, edgeVersion) {
	  var RTCPeerConnection = function(config) {
	    var self = this;
	
	    var _eventTarget = document.createDocumentFragment();
	    ['addEventListener', 'removeEventListener', 'dispatchEvent']
	        .forEach(function(method) {
	          self[method] = _eventTarget[method].bind(_eventTarget);
	        });
	
	    this.needNegotiation = false;
	
	    this.onicecandidate = null;
	    this.onaddstream = null;
	    this.ontrack = null;
	    this.onremovestream = null;
	    this.onsignalingstatechange = null;
	    this.oniceconnectionstatechange = null;
	    this.onicegatheringstatechange = null;
	    this.onnegotiationneeded = null;
	    this.ondatachannel = null;
	    this.canTrickleIceCandidates = null;
	
	    this.localStreams = [];
	    this.remoteStreams = [];
	    this.getLocalStreams = function() {
	      return self.localStreams;
	    };
	    this.getRemoteStreams = function() {
	      return self.remoteStreams;
	    };
	
	    this.localDescription = new window.RTCSessionDescription({
	      type: '',
	      sdp: ''
	    });
	    this.remoteDescription = new window.RTCSessionDescription({
	      type: '',
	      sdp: ''
	    });
	    this.signalingState = 'stable';
	    this.iceConnectionState = 'new';
	    this.iceGatheringState = 'new';
	
	    this.iceOptions = {
	      gatherPolicy: 'all',
	      iceServers: []
	    };
	    if (config && config.iceTransportPolicy) {
	      switch (config.iceTransportPolicy) {
	        case 'all':
	        case 'relay':
	          this.iceOptions.gatherPolicy = config.iceTransportPolicy;
	          break;
	        default:
	          // don't set iceTransportPolicy.
	          break;
	      }
	    }
	    this.usingBundle = config && config.bundlePolicy === 'max-bundle';
	
	    if (config && config.iceServers) {
	      this.iceOptions.iceServers = filterIceServers(config.iceServers,
	          edgeVersion);
	    }
	    this._config = config || {};
	
	    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
	    // everything that is needed to describe a SDP m-line.
	    this.transceivers = [];
	
	    // since the iceGatherer is currently created in createOffer but we
	    // must not emit candidates until after setLocalDescription we buffer
	    // them in this array.
	    this._localIceCandidatesBuffer = [];
	  };
	
	  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
	    var event = new Event('icegatheringstatechange');
	    this.dispatchEvent(event);
	    if (this.onicegatheringstatechange !== null) {
	      this.onicegatheringstatechange(event);
	    }
	  };
	
	  RTCPeerConnection.prototype._emitBufferedCandidates = function() {
	    var self = this;
	    var sections = SDPUtils.splitSections(self.localDescription.sdp);
	    // FIXME: need to apply ice candidates in a way which is async but
	    // in-order
	    this._localIceCandidatesBuffer.forEach(function(event) {
	      var end = !event.candidate || Object.keys(event.candidate).length === 0;
	      if (end) {
	        for (var j = 1; j < sections.length; j++) {
	          if (sections[j].indexOf('\r\na=end-of-candidates\r\n') === -1) {
	            sections[j] += 'a=end-of-candidates\r\n';
	          }
	        }
	      } else {
	        sections[event.candidate.sdpMLineIndex + 1] +=
	            'a=' + event.candidate.candidate + '\r\n';
	      }
	      self.localDescription.sdp = sections.join('');
	      self.dispatchEvent(event);
	      if (self.onicecandidate !== null) {
	        self.onicecandidate(event);
	      }
	      if (!event.candidate && self.iceGatheringState !== 'complete') {
	        var complete = self.transceivers.every(function(transceiver) {
	          return transceiver.iceGatherer &&
	              transceiver.iceGatherer.state === 'completed';
	        });
	        if (complete && self.iceGatheringStateChange !== 'complete') {
	          self.iceGatheringState = 'complete';
	          self._emitGatheringStateChange();
	        }
	      }
	    });
	    this._localIceCandidatesBuffer = [];
	  };
	
	  RTCPeerConnection.prototype.getConfiguration = function() {
	    return this._config;
	  };
	
	  // internal helper to create a transceiver object.
	  // (whih is not yet the same as the WebRTC 1.0 transceiver)
	  RTCPeerConnection.prototype._createTransceiver = function(kind) {
	    var hasBundleTransport = this.transceivers.length > 0;
	    var transceiver = {
	      track: null,
	      iceGatherer: null,
	      iceTransport: null,
	      dtlsTransport: null,
	      localCapabilities: null,
	      remoteCapabilities: null,
	      rtpSender: null,
	      rtpReceiver: null,
	      kind: kind,
	      mid: null,
	      sendEncodingParameters: null,
	      recvEncodingParameters: null,
	      stream: null,
	      wantReceive: true
	    };
	    if (this.usingBundle && hasBundleTransport) {
	      transceiver.iceTransport = this.transceivers[0].iceTransport;
	      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
	    } else {
	      var transports = this._createIceAndDtlsTransports();
	      transceiver.iceTransport = transports.iceTransport;
	      transceiver.dtlsTransport = transports.dtlsTransport;
	    }
	    this.transceivers.push(transceiver);
	    return transceiver;
	  };
	
	  RTCPeerConnection.prototype.addTrack = function(track, stream) {
	    var transceiver;
	    for (var i = 0; i < this.transceivers.length; i++) {
	      if (!this.transceivers[i].track &&
	          this.transceivers[i].kind === track.kind) {
	        transceiver = this.transceivers[i];
	      }
	    }
	    if (!transceiver) {
	      transceiver = this._createTransceiver(track.kind);
	    }
	
	    transceiver.track = track;
	    transceiver.stream = stream;
	    transceiver.rtpSender = new window.RTCRtpSender(track,
	        transceiver.dtlsTransport);
	
	    this._maybeFireNegotiationNeeded();
	    return transceiver.rtpSender;
	  };
	
	  RTCPeerConnection.prototype.addStream = function(stream) {
	    var self = this;
	    if (edgeVersion >= 15025) {
	      this.localStreams.push(stream);
	      stream.getTracks().forEach(function(track) {
	        self.addTrack(track, stream);
	      });
	    } else {
	      // Clone is necessary for local demos mostly, attaching directly
	      // to two different senders does not work (build 10547).
	      // Fixed in 15025 (or earlier)
	      var clonedStream = stream.clone();
	      stream.getTracks().forEach(function(track, idx) {
	        var clonedTrack = clonedStream.getTracks()[idx];
	        track.addEventListener('enabled', function(event) {
	          clonedTrack.enabled = event.enabled;
	        });
	      });
	      clonedStream.getTracks().forEach(function(track) {
	        self.addTrack(track, clonedStream);
	      });
	      this.localStreams.push(clonedStream);
	    }
	    this._maybeFireNegotiationNeeded();
	  };
	
	  RTCPeerConnection.prototype.removeStream = function(stream) {
	    var idx = this.localStreams.indexOf(stream);
	    if (idx > -1) {
	      this.localStreams.splice(idx, 1);
	      this._maybeFireNegotiationNeeded();
	    }
	  };
	
	  RTCPeerConnection.prototype.getSenders = function() {
	    return this.transceivers.filter(function(transceiver) {
	      return !!transceiver.rtpSender;
	    })
	    .map(function(transceiver) {
	      return transceiver.rtpSender;
	    });
	  };
	
	  RTCPeerConnection.prototype.getReceivers = function() {
	    return this.transceivers.filter(function(transceiver) {
	      return !!transceiver.rtpReceiver;
	    })
	    .map(function(transceiver) {
	      return transceiver.rtpReceiver;
	    });
	  };
	
	  // Create ICE gatherer and hook it up.
	  RTCPeerConnection.prototype._createIceGatherer = function(mid,
	      sdpMLineIndex) {
	    var self = this;
	    var iceGatherer = new window.RTCIceGatherer(self.iceOptions);
	    iceGatherer.onlocalcandidate = function(evt) {
	      var event = new Event('icecandidate');
	      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};
	
	      var cand = evt.candidate;
	      var end = !cand || Object.keys(cand).length === 0;
	      // Edge emits an empty object for RTCIceCandidateComplete‥
	      if (end) {
	        // polyfill since RTCIceGatherer.state is not implemented in
	        // Edge 10547 yet.
	        if (iceGatherer.state === undefined) {
	          iceGatherer.state = 'completed';
	        }
	      } else {
	        // RTCIceCandidate doesn't have a component, needs to be added
	        cand.component = 1;
	        event.candidate.candidate = SDPUtils.writeCandidate(cand);
	      }
	
	      // update local description.
	      var sections = SDPUtils.splitSections(self.localDescription.sdp);
	      if (!end) {
	        sections[event.candidate.sdpMLineIndex + 1] +=
	            'a=' + event.candidate.candidate + '\r\n';
	      } else {
	        sections[event.candidate.sdpMLineIndex + 1] +=
	            'a=end-of-candidates\r\n';
	      }
	      self.localDescription.sdp = sections.join('');
	      var transceivers = self._pendingOffer ? self._pendingOffer :
	          self.transceivers;
	      var complete = transceivers.every(function(transceiver) {
	        return transceiver.iceGatherer &&
	            transceiver.iceGatherer.state === 'completed';
	      });
	
	      // Emit candidate if localDescription is set.
	      // Also emits null candidate when all gatherers are complete.
	      switch (self.iceGatheringState) {
	        case 'new':
	          if (!end) {
	            self._localIceCandidatesBuffer.push(event);
	          }
	          if (end && complete) {
	            self._localIceCandidatesBuffer.push(
	                new Event('icecandidate'));
	          }
	          break;
	        case 'gathering':
	          self._emitBufferedCandidates();
	          if (!end) {
	            self.dispatchEvent(event);
	            if (self.onicecandidate !== null) {
	              self.onicecandidate(event);
	            }
	          }
	          if (complete) {
	            self.dispatchEvent(new Event('icecandidate'));
	            if (self.onicecandidate !== null) {
	              self.onicecandidate(new Event('icecandidate'));
	            }
	            self.iceGatheringState = 'complete';
	            self._emitGatheringStateChange();
	          }
	          break;
	        case 'complete':
	          // should not happen... currently!
	          break;
	        default: // no-op.
	          break;
	      }
	    };
	    return iceGatherer;
	  };
	
	  // Create ICE transport and DTLS transport.
	  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
	    var self = this;
	    var iceTransport = new window.RTCIceTransport(null);
	    iceTransport.onicestatechange = function() {
	      self._updateConnectionState();
	    };
	
	    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
	    dtlsTransport.ondtlsstatechange = function() {
	      self._updateConnectionState();
	    };
	    dtlsTransport.onerror = function() {
	      // onerror does not set state to failed by itself.
	      Object.defineProperty(dtlsTransport, 'state',
	          {value: 'failed', writable: true});
	      self._updateConnectionState();
	    };
	
	    return {
	      iceTransport: iceTransport,
	      dtlsTransport: dtlsTransport
	    };
	  };
	
	  // Destroy ICE gatherer, ICE transport and DTLS transport.
	  // Without triggering the callbacks.
	  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
	      sdpMLineIndex) {
	    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
	    if (iceGatherer) {
	      delete iceGatherer.onlocalcandidate;
	      delete this.transceivers[sdpMLineIndex].iceGatherer;
	    }
	    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
	    if (iceTransport) {
	      delete iceTransport.onicestatechange;
	      delete this.transceivers[sdpMLineIndex].iceTransport;
	    }
	    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
	    if (dtlsTransport) {
	      delete dtlsTransport.ondtlssttatechange;
	      delete dtlsTransport.onerror;
	      delete this.transceivers[sdpMLineIndex].dtlsTransport;
	    }
	  };
	
	  // Start the RTP Sender and Receiver for a transceiver.
	  RTCPeerConnection.prototype._transceive = function(transceiver,
	      send, recv) {
	    var params = getCommonCapabilities(transceiver.localCapabilities,
	        transceiver.remoteCapabilities);
	    if (send && transceiver.rtpSender) {
	      params.encodings = transceiver.sendEncodingParameters;
	      params.rtcp = {
	        cname: SDPUtils.localCName,
	        compound: transceiver.rtcpParameters.compound
	      };
	      if (transceiver.recvEncodingParameters.length) {
	        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
	      }
	      transceiver.rtpSender.send(params);
	    }
	    if (recv && transceiver.rtpReceiver) {
	      // remove RTX field in Edge 14942
	      if (transceiver.kind === 'video'
	          && transceiver.recvEncodingParameters
	          && edgeVersion < 15019) {
	        transceiver.recvEncodingParameters.forEach(function(p) {
	          delete p.rtx;
	        });
	      }
	      params.encodings = transceiver.recvEncodingParameters;
	      params.rtcp = {
	        cname: transceiver.rtcpParameters.cname,
	        compound: transceiver.rtcpParameters.compound
	      };
	      if (transceiver.sendEncodingParameters.length) {
	        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
	      }
	      transceiver.rtpReceiver.receive(params);
	    }
	  };
	
	  RTCPeerConnection.prototype.setLocalDescription = function(description) {
	    var self = this;
	
	    if (!isActionAllowedInSignalingState('setLocalDescription',
	        description.type, this.signalingState)) {
	      var e = new Error('Can not set local ' + description.type +
	          ' in state ' + this.signalingState);
	      e.name = 'InvalidStateError';
	      if (arguments.length > 2 && typeof arguments[2] === 'function') {
	        window.setTimeout(arguments[2], 0, e);
	      }
	      return Promise.reject(e);
	    }
	
	    var sections;
	    var sessionpart;
	    if (description.type === 'offer') {
	      // FIXME: What was the purpose of this empty if statement?
	      // if (!this._pendingOffer) {
	      // } else {
	      if (this._pendingOffer) {
	        // VERY limited support for SDP munging. Limited to:
	        // * changing the order of codecs
	        sections = SDPUtils.splitSections(description.sdp);
	        sessionpart = sections.shift();
	        sections.forEach(function(mediaSection, sdpMLineIndex) {
	          var caps = SDPUtils.parseRtpParameters(mediaSection);
	          self._pendingOffer[sdpMLineIndex].localCapabilities = caps;
	        });
	        this.transceivers = this._pendingOffer;
	        delete this._pendingOffer;
	      }
	    } else if (description.type === 'answer') {
	      sections = SDPUtils.splitSections(self.remoteDescription.sdp);
	      sessionpart = sections.shift();
	      var isIceLite = SDPUtils.matchPrefix(sessionpart,
	          'a=ice-lite').length > 0;
	      sections.forEach(function(mediaSection, sdpMLineIndex) {
	        var transceiver = self.transceivers[sdpMLineIndex];
	        var iceGatherer = transceiver.iceGatherer;
	        var iceTransport = transceiver.iceTransport;
	        var dtlsTransport = transceiver.dtlsTransport;
	        var localCapabilities = transceiver.localCapabilities;
	        var remoteCapabilities = transceiver.remoteCapabilities;
	
	        var rejected = SDPUtils.isRejected(mediaSection);
	
	        if (!rejected && !transceiver.isDatachannel) {
	          var remoteIceParameters = SDPUtils.getIceParameters(
	              mediaSection, sessionpart);
	          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
	              mediaSection, sessionpart);
	          if (isIceLite) {
	            remoteDtlsParameters.role = 'server';
	          }
	
	          if (!self.usingBundle || sdpMLineIndex === 0) {
	            iceTransport.start(iceGatherer, remoteIceParameters,
	                isIceLite ? 'controlling' : 'controlled');
	            dtlsTransport.start(remoteDtlsParameters);
	          }
	
	          // Calculate intersection of capabilities.
	          var params = getCommonCapabilities(localCapabilities,
	              remoteCapabilities);
	
	          // Start the RTCRtpSender. The RTCRtpReceiver for this
	          // transceiver has already been started in setRemoteDescription.
	          self._transceive(transceiver,
	              params.codecs.length > 0,
	              false);
	        }
	      });
	    }
	
	    this.localDescription = {
	      type: description.type,
	      sdp: description.sdp
	    };
	    switch (description.type) {
	      case 'offer':
	        this._updateSignalingState('have-local-offer');
	        break;
	      case 'answer':
	        this._updateSignalingState('stable');
	        break;
	      default:
	        throw new TypeError('unsupported type "' + description.type +
	            '"');
	    }
	
	    // If a success callback was provided, emit ICE candidates after it
	    // has been executed. Otherwise, emit callback after the Promise is
	    // resolved.
	    var hasCallback = arguments.length > 1 &&
	      typeof arguments[1] === 'function';
	    if (hasCallback) {
	      var cb = arguments[1];
	      window.setTimeout(function() {
	        cb();
	        if (self.iceGatheringState === 'new') {
	          self.iceGatheringState = 'gathering';
	          self._emitGatheringStateChange();
	        }
	        self._emitBufferedCandidates();
	      }, 0);
	    }
	    var p = Promise.resolve();
	    p.then(function() {
	      if (!hasCallback) {
	        if (self.iceGatheringState === 'new') {
	          self.iceGatheringState = 'gathering';
	          self._emitGatheringStateChange();
	        }
	        // Usually candidates will be emitted earlier.
	        window.setTimeout(self._emitBufferedCandidates.bind(self), 500);
	      }
	    });
	    return p;
	  };
	
	  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
	    var self = this;
	
	    if (!isActionAllowedInSignalingState('setRemoteDescription',
	        description.type, this.signalingState)) {
	      var e = new Error('Can not set remote ' + description.type +
	          ' in state ' + this.signalingState);
	      e.name = 'InvalidStateError';
	      if (arguments.length > 2 && typeof arguments[2] === 'function') {
	        window.setTimeout(arguments[2], 0, e);
	      }
	      return Promise.reject(e);
	    }
	
	    var streams = {};
	    var receiverList = [];
	    var sections = SDPUtils.splitSections(description.sdp);
	    var sessionpart = sections.shift();
	    var isIceLite = SDPUtils.matchPrefix(sessionpart,
	        'a=ice-lite').length > 0;
	    var usingBundle = SDPUtils.matchPrefix(sessionpart,
	        'a=group:BUNDLE ').length > 0;
	    this.usingBundle = usingBundle;
	    var iceOptions = SDPUtils.matchPrefix(sessionpart,
	        'a=ice-options:')[0];
	    if (iceOptions) {
	      this.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
	          .indexOf('trickle') >= 0;
	    } else {
	      this.canTrickleIceCandidates = false;
	    }
	
	    sections.forEach(function(mediaSection, sdpMLineIndex) {
	      var lines = SDPUtils.splitLines(mediaSection);
	      var kind = SDPUtils.getKind(mediaSection);
	      var rejected = SDPUtils.isRejected(mediaSection);
	      var protocol = lines[0].substr(2).split(' ')[2];
	
	      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
	      var remoteMsid = SDPUtils.parseMsid(mediaSection);
	
	      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();
	
	      // Reject datachannels which are not implemented yet.
	      if (kind === 'application' && protocol === 'DTLS/SCTP') {
	        self.transceivers[sdpMLineIndex] = {
	          mid: mid,
	          isDatachannel: true
	        };
	        return;
	      }
	
	      var transceiver;
	      var iceGatherer;
	      var iceTransport;
	      var dtlsTransport;
	      var rtpReceiver;
	      var sendEncodingParameters;
	      var recvEncodingParameters;
	      var localCapabilities;
	
	      var track;
	      // FIXME: ensure the mediaSection has rtcp-mux set.
	      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
	      var remoteIceParameters;
	      var remoteDtlsParameters;
	      if (!rejected) {
	        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
	            sessionpart);
	        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
	            sessionpart);
	        remoteDtlsParameters.role = 'client';
	      }
	      recvEncodingParameters =
	          SDPUtils.parseRtpEncodingParameters(mediaSection);
	
	      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
	
	      var isComplete = SDPUtils.matchPrefix(mediaSection,
	          'a=end-of-candidates', sessionpart).length > 0;
	      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
	          .map(function(cand) {
	            return SDPUtils.parseCandidate(cand);
	          })
	          .filter(function(cand) {
	            return cand.component === '1' || cand.component === 1;
	          });
	
	      // Check if we can use BUNDLE and dispose transports.
	      if ((description.type === 'offer' || description.type === 'answer') &&
	          !rejected && usingBundle && sdpMLineIndex > 0 &&
	          self.transceivers[sdpMLineIndex]) {
	        self._disposeIceAndDtlsTransports(sdpMLineIndex);
	        self.transceivers[sdpMLineIndex].iceGatherer =
	            self.transceivers[0].iceGatherer;
	        self.transceivers[sdpMLineIndex].iceTransport =
	            self.transceivers[0].iceTransport;
	        self.transceivers[sdpMLineIndex].dtlsTransport =
	            self.transceivers[0].dtlsTransport;
	        if (self.transceivers[sdpMLineIndex].rtpSender) {
	          self.transceivers[sdpMLineIndex].rtpSender.setTransport(
	              self.transceivers[0].dtlsTransport);
	        }
	        if (self.transceivers[sdpMLineIndex].rtpReceiver) {
	          self.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
	              self.transceivers[0].dtlsTransport);
	        }
	      }
	      if (description.type === 'offer' && !rejected) {
	        transceiver = self.transceivers[sdpMLineIndex] ||
	            self._createTransceiver(kind);
	        transceiver.mid = mid;
	
	        if (!transceiver.iceGatherer) {
	          transceiver.iceGatherer = usingBundle && sdpMLineIndex > 0 ?
	              self.transceivers[0].iceGatherer :
	              self._createIceGatherer(mid, sdpMLineIndex);
	        }
	
	        if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
	          transceiver.iceTransport.setRemoteCandidates(cands);
	        }
	
	        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);
	
	        // filter RTX until additional stuff needed for RTX is implemented
	        // in adapter.js
	        if (edgeVersion < 15019) {
	          localCapabilities.codecs = localCapabilities.codecs.filter(
	              function(codec) {
	                return codec.name !== 'rtx';
	              });
	        }
	
	        sendEncodingParameters = [{
	          ssrc: (2 * sdpMLineIndex + 2) * 1001
	        }];
	
	        if (direction === 'sendrecv' || direction === 'sendonly') {
	          rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport,
	              kind);
	
	          track = rtpReceiver.track;
	          // FIXME: does not work with Plan B.
	          if (remoteMsid) {
	            if (!streams[remoteMsid.stream]) {
	              streams[remoteMsid.stream] = new window.MediaStream();
	              Object.defineProperty(streams[remoteMsid.stream], 'id', {
	                get: function() {
	                  return remoteMsid.stream;
	                }
	              });
	            }
	            Object.defineProperty(track, 'id', {
	              get: function() {
	                return remoteMsid.track;
	              }
	            });
	            streams[remoteMsid.stream].addTrack(track);
	            receiverList.push([track, rtpReceiver,
	              streams[remoteMsid.stream]]);
	          } else {
	            if (!streams.default) {
	              streams.default = new window.MediaStream();
	            }
	            streams.default.addTrack(track);
	            receiverList.push([track, rtpReceiver, streams.default]);
	          }
	        }
	
	        transceiver.localCapabilities = localCapabilities;
	        transceiver.remoteCapabilities = remoteCapabilities;
	        transceiver.rtpReceiver = rtpReceiver;
	        transceiver.rtcpParameters = rtcpParameters;
	        transceiver.sendEncodingParameters = sendEncodingParameters;
	        transceiver.recvEncodingParameters = recvEncodingParameters;
	
	        // Start the RTCRtpReceiver now. The RTPSender is started in
	        // setLocalDescription.
	        self._transceive(self.transceivers[sdpMLineIndex],
	            false,
	            direction === 'sendrecv' || direction === 'sendonly');
	      } else if (description.type === 'answer' && !rejected) {
	        transceiver = self.transceivers[sdpMLineIndex];
	        iceGatherer = transceiver.iceGatherer;
	        iceTransport = transceiver.iceTransport;
	        dtlsTransport = transceiver.dtlsTransport;
	        rtpReceiver = transceiver.rtpReceiver;
	        sendEncodingParameters = transceiver.sendEncodingParameters;
	        localCapabilities = transceiver.localCapabilities;
	
	        self.transceivers[sdpMLineIndex].recvEncodingParameters =
	            recvEncodingParameters;
	        self.transceivers[sdpMLineIndex].remoteCapabilities =
	            remoteCapabilities;
	        self.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;
	
	        if ((isIceLite || isComplete) && cands.length) {
	          iceTransport.setRemoteCandidates(cands);
	        }
	        if (!usingBundle || sdpMLineIndex === 0) {
	          iceTransport.start(iceGatherer, remoteIceParameters,
	              'controlling');
	          dtlsTransport.start(remoteDtlsParameters);
	        }
	
	        self._transceive(transceiver,
	            direction === 'sendrecv' || direction === 'recvonly',
	            direction === 'sendrecv' || direction === 'sendonly');
	
	        if (rtpReceiver &&
	            (direction === 'sendrecv' || direction === 'sendonly')) {
	          track = rtpReceiver.track;
	          if (remoteMsid) {
	            if (!streams[remoteMsid.stream]) {
	              streams[remoteMsid.stream] = new window.MediaStream();
	            }
	            streams[remoteMsid.stream].addTrack(track);
	            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
	          } else {
	            if (!streams.default) {
	              streams.default = new window.MediaStream();
	            }
	            streams.default.addTrack(track);
	            receiverList.push([track, rtpReceiver, streams.default]);
	          }
	        } else {
	          // FIXME: actually the receiver should be created later.
	          delete transceiver.rtpReceiver;
	        }
	      }
	    });
	
	    this.remoteDescription = {
	      type: description.type,
	      sdp: description.sdp
	    };
	    switch (description.type) {
	      case 'offer':
	        this._updateSignalingState('have-remote-offer');
	        break;
	      case 'answer':
	        this._updateSignalingState('stable');
	        break;
	      default:
	        throw new TypeError('unsupported type "' + description.type +
	            '"');
	    }
	    Object.keys(streams).forEach(function(sid) {
	      var stream = streams[sid];
	      if (stream.getTracks().length) {
	        self.remoteStreams.push(stream);
	        var event = new Event('addstream');
	        event.stream = stream;
	        self.dispatchEvent(event);
	        if (self.onaddstream !== null) {
	          window.setTimeout(function() {
	            self.onaddstream(event);
	          }, 0);
	        }
	
	        receiverList.forEach(function(item) {
	          var track = item[0];
	          var receiver = item[1];
	          if (stream.id !== item[2].id) {
	            return;
	          }
	          var trackEvent = new Event('track');
	          trackEvent.track = track;
	          trackEvent.receiver = receiver;
	          trackEvent.streams = [stream];
	          self.dispatchEvent(trackEvent);
	          if (self.ontrack !== null) {
	            window.setTimeout(function() {
	              self.ontrack(trackEvent);
	            }, 0);
	          }
	        });
	      }
	    });
	
	    // check whether addIceCandidate({}) was called within four seconds after
	    // setRemoteDescription.
	    window.setTimeout(function() {
	      if (!(self && self.transceivers)) {
	        return;
	      }
	      self.transceivers.forEach(function(transceiver) {
	        if (transceiver.iceTransport &&
	            transceiver.iceTransport.state === 'new' &&
	            transceiver.iceTransport.getRemoteCandidates().length > 0) {
	          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
	              'an end-of-candidates notification');
	          transceiver.iceTransport.addRemoteCandidate({});
	        }
	      });
	    }, 4000);
	
	    if (arguments.length > 1 && typeof arguments[1] === 'function') {
	      window.setTimeout(arguments[1], 0);
	    }
	    return Promise.resolve();
	  };
	
	  RTCPeerConnection.prototype.close = function() {
	    this.transceivers.forEach(function(transceiver) {
	      /* not yet
	      if (transceiver.iceGatherer) {
	        transceiver.iceGatherer.close();
	      }
	      */
	      if (transceiver.iceTransport) {
	        transceiver.iceTransport.stop();
	      }
	      if (transceiver.dtlsTransport) {
	        transceiver.dtlsTransport.stop();
	      }
	      if (transceiver.rtpSender) {
	        transceiver.rtpSender.stop();
	      }
	      if (transceiver.rtpReceiver) {
	        transceiver.rtpReceiver.stop();
	      }
	    });
	    // FIXME: clean up tracks, local streams, remote streams, etc
	    this._updateSignalingState('closed');
	  };
	
	  // Update the signaling state.
	  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
	    this.signalingState = newState;
	    var event = new Event('signalingstatechange');
	    this.dispatchEvent(event);
	    if (this.onsignalingstatechange !== null) {
	      this.onsignalingstatechange(event);
	    }
	  };
	
	  // Determine whether to fire the negotiationneeded event.
	  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
	    var self = this;
	    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
	      return;
	    }
	    this.needNegotiation = true;
	    window.setTimeout(function() {
	      if (self.needNegotiation === false) {
	        return;
	      }
	      self.needNegotiation = false;
	      var event = new Event('negotiationneeded');
	      self.dispatchEvent(event);
	      if (self.onnegotiationneeded !== null) {
	        self.onnegotiationneeded(event);
	      }
	    }, 0);
	  };
	
	  // Update the connection state.
	  RTCPeerConnection.prototype._updateConnectionState = function() {
	    var self = this;
	    var newState;
	    var states = {
	      'new': 0,
	      closed: 0,
	      connecting: 0,
	      checking: 0,
	      connected: 0,
	      completed: 0,
	      disconnected: 0,
	      failed: 0
	    };
	    this.transceivers.forEach(function(transceiver) {
	      states[transceiver.iceTransport.state]++;
	      states[transceiver.dtlsTransport.state]++;
	    });
	    // ICETransport.completed and connected are the same for this purpose.
	    states.connected += states.completed;
	
	    newState = 'new';
	    if (states.failed > 0) {
	      newState = 'failed';
	    } else if (states.connecting > 0 || states.checking > 0) {
	      newState = 'connecting';
	    } else if (states.disconnected > 0) {
	      newState = 'disconnected';
	    } else if (states.new > 0) {
	      newState = 'new';
	    } else if (states.connected > 0 || states.completed > 0) {
	      newState = 'connected';
	    }
	
	    if (newState !== self.iceConnectionState) {
	      self.iceConnectionState = newState;
	      var event = new Event('iceconnectionstatechange');
	      this.dispatchEvent(event);
	      if (this.oniceconnectionstatechange !== null) {
	        this.oniceconnectionstatechange(event);
	      }
	    }
	  };
	
	  RTCPeerConnection.prototype.createOffer = function() {
	    var self = this;
	    if (this._pendingOffer) {
	      throw new Error('createOffer called while there is a pending offer.');
	    }
	    var offerOptions;
	    if (arguments.length === 1 && typeof arguments[0] !== 'function') {
	      offerOptions = arguments[0];
	    } else if (arguments.length === 3) {
	      offerOptions = arguments[2];
	    }
	
	    var numAudioTracks = this.transceivers.filter(function(t) {
	      return t.kind === 'audio';
	    }).length;
	    var numVideoTracks = this.transceivers.filter(function(t) {
	      return t.kind === 'video';
	    }).length;
	
	    // Determine number of audio and video tracks we need to send/recv.
	    if (offerOptions) {
	      // Reject Chrome legacy constraints.
	      if (offerOptions.mandatory || offerOptions.optional) {
	        throw new TypeError(
	            'Legacy mandatory/optional constraints not supported.');
	      }
	      if (offerOptions.offerToReceiveAudio !== undefined) {
	        if (offerOptions.offerToReceiveAudio === true) {
	          numAudioTracks = 1;
	        } else if (offerOptions.offerToReceiveAudio === false) {
	          numAudioTracks = 0;
	        } else {
	          numAudioTracks = offerOptions.offerToReceiveAudio;
	        }
	      }
	      if (offerOptions.offerToReceiveVideo !== undefined) {
	        if (offerOptions.offerToReceiveVideo === true) {
	          numVideoTracks = 1;
	        } else if (offerOptions.offerToReceiveVideo === false) {
	          numVideoTracks = 0;
	        } else {
	          numVideoTracks = offerOptions.offerToReceiveVideo;
	        }
	      }
	    }
	
	    this.transceivers.forEach(function(transceiver) {
	      if (transceiver.kind === 'audio') {
	        numAudioTracks--;
	        if (numAudioTracks < 0) {
	          transceiver.wantReceive = false;
	        }
	      } else if (transceiver.kind === 'video') {
	        numVideoTracks--;
	        if (numVideoTracks < 0) {
	          transceiver.wantReceive = false;
	        }
	      }
	    });
	
	    // Create M-lines for recvonly streams.
	    while (numAudioTracks > 0 || numVideoTracks > 0) {
	      if (numAudioTracks > 0) {
	        this._createTransceiver('audio');
	        numAudioTracks--;
	      }
	      if (numVideoTracks > 0) {
	        this._createTransceiver('video');
	        numVideoTracks--;
	      }
	    }
	    // reorder tracks
	    var transceivers = sortTracks(this.transceivers);
	
	    var sdp = SDPUtils.writeSessionBoilerplate();
	    transceivers.forEach(function(transceiver, sdpMLineIndex) {
	      // For each track, create an ice gatherer, ice transport,
	      // dtls transport, potentially rtpsender and rtpreceiver.
	      var track = transceiver.track;
	      var kind = transceiver.kind;
	      var mid = SDPUtils.generateIdentifier();
	      transceiver.mid = mid;
	
	      if (!transceiver.iceGatherer) {
	        transceiver.iceGatherer = self.usingBundle && sdpMLineIndex > 0 ?
	            transceivers[0].iceGatherer :
	            self._createIceGatherer(mid, sdpMLineIndex);
	      }
	
	      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
	      // filter RTX until additional stuff needed for RTX is implemented
	      // in adapter.js
	      if (edgeVersion < 15019) {
	        localCapabilities.codecs = localCapabilities.codecs.filter(
	            function(codec) {
	              return codec.name !== 'rtx';
	            });
	      }
	      localCapabilities.codecs.forEach(function(codec) {
	        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
	        // by adding level-asymmetry-allowed=1
	        if (codec.name === 'H264' &&
	            codec.parameters['level-asymmetry-allowed'] === undefined) {
	          codec.parameters['level-asymmetry-allowed'] = '1';
	        }
	      });
	
	      // generate an ssrc now, to be used later in rtpSender.send
	      var sendEncodingParameters = [{
	        ssrc: (2 * sdpMLineIndex + 1) * 1001
	      }];
	      if (track) {
	        // add RTX
	        if (edgeVersion >= 15019 && kind === 'video') {
	          sendEncodingParameters[0].rtx = {
	            ssrc: (2 * sdpMLineIndex + 1) * 1001 + 1
	          };
	        }
	      }
	
	      if (transceiver.wantReceive) {
	        transceiver.rtpReceiver = new window.RTCRtpReceiver(
	          transceiver.dtlsTransport,
	          kind
	        );
	      }
	
	      transceiver.localCapabilities = localCapabilities;
	      transceiver.sendEncodingParameters = sendEncodingParameters;
	    });
	
	    // always offer BUNDLE and dispose on return if not supported.
	    if (this._config.bundlePolicy !== 'max-compat') {
	      sdp += 'a=group:BUNDLE ' + transceivers.map(function(t) {
	        return t.mid;
	      }).join(' ') + '\r\n';
	    }
	    sdp += 'a=ice-options:trickle\r\n';
	
	    transceivers.forEach(function(transceiver, sdpMLineIndex) {
	      sdp += SDPUtils.writeMediaSection(transceiver,
	          transceiver.localCapabilities, 'offer', transceiver.stream);
	      sdp += 'a=rtcp-rsize\r\n';
	    });
	
	    this._pendingOffer = transceivers;
	    var desc = new window.RTCSessionDescription({
	      type: 'offer',
	      sdp: sdp
	    });
	    if (arguments.length && typeof arguments[0] === 'function') {
	      window.setTimeout(arguments[0], 0, desc);
	    }
	    return Promise.resolve(desc);
	  };
	
	  RTCPeerConnection.prototype.createAnswer = function() {
	    var sdp = SDPUtils.writeSessionBoilerplate();
	    if (this.usingBundle) {
	      sdp += 'a=group:BUNDLE ' + this.transceivers.map(function(t) {
	        return t.mid;
	      }).join(' ') + '\r\n';
	    }
	    this.transceivers.forEach(function(transceiver, sdpMLineIndex) {
	      if (transceiver.isDatachannel) {
	        sdp += 'm=application 0 DTLS/SCTP 5000\r\n' +
	            'c=IN IP4 0.0.0.0\r\n' +
	            'a=mid:' + transceiver.mid + '\r\n';
	        return;
	      }
	
	      // FIXME: look at direction.
	      if (transceiver.stream) {
	        var localTrack;
	        if (transceiver.kind === 'audio') {
	          localTrack = transceiver.stream.getAudioTracks()[0];
	        } else if (transceiver.kind === 'video') {
	          localTrack = transceiver.stream.getVideoTracks()[0];
	        }
	        if (localTrack) {
	          // add RTX
	          if (edgeVersion >= 15019 && transceiver.kind === 'video') {
	            transceiver.sendEncodingParameters[0].rtx = {
	              ssrc: (2 * sdpMLineIndex + 2) * 1001 + 1
	            };
	          }
	        }
	      }
	
	      // Calculate intersection of capabilities.
	      var commonCapabilities = getCommonCapabilities(
	          transceiver.localCapabilities,
	          transceiver.remoteCapabilities);
	
	      var hasRtx = commonCapabilities.codecs.filter(function(c) {
	        return c.name.toLowerCase() === 'rtx';
	      }).length;
	      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
	        delete transceiver.sendEncodingParameters[0].rtx;
	      }
	
	      sdp += SDPUtils.writeMediaSection(transceiver, commonCapabilities,
	          'answer', transceiver.stream);
	      if (transceiver.rtcpParameters &&
	          transceiver.rtcpParameters.reducedSize) {
	        sdp += 'a=rtcp-rsize\r\n';
	      }
	    });
	
	    var desc = new window.RTCSessionDescription({
	      type: 'answer',
	      sdp: sdp
	    });
	    if (arguments.length && typeof arguments[0] === 'function') {
	      window.setTimeout(arguments[0], 0, desc);
	    }
	    return Promise.resolve(desc);
	  };
	
	  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
	    if (!candidate) {
	      for (var j = 0; j < this.transceivers.length; j++) {
	        this.transceivers[j].iceTransport.addRemoteCandidate({});
	        if (this.usingBundle) {
	          return Promise.resolve();
	        }
	      }
	    } else {
	      var mLineIndex = candidate.sdpMLineIndex;
	      if (candidate.sdpMid) {
	        for (var i = 0; i < this.transceivers.length; i++) {
	          if (this.transceivers[i].mid === candidate.sdpMid) {
	            mLineIndex = i;
	            break;
	          }
	        }
	      }
	      var transceiver = this.transceivers[mLineIndex];
	      if (transceiver) {
	        var cand = Object.keys(candidate.candidate).length > 0 ?
	            SDPUtils.parseCandidate(candidate.candidate) : {};
	        // Ignore Chrome's invalid candidates since Edge does not like them.
	        if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
	          return Promise.resolve();
	        }
	        // Ignore RTCP candidates, we assume RTCP-MUX.
	        if (cand.component &&
	            !(cand.component === '1' || cand.component === 1)) {
	          return Promise.resolve();
	        }
	        transceiver.iceTransport.addRemoteCandidate(cand);
	
	        // update the remoteDescription.
	        var sections = SDPUtils.splitSections(this.remoteDescription.sdp);
	        sections[mLineIndex + 1] += (cand.type ? candidate.candidate.trim()
	            : 'a=end-of-candidates') + '\r\n';
	        this.remoteDescription.sdp = sections.join('');
	      }
	    }
	    if (arguments.length > 1 && typeof arguments[1] === 'function') {
	      window.setTimeout(arguments[1], 0);
	    }
	    return Promise.resolve();
	  };
	
	  RTCPeerConnection.prototype.getStats = function() {
	    var promises = [];
	    this.transceivers.forEach(function(transceiver) {
	      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
	        'dtlsTransport'].forEach(function(method) {
	          if (transceiver[method]) {
	            promises.push(transceiver[method].getStats());
	          }
	        });
	    });
	    var cb = arguments.length > 1 && typeof arguments[1] === 'function' &&
	        arguments[1];
	    var fixStatsType = function(stat) {
	      return {
	        inboundrtp: 'inbound-rtp',
	        outboundrtp: 'outbound-rtp',
	        candidatepair: 'candidate-pair',
	        localcandidate: 'local-candidate',
	        remotecandidate: 'remote-candidate'
	      }[stat.type] || stat.type;
	    };
	    return new Promise(function(resolve) {
	      // shim getStats with maplike support
	      var results = new Map();
	      Promise.all(promises).then(function(res) {
	        res.forEach(function(result) {
	          Object.keys(result).forEach(function(id) {
	            result[id].type = fixStatsType(result[id]);
	            results.set(id, result[id]);
	          });
	        });
	        if (cb) {
	          window.setTimeout(cb, 0, results);
	        }
	        resolve(results);
	      });
	    });
	  };
	  return RTCPeerConnection;
	};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

	 /* eslint-env node */
	'use strict';
	
	// SDP helpers.
	var SDPUtils = {};
	
	// Generate an alphanumeric identifier for cname or mids.
	// TODO: use UUIDs instead? https://gist.github.com/jed/982883
	SDPUtils.generateIdentifier = function() {
	  return Math.random().toString(36).substr(2, 10);
	};
	
	// The RTCP CNAME used by all peerconnections from the same JS.
	SDPUtils.localCName = SDPUtils.generateIdentifier();
	
	// Splits SDP into lines, dealing with both CRLF and LF.
	SDPUtils.splitLines = function(blob) {
	  return blob.trim().split('\n').map(function(line) {
	    return line.trim();
	  });
	};
	// Splits SDP into sessionpart and mediasections. Ensures CRLF.
	SDPUtils.splitSections = function(blob) {
	  var parts = blob.split('\nm=');
	  return parts.map(function(part, index) {
	    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
	  });
	};
	
	// Returns lines that start with a certain prefix.
	SDPUtils.matchPrefix = function(blob, prefix) {
	  return SDPUtils.splitLines(blob).filter(function(line) {
	    return line.indexOf(prefix) === 0;
	  });
	};
	
	// Parses an ICE candidate line. Sample input:
	// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
	// rport 55996"
	SDPUtils.parseCandidate = function(line) {
	  var parts;
	  // Parse both variants.
	  if (line.indexOf('a=candidate:') === 0) {
	    parts = line.substring(12).split(' ');
	  } else {
	    parts = line.substring(10).split(' ');
	  }
	
	  var candidate = {
	    foundation: parts[0],
	    component: parts[1],
	    protocol: parts[2].toLowerCase(),
	    priority: parseInt(parts[3], 10),
	    ip: parts[4],
	    port: parseInt(parts[5], 10),
	    // skip parts[6] == 'typ'
	    type: parts[7]
	  };
	
	  for (var i = 8; i < parts.length; i += 2) {
	    switch (parts[i]) {
	      case 'raddr':
	        candidate.relatedAddress = parts[i + 1];
	        break;
	      case 'rport':
	        candidate.relatedPort = parseInt(parts[i + 1], 10);
	        break;
	      case 'tcptype':
	        candidate.tcpType = parts[i + 1];
	        break;
	      default: // Unknown extensions are silently ignored.
	        break;
	    }
	  }
	  return candidate;
	};
	
	// Translates a candidate object into SDP candidate attribute.
	SDPUtils.writeCandidate = function(candidate) {
	  var sdp = [];
	  sdp.push(candidate.foundation);
	  sdp.push(candidate.component);
	  sdp.push(candidate.protocol.toUpperCase());
	  sdp.push(candidate.priority);
	  sdp.push(candidate.ip);
	  sdp.push(candidate.port);
	
	  var type = candidate.type;
	  sdp.push('typ');
	  sdp.push(type);
	  if (type !== 'host' && candidate.relatedAddress &&
	      candidate.relatedPort) {
	    sdp.push('raddr');
	    sdp.push(candidate.relatedAddress); // was: relAddr
	    sdp.push('rport');
	    sdp.push(candidate.relatedPort); // was: relPort
	  }
	  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
	    sdp.push('tcptype');
	    sdp.push(candidate.tcpType);
	  }
	  return 'candidate:' + sdp.join(' ');
	};
	
	// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
	// a=rtpmap:111 opus/48000/2
	SDPUtils.parseRtpMap = function(line) {
	  var parts = line.substr(9).split(' ');
	  var parsed = {
	    payloadType: parseInt(parts.shift(), 10) // was: id
	  };
	
	  parts = parts[0].split('/');
	
	  parsed.name = parts[0];
	  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
	  // was: channels
	  parsed.numChannels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
	  return parsed;
	};
	
	// Generate an a=rtpmap line from RTCRtpCodecCapability or
	// RTCRtpCodecParameters.
	SDPUtils.writeRtpMap = function(codec) {
	  var pt = codec.payloadType;
	  if (codec.preferredPayloadType !== undefined) {
	    pt = codec.preferredPayloadType;
	  }
	  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
	      (codec.numChannels !== 1 ? '/' + codec.numChannels : '') + '\r\n';
	};
	
	// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
	// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
	SDPUtils.parseExtmap = function(line) {
	  var parts = line.substr(9).split(' ');
	  return {
	    id: parseInt(parts[0], 10),
	    uri: parts[1]
	  };
	};
	
	// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
	// RTCRtpHeaderExtension.
	SDPUtils.writeExtmap = function(headerExtension) {
	  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
	       ' ' + headerExtension.uri + '\r\n';
	};
	
	// Parses an ftmp line, returns dictionary. Sample input:
	// a=fmtp:96 vbr=on;cng=on
	// Also deals with vbr=on; cng=on
	SDPUtils.parseFmtp = function(line) {
	  var parsed = {};
	  var kv;
	  var parts = line.substr(line.indexOf(' ') + 1).split(';');
	  for (var j = 0; j < parts.length; j++) {
	    kv = parts[j].trim().split('=');
	    parsed[kv[0].trim()] = kv[1];
	  }
	  return parsed;
	};
	
	// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
	SDPUtils.writeFmtp = function(codec) {
	  var line = '';
	  var pt = codec.payloadType;
	  if (codec.preferredPayloadType !== undefined) {
	    pt = codec.preferredPayloadType;
	  }
	  if (codec.parameters && Object.keys(codec.parameters).length) {
	    var params = [];
	    Object.keys(codec.parameters).forEach(function(param) {
	      params.push(param + '=' + codec.parameters[param]);
	    });
	    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
	  }
	  return line;
	};
	
	// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
	// a=rtcp-fb:98 nack rpsi
	SDPUtils.parseRtcpFb = function(line) {
	  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
	  return {
	    type: parts.shift(),
	    parameter: parts.join(' ')
	  };
	};
	// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
	SDPUtils.writeRtcpFb = function(codec) {
	  var lines = '';
	  var pt = codec.payloadType;
	  if (codec.preferredPayloadType !== undefined) {
	    pt = codec.preferredPayloadType;
	  }
	  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
	    // FIXME: special handling for trr-int?
	    codec.rtcpFeedback.forEach(function(fb) {
	      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
	      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
	          '\r\n';
	    });
	  }
	  return lines;
	};
	
	// Parses an RFC 5576 ssrc media attribute. Sample input:
	// a=ssrc:3735928559 cname:something
	SDPUtils.parseSsrcMedia = function(line) {
	  var sp = line.indexOf(' ');
	  var parts = {
	    ssrc: parseInt(line.substr(7, sp - 7), 10)
	  };
	  var colon = line.indexOf(':', sp);
	  if (colon > -1) {
	    parts.attribute = line.substr(sp + 1, colon - sp - 1);
	    parts.value = line.substr(colon + 1);
	  } else {
	    parts.attribute = line.substr(sp + 1);
	  }
	  return parts;
	};
	
	// Extracts the MID (RFC 5888) from a media section.
	// returns the MID or undefined if no mid line was found.
	SDPUtils.getMid = function(mediaSection) {
	  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
	  if (mid) {
	    return mid.substr(6);
	  }
	}
	
	// Extracts DTLS parameters from SDP media section or sessionpart.
	// FIXME: for consistency with other functions this should only
	//   get the fingerprint line as input. See also getIceParameters.
	SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
	  var lines = SDPUtils.splitLines(mediaSection);
	  // Search in session part, too.
	  lines = lines.concat(SDPUtils.splitLines(sessionpart));
	  var fpLine = lines.filter(function(line) {
	    return line.indexOf('a=fingerprint:') === 0;
	  })[0].substr(14);
	  // Note: a=setup line is ignored since we use the 'auto' role.
	  // Note2: 'algorithm' is not case sensitive except in Edge.
	  var dtlsParameters = {
	    role: 'auto',
	    fingerprints: [{
	      algorithm: fpLine.split(' ')[0].toLowerCase(),
	      value: fpLine.split(' ')[1]
	    }]
	  };
	  return dtlsParameters;
	};
	
	// Serializes DTLS parameters to SDP.
	SDPUtils.writeDtlsParameters = function(params, setupType) {
	  var sdp = 'a=setup:' + setupType + '\r\n';
	  params.fingerprints.forEach(function(fp) {
	    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
	  });
	  return sdp;
	};
	// Parses ICE information from SDP media section or sessionpart.
	// FIXME: for consistency with other functions this should only
	//   get the ice-ufrag and ice-pwd lines as input.
	SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
	  var lines = SDPUtils.splitLines(mediaSection);
	  // Search in session part, too.
	  lines = lines.concat(SDPUtils.splitLines(sessionpart));
	  var iceParameters = {
	    usernameFragment: lines.filter(function(line) {
	      return line.indexOf('a=ice-ufrag:') === 0;
	    })[0].substr(12),
	    password: lines.filter(function(line) {
	      return line.indexOf('a=ice-pwd:') === 0;
	    })[0].substr(10)
	  };
	  return iceParameters;
	};
	
	// Serializes ICE parameters to SDP.
	SDPUtils.writeIceParameters = function(params) {
	  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
	      'a=ice-pwd:' + params.password + '\r\n';
	};
	
	// Parses the SDP media section and returns RTCRtpParameters.
	SDPUtils.parseRtpParameters = function(mediaSection) {
	  var description = {
	    codecs: [],
	    headerExtensions: [],
	    fecMechanisms: [],
	    rtcp: []
	  };
	  var lines = SDPUtils.splitLines(mediaSection);
	  var mline = lines[0].split(' ');
	  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
	    var pt = mline[i];
	    var rtpmapline = SDPUtils.matchPrefix(
	        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
	    if (rtpmapline) {
	      var codec = SDPUtils.parseRtpMap(rtpmapline);
	      var fmtps = SDPUtils.matchPrefix(
	          mediaSection, 'a=fmtp:' + pt + ' ');
	      // Only the first a=fmtp:<pt> is considered.
	      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
	      codec.rtcpFeedback = SDPUtils.matchPrefix(
	          mediaSection, 'a=rtcp-fb:' + pt + ' ')
	        .map(SDPUtils.parseRtcpFb);
	      description.codecs.push(codec);
	      // parse FEC mechanisms from rtpmap lines.
	      switch (codec.name.toUpperCase()) {
	        case 'RED':
	        case 'ULPFEC':
	          description.fecMechanisms.push(codec.name.toUpperCase());
	          break;
	        default: // only RED and ULPFEC are recognized as FEC mechanisms.
	          break;
	      }
	    }
	  }
	  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
	    description.headerExtensions.push(SDPUtils.parseExtmap(line));
	  });
	  // FIXME: parse rtcp.
	  return description;
	};
	
	// Generates parts of the SDP media section describing the capabilities /
	// parameters.
	SDPUtils.writeRtpDescription = function(kind, caps) {
	  var sdp = '';
	
	  // Build the mline.
	  sdp += 'm=' + kind + ' ';
	  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
	  sdp += ' UDP/TLS/RTP/SAVPF ';
	  sdp += caps.codecs.map(function(codec) {
	    if (codec.preferredPayloadType !== undefined) {
	      return codec.preferredPayloadType;
	    }
	    return codec.payloadType;
	  }).join(' ') + '\r\n';
	
	  sdp += 'c=IN IP4 0.0.0.0\r\n';
	  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';
	
	  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
	  caps.codecs.forEach(function(codec) {
	    sdp += SDPUtils.writeRtpMap(codec);
	    sdp += SDPUtils.writeFmtp(codec);
	    sdp += SDPUtils.writeRtcpFb(codec);
	  });
	  var maxptime = 0;
	  caps.codecs.forEach(function(codec) {
	    if (codec.maxptime > maxptime) {
	      maxptime = codec.maxptime;
	    }
	  });
	  if (maxptime > 0) {
	    sdp += 'a=maxptime:' + maxptime + '\r\n';
	  }
	  sdp += 'a=rtcp-mux\r\n';
	
	  caps.headerExtensions.forEach(function(extension) {
	    sdp += SDPUtils.writeExtmap(extension);
	  });
	  // FIXME: write fecMechanisms.
	  return sdp;
	};
	
	// Parses the SDP media section and returns an array of
	// RTCRtpEncodingParameters.
	SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
	  var encodingParameters = [];
	  var description = SDPUtils.parseRtpParameters(mediaSection);
	  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
	  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;
	
	  // filter a=ssrc:... cname:, ignore PlanB-msid
	  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
	  .map(function(line) {
	    return SDPUtils.parseSsrcMedia(line);
	  })
	  .filter(function(parts) {
	    return parts.attribute === 'cname';
	  });
	  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
	  var secondarySsrc;
	
	  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
	  .map(function(line) {
	    var parts = line.split(' ');
	    parts.shift();
	    return parts.map(function(part) {
	      return parseInt(part, 10);
	    });
	  });
	  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
	    secondarySsrc = flows[0][1];
	  }
	
	  description.codecs.forEach(function(codec) {
	    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
	      var encParam = {
	        ssrc: primarySsrc,
	        codecPayloadType: parseInt(codec.parameters.apt, 10),
	        rtx: {
	          ssrc: secondarySsrc
	        }
	      };
	      encodingParameters.push(encParam);
	      if (hasRed) {
	        encParam = JSON.parse(JSON.stringify(encParam));
	        encParam.fec = {
	          ssrc: secondarySsrc,
	          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
	        };
	        encodingParameters.push(encParam);
	      }
	    }
	  });
	  if (encodingParameters.length === 0 && primarySsrc) {
	    encodingParameters.push({
	      ssrc: primarySsrc
	    });
	  }
	
	  // we support both b=AS and b=TIAS but interpret AS as TIAS.
	  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
	  if (bandwidth.length) {
	    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
	      bandwidth = parseInt(bandwidth[0].substr(7), 10);
	    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
	      bandwidth = parseInt(bandwidth[0].substr(5), 10);
	    }
	    encodingParameters.forEach(function(params) {
	      params.maxBitrate = bandwidth;
	    });
	  }
	  return encodingParameters;
	};
	
	// parses http://draft.ortc.org/#rtcrtcpparameters*
	SDPUtils.parseRtcpParameters = function(mediaSection) {
	  var rtcpParameters = {};
	
	  var cname;
	  // Gets the first SSRC. Note that with RTX there might be multiple
	  // SSRCs.
	  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
	      .map(function(line) {
	        return SDPUtils.parseSsrcMedia(line);
	      })
	      .filter(function(obj) {
	        return obj.attribute === 'cname';
	      })[0];
	  if (remoteSsrc) {
	    rtcpParameters.cname = remoteSsrc.value;
	    rtcpParameters.ssrc = remoteSsrc.ssrc;
	  }
	
	  // Edge uses the compound attribute instead of reducedSize
	  // compound is !reducedSize
	  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
	  rtcpParameters.reducedSize = rsize.length > 0;
	  rtcpParameters.compound = rsize.length === 0;
	
	  // parses the rtcp-mux attrіbute.
	  // Note that Edge does not support unmuxed RTCP.
	  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
	  rtcpParameters.mux = mux.length > 0;
	
	  return rtcpParameters;
	};
	
	// parses either a=msid: or a=ssrc:... msid lines an returns
	// the id of the MediaStream and MediaStreamTrack.
	SDPUtils.parseMsid = function(mediaSection) {
	  var parts;
	  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
	  if (spec.length === 1) {
	    parts = spec[0].substr(7).split(' ');
	    return {stream: parts[0], track: parts[1]};
	  }
	  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
	  .map(function(line) {
	    return SDPUtils.parseSsrcMedia(line);
	  })
	  .filter(function(parts) {
	    return parts.attribute === 'msid';
	  });
	  if (planB.length > 0) {
	    parts = planB[0].value.split(' ');
	    return {stream: parts[0], track: parts[1]};
	  }
	};
	
	SDPUtils.writeSessionBoilerplate = function() {
	  // FIXME: sess-id should be an NTP timestamp.
	  return 'v=0\r\n' +
	      'o=thisisadapterortc 8169639915646943137 2 IN IP4 127.0.0.1\r\n' +
	      's=-\r\n' +
	      't=0 0\r\n';
	};
	
	SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
	  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);
	
	  // Map ICE parameters (ufrag, pwd) to SDP.
	  sdp += SDPUtils.writeIceParameters(
	      transceiver.iceGatherer.getLocalParameters());
	
	  // Map DTLS parameters to SDP.
	  sdp += SDPUtils.writeDtlsParameters(
	      transceiver.dtlsTransport.getLocalParameters(),
	      type === 'offer' ? 'actpass' : 'active');
	
	  sdp += 'a=mid:' + transceiver.mid + '\r\n';
	
	  if (transceiver.rtpSender && transceiver.rtpReceiver) {
	    sdp += 'a=sendrecv\r\n';
	  } else if (transceiver.rtpSender) {
	    sdp += 'a=sendonly\r\n';
	  } else if (transceiver.rtpReceiver) {
	    sdp += 'a=recvonly\r\n';
	  } else {
	    sdp += 'a=inactive\r\n';
	  }
	
	  if (transceiver.rtpSender) {
	    // spec.
	    var msid = 'msid:' + stream.id + ' ' +
	        transceiver.rtpSender.track.id + '\r\n';
	    sdp += 'a=' + msid;
	
	    // for Chrome.
	    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
	        ' ' + msid;
	    if (transceiver.sendEncodingParameters[0].rtx) {
	      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
	          ' ' + msid;
	      sdp += 'a=ssrc-group:FID ' +
	          transceiver.sendEncodingParameters[0].ssrc + ' ' +
	          transceiver.sendEncodingParameters[0].rtx.ssrc +
	          '\r\n';
	    }
	  }
	  // FIXME: this should be written by writeRtpDescription.
	  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
	      ' cname:' + SDPUtils.localCName + '\r\n';
	  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
	    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
	        ' cname:' + SDPUtils.localCName + '\r\n';
	  }
	  return sdp;
	};
	
	// Gets the direction from the mediaSection or the sessionpart.
	SDPUtils.getDirection = function(mediaSection, sessionpart) {
	  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
	  var lines = SDPUtils.splitLines(mediaSection);
	  for (var i = 0; i < lines.length; i++) {
	    switch (lines[i]) {
	      case 'a=sendrecv':
	      case 'a=sendonly':
	      case 'a=recvonly':
	      case 'a=inactive':
	        return lines[i].substr(2);
	      default:
	        // FIXME: What should happen here?
	    }
	  }
	  if (sessionpart) {
	    return SDPUtils.getDirection(sessionpart);
	  }
	  return 'sendrecv';
	};
	
	SDPUtils.getKind = function(mediaSection) {
	  var lines = SDPUtils.splitLines(mediaSection);
	  var mline = lines[0].split(' ');
	  return mline[0].substr(2);
	};
	
	SDPUtils.isRejected = function(mediaSection) {
	  return mediaSection.split(' ', 2)[1] === '0';
	};
	
	// Expose public methods.
	module.exports = SDPUtils;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	
	// Expose public methods.
	module.exports = function(window) {
	  var navigator = window && window.navigator;
	
	  var shimError_ = function(e) {
	    return {
	      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
	      message: e.message,
	      constraint: e.constraint,
	      toString: function() {
	        return this.name;
	      }
	    };
	  };
	
	  // getUserMedia error shim.
	  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	      bind(navigator.mediaDevices);
	  navigator.mediaDevices.getUserMedia = function(c) {
	    return origGetUserMedia(c).catch(function(e) {
	      return Promise.reject(shimError_(e));
	    });
	  };
	};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	
	var utils = __webpack_require__(42);
	
	var firefoxShim = {
	  shimOnTrack: function(window) {
	    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
	        window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
	        get: function() {
	          return this._ontrack;
	        },
	        set: function(f) {
	          if (this._ontrack) {
	            this.removeEventListener('track', this._ontrack);
	            this.removeEventListener('addstream', this._ontrackpoly);
	          }
	          this.addEventListener('track', this._ontrack = f);
	          this.addEventListener('addstream', this._ontrackpoly = function(e) {
	            e.stream.getTracks().forEach(function(track) {
	              var event = new Event('track');
	              event.track = track;
	              event.receiver = {track: track};
	              event.streams = [e.stream];
	              this.dispatchEvent(event);
	            }.bind(this));
	          }.bind(this));
	        }
	      });
	    }
	  },
	
	  shimSourceObject: function(window) {
	    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
	    if (typeof window === 'object') {
	      if (window.HTMLMediaElement &&
	        !('srcObject' in window.HTMLMediaElement.prototype)) {
	        // Shim the srcObject property, once, when HTMLMediaElement is found.
	        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
	          get: function() {
	            return this.mozSrcObject;
	          },
	          set: function(stream) {
	            this.mozSrcObject = stream;
	          }
	        });
	      }
	    }
	  },
	
	  shimPeerConnection: function(window) {
	    var browserDetails = utils.detectBrowser(window);
	
	    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
	        window.mozRTCPeerConnection)) {
	      return; // probably media.peerconnection.enabled=false in about:config
	    }
	    // The RTCPeerConnection object.
	    if (!window.RTCPeerConnection) {
	      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
	        if (browserDetails.version < 38) {
	          // .urls is not supported in FF < 38.
	          // create RTCIceServers with a single url.
	          if (pcConfig && pcConfig.iceServers) {
	            var newIceServers = [];
	            for (var i = 0; i < pcConfig.iceServers.length; i++) {
	              var server = pcConfig.iceServers[i];
	              if (server.hasOwnProperty('urls')) {
	                for (var j = 0; j < server.urls.length; j++) {
	                  var newServer = {
	                    url: server.urls[j]
	                  };
	                  if (server.urls[j].indexOf('turn') === 0) {
	                    newServer.username = server.username;
	                    newServer.credential = server.credential;
	                  }
	                  newIceServers.push(newServer);
	                }
	              } else {
	                newIceServers.push(pcConfig.iceServers[i]);
	              }
	            }
	            pcConfig.iceServers = newIceServers;
	          }
	        }
	        return new window.mozRTCPeerConnection(pcConfig, pcConstraints);
	      };
	      window.RTCPeerConnection.prototype =
	          window.mozRTCPeerConnection.prototype;
	
	      // wrap static methods. Currently just generateCertificate.
	      if (window.mozRTCPeerConnection.generateCertificate) {
	        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
	          get: function() {
	            return window.mozRTCPeerConnection.generateCertificate;
	          }
	        });
	      }
	
	      window.RTCSessionDescription = window.mozRTCSessionDescription;
	      window.RTCIceCandidate = window.mozRTCIceCandidate;
	    }
	
	    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
	    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
	        .forEach(function(method) {
	          var nativeMethod = window.RTCPeerConnection.prototype[method];
	          window.RTCPeerConnection.prototype[method] = function() {
	            arguments[0] = new ((method === 'addIceCandidate') ?
	                window.RTCIceCandidate :
	                window.RTCSessionDescription)(arguments[0]);
	            return nativeMethod.apply(this, arguments);
	          };
	        });
	
	    // support for addIceCandidate(null or undefined)
	    var nativeAddIceCandidate =
	        window.RTCPeerConnection.prototype.addIceCandidate;
	    window.RTCPeerConnection.prototype.addIceCandidate = function() {
	      if (!arguments[0]) {
	        if (arguments[1]) {
	          arguments[1].apply(null);
	        }
	        return Promise.resolve();
	      }
	      return nativeAddIceCandidate.apply(this, arguments);
	    };
	
	    // shim getStats with maplike support
	    var makeMapStats = function(stats) {
	      var map = new Map();
	      Object.keys(stats).forEach(function(key) {
	        map.set(key, stats[key]);
	        map[key] = stats[key];
	      });
	      return map;
	    };
	
	    var modernStatsTypes = {
	      inboundrtp: 'inbound-rtp',
	      outboundrtp: 'outbound-rtp',
	      candidatepair: 'candidate-pair',
	      localcandidate: 'local-candidate',
	      remotecandidate: 'remote-candidate'
	    };
	
	    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
	    window.RTCPeerConnection.prototype.getStats = function(
	      selector,
	      onSucc,
	      onErr
	    ) {
	      return nativeGetStats.apply(this, [selector || null])
	        .then(function(stats) {
	          if (browserDetails.version < 48) {
	            stats = makeMapStats(stats);
	          }
	          if (browserDetails.version < 53 && !onSucc) {
	            // Shim only promise getStats with spec-hyphens in type names
	            // Leave callback version alone; misc old uses of forEach before Map
	            try {
	              stats.forEach(function(stat) {
	                stat.type = modernStatsTypes[stat.type] || stat.type;
	              });
	            } catch (e) {
	              if (e.name !== 'TypeError') {
	                throw e;
	              }
	              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
	              stats.forEach(function(stat, i) {
	                stats.set(i, Object.assign({}, stat, {
	                  type: modernStatsTypes[stat.type] || stat.type
	                }));
	              });
	            }
	          }
	          return stats;
	        })
	        .then(onSucc, onErr);
	    };
	  }
	};
	
	// Expose public methods.
	module.exports = {
	  shimOnTrack: firefoxShim.shimOnTrack,
	  shimSourceObject: firefoxShim.shimSourceObject,
	  shimPeerConnection: firefoxShim.shimPeerConnection,
	  shimGetUserMedia: __webpack_require__(50)
	};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	 /* eslint-env node */
	'use strict';
	
	var utils = __webpack_require__(42);
	var logging = utils.log;
	
	// Expose public methods.
	module.exports = function(window) {
	  var browserDetails = utils.detectBrowser(window);
	  var navigator = window && window.navigator;
	  var MediaStreamTrack = window && window.MediaStreamTrack;
	
	  var shimError_ = function(e) {
	    return {
	      name: {
	        InternalError: 'NotReadableError',
	        NotSupportedError: 'TypeError',
	        PermissionDeniedError: 'NotAllowedError',
	        SecurityError: 'NotAllowedError'
	      }[e.name] || e.name,
	      message: {
	        'The operation is insecure.': 'The request is not allowed by the ' +
	        'user agent or the platform in the current context.'
	      }[e.message] || e.message,
	      constraint: e.constraint,
	      toString: function() {
	        return this.name + (this.message && ': ') + this.message;
	      }
	    };
	  };
	
	  // getUserMedia constraints shim.
	  var getUserMedia_ = function(constraints, onSuccess, onError) {
	    var constraintsToFF37_ = function(c) {
	      if (typeof c !== 'object' || c.require) {
	        return c;
	      }
	      var require = [];
	      Object.keys(c).forEach(function(key) {
	        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
	          return;
	        }
	        var r = c[key] = (typeof c[key] === 'object') ?
	            c[key] : {ideal: c[key]};
	        if (r.min !== undefined ||
	            r.max !== undefined || r.exact !== undefined) {
	          require.push(key);
	        }
	        if (r.exact !== undefined) {
	          if (typeof r.exact === 'number') {
	            r. min = r.max = r.exact;
	          } else {
	            c[key] = r.exact;
	          }
	          delete r.exact;
	        }
	        if (r.ideal !== undefined) {
	          c.advanced = c.advanced || [];
	          var oc = {};
	          if (typeof r.ideal === 'number') {
	            oc[key] = {min: r.ideal, max: r.ideal};
	          } else {
	            oc[key] = r.ideal;
	          }
	          c.advanced.push(oc);
	          delete r.ideal;
	          if (!Object.keys(r).length) {
	            delete c[key];
	          }
	        }
	      });
	      if (require.length) {
	        c.require = require;
	      }
	      return c;
	    };
	    constraints = JSON.parse(JSON.stringify(constraints));
	    if (browserDetails.version < 38) {
	      logging('spec: ' + JSON.stringify(constraints));
	      if (constraints.audio) {
	        constraints.audio = constraintsToFF37_(constraints.audio);
	      }
	      if (constraints.video) {
	        constraints.video = constraintsToFF37_(constraints.video);
	      }
	      logging('ff37: ' + JSON.stringify(constraints));
	    }
	    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
	      onError(shimError_(e));
	    });
	  };
	
	  // Returns the result of getUserMedia as a Promise.
	  var getUserMediaPromise_ = function(constraints) {
	    return new Promise(function(resolve, reject) {
	      getUserMedia_(constraints, resolve, reject);
	    });
	  };
	
	  // Shim for mediaDevices on older versions.
	  if (!navigator.mediaDevices) {
	    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
	      addEventListener: function() { },
	      removeEventListener: function() { }
	    };
	  }
	  navigator.mediaDevices.enumerateDevices =
	      navigator.mediaDevices.enumerateDevices || function() {
	        return new Promise(function(resolve) {
	          var infos = [
	            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
	            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
	          ];
	          resolve(infos);
	        });
	      };
	
	  if (browserDetails.version < 41) {
	    // Work around http://bugzil.la/1169665
	    var orgEnumerateDevices =
	        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
	    navigator.mediaDevices.enumerateDevices = function() {
	      return orgEnumerateDevices().then(undefined, function(e) {
	        if (e.name === 'NotFoundError') {
	          return [];
	        }
	        throw e;
	      });
	    };
	  }
	  if (browserDetails.version < 49) {
	    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = function(c) {
	      return origGetUserMedia(c).then(function(stream) {
	        // Work around https://bugzil.la/802326
	        if (c.audio && !stream.getAudioTracks().length ||
	            c.video && !stream.getVideoTracks().length) {
	          stream.getTracks().forEach(function(track) {
	            track.stop();
	          });
	          throw new DOMException('The object can not be found here.',
	                                 'NotFoundError');
	        }
	        return stream;
	      }, function(e) {
	        return Promise.reject(shimError_(e));
	      });
	    };
	  }
	  if (!(browserDetails.version > 55 &&
	      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
	    var remap = function(obj, a, b) {
	      if (a in obj && !(b in obj)) {
	        obj[b] = obj[a];
	        delete obj[a];
	      }
	    };
	
	    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
	        bind(navigator.mediaDevices);
	    navigator.mediaDevices.getUserMedia = function(c) {
	      if (typeof c === 'object' && typeof c.audio === 'object') {
	        c = JSON.parse(JSON.stringify(c));
	        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
	        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
	      }
	      return nativeGetUserMedia(c);
	    };
	
	    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
	      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
	      MediaStreamTrack.prototype.getSettings = function() {
	        var obj = nativeGetSettings.apply(this, arguments);
	        remap(obj, 'mozAutoGainControl', 'autoGainControl');
	        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
	        return obj;
	      };
	    }
	
	    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
	      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
	      MediaStreamTrack.prototype.applyConstraints = function(c) {
	        if (this.kind === 'audio' && typeof c === 'object') {
	          c = JSON.parse(JSON.stringify(c));
	          remap(c, 'autoGainControl', 'mozAutoGainControl');
	          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
	        }
	        return nativeApplyConstraints.apply(this, [c]);
	      };
	    }
	  }
	  navigator.getUserMedia = function(constraints, onSuccess, onError) {
	    if (browserDetails.version < 44) {
	      return getUserMedia_(constraints, onSuccess, onError);
	    }
	    // Replace Firefox 44+'s deprecation warning with unprefixed version.
	    console.warn('navigator.getUserMedia has been replaced by ' +
	                 'navigator.mediaDevices.getUserMedia');
	    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
	  };
	};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

	/*
	 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
	 *
	 *  Use of this source code is governed by a BSD-style license
	 *  that can be found in the LICENSE file in the root of the source
	 *  tree.
	 */
	'use strict';
	var safariShim = {
	  // TODO: DrAlex, should be here, double check against LayoutTests
	
	  // TODO: once the back-end for the mac port is done, add.
	  // TODO: check for webkitGTK+
	  // shimPeerConnection: function() { },
	
	  shimAddStream: function(window) {
	    if (typeof window === 'object' && window.RTCPeerConnection &&
	        !('addStream' in window.RTCPeerConnection.prototype)) {
	      window.RTCPeerConnection.prototype.addStream = function(stream) {
	        var self = this;
	        stream.getTracks().forEach(function(track) {
	          self.addTrack(track, stream);
	        });
	      };
	    }
	  },
	  shimOnAddStream: function(window) {
	    if (typeof window === 'object' && window.RTCPeerConnection &&
	        !('onaddstream' in window.RTCPeerConnection.prototype)) {
	      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
	        get: function() {
	          return this._onaddstream;
	        },
	        set: function(f) {
	          if (this._onaddstream) {
	            this.removeEventListener('addstream', this._onaddstream);
	            this.removeEventListener('track', this._onaddstreampoly);
	          }
	          this.addEventListener('addstream', this._onaddstream = f);
	          this.addEventListener('track', this._onaddstreampoly = function(e) {
	            var stream = e.streams[0];
	            if (!this._streams) {
	              this._streams = [];
	            }
	            if (this._streams.indexOf(stream) >= 0) {
	              return;
	            }
	            this._streams.push(stream);
	            var event = new Event('addstream');
	            event.stream = e.streams[0];
	            this.dispatchEvent(event);
	          }.bind(this));
	        }
	      });
	    }
	  },
	  shimCallbacksAPI: function(window) {
	    if (typeof window !== 'object' || !window.RTCPeerConnection) {
	      return;
	    }
	    var prototype = window.RTCPeerConnection.prototype;
	    var createOffer = prototype.createOffer;
	    var createAnswer = prototype.createAnswer;
	    var setLocalDescription = prototype.setLocalDescription;
	    var setRemoteDescription = prototype.setRemoteDescription;
	    var addIceCandidate = prototype.addIceCandidate;
	
	    prototype.createOffer = function(successCallback, failureCallback) {
	      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
	      var promise = createOffer.apply(this, [options]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	
	    prototype.createAnswer = function(successCallback, failureCallback) {
	      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
	      var promise = createAnswer.apply(this, [options]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	
	    var withCallback = function(description, successCallback, failureCallback) {
	      var promise = setLocalDescription.apply(this, [description]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	    prototype.setLocalDescription = withCallback;
	
	    withCallback = function(description, successCallback, failureCallback) {
	      var promise = setRemoteDescription.apply(this, [description]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	    prototype.setRemoteDescription = withCallback;
	
	    withCallback = function(candidate, successCallback, failureCallback) {
	      var promise = addIceCandidate.apply(this, [candidate]);
	      if (!failureCallback) {
	        return promise;
	      }
	      promise.then(successCallback, failureCallback);
	      return Promise.resolve();
	    };
	    prototype.addIceCandidate = withCallback;
	  },
	  shimGetUserMedia: function(window) {
	    var navigator = window && window.navigator;
	
	    if (!navigator.getUserMedia) {
	      if (navigator.webkitGetUserMedia) {
	        navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
	      } else if (navigator.mediaDevices &&
	          navigator.mediaDevices.getUserMedia) {
	        navigator.getUserMedia = function(constraints, cb, errcb) {
	          navigator.mediaDevices.getUserMedia(constraints)
	          .then(cb, errcb);
	        }.bind(navigator);
	      }
	    }
	  }
	};
	
	// Expose public methods.
	module.exports = {
	  shimCallbacksAPI: safariShim.shimCallbacksAPI,
	  shimAddStream: safariShim.shimAddStream,
	  shimOnAddStream: safariShim.shimOnAddStream,
	  shimGetUserMedia: safariShim.shimGetUserMedia
	  // TODO
	  // shimPeerConnection: safariShim.shimPeerConnection
	};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Logger_1 = __webpack_require__(4);
	var Conversation_1 = __webpack_require__(53);
	var MsgSignaling_1 = __webpack_require__(34);
	var MsgEnums_1 = __webpack_require__(35);
	var MessagingEvents_1 = __webpack_require__(55);
	var ConversationManager_1 = __webpack_require__(54);
	var Authenticator_1 = __webpack_require__(5);
	var Message_1 = __webpack_require__(56);
	/**
	 * Client class used to control messaging functions. Can't be instantiatied directly (singleton), please use <a href="../globals.html#getmessenger">VoxImplant.getMessenger</a> to get the class instance.
	 * @messenger
	 */
	var Messenger = function () {
	    /**
	     * @hidden
	     */
	    function Messenger() {
	        var _this = this;
	        if (Messenger.instance) {
	            throw new Error("Error - use Client.getIM()");
	        }
	        this.eventListeners = {};
	        this.signalling = MsgSignaling_1.MsgSignaling.get();
	        this.cm = ConversationManager_1.ConversationManager.get();
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onError, function (payload) {
	            _this.dispatchEvent(MessagingEvents_1.MessagingEvents.onError, payload);
	        });
	        ConversationManager_1.ConversationManager.get();
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onEditUser, function (payload) {
	            var eventPayload = payload.object;
	            var checkedPayload = {
	                user: {
	                    customData: eventPayload.custom_data,
	                    privateCustomData: eventPayload.private_custom_data,
	                    userId: eventPayload.user_id
	                },
	                userId: payload.user_id,
	                seq: payload.seq,
	                onIncomingEvent: payload.on_incoming_event
	            };
	            _this.dispatchEvent(MessagingEvents_1.MessagingEvents.onEditUser, checkedPayload);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onGetUser, function (payload) {
	            var eventPayload = payload.object;
	            var checkedPayload = {
	                user: {
	                    conversationsList: eventPayload.conversations_list,
	                    customData: eventPayload.custom_data,
	                    privateCustomData: eventPayload.private_custom_data,
	                    userId: eventPayload.user_id
	                },
	                userId: payload.user_id,
	                seq: payload.seq,
	                onIncomingEvent: payload.on_incoming_event
	            };
	            _this.dispatchEvent(MessagingEvents_1.MessagingEvents.onGetUser, checkedPayload);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onSubscribe, function (payload) {
	            _this.dispatchEvent(MessagingEvents_1.MessagingEvents.onSubscribe, { users: payload.users });
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onUnSubscribe, function (payload) {
	            _this.dispatchEvent(MessagingEvents_1.MessagingEvents.onUnSubscribe, { users: payload.users });
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onSetStatus, function (payload) {
	            _this.dispatchEvent(MessagingEvents_1.MessagingEvents.onSetStatus, {
	                user: {
	                    userId: payload.object.user_id,
	                    online: payload.object.online,
	                    timestamp: payload.object.timestamp
	                },
	                userId: payload.user_id,
	                seq: payload.seq,
	                onIncomingEvent: payload.on_incoming_event
	            });
	        });
	        this.awaitPromiseList = [];
	    }
	    /**
	     * @hidden
	     */
	    Messenger.getInstance = function () {
	        Messenger.instance = Messenger.instance || new Messenger();
	        return Messenger.instance;
	    };
	    /**
	     * Create a new conversation
	     * @param participants Array of participants alongside with access rights params
	     * @param moderators Array of moderators
	     * @param distinct If two conversations are created with same set of users and moderators and both have 'distinct' flag, second create call will fail with the UUID of conversation already created. Note that changing users or moderators list will clear 'distinct' flag.
	     * @param enablePublicJoin If set to 'true', anyone can join conversation by uuid
	     * @param customData JavaScript object with custom data, up to 5kb. Note that setting this property does not send changes to the server. Use the 'update' to send all changes at once or 'setCustomData' to update and set the custom data.
	     * @param title conversation title
	     * @returns {Promise<Conversation>}
	     */
	    Messenger.prototype.createConversation = function (participants, title, distinct, enablePublicJoin, customData, moderators) {
	        this.cm.createConversation(participants, title, distinct, enablePublicJoin, customData, moderators);
	    };
	    /**
	     * Get conversation by it's UUID
	     * @param uuid
	     */
	    Messenger.prototype.getConversation = function (uuid) {
	        this.cm.getConversation(uuid);
	    };
	    /**
	     * Get multiple conversations by array of UUIDs. Maximum 30 conversation. Note that calling this method will result in <b>multiple</b> 'getConversation' events.
	     * @param conversations Array of UUIDs
	     * @returns {Array<Conversation>}
	     */
	    Messenger.prototype.getConversations = function (conversations) {
	        if (conversations.length > 30) {
	            Logger_1.LogManager.get().writeMessage(Logger_1.LogCategory.MESSAGING, "Rate limit", Logger_1.LogLevel.ERROR, "you can get maximum 30 conversation in one getConversations");
	            return;
	        }
	        return this.cm.getConversations(conversations);
	    };
	    /**
	     * @hidden
	     */
	    Messenger.prototype.getRawConversations = function (conversations) {
	        return this.cm.getConversations(conversations);
	    };
	    /**
	     * Remove the conversation specified by the UUID
	     * @param uuid Universally Unique Identifier of the conversation
	     */
	    Messenger.prototype.removeConversation = function (uuid) {
	        this.cm.removeConversation(uuid);
	    };
	    /**
	     * Join current user to the conversation specified by the UUID
	     * @param uuid Universally Unique Identifier of the conversation
	     */
	    Messenger.prototype.joinConversation = function (uuid) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.joinConversation, { uuid: uuid });
	    };
	    /**
	     * Leave current user from the conversation specified by the UUID
	     * @param uuid  Universally Unique Identifier of the conversation
	     */
	    Messenger.prototype.leaveConversation = function (uuid) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.leaveConversation, { uuid: uuid });
	    };
	    /**
	     * Get user information for the user specified by the full Voximplant user identifier, ex 'username@appname.accname'
	     * @param user_id User identifier
	     */
	    Messenger.prototype.getUser = function (user_id) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.getUser, { user_id: user_id });
	    };
	    /**
	     * Get the full Voximplant user identifier, ex 'username@appname.accname', for the current user
	     * @returns {string} current user short identifier
	     */
	    Messenger.prototype.getMe = function () {
	        return ConversationManager_1.ConversationManager.extractUserName(Authenticator_1.Authenticator.get().username());
	    };
	    /**
	     * Edit current user information.
	     * @param custom_data Public custom data available for all users
	     * @param private_custom_data Private custom data available only to the user themselves.
	     */
	    Messenger.prototype.editUser = function (customData, privateCustomData) {
	        var user = { user_id: ConversationManager_1.ConversationManager.extractUserName(Authenticator_1.Authenticator.get().username()) };
	        if (customData) user['custom_data'] = customData;
	        if (privateCustomData) user['private_custom_data'] = privateCustomData;
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.editUser, user);
	    };
	    /**
	     * Get user information for the users specified by the array of the full Voximplant user identifiers, ex 'username@appname.accname'
	     * @param users List of user identifiers
	     */
	    Messenger.prototype.getUsers = function (users) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.getUsers, { users: users });
	    };
	    /**
	     * Register handler for the specified event
	     * @param event Event identifier
	     * @param handler JavaScript function that will be called when the specified event is triggered. Please note that function is called without 'this' binding.
	     */
	    Messenger.prototype.addEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] === 'undefined') this.eventListeners[event] = [];
	        this.eventListeners[event].push(handler);
	    };
	    /**
	     * Remove handler for the specified event
	     * @param event Event identifier
	     * @param handler Reference to the JavaScript function to remove from event listeners. If not specified, removes all event listeners from the specified event.
	     */
	    Messenger.prototype.removeEventListener = function (event, handler) {
	        if (typeof this.eventListeners[event] === 'undefined') return;
	        if (typeof handler === "function") {
	            for (var i = 0; i < this.eventListeners[event].length; i++) {
	                if (this.eventListeners[event][i] === handler) {
	                    this.eventListeners[event].splice(i, 1);
	                    break;
	                }
	            }
	        } else {
	            this.eventListeners[event] = [];
	        }
	    };
	    /**
	     * @hidden
	     * @param event
	     * @param payload
	     */
	    Messenger.prototype.dispatchEvent = function (event, payload) {
	        payload.name = MessagingEvents_1.MessagingEvents[event];
	        if (typeof this.eventListeners[event] !== 'undefined') this.eventListeners[event].forEach(function (item) {
	            if (typeof item === "function") item(payload);
	        });
	        if (typeof this.awaitPromiseList[event] !== 'undefined' && this.awaitPromiseList[event].length != 0) {
	            var nowPromise = this.awaitPromiseList[event].splice(0, 1);
	            nowPromise.resolve(payload);
	            window.clearTimeout(nowPromise.expire);
	        }
	    };
	    /**
	     * Syntax shortcut for the 'addEventListener'
	     * @param event
	     * @param handler
	     */
	    Messenger.prototype.on = function (event, handler) {
	        this.addEventListener(event, handler);
	    };
	    /**
	     * Syntax shortcut for the 'removeEventListener'
	     * @param event
	     * @param handler
	     */
	    Messenger.prototype.off = function (event, handler) {
	        this.removeEventListener(event, handler);
	    };
	    /**
	     * Add new promice for awaiting.
	     * @param event
	     * @param resolve
	     * @param reject
	     * @hidden
	     */
	    Messenger.prototype.registerPromise = function (event, resolve, reject) {
	        if (typeof this.awaitPromiseList[event] === "undefined") this.awaitPromiseList[event] = [];
	        this.awaitPromiseList[event].push({ resolve: resolve, reject: reject, expire: setTimeout(function () {
	                reject();
	            }, 20000) });
	    };
	    /**
	     * Restore conversation from cache that is previously created by the 'toCache' method.
	     * @param cacheConversation JavaScript object for the serialized conversation
	     * @returns {Conversation}
	     */
	    Messenger.prototype.createConversationFromCache = function (cacheConversation) {
	        if (typeof cacheConversation === "undefined") return null;
	        return Conversation_1.Conversation.createFromCache(cacheConversation);
	    };
	    /**
	     * Restore message from cache that is previously created by the 'toCache' method.
	     * @param cacheMessage JavaScript object for the serialized conversation
	     * @returns {Message}
	     */
	    Messenger.prototype.createMessageFromCache = function (cacheMessage) {
	        if (typeof cacheMessage === "undefined") return null;
	        return Message_1.Message.createFromCache(cacheMessage);
	    };
	    /**
	     * Subscribe for user information change and presence status change. On change, the 'onSuscribe' event will be triggered.
	     * @param users List of full Voximplant user identifiers, ex 'username@appname.accname'
	     */
	    Messenger.prototype.subscribe = function (users) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.subscribe, { users: users });
	    };
	    /**
	     * Unsubscribe for user information change and presence status change.
	     * @param users List of full Voximplant user identifiers, ex 'username@appname.accname'
	     */
	    Messenger.prototype.unSubscribe = function (users) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.unSubscribe, { users: users });
	    };
	    /**
	     * @hidden
	     * @deprecated
	     * @param status
	     */
	    Messenger.prototype.setPresence = function (status) {
	        this.setStatus(status);
	    };
	    /**
	     * Set user presence status.
	     * Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#onsetstatus'>onSetStatus</a> event for all messenger objects on all <b>connected</b> clients which are subscribed for notifications about this user. Including this one if conditions are met.
	     * @param status true if user is available for messaging.
	     */
	    Messenger.prototype.setStatus = function (status) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.setStatus, { online: status });
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "createConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "getConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "getConversations", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "getRawConversations", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "removeConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "joinConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "leaveConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "getUser", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "getMe", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "editUser", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "getUsers", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "addEventListener", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "removeEventListener", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "dispatchEvent", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "on", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "off", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "registerPromise", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "createConversationFromCache", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "createMessageFromCache", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "subscribe", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "unSubscribe", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "setPresence", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger.prototype, "setStatus", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Messenger, "getInstance", null);
	    return Messenger;
	}();
	exports.Messenger = Messenger;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var GUID_1 = __webpack_require__(39);
	var ConversationManager_1 = __webpack_require__(54);
	var MessagingEvents_1 = __webpack_require__(55);
	var Logger_1 = __webpack_require__(4);
	var Message_1 = __webpack_require__(56);
	var MsgSignaling_1 = __webpack_require__(34);
	var MsgEnums_1 = __webpack_require__(35);
	var onEditConversation = MessagingEvents_1.MessagingEvents.onEditConversation;
	var Messenger_1 = __webpack_require__(52);
	/**
	 * Conversation instance. Created by Messenger.createConversation(). Used to send messages, add or remove users, change moderators list etc.
	 * @messenger
	 */
	var Conversation = function () {
	    /**
	     * @hidden
	     */
	    function Conversation(participants, distinct, publicJoin, customData, moderators) {
	        this._distinct = distinct;
	        this._publicJoin = publicJoin;
	        this._participants = participants;
	        this._customData = customData;
	        this._moderators = moderators;
	    }
	    Object.defineProperty(Conversation.prototype, "lastRead", {
	        /**
	         * Returns sequence of last event that was read by user. Used to display unread messages, events etc.
	         * @returns {any}
	         */
	        get: function () {
	            return this._lastRead;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "uuid", {
	        /**
	         * Universally unique identifier of current conversation. Used in methods like 'get', 'remove' etc.
	         * @returns {string}
	         */
	        get: function () {
	            return this._uuid;
	        },
	        /**
	         * @hidden
	         */
	        set: function (uuid) {
	            throw Error("You can't change UUID for conversation.");
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     *
	     * @hidden
	     */
	    Conversation.prototype.getPayload = function () {
	        if (typeof this._uuid == "undefined") throw Error('You must create UUID with createUUID() function!');
	        var str = {
	            uuid: this._uuid,
	            participants: this.prepareParticipants(this._participants)
	        };
	        if (typeof this._title != "undefined") str['title'] = this._title;else str['title'] = '';
	        if (typeof this._moderators != "undefined") str['moderators'] = this._moderators;else str['moderators'] = [];
	        if (typeof this._lastRead != "undefined") str['last_readed'] = this._lastRead;
	        if (typeof this._distinct != "undefined") str['distinct'] = this._distinct;else str['distinct'] = false;
	        if (typeof this._publicJoin != "undefined") str['enable_public_join'] = this._publicJoin;else str['enable_public_join'] = false;
	        if (typeof this._customData != "undefined") str['custom_data'] = this._customData;else str['custom_data'] = {};
	        if (typeof this._createdAt != "undefined") str['created_at'] = this._createdAt;
	        return str;
	    };
	    /**
	     *
	     * @hidden
	     */
	    Conversation.prototype.getSimplePayload = function () {
	        if (typeof this._uuid == "undefined") throw Error('You must create UUID with createUUID() function!');
	        return {
	            uuid: this._uuid,
	            title: typeof this._title != "undefined" ? this._title : '',
	            distinct: typeof this._distinct != "undefined" ? this._distinct : false,
	            enable_public_join: typeof this._publicJoin != "undefined" ? this._publicJoin : false,
	            custom_data: typeof this._customData != "undefined" ? this._customData : {}
	        };
	    };
	    /**
	     * Correction participants list for backend
	     * @returns {Array}
	     * @hidden
	     */
	    Conversation.prototype.prepareParticipants = function (participants) {
	        var ret = [];
	        for (var _i = 0, participants_1 = participants; _i < participants_1.length; _i++) {
	            var participant = participants_1[_i];
	            if (typeof participant.userId != "undefined") {
	                var item = { user_id: ConversationManager_1.ConversationManager.extractUserName(participant.userId) };
	                item['can_write'] = typeof participant.canWrite == "undefined" ? true : participant.canWrite;
	                item['can_manage_participants'] = typeof participant.canManageParticipants == "undefined" ? false : participant.canManageParticipants;
	                ret.push(item);
	            }
	        }
	        return ret;
	    };
	    /**
	     * Generate UUID for new conversation
	     *
	     * @hidden
	     */
	    Conversation.prototype.createUUID = function () {
	        if (typeof this._uuid != "undefined") throw Error('UUID already created!');
	        this._uuid = new GUID_1.GUID().toString();
	    };
	    /**
	     * Create conversation from buss
	     * @param busConversation
	     * @hidden
	     */
	    Conversation.createFromBus = function (busConversation, seq) {
	        var conversation = new Conversation([]);
	        conversation._lastSeq = seq;
	        conversation._uuid = busConversation.uuid;
	        conversation._title = busConversation.title;
	        conversation._moderators = busConversation.moderators;
	        conversation._createdAt = busConversation.created_at;
	        conversation._lastRead = busConversation.last_read;
	        conversation._distinct = busConversation.distinct;
	        conversation._publicJoin = busConversation.public_join;
	        if (busConversation.participants) conversation._participants = busConversation.participants.map(function (item) {
	            return {
	                userId: item.user_id,
	                canWrite: item.can_write,
	                canManageParticipants: item.can_manage_participants
	            };
	        });
	        if (busConversation.custom_data) conversation._customData = busConversation.custom_data;
	        conversation._lastUpdate = busConversation.last_update;
	        return conversation;
	    };
	    /**
	     * Restore conversation from cache
	     * @param cacheConversation
	     * @returns {Conversation}
	     * @hidden
	     */
	    Conversation.createFromCache = function (cacheConversation) {
	        var conversation = new Conversation([]);
	        conversation._uuid = cacheConversation.uuid;
	        conversation._lastSeq = cacheConversation.seq;
	        conversation._lastUpdate = cacheConversation.lastUpdate;
	        conversation._title = cacheConversation.title;
	        conversation._moderators = cacheConversation.moderators;
	        conversation._createdAt = cacheConversation.createdAt;
	        conversation._lastRead = cacheConversation.lastRead;
	        conversation._distinct = cacheConversation.distinct;
	        conversation._publicJoin = cacheConversation.publicJoin;
	        conversation._participants = cacheConversation.participants;
	        conversation._customData = cacheConversation.customData;
	        return conversation;
	    };
	    /**
	     * Serialize conversation so it can be stored into some storage (like IndexedDB) and later restored via <a href='http://voximplant.com/docs/references/websdk/classes/messenger.html#createconversationfromcache'>Messenger.createConversationFromCache</a>
	     * @returns {SerializedConversation}
	     */
	    Conversation.prototype.toCache = function () {
	        return {
	            uuid: this._uuid,
	            seq: this._lastSeq,
	            lastUpdate: this._lastUpdate,
	            moderators: this._moderators,
	            title: this._title,
	            createdAt: this._createdAt,
	            lastRead: this._lastRead,
	            distinct: this._distinct,
	            publicJoin: this._publicJoin,
	            participants: this._participants,
	            customData: this._customData
	        };
	    };
	    Object.defineProperty(Conversation.prototype, "title", {
	        get: function () {
	            return this._title;
	        },
	        /**
	         * Sets current conversation title. Note that setting this property does not send changes to the server. Use the 'update' to send all changes at once or 'setTitle' to update and set the title.
	         * @param value
	         */
	        set: function (value) {
	            this._title = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "distinct", {
	        get: function () {
	            return this._distinct;
	        },
	        /**
	         * If two conversations are created with same set of users and moderators and both have 'distinct' flag, second create call will fail with the UUID of conversation already created. Note that changing users or moderators list will clear 'distinct' flag.
	         * Note that setting this property does not send changes to the server. Use the 'update' to send all changes at once or 'setDistinct' to update and set the distinc flag.
	         * @param value
	         */
	        set: function (value) {
	            this._distinct = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "publicJoin", {
	        get: function () {
	            return this._publicJoin;
	        },
	        /**
	         * If set to 'true', anyone can join conversation by UUID. Note that setting this property does not send changes to the server. Use the 'update' to send all changes at once or 'setPublicJoin' to update and set the public join flag.
	         * @param value
	         */
	        set: function (value) {
	            this._publicJoin = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "customData", {
	        get: function () {
	            return this._customData;
	        },
	        /**
	         * JavaScript object with custom data, up to 5kb. Note that setting this property does not send changes to the server. Use the 'update' to send all changes at once or 'setCustomData' to update and set the custom data.
	         * @param value
	         */
	        set: function (value) {
	            this._customData = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "moderators", {
	        /**
	         * Conversation moderator names list.
	         */
	        get: function () {
	            return this._moderators;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "createdAt", {
	        get: function () {
	            return this._createdAt;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "participants", {
	        /**
	         * Conversation participants list alongside with their rights.
	         */
	        get: function () {
	            return this._participants;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "lastSeq", {
	        /**
	         * Last event sequence for this conversation. Used with 'lastRead' to display unread messages and events.
	         */
	        get: function () {
	            return this._lastSeq;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Conversation.prototype, "lastUpdate", {
	        /**
	         * UNIX timestamp integer that specifies the time of the last event in the conversation. It's same as 'Date.now()' divided by 1000.
	         */
	        get: function () {
	            return this._lastUpdate;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    //==============msg part============
	    Conversation.prototype.sendMessage = function (message, payload) {
	        var msg = new Message_1.Message(message, payload);
	        msg.sendTo(this);
	        return msg;
	    };
	    /**
	     * Calling this method will inform backend that user is typing some text. Calls within 10s interval from the last call are discarded.
	     * @returns {boolean} 'true' is message was actually sent, 'false' if it was discarded.
	     */
	    Conversation.prototype.typing = function () {
	        var _this = this;
	        if (this._debounceLock) return false;
	        setTimeout(function () {
	            _this._debounceLock = false;
	        }, 10000);
	        this._debounceLock = true;
	        MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.typingMessage, { conversation: this._uuid });
	        return true;
	    };
	    /**
	     * Mark the event with the specified sequence as 'read'. This affects 'lastRead' and is used to display unread messages and events. Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#isread'>isRead</a> event for all messenger objects on all connected clients, including this one.
	     * @param seq
	     */
	    Conversation.prototype.markAsRead = function (seq) {
	        MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.isRead, { conversation: this._uuid, seq: seq });
	        this._lastRead = seq;
	    };
	    /**
	     * Mark event as handled by current logged-in device. If single user is logged in on multiple devices, this can be used to display delivery status by subscribing to the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#isdelivered'>isDelivered</a> event.
	     * @param seq
	     */
	    Conversation.prototype.markAsDelivered = function (seq) {
	        MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.isDelivered, { conversation: this._uuid, seq: seq });
	    };
	    /**
	     * Remove current conversation. All participants, including this one, will receive the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#onremoveconversation'>onRemoveConversation</a> event.
	     */
	    Conversation.prototype.remove = function () {
	        ConversationManager_1.ConversationManager.get().removeConversation(this._uuid);
	    };
	    /**
	     * Send conversation changes to the server. The changes sent are: title, public join flag, distinct flag and custom data. Used to send all changes modified via properties. Changes via 'setTitle', 'setPublicJoin' etc are send instantly.
	     */
	    Conversation.prototype.update = function () {
	        ConversationManager_1.ConversationManager.get().editConversation(this);
	    };
	    /**
	     * Set the conversation title and send changes to the server.
	     */
	    Conversation.prototype.setTitle = function (title) {
	        this._title = title;
	        ConversationManager_1.ConversationManager.get().editConversation(this);
	    };
	    /**
	     * Set the public join flag and send changes to the server.
	     */
	    Conversation.prototype.setPublicJoin = function (publicJoin) {
	        this._publicJoin = publicJoin;
	        ConversationManager_1.ConversationManager.get().editConversation(this);
	    };
	    /**
	     * Set the distinct flag and send changes to the server.
	     */
	    Conversation.prototype.setDistinct = function (distinct) {
	        this._distinct = distinct;
	        ConversationManager_1.ConversationManager.get().editConversation(this);
	    };
	    /**
	     * Set the JS object custom data and send changes to the server.
	     */
	    Conversation.prototype.setCustomData = function (customData) {
	        //FIXME: to implement!
	    };
	    /**
	     * Add new participants to the conversation.
	     * Duplicated users are ignored.
	     * Will fail if any user does not exist.
	     * Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#oneditconversation'>onEditConversation</a>
	     * event for all messenger objects on all clients, including this one. Clients that are not connected will receive it later.
	     * @param participants
	     * @returns {Promise<onEditConversation>|Promise}
	     */
	    Conversation.prototype.addParticipants = function (participants) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (participants.length == 0) reject();
	            MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.addParticipants, { uuid: _this._uuid, participants: _this.prepareParticipants(participants) });
	            Messenger_1.Messenger.getInstance().registerPromise(onEditConversation, resolve, reject);
	        });
	    };
	    /**
	     * Edit participants access rights params.
	     * Will fail if any user does not exist.
	     * Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#oneditconversation'>onEditConversation</a>
	     * event for all messenger objects on all clients, including this one. Clients that are not connected will receive it later.
	     * @param participants
	     * @returns {Promise<onEditConversation>|Promise}
	     */
	    Conversation.prototype.editParticipants = function (participants) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (participants.length == 0) reject();
	            MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.editParticipants, { uuid: _this._uuid, participants: _this.prepareParticipants(participants) });
	            Messenger_1.Messenger.getInstance().registerPromise(onEditConversation, resolve, reject);
	        });
	    };
	    /**
	     * Remove participants from the conversation.
	     * Duplicated users are ignored.
	     * Will fail if any user does not exist.
	     * Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#oneditconversation'>onEditConversation</a>
	     * event for all messenger objects on all clients, including this one. Clients that are not connected will receive it later.
	     * @param participants
	     * @returns {Promise<onEditConversation>|Promise}
	     */
	    Conversation.prototype.removeParticipants = function (participants) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (participants.length == 0) reject();
	            MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.removeParticipants, { uuid: _this._uuid, participants: participants.map(function (item) {
	                    if (typeof item.userId !== "undefined") return item.userId;
	                }) });
	            Messenger_1.Messenger.getInstance().registerPromise(onEditConversation, resolve, reject);
	        });
	    };
	    /**
	     * Add new moderators to the conversation.
	     * Duplicated users are ignored.
	     * Will fail if any user does not exist.
	     * Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#oneditconversation'>onEditConversation</a>
	     * event for all messenger objects on all clients, including this one. Clients that are not connected will receive it later.
	     * @param participants
	     * @returns {Promise<onEditConversation>|Promise}
	     */
	    Conversation.prototype.addModerators = function (moderators) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (moderators.length == 0) reject();
	            MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.addModerators, { uuid: _this._uuid, moderators: moderators });
	            Messenger_1.Messenger.getInstance().registerPromise(onEditConversation, resolve, reject);
	        });
	    };
	    /**
	     * Remove moderators from the conversation.
	     * Duplicated users are ignored.
	     * Will fail if any user does not exist.
	     * Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#oneditconversation'>onEditConversation</a>
	     * event for all messenger objects on all clients, including this one. Clients that are not connected will receive it later.
	     * @param participants
	     * @returns {Promise<onEditConversation>|Promise}
	     */
	    Conversation.prototype.removeModerators = function (moderators) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            if (moderators.length == 0) reject();
	            MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.removeModerators, { uuid: _this._uuid, moderators: moderators });
	            Messenger_1.Messenger.getInstance().registerPromise(onEditConversation, resolve, reject);
	        });
	    };
	    /**
	     * Request events in the specified sequence range to be sent from server into this client. Used to get history or get missed events in case of network disconnect.
	     * Please note that server will not push any events that was missed due to the client being offline. Client should use this method to request all events based
	     * on the last event sequence received from the server and last event sequence saved locally (if any).
	     * @param eventsFrom first event in range sequence, inclusive
	     * @param eventsTo last event in range sequence, inclusive
	     */
	    Conversation.prototype.retransmitEvents = function (eventsFrom, eventsTo) {
	        eventsFrom = eventsFrom | 0;
	        eventsTo = eventsTo | 0;
	        MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.retransmitEvents, { uuid: this._uuid, eventsFrom: eventsFrom, eventsTo: eventsTo });
	    };
	    /**
	     * @hidden
	     * @param newSeq
	     */
	    Conversation.prototype.updateSeq = function (newSeq) {
	        if (newSeq > this._lastSeq) {
	            this._lastSeq = newSeq;
	        }
	        this._lastUpdate = Date.now() / 1000 | 0;
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "getPayload", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "getSimplePayload", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "prepareParticipants", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "createUUID", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "toCache", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "markAsRead", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "markAsDelivered", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "remove", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "update", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "addParticipants", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "editParticipants", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "removeParticipants", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "addModerators", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "removeModerators", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "retransmitEvents", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation.prototype, "updateSeq", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation, "createFromBus", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Conversation, "createFromCache", null);
	    return Conversation;
	}();
	exports.Conversation = Conversation;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var Conversation_1 = __webpack_require__(53);
	var MsgSignaling_1 = __webpack_require__(34);
	var MsgEnums_1 = __webpack_require__(35);
	var MessagingEvents_1 = __webpack_require__(55);
	var Logger_1 = __webpack_require__(4);
	var Messenger_1 = __webpack_require__(52);
	var Message_1 = __webpack_require__(56);
	/**
	 * Created by irbisadm on 24/10/2016.
	 * @hidden
	 */
	var ConversationManager = function () {
	    function ConversationManager() {
	        var _this = this;
	        if (ConversationManager.instance) throw new Error("Error - use ConversationManager.get()");
	        this.signalling = MsgSignaling_1.MsgSignaling.get();
	        this.awaitingConversations = {};
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onEditConversation, function (payload) {
	            _this.resolveEvent(payload, MessagingEvents_1.MessagingEvents.onEditConversation);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onGetConversation, function (payload) {
	            _this.resolveEvent(payload, MessagingEvents_1.MessagingEvents.onGetConversation);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onRemoveConversation, function (payload) {
	            _this.resolveEvent(payload, MessagingEvents_1.MessagingEvents.onRemoveConversation);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onCreateConversation, function (payload) {
	            _this.resolveEvent(payload, MessagingEvents_1.MessagingEvents.onCreateConversation);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onSendMessage, function (payload) {
	            _this.resolveMessageEvent(payload, MessagingEvents_1.MessagingEvents.onSendMessage);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onEditMessage, function (payload) {
	            _this.resolveMessageEvent(payload, MessagingEvents_1.MessagingEvents.onEditMessage);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onRemoveMessage, function (payload) {
	            _this.resolveMessageEvent(payload, MessagingEvents_1.MessagingEvents.onRemoveMessage);
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.isRead, function (payload) {
	            var realPayload = payload.object;
	            Messenger_1.Messenger.getInstance().dispatchEvent(MessagingEvents_1.MessagingEvents.isRead, {
	                conversation: realPayload.conversation,
	                timestamp: new Date(realPayload.timestamp * 1000),
	                userId: payload.user_id,
	                seq: realPayload.seq,
	                onIncomingEvent: payload.on_incoming_event,
	                name: MessagingEvents_1.MessagingEvents[MessagingEvents_1.MessagingEvents.isRead]
	            });
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.isDelivered, function (payload) {
	            var realPayload = payload.object;
	            Messenger_1.Messenger.getInstance().dispatchEvent(MessagingEvents_1.MessagingEvents.isDelivered, {
	                conversation: realPayload.conversation,
	                timestamp: new Date(realPayload.timestamp * 1000),
	                userId: payload.user_id,
	                seq: realPayload.seq,
	                onIncomingEvent: payload.on_incoming_event,
	                name: MessagingEvents_1.MessagingEvents[MessagingEvents_1.MessagingEvents.isDelivered]
	            });
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onTyping, function (payload) {
	            Messenger_1.Messenger.getInstance().dispatchEvent(MessagingEvents_1.MessagingEvents.onTyping, {
	                name: MessagingEvents_1.MessagingEvents[MessagingEvents_1.MessagingEvents.onTyping],
	                conversation: payload.object.conversation,
	                userId: payload.user_id,
	                onIncomingEvent: payload.on_incoming_event
	            });
	        });
	        this.signalling.addEventListener(MsgEnums_1.MsgEvent.onRetransmitEvents, function (payload) {
	            Messenger_1.Messenger.getInstance().dispatchEvent(MessagingEvents_1.MessagingEvents.onRetransmitEvents, {
	                events: payload.object.map(function (item) {
	                    if (item.event) {
	                        if (item.event.indexOf('Message') == -1) return {
	                            name: item.event,
	                            conversation: Conversation_1.Conversation.createFromBus(item.payload.object, item.payload.seq),
	                            userId: item.payload.user_id,
	                            seq: item.payload.seq,
	                            onIncomingEvent: item.payload.on_incoming_event
	                        };else return {
	                            name: item.event,
	                            message: Message_1.Message.createFromBus(item.payload.object, item.payload.seq),
	                            userId: item.payload.user_id,
	                            seq: item.payload.seq,
	                            onIncomingEvent: item.payload.on_incoming_event
	                        };
	                    }
	                }),
	                userId: payload.user_id,
	                seq: payload.seq,
	                onIncomingEvent: payload.on_incoming_event
	            });
	        });
	        this._converasationList = [];
	    }
	    /**
	     * Resolve Event
	     * @param payload
	     * @param seq
	     * @param realEvent
	     */
	    ConversationManager.prototype.resolveEvent = function (payload, realEvent) {
	        if (MessagingEvents_1.MessagingEvents[realEvent] === MessagingEvents_1.MessagingEvents[MessagingEvents_1.MessagingEvents.onRemoveConversation]) {
	            var payloadObject = payload.object;
	            Messenger_1.Messenger.getInstance().dispatchEvent(realEvent, {
	                name: MessagingEvents_1.MessagingEvents[realEvent],
	                uuid: payloadObject.uuid,
	                userId: payload.user_id,
	                seq: payload.seq,
	                onIncomingEvent: payload.on_incoming_event
	            });
	            return;
	        }
	        var conversation = Conversation_1.Conversation.createFromBus(payload.object, payload.seq);
	        this.registerConversation(conversation);
	        if (typeof conversation != "undefined") conversation.updateSeq(payload.seq);
	        Messenger_1.Messenger.getInstance().dispatchEvent(realEvent, {
	            name: MessagingEvents_1.MessagingEvents[realEvent],
	            conversation: conversation,
	            userId: payload.user_id,
	            seq: payload.seq,
	            onIncomingEvent: payload.on_incoming_event
	        });
	        //resolve awaiting conversation events, such new message
	        if (realEvent === MessagingEvents_1.MessagingEvents.onGetConversation && typeof this.awaitingConversations[conversation.uuid] !== "undefined") {
	            this.awaitingConversations[conversation.uuid](conversation);
	            delete this.awaitingConversations[conversation.uuid];
	        }
	    };
	    /**
	     * Resolve message Event
	     * @param payload
	     * @param seq
	     * @param realEvent
	     */
	    ConversationManager.prototype.resolveMessageEvent = function (payload, realEvent) {
	        var _this = this;
	        Message_1.Message.createFromBus(payload.object, payload.seq).then(function (message) {
	            if (typeof _this._converasationList[message.conversation] != "undefined") _this._converasationList[message.conversation].updateSeq(payload.seq);
	            Messenger_1.Messenger.getInstance().dispatchEvent(realEvent, {
	                name: MessagingEvents_1.MessagingEvents[realEvent],
	                message: message,
	                userId: payload.user_id,
	                seq: payload.seq,
	                onIncomingEvent: payload.on_incoming_event
	            });
	        });
	    };
	    ConversationManager.get = function () {
	        ConversationManager.instance = ConversationManager.instance || new ConversationManager();
	        return ConversationManager.instance;
	    };
	    /**
	     * Remove custom domain ending
	     * @param username
	     * @returns {string}
	     */
	    ConversationManager.extractUserName = function (username) {
	        var userParts = username.split('@');
	        userParts[1] = userParts[1].split('.').splice(0, 2).join('.');
	        return userParts.join('@');
	    };
	    /**
	     * Create new conversation
	     * @param participants
	     * @param title
	     * @param distinct
	     * @param enablePublicJoin
	     * @param customData
	     * @returns {Promise<Conversation>|Promise}
	     */
	    ConversationManager.prototype.createConversation = function (participants, title, distinct, enablePublicJoin, customData, moderators) {
	        var newConversation = new Conversation_1.Conversation(participants, distinct, enablePublicJoin, customData, moderators);
	        newConversation.title = title;
	        newConversation.createUUID();
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.createConversation, newConversation.getPayload());
	    };
	    /**
	     * Add conversation to conversation list and database
	     * @param conversation
	     */
	    ConversationManager.prototype.registerConversation = function (conversation) {
	        this._converasationList.filter(function (item) {
	            return item.uuid !== conversation.uuid;
	        });
	        this._converasationList.push(conversation);
	    };
	    /**
	     * Remove conversation
	     * @param uuid
	     * @returns {Promise<Conversation>|Promise}
	     */
	    ConversationManager.prototype.removeConversation = function (uuid) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.removeConversation, { uuid: uuid });
	    };
	    /**
	     * Edit conversation
	     * @param conversation
	     * @returns {Promise<Conversation>|Promise}
	     */
	    ConversationManager.prototype.editConversation = function (conversation) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.editConversation, conversation.getSimplePayload());
	    };
	    /**
	     * Return conversation from memory. If not exist, or "force" set to true - get conversation from backend
	     * @param uuid
	     * @returns {Promise<Conversation>|Promise}
	     */
	    ConversationManager.prototype.getConversation = function (uuid) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.getConversation, { uuid: uuid });
	    };
	    ConversationManager.prototype.getConversationByUUID = function (uuid) {
	        var _this = this;
	        return new Promise(function (resolve, reject) {
	            for (var _i = 0, _a = _this._converasationList; _i < _a.length; _i++) {
	                var conversation = _a[_i];
	                if (conversation.uuid === uuid) {
	                    Messenger_1.Messenger.getInstance().dispatchEvent(MessagingEvents_1.MessagingEvents.onGetConversation, { conversation: conversation });
	                    resolve(conversation);
	                    return;
	                }
	            }
	            _this.awaitingConversations[uuid] = resolve;
	        });
	    };
	    /**
	     * Deserialize conversation from disc cache
	     * @hidden
	     * @param value
	     * @returns {Conversation}
	     */
	    ConversationManager.deserialize = function (value) {
	        return Conversation_1.Conversation.createFromCache(value);
	    };
	    /**
	     * Serialize conversation for disc storage
	     * @param conversation
	     * @returns {SerializedConversation}
	     */
	    ConversationManager.serialize = function (conversation) {
	        return conversation.toCache();
	    };
	    ConversationManager.prototype.getConversations = function (conversations) {
	        this.signalling.sendPayload(MsgEnums_1.MsgAction.getConversations, { uuids: conversations });
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "resolveEvent", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "resolveMessageEvent", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "createConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "registerConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "removeConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "editConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "getConversation", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "getConversationByUUID", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager.prototype, "getConversations", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager, "get", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager, "extractUserName", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager, "deserialize", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], ConversationManager, "serialize", null);
	    return ConversationManager;
	}();
	exports.ConversationManager = ConversationManager;

/***/ }),
/* 55 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 *
	 */
	
	(function (MessagingEvents) {
	    MessagingEvents[MessagingEvents["onCreateConversation"] = "onCreateConversation"] = "onCreateConversation";
	    MessagingEvents[MessagingEvents["onEditConversation"] = "onEditConversation"] = "onEditConversation";
	    MessagingEvents[MessagingEvents["onRemoveConversation"] = "onRemoveConversation"] = "onRemoveConversation";
	    MessagingEvents[MessagingEvents["onGetConversation"] = "onGetConversation"] = "onGetConversation";
	    MessagingEvents[MessagingEvents["onSendMessage"] = "onSendMessage"] = "onSendMessage";
	    MessagingEvents[MessagingEvents["onEditMessage"] = "onEditMessage"] = "onEditMessage";
	    MessagingEvents[MessagingEvents["onRemoveMessage"] = "onRemoveMessage"] = "onRemoveMessage";
	    MessagingEvents[MessagingEvents["onTyping"] = "Typing"] = "onTyping";
	    MessagingEvents[MessagingEvents["onEditUser"] = "onEditUser"] = "onEditUser";
	    MessagingEvents[MessagingEvents["onGetUser"] = "onGetUser"] = "onGetUser";
	    MessagingEvents[MessagingEvents["onError"] = "onError"] = "onError";
	    MessagingEvents[MessagingEvents["onRetransmitEvents"] = "onRetransmitEvents"] = "onRetransmitEvents";
	    MessagingEvents[MessagingEvents["isRead"] = "isRead"] = "isRead";
	    MessagingEvents[MessagingEvents["isDelivered"] = "isDelivered"] = "isDelivered";
	    MessagingEvents[MessagingEvents["onSubscribe"] = "onSubscribe"] = "onSubscribe";
	    MessagingEvents[MessagingEvents["onUnSubscribe"] = "onUnSubscribe"] = "onUnSubscribe";
	    MessagingEvents[MessagingEvents["onSetStatus"] = "onSetStatus"] = "onSetStatus";
	})(exports.MessagingEvents || (exports.MessagingEvents = {}));
	var MessagingEvents = exports.MessagingEvents;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
	    var c = arguments.length,
	        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
	        d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var GUID_1 = __webpack_require__(39);
	var MsgSignaling_1 = __webpack_require__(34);
	var MsgEnums_1 = __webpack_require__(35);
	var Logger_1 = __webpack_require__(4);
	/**
	 * Describes single message. Received via the 'onSendMessage' or 'onEditMessage' events and used to serialize or edit the message.
	 */
	var Message = function () {
	    function Message(message, payload) {
	        this._text = message;
	        this._payload = payload;
	        this._uuid = new GUID_1.GUID().toString();
	    }
	    /**
	     * @hidden
	     * @param conversation
	     */
	    Message.prototype.sendTo = function (conversation) {
	        this._conversation = conversation.uuid;
	        MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.sendMessage, this.getPayload());
	    };
	    /**
	     * @hidden
	     * @returns {{uuid: string, text: string, conversation: string}}
	     */
	    Message.prototype.getPayload = function () {
	        var str = {
	            uuid: this._uuid,
	            text: this._text,
	            conversation: this._conversation
	        };
	        if (typeof this._payload !== "undefined") str['payload'] = this._payload;else str['payload'] = [];
	        return str;
	    };
	    Object.defineProperty(Message.prototype, "uuid", {
	        /**
	         * Universally unique identifier of message. Can be used on client side for house keeping.
	         * @returns {string}
	         */
	        get: function () {
	            return this._uuid;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Message.prototype, "conversation", {
	        /**
	         * UUID of the conversation this message belongs to.
	         */
	        get: function () {
	            return this._conversation;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Message.prototype, "text", {
	        /**
	         * Message text.
	         */
	        get: function () {
	            return this._text;
	        },
	        set: function (value) {
	            this._text = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Message.prototype, "payload", {
	        /**
	         * Array of 'Payload' objects associated with the message.
	         */
	        get: function () {
	            return this._payload;
	        },
	        set: function (value) {
	            this._payload = value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Sends text and payload changes to the server.
	     */
	    Message.prototype.update = function () {
	        MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.editMessage, this.getPayload());
	    };
	    /**
	     * Remove the message.
	     * Triggers the <a href='http://voximplant.com/docs/references/websdk/enums/messagingevents.html#onremovemessage'>onRemoveMessage</a>
	     * event for all messenger objects on all clients, including this one. Clients that are not connected will receive it later.
	     */
	    Message.prototype.remove = function () {
	        MsgSignaling_1.MsgSignaling.get().sendPayload(MsgEnums_1.MsgAction.removeMessage, { uuid: this._uuid, conversation: this.conversation });
	    };
	    Object.defineProperty(Message.prototype, "seq", {
	        /**
	         * Message sequence number.
	         */
	        get: function () {
	            return this._seq;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Message.prototype, "sender", {
	        //FIXME: remove!
	        get: function () {
	            return this._sender;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Create message from bus
	     * @param busMessage
	     * @param seq
	     * @hidden
	     */
	    Message.createFromBus = function (busMessage, seq) {
	        return new Promise(function (resolve, reject) {
	            var message = new Message(busMessage.text, busMessage.payload);
	            message._uuid = busMessage.uuid;
	            message._conversation = busMessage.conversation;
	            message._sender = busMessage.sender;
	            message._seq = seq;
	            resolve(message);
	        });
	    };
	    /**
	     * @hidden
	     * @param cacheMessage
	     * @returns {Message}
	     */
	    Message.createFromCache = function (cacheMessage) {
	        var message = new Message(cacheMessage.text, cacheMessage.payload);
	        message._uuid = cacheMessage.uuid;
	        message._conversation = cacheMessage.conversation;
	        message._sender = cacheMessage.sender;
	        message._seq = cacheMessage.seq;
	        return message;
	    };
	    /**
	     * Serialize message so it can be stored into some storage (like IndexedDB) and later restored via <a href='http://voximplant.com/docs/references/websdk/classes/messenger.html#createmessagefromcache'>Messenger.createMessageFromCache</a>
	    */
	    Message.prototype.toCache = function () {
	        return {
	            seq: this._seq,
	            uuid: this._uuid,
	            text: this._text,
	            payload: this._payload,
	            conversation: this._conversation,
	            sender: this._sender
	        };
	    };
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Message.prototype, "sendTo", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Message.prototype, "getPayload", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Message.prototype, "update", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Message.prototype, "remove", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Message.prototype, "toCache", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Message, "createFromBus", null);
	    __decorate([Logger_1.LogManager.d_trace(Logger_1.LogCategory.MESSAGING)], Message, "createFromCache", null);
	    return Message;
	}();
	exports.Message = Message;

/***/ }),
/* 57 */
/***/ (function(module, exports) {

	"use strict";
	/**
	 * Enumeration of ACD statuses, use
	 * <a href="../classes/client.html#setoperatoracdstatus">VoxImplant.Client#setOperatorACDStatus</a> to set the status.
	 * <br/>
	 * <img src="../assets/images/acdflow.svg" style="width: 500px;display: block;margin: 10px auto 0 auto;"/>
	 */
	
	(function (OperatorACDStatuses) {
	  /**
	   * Operator is offline
	   * <br/>
	   * <br/>
	   * <strong>Recommended logic flow</strong>
	   * <table>
	   * <thead>
	   * <tr><th>From status      </th><th>This status                 </th><th>To status</th></tr>
	   * </thead>
	   * <tbody>
	   * <tr><td>NONE             </td><td rowspan="6">OFFLINE           </td><td rowspan="6">ONLINE           </td></tr>
	   * <tr><td>ONLINE           </td></tr>
	   * <tr><td>READY            </td></tr>
	   * <tr><td>AFTER_SERVICE    </td></tr>
	   * <tr><td>DND              </td></tr>
	   * <tr><td>TIMEOUT          </td></tr>
	   * </tbody>
	   * </table>
	   */
	  OperatorACDStatuses[OperatorACDStatuses["Offline"] = "OFFLINE"] = "Offline";
	  /**
	   * The operator is logged in, but not ready to handle incoming calls yet
	   * <br/>
	   * <br/>
	   * <strong>Recommended logic flow</strong>
	   * <table>
	   * <thead>
	   * <tr><th>From status      </th><th>This status                 </th><th>To status</th></tr>
	   * </thead>
	   * <tbody>
	   * <tr><td>OFFLINE          </td><td rowspan="2">ONLINE            </td><td rowspan="2">READY            </td></tr>
	   * <tr><td>READY            </td></tr>
	   * </tbody>
	   * </table>
	   *
	   * <strong>!!! Set status to ONLINE and then to READY, if you want flush operator ban (after missed call)</strong>
	   */
	  OperatorACDStatuses[OperatorACDStatuses["Online"] = "ONLINE"] = "Online";
	  /**
	   * Ready to handle incoming calls
	   * <br/>
	   * <br/>
	   * <strong>Recommended logic flow</strong>
	   * <table>
	   * <thead>
	   * <tr><th>From status      </th><th>This status                 </th><th>To status</th></tr>
	   * </thead>
	   * <tbody>
	   * <tr><td>ONLINE           </td><td rowspan="4">READY            </td><td rowspan="1">IN_SERVICE       </td></tr>
	   * <tr><td>DND              </td>                                      <td rowspan="1">ONLINE           </td></tr>
	   * <tr><td>AFTER_SERVICE    </td>                                      <td rowspan="1">DND              </td></tr>
	   * <tr><td>TIMEOUT          </td>                                      <td rowspan="1">TIMEOUT          </td></tr>
	   * </tbody>
	   * </table>
	   */
	  OperatorACDStatuses[OperatorACDStatuses["Ready"] = "READY"] = "Ready";
	  /**
	   * Incoming call is in service
	   * <br/>
	   * <br/>
	   * <strong>Recommended logic flow</strong>
	   * <table>
	   * <thead>
	   * <tr><th>From status      </th><th>This status                 </th><th>To status</th></tr>
	   * </thead>
	   * <tbody>
	   * <tr><td>READY            </td><td rowspan="1">IN_SERVICE    </td><td rowspan="1">AFTER_SERVICE    </td></tr>
	   * </tbody>
	   * </table>
	   */
	  OperatorACDStatuses[OperatorACDStatuses["InService"] = "IN_SERVICE"] = "InService";
	  /**
	   * Incoming call ended and now processing after service work.
	   * <br/>
	   * <br/>
	   * <strong>Recommended logic flow</strong>
	   * <table>
	   * <thead>
	   * <tr><th>From status      </th><th>This status                 </th><th>To status</th></tr>
	   * </thead>
	   * <tbody>
	   * <tr><td rowspan="4">IN_SERVICE       </td><td rowspan="4">AFTER_SERVICE    </td><td>READY            </td></tr>
	   * <tr>                                                                            <td>TIMEOUT          </td></tr>
	   * <tr>                                                                            <td>DND              </td></tr>
	   * <tr>                                                                            <td>OFFLINE          </td></tr>
	   * </tbody>
	   * </table>
	   */
	  OperatorACDStatuses[OperatorACDStatuses["AfterService"] = "AFTER_SERVICE"] = "AfterService";
	  /**
	   * The operator is on a break, maybe lunch.
	   * <br/>
	   * <br/>
	   * <strong>Recommended logic flow</strong>
	   * <table>
	   * <thead>
	   * <tr><th>From status      </th><th>This status                 </th><th>To status</th></tr>
	   * </thead>
	   * <tbody>
	   * <tr><td>READY            </td><td rowspan="2">TIMEOUT          </td><td rowspan="2">READY            </td></tr>
	   * <tr><td>AFTER_SERVICE    </td></tr>
	   * </tbody>
	   * </table>
	   */
	  OperatorACDStatuses[OperatorACDStatuses["Timeout"] = "TIMEOUT"] = "Timeout";
	  /**
	   * The operator is busy now and not ready to handle incoming calls (e.g. working on another call)
	   * <br/>
	   * <br/>
	   * <strong>Recommended logic flow</strong>
	   * <table>
	   * <thead>
	   * <tr><th>From status      </th><th>This status                 </th><th>To status</th></tr>
	   * </thead>
	   * <tbody>
	   * <tr><td>READY            </td><td rowspan="2">DND              </td><td rowspan="2">READY            </td></tr>
	   * <tr><td>AFTER_SERVICE    </td></tr>
	   * </tbody>
	   * </table>
	   */
	  OperatorACDStatuses[OperatorACDStatuses["DND"] = "DND"] = "DND";
	})(exports.OperatorACDStatuses || (exports.OperatorACDStatuses = {}));
	var OperatorACDStatuses = exports.OperatorACDStatuses;

/***/ })
/******/ ]);
//# sourceMappingURL=voximplant.js.map