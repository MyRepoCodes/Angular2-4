import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HttpSportService } from '../../shared/services';
import { FilterUtils } from '../../shared/utils/filter-utils';
import { NotificationService } from '../../shared/services/notification.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'sn-teams',
  templateUrl: 'teams.component.html'
})
export class TeamsComponent implements OnInit, OnDestroy {
  public sportId: string;
  public leagueId: string;
  public conferenceId: string;
  public divisionId: string;
  public page: { number: number, size: number };
  public teams: any[];
  public total: number;
  public loading: boolean;
  public title: string;
  private sub: Subscription;
  private form: FormGroup;

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
      leagueId: ['', Validators.required],
      divisionId: ['', Validators.required],
      conferenceId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loading = true;
    this.title = 'Teams List';
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => {
        return {
          conferenceId: params['conferenceId'],
          divisionId: params['divisionId'],
          page: +params['page'] || 1,
          size: +params['size'] || 25
        };
      })
      .mergeMap(
        params =>
          this.sportService.getTeams({
            number: params.page,
            size: params.size
          }, params.divisionId, params.conferenceId),
        (params, teams) => ({ params: params, teams: teams }))
      .subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  search() {
    const searchParams = FilterUtils.createSearchParams({
      conferenceId: this.conferenceId, divisionId: this.divisionId,
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
    if (!leagueId) {
      this.form = this.builder.group({
        divisionId: ['', Validators.required],
        conferenceId: ['', Validators.required],
      });
    }
    ;

  }

  conferenceChanged(conferenceId) {
    this.conferenceId = conferenceId;
    this.form.patchValue({ conferenceId: conferenceId });
    if (conferenceId) {
      this.form = this.builder.group({
        divisionId: [''],
      });
    }
    ;
  }

  divisionChanged(divisionId) {
    this.divisionId = divisionId;
    this.form.patchValue({ divisionId: divisionId });
    if (divisionId) {
      this.form = this.builder.group({
        conferenceId: [''],
      });
    }
    ;
  }

  onAdd() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  onEdit(id) {
    this.router.navigate(['/sport/teams', id], { relativeTo: this.route });
  }

  onDelete(id) {

  }

  onSuccess = (result: any): void => {
    this.teams = result.teams.result;
    this.page = { number: result.params.page, size: result.params.size };
    this.total = result.teams.totalRecords;
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load divisions', 3);
  }

  clearFilter() {
    this.leagueId = '';
    this.sportId = '';
    this.divisionId = '';
    this.conferenceId = '';
    this.search();
  }
}
