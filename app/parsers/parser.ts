export abstract class Parser {

  constructor(protected io: any) {
  }

  abstract parseMessage(data: any): void;

  abstract canParse(data: any): boolean;

}
