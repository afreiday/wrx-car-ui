import { Component, HostListener } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: '[wrx-app]',
  template: require('./app.component.html'),
  styles: [ require('./app.component.scss') ]
})
export class AppComponent {
  constructor(private state: StateService) { }

  @HostListener('window:state_update', ['$event'])
  stateListener(event: any) {
    this.state.updateState(event);
  }
}
