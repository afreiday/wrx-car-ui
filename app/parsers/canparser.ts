import { Parser } from './parser';
import { DataParser, CanSpeedParser } from './data';
import { ParserPair } from './parserpair';
import { BlynkService } from '../services';

export class CanParser extends Parser {
  private ACCELERATOR = new ParserPair('140', 'ACCELERATOR');
  private BRAKE = new ParserPair('d1', 'BRAKE');
  private STEERING = new ParserPair('2', 'STEERING');
  private CAN_SPEED = new ParserPair('d1', 'CAN_SPEED');
  private WHEEL_SPEED_LF = new ParserPair('d4', 'WHEEL_SPEED_LF');
  private WHEEL_SPEED_RF = new ParserPair('d4', 'WHEEL_SPEED_RF');
  private WHEEL_SPEED_LR = new ParserPair('d4', 'WHEEL_SPEED_LR');
  private WHEEL_SPEED_RR = new ParserPair('d4', 'WHEEL_SPEED_RR');
  private TURN_SIGNAL = new ParserPair('282', 'TURN_SIGNAL');
  private LIGHTS = new ParserPair('152', 'LIGHTS');

  private capablePids: string[] = [
    this.ACCELERATOR.id,
    this.BRAKE.id,
    this.STEERING.id,
    this.WHEEL_SPEED_LF.id,
    this.TURN_SIGNAL.id,
    this.LIGHTS.id,
  ];

  private lastLog: any = { };

  private parsers: DataParser[] = [
    new DataParser(this.ACCELERATOR, (data: any) => {
      return data[0] / 256 * 100;
    }, 'V2'),
    new DataParser(this.BRAKE, (data: any) => {
      return data[2] / 256 * 100;
    }),
    new DataParser(this.STEERING, (data: any) => {
      var b1 = data[0];
      var b2 = data[1];
      var max = 32 * 256;
      var position = 0;

      if (b1 >= 230) { // 0xe6
        // turning right
        position = ((256 - b1) * 256 + b2) / max;
      } else {
        // turning left
        position = (b1 * 256 + b2) / max * -1;
      }

      position *= 100;

      return position;
    }, 'V8'),
    new CanSpeedParser(this.CAN_SPEED, 1),
    new CanSpeedParser(this.WHEEL_SPEED_LF, 1),
    new CanSpeedParser(this.WHEEL_SPEED_RF, 2),
    new CanSpeedParser(this.WHEEL_SPEED_LR, 3),
    new CanSpeedParser(this.WHEEL_SPEED_RR, 4),
    new DataParser(this.TURN_SIGNAL, (data: any) => {
      const left_bit = 5;
      const right_bit = 6;
      const bits = data[5].toString('2');

      if (bits[(bits.length - 1) - (left_bit - 1)] == '1') { // 0x10 == 10000
        return 'L';
      } else if (bits[(bits.length - 1) - (right_bit - 1)] == '1') { // 0x20 == 100000
        return 'R';
      } else {
        return '-';
      }

    }),
    new DataParser(this.LIGHTS, (data: any) => {
      const bits = data[7].toString('2');
      const bit1 = bits[4] == 1;
      const bit2 = bits[5] == 1;
      if (bit1) {
        return 'P';
      } else if (bit2) {
        return 'N';
      } else {
        return 'D';
      }
    }),
  ];

  constructor(io: any) {
    super(io);
  }

  parseMessage(msg: any, blynk: BlynkService) {
    for(let parser of this.parsers) {
      if (parser.canParse(msg.id.toString(16))) {
        let value = parser.parse(this.io, msg.data);
        blynk.logValue(parser.blynkPin, value);
      }
    }
  }

  canParse(data: any): boolean {
    return this.capablePids.indexOf(data.id.toString(16)) > -1;
  }
}
