import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { HttpSportService } from '../../shared/services';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';

const emptyLeague = {
  result: {
    id: '',
    iid: 0,
    name: '',
    abbreviation: '',
    order: 0,
    sport: { id: '', iid: 0 }
  }
};

type EditMode = 'create' | 'edit';

@Component({
  selector: 'sn-league',
  templateUrl: './league.component.html'
})
export class LeagueComponent implements OnInit, OnDestroy {
  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public league: any;
  public sportId: string;
  public sportItems: any[];

  public form: FormGroup;

  private sports: any[];
  private sub: Subscription;

  constructor(
    public builder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sportService: HttpSportService,
    private notifications: NotificationService
  ) {
    this.loading = false;
    this.form = this.builder.group({
      id: [''],
      name: ['', Validators.required],
      abbreviation: ['', Validators.required],
      order: [0, Validators.required],
      sportId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create League';
    } else {
      this.title = 'Edit League';
    }

    this.sub = this.route.params.map(params => {
      return {
        leagueId: params['id'],
        sportId: params['sportId']
      };
    }).mergeMap(
      p => {
        if (this.mode === 'create') {
          return Observable.of(emptyLeague);
        } else {
          return this.sportService.getLeague(p.leagueId);
        }
      },
      (params, league) => ({ params: params, league: league })
    ).mergeMap(
      result => this.sportService.getSports(),
      (result, sports) => ({ params: result.params, league: result.league, sports: sports })
    ).subscribe(result => {
      this.league = result.league.result;
      this.sportId = result.params.sportId;
      this.sports = result.sports.result;
      this.sportItems = this.mapToSelectItems(this.sports);
      if (this.mode === 'create') {
        this.league.sport.id = this.sportId;
      } else {
        this.sportId = this.league.sport.id;
      }
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit(league) {
    const toUpdate = Object.assign(
      {},
      this.league,
      { name: league.name },
      { order: +league.order },
      { abbreviation: league.abbreviation }
    );

    toUpdate.id = league.id;
    if (! toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = league.sportId;
    toUpdate.sport.iid = this.sports.filter(s => s.id === league.sportId)[0].iid;

    if (this.mode === 'create') {
      this.sportService.postLeague(toUpdate).subscribe(
        result => {
          this.notifications.showSuccess('League Created');
          this.router.navigate(['../', result.result], { relativeTo: this.route });
        },
        err => this.notifications.showError('Cannot Create League', err.toString())
        );
    } else {
      this.sportService.putLeague(toUpdate).subscribe(
        () => { this.notifications.showSuccess('League Updated'); },
        err => this.notifications.showError('Cannot Update League', err.toString())
      );
    }
  }

  public onDelete(leagueId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete League?',
      accept: () => {
        this.sportService.deleteLeague(leagueId).subscribe(
          () => {
            this.notifications.showSuccess('League Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete League', err.toString())
        );
      }
    });
  }

  public onCancel() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  private mapToSelectItems(items: any[]): any[] {
    return [{ label: 'Select Sport', value: '' }].concat(items.map(item => ({ label: item.name, value: item.id })));
  }
}
