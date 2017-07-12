import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpSportService } from '../../shared/services';
import { NotificationService } from '../../shared/services/notification.service';
import { FilterUtils } from '../../shared/utils/filter-utils';

@Component({
  selector: 'sn-games',
  template: '<div>Sport list stub</div>',
  styles: ['.actions { text-align: center; }']
})
export class GamesComponent implements OnInit {
  public sports: any[];
  public loading: boolean;
  public page: { number: number, size: number };
  public total: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sportService: HttpSportService,
    private notifications: NotificationService
  ) {
    this.loading = false;
    this.page = { number: 1, size: 25 };
  }

  ngOnInit() {
    this.route.params
      .do(() => this.loading = true)
      .map(params => ({ page: +params['page'] || 1, size: +params['size'] || 25 }))
      .mergeMap(
        params => this.sportService.getSports({ number: params.page, size: params.size }),
        (params, sports) => ({ params: params, sports: sports })
      )
      .subscribe(this.onSuccess, this.onError);
  }

  onSuccess = (result: any): void => {
    this.page = { number: result.params.page, size: result.params.size };
    this.sports = result.sports.result;
    this.total = result.sports.totalRecords;

    this.loading = false;
  }

  onError = (error: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load sports', 3);
  }

  onAdd() {
    this.router.navigate(['../create'], { relativeTo: this.route });
  }

  onEdit(id) {
    this.router.navigate(['../', id], { relativeTo: this.route });
  }

  onDelete(id) {

  }

  search() {
    const searchParams = FilterUtils.createSearchParams({
      page: this.page.number, size: this.page.size
    });
    this.router.navigate(['../list', searchParams], { relativeTo: this.route });
  }

  goToPage(page: any) {
    this.page = { number: page.page, size: page.size };
    this.search();
  }
}
