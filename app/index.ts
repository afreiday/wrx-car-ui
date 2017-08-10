import * as express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as can from 'rawcan';

import { Parser, ObdParser, CanParser, ObdPid } from './parsers';
import { ObdRequester } from './obdrequester';


class Server {
  private app: any;
  private server: any;
  private io: any;
  private socket: any;

  private parsers: Parser[];
  private requesters: ObdRequester[] = [];

  constructor(private canSocket: string = 'vcan0', private port: number = 3000) {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketio(this.server);
    this.socket = can.createSocket(canSocket);

    this.setup();
    this.initializeRequesters();
    this.initializeParsers();
  }

  private setup() {
    this.app.get('/', (req: any, res: any) => {
      res.sendFile('index.html', { root: __dirname + '/../client/' });
    });

    this.app.use(express.static('client/build'));

    this.io.on('connection', (socket: any) => {
      console.log('connected');
      this.io.emit('connected', 'connected');
    });

    this.socket.on('message', (id: any, buffer: any) => {
      const data = { id: id, data: buffer };

      for (let parser of this.parsers) {
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

  private initializeRequesters() {
    for (let pid of ObdParser.pids) {
      this.requesters.push(new ObdRequester(pid, this.socket));
    }
  }

  run() {
    var _this = this;
    this.server.listen(this.port, () => {
      console.log('Listening on ' + _this.port);
    });
  }
}

new Server().run();
