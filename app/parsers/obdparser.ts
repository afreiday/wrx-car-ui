import { Parser } from './parser';
import { DataParser, TemperatureParser, PassthroughParser, PercentageParser } from './data';
import { ObdPid } from './obdpid';
import { BlynkService } from '../services';

export class ObdParser extends Parser {
  private ID_PID_REPLY = '7e8';

  public static ENGINE_RPM = new ObdPid('c', 'ENGINE_RPM', 0.25);
  public static VEHICLE_SPEED = new ObdPid('d', 'VEHICLE_SPEED', 1);
  public static MAF_RATE = new ObdPid('10', 'MAF_RATE', 0.5);
  public static INTAKE_PRESSURE = new ObdPid('b', 'INTAKE_PRESSURE', 5);
  public static OXYGEN_SENSOR = new ObdPid('24', 'OXYGEN_SENSOR', 5);
  public static BAROMETRIC_PRESSURE = new ObdPid('33', 'BAROMETRIC_PRESSURE', 5);
  public static FUEL_LEVEL = new ObdPid('2f', 'FUEL_LEVEL', 2.5);
  public static COOLANT_TEMPERATURE = new ObdPid('5', 'COOLANT_TEMPERATURE', 5);
  public static ENGINE_LOAD = new ObdPid('4', 'ENGINE_LOAD', 0.5);
  public static TIMING_ADVANCE = new ObdPid('e', 'TIMING_ADVANCE', 0.5);
  public static CATALYST_TEMPERATURE = new ObdPid('3c', 'CATALYST_TEMPERATURE', 5);
  public static OIL_TEMPERATURE = new ObdPid('5c', 'OIL_TEMPERATURE', 5);
  public static AMBIENT_AIR_TEMPERATURE = new ObdPid('46', 'AMBIENT_AIR_TEMPERATURE', 10);
  public static ENGINE_RUNTIME = new ObdPid('1f', 'ENGINE_RUNTIME', 10);
  public static ACCELERATOR_PEDAL_POSITON = new ObdPid('49', 'ACCELERATOR_PEDAL_POSITON', 1);
  public static EVAP_SYSTEM_PRESSURE = new ObdPid('32', 'EVAP_SYSTEM_PRESSURE', 5);
  public static INTAKE_AIR_TEMPERATURE = new ObdPid('0f', 'AMBIENT_AIR_TEMPERATURE', 10);
  public static FUEL_PRESSURE = new ObdPid('a', 'FUEL_PRESSURE', 1);
  public static THROTTLE_POSITION = new ObdPid('11', 'THROTTLE_POSITION', 1);
  public static ABSOLUTE_LOAD = new ObdPid('43', 'ABSOLUTE_LOAD', 1);
  public static FUEL_RATE = new ObdPid('5d', 'FUEL_RATE', 1);

  public static pids: ObdPid[] = [
    ObdParser.ENGINE_RPM,
    ObdParser.VEHICLE_SPEED,
    ObdParser.MAF_RATE,
    ObdParser.INTAKE_PRESSURE,
    ObdParser.OXYGEN_SENSOR,
    ObdParser.BAROMETRIC_PRESSURE,
    ObdParser.FUEL_LEVEL,
    ObdParser.COOLANT_TEMPERATURE,
    ObdParser.ENGINE_LOAD,
    ObdParser.TIMING_ADVANCE,
    ObdParser.CATALYST_TEMPERATURE,
    ObdParser.OIL_TEMPERATURE,
    ObdParser.AMBIENT_AIR_TEMPERATURE,
    ObdParser.ENGINE_RUNTIME,
    ObdParser.ACCELERATOR_PEDAL_POSITON,
    ObdParser.EVAP_SYSTEM_PRESSURE,
    ObdParser.INTAKE_AIR_TEMPERATURE,
    ObdParser.FUEL_PRESSURE,
    ObdParser.THROTTLE_POSITION,
    ObdParser.ABSOLUTE_LOAD,
    ObdParser.FUEL_RATE,
  ];

  private parsers: DataParser[] = [
    new PassthroughParser(ObdParser.VEHICLE_SPEED, 'V1'),
    new PassthroughParser(ObdParser.INTAKE_PRESSURE),
    new PassthroughParser(ObdParser.BAROMETRIC_PRESSURE),
    new PercentageParser(ObdParser.FUEL_LEVEL, 'V4'),
    new PercentageParser(ObdParser.ENGINE_LOAD, 'V3'),
    new PercentageParser(ObdParser.ACCELERATOR_PEDAL_POSITON),
    new TemperatureParser(ObdParser.COOLANT_TEMPERATURE),
    new TemperatureParser(ObdParser.OIL_TEMPERATURE, 'V5'),
    new TemperatureParser(ObdParser.AMBIENT_AIR_TEMPERATURE, 'V6'),
    new PassthroughParser(ObdParser.FUEL_PRESSURE),
    new PercentageParser(ObdParser.THROTTLE_POSITION),
    new TemperatureParser(ObdParser.INTAKE_AIR_TEMPERATURE, 'V7'),
    /**
     * Mainly based on https://en.wikipedia.org/wiki/OBD-II_PIDs#Mode_01
		 * A = data[3], B = data[4], etc
     */
    new DataParser(ObdParser.CATALYST_TEMPERATURE, (data: any) => {
      return ((256 * data[3] + data[4]) / 10) - 40;
    }),
    new DataParser(ObdParser.OXYGEN_SENSOR, (data: any) => {
      return (2/65536) / (256 * data[3] + data[4]);
    }),
    new DataParser(ObdParser.MAF_RATE, (data: any) => {
      return (data[3] * 256 + data[4]) / 100;
    }),
    new DataParser(ObdParser.ENGINE_RPM, (data: any) => {
      return parseInt('' + (((data[3] * 256) + data[4]) / 4));
    }, 'V0'),
    new DataParser(ObdParser.ENGINE_RUNTIME, (data: any) => {
      return 256 * data[3] + data[4];
    }),
    new DataParser(ObdParser.TIMING_ADVANCE, (data: any) => {
      return (data[3] / 2) - 64;
    }),
    new DataParser(ObdParser.EVAP_SYSTEM_PRESSURE, (data: any) => {
      return (256 * data[3] + data[4]) / 4;
    }),
    new DataParser(ObdParser.ABSOLUTE_LOAD, (data: any) => {
      return (100 / 255) * (256 * data[3] + data[4]);
    }),
    new DataParser(ObdParser.FUEL_RATE, (data: any) => {
      return (256 * data[3] + data[4]) / 20;
    }),
  ];

  constructor(io: any) {
    super(io);
  }

  parseMessage(msg: any, blynk: BlynkService) {
    let found = false;
    for(let parser of this.parsers) {
      if (parser.canParse(msg.data[2].toString(16))) {
        let value = parser.parse(this.io, msg.data);
        blynk.logValue(parser.blynkPin, value);
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
