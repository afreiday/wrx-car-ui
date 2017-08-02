import { Parser } from './parser';
import { DataParser } from './dataparser';
import { ParserPair } from './parserpair';

export class ObdParser extends Parser {
  private ID_PID_REPLY = '7e8';

  private ENGINE_RPM = new ParserPair('c', 'ENGINE_RPM');
  private VEHICLE_SPEED = new ParserPair('d', 'VEHICLE_SPEED');
  private MAF_RATE = new ParserPair('10', 'MAF_RATE');
  private INTAKE_PRESSURE = new ParserPair('b', 'INTAKE_PRESSURE');
  private OXYGEN_SENSOR = new ParserPair('24', 'OXYGEN_SENSOR');
  private BAROMETRIC_PRESSURE = new ParserPair('33', 'BAROMETRIC_PRESSURE');
  private FUEL_LEVEL = new ParserPair('2f', 'FUEL_LEVEL');
  private COOLANT_TEMPERATURE = new ParserPair('5', 'COOLANT_TEMPERATURE');

  private parsers: DataParser[] = [
    new DataParser(this.ENGINE_RPM, (data: any) => {
      return ((data[3] * 256) + data[4])/4;
    }),
    new DataParser(this.VEHICLE_SPEED, (data: any) => {
      return data[3];
    }),
    new DataParser(this.MAF_RATE, (data: any) => {
      return (data[3] * 256 + data[4]) / 100;
    }),
    new DataParser(this.INTAKE_PRESSURE, (data: any) => {
      return data[3];
    }),
    new DataParser(this.OXYGEN_SENSOR, (data: any) => {
      return (2/65536) / (256 * data[3] + data[4]);
    }),
    new DataParser(this.BAROMETRIC_PRESSURE, (data: any) => {
      return data[3];
    }),
    new DataParser(this.FUEL_LEVEL, (data: any) => {
      return data[3] / 2.55;
    }),
    new DataParser(this.COOLANT_TEMPERATURE, (data: any) => {
      return data[3] - 40;
    }),
  ];

  constructor(io: any) {
    super(io);
  }

  parseMessage(msg: any) {
    let found = false;
    for(let parser of this.parsers) {
      if (parser.canParse(msg.data[2].toString(16))) {
        parser.parse(this.io, msg.data);
        found = true;
      }
    }

    if (!found) {
      console.log('Got unparsed: ' + msg.data[2].toString(16));
    }
  }

  canParse(data: any): boolean {
    return data.id.toString(16) === this.ID_PID_REPLY;
  }
}
