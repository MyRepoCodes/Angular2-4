/* Sport API */
export const API_USERS_URL = '/Security/api/users';
export const API_COMPETITIONS_URL = '/Sport/api/competitions';
export const API_LEAGUES_URL = '/Sport/api/leagues';
export const API_DIVISIONS_URL = '/Sport/api/divisions';
export const API_DIVISIONS_SEARCH_URL = `${API_DIVISIONS_URL}/search`;
export const API_TEAMS_URL = '/Sport/api/teams';
export const API_TEAMS_SEARCH_URL = '/Sport/api/teams/search';
export const API_TEAMS_SEARCH_BY_MULTIPLE_URL = '/Sport/api/teams/searchByMultipleParams';
export const API_PLAYERS_URL = '/Sport/api/players';
export const API_GAME_PLAYERS_URL = '/Sport/api/gameplayers';
export const API_GAMES_URL = '/Sport/api/games';
export const API_GAMES_SEARCH_URL = '/Sport/api/games/search';
export const API_SPORTS_URL = '/Sport/api/sports';
export const API_SEASONS_URL = '/Sport/api/seasons';
export const API_SEASONS_SEARCH_URL = `${API_SEASONS_URL}/search`;
export const API_CONFERENCES_URL = '/Sport/api/conferences';
export const API_CONFERENCES_SEARCH_URL = `${API_CONFERENCES_URL}/search`;
export const conferencesByLeagueUrl = leagueId => `${API_LEAGUES_URL}/${leagueId}/conferences`;
export const API_VENUES_URL = '/Sport/api/venues';
export const API_COMPETITIONS_SEARCH_URL = `${API_CONFERENCES_URL}/search`;
export const API_POSITIONS_URL = '/Sport/api/positions';
export const teamsByDivisionUrl = divisionId => `${API_DIVISIONS_URL}/${divisionId}/teams`;
export const teamBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/teams`;
export const seasonsByLeagueUrl = leagueId => `${API_LEAGUES_URL}/${leagueId}/seasons`;
export const teamsByConferencesUrl = conferenceId => `${API_CONFERENCES_URL}/${conferenceId}/teams`;
export const divisionsByLeagueUrl = leagueId => `${API_LEAGUES_URL}/${leagueId}/divisions`;
export const teamsByLeagueUrl = leagueId => `${API_LEAGUES_URL}/${leagueId}/teams`;
export const seasonByLeagueUrl = leagueId => `${API_LEAGUES_URL}/${leagueId}/seasons`;
export const competitionsByLeagueUrl = leagueId => `${API_LEAGUES_URL}/${leagueId}/competitions`;
export const gamesByTeamUrl = teamId => `${API_TEAMS_URL}/${teamId}/games`;
export const leaguesBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/leagues`;
export const venuesBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/venues`;
export const playersBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/referees`;
export const playersByTeamUrl = teamId => `${API_TEAMS_URL}/${teamId}/players`;
export const gamePlayersByGameUrl = gameId => `${API_GAMES_URL}/${gameId}/gameplayers`;
export const conferencesByLeague = leagueId => `${API_LEAGUES_URL}/${leagueId}/conferences`;
export const playersByPersonalDetails = `${API_PLAYERS_URL}/search`;
export const playerSearch = `${API_PLAYERS_URL}/searchPlayer`;
export const divisionsBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/divisions`;
export const conferencesBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/conferences`;
export const competitionsBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/competitions`;
export const seasonsBySportUrl = sportId => `${API_SPORTS_URL}/${sportId}/seasons`;
/* Baseball API */
export const API_BASEBALL_GAMES = '/Baseball/api/games';
export const API_BASEBALL_GAME_PLAYERS_URL = '/Baseball/api/gameplayers';
export const atbatsEventsByGameUrl = gameId => `${API_BASEBALL_GAMES}/${gameId}/1/atbats`;
export const actionsEventsByGameUrl = gameId => `${API_BASEBALL_GAMES}/${gameId}/1/actions`;
export const baseballGamePlayersByGameUrl = gameId => `${API_BASEBALL_GAMES}/${gameId}/gameplayers`;
export const searchLineupsForTeamInSeason = (seasonId, teamId) =>
  `${API_BASEBALL_GAMES}/${seasonId}/gameplayers/${teamId}`;
export const baseballGamePlayersByPersonalDetailsAndTeams = `${API_BASEBALL_GAME_PLAYERS_URL}/search`;
/* Operations Dashboard API */
export const API_DASHBOARD_URL = '/Operations/api/dashboard';
export const dashboardSearch = `${API_DASHBOARD_URL}/search`;
export const dashboardByLeagueUrl = leagueId => `${API_DASHBOARD_URL}/search/${leagueId}`;
export const dashboardDataCenters = `${API_DASHBOARD_URL}/dataCenters`;
export const dashboardDataCentersByLeague = leagueId => `${API_DASHBOARD_URL}/dataCenters/${leagueId}`;
export const dashboardServersByDataCenter = dataCenter => `${API_DASHBOARD_URL}/Servers/${dataCenter}`;
export const dashboardServersByDataCenterAndLeague =
  (dataCenter, leagueId) => `${API_DASHBOARD_URL}/${dataCenter}/Servers/${leagueId}`;
export const dashboardGamesByServer = server => `${API_DASHBOARD_URL}/Games/${server}`;
export const dashboardGamesByServerAndLeague =
  (server, leagueId) => `${API_DASHBOARD_URL}/${server}/Games/${leagueId}`;
/* Operations PGA API */
export const API_PGA_SEARCH_URL = '/Operations/api/post-game-analysis/search';
/* Operations Payroll API */
export const API_PAYROLL_SEARCH_URL = '/Operations/api/payrollrecords/search';
export const API_PAYROLL_URL = '/Operations/api/payrollrecords';
export const payrollPeriodLoggers = payrollPeriodId => `/Operations/api/payrollperiods/${payrollPeriodId}/loggers`;
export const payrollPeriodGenerationTimes = payrollPeriodId => `/Operations/api/payroll/generationtimes/${payrollPeriodId}`;
export const generatePayrolls = payrollPeriodId => `/Operations/api/payrollperiods/generate/${payrollPeriodId}`;
export const API_PAYROLL_PERIODS_URL = '/Operations/api/payrollperiods';
export const payrollLoggersReport = payrollPeriodId => `/Operations/api/payrollperiods/loggersreport/${payrollPeriodId}`;
export const payrollTotalsReport = payrollPeriodId => `/Operations/api/payrollperiods/totalsreport/${payrollPeriodId}`;
export const updateAdjustmentUrl = recordId => `${API_PAYROLL_URL}/${recordId}/adjustment`;
/* Operations Server Ops API */
export const API_SERVER_OPS_URL = '/Operations/api/servers';
export const serversStbsOnlyByDataCenterUrl = dataCenterId =>
  `${API_SERVER_OPS_URL}/${dataCenterId}/serverswithoutchilds`;
export const serverWithChildsUrl = serverId => `${API_SERVER_OPS_URL}/${serverId}/server`;
export const API_DATACENTER_OPS_URL = '/Operations/api/data-centers';
export const API_CONTAINERS_URL = '/operations/api/containers';
export const API_STB_OPS_URL = '/Operations/api/stb-devices';
/* Operations Game trackers API */
export const API_GAME_TRACKER_URL = '/Operations/api/game-trackers';
export const API_GAME_TRACKER_SEARCH_URL = `${API_GAME_TRACKER_URL}/search`;
export const gameTrackerById = id => `${API_GAME_TRACKER_URL}/${id}`;
export const gameTrackerByIid = iid => `${API_GAME_TRACKER_URL}/${iid}`;
/* Operations Jobs API */
export const API_JOBS_URL = '/Operations/api/jobs';
export const jobsByGameUrl = gameId => `${API_JOBS_URL}/game/${gameId}`;
export const API_JOBS_BULK_URL = `${API_JOBS_URL}/bulk`;
export const API_USERS_LOGGERS_URL = `${API_USERS_URL}/mapped-loggers`;
export const API_USERS_ADMINS_URL = `${API_USERS_URL}/admins`;
/* Operations Containers API */
export const API_SERVERS_URL = '/Operations/api/servers';
/*Ticketing */
export const API_TEMPLATE_URL = `/templates`;
export const API_TICKET_URL = `/tickets`;
export const API_GROUP_URL = `/groups`;
export const ticketByName = (ticketAbbr, number) =>  `${API_TICKET_URL}/${ticketAbbr}-${number}`;
export const assingUser =  (ticketAbbr, number) =>  `${API_TICKET_URL}/${ticketAbbr}-${number}/assignee`;
export const postCommentByTicketName = (ticketAbbr, number) => `${API_TICKET_URL}/${ticketAbbr}-${number}/comments`;
export const getCommentByTicketName = (ticketAbbr, number) =>  `${API_TICKET_URL}/${ticketAbbr}-${number}/comments`;
export const updateCommentByTicketName = (ticketId) =>  `${API_TICKET_URL}/${ticketId}/comment`;
export const getRelatedTicket = (link) =>  `${API_TICKET_URL}/${link}/ticket`;
export const setStatus = (ticketAbbr, number) => `${API_TICKET_URL}/${ticketAbbr}-${number}/statuses`;
