import { Component, OnInit, Input } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'sn-page',
  template: `
<div class="ui-g">
  <div class="ui-g-12 ui-g-nopad">
    <div class="card card-w-title">
      <h1>{{title}}<ng-content select="[content=loading]"></ng-content></h1>
      <ng-content select="[content=body]"></ng-content>
    </div>
  </div>
</div>
`
})
export class PageComponent implements OnInit {
  @Input() title: string;
  @Input() loading: boolean;

  constructor(private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle(`WebOps - ${this.title}`);
  }
}
