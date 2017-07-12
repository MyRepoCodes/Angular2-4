import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/primeng';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { HttpSportService } from '../../shared/services';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';

const emptySport = {
  result: {
    id: '',
    iid: 0,
    name: '',
  }
};

type EditMode = 'create' | 'edit';

@Component({
  selector: 'sn-sport',
  templateUrl: './sport.component.html'
})
export class SportComponent implements OnInit, OnDestroy {
  public mode: EditMode;
  public loading: boolean;
  public form: FormGroup;
  public title: string;
  public sport: any;

  private sub: Subscription;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private sportService: HttpSportService,
    private notifications: NotificationService
  ) {
    this.loading = false;
    this.form = this.builder.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Sport';
    } else {
      this.title = 'Edit Sport';
    }

    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({ sportId: params['id'] }))
      .mergeMap(
        params => {
          if (this.mode === 'create') {
            return Observable.of(emptySport);
          } else {
            return this.sportService.getSport(params.sportId);
          }
        }, (params, sport) => ({params: params, sport: sport})
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSuccess = (result: any): void => {
    this.sport = result.sport.result;
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load sport', 3);
  }

  public onSubmit(sport) {
    const toUpdate = Object.assign(
      {},
      this.sport,
      { name: sport.name }
    );

    toUpdate.id = sport.id;

    if (this.mode === 'create') {
      this.sportService.postSport(toUpdate).subscribe(
        result => {
          this.notifications.showSuccess('Sport Created');
          this.router.navigate(['../', result.result], { relativeTo: this.route });
        },
        err => this.notifications.showError('Cannot Create Sport', err.toString())
      );
    } else {
      this.sportService.putSport(toUpdate).subscribe(
        () => {
          this.notifications.showSuccess('Sport Updated');
        },
        err => this.notifications.showError('Cannot Update Sport', err.toString())
      );
    }
  }

  public onDelete(sportId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Sport?',
      accept: () => {
        this.sportService.deleteSport(sportId).subscribe(
          () => {
            this.notifications.showSuccess('Sport Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Sport', err.toString())
        );
      }
    });
  }

  public onCancel() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

}
