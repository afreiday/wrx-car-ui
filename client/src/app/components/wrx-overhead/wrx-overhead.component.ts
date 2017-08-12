import { Component, HostListener } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: '[wrx-overhead]',
  template: require('./wrx-overhead.component.html'),
  styles: [ require('./wrx-overhead.component.scss') ]
})
export class WrxOverheadComponent {

  constructor(private state: StateService) { }

  public headlights_on() {
    return true;
  }

  public brakes_on() {
    return parseInt(this.state.get('brake')) > 0;
  }

  public turn_signal_left() {
    return this.state.get('turn_signal') === 'L';
  }

  public turn_signal_right() {
    return this.state.get('turn_signal') === 'R';
  }

  public tire_rotation() {
    var steering = this.state.get('steering');
    var direction = steering.substring(0, 1);
    var amount = steering.substring(1) / 50;

    return 15 * amount * (direction === 'L' ? -1 : 1);
  }
}

