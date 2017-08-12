import { Injectable, HostListener } from '@angular/core';

@Injectable()
export class StateService {
  private state: any;

  constructor() { }

  public updateState(event: any) {
    this.state = (window as any).state;
  }

  public get(key: string) {
    return this.state ? this.state[key] || '' : '';
  }
}
