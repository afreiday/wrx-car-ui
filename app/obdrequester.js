"use strict";
exports.__esModule = true;
var ObdRequester = (function () {
    function ObdRequester(pid, socket) {
        this.pid = pid;
        this.socket = socket;
        this._active = false;
        this._requests = 0;
        this.timer = setInterval(this.request, this.pid.requestInterval * 1000, this.socket, this.pid);
        this._active = true;
        this.request(socket, pid);
    }
    Object.defineProperty(ObdRequester.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObdRequester.prototype, "requests", {
        get: function () {
            return this._requests;
        },
        enumerable: true,
        configurable: true
    });
    ObdRequester.prototype.cancel = function () {
        clearInterval(this.timer);
        this._active = false;
    };
    ObdRequester.prototype.request = function (socket, pid) {
        socket.send(ObdRequester.ID_PID_REQUEST, [
            0x02,
            0x01,
            parseInt(pid.id, 16),
            0x00,
            0x00,
            0x00,
            0x00,
            0x00
        ]);
        this._requests++;
    };
    ObdRequester.ID_PID_REQUEST = 0x7DF;
    return ObdRequester;
}());
exports.ObdRequester = ObdRequester;
