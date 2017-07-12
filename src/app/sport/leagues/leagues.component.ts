import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpSportService } from '../../shared/services';
import { FilterUtils } from '../../shared/utils/filter-utils';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'sn-leagues',
  templateUrl: 'leagues.component.html'
})
export class LeaguesComponent implements OnInit {

  public sportId: string;
  public page: { number: number, size: number };
  public leagues: any[];
  public total: number;
  public loading: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private sportService: HttpSportService,
              private notifications: NotificationService) {
    this.loading = false;
    this.page = { number: 1, size: 25 };
  }

  ngOnInit(): void {
    this.route.params
      .do(() => this.loading = true)
      .map(params => {
        return {
          sportId: params['sportId'],
          page: +params['page'] || 1,
          size: +params['size'] || 25
        };
      }).mergeMap(
        p => this.sportService.getLeagues(p.sportId, { number: p.page, size: p.size }),
        (params, leagues) => ({ params: params, leagues: leagues })
      )
      .subscribe(this.onSuccess, this.onError);
  }

  onSuccess = (result: any): void => {
    this.sportId = result.params.sportId;
    this.page = { number: result.params.page, size: result.params.size };
    this.leagues = result.leagues.result;
    this.total = result.leagues.totalRecords;

    this.loading = false;
  }

  onError = (error: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load sports', 3);
  }

  search() {
    const searchParams = FilterUtils.createSearchParams({
      sportId: this.sportId,
      page: this.page.number, size: this.page.size
    });
    this.router.navigate(['../', searchParams], { relativeTo: this.route });
  }

  onAdd() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  onEdit(id) {
    this.router.navigate(['../', id], { relativeTo: this.route });
  }

  onDelete(id) {

  }

  goToPage(p: any) {
    this.page = { number: p.page, size: p.size };
    this.search();
  }

  sportChanged(sportId) {
    this.sportId = sportId;
  }
}
