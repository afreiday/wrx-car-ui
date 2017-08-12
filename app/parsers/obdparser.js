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
var obdpid_1 = require("./obdpid");
var ObdParser = (function (_super) {
    __extends(ObdParser, _super);
    function ObdParser(io) {
        var _this = _super.call(this, io) || this;
        _this.ID_PID_REPLY = '7e8';
        _this.parsers = [
            new data_1.PassthroughParser(ObdParser.VEHICLE_SPEED),
            new data_1.PassthroughParser(ObdParser.INTAKE_PRESSURE),
            new data_1.PassthroughParser(ObdParser.BAROMETRIC_PRESSURE),
            new data_1.PercentageParser(ObdParser.FUEL_LEVEL),
            new data_1.PercentageParser(ObdParser.ENGINE_LOAD),
            new data_1.PercentageParser(ObdParser.ACCELERATOR_PEDAL_POSITON),
            new data_1.TemperatureParser(ObdParser.COOLANT_TEMPERATURE),
            new data_1.TemperatureParser(ObdParser.OIL_TEMPERATURE),
            new data_1.TemperatureParser(ObdParser.AMBIENT_AIR_TEMPERATURE),
            new data_1.DataParser(ObdParser.TIMING_ADVANCE, function (data) {
                return (data[3] / 1.28) - 100;
            }),
            new data_1.DataParser(ObdParser.CATALYST_TEMPERATURE, function (data) {
                return ((256 * data[3] + data[4]) / 10) - 40;
            }),
            new data_1.DataParser(ObdParser.OXYGEN_SENSOR, function (data) {
                return (2 / 65536) / (256 * data[3] + data[4]);
            }),
            new data_1.DataParser(ObdParser.MAF_RATE, function (data) {
                return (data[3] * 256 + data[4]) / 100;
            }),
            new data_1.DataParser(ObdParser.ENGINE_RPM, function (data) {
                return parseInt('' + (((data[3] * 256) + data[4]) / 4));
            }),
            new data_1.DataParser(ObdParser.ENGINE_RUNTIME, function (data) {
                return 256 * data[3] + data[4];
            }),
        ];
        return _this;
    }
    ObdParser.prototype.parseMessage = function (msg) {
        var found = false;
        for (var _i = 0, _a = this.parsers; _i < _a.length; _i++) {
            var parser = _a[_i];
            if (parser.canParse(msg.data[2].toString(16))) {
                parser.parse(this.io, msg.data);
                found = true;
            }
        }
        if (!found) {
            console.log('Got unparsed: ' + msg.data[2].toString(16));
        }
    };
    ObdParser.prototype.canParse = function (data) {
        return data.id.toString(16) === this.ID_PID_REPLY;
    };
    ObdParser.ENGINE_RPM = new obdpid_1.ObdPid('c', 'ENGINE_RPM', 0.25);
    ObdParser.VEHICLE_SPEED = new obdpid_1.ObdPid('d', 'VEHICLE_SPEED', 1);
    ObdParser.MAF_RATE = new obdpid_1.ObdPid('10', 'MAF_RATE', 0.5);
    ObdParser.INTAKE_PRESSURE = new obdpid_1.ObdPid('b', 'INTAKE_PRESSURE', 5);
    ObdParser.OXYGEN_SENSOR = new obdpid_1.ObdPid('24', 'OXYGEN_SENSOR', 5);
    ObdParser.BAROMETRIC_PRESSURE = new obdpid_1.ObdPid('33', 'BAROMETRIC_PRESSURE', 5);
    ObdParser.FUEL_LEVEL = new obdpid_1.ObdPid('2f', 'FUEL_LEVEL', 2.5);
    ObdParser.COOLANT_TEMPERATURE = new obdpid_1.ObdPid('5', 'COOLANT_TEMPERATURE', 5);
    ObdParser.ENGINE_LOAD = new obdpid_1.ObdPid('4', 'ENGINE_LOAD', 0.5);
    ObdParser.TIMING_ADVANCE = new obdpid_1.ObdPid('e', 'TIMING_ADVANCE', 0.5);
    ObdParser.CATALYST_TEMPERATURE = new obdpid_1.ObdPid('3c', 'CATALYST_TEMPERATURE', 5);
    ObdParser.OIL_TEMPERATURE = new obdpid_1.ObdPid('5c', 'OIL_TEMPERATURE', 5);
    ObdParser.AMBIENT_AIR_TEMPERATURE = new obdpid_1.ObdPid('46', 'AMBIENT_AIR_TEMPERATURE', 10);
    ObdParser.ENGINE_RUNTIME = new obdpid_1.ObdPid('1f', 'ENGINE_RUNTIME', 10);
    ObdParser.ACCELERATOR_PEDAL_POSITON = new obdpid_1.ObdPid('49', 'ACCELERATOR_PEDAL_POSITON', 1);
    ObdParser.pids = [
        ObdParser.ENGINE_RPM,
        ObdParser.VEHICLE_SPEED,
        ObdParser.MAF_RATE,
        ObdParser.INTAKE_PRESSURE,
        ObdParser.OXYGEN_SENSOR,
        ObdParser.BAROMETRIC_PRESSURE,
        ObdParser.FUEL_LEVEL,
        ObdParser.COOLANT_TEMPERATURE,
        ObdParser.ENGINE_LOAD,
        ObdParser.TIMING_ADVANCE,
        ObdParser.CATALYST_TEMPERATURE,
        ObdParser.OIL_TEMPERATURE,
        ObdParser.AMBIENT_AIR_TEMPERATURE,
        ObdParser.ENGINE_RUNTIME,
        ObdParser.ACCELERATOR_PEDAL_POSITON,
    ];
    return ObdParser;
}(parser_1.Parser));
exports.ObdParser = ObdParser;
