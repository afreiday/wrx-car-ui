import { ParserPair } from './parserpair';

export class DataParser {
  constructor(private pair: ParserPair, private calculation: (data: any) => any) {
  }

  parse(io: any, data: any): any {
    //console.log(this.msgId, this.calculation(data));
    io.emit(this.pair.msgId, this.calculation(data));
    //console.log(this.msgId);
  }

  canParse(pid: string): boolean {
    return pid === this.pair.id;
  }
}
