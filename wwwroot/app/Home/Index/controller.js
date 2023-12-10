/// <reference path="../../Typings/angular.d.ts" />
/// <reference path="../../Typings/jquery/jquery.d.ts"/>
var App;
(function (App) {
    var Home;
    (function (Home) {
        var Index;
        (function (Index) {
            "use strict";
            var HomeIndexController = /** @class */ (function () {
                function HomeIndexController($scope, $filter, $log, $timeout, $attrs, $q, $location, $anchorScroll, $window, dataService, baseUrl) {
                    var _this = this;
                    this.$scope = $scope;
                    this.$filter = $filter;
                    this.$log = $log;
                    this.$timeout = $timeout;
                    this.$attrs = $attrs;
                    this.$q = $q;
                    this.$location = $location;
                    this.$anchorScroll = $anchorScroll;
                    this.$window = $window;
                    this.dataService = dataService;
                    this.baseUrl = baseUrl;
                    this.magicWand = {
                        'startClock': this.startClock,
                        'stopClock': this.stopClock,
                        'resumeClock': this.resumeClock,
                        'clearClock': this.clearClock,
                        'chatBotPong': this.chatBotPong,
                        'chatBotError': this.chatBotError,
                        'streamLabsPong': this.streamLabsPong
                    };
                    this.$scope.ctrl = this;
                    var ctrl = this;
                    this.currentUri = $("#currentUrl").val();
                    this.$scope.accessToken = $("#accessToken").val();
                    this.$scope.streamLabsAccessToken = $("#streamLabsAccessToken").val();
                    this.$scope.timerUrl = this.currentUri + "Home/Timer";
                    this.$scope.addHours = 0;
                    this.$scope.addMinutes = 0;
                    this.$scope.addSeconds = 0;
                    this.$scope.timerSettings = {
                        fontColor: "White",
                        fontBackground: "#00ff00",
                        fontSize: 42,
                        fontType: "Impact",
                        fontOutlineSize: 1,
                        fontOutlineColor: "Black"
                    };
                    this.clockStopped = false;
                    this.currentTimerState = 1 /* TimerState.Clear */;
                    this.getAccessToken();
                    this.getStreamLabsAccessToken();
                    this.socketClient = new App.WebSocketClient(this.magicWand, this);
                    this.socket = this.socketClient.createSocket(this.baseUrl);
                    this.$scope.twitchApiStatus = 1 /* TwitchApiStatus.Disconnected */;
                    this.$scope.streamLabsApiStatus = 1 /* TwitchApiStatus.Disconnected */;
                    this.twitchApiStatusMessage(null);
                    this.streamLabsApiStatusMessage(null);
                    this.dataService.getTimeTypeEnum().then(function (results) {
                        _this.$scope.timeTypes = results;
                    });
                    this.dataService.getFontTypeEnum().then(function (results) {
                        _this.$scope.fontOptions = results;
                    });
                    this.dataService.getTimeConversion().then(function (results) {
                        _this.$scope.timeConversion = results;
                    });
                    this.$scope.chatBotStatus = 1 /* ChatBotStatus.Disconnected */;
                    this.chatBotStatusMessage(null);
                    this.pingChatBot();
                    this.previewFont();
                }
                HomeIndexController.prototype.pingChatBot = function () {
                    var ctrl = this;
                    setInterval(function () {
                        if (ctrl.chatBotIsConnected()) {
                            ctrl.dataService.pingChatbot();
                        }
                    }, 300000);
                };
                HomeIndexController.prototype.getAccessToken = function () {
                    var _this = this;
                    var href = window.location.href.substring(this.currentUri.length + 3);
                    var parameters = href.split("&");
                    console.log(parameters);
                    parameters.forEach(function (p) {
                        var s = p.split("=");
                        if (s[0] === 'access_token') {
                            _this.accessToken = s[1];
                            //this.dataService.setTwitchApiAccessToken(this.accessToken).then(results => {
                            //window.location.href = this.currentUri;
                            //})
                            _this.dataService.setChatbotAccessToken(_this.accessToken).then(function (results) {
                                window.location.href = _this.currentUri;
                            });
                        }
                    });
                };
                HomeIndexController.prototype.getStreamLabsAccessToken = function () {
                    var _this = this;
                    var href = window.location.search;
                    var parameters = href.split("&");
                    console.log(parameters);
                    parameters.forEach(function (p) {
                        var s = p.split("=");
                        if (s[0] === '?code') {
                            _this.accessToken = s[1];
                            console.log(_this.accessToken);
                            _this.dataService.setStreamLabsAccessToken(_this.accessToken).then(function (results) {
                                window.location.href = _this.baseUrl;
                            });
                        }
                    });
                };
                HomeIndexController.prototype.isAccessTokenEmpty = function () {
                    return this.$scope.accessToken === "" || this.$scope.accessToken === null || this.$scope.accessToken === undefined;
                };
                HomeIndexController.prototype.isStreamLabsAccessTokenEmpty = function () {
                    return this.$scope.streamLabsAccessToken === "" || this.$scope.streamLabsAccessToken === null || this.$scope.streamLabsAccessToken === undefined;
                };
                HomeIndexController.prototype.askForTwitchAccess = function () {
                    var twitchApiClient = $("#twitchApiClient").val();
                    //var url = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=" + twitchApiClient + "&redirect_uri=" + this.currentUri + "&scope=channel:read:subscriptions+bits:read+user:read:chat&state=c3ab8aa609ea11e793ae92361f002671";
                    var url = "https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=" + twitchApiClient + "&redirect_uri=" + this.currentUri + "&scope=chat%3Aread+chat%3Aedit&state=c3ab8aa609ea11e793ae92361f002671";
                    window.open(url, "_self");
                };
                HomeIndexController.prototype.askForStreamLabsAccess = function () {
                    var streamLabsApiClient = $("#streamLabsApiClient").val();
                    var url = "https://streamlabs.com/api/v2.0/authorize?client_id=" + streamLabsApiClient + "&redirect_uri=" + this.currentUri + "&scope=socket.token&response_type=code&state=123456";
                    window.open(url, "_self");
                };
                HomeIndexController.prototype.setClock = function (difficulty) {
                    this.$scope.clockSetTime = 15;
                };
                HomeIndexController.prototype.timeUp = function (ctrl, data) {
                    ctrl.clearClock();
                    var webSocketCall = ctrl.socketClient.createWebSocketCall("confirmAnswer", null);
                    ctrl.socket.send(JSON.stringify(webSocketCall));
                    ctrl.$scope.$applyAsync();
                };
                HomeIndexController.prototype.startClock = function () {
                    this.currentTimerState = 2 /* TimerState.Started */;
                    var webSocketCall = this.socketClient.createWebSocketCall("startClock", this.$scope.clockSetTime);
                    this.socket.send(JSON.stringify(webSocketCall));
                };
                HomeIndexController.prototype.stopClock = function () {
                    this.currentTimerState = 3 /* TimerState.Stopped */;
                    var webSocketCall = this.socketClient.createWebSocketCall("stopClock", null);
                    this.socket.send(JSON.stringify(webSocketCall));
                };
                HomeIndexController.prototype.resumeClock = function () {
                    this.currentTimerState = 2 /* TimerState.Started */;
                    var webSocketCall = this.socketClient.createWebSocketCall("resumeClock", null);
                    this.socket.send(JSON.stringify(webSocketCall));
                };
                HomeIndexController.prototype.clearClock = function () {
                    this.currentTimerState = 1 /* TimerState.Clear */;
                    var webSocketCall = this.socketClient.createWebSocketCall("clearClock", null);
                    this.socket.send(JSON.stringify(webSocketCall));
                };
                HomeIndexController.prototype.showStartClock = function () {
                    return this.currentTimerState === 1 /* TimerState.Clear */;
                };
                HomeIndexController.prototype.showResumeClock = function () {
                    return this.currentTimerState === 3 /* TimerState.Stopped */;
                };
                HomeIndexController.prototype.showStopClock = function () {
                    return this.currentTimerState === 2 /* TimerState.Started */;
                };
                HomeIndexController.prototype.showClearClock = function () {
                    return this.currentTimerState === 2 /* TimerState.Started */ || this.currentTimerState === 3 /* TimerState.Stopped */;
                };
                HomeIndexController.prototype.openTimer = function () {
                    var ctrl = this;
                    window.open(this.$scope.timerUrl, "_blank");
                    setTimeout(function () {
                        ctrl.applyFont();
                    }, 1000);
                };
                HomeIndexController.prototype.addTimeToClock = function () {
                    var timeAddition = { hours: this.$scope.addHours, minutes: this.$scope.addMinutes, seconds: this.$scope.addSeconds };
                    var webSocketCall = this.socketClient.createWebSocketCall("addTimeToClock", JSON.stringify(timeAddition));
                    this.socket.send(JSON.stringify(webSocketCall));
                    this.$scope.addHours = 0;
                    this.$scope.addMinutes = 0;
                    this.$scope.addSeconds = 0;
                };
                HomeIndexController.prototype.saveTimeConversion = function () {
                    var ctrl = this;
                    this.dataService.saveTimeConversion(ctrl.$scope.timeConversion).then(function (results) {
                        alert("Time conversion saved!");
                    });
                };
                HomeIndexController.prototype.getTimeConversion = function () {
                    var _this = this;
                    this.dataService.getTimeConversion().then(function (results) {
                        _this.$scope.timeConversion = results;
                    });
                };
                HomeIndexController.prototype.startTwitchApi = function () {
                    var ctrl = this;
                    ctrl.$scope.twitchApiStatus = 2 /* TwitchApiStatus.Connecting */;
                    ctrl.twitchApiStatusMessage(null);
                    ctrl.$scope.$applyAsync();
                    this.dataService.startTwitchApi().then(function (results) {
                        //ongoing promise, only completes when chatbot closes properly
                        if (ctrl.$scope.twitchApiStatus !== 4 /* TwitchApiStatus.Error */) {
                            ctrl.$scope.twitchApiStatus = 1 /* TwitchApiStatus.Disconnected */;
                            ctrl.twitchApiStatusMessage(null);
                        }
                    });
                };
                HomeIndexController.prototype.startStreamLabsApi = function () {
                    var ctrl = this;
                    ctrl.$scope.streamLabsApiStatus = 2 /* TwitchApiStatus.Connecting */;
                    ctrl.streamLabsApiStatusMessage(null);
                    ctrl.$scope.$applyAsync();
                    this.dataService.startStreamLabsApi().then(function (results) {
                        //ongoing promise, only completes when chatbot closes properly
                        if (ctrl.$scope.streamLabsApiStatus !== 4 /* TwitchApiStatus.Error */) {
                            ctrl.$scope.streamLabsApiStatus = 1 /* TwitchApiStatus.Disconnected */;
                            ctrl.streamLabsApiStatusMessage(null);
                        }
                    });
                };
                HomeIndexController.prototype.chatBotError = function (ctrl, data) {
                    ctrl.$scope.twitchApiStatus = 4 /* TwitchApiStatus.Error */;
                    ctrl.twitchApiStatusMessage(data);
                    ctrl.$scope.$applyAsync();
                };
                HomeIndexController.prototype.showStartTwitchApi = function () {
                    return !this.isAccessTokenEmpty() && (this.twitchApiIsDisconnected() || this.twitchApiIsError());
                };
                HomeIndexController.prototype.showStopTwitchApi = function () {
                    return !this.isAccessTokenEmpty() && this.twitchApiIsConnected();
                };
                HomeIndexController.prototype.showStartStreamLabsApi = function () {
                    return !this.isStreamLabsAccessTokenEmpty() && (this.streamLabsApiIsDisconnected() || this.streamLabsApiIsError());
                };
                HomeIndexController.prototype.showStopStreamLabsApi = function () {
                    return !this.isStreamLabsAccessTokenEmpty() && this.streamLabsApiIsConnected();
                };
                HomeIndexController.prototype.showTestMessageToChat = function () {
                    return !this.isAccessTokenEmpty() && this.twitchApiIsConnected();
                };
                HomeIndexController.prototype.twitchApiIsDisconnected = function () {
                    return this.$scope.twitchApiStatus === 1 /* TwitchApiStatus.Disconnected */;
                };
                HomeIndexController.prototype.twitchApiIsConnecting = function () {
                    return this.$scope.twitchApiStatus === 2 /* TwitchApiStatus.Connecting */;
                };
                HomeIndexController.prototype.twitchApiIsConnected = function () {
                    return this.$scope.twitchApiStatus === 3 /* TwitchApiStatus.Connected */;
                };
                HomeIndexController.prototype.twitchApiIsError = function () {
                    return this.$scope.twitchApiStatus === 4 /* TwitchApiStatus.Error */;
                };
                HomeIndexController.prototype.streamLabsApiIsDisconnected = function () {
                    return this.$scope.streamLabsApiStatus === 1 /* TwitchApiStatus.Disconnected */;
                };
                HomeIndexController.prototype.streamLabsApiIsConnecting = function () {
                    return this.$scope.streamLabsApiStatus === 2 /* TwitchApiStatus.Connecting */;
                };
                HomeIndexController.prototype.streamLabsApiIsConnected = function () {
                    return this.$scope.streamLabsApiStatus === 3 /* TwitchApiStatus.Connected */;
                };
                HomeIndexController.prototype.streamLabsApiIsError = function () {
                    return this.$scope.streamLabsApiStatus === 4 /* TwitchApiStatus.Error */;
                };
                HomeIndexController.prototype.twitchApiStatusMessage = function (data) {
                    var ctrl = this;
                    switch (ctrl.$scope.twitchApiStatus) {
                        case 3 /* TwitchApiStatus.Connected */:
                            ctrl.$scope.twitchApiStatusMessage = "Twitch Connected - Last pinged: " + new Date().toLocaleTimeString();
                            break;
                        case 2 /* TwitchApiStatus.Connecting */:
                            ctrl.$scope.twitchApiStatusMessage = "Connecting...";
                            break;
                        case 1 /* TwitchApiStatus.Disconnected */:
                            ctrl.$scope.twitchApiStatusMessage = "Twitch Disconnected";
                            break;
                        case 4 /* TwitchApiStatus.Error */:
                            ctrl.$scope.twitchApiStatusMessage = "An error occured: " + data;
                            break;
                        default:
                            ctrl.$scope.twitchApiStatusMessage = "";
                            break;
                    }
                };
                HomeIndexController.prototype.streamLabsApiStatusMessage = function (data) {
                    var ctrl = this;
                    switch (ctrl.$scope.streamLabsApiStatus) {
                        case 3 /* TwitchApiStatus.Connected */:
                            ctrl.$scope.streamLabsApiStatusMessage = "Stream Labs Connected - Last pinged: " + new Date().toLocaleTimeString();
                            break;
                        case 2 /* TwitchApiStatus.Connecting */:
                            ctrl.$scope.streamLabsApiStatusMessage = "Connecting...";
                            break;
                        case 1 /* TwitchApiStatus.Disconnected */:
                            ctrl.$scope.streamLabsApiStatusMessage = "Stream Labs Disconnected";
                            break;
                        case 4 /* TwitchApiStatus.Error */:
                            ctrl.$scope.streamLabsApiStatusMessage = "An error occured: " + data;
                            break;
                        default:
                            ctrl.$scope.streamLabsApiStatusMessage = "";
                            break;
                    }
                };
                HomeIndexController.prototype.startChatbot = function () {
                    var ctrl = this;
                    this.$scope.chatBotStatus = 2 /* ChatBotStatus.Connecting */;
                    this.dataService.startChatbot().then(function (results) {
                        //ongoing promise, only completes when chatbot closes properly
                        if (ctrl.$scope.chatBotStatus !== 4 /* ChatBotStatus.Error */) {
                            ctrl.$scope.chatBotStatus = 1 /* ChatBotStatus.Disconnected */;
                            ctrl.chatBotStatusMessage(null);
                        }
                    });
                };
                HomeIndexController.prototype.stopChatbot = function () {
                    this.dataService.stopChatbot().then(function (results) {
                    });
                };
                HomeIndexController.prototype.sendMessageToChat = function () {
                    this.dataService.sendMessageToChat("This is a test from button click").then(function (results) {
                    });
                };
                HomeIndexController.prototype.chatBotPong = function (ctrl, data) {
                    ctrl.$scope.chatBotStatus = 3 /* ChatBotStatus.Connected */;
                    ctrl.chatBotStatusMessage(null);
                    ctrl.$scope.$applyAsync();
                };
                HomeIndexController.prototype.streamLabsPong = function (ctrl, data) {
                    ctrl.$scope.streamLabsApiStatus = 3 /* TwitchApiStatus.Connected */;
                    ctrl.streamLabsApiStatusMessage(null);
                    ctrl.$scope.$applyAsync();
                };
                //public chatBotError(ctrl: HomeIndexController, data: any) {
                //  ctrl.$scope.chatBotStatus = ChatBotStatus.Error;
                //ctrl.chatBotStatusMessage(data);
                //ctrl.$scope.$applyAsync();
                //}
                HomeIndexController.prototype.showStartChat = function () {
                    return !this.isAccessTokenEmpty() && (this.chatBotIsDisconnected() || this.chatBotIsError());
                };
                HomeIndexController.prototype.showStopChat = function () {
                    return !this.isAccessTokenEmpty() && this.chatBotIsConnected();
                };
                //public showTestMessageToChat() {
                //  return !this.isAccessTokenEmpty() && this.chatBotIsConnected();
                //}
                HomeIndexController.prototype.chatBotIsDisconnected = function () {
                    return this.$scope.chatBotStatus === 1 /* ChatBotStatus.Disconnected */;
                };
                HomeIndexController.prototype.chatBotIsConnecting = function () {
                    return this.$scope.chatBotStatus === 2 /* ChatBotStatus.Connecting */;
                };
                HomeIndexController.prototype.chatBotIsConnected = function () {
                    return this.$scope.chatBotStatus === 3 /* ChatBotStatus.Connected */;
                };
                HomeIndexController.prototype.chatBotIsError = function () {
                    return this.$scope.chatBotStatus === 4 /* ChatBotStatus.Error */;
                };
                HomeIndexController.prototype.chatBotStatusMessage = function (data) {
                    var ctrl = this;
                    switch (ctrl.$scope.chatBotStatus) {
                        case 3 /* ChatBotStatus.Connected */:
                            ctrl.$scope.chatBotStatusMessage = "Chatbot Connected - Last pinged: " + new Date().toLocaleTimeString();
                            break;
                        case 2 /* ChatBotStatus.Connecting */:
                            ctrl.$scope.chatBotStatusMessage = "Connecting...";
                            break;
                        case 1 /* ChatBotStatus.Disconnected */:
                            ctrl.$scope.chatBotStatusMessage = "Chatbot Disconnected";
                            break;
                        case 4 /* ChatBotStatus.Error */:
                            ctrl.$scope.chatBotStatusMessage = "An error occured: " + data;
                            break;
                        default:
                            ctrl.$scope.chatBotStatusMessage = "";
                            break;
                    }
                };
                HomeIndexController.prototype.previewFont = function () {
                    document.getElementById("clock").style.fontSize = this.$scope.timerSettings.fontSize + "px";
                    document.getElementById("clock").style.fontFamily = this.$scope.timerSettings.fontType;
                    document.getElementById("clock").style.webkitTextStrokeWidth = this.$scope.timerSettings.fontOutlineSize + "px";
                    document.getElementById("clock").style.webkitTextStrokeColor = this.$scope.timerSettings.fontOutlineColor;
                    document.getElementById("clock").style.backgroundColor = this.$scope.timerSettings.fontBackground;
                    document.getElementById("clock").style.color = this.$scope.timerSettings.fontColor;
                };
                HomeIndexController.prototype.applyFont = function () {
                    var ctrl = this;
                    var webSocketCall = this.socketClient.createWebSocketCall("applyFont", JSON.stringify(ctrl.$scope.timerSettings));
                    this.socket.send(JSON.stringify(webSocketCall));
                };
                HomeIndexController.$inject = [
                    '$scope',
                    '$filter',
                    '$log',
                    '$timeout',
                    '$attrs',
                    '$q',
                    '$location',
                    '$anchorScroll',
                    "$window",
                    'dataService',
                    'baseUrl'
                ];
                return HomeIndexController;
            }());
            Index.HomeIndexController = HomeIndexController;
        })(Index = Home.Index || (Home.Index = {}));
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));
//# sourceMappingURL=controller.js.map