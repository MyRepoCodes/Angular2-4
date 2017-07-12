import { Pagination } from './paginator.model';
import { DateTimeUtils } from './utils/datetime-utils';

export enum FilterType {
  EntityFilter,
  ParamFilter
}

export const FILTER_CREATED = 'CREATED';
export const FILTER_SELECTION_CHANGED = 'FILTER_SELECTION_CHANGED';

export const filterSettings = {
  sportId: { name: 'sportid', propertyName: 'id' },
  sportName: { name: 'sportname', propertyName: 'name' },
  leagueId: { name: 'leagueid', propertyName: 'id' },
  divisionId: { name: 'divisionid', propertyName: 'id' },
  conferenceId: { name: 'conferenceid', propertyName: 'id' },
  beginDate: { name: 'beginDate', propertyName: 'id' },
  endDate: { name: 'endDate', propertyName: 'id' },
  date: { name: 'date', propertyName: 'id' },
  dueDate: { name: 'dueDate', propertyName: 'id' },
  start: { name: 'start', propertyName: 'id' },
  end: { name: 'end', propertyName: 'id' },
  skip: { name: 'skip', propertyName: 'id' },
  take: { name: 'take', propertyName: 'id' },
  leagueIds: { name: 'leagueIds', propertyName: 'id' },
  divisionIds: { name: 'divisionIds', propertyName: 'id' },
  conferenceIds: { name: 'conferenceIds', propertyName: 'id' },
  teamIds: { name: 'teamIds', propertyName: 'id' },
  seasonIds: { name: 'seasonIds', propertyName: 'id' },
  competitionId: { name: 'competitionId', propertyName: 'id' },
  competitionIds: { name: 'competitionIds', propertyName: 'id' },
  phase: { name: 'phase', propertyName: 'id' },
  orderBy: { name: 'orderBy', propertyName: 'id' },
  payrollPeriodId: { name: 'payrollPeriodId', propertyName: 'id' },
  generationTime: { name: 'generationTime', propertyName: 'id' },
  loggerId: { name: 'loggerId', propertyName: 'id' },
  loggerIds: { name: 'loggerIds', propertyName: 'id' },
  sort: { name: 'sort', propertyName: 'id' },
  jobType: { name: 'jobType', propertyName: 'id' },
  jobStatusIds: { name: 'jobStatus', propertyName: 'id' },
  lineup: { name: 'lineup', propertyName: 'id' },
  dateInterval: { name: 'dateInterval', propertyName: 'id' },
  gameOwner: { name: 'gameOwner', propertyName: 'id' },
  videoSourcesIds: { name: 'videoSourcesIds', propertyName: 'id' },
  sortField: { name: 'sortField', propertyName: 'id' },
  sortOrder: { name: 'sortOrder', propertyName: 'id' },
  /*name: { name: 'name', propertyName: 'id' },
  missionId: { name: 'missionId', propertyName: 'id' },
  priority: { name: 'priority', propertyName: 'id' },
  p1LoggerIds: { name: 'p1LoggerIds', propertyName: 'id'},
  p2LoggerIds: { name: 'p2LoggerIds', propertyName: 'id'},
  p3LoggerIds: { name: 'p3LoggerIds', propertyName: 'id'},
  serverIds: { name: 'serverIds', propertyName : 'id'},
  missionStatusIds: { name: 'missionStatusIds', propertyName: 'id' },
  homeTeamIds: { name: 'homeTeamIds', propertyName: 'id' },
  awayTeamIds: { name: 'awayTeamIds', propertyName: 'id' }*/
};

export const createParamFilter = (type, value) => {
  const settings = filterSettings[type];
  settings.type = type;
  return ParamFilter.create(settings, value);
};

export const createArrayParamFilter = (type, values) => {
  const settings = filterSettings[type];
  settings.type = type;
  return ArrayParamFilter.create(settings, values);
};

export class ParamFilter {
  type: string;
  name: string;
  propertyName: string;
  propertyValue: any;

  static create(settings: any, value: any) {
    const filter = new ParamFilter();
    filter.name = settings.name;
    filter.type = settings.type;
    filter.propertyName = settings.propertyName;
    filter.propertyValue = value;
    return filter;
  }
}

export class ArrayParamFilter {
  type: string;
  name: string;
  propertyName: string;
  propertyValues: any[];

  static create(settings: any, values: any[]) {
    const filter = new ArrayParamFilter();
    filter.name = settings.name;
    filter.type = settings.type;
    filter.propertyName = settings.propertyName;
    filter.propertyValues = values;
    return filter;
  }
}

export class Filter {
  public entityId: string;
  public skip: number;
  public take: number;
  public optional: (ParamFilter | ArrayParamFilter)[];

  private params: Map<string, string>;

  static create(entityId?: string): Filter {
    return new Filter(entityId);
  }

  static createByType(filterState: any, type: string, noPaging?: boolean) {
    switch (type) {
      case 'sport':
        return Filter.fromPaging(filterState.paging.page, filterState.paging.size);
      case 'league':
        return Filter.fromPagingWithEntity(filterState.sport.id, filterState.paging.page, filterState.paging.size);
      case 'division':
        return Filter.fromPagingWithEntity(filterState.league.id, filterState.paging.page, filterState.paging.size);
      case 'getByEntitiesByLeaguesGameTracker':
        const getEntitiesParamFilter = createArrayParamFilter('leagueIds',
          filterState.league.selected.length > 0 ? filterState.league.selected : null);
        let entitiesFilterGameTracker;
        if (noPaging) {
          entitiesFilterGameTracker = Filter.fromPaging(0, 512);
        } else {
          entitiesFilterGameTracker = Filter.fromPaging(filterState.paging.page, filterState.paging.size);
        }
        entitiesFilterGameTracker.optional = [getEntitiesParamFilter];
        return entitiesFilterGameTracker;
      case 'competition':
        return Filter.fromPagingWithEntity(filterState.league.id, filterState.paging.page, filterState.paging.size);
      case 'season':
        return Filter.fromPagingWithEntity(filterState.league.id, filterState.paging.page, filterState.paging.size);
      case 'conference':
        return Filter.fromPaging(filterState.paging.page, filterState.paging.size);
      case 'player':
        return Filter.fromPagingWithEntity(filterState.team.id, filterState.paging.page, filterState.paging.size);
      case 'gameplayer':
        return Filter.create(filterState.id);
      case 'atbatevent':
        return Filter.fromPagingWithEntity(filterState.game.id, filterState.paging.page, 100);
      case 'actionevent':
        return Filter.fromPagingWithEntity(filterState.game.id, filterState.paging.page, 100);
      case 'team':
        const sportParamFilter = createParamFilter('sportId', filterState.sport.id);
        const leagueParamFilter = createParamFilter('leagueId', filterState.league.id);
        const divisionParamFilter = createParamFilter('divisionId', filterState.division.id);
        const conferenceParamFilter = createParamFilter('conferenceId', filterState.conference.id);
        let teamFilter;
        if (noPaging) {
          teamFilter = Filter.fromPaging(0, 100);
        } else {
          teamFilter = Filter.fromPaging(filterState.paging.page, filterState.paging.size);
        }
        teamFilter.optional = [sportParamFilter, leagueParamFilter, divisionParamFilter, conferenceParamFilter];
        return teamFilter;
      case 'teamGameTracker':
        const sportGameTrackerParamFilter = createParamFilter('sportId',
          filterState.sport.id);
        const leagueGameTrackerParamFilter = createArrayParamFilter('leagueIds',
          filterState.league.selected.length > 0 ? filterState.league.selected : null);
        const divisionGameTrackerParamFilter = createArrayParamFilter('divisionIds',
          filterState.division.selected.length > 0 ? filterState.division.selected : null);
        const conferenceGameTrackerParamFilter = createArrayParamFilter('conferenceIds',
          filterState.conference.selected.length > 0 ? filterState.conference.selected : null);
        let teamFilterGameTracker;
        if (noPaging) {
          teamFilterGameTracker = Filter.fromPaging(0, 100);
        } else {
          teamFilterGameTracker = Filter.fromPaging(filterState.paging.page, filterState.paging.size);
        }
        teamFilterGameTracker.optional = [sportGameTrackerParamFilter, leagueGameTrackerParamFilter,
          divisionGameTrackerParamFilter, conferenceGameTrackerParamFilter];
        return teamFilterGameTracker;
      case 'teamsByMultipleParams':
        const sportParamsFilter = createParamFilter('sportId', filterState.sport);
        const leagueParamsFilter = createArrayParamFilter('leagueIds', filterState.leagues);
        const conferenceParamsFilter = createArrayParamFilter('conferenceIds', filterState.conferences);
        const divisionParamsFilter = createArrayParamFilter('divisionIds', filterState.divisions);
        let teamParamsFilter;
        if (noPaging) {
          teamParamsFilter = Filter.fromPaging(0, 100);
        } else {
          teamParamsFilter = Filter.fromPaging(filterState.paging.page, filterState.paging.size);
        }
        teamParamsFilter.optional = [sportParamsFilter, leagueParamsFilter, conferenceParamsFilter,
          divisionParamsFilter];
        return teamParamsFilter;
      case 'gameTrackers':
        const sportFilter = createParamFilter('sportId', filterState.sport);
        const leagueFilter = createArrayParamFilter('leagueIds', filterState.leagues);
        const divisionFilter = createArrayParamFilter('divisionIds', filterState.divisions);
        const conferenceFilter = createArrayParamFilter('conferenceIds', filterState.conferences);
        const teamsFilter = createArrayParamFilter('teamIds', filterState.teams);
        const competitionFilter = createArrayParamFilter('competitionIds', filterState.competitions);
        const seasonFilter = createArrayParamFilter('seasonIds', filterState.seasons);
        const jobTypeFilter = createParamFilter('jobType', filterState.jobType);
        const jobStatusFilter = createArrayParamFilter('jobStatusIds', filterState.jobStatuses);
        const lineupFilter = createParamFilter('lineup', filterState.lineup);
        const gameOwnerFilter = createParamFilter('gameOwner', filterState.gameOwner);
        const videoSourcesFilter = createArrayParamFilter('videoSourcesIds', filterState.videoSources);
        const beginDateFilter = createParamFilter('beginDate', filterState.from);
        const endDateFilter = createParamFilter('endDate', filterState.to);
        const dateIntervalFilter = createParamFilter('dateInterval', filterState.dateInterval);
        const sortFieldFilter = createParamFilter('sortField', filterState.sort.field);
        const sortOrderFilter = createParamFilter('sortOrder', filterState.sort.order);

        const gameTrackerFilter = Filter.fromPaging(filterState.paging.page, filterState.paging.size);
        gameTrackerFilter.optional = [sportFilter, leagueFilter, conferenceFilter, divisionFilter, teamsFilter,
          competitionFilter, seasonFilter, jobTypeFilter, jobStatusFilter, lineupFilter, gameOwnerFilter,
          videoSourcesFilter, beginDateFilter, endDateFilter, dateIntervalFilter, sortFieldFilter, sortOrderFilter];

        return gameTrackerFilter;
      case 'game':
        // todo: rename variables
        const sport = createParamFilter('sportId', filterState.sport.id);
        const leagues = createArrayParamFilter('leagueIds',
          filterState.league.selected.length > 0 ? filterState.league.selected : null);
        const divisions = createArrayParamFilter('divisionIds',
          filterState.division.selected.length > 0 ? filterState.division.selected : null);
        const conferences = createArrayParamFilter('conferenceIds',
          filterState.conference.selected.length > 0 ? filterState.conference.selected : null);
        const seasons = createArrayParamFilter('seasonIds',
          filterState.season.selected.length > 0 ? filterState.season.selected : null);
        const competitions = createArrayParamFilter('competitionIds',
          filterState.competition.selected.length > 0 ? filterState.competition.selected : null);
        const teams = createArrayParamFilter('teamIds',
          filterState.team.selected.length > 0 ? filterState.team.selected : null);
        /*const homeTeams = createArrayParamFilter('homeTeamIds',
          filterState.homeTeam.selected.length > 0 ? filterState.homeTeam.selected : null);
        const awayTeams = createArrayParamFilter('awayTeamIds',
          filterState.awayTeam.selected.length > 0 ? filterState.awayTeam.selected : null);*/
        let beginDate;
        let endDate;
        /*let date;
        let dueDate;*/
        let sortField;
        let sortOrder;
        /*let nameFilter, missionId, priority, p1Logger, p2Logger, p3Logger, server, missionStatus;
        if (filterState.server) {
          server = createArrayParamFilter('serverIds',
            filterState.server.selected.length > 0 ? filterState.server.selected : null);
        }
        if (filterState.missionStatus) {
          missionStatus = createArrayParamFilter('missionStatusIds',
            filterState.missionStatus.length > 0 ? filterState.missionStatus : null);
        }
        if (filterState.name && filterState.name.name) {
          nameFilter = createParamFilter('name', filterState.name.name);
        }
        if (filterState.name && filterState.name.missionId) {
          missionId = createParamFilter('missionId', filterState.name.missionId);
        }
        if (filterState.name && filterState.name.priority) {
          priority = createParamFilter('priority', filterState.name.priority);
        }
        if (filterState.p1Logger) {
          p1Logger = createArrayParamFilter('p1LoggerIds',
            filterState.p1Logger.selected.length > 0 ? filterState.p1Logger.selected : null);
        }
        if (filterState.p2Logger) {
          p2Logger = createArrayParamFilter('p2LoggerIds',
            filterState.p2Logger.selected.length > 0 ? filterState.p2Logger.selected : null);
        }
        if (filterState.p3Logger) {
          p3Logger = createArrayParamFilter('p3LoggerIds',
            filterState.p3Logger.selected.length > 0 ? filterState.p3Logger.selected : null);
        }*/
        if (filterState.sort && filterState.sort.field) {
          sortField = createParamFilter('sortField', filterState.sort.field);
        }
        if (filterState.sort && filterState.sort.order) {
          sortOrder = createParamFilter('sortOrder', filterState.sort.order);
        }
        if (filterState.from) {
          beginDate = createParamFilter('beginDate', filterState.from);
        }
        if (filterState.to) {
          endDate = createParamFilter('endDate', filterState.to);
        }
        /*if (filterState.date) {
          date = createParamFilter('date', filterState.date);
        }
        if (filterState.dueDate) {
          dueDate = createParamFilter('dueDate', filterState.dueDate);
        }*/
        let jobType, jobStatus, lineup, dateInterval, gameOwner, videoSources;
        if (filterState.jobType) {
          jobType = createParamFilter('jobType', filterState.jobType);
        }
        if (filterState.jobStatus) {
          jobStatus = createArrayParamFilter('jobStatusIds', filterState.jobStatus);
        }
        if (filterState.lineup) {
          lineup = createParamFilter('lineup', filterState.lineup);
        }
        if (filterState.dateInterval) {
          dateInterval = createParamFilter('dateInterval', filterState.dateInterval);
        }
        if (filterState.gameOwner) {
          gameOwner = createParamFilter('gameOwner', filterState.gameOwner);
        }
        if (filterState.videoSources) {
          videoSources = createArrayParamFilter('videoSourcesIds', filterState.videoSources);
        }
        const gameFilter = Filter.fromPaging(filterState.paging.page, filterState.paging.size);
        gameFilter.optional = [sport, leagues, divisions, conferences, seasons, competitions, teams];
        /*if (nameFilter) {
          gameFilter.optional.push(nameFilter);
        }
        if (missionId) {
          gameFilter.optional.push(missionId);
        }
        if (priority) {
          gameFilter.optional.push(priority);
        }
        if (server) {
          gameFilter.optional.push(server);
        }
        if (missionStatus) {
          gameFilter.optional.push(missionStatus);
        }
        if (p1Logger) {
          gameFilter.optional.push(p1Logger);
        }
        if (p2Logger) {
          gameFilter.optional.push(p2Logger);
        }
        if (p3Logger) {
          gameFilter.optional.push(p3Logger);
        }*/
        if (sortField) {
          gameFilter.optional.push(sortField);
        }
        if (sortOrder) {
          gameFilter.optional.push(sortOrder);
        }
        if (beginDate) {
          gameFilter.optional.push(beginDate);
        }
        if (endDate) {
          gameFilter.optional.push(endDate);
        }
        /*if (date) {
          gameFilter.optional.push(date);
        }
        if (dueDate) {
          gameFilter.optional.push(dueDate);
        }*/
        if (jobType) {
          gameFilter.optional.push(jobType);
        }
        if (jobStatus) {
          gameFilter.optional.push(jobStatus);
        }
        if (lineup) {
          gameFilter.optional.push(lineup);
        }
        if (dateInterval) {
          gameFilter.optional.push(dateInterval);
        }
        if (gameOwner) {
          gameFilter.optional.push(gameOwner);
        }
        if (videoSources) {
          gameFilter.optional.push(videoSources);
        }
        return gameFilter;
      case 'venue':
        return Filter.fromPagingWithEntity(filterState.sport.id, filterState.paging.page, filterState.paging.size);
      case 'pga':
        const pgaSport = createParamFilter('sportId', filterState.sport.id);
        const pgaLeagues = createArrayParamFilter('leagueIds', filterState.leagues.selected);
        const pgaCompetition = createParamFilter('competitionId', filterState.competition.id);
        const pgaPhase = createParamFilter('phase', filterState.phase.id);
        let pgaBeginDate;
        let pgaEndDate;
        if (filterState.from) {
          pgaBeginDate = createParamFilter('start', DateTimeUtils.CalendarDateToApiDate(filterState.from));
        }
        if (filterState.to) {
          pgaEndDate = createParamFilter('end', DateTimeUtils.CalendarDateToApiDate(filterState.to));
        }
        const pgaFilter = Filter.fromPaging(filterState.paging.page, filterState.paging.size);

        pgaFilter.optional = [pgaSport, pgaLeagues, pgaCompetition, pgaPhase];
        if (pgaBeginDate) {
          pgaFilter.optional.push(pgaBeginDate);
        }
        if (pgaEndDate) {
          pgaFilter.optional.push(pgaEndDate);
        }
        return pgaFilter;
      case 'payrollFilter':
        const payrollFilter = Filter.fromPaging(filterState.page, filterState.size);
        payrollFilter.optional = [
          createParamFilter('sportId', filterState.sportId),
          createParamFilter('leagueId', filterState.leagueId),
          createParamFilter('competitionId', filterState.competitionId),
          createParamFilter('phase', filterState.phase),
          createParamFilter('orderBy', filterState.orderBy),
          createParamFilter('payrollPeriodId', filterState.payrollPeriodId),
          createParamFilter('generationTime', filterState.generationTime),
          createArrayParamFilter('loggerIds', filterState.loggerIds),
          createParamFilter('sort', filterState.sort)
        ];
        return payrollFilter;
      default:
        throw new Error('unexpected filter type');
    }
  }

  static fromPagination(p: Pagination): Filter {
    const take = p.size;
    const skip = p.size * (p.page - 1);
    return new SkipTakeFilter(skip, take);
  }

  static fromPaging(page: number, size: number) {
    if (!page) {
      page = 1;
    }
    if (!size) {
      size = 100;
    }
    return new SkipTakeFilter((page - 1) * size, size);
  }

  static fromPagingWithEntity(entityId: string, page: number, size: number) {
    return new EntitySkipTakeFilter(entityId, (page - 1) * size, size);
  }

  constructor(entityId?: string) {
    this.params = new Map<string, string>();
    this.optional = [];
    this.entityId = entityId;
  }

  add(key, value) {
    this.params.set(key, value);
  }

  getParams(skipPaging = false): Map<string, string> {
    if (!skipPaging && this.skip !== undefined && this.take !== undefined) {
      this.params.set('skip', this.skip.toString());
      this.params.set('take', this.take.toString());
    }

    if (this.optional && this.optional.length) {
      this.optional.forEach(opt => {
        // todo: Ids is workaround for now. need to refactor this.
        if (opt.type.endsWith('Ids')) {
          const apf = <ArrayParamFilter>opt;
          if (apf.propertyValues && apf.propertyValues.length) {
            let index = 0;
            for (const value of apf.propertyValues) {
              if (value) {
                this.params.set(`${apf.name}[${index}]`, value);
                index++;
              }
            }
          }
        } else {
          const f = <ParamFilter>opt;
          if (!!f.propertyValue) {
            this.params.set(f.name, f.propertyValue.toString());
          }
        }

      });
    }

    return this.params;
  }
}

class SkipTakeFilter extends Filter {
  constructor(skip: number, take: number) {
    super();
    this.skip = skip;
    this.take = take;
  }
}

class EntitySkipTakeFilter extends Filter {
  constructor(entityId: string, skip: number, take: number) {
    super();
    this.entityId = entityId;
    this.skip = skip;
    this.take = take;
  }
}
