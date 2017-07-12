import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpSportService } from '../shared/services/sport.service';
import { SelectItem } from 'primeng/primeng';
import { ScrapingHttpService } from './scraping.http.service';
import { NotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'sn-scraping-filter',
  templateUrl: 'scraping-filter.component.html'
})
export class ScrapingFilterComponent implements OnInit {

  @Output() change = new EventEmitter();

  public get value() {
    return {
      entity: this.selectedEntityType,
      leagueIid: this.selectedLeague,
      sport: this.selectedSport,
      scraperUrl: this.selectedScraperUrl,
      leagueId: this.leagueId
    };
  }

  entityTypeOptions: SelectItem[] = [
    { label: 'Player', value: 'Player' },
    { label: 'Game', value: 'Game' },
    { label: 'Game Lineup', value: 'GameLineup' },
    { label: 'Team', value: 'Team' }
  ];

  sportOptions = [];
  leagueOptions = [];
  scraperUrlOptions: SelectItem[] = [];

  selectedScraperUrl = '';
  selectedEntityType = 'Player';
  selectedSport = 2;
  selectedLeague = 90;

  leagueId = '58248a3d35be47a927412839';

  constructor(
    private sportService: HttpSportService,
    private scrapingService: ScrapingHttpService,
    private notifications: NotificationService
  ) {
  }

  ngOnInit() {
    this.sportService.getSports()
      .map(res => res.result)
      .map(sports =>
        sports.map(sport => {
          return { label: sport.name, value: sport.iid, id: sport.id }; // probably not a good place to store the ID, but I
                                                                        // didn't want to introduce another state for this
        })
      )
      .mergeMap(
        sportOptions => {
          let selectedSportId;
          const selectedSport = sportOptions.find(option => option.value === this.selectedSport);
          if (selectedSport) {
            selectedSportId = selectedSport.id;
          }
          return this.sportService.getLeagues(selectedSportId || this.selectedSport)
            .map(res => res.result)
            .map(leagues =>
              leagues.map(league => {
                return { label: league.name, value: league.iid, id: league.id };
              })
            );
        },
        (sportOptions, leagueOptions) => ({ sportOptions, leagueOptions })
      )
      .mergeMap(
        res => {
          return this.scrapingService.getScrapers(this.selectedEntityType)
            .map(result => {
              const scraperUrls = [];
              scraperUrls.push({ label: 'NO URL', value: '' });
              for (const scraper of result) {
                for (const url of scraper.scraperUrls) {
                  if (url && scraperUrls.indexOf(url) === -1) {
                    scraperUrls.push({ label: url, value: url });
                  }
                }
              }
              return scraperUrls;
            });
        },
        (res, scrapersUrls) => ({
          sportOptions: res.sportOptions,
          leagueOptions: res.leagueOptions,
          scraperUrls: scrapersUrls
        })
      )
      .subscribe(res => {
        this.sportOptions = res.sportOptions;
        this.leagueOptions = res.leagueOptions;
        this.scraperUrlOptions = res.scraperUrls;
      }, err => {
        this.notifications.showError('Error', err.message);
      });

    // this.getSportOptions();
    // this.getLeagueOptions();
    this.onChange();
  }

  onSportChange() {
    this.getLeagueOptions();
    this.onChange();
  }

  onEntityTypeChange() {
    this.loadScrapersUrls();
    this.onChange();
  }

  onLeagueChange() {
    const selectedLeagueOption = this.leagueOptions.find(option => option.value === this.selectedLeague);
    if (selectedLeagueOption) {
      this.leagueId = selectedLeagueOption.id;
    }
    this.onChange();
  }

  onChange() {
    this.change.emit(this.value);
  }

  getSportOptions() {
    this.sportService.getSports()
      .map(res => res.result)
      .map(sports =>
        sports.map(sport => {
          return { label: sport.name, value: sport.iid, id: sport.id }; // probably not a good place to store the ID, but I
                                                                        // didn't want to introduce another state for this
        })
      )
      .subscribe(sportOptions => this.sportOptions = sportOptions);
  }

  getLeagueOptions() {
    let selectedSportId;
    const selectedSport = this.sportOptions.find(option => option.value === this.selectedSport);
    if (selectedSport) {
      selectedSportId = selectedSport.id;
    }
    this.sportService.getLeagues(selectedSportId || this.selectedSport)
      .map(res => res.result)
      .map(leagues =>
        leagues.map(league => {
          return { label: league.name, value: league.iid, id: league.id };
        })
      )
      .subscribe(leagueOptions => this.leagueOptions = leagueOptions);
  }

  loadScrapersUrls() {
    this.scrapingService.getScrapers(this.selectedEntityType)
      .map(result => {
        const scraperUrls = [];
        scraperUrls.push({ label: 'NO URL', value: '' });
        for (const scraper of result) {
          for (const url of scraper.scraperUrls) {
            if (url && scraperUrls.indexOf(url) === -1) {
              scraperUrls.push({ label: url, value: url });
            }
          }
        }
        return scraperUrls;
      })
      .subscribe(res => {
        this.scraperUrlOptions = res;
      });
  }

}
