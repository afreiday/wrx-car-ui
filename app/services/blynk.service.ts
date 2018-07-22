const request = require('request');

export class BlynkService {
  private const BLYNK_MAX_SEND_MS = 500;
  private lastLog: any = { };

  public constructor(private token: string, private url: string) { }

  public logValue(blynkPin: string, value: any) {
    if (blynkPin.length) {
      let now = Date.now();

      if (!this.lastLog[blynkPin] || now - this.lastLog[blynkPin] > this.BLYNK_MAX_SEND_MS) {
        console.log(blynkPin + ':' + value);
        let url = this.url + this.token + '/update/' + blynkPin + '?value=' + value;
        request(url, { json: true, rejectUnauthorized: false }, (err: any, res: any, body: any) => {});
        this.lastLog[blynkPin] = now;
      }
    }
  }
}
