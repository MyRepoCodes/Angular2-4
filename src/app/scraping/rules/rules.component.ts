import { Component } from '@angular/core';
import { ScrapingHttpService, RulesSearchObject } from '../scraping.http.service';
import { ResolutionRuleset, FieldSearchDefinition } from '../models';
import { Paging } from '../../shared/paging.model';
import { ConfirmationService } from 'primeng/components/common/api';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'sn-rules-list',
  templateUrl: 'rules.component.html'
})
export class RulesComponent {

  rules: ResolutionRuleset[];
  adding;
  paging: Paging;
  filterParams: RulesSearchObject;

  rulePrefill;
  dialogVisible;


  playerSearchDefinitions: FieldSearchDefinition[] = [
    { label: 'First Name', field: 'firstname', value: '', op: 'Contains', type: '' },
    { label: 'Last Name', field: 'lastname', value: '', op: 'Contains', type: '' },
  ];

  gameSearchDefinitions: FieldSearchDefinition[] = [
    { label: 'Home Team', field: 'gameTeams.homeTeam', value: '', op: 'Contains', type: '' },
    { label: 'Away Team', field: 'gameTeams.awayTeam', value: '', op: 'Contains', type: '' },
    { label: 'Game Time', field: 'gameTime.gameDateStr', value: '', op: 'Contains', type: 'date' },
    { label: 'Game UTC', field: 'gameTeams.utcDate', value: '', op: 'Contains', type: 'date' }
  ];

  lineupSearchDefinitions: FieldSearchDefinition[] = [
    { label: 'Player First Name', field: 'player.lastname', value: '', op: 'Contains', type: '' },
    { label: 'Player Last Name', field: 'player.firstname', value: '', op: 'Contains', type: '' },
    { label: 'Home Team', field: 'game.gameTeams.homeTeam', value: '', op: 'Contains', type: '' },
    { label: 'Away Team', field: 'game.gameTeams.awayTeam', value: '', op: 'Contains', type: '' },
    { label: 'Game Time', field: 'game.gameTime.gameDateStr', value: '', op: 'Contains', type: 'date' },
    { label: 'Game UTC', field: 'game.gameTeams.utcDate', value: '', op: 'Contains', type: 'date' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private scrapingService: ScrapingHttpService,
    private notifications: NotificationService
  ) {
    this.paging = { page: 1, size: 25, total: null };
  }

  filterChanged(value) {
    this.filterParams = value;
    this.paging.page = 1;
    this.searchRules();
  }

  onPropSearch(value) {
    this.filterParams.mrs = value;
    this.paging.page = 1;
    this.searchRules();
  }

  searchRules() {
    this.scrapingService.getRules(this.filterParams, this.paging)
      .subscribe(res => {
        this.rules = res.result;
        this.paging.total = res.totalRecords;
      });
  }

  public goToPage(p: any) {
    this.paging.page = p.page;
    this.paging.size = p.size;
    this.searchRules();
  }

  hideDialog() {
    this.dialogVisible = false;
  }

  showDialog() {
    this.dialogVisible = true;
  }

  onUpdateButtonClick(item) {
    this.rulePrefill = item;
    this.rulePrefill.leagueId = (<any>this.filterParams).leagueId;
    this.showDialog();
  }

  onDeleteButtonClick(item) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.scrapingService.deleteRule(item)
          .subscribe(res => {
            this.notifications.showSuccess('Rule deleted');
            this.searchRules();
          }, err => {
            this.notifications.showError('Cannot delete rule', err, 3);
          });
      }
    });
  }

  onAddButtonClick() {
    this.rulePrefill = this.filterParams;
    this.showDialog();
  }

}
