export class DataParser {
  constructor(private pid: string, 
    private msgId: string, 
    private calculation: (data: any) => any) {
  }

  parse(io: any, data: any): any {
    //console.log(this.msgId, this.calculation(data));
    io.emit(this.msgId, this.calculation(data));
    //console.log(this.msgId);
  }

  canParse(pid: string): boolean {
    return pid === this.pid;
  }
}
