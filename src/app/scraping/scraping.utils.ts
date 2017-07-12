import { ResolutionRuleset, PlayerConflict, SynergyPlayer } from './models';
import { DateTimeUtils, DateConversionType } from '../shared/utils/datetime-utils';

export class ScrapingUtils {

  public static prepareToSave(ruleset: ResolutionRuleset): ResolutionRuleset {
    ScrapingUtils.prepareDateTimeValues(ruleset.matchRules);
    ScrapingUtils.prepareDateTimeValues(ruleset.resolutionRules, true);

    ScrapingUtils.stringifyDates(ruleset.matchRules);
    ScrapingUtils.stringifyDates(ruleset.resolutionRules);
    ruleset.matchRules = ScrapingUtils.trimRedundantValues(ruleset.matchRules);
    ruleset.resolutionRules = ScrapingUtils.trimRedundantValues(ruleset.resolutionRules);
    if (ruleset.resolutionRules.iidHint) {
      ruleset.resolutionRules.iidHint = ruleset.resolutionRules.iidHint.toString();
    }
    ScrapingUtils.armValuesToNumber(ruleset);
    ScrapingUtils.scoreValuesToNumber(ruleset.matchRules);
    ScrapingUtils.scoreValuesToNumber(ruleset.resolutionRules);
    return ruleset;
  }

  public static createPlayerRuleFromLineupConflict(conflict, resolutionParams: any) {
    const ruleset = <ResolutionRuleset>{};
    ruleset.entity = 'Player';
    ruleset.scraperUrl = conflict.scraperUrl;
    ruleset.enabled = true;
    ruleset.sport = conflict.sportIid;
    ruleset.leagueIid = conflict.leagueIid;

    ruleset.matchRules = {
      firstname: conflict.data.player.firstname,
      lastname: conflict.data.player.lastname
    };

    if (resolutionParams.player) {
      ruleset.resolutionRules = {
        firstname: resolutionParams.player.firstname,
        lastname: resolutionParams.player.lastname
      };
    } else if (resolutionParams.iidHint) {
      ruleset.resolutionRules = { iidHint: resolutionParams.iidHint };
    }

    return ruleset;
  }

  public static createGameRuleFromGameConflict(conflict, resolutionData, iidHint = null) {
    const ruleset = <ResolutionRuleset>{};
    ruleset.entity = 'Game';
    ruleset.scraperUrl = conflict.scraperUrl;
    ruleset.enabled = true;
    ruleset.sport = conflict.sportIid;
    ruleset.leagueIid = conflict.leagueIid;
    ruleset.matchRules = {};
    ruleset.resolutionRules = {};

    ruleset.matchRules = ScrapingUtils.createGameMachRuleFromScrapedData(conflict.data);

    if (resolutionData) {
      ruleset.resolutionRules.gameTeams = {
        homeTeam: resolutionData.homeTeam.name,
        awayTeam: resolutionData.awayTeam.name
      };

      const rLocalDate = new Date(resolutionData.utc);
      ruleset.resolutionRules.gameTime = {
        utcDate: DateTimeUtils.DateToUtcValue(rLocalDate)
      };
    }

    if (iidHint) {
      ruleset.resolutionRules.iidHint = iidHint;
    }

    return ruleset;
  }

  private static prepareDateTimeValues(ruleObj, isResolution = false) {
    const gameTime = ruleObj.gameTime;
    if (gameTime) {
      if (gameTime.utcDate) {
        if (isResolution) {
          gameTime.gameHour = gameTime.utcDate.getHours();
          gameTime.gameMinute = gameTime.utcDate.getMinutes();
        }
        gameTime.utcDate = DateTimeUtils.DateTimeToISOStringIgnoringTimeZone(gameTime.utcDate, DateConversionType.WithTimePart);
      }
      if (gameTime.gameDate) {
        const gameDateArr = DateTimeUtils.CreateDateTimeArray(gameTime.gameDate);
        gameTime.gameYear = gameDateArr[0];
        gameTime.gameMonth = gameDateArr[1] + 1;
        gameTime.gameDay = gameDateArr[2];
        gameTime.gameDate = null;
      }
    }
  }

  public static createRulesetFromPlayerConflict(conflict: PlayerConflict, resolutionParams: any) {
    const ruleset = <ResolutionRuleset>{};

    ruleset.entity = 'Player';
    ruleset.scraperUrl = conflict.scraperUrl;
    ruleset.enabled = true;
    ruleset.sport = conflict.sportIid;
    ruleset.leagueIid = conflict.leagueIid;

    ruleset.matchRules = ScrapingUtils.createPlayerMatchRuleFromScrapedData(conflict.data);

    if (resolutionParams.player) {
      ruleset.resolutionRules = ScrapingUtils.createResolutionRuleFromSynergyPlayer(resolutionParams.player);
    } else if (resolutionParams.iidHint) {
      ruleset.resolutionRules = { iidHint: resolutionParams.iidHint };
    }

    return ruleset;
  }

  private static createPlayerMatchRuleFromScrapedData(data) {
    const playerData = data.player ? data.player : data;

    return {
      firstname: playerData.firstname,
      lastname: playerData.lastname
    };
  }

  private static createGameMachRuleFromScrapedData(data) {
    const gameData = data.game ? data.game : data;

    const mLocalDate = new Date(<string>gameData.gameTime.utcDate);

    return {
      gameTeams: {
        homeTeam: gameData.gameTeams.homeTeam,
        awayTeam: gameData.gameTeams.awayTeam
      },
      gameTime: {
        utcDate: DateTimeUtils.DateToUtcValue(mLocalDate)
      }
    };
  }

  private static scoreValuesToNumber(rule) {
    if (rule.score) {
      rule.score.awayTeamRuns = parseInt(rule.score.awayTeamRuns, 10);
      rule.score.awayTeamHits = parseInt(rule.score.awayTeamHits, 10);
      rule.score.awayTeamErrors = parseInt(rule.score.awayTeamErrors, 10);
      rule.score.homeTeamRuns = parseInt(rule.score.homeTeamRuns, 10);
      rule.score.homeTeamHits = parseInt(rule.score.homeTeamHits, 10);
      rule.score.homeTeamErrors = parseInt(rule.score.homeTeamErrors, 10);
    }
  }

  private static armValuesToNumber(ruleset) {
    if (ruleset.matchRules.battingArm) {
      ruleset.matchRules.battingArm = parseInt(ruleset.matchRules.battingArm, 10);
    }
    if (ruleset.matchRules.throwingArm) {
      ruleset.matchRules.throwingArm = parseInt(ruleset.matchRules.throwingArm, 10);
    }
    if (ruleset.resolutionRules.battingArm) {
      ruleset.resolutionRules.battingArm = parseInt(ruleset.resolutionRules.battingArm, 10);
    }
    if (ruleset.resolutionRules.throwingArm) {
      ruleset.resolutionRules.throwingArm = parseInt(ruleset.resolutionRules.throwingArm, 10);
    }
  }

  private static createResolutionRuleFromSynergyPlayer(player: SynergyPlayer) {
    return {
      firstname: player.firstName,
      lastname: player.lastName
    };
  }

  private static trimRedundantValues(rule) {
    return Object.keys(rule).reduce((acc, cur) => {
      const val = rule[cur];
      if (val) {
        if (typeof val === 'object') {
          const trimmedObj = ScrapingUtils.trimRedundantValues(val);
          if (Object.keys(trimmedObj).length !== 0) {
            acc[cur] = trimmedObj;
          }
        } else {
          acc[cur] = val;
        }
      }
      return acc;
    }, {});
  }

  private static stringifyDates(rule) {
    Object.keys(rule).forEach(key => {
      const val = rule[key];
      if (val instanceof Date) {
        const dateArray = DateTimeUtils.CreateDateTimeArray(val);
        rule[key] = DateTimeUtils.CreateServerDateStringFromArray(dateArray);
      }
    });
  }

}
