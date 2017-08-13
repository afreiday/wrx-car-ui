import { Component, HostListener, ElementRef, AfterViewInit, Input } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: '[basic-guage]',
  template: require('./basic-guage.component.html'),
  styles: [ require('./basic-guage.component.scss') ]
})
export class BasicGuageComponent implements AfterViewInit {
  @Input() value: string;
  @Input() unit: string;

  constructor(private state: StateService, private element: ElementRef) { }

  private maintainRatio() {
    let el = this.element.nativeElement;
    el.style.height = el.clientWidth + 'px';
  }

  ngAfterViewInit() {
    this.maintainRatio();
  }

  @HostListener('window:resize', ['$event'])
  resizeListener(event: any) {
    this.maintainRatio();
  }
}
