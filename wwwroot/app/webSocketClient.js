/// <reference path="Typings/angular.d.ts" />
/// <reference path="Typings/jquery/jquery.d.ts"/>
var App;
(function (App) {
    var WebSocketClient = /** @class */ (function () {
        function WebSocketClient(magicWand, controller) {
            this.magicWand = magicWand;
            this.controller = controller;
        }
        WebSocketClient.prototype.magicMethod = function (name, data) {
            if (this.magicWand[name]) {
                this.magicWand[name](this.controller, data);
            }
        };
        WebSocketClient.prototype.createSocket = function (url) {
            var client = this;
            var trimmedUrl = url.substr(7);
            var socket = new WebSocket("ws:" + trimmedUrl + "/ws/");
            socket.onopen = function (e) {
                console.log("[open] Connection established");
                console.log("Sending to server");
            };
            socket.onmessage = function (event) {
                var webSocketCall = JSON.parse(event.data);
                client.magicMethod(webSocketCall.functionCall, webSocketCall.data);
            };
            socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log("[close] Connection closed cleanly, code=".concat(event.code, " reason=").concat(event.reason));
                }
                else {
                    // e.g. server process killed or network down
                    // event.code is usually 1006 in this case
                    console.log('[close] Connection died');
                }
            };
            socket.onerror = function (error) {
                console.log("[error]" + error);
            };
            return socket;
        };
        WebSocketClient.prototype.createWebSocketCall = function (functionCall, object) {
            return { functionCall: functionCall, data: object };
        };
        return WebSocketClient;
    }());
    App.WebSocketClient = WebSocketClient;
})(App || (App = {}));
//# sourceMappingURL=webSocketClient.js.map