import { DataParser } from './dataparser';
import { ParserPair } from '../parserpair';

export class PercentageParser extends DataParser {
  constructor(pair: ParserPair, blynkPin: string = '') {
    super(pair, (data: any) => {
      return data[3] / 2.55;
    }, blynkPin);
  }
}
