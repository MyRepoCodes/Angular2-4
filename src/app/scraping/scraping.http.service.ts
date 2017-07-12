import { Injectable } from '@angular/core';
import { ApiService } from '../shared/api/api.service';
import { Filter } from '../shared/fitler';
import { Observable } from 'rxjs/Rx';
import { URLSearchParams, RequestMethod, RequestOptions } from '@angular/http';
import { Paging } from '../shared/paging.model';
import { DateTimeUtils } from '../shared/utils/datetime-utils';

export enum ScrappedItemStatus {
  Resync,
  CreateNew,
  Ignore
}

export interface RulesSearchObject {
  entity: string;
  leagueIid: number;
  sport: string | number;
  mrs: any[];
  scraperUrl: string;
}

export interface ConflictsSearchObject extends RulesSearchObject {
  scraperId: string;
  scraperUrl: string;
  statuses: string[];
  dss: any[];
}

class ScrapingUrls {

  private static urlSegmentMap = {
    'Player': 'players',
    'Game': 'games',
    'GameLineup': 'gameplayers',
    'Team': 'teams'
  };

  public static RULES = '/scraped/api/rules';
  public static RULES_SEARCH = `${ScrapingUrls.RULES}/search`;
  public static ENTITY_ENDPOINTS_SEARCH = `${ScrapingUrls.RULES}/entityendpoint/search`;

  public static conflictSearchFor = (entityType: string) => `/scraped/api/baseball/${ScrapingUrls.urlSegmentMap[entityType]}/search`;
  public static scrapersFor = (entityType: string) => `/scraped/api/baseball/${ScrapingUrls.urlSegmentMap[entityType]}/scrapers`;
  public static ignoreFor = (entityType: string) => `/scraped/api/baseball/${ScrapingUrls.urlSegmentMap[entityType]}/ignore`;
  public static resyncFor = (entityType: string) => `/scraped/api/baseball/${ScrapingUrls.urlSegmentMap[entityType]}/resync`;
  public static createNewFor = (entityType: string) => `/scraped/api/baseball/${ScrapingUrls.urlSegmentMap[entityType]}/resyncCreateNew`;

  public static suggestinsFor = (entityType: string) =>
    `/scraped/api/baseball/${ScrapingUrls.urlSegmentMap[entityType]}/resolve`;

  public static bulkResyncFor = (entityType: string) =>
    `/scraped/api/baseball/${ScrapingUrls.urlSegmentMap[entityType]}/bulkresync`;
}

@Injectable()
export class ScrapingHttpService {

  private emptyResult = Observable.of({ result: [], totalRecords: 0 });

  constructor(
    private api: ApiService
  ) {

  }

  getRules(searchObject: RulesSearchObject, paging: Paging) {
    const filter = Filter.fromPaging(paging.page, paging.size);

    Object.keys(searchObject)
      .filter(key => key !== 'mrs')
      .forEach(key => {
        if (searchObject[key]) {
          filter.add(key, searchObject[key]);
        }
      });

    if (searchObject.mrs) {
      searchObject.mrs.forEach((d, i) => {

        if (d.type === 'date' && (typeof d.value !== 'string')) {
          const dateArray = DateTimeUtils.CreateDateTimeArray(d.value);
          d.value = DateTimeUtils.CreateServerDateStringWithoutTimeFromArray(dateArray);
        }

        filter.add(`mrs[${i}].Field`, d.field);
        filter.add(`mrs[${i}].Value`, d.value);
        filter.add(`mrs[${i}].Operator`, d.op);
      });
    }

    return this.api.searchEntities(ScrapingUrls.RULES_SEARCH, filter.getParams())
      .catch(err => this.emptyResult);
  }

  putRule(item) {
    return this.api.putEntity(ScrapingUrls.RULES, '', item)
      .do(res => {
        if (res.failed) {
          throw new Error('Could not update rule.');
        }
      });
  }

  postRule(item) {
    return this.api.postEntity(ScrapingUrls.RULES, item)
      .do(res => {
        if (res.failed) {
          throw new Error('Could not create rule.');
        }
      });
  }

  deleteRule(item) {
    return this.api.deleteEntity(ScrapingUrls.RULES, item.id);
  }

  getScrapers(entityType: string) {
    const url = ScrapingUrls.scrapersFor(entityType);
    return this.api.searchEntities(url);
  }

  getConflicts(entityType: string, searchObject: ConflictsSearchObject, paging: Paging) {
    const url = ScrapingUrls.conflictSearchFor(entityType);
    const filter = Filter.fromPaging(paging.page, paging.size);

    Object.keys(searchObject)
      .filter(key => key !== 'dss')
      .filter(key => key !== 'statuses')
      .forEach(key => {
        if (searchObject[key]) {
          filter.add(key, searchObject[key]);
        }
      });

    if (searchObject.statuses) {
      searchObject.statuses.forEach((status, i) => {
        filter.add(`status[${i}]`, status);
      });
    }

    if (searchObject.dss) {
      searchObject.dss.forEach((d, i) => {

        if (d.type === 'date' && (typeof d.value !== 'string')) {
          const dateArray = DateTimeUtils.CreateDateTimeArray(d.value);
          d.value = DateTimeUtils.CreateServerDateStringWithoutTimeFromArray(dateArray);
        }

        if (d.type === 'datetime' && (typeof d.value !== 'string')) {
          const dateArray = DateTimeUtils.CreateDateTimeArray(d.value);
          d.value = DateTimeUtils.CreateServerDateStringWithTimeFromArray(dateArray);
        }

        filter.add(`dss[${i}].Field`, d.field);
        filter.add(`dss[${i}].Value`, d.value);
        filter.add(`dss[${i}].Operator`, d.op);
      });
    }

    return this.api.searchEntities(url, filter.getParams());
  }

  bulkResync(entityType: string, params) {
    const url = ScrapingUrls.bulkResyncFor(entityType);
    const searchParams = new URLSearchParams();

    Object.keys(params)
      .forEach(key => {
        if (params[key]) {
          searchParams.append(key, params[key]);
        }
      });

    return this.api.request(
      new RequestOptions({
        method: RequestMethod.Put,
        search: searchParams,
        url: url
      })
    );
  }

  getResolution(entityType: string, entityId: string) {
    return this.api.getEntityById(ScrapingUrls.suggestinsFor(entityType), entityId);
  }

  updateScrappedItemStatus(entityType: string, status: ScrappedItemStatus, entityId, message?) {

    let url;

    switch (status) {
      case ScrappedItemStatus.CreateNew:
        url = ScrapingUrls.createNewFor(entityType);
        break;
      case ScrappedItemStatus.Ignore:
        url = ScrapingUrls.ignoreFor(entityType);
        break;
      default:
        url = ScrapingUrls.resyncFor(entityType);
        break;
    }

    const searchParams: URLSearchParams = new URLSearchParams();
    searchParams.append('scrapingId', entityId);
    if (message) {
      searchParams.append('message', message);
    }

    return this.api.request(
      new RequestOptions({
        method: RequestMethod.Put,
        search: searchParams,
        url: url
      })
    );
  }

  getEntityEndpoints() {
    const filter = new Filter();
    filter.add('entity', 'Team');
    filter.add('sport', 'Baseball');

    return this.api.searchEntities(ScrapingUrls.ENTITY_ENDPOINTS_SEARCH, filter.getParams());
  }

}
