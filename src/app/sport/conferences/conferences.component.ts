import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HttpSportService } from '../../shared/services';
import { FilterUtils } from '../../shared/utils/filter-utils';
import { NotificationService } from '../../shared/services/notification.service';
@Component({
  selector: 'sn-conferences',
  templateUrl: 'conferences.component.html'
})
export class ConferencesComponent implements OnInit, OnDestroy {
  public page: { number: number, size: number };
  public conferences: any[];
  public total: number;
  public loading: boolean;
  public title: string;
  private sub: Subscription;
  public sportId: string;
  public leagueId: string;
  public form: FormGroup;

  constructor(
    public builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private sportService: HttpSportService,
    private notifications: NotificationService
  ) {
    this.page = { number: 1, size: 25 };

    this.form = this.builder.group({
      sportId: ['', Validators.required],
      leagueId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.title = 'Conference List';
    this.sub = this.route.params.map(params => {
      return {
        sportId: params['sportId'],
        leagueId: params['leagueId'],
        page: +params['page'] || 1,
        size: +params['size'] || 25
      };
    }).mergeMap(
      p => this.sportService.getConferences(p.leagueId, { number: p.page, size: p.size }),
      (params, conferences) => ({ params: params, conferences: conferences })
    )
      .subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onDelete(id) {

  }

  onAdd() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  onEdit(id) {
    this.router.navigate(['/sport/conferences', id], { relativeTo: this.route });
  }

  search() {
    const searchParams = FilterUtils.createSearchParams({
      sportId: this.sportId, leagueId: this.leagueId,
      page: this.page.number, size: this.page.size
    });
    this.router.navigate(['../list', searchParams], { relativeTo: this.route });
  }

  goToPage(p: any) {
    this.page = { number: p.page, size: p.size };
    this.search();
  }

  sportChanged(sportId) {
    this.sportId = sportId;
    this.form.patchValue({ sportId: sportId });
  }

  leagueChanged(leagueId) {
    this.leagueId = leagueId;
    this.form.patchValue({ leagueId: leagueId });
  }

  onSuccess = (result: any): void => {
    this.page = { number: result.params.page, size: result.params.size };
    this.conferences = result.conferences.result;
    this.total = result.conferences.totalRecords;
    this.loading = false;
  }
  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load conferences', 3);
  }

  clearFilter() {
    this.leagueId = '';
    this.sportId = '';
    this.search();
  }
}
