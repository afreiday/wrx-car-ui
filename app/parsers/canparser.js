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
var parser_1 = require("./parser");
var data_1 = require("./data");
var parserpair_1 = require("./parserpair");
var CanParser = (function (_super) {
    __extends(CanParser, _super);
    function CanParser(io) {
        var _this = _super.call(this, io) || this;
        _this.ACCELERATOR = new parserpair_1.ParserPair('140', 'ACCELERATOR');
        _this.BRAKE = new parserpair_1.ParserPair('d1', 'BRAKE');
        _this.STEERING = new parserpair_1.ParserPair('2', 'STEERING');
        _this.CAN_SPEED = new parserpair_1.ParserPair('d1', 'CAN_SPEED');
        _this.WHEEL_SPEED_LF = new parserpair_1.ParserPair('d4', 'WHEEL_SPEED_LF');
        _this.WHEEL_SPEED_RF = new parserpair_1.ParserPair('d4', 'WHEEL_SPEED_RF');
        _this.WHEEL_SPEED_LR = new parserpair_1.ParserPair('d4', 'WHEEL_SPEED_LR');
        _this.WHEEL_SPEED_RR = new parserpair_1.ParserPair('d4', 'WHEEL_SPEED_RR');
        _this.TURN_SIGNAL = new parserpair_1.ParserPair('282', 'TURN_SIGNAL');
        _this.capablePids = [
            _this.ACCELERATOR.id,
            _this.BRAKE.id,
            _this.STEERING.id,
            _this.WHEEL_SPEED_LF.id,
            _this.TURN_SIGNAL.id,
        ];
        _this.parsers = [
            new data_1.DataParser(_this.ACCELERATOR, function (data) {
                return data[0] / 256 * 100;
            }),
            new data_1.DataParser(_this.BRAKE, function (data) {
                return data[2] / 256 * 100;
            }),
            new data_1.DataParser(_this.STEERING, function (data) {
                var b1 = data[0];
                var b2 = data[1];
                var max = 32 * 256;
                var position = 0;
                var direction = '';
                if (b1 >= 230) {
                    // turning right
                    position = ((256 - b1) * 256 + b2) / max;
                    direction = 'R';
                }
                else {
                    // turning left
                    position = (b1 * 256 + b2) / max;
                    direction = 'L';
                }
                position *= 100;
                return direction + '' + position;
            }),
            new data_1.CanSpeedParser(_this.CAN_SPEED, 1),
            new data_1.CanSpeedParser(_this.WHEEL_SPEED_LF, 1),
            new data_1.CanSpeedParser(_this.WHEEL_SPEED_RF, 2),
            new data_1.CanSpeedParser(_this.WHEEL_SPEED_LR, 3),
            new data_1.CanSpeedParser(_this.WHEEL_SPEED_RR, 4),
            new data_1.DataParser(_this.TURN_SIGNAL, function (data) {
                var left_bit = 5;
                var right_bit = 6;
                var bits = data[5].toString('2');
                if (bits[(bits.length - 1) - (left_bit - 1)] == '1') {
                    return 'L';
                }
                else if (bits[(bits.length - 1) - (right_bit - 1)] == '1') {
                    return 'R';
                }
                else {
                    return '-';
                }
            }),
        ];
        return _this;
    }
    CanParser.prototype.parseMessage = function (msg) {
        for (var _i = 0, _a = this.parsers; _i < _a.length; _i++) {
            var parser = _a[_i];
            if (parser.canParse(msg.id.toString(16))) {
                parser.parse(this.io, msg.data);
            }
        }
    };
    CanParser.prototype.canParse = function (data) {
        return this.capablePids.indexOf(data.id.toString(16)) > -1;
    };
    return CanParser;
}(parser_1.Parser));
exports.CanParser = CanParser;
