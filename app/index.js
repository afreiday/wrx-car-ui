"use strict";
exports.__esModule = true;
var express = require("express");
var socketio = require("socket.io");
var http = require("http");
var can = require("rawcan");
var command_line_args = require("command-line-args");
var parsers_1 = require("./parsers");
var obdrequester_1 = require("./obdrequester");
var Server = (function () {
    function Server(canSocket, port) {
        if (canSocket === void 0) { canSocket = 'vcan0'; }
        if (port === void 0) { port = 3000; }
        this.canSocket = canSocket;
        this.port = port;
        this.requesters = [];
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketio(this.server);
        this.socket = can.createSocket(canSocket);
        this.setup();
        this.initializeRequesters();
        this.initializeParsers();
    }
    Server.prototype.setup = function () {
        var _this = this;
        this.app.get('/', function (req, res) {
            res.sendFile('index.html', { root: __dirname + '/../client/' });
        });
        this.app.use(express.static('dist'));
        this.io.on('connection', function (socket) {
            console.log('connected');
            _this.io.emit('connected', 'connected');
        });
        this.socket.on('message', function (id, buffer) {
            var data = { id: id, data: buffer };
            for (var _i = 0, _a = _this.parsers; _i < _a.length; _i++) {
                var parser = _a[_i];
                if (parser.canParse(data)) {
                    parser.parseMessage(data);
                }
            }
        });
    };
    Server.prototype.initializeParsers = function () {
        this.parsers = [
            new parsers_1.ObdParser(this.io),
            new parsers_1.CanParser(this.io)
        ];
    };
    Server.prototype.initializeRequesters = function () {
        for (var _i = 0, _a = parsers_1.ObdParser.pids; _i < _a.length; _i++) {
            var pid = _a[_i];
            this.requesters.push(new obdrequester_1.ObdRequester(pid, this.socket));
        }
    };
    Server.prototype.run = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log('Listening on ' + _this.port);
        });
    };
    Server.DEFAULT_SOCKET = 'vcan0';
    Server.DEFAULT_PORT = 3000;
    return Server;
}());
var commandArgs = [
    { name: 'socket', alias: 's', type: String },
    { name: 'port', alias: 'p', type: Number }
];
var args = command_line_args(commandArgs);
var socket = args.socket || Server.DEFAULT_SOCKET;
var port = args.port || Server.DEFAULT_PORT;
new Server(socket, port).run();
