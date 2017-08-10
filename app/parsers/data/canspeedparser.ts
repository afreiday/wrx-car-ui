import { DataParser } from './dataparser';
import { ParserPair } from '../parserpair';

export class CanSpeedParser extends DataParser {
  constructor(pair: ParserPair, bytePair: number) {
    super(pair, (data: any) => {
      var firstByte = (bytePair - 1) * 2;
      return parseInt('' + ((data[firstByte+1] * 256 + data[firstByte]) * 0.05625));
    });
  }
}
