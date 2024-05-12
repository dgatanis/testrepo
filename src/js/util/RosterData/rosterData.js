import { rosters,  players, matchups } from '../initData.js';

var rosterData = rosters;
var playerData = players;
var matchupData = matchups;

export function getRosterStats(rosterid) {

    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));

    if(roster)
    {
        var highScorerPlayers = highestScorerByPosition(rosterid);
        var playerPositionCount = calcPlayerPositions(roster.players);
        var playerAge = calcPlayerAge(roster.players);
        var teamRecord = getTeamRecord(rosterid);

        let rosterStats = {
            ...playerPositionCount[0],
            ...playerAge[0],
            ...teamRecord[0],
            ...highScorerPlayers[0]
        };

        return rosterStats;
    }
}

export function sortTeamRankings() {

    const rosters = rosterData.map((x) => x);
    const sortedList = [];

    for(let roster of rosters)
    {
        sortedList.push({
            "owner_id": roster.owner_id,
            "wins": roster.settings.wins,
            "losses": roster.settings.losses,
            "ties": roster.settings.ties,
            "fpts": roster.settings.fpts
        });
    }

    if(sortedList)
    {
        return sortedList.sort(function (a, b) {
            if (a.wins > b.wins) {
              return -1;
            }
            if (a.wins < b.wins && a.fpts < b.fpts) {
              return 1;
            }
            return 0;
        });
    }

}

function highestScorerByPosition(rosterid) {

    const roster = rosterData.find(x => x.roster_id === parseInt(rosterid));
    const weeksPlayed = matchupData[0].matchupWeeks.length;
    const players = roster.players;
    const teamQB = [];
    const teamRB = [];
    const teamWR = [];
    const teamTE = [];
    let highScoringPlayers = [];

    for(let player of players)
    {
        let playerPoints = 0;
        let playerid = player;
        let thisPlayer = playerData.players.find(x => x.player_id === parseInt(playerid));

        for(let i = 0; i < weeksPlayed; i++)
        {
            let points = getPlayerPointsForWeek(playerid,i);

            //If a number is returned add it else add 0
            if(Number(points) > 0)
            {
                playerPoints += points;
            }
            else
            {
                playerPoints += 0;
            }
        }

        //Add them to the corresponding array
        if(thisPlayer.position == "QB")
        {        
            teamQB.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })
        }
        else if(thisPlayer.position == "RB")
        {        
            teamRB.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })

        }
        else if(thisPlayer.position == "WR")
        {        
            teamWR.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })

        }
        else if(thisPlayer.position == "TE")
        {        
            teamTE.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })

        }

    }

    //Sort the arrays by highest scorer
    teamQB.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
    });
    teamRB.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
    });
    teamWR.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
    });
    teamTE.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
    });

    //Pull the top-most player at each position
    highScoringPlayers.push({ 
        "QBpts": teamQB[0],
        "RBpts": teamRB[0],
        "WRpts": teamWR[0],
        "TEpts": teamTE[0]
    }); 

    return highScoringPlayers;

}

function calcPlayerPositions(players){

    const calculatedPositions = [];
    var QB = 0;
    var RB = 0;
    var WR = 0;
    var TE = 0;
    var K = 0;

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));

        if(thisPlayer.position == "QB")
        {
            QB++;
        }
        if(thisPlayer.position == "RB")
        {
            RB++;
        }
        if(thisPlayer.position == "WR")
        {
            WR++;
        }
        if(thisPlayer.position == "TE")
        {
            TE++;
        }
        if(thisPlayer.position == "K")
        {
            K++;
        }
    }

    calculatedPositions.push({ 
        "QB": parseInt(QB),
        "RB": parseInt(RB),
        "WR": parseInt(WR),
        "TE": parseInt(TE),
        "K": parseInt(K)
    }); 

    return calculatedPositions;

}

function getTeamRecord(rosterid) {

    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));
    const teamRecord = [];

    if (roster)
    {
        teamRecord.push({
            "owner_id": roster.owner_id,
            "wins": roster.settings.wins,
            "losses": roster.settings.losses,
            "ties": roster.settings.ties,
            "fpts": roster.settings.fpts
        });
    
    }

    return teamRecord;
}

function calcPlayerAge(players) {

    const calculatedAge = [];
    var totalAge = 0;
    var avgAge;
    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));

        totalAge += parseInt(thisPlayer.age);
    }
    
    avgAge = totalAge / players.length;

    calculatedAge.push ({
        "AvgAge": avgAge.toFixed(2)
    });

    return calculatedAge;
}

function getPlayerPointsForWeek(playerid,week) {

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