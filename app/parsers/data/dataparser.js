"use strict";
exports.__esModule = true;
var DataParser = (function () {
    function DataParser(pair, calculation) {
        this.pair = pair;
        this.calculation = calculation;
    }
    DataParser.prototype.parse = function (io, data) {
        //console.log(this.msgId, this.calculation(data));
        io.emit(this.pair.msgId, this.calculation(data));
        //console.log(this.msgId);
    };
    DataParser.prototype.canParse = function (pid) {
        return pid === this.pair.id;
    };
    return DataParser;
}());
exports.DataParser = DataParser;
