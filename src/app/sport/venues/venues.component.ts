import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HttpSportService } from '../../shared/services';
import { FilterUtils } from '../../shared/utils/filter-utils';
import { NotificationService } from '../../shared/services/notification.service';
@Component({
  selector: 'sn-venues',
  templateUrl: 'venues.component.html'
})
export class VenuesComponent implements OnInit, OnDestroy {
  public sportId: string;
  public leagueId: string;
  public page: { number: number, size: number };
  public venues: any[];
  public total: number;
  public loading: boolean;
  public title: string;
  private sub: Subscription;
  public form: FormGroup;
  constructor(
    public builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sportService: HttpSportService,
    private notifications: NotificationService
  ) {
    this.loading = false;
    this.page = { number: 1, size: 25 };
    this.form = this.builder.group({
      sportId: ['', Validators.required],

    });
  }

  ngOnInit() {
    this.loading = true;
    this.title = 'Venues List';
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => {
        return {
          sportId: params['sportId'],
          page: +params['page'] || 1,
          size: +params['size'] || 25
        };
      })
      .mergeMap(
      params =>
        this.sportService.getVenues(params.sportId, { number: params.page, size: params.size }),
      (params, venues) => ({ params: params, venues: venues }))
      .subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  search() {
    const searchParams = FilterUtils.createSearchParams({
      sportId: this.sportId,
      page: this.page.number, size: this.page.size
    });
    this.router.navigate(['../list', searchParams], { relativeTo: this.route });
  }
  addNewDivision() {
    this.router.navigate(['/sport/venues/create']);
  }

  goToPage(p: any) {
    this.page = { number: p.page, size: p.size };
    this.search();
  }
  sportChanged(sportId) {
    this.sportId = sportId;
    this.form.patchValue({ sportId: sportId });
  }

  onAdd() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  onEdit(id) {
    this.router.navigate(['/sport/venues', id], { relativeTo: this.route });
  }

  onDelete(id) {

  }
  onSuccess = (result: any): void => {
    this.venues = result.venues.result;
    this.page = { number: result.params.page, size: result.params.size };
    this.total = result.venues.totalRecords;
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load venues', 3);
  }
  clearFilter() {
    this.sportId = '';
    this.search();
  }
}
