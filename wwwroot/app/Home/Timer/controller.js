/// <reference path="../../Typings/angular.d.ts" />
/// <reference path="../../Typings/jquery/jquery.d.ts"/>
var App;
(function (App) {
    var Home;
    (function (Home) {
        var Timer;
        (function (Timer) {
            "use strict";
            var HomeTimerController = /** @class */ (function () {
                function HomeTimerController($scope, $filter, $log, $timeout, $attrs, $q, $location, $anchorScroll, $window, dataService, baseUrl) {
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
                        'addTimeToClock': this.addTimeToClock,
                        'applyFont': this.applyFont
                    };
                    this.$scope.ctrl = this;
                    var ctrl = this;
                    this.timer = new App.Timer(this.$q);
                    this.socketClient = new App.WebSocketClient(this.magicWand, this);
                    this.socket = this.socketClient.createSocket(this.baseUrl);
                }
                HomeTimerController.prototype.addTimeToClock = function (ctrl, data) {
                    var timerAddition = jQuery.parseJSON(data);
                    ctrl.timer.addTime(timerAddition.hours, timerAddition.minutes, timerAddition.seconds);
                };
                HomeTimerController.prototype.startClock = function (ctrl, data) {
                    ctrl.timer.startTimer().then(function (result) {
                        if (result === true) {
                            var webSocketCall = ctrl.socketClient.createWebSocketCall("timeUp", null);
                            ctrl.socket.send(JSON.stringify(webSocketCall));
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                    ctrl.$scope.$applyAsync();
                };
                HomeTimerController.prototype.resumeClock = function (ctrl, data) {
                    ctrl.timer.resumeTimer();
                };
                HomeTimerController.prototype.stopClock = function (ctrl, data) {
                    ctrl.timer.stopTimer();
                };
                HomeTimerController.prototype.clearClock = function (ctrl, data) {
                    ctrl.timer.clearTimer();
                };
                HomeTimerController.prototype.applyFont = function (ctrl, data) {
                    var timerSettings = jQuery.parseJSON(data);
                    ctrl.$scope.timerSettings = timerSettings;
                    document.getElementById("timerText").style.fontSize = timerSettings.fontSize + "px";
                    document.getElementById("timerText").style.fontFamily = timerSettings.fontType;
                    document.getElementById("timerText").style.webkitTextStrokeWidth = timerSettings.fontOutlineSize + "px";
                    document.getElementById("timerText").style.webkitTextStrokeColor = timerSettings.fontOutlineColor;
                    document.getElementById("timerText").style.backgroundColor = timerSettings.fontBackground;
                    document.getElementById("timerText").style.color = timerSettings.fontColor;
                };
                HomeTimerController.$inject = [
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
                return HomeTimerController;
            }());
            Timer.HomeTimerController = HomeTimerController;
        })(Timer = Home.Timer || (Home.Timer = {}));
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));
//# sourceMappingURL=controller.js.map