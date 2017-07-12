import { Filter } from './fitler';
import { FilterUtils } from './utils/filter-utils';

describe('Filter', () => {

  it('Empty Paging filter', () => {
    const filter = Filter.fromPaging(null, null);
    const params = filter.getParams();
    expect(params.get('skip')).toEqual('0');
    expect(params.get('take')).toEqual('100');
  });

  it('Paging filter', () => {
    const filter = Filter.fromPaging(2, 10);
    const params = filter.getParams();
    expect(params.get('skip')).toEqual('10');
    expect(params.get('take')).toEqual('10');
  });

  it('Empty GamePlayers filter', () => {
    const filter = Filter.createByType({}, 'gameplayer');
    const params = filter.getParams();
    expect(filter.entityId).toBeUndefined();
    expect(params.get('skip')).toBeUndefined();
    expect(params.get('take')).toBeUndefined();
  });

  it('GamePlayers filter', () => {
    const filter = Filter.createByType({ id: 'gameId' }, 'gameplayer');
    const params = filter.getParams();
    expect(filter.entityId).toEqual('gameId');
    expect(params.get('skip')).toBeUndefined();
    expect(params.get('take')).toBeUndefined();
  });

  it('Empty Payroll Filter', () => {
    const filter = Filter.createByType({}, 'payrollFilter');
    const params = filter.getParams();
    expect(params.get('skip')).toEqual('0');
    expect(params.get('take')).toEqual('100');
  });

  it('Paging Payroll Filter', () => {
    const filter = Filter.createByType({page: 3, size: 20}, 'payrollFilter');
    const params = filter.getParams();
    expect(params.get('skip')).toEqual('40');
    expect(params.get('take')).toEqual('20');
  });

  it('Full Payroll Filter', () => {
    const filterParams = {
      sportId: 'sport',
      leagueId: 'league',
      competitionId: 'competition',
      phase: 'phase',
      loggerIds: ['logger1', 'logger2'],
      page: 4,
      size: 5,
      orderBy: 'game',
      payrollPeriodId: 7,
      sort: 'note_zero'
    };
    const searchParams = FilterUtils.createSearchParams(filterParams);
    const filter = Filter.createByType(searchParams, 'payrollFilter');
    const params = filter.getParams();
    expect(params.get('sportid')).toEqual('sport');
    expect(params.get('leagueid')).toEqual('league');
    expect(params.get('competitionId')).toEqual('competition');
    expect(params.get('phase')).toEqual('phase');
    expect(params.get('loggerIds[0]')).toEqual('logger1');
    expect(params.get('loggerIds[1]')).toEqual('logger2');
    expect(params.get('orderBy')).toEqual('game');
    expect(params.get('payrollPeriodId')).toEqual('7');
    expect(params.get('skip')).toEqual('15');
    expect(params.get('take')).toEqual('5');
    expect(params.get('sort')).toEqual('note_zero');
  });

});
