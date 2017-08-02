import { Parser } from './parser';
import { DataParser } from './dataparser';

export class ObdParser extends Parser {
  private ID_PID_REPLY = '7e8';

  private ENGINE_RPM = 'c';
  private VEHICLE_SPEED = 'd';
  private MAF_RATE = '10';
  private INTAKE_PRESSURE = 'b';
  private OXYGEN_SENSOR = '24';
  private BAROMETRIC_PRESSURE = '33';

  private parsers: DataParser[] = [
    new DataParser(this.ENGINE_RPM, 'ENGINE_RPM', (data: any) => {
      return ((data[3] * 256) + data[4])/4;
    }),
    new DataParser(this.VEHICLE_SPEED, 'VEHICLE_SPEED', (data: any) => {
      return data[3];
    }),
    new DataParser(this.MAF_RATE, 'MAF_RATE', (data: any) => {
      return (data[3] * 256 + data[4]) / 100;
    }),
    new DataParser(this.INTAKE_PRESSURE, 'INTAKE_PRESSURE', (data: any) => {
      return data[3];
    }),
    new DataParser(this.OXYGEN_SENSOR, 'OXYGEN_SENSOR', (data: any) => {
      return (2/65536) / (256 * data[3] + data[4]);
    }),
    new DataParser(this.BAROMETRIC_PRESSURE, 'BAROMETRIC_PRESSURE', (data: any) => {
      return data[3];
    })
  ];

  constructor(io: any) {
    super(io);
  }

  parseMessage(msg: any) {
    for(let parser of this.parsers) {
      if (parser.canParse(msg.data[2].toString(16))) {
        parser.parse(this.io, msg.data);
      }
    }
  }

  canParse(data: any): boolean {
    return data.id.toString(16) === this.ID_PID_REPLY;
  }
}
