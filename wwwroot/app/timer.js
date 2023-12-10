/// <reference path="Typings/angular.d.ts" />
/// <reference path="Typings/jquery/jquery.d.ts"/>
var App;
(function (App) {
    var Timer = /** @class */ (function () {
        function Timer($q) {
            this.$q = $q;
            this.timeHours = 0;
            this.timeMinutes = 0;
            this.timeSeconds = 0;
            this.displayTime();
        }
        Timer.prototype.startTimer = function () {
            var _this = this;
            this.timerOn = true;
            var deferred = this.$q.defer();
            this.intervalId = setInterval(function () {
                if (_this.timerOn)
                    _this.decreaseTime();
                _this.displayTime();
                if ((_this.timeHours === 0 && _this.timeMinutes === 0 && _this.timeSeconds === 0) || _this.timeHours < 0) {
                    _this.clearTimer();
                    deferred.resolve((true));
                }
            }, 1000);
            return deferred.promise;
        };
        Timer.prototype.decreaseTime = function () {
            this.timeSeconds--;
            if (this.timeSeconds < 0) {
                this.timeSeconds = 59;
                this.timeMinutes--;
                if (this.timeMinutes < 0) {
                    this.timeHours--;
                    this.timeMinutes = 59;
                }
            }
        };
        Timer.prototype.addTime = function (hours, minutes, seconds) {
            this.timeHours += hours;
            this.timeMinutes += minutes;
            this.timeSeconds += seconds;
            if (this.timeSeconds >= 60) {
                var calculatedMinutes = Math.floor(this.timeSeconds / 60);
                this.timeMinutes += calculatedMinutes;
                this.timeSeconds -= calculatedMinutes * 60;
            }
            if (this.timeMinutes >= 60) {
                var calculatedHours = Math.floor(this.timeMinutes / 60);
                this.timeHours += calculatedHours;
                this.timeMinutes -= calculatedHours * 60;
            }
            this.displayTime();
        };
        Timer.prototype.displayTime = function () {
            $("#timerText").text((this.timeHours < 10 ? "0" : "") + this.timeHours.toString()
                + ":"
                + (this.timeMinutes < 10 ? "0" : "") + this.timeMinutes.toString()
                + ":"
                + (this.timeSeconds < 10 ? "0" : "") + this.timeSeconds.toString());
        };
        Timer.prototype.resumeTimer = function () {
            this.timerOn = true;
        };
        Timer.prototype.stopTimer = function () {
            this.timerOn = false;
        };
        Timer.prototype.clearTimer = function () {
            this.timeHours = 0;
            this.timeMinutes = 0;
            this.timeSeconds = 0;
            this.timerOn = false;
            clearInterval(this.intervalId);
            this.displayTime();
        };
        Timer.$inject = [];
        return Timer;
    }());
    App.Timer = Timer;
})(App || (App = {}));
//# sourceMappingURL=timer.js.map