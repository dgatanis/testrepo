import { matchups } from '../initData.js';

var matchupData = matchups;

export function getPlayerPointsForWeek(playerid,week) {

    let matchups = matchupData[0].matchupWeeks[week];
    let matchupsLength = Object.keys(matchups).length;
    
    //Iterate through each matchup and then return player points for the provided week
    for(let i =0; i<matchupsLength; i++)
    {
        let matchup = matchups[i];
        let matchupPoints = matchup.players_points;
        if(matchupPoints[playerid] != null && matchupPoints[playerid] != undefined && matchupPoints[playerid] != NaN)
        {
            var round = Math.round;
            return round(matchupPoints[playerid], 0);
        }
        
    }
}

export function getMatchupWeekWinner(matchups,matchupid) {
    let matchupScore = [];
    let matchupsLength = Object.keys(matchups).length;

    for(let i =0; i<matchupsLength; i++)
    {
        let matchup = matchups[i];

        if(matchup && matchup.matchup_id==matchupid)
        {
            matchupScore.push({
                "roster_id" : matchup.roster_id,
                "points": matchup.points,
                "matchup_id": matchup.matchup_id
            });
        }
    }


    return matchupScore.sort(function (a, b) {
                if (a.points > b.points) {
                return -1;
                }
                if (a.points < b.points) {
                return 1;
                }
                return 0;
            });
}

export function getRosterHighScorerWeek(matchups) {

    let rosters = [];
    let matchupsLength = Object.keys(matchups).length;

    for(let i =0; i<matchupsLength; i++)
    {
        rosters.push({
            "roster_id": matchups[i].roster_id,
            "points" : matchups[i].points
        });
    }

    rosters.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
      });

    return rosters[0];
}

export function highScorerInMatchupStarters(starters, playerPoints){

    let startersPoints = [];

    for(let starter of starters)
    {
        if(playerPoints[starter])
        {
            startersPoints.push({
                "player_id": starter,
                "points" : playerPoints[starter]
            });
        }
    }

    if(startersPoints)
    {
        startersPoints.sort((a, b) => b.points - a.points);

        let highestScorer = startersPoints[0];

        return highestScorer;
    }
}

export function lowScorerInMatchupStarters(starters, playerPoints){

    let startersPoints = [];

    for(let starter of starters)
    {
        if(playerPoints[starter] !== null || playerPoints[starter] !== undefined)
        {
            startersPoints.push({
                "player_id": starter,
                "points" : playerPoints[starter]
            });
        }
    }
    
    if(startersPoints)
    {
        startersPoints.sort((a, b) => a.points - b.points);

        let highestScorer = startersPoints[0];

        return highestScorer;
    }
}


export function getRosterLowScorerWeek(matchups) {

    let rosters = [];
    let matchupsLength = Object.keys(matchups).length;

    for(let i =0; i<matchupsLength; i++)
    {
        rosters.push({
            "roster_id": matchups[i].roster_id,
            "points" : matchups[i].points
        });
    }

    rosters.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
      });

    return rosters[rosters.length-1];
}