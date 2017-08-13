import { Component, HostListener } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: '[wrx-app]',
  template: require('./app.component.html'),
  styles: [ require('./app.component.scss') ]
})
export class AppComponent {
  constructor(private state: StateService) { }

  public getRPM() {
    return parseInt(this.state.get('engine_rpm') || 0);
  }

  public getSpeed() {
    return parseInt(this.state.get('can_speed') || 0);
  }

  @HostListener('window:state_update', ['$event'])
  stateListener(event: any) {
    this.state.updateState(event);
  }
}
