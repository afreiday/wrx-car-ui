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
var dataparser_1 = require("./dataparser");
var CanSpeedParser = (function (_super) {
    __extends(CanSpeedParser, _super);
    function CanSpeedParser(pair, bytePair) {
        return _super.call(this, pair, function (data) {
            var firstByte = (bytePair - 1) * 2;
            return parseInt('' + ((data[firstByte + 1] * 256 + data[firstByte]) * 0.05625));
        }) || this;
    }
    return CanSpeedParser;
}(dataparser_1.DataParser));
exports.CanSpeedParser = CanSpeedParser;
