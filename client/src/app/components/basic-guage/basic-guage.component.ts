import { Component, HostListener, ElementRef, AfterViewInit, Input } from '@angular/core';
import { StateService } from '../../services/state.service';
import { DataPoint } from '../../models';
import * as d3 from 'd3';

@Component({
  selector: '[basic-guage]',
  template: require('./basic-guage.component.html'),
  styles: [ require('./basic-guage.component.scss') ]
})
export class BasicGuageComponent implements AfterViewInit {
  @Input() value: number;
  @Input() valueMax: number;
  @Input() unit: string;
  private seenMax: number = 0;
  public readonly id:string = '' + parseInt((Math.random() * 1000).toString());

  private data: DataPoint[] = [];

  constructor(private state: StateService, private element: ElementRef) {
    setInterval(() => {
      if (!this.data.length || this.value != this.data[this.data.length-1].value)
        this.data.push(new DataPoint(new Date, this.value));

      this.drawChart();
    }, 100);
  }

  private maintainRatio() {
    let el = this.element.nativeElement;
    el.style.height = el.clientWidth + 'px';
  }

  ngAfterViewInit() {
    this.maintainRatio();
    this.drawChart();
  }

  @HostListener('window:resize', ['$event'])
  resizeListener(event: any) {
    this.maintainRatio();
    this.drawChart();
  }

  private drawChart() {
    var data = this.data;

    data = this.data.filter(p => p.time.getTime() > (new Date).getTime() - 1000*5);

    d3.selectAll('svg#guage-' + this.id + ' > *').remove();

    var svg = d3.select("svg#guage-" + this.id),
        width = this.element.nativeElement.clientWidth,
        height = this.element.nativeElement.clientWidth * .40,
        g = svg.append("g");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var area = (d3.area() as any)
        .curve(d3.curveBasis)
        .x(d => x(d.time))
        .y1(d => y(d.value));

    var max = this.valueMax;
    if (!max) {
      max = d3.max(data, d => d.value);
      if (max > this.seenMax) {
        this.seenMax = max;
      } else {
        max = this.seenMax;
      }
    }

    x.domain(d3.extent(data, d => d.time));
    y.domain([0, max]);
    area.y0(y(0));

    g.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area as any);
  }
}
