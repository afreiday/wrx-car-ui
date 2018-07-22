import { ParserPair } from '../parserpair';

export class DataParser {
  constructor(private pair: ParserPair, private calculation: (data: any) => any, public blynkPin: string = '') {
  }

  parse(io: any, data: any): any {
    var parsed = this.calculation(data);
    io.emit(this.pair.msgId, parsed);
    return parsed;
  }

  canParse(pid: string): boolean {
    return pid === this.pair.id;
  }
}
