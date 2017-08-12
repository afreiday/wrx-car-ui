import { Component, HostListener } from '@angular/core';

@Component({
  selector: '[wrx-overhead]',
  template: require('./wrx-overhead.component.html'),
  styles: [ require('./wrx-overhead.component.scss') ]
})
export class WrxOverheadComponent {
  public state: any;

  constructor() { }

  public headlights_on() {
    return true;
  }

  public brakes_on() {
    return parseInt(this.state.brake) > 0;
  }

  public turn_signal_left() {
    return this.state.turn_signal === 'L';
  }

  public turn_signal_right() {
    return this.state.turn_signal === 'R';
  }

  @HostListener('window:state_update', ['$event'])
  stateListener(event: any) {
    this.state = (window as any).state;
  }
}

