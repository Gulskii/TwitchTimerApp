/// <reference path="../../Typings/angular.d.ts" />
/// <reference path="../../Typings/jquery/jquery.d.ts"/>
var App;
(function (App) {
    var Home;
    (function (Home) {
        var Timer;
        (function (Timer) {
            "use strict";
            angular.module('homeTimerApp', [])
                .controller('homeTimerController', Timer.HomeTimerController)
                .service('dataService', Home.HomeDataService)
                .value('baseUrl', $("#baseUrl").val());
        })(Timer = Home.Timer || (Home.Timer = {}));
    })(Home = App.Home || (App.Home = {}));
})(App || (App = {}));
//# sourceMappingURL=main.js.map