import * as express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import * as can from 'rawcan';
import * as command_line_args from 'command-line-args';

import { Parser, ObdParser, CanParser, ObdPid } from './parsers';
import { ObdRequester } from './obdrequester';
import { BlynkService } from './services';

class Server {
  public static readonly DEFAULT_SOCKET: string = 'vcan0';
  public static readonly DEFAULT_PORT: number = 3000;
  public static readonly DEFAULT_AUTH_TOKEN: string = 'bed1f10d196c4ff1afb89dbc19688de8';
  public static readonly DEFAULT_BLYNK_URL: string = 'https://192.168.0.120:7555/';

  private app: any;
  private server: any;
  private io: any;
  private socket: any;

  private parsers: Parser[];
  private requesters: ObdRequester[] = [];

  constructor(private canSocket: string = 'vcan0', private port: number = 3000, private blynk: BlynkService) {
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

    this.io.on('connection', (socket: any) => {
      console.log('connected');
      this.io.emit('connected', 'connected');
    });

    this.socket.on('message', (id: any, buffer: any) => {
      const data = { id: id, data: buffer };

      for (let parser of this.parsers) {
        if (parser.canParse(data)) {
          parser.parseMessage(data, this.blynk);
        }
      }
    });
  }

  private initializeParsers() {
    this.parsers = [
      new ObdParser(this.io),
      new CanParser(this.io),
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

const commandArgs = [
  { name: 'socket', alias: 's', type: String },
  { name: 'port', alias: 'p', type: Number },
  { name: 'blynk_auth_token', alias: 't', type: String },
  { name: 'blynk_url', alias: 'b', type: String },
];

const args: any = command_line_args(commandArgs);

let socket: string = args.socket || Server.DEFAULT_SOCKET;
let port: number = args.port || Server.DEFAULT_PORT;
let auth_token: string = args.blynk_auth_token || Server.DEFAULT_AUTH_TOKEN;
let blynk_url: string = args.blynk_url || Server.DEFAULT_BLYNK_URL;

new Server(socket, port, new BlynkService(auth_token, blynk_url)).run();
