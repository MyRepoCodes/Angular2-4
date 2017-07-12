import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services/sport.service';

@Component({
  selector: 'sn-select-position',
  template: `
<p-dropdown
  [style]="{'width': '75%'}"
  [options]="positions" 
  [(ngModel)]="position.id"
  (onChange)="positionSelected($event.value)"
  [disabled]="loading"
></p-dropdown>
`
})
export class SelectPositionComponent implements OnInit, OnDestroy {
  private _position;
  @Input()
  get position() {
    if (this._position) {
      return { id: this._position };
    }
    return { id: '' };
  }
  set position(value) {
    if (value) {
      this._position = value.id;
    } else {
      this._position = '';
    }
  }
  @Output() positionChanged = new EventEmitter(false);

  positions;
  data;
  loading = true;

  private sub;
  private emptyPositions = [{ label: 'Select Position', value: '' }];

  constructor(private sportService: HttpSportService) {
    this.positions = this.emptyPositions;
  }

  ngOnInit() {
    this.sub = this.sportService.getPositions().subscribe(positions => {
      this.data = positions;
      const positionList = this.data.map(p => ({ label: this.positionName(p), value: p.id }));
      this.positions = this.emptyPositions.concat(positionList);

      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  positionSelected(positionId) {
    const position = this.data.filter(p => p.id === positionId)[0];
    if (position) {
      const positionRef = {
        name: position.name || '',
        abbr: position.abbreviation,
        id: position.id || '',
        iid: position.iid
      };
      this.positionChanged.emit(positionRef);
    } else {
      this.positionChanged.emit(undefined);
    }
  }

  private positionName(position) {
    return `${position.name} (${position.abbreviation})`;
  }
}
