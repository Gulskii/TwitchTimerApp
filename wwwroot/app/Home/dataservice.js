/// <reference path="../Typings/angular.d.ts" />
/// <reference path="../Typings/jquery/jquery.d.ts"/>
var App;
(function (App) {
    var Home;
    (function (Home) {
        "use strict";
        var HomeDataService = /** @class */ (function () {
            function HomeDataService($http, $log, $q, baseUrl) {
                this.$http = $http;
                this.$log = $log;
                this.$q = $q;
                this.baseUrl = baseUrl;
            }
            HomeDataService.prototype.startTwitchApi = function () {
                var query = this.baseUrl + "/api/TwitchApi/StartTwitchApi";
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.startStreamLabsApi = function () {
                var query = this.baseUrl + "/api/StreamLabsApi/StartStreamLabsApi";
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.setTwitchApiAccessToken = function (token) {
                var query = this.baseUrl + "/api/TwitchApi/SetAccessToken/" + token;
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.setStreamLabsAccessToken = function (token) {
                var query = this.baseUrl + "/api/StreamLabsApi/SetAccessToken/" + token;
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.getTimeTypeEnum = function () {
                var query = this.baseUrl + "/api/Enum/GetTimeTypeEnum";
                var deferred = this.$q.defer();
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.getFontTypeEnum = function () {
                var query = this.baseUrl + "/api/Enum/GetFontTypeEnum";
                var deferred = this.$q.defer();
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.getTimeConversion = function () {
                var query = this.baseUrl + "/api/RedeemTime/GetTimeConversion";
                var deferred = this.$q.defer();
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.saveTimeConversion = function (timeConversion) {
                var query = this.baseUrl + "/api/RedeemTime/SaveTimeConversion";
                var deferred = this.$q.defer();
                this.$http.post(query, timeConversion)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.startChatbot = function () {
                var query = this.baseUrl + "/api/Chatbot/StartChatbot";
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.stopChatbot = function () {
                var query = this.baseUrl + "/api/Chatbot/StopChatbot";
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                    console.log(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.sendMessageToChat = function (message) {
                var query = this.baseUrl + "/api/Chatbot/SendMessageToChat";
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.post(query, message)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.pingChatbot = function () {
                var query = this.baseUrl + "/api/Chatbot/PingChatBot";
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.prototype.setChatbotAccessToken = function (token) {
                var query = this.baseUrl + "/api/Chatbot/SetAccessToken/" + token;
                var deferred = this.$q.defer();
                console.log(query);
                this.$http.get(query)
                    .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) { return deferred.reject(); });
                return deferred.promise;
            };
            HomeDataService.$inject = [
                '$http',
                '$log',
                '$q',
                'baseUrl'
            ];
            return HomeDataService;
        }());
        Home.HomeDataService = HomeDataService;
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));
//# sourceMappingURL=dataservice.js.map