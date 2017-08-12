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
var PercentageParser = (function (_super) {
    __extends(PercentageParser, _super);
    function PercentageParser(pair) {
        return _super.call(this, pair, function (data) {
            return data[3] / 2.55;
        }) || this;
    }
    return PercentageParser;
}(dataparser_1.DataParser));
exports.PercentageParser = PercentageParser;
