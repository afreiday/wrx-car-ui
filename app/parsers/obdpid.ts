import { ParserPair } from './parserpair';

export class ObdPid extends ParserPair {
  constructor(id: string, msgId: string, public requestInterval: number) {
    super(id, msgId);
  }
}
