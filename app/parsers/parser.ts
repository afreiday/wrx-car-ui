import { BlynkService } from '../services';

export abstract class Parser {

  constructor(protected io: any) { }

  abstract parseMessage(data: any, blynk: BlynkService): void;

  abstract canParse(data: any): boolean;

}
