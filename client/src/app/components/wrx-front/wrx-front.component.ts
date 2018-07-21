import { Component, HostListener } from '@angular/core';
import { StateService} from '../../services/state.service';

@Component({
  selector: '[wrx-front]',
  template: require('./wrx-front.component.html'),
  styles: [ require('./wrx-front.component.scss') ]
})
export class WrxFrontComponent {

  constructor(private state: StateService) { }

}
