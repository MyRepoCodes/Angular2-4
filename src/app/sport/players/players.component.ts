import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HttpSportService } from '../../shared/services';
import { FilterUtils } from '../../shared/utils/filter-utils';
import { NotificationService } from '../../shared/services/notification.service';
import {FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sn-players',
  templateUrl: 'players.component.html'
})
export class PlayersComponent implements OnInit, OnDestroy {
  public sportId: string;
  public name: string;
  public page: { number: number, size: number };
  public players: any[];
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
      sportId: [''],
      name: ['']
    });
  }

  ngOnInit() {
    this.loading = true;
    this.title = 'Players List';
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => {
        return {
          sportId: params['sportId'],
          name: params['name'],
          page: +params['page'] || 1,
          size: +params['size'] || 25
        };
      })
      .mergeMap(
      params =>
        this.sportService.getPlayers(params.sportId, params.name, { number: params.page, size: params.size }),
      (params, players) => ({ params: params, players: players }))
      .subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  search() {
    const searchParams = FilterUtils.createSearchParams({
      sportId: this.sportId, name: this.name, page: this.page.number, size: this.page.size
    });
    this.router.navigate(['../list', searchParams], { relativeTo: this.route });
  }

  goToPage(p: any) {
    this.page = { number: p.page, size: p.size };
    this.search();
  }

  firstNameChanged(name) {
    this.name = name;
    // this.form.patchValue({ sportId: '570aaedc46c5d11de0f8c0bd' });
    this.form.patchValue({ name: name});
  }
  sportChanged(sportId) {
    this.sportId = sportId;
    this.form.patchValue({ sportId: sportId });
    // this.form.patchValue({ name: "test" });
  }

  onAdd() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  onEdit(id) {
    this.router.navigate(['/sport/players', id], { relativeTo: this.route });
  }

  onSuccess = (result: any): void => {
    this.players = result.players.result;
    this.page = { number: result.params.page, size: result.params.size };
    this.total = result.players.totalRecords;
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load players', 3);
  }

  clearFilter() {
    this.sportId = '';
    this.name = '';
    this.search();
  }
}
