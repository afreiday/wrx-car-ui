import { ObdPid } from './parsers';

export class ObdRequester {
  private static ID_PID_REQUEST = 0x7DF;
  private timer: any;
  private _active: boolean = false;
  private _requests: number = 0;

  get active(): boolean {
    return this._active;
  }

  get requests(): number {
    return this._requests;
  }

  constructor(private pid: ObdPid, private socket: any) {
    this.timer = setInterval(this.request, this.pid.requestInterval * 1000, this.socket, this.pid);
    this._active = true;
    this.request();
  }

  public cancel() {
    clearInterval(this.timer);
    this._active = false;
  }

  private request(socket: any, pid: ObdPid) {
    socket.send(ObdRequester.ID_PID_REQUEST, [
      0x02,
      0x01,
      parseInt(pid.id, 16),
      0x00,
      0x00,
      0x00,
      0x00,
      0x00
    ]);
    this._requests++;
  }
}
