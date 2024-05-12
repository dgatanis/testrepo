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