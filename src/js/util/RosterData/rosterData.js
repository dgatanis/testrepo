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
        var playerPositionAge = calcPositionAge(roster.players);
        var playerAge = calcPlayerAge(roster.players);
        var teamRecord = getTeamRecord(rosterid);
        var teamStackPlayers = getTeamStacks(rosterid);

        let rosterStats = {
            ...playerPositionCount[0],
            ...playerAge[0],
            ...teamRecord[0],
            ...highScorerPlayers[0],
            ...playerPositionAge,
            ...teamStackPlayers
        };

        return rosterStats;
    }
}

export function getPlayerNickNames(rosterId, playerId){
    let nickname = "";
    let roster = rosterData.find(x => x.roster_id === parseInt(rosterId));

    if(roster.metadata)
    {
        if(roster.metadata["p_nick_"+playerId])
        {
            nickname = roster.metadata["p_nick_"+playerId];
        }
    }

    return nickname;
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

export function calcRosterAge(players) {

    const calculatedAge = [];
    var totalAge = 0;
    var avgAge;

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === player);
        
        if(thisPlayer.position != "DEF")
        {
            totalAge += parseInt(thisPlayer.age);
        }
        
    }
    
    avgAge = totalAge / players.length;

    calculatedAge.push ({
        "AvgAge": avgAge.toFixed(2)
    });

    return calculatedAge;
}

function calcPositionAge(players) {

    const calculatedAge = [];
    var totalAge = 0;
    var qbAge = 0;
    var rbAge = 0;
    var wrAge = 0;
    var teAge = 0;
    var values = {"qbAge": 0,"rbAge": 0,"wrAge": 0,"teAge": 0};

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === player);

        if(thisPlayer.position == 'QB')
        {
            qbAge += parseInt(thisPlayer.age);
        }
        else if(thisPlayer.position == 'RB')
        {
            rbAge += parseInt(thisPlayer.age);
        }
        else if(thisPlayer.position == 'WR')
        {
            wrAge += parseInt(thisPlayer.age);
        }
        else if(thisPlayer.position == 'TE')
        {
            teAge += parseInt(thisPlayer.age);
        }
    }
    var playerPositionCount = calcPlayerPositions(players);
    
    qbAge = qbAge / playerPositionCount[0].QB;
    rbAge = rbAge / playerPositionCount[0].RB;
    wrAge = wrAge / playerPositionCount[0].WR;
    teAge = teAge / playerPositionCount[0].TE;

    values.qbAge = qbAge.toFixed(2);
    values.rbAge = rbAge.toFixed(2);
    values.wrAge = wrAge.toFixed(2);
    values.teAge = teAge.toFixed(2);

    return values;
}


function getTeamStacks(rosterid) {

    var teamStacks = [];
    var teams = [];
    var result = {};
    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));

    if(roster)
    {
        let rosterPlayers = sortByTeam(roster.players);

        if(rosterPlayers)
        {
            //loop through players to get only teams for qbs
            for(let thisPlayer of rosterPlayers)
            {
                let player = playerData.players.find(e => e.player_id === thisPlayer.player_id);
                
                if(player.position == 'QB')
                {
                    teams.push(player.team)
                }

            }

            let commonTeams = countCommonTeams(rosterPlayers);
            //loop through players again and only select ones with qb stacks
            for(let thisPlayer of rosterPlayers)
            {
                let player = playerData.players.find(e => e.player_id === thisPlayer.player_id);
                
                if(teams.includes(player.team) && player.position != 'K' && commonTeams[player.player_id] >= 1)
                {
                    teamStacks.push({
                        "player_id": player.player_id,
                        "team": player.team,
                        "position": player.position
                    });
                }

            }
        }

        result['team_stacks'] = teamStacks;

        return result;
        
    }
}

function sortByTeam(players) {

    const sortedPlayers = [];
    
    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === player);
        if(thisPlayer)
        {
            sortedPlayers.push({
                "player_id": thisPlayer.player_id.toString(),
                "team": thisPlayer.team,
                "position": thisPlayer.position
            });
            
        }
    }

    sortedPlayers.sort(function (a, b) {
        if (a.team > b.team) {
        return 1;
        }
        if (a.team < b.team) {
        return -1;
        }
        return 0;
    });

    if(sortedPlayers)
    {
        return sortedPlayers;
    }
}


function countCommonTeams(players) {

    const result = {};
    
    players.forEach(player => {
        if (!result[player.player_id && player.position != "K"]) {
            result[player.player_id] = 0;
        }
        // Loop through the players again to compare teams
        players.forEach(otherPlayer => {
            // Count common teams for each player excluding kickers
            if (player.player_id !== otherPlayer.player_id && player.team === otherPlayer.team && otherPlayer.position != "K") {
                result[player.player_id]++;
            }
        });
    });
    
    return result;
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
        let thisPlayer = playerData.players.find(x => x.player_id === playerid);

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
        let thisPlayer = playerData.players.find(e => e.player_id === player);

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
    var defCounter = 0;

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === player);

        if(thisPlayer.position != "DEF")
        {
            totalAge += parseInt(thisPlayer.age);
        }
        else {
            defCounter++;
        }
    }
    
    avgAge = totalAge / (players.length - defCounter);

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