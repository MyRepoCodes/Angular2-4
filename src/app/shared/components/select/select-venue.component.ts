import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpSportService } from '../../services';
import { orderBy } from '../../utils/ArrayUtils';

@Component({
  selector: 'sn-select-venue',
  template: `
<p-dropdown
  [options]="venues"
  [(ngModel)]="venue"
  (onChange)="onVenueChanged($event.value)"
  [style]="{'width':'100%'}"
  [autoWidth]="true"
  [disabled]="loading"
></p-dropdown>
`
})
export class SelectVenueComponent implements OnInit, OnDestroy {
  @Input()
  set sport(sportId: string) {
    this._sport = sportId;
    this.loadBySport(sportId);
  }
  get sport(): string {
    return this._sport;
  }
  @Input() venue;
  @Output() venueChanged = new EventEmitter(false);

  venues;
  loading = true;

  private _sport;
  private emptyVenues = [{ label: 'Select Venue', value: '' }];
  private sub;
  private venueCache: any[] = [];

  constructor(private sportService: HttpSportService) {
    this.venues = this.emptyVenues;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  loadBySport(sportId) {
    this.loading = true;

    if (sportId) {
      this.sub = this.sportService.getVenues(sportId).subscribe(result => {
        const venueList = result.result.map(s => ({ label: s.name, value: s.id }));
        this.venues = this.emptyVenues.concat(orderBy(venueList, 'label'));

        if (!this.isVenueInCollection(result.result)) {
          this.venue = '';
          this.onVenueChanged('');
        }

        this.venueCache = result.result;

        this.loading = false;
      });
    } else {
      this.venue = '';
      this.onVenueChanged('');
      this.venues = this.emptyVenues;
      this.loading = true;
    }
  }

  private isVenueInCollection(venues) {
    return venues.map(x => x.id).indexOf(this.venue) !== -1;
  }

  onVenueChanged(venueId) {
    this.venueChanged.emit(venueId);
  }

  venueEntity() {
    return this.venueCache.filter(l => l.id === this.venue)[0];
  }
}
