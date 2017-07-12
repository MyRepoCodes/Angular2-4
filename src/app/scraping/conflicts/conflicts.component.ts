import { Component, ViewEncapsulation } from '@angular/core';
import { ScrapingHttpService } from '../scraping.http.service';
import { Paging } from '../../shared/paging.model';
import { FieldSearchDefinition } from '../models';

@Component({
  selector: 'sn-conflicts',
  templateUrl: 'conflicts.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ConflictsComponent {

  conflicts;
  paging: Paging;
  dialogVisible = false;
  bulkDialogVisible = false;

  bulkResyncData;
  selectedItem;

  selectedEntityType;

  filterParams;

  loading = false;

  playerSearchDefinitions: FieldSearchDefinition[] = [
    { label: 'First Name', field: 'data.firstname', value: '', op: 'Contains', type: '' },
    { label: 'Last Name', field: 'data.lastname', value: '', op: 'Contains', type: '' },
  ];

  gameSearchDefinitions: FieldSearchDefinition[] = [
    { label: 'Home Team', field: 'data.gameTeams.homeTeam', value: '', op: 'Contains', type: '' },
    { label: 'Away Team', field: 'data.gameTeams.awayTeam', value: '', op: 'Contains', type: '' },
    { label: 'Game Time', field: 'data.gameTime.gameDateStr', value: '', op: 'Contains', type: 'date' },
    { label: 'Game UTC', field: 'data.gameTime.utcDate', value: '', op: 'Equals', type: 'datetime' },
  ];

  lineupSearchDefinitions: FieldSearchDefinition[] = [
    { label: 'Player First Name', field: 'data.player.firstname', value: '', op: 'Contains', type: '' },
    { label: 'Player Last Name', field: 'data.player.lastname', value: '', op: 'Contains', type: '' },
    { label: 'Home Team', field: 'data.game.gameTeams.homeTeam', value: '', op: 'Contains', type: '' },
    { label: 'Away Team', field: 'data.game.gameTeams.awayTeam', value: '', op: 'Contains', type: '' },
    { label: 'Game Time', field: 'data.game.gameTime.gameDateStr', value: '', op: 'Contains', type: 'date' },
    { label: 'Game UTC', field: 'data.game.gameTime.utcDate', value: '', op: 'Equals', type: 'datetime' },
  ];

  constructor(
    private scrapingService: ScrapingHttpService
  ) {
    this.paging = { page: 1, size: 25, total: null };
  }

  filterChanged(filterValue) {
    this.selectedEntityType = filterValue.entity;
    this.filterParams = filterValue;
    this.paging.page = 1;
    this.searchConflicts();
  }

  onPropSearch(value) {
    this.filterParams.dss = value;
    this.paging.page = 1;
    this.searchConflicts();
  }

  searchConflicts() {
    this.conflicts = [];
    this.loading = true;
    this.scrapingService.getConflicts(this.selectedEntityType, this.filterParams, this.paging)
      .subscribe(
        res => {
          this.conflicts = res.result;
          this.paging.total = res.totalRecords;
        },
        () => {
        },
        () => this.loading = false
      );
  }

  showBulkResyncDialog() {
    if (this.selectedItem) {
      this.bulkResyncData = this.selectedItem;
    } else {
      this.bulkResyncData = this.filterParams;
    }
    this.bulkDialogVisible = true;
  }

  onBulkResyncSuccess() {
    this.bulkDialogVisible = false;
  }

  onResolveButtonClick(item) {
    this.selectedItem = item;
    this.dialogVisible = true;
  }

  closeConflictDialog() {
    this.dialogVisible = false;
  }

  public goToPage(p: any) {
    this.paging.page = p.page;
    this.paging.size = p.size;
    this.searchConflicts();
  }
}
