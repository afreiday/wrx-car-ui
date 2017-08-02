import * as express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as can from 'socketcan';

import { Parser, ObdParser, CanParser } from './parsers';


class Server {
  private app: any;
  private server: any;
  private io: any;
  private channel: any;

  private parsers: Parser[];

  constructor(private canSocket: string = "vcan0", private port: number = 3000) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketio(this.server);
    this.channel = can.createRawChannel(canSocket, true);

    this.setup();
    this.initializeParsers();
  }

  private setup() {
    this.app.get('/', (req: any, res: any) => {
      res.sendFile(__dirname + '/index.html');
    });

    this.io.on('connection', (socket: any) => {
      console.log('connected');
    });

    this.channel.addListener('onMessage', (data: any) => {
      for(let parser of this.parsers) {
        if (parser.canParse(data)) {
          parser.parseMessage(data);
        }
      }
    });
  }

  private initializeParsers() {
    this.parsers = [
      new ObdParser(this.io),
      new CanParser(this.io)
    ];
  }

  run() {
    var _this = this;
    this.channel.start();
    this.server.listen(this.port, () => {
      console.log('Listening on ' + _this.port);
    });
  }
}

new Server().run();

/*

channel.addListener('onMessage', function(msg) {
  var id = msg.id.toString(16);

  switch(id) {
    case ID_PID_REPLY:
      get_canbus(msg);
      break;

    case ID_ACCELERATOR:
      get_accelerator(msg);
      break;

    case ID_BRAKE:
      get_brake(msg);
      break;

    case ID_STEERING:
      get_steering(msg);
      break;
  }
});

function get_steering(msg) {
  var b1 = msg.data[0];
  var b2 = msg.data[1];
  var max = 32 * 256;
  var position = 0;
  var direction = '';

  if (b1 >= 230) { // 0xe6
    // turning right
    position = ((256 - b1) * 256 + b2) / max;
    direction = 'R';
  } else {
    // turning left
    position = (b1 * 256 + b2) / max;
    direction = 'L';
  }

  position *= 100;

  io.emit('steering_wheel_position', 'steering wheel position: ' + position + '% ' + direction);
}

function get_brake(msg) {
  var pressure = msg.data[2] / 256 * 100;
  io.emit('brake_pressure', 'brake pressure: ' + pressure + '%');
}

function get_accelerator(msg) {
  var pressure = msg.data[0] / 256 * 100;
  io.emit('accelerator_pressure', 'accelerator pressure: ' + pressure + '%');
}

function get_canbus(msg) {
  var pid = msg.data[2];

  switch(pid.toString(16)) {
    case ENGINE_RPM:
      var rpm = ((msg.data[3] * 256) + msg.data[4])/4;
      io.emit('can_rpm', 'rpm: ' + rpm);
      break;

    case VEHICAL_SPEED:
      var speed = msg.data[3];
      io.emit('can_speed', 'speed: ' + speed + ' km/h');
      break;

    case MAF_RATE:
      var rate = (msg.data[3] * 256 + msg.data[4]) / 100;
      io.emit('can_maf_rate', 'maf rate: ' + rate + ' grams/sec');
      break;

    case INTAKE_PRESSURE:
      var rate = msg.data[3];
      io.emit('can_intake_pressure', 'intake pressure: ' + rate + ' kPa');
      break;

    case OXYGEN_SENSOR:
      var ratio = (2/65536)/(256*msg.data[3] + msg.data[4]);
      io.emit('can_oxygen_sensor', 'ratio: ' + ratio);
      break;

    case BAROMETRIC_PRESSURE:
      var pressure = msg.data[3];
      io.emit('can_barometric_pressure', 'barometric pressure: ' + pressure + ' kPa');
      break;

    default:
      console.log('found: ' + pid.toString(16));
      break;
  }
}

channel.start();
*/
