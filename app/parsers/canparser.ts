import { Parser } from './parser';
import { DataParser, CanSpeedParser } from './data';
import { ParserPair } from './parserpair';

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

  private capablePids: string[] = [
    this.ACCELERATOR.id,
    this.BRAKE.id,
    this.STEERING.id,
    this.WHEEL_SPEED_LF.id,
    this.TURN_SIGNAL.id,
  ];

  private parsers: DataParser[] = [
    new DataParser(this.ACCELERATOR, (data: any) => {
      return data[0] / 256 * 100;
    }),
    new DataParser(this.BRAKE, (data: any) => {
      return data[2] / 256 * 100;
    }),
    new DataParser(this.STEERING, (data: any) => {
      var b1 = data[0];
      var b2 = data[1];
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

      return direction + '' + position;
    }),
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
  ];

  constructor(io: any) {
    super(io);
  }

  parseMessage(msg: any) {
    for(let parser of this.parsers) {
      if (parser.canParse(msg.id.toString(16))) {
        parser.parse(this.io, msg.data);
      }
    }
  }

  canParse(data: any): boolean {
    return this.capablePids.indexOf(data.id.toString(16)) > -1;
  }
}
