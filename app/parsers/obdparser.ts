import { Parser } from './parser';
import { DataParser, TemperatureParser, PassthroughParser, PercentageParser } from './data';
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
  private ENGINE_LOAD = new ParserPair('4', 'ENGINE_LOAD');
  private TIMING_ADVANCE = new ParserPair('e', 'TIMING_ADVANCE');
  private CATALYST_TEMPERATURE = new ParserPair('3c', 'CATALYST_TEMPERATURE');
  private OIL_TEMPERATURE = new ParserPair('5c', 'OIL_TEMPERATURE');
  private AMBIENT_AIR_TEMPERATURE = new ParserPair('46', 'AMBIENT_AIR_TEMPERATURE');
  private ENGINE_RUNTIME = new ParserPair('1f', 'ENGINE_RUNTIME');
  private ACCELERATOR_PEDAL_POSITON = new ParserPair('49', 'ACCELERATOR_PEDAL_POSITON');

  private parsers: DataParser[] = [
    new PassthroughParser(this.VEHICLE_SPEED),
    new PassthroughParser(this.INTAKE_PRESSURE),
    new PassthroughParser(this.BAROMETRIC_PRESSURE),
    new PercentageParser(this.FUEL_LEVEL),
    new PercentageParser(this.ENGINE_LOAD),
    new PercentageParser(this.ACCELERATOR_PEDAL_POSITON),
    new TemperatureParser(this.COOLANT_TEMPERATURE),
    new TemperatureParser(this.OIL_TEMPERATURE),
    new TemperatureParser(this.AMBIENT_AIR_TEMPERATURE),
    new DataParser(this.TIMING_ADVANCE, (data: any) => {
      return (data[3] / 1.28) - 100;
    }),
    new DataParser(this.CATALYST_TEMPERATURE, (data: any) => {
      return ((256 * data[3] + data[4]) / 10) - 40;
    }),
    new DataParser(this.OXYGEN_SENSOR, (data: any) => {
      return (2/65536) / (256 * data[3] + data[4]);
    }),
    new DataParser(this.MAF_RATE, (data: any) => {
      return (data[3] * 256 + data[4]) / 100;
    }),
    new DataParser(this.ENGINE_RPM, (data: any) => {
      return ((data[3] * 256) + data[4]) / 4;
    }),
    new DataParser(this.ENGINE_RUNTIME, (data: any) => {
      return 256 * data[3] + data[4];
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
