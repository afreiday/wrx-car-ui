import { DataParser } from './dataparser';
import { ParserPair } from '../parserpair';

export class TemperatureParser extends DataParser {
  constructor(pair: ParserPair, blynkPin: string = '') {
    super(pair, (data: any) => {
      return data[3] - 40;
    }, blynkPin);
  }
}
