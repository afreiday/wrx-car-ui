import { Parser } from './parser';
import { DataParser } from './data/dataparser';
import { ParserPair } from './parserpair';

export class CanParser extends Parser {
  private ACCELERATOR = new ParserPair('140', 'ACCELERATOR');
  private BRAKE = new ParserPair('d1', 'BRAKE');
  private STEERING = new ParserPair('2', 'STEERING');

  private capablePids: string[] = [
    this.ACCELERATOR.id,
    this.BRAKE.id,
    this.STEERING.id
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
