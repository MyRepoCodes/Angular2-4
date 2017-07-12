import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { HttpSportService } from '../../shared/services';
import { FilterUtils } from '../../shared/utils/filter-utils';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'sn-teams',
  templateUrl: 'competitions.component.html'
})
export class CompetitionsComponent implements OnInit, OnDestroy {
  public sportId: string;
  public leagueId: string;
  public conferenceId: string;
  public divisionId: string;
  public page: { number: number, size: number };
  public competitions: any[];
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
      leagueId: ['', Validators.required]
    });
  }


  ngOnInit() {
    this.loading = true;
    this.title = 'Competition List';
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => {
        return {
          leagueId: params['leagueId'],
          divisionId: params['divisionId'],
          page: +params['page'] || 1,
          size: +params['size'] || 25
        };
      })
      .mergeMap(
      params =>
        this.sportService.getCompetitions(params.leagueId, { number: params.page, size: params.size }),
      (params, competitions) => ({ params: params, competitions: competitions }))
      .subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  search() {
    const searchParams = FilterUtils.createSearchParams({
      leagueId: this.leagueId,
      page: this.page.number, size: this.page.size
    });
    this.router.navigate(['../list', searchParams], { relativeTo: this.route });
  }
  addNewDivision() {
    this.router.navigate(['/sport/divisions/create']);
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
  conferenceChanged(conferenceId) {
    this.conferenceId = conferenceId;
  }
  divisionChanged(divisionId) {
    this.divisionId = divisionId;
  }
  onAdd() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }
  clearFilter() {
    this.leagueId = '';
    this.sportId = '';
    this.search();
  }

  onEdit(id) {
    this.router.navigate(['/sport/competitions', id], { relativeTo: this.route });
  }

  onDelete(id) {

  }
  onSuccess = (result: any): void => {
    this.competitions = result.competitions.result;
    this.page = { number: result.params.page, size: result.params.size };
    this.total = result.competitions.totalRecords;
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load divisions', 3);
  }

}
