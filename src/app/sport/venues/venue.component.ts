import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationService } from 'primeng/components/common/api';
import { HttpSportService, NotificationService } from '../../shared/services';
import { SelectSportComponent } from '../../shared/components/select/select-sport.component';

const emptyVenue = {
  result: {
    id: '',
    name: '',
    location: '',
    sport: { id: '', iid: 0 },

  }
};

type EditMode = 'create' | 'edit';

@Component({
  selector: 'sn-venue',
  templateUrl: 'venue.component.html'
})
export class VenueComponent implements OnInit, OnDestroy {
  @ViewChild('selectSport') selectSport: SelectSportComponent;
  public loading: boolean;
  public mode: EditMode;
  public title: string;
  public venue: any;
  public sportId: string;
  public leagueId: string;

  public form: FormGroup;

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
      location: ['', Validators.required],
      sportId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loading = true;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode === 'create') {
      this.title = 'Create Venue';
    } else {
      this.title = 'Edit Venue';
    }
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => ({
        venueId: params['id'],
        sportId: params['sportId'],
        leagueId: params['leagueId'],
      }))
      .mergeMap(
      params => {
        if (this.mode === 'create') {
          return Observable.of(emptyVenue);
        } else {
          return this.sportService.getVenue(params.venueId);
        }
      }, (params, venue) => ({ params: params, venue: venue })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit(venue) {
    const toUpdate = Object.assign(
      {},
      this.venue,
      { name: venue.name },
      { location: venue.location }
    );
    toUpdate.id = venue.id;

    if (!toUpdate.sport) {
      toUpdate.sport = { id: '', iid: 0 };
    }
    toUpdate.sport.id = venue.sportId;
    const sport = this.selectSport.sportEntity();
    toUpdate.sport.iid = sport.iid;

    if (this.mode === 'create') {
      this.sportService.postVenue(toUpdate).subscribe(
        result => {
          if (result.errors.length >= 1) {
            this.notifications.showError('Cannot Create Venue');
          } else {
            this.notifications.showSuccess('Venue Created');
            this.router.navigate(['../', result.result], { relativeTo: this.route });
          }
        },
        err => this.notifications.showError('Cannot Create Venue', err.toString())
      );
    } else {
      this.sportService.postVenue(toUpdate).subscribe(
        () => { this.notifications.showSuccess('Venue Updated'); },
        err => this.notifications.showError('Cannot Update Venue', err.toString())
      );
    }
  }

  onDelete(VenueId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Venue ?',
      accept: () => {
        this.sportService.deleteVenue(VenueId).subscribe(
          () => {
            this.notifications.showSuccess('Venue Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Venue', err.toString())
        );
      }
    });
  }

  onCancel() {
    this.router.navigate(['../list'], { relativeTo: this.route });
  }

  sportChanged(sportId) {
    this.sportId = sportId;
    this.form.patchValue({ sportId: sportId });
  }



  onSuccess = (result: any): void => {
    this.venue = result.venue.result;
    this.sportId = result.params.sportId;
    if (this.mode === 'create') {
      this.venue.sport.id = this.sportId;

    } else {
      this.sportId = this.venue.sport.id;

    }
     this.form.patchValue({ sportId: this.sportId });
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load season', 3);
  }

}
