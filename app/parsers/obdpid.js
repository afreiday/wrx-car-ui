"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var parserpair_1 = require("./parserpair");
var ObdPid = (function (_super) {
    __extends(ObdPid, _super);
    function ObdPid(id, msgId, requestInterval) {
        var _this = _super.call(this, id, msgId) || this;
        _this.requestInterval = requestInterval;
        return _this;
    }
    return ObdPid;
}(parserpair_1.ParserPair));
exports.ObdPid = ObdPid;
