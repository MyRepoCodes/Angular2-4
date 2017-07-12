import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateTimeUtils } from '../../../shared/utils/datetime-utils';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { NotificationService } from '../../../shared/services/notification.service';
import { HttpSportService } from '../../../shared/services/sport.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'sn-game-lineup-component',
  template: `
    <div *ngIf="! loading" class="ui-g-12">
      <p-tabView (onChange)="teamChanged($event)" class="ui-g-6">
        <p-tabPanel header="Home Team" [selected]="isHomeTeamDisplay">
          <p-dataTable
            [value]="homePlayersLineup"
            selectionMode="single" [(selection)]="selectedLineup" (onRowSelect)="onEdit($event)">
            <p-column field="player.id" header="Sport Player ID" [style]="{'width':'190px'}"
                      [sortable]="true"></p-column>
            <p-column field="player.lastName" header="Last Name" [sortable]="true"></p-column>
            <p-column field="player.firstName" header="First Name" [sortable]="true"></p-column>
            <p-column field="batOrder" header="Bat Order" [sortable]="true"></p-column>
            <p-column field="number" header="Number" [sortable]="true"></p-column>
            <p-column field="lineup" header="Lineup" [sortable]="true">
              <ng-template let-col let-gameplayer="rowData" let-ri="rowIndex" pTemplate type="body">
                {{lineupToString(gameplayer.lineup)}}
              </ng-template>
            </p-column>
            <p-column field="position" header="Position" [sortable]="true">
              <ng-template let-col let-gameplayer="rowData" let-ri="rowIndex" pTemplate type="body">
                {{positionToString(gameplayer.position)}}
              </ng-template>
            </p-column>
          </p-dataTable>
          <button pButton type="button" icon="fa-plus"
                  (click)="showDialogToAdd(true)" label="Add"></button>
        </p-tabPanel>

        <p-tabPanel header="Away Team" [selected]="! isHomeTeamDisplay">
          <p-dataTable [value]="awayPlayersLineup" selectionMode="single" [(selection)]="selectedLineup"
                       (onRowSelect)="onEdit($event)">
            <p-column field="player.id" header="Sport Player ID" [style]="{'width':'190px'}"
                      [sortable]="true"></p-column>
            <p-column field="player.lastName" header="Last Name" [sortable]="true"></p-column>
            <p-column field="player.firstName" header="First Name" [sortable]="true"></p-column>
            <p-column field="batOrder" header="Bat Order" [sortable]="true"></p-column>
            <p-column field="number" header="Number" [sortable]="true"></p-column>
            <p-column field="lineup" header="Lineup" [sortable]="true">
              <ng-template let-col let-gameplayer="rowData" let-ri="rowIndex" pTemplate type="body">
                {{lineupToString(gameplayer.lineup)}}
              </ng-template>
            </p-column>
            <p-column field="position" header="Position" [sortable]="true">
              <ng-template let-col let-gameplayer="rowData" let-ri="rowIndex" pTemplate type="body">
                {{positionToString(gameplayer.position)}}
              </ng-template>
            </p-column>
          </p-dataTable>
          <button pButton type="button" icon="fa-plus"
                  (click)="showDialogToAdd(false)" label="Add"></button>
        </p-tabPanel>
      </p-tabView>

      <p-tabView (onChange)="searchModeChanged($event)" class="ui-g-6">

        <p-tabPanel header="Search for already played gameplayers">
          <p-dataTable [value]="pastGamePlayers" selectionMode="single" [(selection)]="selectedPastLineup"
                       [paginator]="true" [rows]="rows" [totalRecords]="totalRecords"
                       [rowsPerPageOptions]="rowsPerPageOptions">
            <p-header>
              <div style="text-align:left">
                <p-multiSelect [options]="columnOptions" [(ngModel)]="cols"
                               (onChange)="onColumnListChange($event.value)"></p-multiSelect>
              </div>
            </p-header>
            <p-column field="player.id" header="Sport Player ID" [sortable]="true" [filter]="true"
                      filterPlaceholder="Search" [style]="{'width':'190px'}"
                      [hidden]="! visibleColumns['player.id']"
            ></p-column>
            <p-column field="player.lastName" header="Last Name" [sortable]="true" [filter]="true"
                      filterPlaceholder="Search"
                      [hidden]="! visibleColumns['player.lastName']"
            ></p-column>
            <p-column field="player.firstName" header="First Name" [sortable]="true" [filter]="true"
                      filterPlaceholder="Search"
                      [hidden]="! visibleColumns['player.firstName']"
            ></p-column>
            <p-column header="College" field="player.college" [sortable]="true"
                      [hidden]="! visibleColumns['player.college']"
            ></p-column>
            <p-column header="Height" field="player.height" [sortable]="true"
                      [hidden]="! visibleColumns['player.height']"
            ></p-column>
            <p-column header="Weight" field="player.weight" [sortable]="true"
                      [hidden]="! visibleColumns['player.weight']"
            ></p-column>
            <p-column header="Included">
              <ng-template let-player="rowData" pTemplate type="body">
                <p-checkbox [ngModel]="player.isPlayerIncluded" (ngModelChange)="changeLineupStatus(player)"
                            binary="true">
                </p-checkbox>
              </ng-template>
            </p-column>
          </p-dataTable>
        </p-tabPanel>

        <p-tabPanel header="Search by player details">

          <div class="ui-g">


            <form [formGroup]="form">
              <div class="ui-g-12 ui-g-nopad">
                <div class="ui-g-3"><input type="text" pInputText [(ngModel)]="firstName"
                                           [placeholder]="'First Name'" [formControl]="form.controls.firstName"/>
                </div>
                <div class="ui-g-3"><input type="text" pInputText [(ngModel)]="lastName"
                                           [formControl]="form.controls.lastName"
                                           [placeholder]="'Last Name'"/>
                </div>
                <div class="ui-g-4">
                  <p-calendar
                    [ngModel]="birthDate"
                    [placeholder]="'Birth date'"
                    [showIcon]="true"
                    (onSelect)="onBirthDateSearch('birthDateSearch', $event)"
                    (onBlur)="onBlurCalendar('birthDateSearch', $event)"
                    [formControl]="form.controls.birthDate"
                  >
                  </p-calendar>
                </div>
                <div class="ui-g-1">
                  <button pButton type="button" label="Search" (click)="onSearchPlayersByPersonalDetails($event)"
                          [disabled]="! form.valid">
                  </button>
                </div>
              </div>
              <div class="ui-g-12 ui-g-nopad">
                <div class="ui-message ui-messages-error ui-corner-all"
                     *ngIf="!form.controls.firstName.valid && form.controls.firstName.dirty">
                  <i class="fa fa-close"></i>
                  First name is required
                </div>
                <div class="ui-message ui-messages-error ui-corner-all"
                     *ngIf="!form.controls.lastName.valid && form.controls.lastName.dirty">
                  <i class="fa fa-close"></i>
                  Last name is required
                </div>
                <div class="ui-message ui-messages-error ui-corner-all"
                     *ngIf="!form.controls.birthDate.valid && form.controls.birthDate.dirty">
                  <i class="fa fa-close"></i>
                  Date of birth is required
                </div>
              </div>
            </form>


            <p-dataTable [value]="matchedPlayers" selectionMode="single" [(selection)]="selectedPastLineup"
                         [paginator]="true" [rows]="rows" [totalRecords]="totalRecords"
                         [rowsPerPageOptions]="rowsPerPageOptions">
              <p-header>
                <div style="text-align:left">
                  <p-multiSelect
                    #filter [options]="columnOptions" [(ngModel)]="cols"
                    (onChange)="onColumnListChange($event.value)"
                  ></p-multiSelect>
                </div>
              </p-header>
              <p-column field="player.id" header="Sport Player ID" [sortable]="true" [filter]="true"
                        filterPlaceholder="Search" [style]="{'width':'190px'}"
                        [hidden]="! visibleColumns['player.id']"
              ></p-column>
              <p-column header="IID" field="player.iid"></p-column>
              <p-column field="player.firstName" header="First Name" [sortable]="true" [filter]="true"
                        filterPlaceholder="Search"
                        [hidden]="! visibleColumns['player.firstName']"
              ></p-column>
              <p-column field="player.lastName" header="Last Name" [sortable]="true" [filter]="true"
                        filterPlaceholder="Search"
                        [hidden]="! visibleColumns['player.lastName']"
              ></p-column>
              <p-column field="player.birthDate" header="BirthDate" [sortable]="true" [filter]="true"
                        filterPlaceholder="Search"
                        [hidden]="! visibleColumns['player.birthDate']"
              ></p-column>
              <p-column header="College" field="player.college" [sortable]="true"
                        [hidden]="! visibleColumns['player.college']"
              ></p-column>
              <p-column header="Height" field="player.height" [sortable]="true"
                        [hidden]="! visibleColumns['player.height']"
              ></p-column>
              <p-column header="Weight" field="player.weight" [sortable]="true"
                        [hidden]="! visibleColumns['player.weight']"
              ></p-column>
              <p-column header="Included" [style]="{'width':'80px'}">
                <ng-template let-player="rowData" pTemplate type="body">
                  <p-checkbox [ngModel]="player.isPlayerIncluded" (ngModelChange)="changeLineupStatus(player)"
                              binary="true">
                  </p-checkbox>
                </ng-template>
              </p-column>
            </p-dataTable>

          </div>

        </p-tabPanel>

      </p-tabView>
    </div>

    <div *ngIf="loading">Loading...</div>

    <p-dialog appendTo="body" header="Lineup{{isSaving()}}" [(visible)]="displayDialog"
              [width]="600" [height]="auto" showEffect="fade" [modal]="true">
      <div class="ui-g">
        <div *ngIf="error">{{error}}</div>

        <div class="ui-g-12" *ngIf="lineup && newLineup">
          <div class="ui-g-2"><label for="playerId">Existing Player</label></div>
          <div class="ui-g-4">
            <p-checkbox [(ngModel)]="existingPlayer" binary="true"></p-checkbox>
          </div>
          <div class="ui-g-4"></div>
        </div>

        <div class="ui-g-12" *ngIf="lineup && existingPlayer">
          <div class="ui-g-4"><label for="playerId">Player ID</label></div>
          <div class="ui-g-8">
            <input pInputText id="playerId" [(ngModel)]="lineup.player.id"/>
          </div>
        </div>

        <div class="ui-g" *ngIf="lineup && !existingPlayer">
          <div class="ui-g-12">
            sport.player.id: {{lineup.player.id}}
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="batOrder">Bat Order</label></div>
            <div class="ui-g-4"><input pInputText id="batOrder" [(ngModel)]="lineup.batOrder"
            /></div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="number">Number</label></div>
            <div class="ui-g-4"><input pInputText id="number" [(ngModel)]="lineup.number"
                                       style="width: 90%;"/></div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="lineup">Lineup</label></div>
            <div class="ui-g-4">
              <sn-select-baseball-lineup
                [lineup]="lineup.lineup" (lineupChanged)="updateLineupValue($event)"
              ></sn-select-baseball-lineup>
            </div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-4"><label for="position">Position</label></div>
            <div class="ui-g-4">
              <sn-select-position
                [position]="lineup.position" (positionChanged)="updatePositionValue($event)"
              ></sn-select-position>
            </div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="name">Name *</label></div>
            <div class="ui-g-4">
              <input pInputText id="name" [disabled]="true"
                     [ngModel]="lineup.player.firstName + ' ' +lineup.player.lastName"
              />
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="firstName">First Name *</label></div>
            <div class="ui-g-4"><input pInputText id="firstName" [(ngModel)]="lineup.player.firstName"
            /></div>
            <div class="ui-g-4">

              <div class="ui-message ui-messages-error ui-corner-all" *ngIf="!validFirstName">
                <i class="fa fa-close"></i>
                Firstname is required
              </div>
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="lastName">Last Name *</label></div>
            <div class="ui-g-4"><input pInputText id="lastName" [(ngModel)]="lineup.player.lastName"
            /></div>
            <div class="ui-g-4">
              <div class="ui-message ui-messages-error ui-corner-all" *ngIf="!validLastName">
                <i class="fa fa-close"></i>
                Lastname is required
              </div>
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="birthDate">Birth Date *</label></div>
            <div class="ui-g-4">
              <p-calendar
                [(ngModel)]="lineup.player.birthDate"
                [placeholder]="'Date'"
                [showIcon]="true"
                (onBlur)="onBlurCalendar('birthDate', $event)"
              ></p-calendar>
            </div>
            <div class="ui-g-4">
              <div class="ui-message ui-messages-error ui-corner-all" *ngIf="!validBirthDate">
                <i class="fa fa-close"></i>
                Birtdate is required
              </div>
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="birthPlace">Birth Place</label></div>
            <div class="ui-g-4"><input pInputText id="birthPlace"
                                       [(ngModel)]="lineup.player.birthPlace" style="width: 90%;"/></div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="college">College</label></div>
            <div class="ui-g-4"><input pInputText id="college" [(ngModel)]="lineup.player.college"
            /></div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="debut">Debut</label></div>
            <div class="ui-g-4">
              <p-calendar
                [(ngModel)]="lineup.player.debut"
                [placeholder]="'Date'"
                [showIcon]="true"
                (onBlur)="onBlurCalendar('debut', $event)"
              ></p-calendar>
            </div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="height">Height *</label></div>
            <div class="ui-g-4"><input pInputText id="height" [(ngModel)]="lineup.player.height"
            /></div>
            <div class="ui-g-4">
              <div class="ui-message ui-messages-error ui-corner-all" *ngIf="!validHeight">
                <i class="fa fa-close"></i>
                Height is required
              </div>
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="weight">Weight *</label></div>
            <div class="ui-g-4"><input pInputText id="weight" [(ngModel)]="lineup.player.weight"
            /></div>
            <div class="ui-g-4">
              <div class="ui-message ui-messages-error ui-corner-all" *ngIf="!validWeight">
                <i class="fa fa-close"></i>
                Weight is required
              </div>
            </div>
          </div>
          <div class="ui-g-12">
            <div class="ui-g-2"><label for="status">Status</label></div>
            <div class="ui-g-4"><input pInputText id="status" [(ngModel)]="lineup.player.status"
            /></div>
            <div class="ui-g-4"></div>
          </div>
          <div class="ui-g-12" *ngIf="!newLineup">
            <div class="ui-g-2">In Home team</div>
            <div class="ui-g-4">
              <p-checkbox [ngModel]="lineup.isHome" (ngModelChange)="switchTeam(lineup)" binary="true"></p-checkbox>
            </div>
            <div class="ui-g-4"></div>
          </div>
        </div>

        <p-footer>
          <div>
            <button type="button" pButton *ngIf="! newLineup" icon="fa-close" [disabled]="saving" (click)="remove()"
                    label="Delete"></button>
            <button type="button" pButton icon="fa-check" [disabled]="saving" (click)="confirmAddLineup()" label="Save">
            </button>
          </div>
        </p-footer>

      </div>
    </p-dialog>

    <p-dialog header="Add lineup confirmation" [(visible)]="showLineupConfirmation" [width]="450" [height]="200"
              [modal]="true">
      <div class="ui-g-12">
        <h4>Are you sure you want to create new player? Please check existing players first!</h4>
      </div>
      <div class="ui-g-12">
        <div class="ui-g-6">
          <button type="button" pButton icon="fa-add" (click)="save()" label="Create new player"></button>
        </div>
        <div class="ui-g-6">
          <button type="button" pButton icon="fa-close" (click)="closeConfirmationDialog()" label="No, search first">
          </button>
        </div>
      </div>
    </p-dialog>

    <p-confirmDialog width="425"></p-confirmDialog>
  `
})
export class GameLineupComponent implements OnInit {
  @Input() gameId;
  @Input() game;

  auto;
  homePlayersLineup: any[];
  awayPlayersLineup: any[];
  pastGamePlayers: any[];
  matchedPlayers: any[];
  displayDialog = false;
  lineup;
  selectedLineup;
  selectedPastLineup;
  loading = false;
  saving = false;
  newLineup = false;
  existingPlayer = true;
  error;
  withPbp = false;
  withoutPbp = false;
  teamId: string;
  seasonId: string;
  isPlayerIncluded = false;
  isHomeTeamDisplay = true;
  isPastLineupDisplay = true;
  firstName = '';
  lastName = '';
  birthDate;
  showLineupConfirmation = false;

  cols: any[];
  visibleColumns: { [key: string]: boolean };
  columnOptions: SelectItem[];
  first: number;
  rows: number;
  totalRecords: number;
  pageLinkSize: number;
  rowsPerPageOptions: number[];
  form: FormGroup;
  validFirstName = true;
  validLastName = true;
  validBirthDate = true;
  validHeight = true;
  validWeight = true;

  constructor(
    public builder: FormBuilder,
    private sportService: HttpSportService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) {
    this.cols = [
      { field: 'player.id', header: 'Sport Player ID' },
      { field: 'player.firstName', header: 'First Name' },
      { field: 'player.lastName', header: 'Last Name' },
      { field: 'player.birthDate', header: 'Birth Date' },
      { field: 'player.college', header: 'College' },
      { field: 'player.height', header: 'Height' },
      { field: 'player.weight', header: 'Weight' }
    ];

    this.visibleColumns = {
      'player.id': false,
      'player.firstName': true,
      'player.lastName': true,
      'player.birthDate': true,
      'player.college': true,
      'player.height': true,
      'player.weight': true
    };

    this.columnOptions = [];
    for (const col of this.cols) {
      this.columnOptions.push({ label: col.header, value: col });
    }

    // to mark 'player.id' as not selected in p-multiselect
    this.cols = this.cols.filter(e => e.field !== 'player.id');

    this.matchedPlayers = [];

    this.first = 0;
    this.rows = 30;
    this.totalRecords = 0;
    this.pageLinkSize = 3;
    this.rowsPerPageOptions = [20, 30, 40];
    this.form = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required]

    });
  }

  ngOnInit() {
    this.load();
  }

  load() {
    const sortByLastName = (obj, other): number => {
      if (obj.player.lastName > other.player.lastName) {
        return 1;
      } else if (obj.player.lastName < other.player.lastName) {
        return -1;
      } else {
        return 0;
      }
    };

    this.loading = true;
    this.sportService.getLineupByGame(this.gameId).subscribe(res => {
      this.homePlayersLineup = res.filter(gp => gp.isHome).sort(sortByLastName);
      this.awayPlayersLineup = res.filter(gp => !gp.isHome).sort(sortByLastName);
      this.loading = false;
      let lineup = this.homePlayersLineup;
      this.teamId = this.game.homeTeam.id;
      if (!this.isHomeTeamDisplay) {
        lineup = this.awayPlayersLineup;
        this.teamId = this.game.awayTeam.id;
      }
      this.sportService.getLineupsForTeamInSeason(this.game.season.id, this.teamId)
        .subscribe((result: any) => {
          this.preparePastLineupData(result, lineup);
        });
      this.onSearchPlayersByPersonalDetails();
    });
  }

  onColumnListChange(selected) {
    for (const c in this.visibleColumns) {
      if (selected.filter(e => e.field === c)[0]) {
        this.visibleColumns[c] = true;
      } else {
        this.visibleColumns[c] = false;
      }
    }
  }

  teamChanged() {
    if (this.isHomeTeamDisplay) {
      this.isHomeTeamDisplay = false;
    } else {
      this.isHomeTeamDisplay = true;
    }
    this.showPastLineupGamePlayers();
  }

  searchModeChanged() {
    if (this.isPastLineupDisplay) {
      this.isPastLineupDisplay = false;
    } else {
      this.isPastLineupDisplay = true;
      if (this.pastGamePlayers && this.pastGamePlayers.length === 0) {
        this.showPastLineupGamePlayers();
      }
    }
  }

  showPastLineupGamePlayers() {
    this.teamId = this.game.homeTeam.id;
    let lineup = this.homePlayersLineup;

    if (!this.isHomeTeamDisplay) {
      this.teamId = this.game.awayTeam.id;
      lineup = this.awayPlayersLineup;
    }
    this.sportService.getLineupsForTeamInSeason(this.game.season.id, this.teamId)
      .subscribe((res: any) => {
        this.preparePastLineupData(res, lineup);
      });
  }

  onSearchPlayersByPersonalDetails() {
    if (this.lastName.trim().length > 0) {
      if (!(this.birthDate)) {
        this.birthDate = new Date();
      }
      this.sportService.getGamePlayersByPersonalDetailsAndTeam(this.firstName,
        this.lastName, DateTimeUtils.stringifyDate(this.birthDate), this.teamId)
        .subscribe((res: any[]) => {
          this.preparePlayersAndGamePlayersData(res);
        }, error => {
          this.notificationService.showError('Could not players from server. Error:' + error);
        });
    }
  }

  changeLineupStatus(gamePlayer) {
    if (!gamePlayer.isPlayerIncluded) {
      this.addGamePlayerToLineupFromThePast(gamePlayer);
    } else {
      this.removeGamePlayerFromLineup(gamePlayer);
    }
  }

  addGamePlayerToLineupFromThePast(gamePlayer) {
    if (!(gamePlayer.game)) {
      const player = this.createEmptyLineupFromCurrentGame(this.isHomeTeamDisplay);
      player.player = gamePlayer.player;
      gamePlayer = player;
    }

    gamePlayer.game = this.game;
    delete gamePlayer.game.$type;
    if (this.isHomeTeamDisplay) {
      gamePlayer.isHome = true;
    } else {
      gamePlayer.isHome = false;
    }
    delete gamePlayer.id;
    delete gamePlayer.iid;
    delete gamePlayer.isPlayerIncluded;

    // todo: tmp horible workaround
    if (!gamePlayer.player.weight) {
      gamePlayer.player.weight = 1;
    }
    if (!gamePlayer.player.height) {
      gamePlayer.player.height = 1;
    }
    if (!gamePlayer.player.birthDate) {
      gamePlayer.player.birthDate = '1/1/2000';
    }
    if (gamePlayer.game && gamePlayer.game.homeTeam && !gamePlayer.game.homeTeam.abbreviation) {
      gamePlayer.game.homeTeam.abbreviation = 'abbr';
    }
    if (gamePlayer.game && gamePlayer.game.awayTeam && !gamePlayer.game.awayTeam.abbreviation) {
      gamePlayer.game.homeTeam.abbreviation = 'abbr';
    }
    if (gamePlayer.game && gamePlayer.game.league && !gamePlayer.game.league.abbreviation) {
      gamePlayer.game.league.abbreviation = 'abbr';
    }

    this.sportService.postGamePlayer(gamePlayer).subscribe(res => {
      if (res && res.errors && res.errors.length > 0) {
        for (const errText of res.errors) {
          this.error += errText + '\n';
        }
        this.notificationService.showError('Failed!', this.error);
      } else {
        this.notificationService.showSuccess('Success!', 'Game player has been successfully added.');
        this.load();
      }
    }, this.onError);
  }

  removeGamePlayerFromLineup(gamePlayer) {
    let actualGamePlayer;
    if (this.isHomeTeamDisplay) {
      actualGamePlayer = this.homePlayersLineup.filter(p => p.player.id === gamePlayer.player.id);
    } else {
      actualGamePlayer = this.awayPlayersLineup.filter(p => p.player.id === gamePlayer.player.id);
    }
    if (!!(actualGamePlayer) && actualGamePlayer.length > 0) {
      gamePlayer.id = actualGamePlayer[0].id;
      this.confirmDelete(gamePlayer);
    } else {
      this.notificationService.showError('Error', 'This player does not exist in lineup. Refresh the page.');
    }
  }

  showDialogToAdd(isHome) {
    this.existingPlayer = false;
    this.error = '';
    this.lineup = this.createEmptyLineupFromCurrentGame(isHome);
    this.newLineup = true;
    this.displayDialog = true;
  }

  onEdit(event) {
    this.existingPlayer = false;
    this.error = '';
    const tmpLineup = event.data;
    // calendar workaround
    tmpLineup.player.birthDate = this.convertToDate(tmpLineup.player.birthDate);
    tmpLineup.player.debut = this.convertToDate(tmpLineup.player.debut);
    this.lineup = event.data;
    this.newLineup = false;
    this.displayDialog = true;
  }

  isSaving() {
    return this.saving ? ' (Saving)' : '';
  }

  confirmAddLineup() {
    this.showLineupConfirmation = true;
  }

  save() {
    this.saving = true;
    this.showLineupConfirmation = false;
    if (this.newLineup && this.existingPlayer) {
      this.sportService.getPlayer(this.lineup.player.id)
        .subscribe(res => {

          // todo: tmp horible workaround
          if (!res.weight) {
            res.weight = 1;
          }
          if (!res.height) {
            res.height = 1;
          }
          if (!res.birthDate) {
            res.birthDate = '1/1/2000';
          }
          if (this.lineup.game && this.lineup.game.homeTeam && !this.lineup.game.homeTeam.abbreviation) {
            this.lineup.game.homeTeam.abbreviation = 'abbr';
          }
          if (this.lineup.game && this.lineup.game.awayTeam && !this.lineup.game.awayTeam.abbreviation) {
            this.lineup.game.homeTeam.abbreviation = 'abbr';
          }
          if (this.lineup.game && this.lineup.game.league && !this.lineup.game.league.abbreviation) {
            this.lineup.game.league.abbreviation = 'abbr';
          }

          this.lineup.player = res;
          this.sportService.postGamePlayer(this.lineup)
            .subscribe(this.onSuccess, this.onError);
        }, err => {
          this.error = 'Cannot load player';
          console.log(err);
          this.saving = false;
        });
    } else if (this.newLineup && !this.existingPlayer) {
      // todo: workaround or not?
      // sanitize spaces in player name
      this.lineup.player.firstName = this.lineup.player.firstName.trim();
      this.lineup.player.lastName = this.lineup.player.lastName.trim();

      if (!this.checkValidation()) {
        return;
      }

      if (!!(this.lineup.player.birthDate)) {
        this.lineup.player.birthDate = DateTimeUtils.stringifyDate(this.lineup.player.birthDate);
      }
      if (!!(this.lineup.player.debut)) {
        this.lineup.player.debut = DateTimeUtils.stringifyDate(this.lineup.player.debut);
      }
      this.lineup.player.name = this.lineup.player.firstName + ' ' + this.lineup.player.lastName;
      this.sportService.postPlayer(this.lineup.player)
        .subscribe(res => {
          this.lineup.player.id = res.result;
          this.sportService.postGamePlayer(this.lineup)
            .subscribe(this.onSuccess, this.onError);
        }, err => {
          this.error = 'Cannot create player';
          console.log(err);
          this.saving = false;
        });
    } else {
      if (!!(this.lineup.player.birthDate)) {
        this.lineup.player.birthDate = DateTimeUtils.stringifyDate(this.lineup.player.birthDate);
      }
      if (!!(this.lineup.player.debut)) {
        this.lineup.player.debut = DateTimeUtils.stringifyDate(this.lineup.player.debut);
      }
      this.sportService.putGamePlayer(this.lineup)
        .subscribe(this.onSuccess, this.onError);
    }
  }

  onBlurCalendar(source, event) {
    const strDate = event.target.value;
    if (strDate !== '') {
      try {
        const date = new Date(strDate);
        if (source === 'birthDate') {
          this.lineup.player.birthDate = date;
        } else if (source === 'debut') {
          this.lineup.player.debut = date;
        } else if (source === 'birthDateSearch') {
          this.birthDate = date;
        }
      } catch (ex) {
        this.notificationService.showError(
          `Format of date calendar '${source}' is incorrect. Must be in format mm/dd/yyyy!`);
      }
    }
  }

  onBirthDateSearch(source, date) {
    if (source === 'birthDate') {
      this.lineup.player.birthDate = date;
    } else if (source === 'debut') {
      this.lineup.player.debut = date;
    } else if (source === 'birthDateSearch') {
      this.birthDate = date;
    }
  }

  switchTeam(gamePlayer) {
    this.terribleWorkAroundValidation(gamePlayer);
    if (gamePlayer.isHome) {
      gamePlayer.isHome = false;
    } else {
      gamePlayer.isHome = true;
    }
    const team = gamePlayer.isHome ? 'Home' : 'Away';
    this.sportService.putGamePlayer(gamePlayer).subscribe(res => {
      if (res && res.errors && res.errors.length > 0) {
        for (const errText of res.errors) {
          this.error += errText + '\n';
        }
        this.notificationService.showError('Failed to switch the team!', this.error);
      } else {
        this.notificationService.showSuccess('Success!', `Game player was moved to ${team} team.`);
        this.displayDialog = false;
        this.load();
      }
    }, this.onError);
  }

  terribleWorkAroundValidation(gamePlayer) {
    // todo: tmp horible workaround
    if (!gamePlayer.player.weight) {
      gamePlayer.player.weight = 1;
    }
    if (!gamePlayer.player.height) {
      gamePlayer.player.height = 1;
    }
    if (!gamePlayer.player.birthDate) {
      gamePlayer.player.birthDate = '1/1/2000';
    }
    if (gamePlayer.game && gamePlayer.game.homeTeam && !gamePlayer.game.homeTeam.abbreviation) {
      gamePlayer.game.homeTeam.abbreviation = 'abbr';
    }
    if (gamePlayer.game && gamePlayer.game.awayTeam && !gamePlayer.game.awayTeam.abbreviation) {
      gamePlayer.game.awayTeam.abbreviation = 'abbr';
    }
    if (gamePlayer.game && gamePlayer.game.homeTeam && !gamePlayer.game.homeTeam.fullName) {
      gamePlayer.game.homeTeam.fullName = gamePlayer.game.homeTeam.name;
    }
    if (gamePlayer.game && gamePlayer.game.awayTeam && !gamePlayer.game.awayTeam.fullName) {
      gamePlayer.game.awayTeam.fullName = gamePlayer.game.awayTeam.name;
    }
    if (gamePlayer.game && gamePlayer.game.league && !gamePlayer.game.league.abbreviation) {
      gamePlayer.game.league.abbreviation = 'abbr';
    }

    if (!!(gamePlayer.player.birthDate)) {
      gamePlayer.player.birthDate = DateTimeUtils.stringifyDate(gamePlayer.player.birthDate);
    }
    if (!!(gamePlayer.player.debut)) {
      gamePlayer.player.debut = DateTimeUtils.stringifyDate(gamePlayer.player.debut);
    }
  }

  checkValidation() {
    if (this.lineup.player.firstName.trim() === '') {
      this.validFirstName = false;
    } else {
      this.validFirstName = true;
    }
    if (this.lineup.player.lastName.trim() === '') {
      this.validLastName = false;
    } else {
      this.validLastName = true;
    }
    if (!(this.lineup.player.birthDate)) {
      this.validBirthDate = false;
    } else {
      this.validBirthDate = true;
    }
    if (this.lineup.player.height.trim() === '') {
      this.validHeight = false;
    } else {
      this.validHeight = true;
    }
    if (this.lineup.player.weight.trim() === '') {
      this.validWeight = false;
    } else {
      this.validWeight = true;
    }

    if (!this.validFirstName || !this.validLastName || !this.validBirthDate || !this.validHeight || !this.validWeight) {
      this.saving = false;
      return false;
    }
    return true;
  }

  remove() {
    this.saving = true;
    this.sportService.deleteGamePlayer(this.selectedLineup)
      .subscribe(this.onSuccess, this.onError);
  }

  closeConfirmationDialog() {
    this.showLineupConfirmation = false;
  }

  convertToDate(str: string) {
    return moment(str).toDate();
  }

  updateLineupValue(lineupValue) {
    this.lineup.lineup = lineupValue;
  }

  updatePositionValue(positionValue) {
    this.lineup.position = positionValue;
  }

  lineupToString(lineup) {
    if (lineup === 0) {
      return 'Starting';
    } else if (lineup === 1) {
      return 'Bench';
    } else if (lineup === 2) {
      return 'Bullpen';
    }
  }

  positionToString(position) {
    if (position) {
      return `${position.name} (${position.abbr})`;
    }

    return '';
  }

  private preparePastLineupData(entities, lineup) {
    this.pastGamePlayers = [];
    for (const player of entities.result) {
      const res = lineup.filter(p => p.player.id === player.player.id);
      if (res.length > 0) {
        player.isPlayerIncluded = true;
      } else {
        player.isPlayerIncluded = false;
      }
    }
    this.pastGamePlayers = entities.result;
    this.totalRecords = entities.totalRecords;
  }

  private preparePlayersAndGamePlayersData(entities) {
    const matchedPlayers = [];
    let lineup = this.homePlayersLineup;
    if (!this.isHomeTeamDisplay) {
      lineup = this.awayPlayersLineup;
    }
    if (entities && entities.length > 0) {
      for (const player of entities[0].result) {
        if (player['$type'] && player['$type'].indexOf('Baseball') === -1) {
          continue;
        }
        const p = {
          player: {
            id: '', iid: '', firstName: '', lastName: '', birthDate: '', name: '', height: '', weight: '',
            sport: {}
          },
          isPlayerIncluded: false
        };
        p.player.iid = player.iid;
        p.player.id = player.id;
        p.player.firstName = player.firstName;
        p.player.lastName = player.lastName;
        p.player.birthDate = player.birthDate;
        p.player.name = player.name;
        p.player.height = player.height;
        p.player.weight = player.weight;
        p.player.sport = player.sport;
        const res = lineup.filter(px => px.player.id === player.id);
        if (res.length > 0) {
          p.isPlayerIncluded = true;
        }
        matchedPlayers.push(p);
      }
      this.totalRecords = entities[0].totalRecords;
    }

    if (entities && entities.length > 1) {
      for (const player of entities[1].result) {
        const res = lineup.filter(p => p.player.id === player.player.id);
        if (res.length > 0) {
          player.isPlayerIncluded = true;
        }
        matchedPlayers.push(player);
      }
      this.totalRecords += entities[1].totalRecords;
    }
    this.matchedPlayers = matchedPlayers;
    // this.sortingMatchedPlayersAccordingCriteria(matchedPlayers);
  }

  /* tslint:disable */
  private sortingMatchedPlayersAccordingCriteria(matchedPlayers) {
    if (matchedPlayers && matchedPlayers.length > 0) {
      let sortA = matchedPlayers.filter(p => p.player.firstName === this.firstName
      && p.player.lastName === this.lastName
      && DateTimeUtils.stringifyDate(new Date(p.player.birthDate)) === DateTimeUtils.stringifyDate(this.birthDate));
      let sortB = matchedPlayers.filter(p => p.player.firstName !== this.firstName
      && p.player.lastName === this.lastName
      && DateTimeUtils.stringifyDate(new Date(p.player.birthDate)) === DateTimeUtils.stringifyDate(this.birthDate));
      let sortC = matchedPlayers.filter(p => p.player.firstName !== this.firstName
      && p.player.lastName === this.lastName
      && p.game
      && DateTimeUtils.stringifyDate(new Date(p.player.birthDate)) !== DateTimeUtils.stringifyDate(this.birthDate));
      let sortD = matchedPlayers.filter(p => p.player.firstName !== this.firstName
      && p.player.lastName === this.lastName
      && !(p.game)
      && DateTimeUtils.stringifyDate(new Date(p.player.birthDate)) !== DateTimeUtils.stringifyDate(this.birthDate));
      this.matchedPlayers = [];
      this.matchedPlayers.push(...sortA);
      this.matchedPlayers.push(...sortB);
      this.matchedPlayers.push(...sortC);
      this.matchedPlayers.push(...sortD);
    }
  }

  private createEmptyLineupFromCurrentGame(isHome) {
    return {
      isHome: isHome,
      batOrder: 0,
      lineup: 0,
      number: 0,
      position: undefined,
      game: {
        awayTeam: Object.assign({}, this.game.awayTeam),
        competition: Object.assign({}, this.game.competition),
        date: this.game.date,
        homeTeam: Object.assign({}, this.game.homeTeam),
        league: Object.assign({}, this.game.league),
        season: Object.assign({}, this.game.season),
        id: this.game.id,
        iid: this.game.iid
      },
      sport: Object.assign({}, this.game.sport),
      player: {
        id: '',
        firstName: '',
        lastName: '',
        birthDate: undefined,
        birthPlace: '',
        college: '',
        debut: undefined,
        height: '',
        weight: '',
        status: '',
        sport: Object.assign({}, this.game.sport)
      }
    };
  }

  private onSuccess = (res) => {
    if (res && res.errors && res.errors.length > 0) {
      for (let errText of res.errors) {
        this.error += errText + '\n';
      }
      this.saving = false;
      return;
    }
    this.saving = false;
    this.displayDialog = false;
    this.load();
  };

  private onError = (err) => {
    this.error = 'Cannot save Lineup';
    if (err && err.errors && err.errors.length > 0) {
      for (let errText of err.errors) {
        this.error += errText + '\n';
      }
      this.saving = false;
      return;
    }
    console.log(err);
    this.saving = false;
  };

  private confirmDelete(gamePlayer) {
    this.confirmationService.confirm({
      message: 'Do you want to remove this player from lineup?',
      header: 'Remove Confirmation',
      icon: 'fa fa-trash',
      accept: () => {
        this.sportService.deleteGamePlayer(gamePlayer).subscribe(
          () => {
            this.notificationService.showSuccess('Game player removed from lineup!');
            this.load();
          },
          err => this.notificationService.showError('Cannot remove game player from lineup', err.toString())
        );
      }
    });
  }
}
