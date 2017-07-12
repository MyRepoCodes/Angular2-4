import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoggerMapping } from './entities';
import { NotificationService } from '../../shared/services/notification.service';
import { OperationsHttpService } from '../../shared/services/operations.service';
import { SecurityHttpService } from '../../shared/services/users.service';

@Component({
  selector: 'sn-loggers-mapping-list',
  templateUrl: 'loggers-mapping.component.html',
  styles: [`
    .ui-datatable tbody td {
      overflow: visible !important;
    }
    .search-field {
      width: 100%;
    }
    .search-button {
      float: right;
    }
   `],
  encapsulation: ViewEncapsulation.None
})
export class LoggersMappingComponent implements OnInit {

  loggerMappings: LoggerMapping[];
  loggers: any[];
  suggest: { name: string, id: string }[];
  paging: { page: number, size: number, total?: number };
  adding = false;

  constructor(
    private notificationService: NotificationService,
    private operationsService: OperationsHttpService,
    private usersService: SecurityHttpService
  ) {
    this.paging = { page: 1, size: 25 };
  }

  ngOnInit(): void {
    this.loadMappings(this.paging);
  }

  public onUpdateButtonClick(item: LoggerMapping) {
    this.operationsService.putLoggerMapping(item)
      .subscribe(
        () => this.notificationService.showInfo('Success', 'Mapping updated'),
        () => this.notificationService.showError('Error', 'Mapping could not be updated')
      );
  }

  public onCreateButtonClick(item: LoggerMapping) {
    this.adding = false;
    this.operationsService.postLoggerMapping(item)
      .do(res => {
        if (res.failed) {
          throw new Error(res.errors.join('\n'));
        }
      })
      .map(res => res.result)
      .subscribe(
        createdId => {
          this.loggerMappings.shift();
          this.paging.total++;
          this.notificationService.showInfo('Success', 'Mapping created');
          if (this.loggerMappings.length < this.paging.size) {
            item.isNew = false;
            item.id = createdId;
            this.loggerMappings.push(item);
          }
        },
        error => this.notificationService.showError('Could not create mapping', error)
      );
  }

  public onCancelButtonClick() {
    this.loggerMappings = this.loggerMappings.filter(x => !x.isNew);
    this.adding = false;
  }

  public goToPage(p: any) {
    this.paging.page = p.page;
    this.paging.size = p.size;
    this.loadMappings(this.paging);
  }

  public addEntry() {
    this.adding = true;
    this.loggerMappings = [
      ... [new LoggerMapping({ isNew: true })],
      ... this.loggerMappings
    ];
  }

  public canSave() {
    return !!this.loggerMappings[0].logger;
  }

  public findUsers(searchText: string) {
    if (searchText.length > 2) { // Search if at least 3 chars, to prevent too much results
      this.usersService.searchUserByText(searchText, 0)
        .subscribe(
          res => {
            this.loggers = res.result;
            this.suggest = this.loggers.map(logger => {
                return { name: `${logger.first} ${logger.last}`, id: logger.id };
              }
            );
          });
    }
  }

  public findUserByIid(iid) {
    this.usersService.searchUserByIid(iid, 0) // 0 is type Logger
      .map(res => {
        const user = res.result[0];
        if (!user) {
          throw new Error();
        }
        user.fullName = `${user.first} ${user.last}`;
        return user;
      })
      .subscribe(
        user => this.loggerMappings[0].logger = user,
        () => this.notificationService.showError('Error', 'User not found.')
      );
  }

  public optionSelected(obj) {
    const logger = this.loggers.find(m => m.id === obj.id);
    (<any>logger).fullName = obj.name;
    this.loggerMappings[0].logger = logger;
  }

  public searchMappingsByName(searchText) {
    this.loadMappings(Object.assign(this.paging, {searchText}));
  }

  private loadMappings(searchParams) {
    this.operationsService.getLoggerMappings(searchParams)
      .subscribe(
        res => {
          this.loggerMappings = res.result;
          this.paging.total = res.totalRecords;
        });
  }
}
