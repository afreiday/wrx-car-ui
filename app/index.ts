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
      res.sendFile('index.html', { root: __dirname + '../../' });
    });

    this.io.on('connection', (socket: any) => {
      console.log('connected');
      this.io.emit('connected', 'connected');
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
