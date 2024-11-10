async function submitTeams() {
    const helper = await import('../util/helper.js');
    const leagueInfo = await import('../util/leagueInfo.js');
    const currentSeason = await leagueInfo.getCurrentSeason();
    const currentWeek = await leagueInfo.getCurrentWeek();
    const allTimeMatchups = helper.allTimeMatchupData[0].matchupWeeks;

    var team1Name = document.getElementById('teamButton1').innerText;
    var team2Name = document.getElementById('teamButton2').innerText;
    var teamComparisonTable = document.getElementById('teamComparison');
    var team1UserId = helper.getUserByName(team1Name);
    var team2UserId = helper.getUserByName(team2Name);
    var rosterId1 = helper.getRosterByUserId(team1UserId);
    var rosterId2 = helper.getRosterByUserId(team2UserId);
    var winsRow = document.getElementById("wins");
    var lossesRow = document.getElementById("losses");
    var avgPtsForRow = document.getElementById("avgPtsFor");
    var avgPtsAgnstRow = document.getElementById("avgPtsAgnst");
    var highScorePlayersRow = document.getElementById("highScorePlayers");
    var lowScorePlayersRow = document.getElementById("lowScorePlayers");

    if (rosterId1 != rosterId2) {

        //Set team info
        var team1Header = document.getElementById('team1Header');
        var team2Header = document.getElementById('team2Header');
        var ownerName1 = team1Header.getElementsByTagName('span')[0];
        var ownerName2 = team2Header.getElementsByTagName('span')[0];
        var team1Image = helper.createOwnerAvatarImage(team1UserId);
        var team2Image = helper.createOwnerAvatarImage(team2UserId);
        ownerName1.innerText = team1Name;
        ownerName2.innerText = team2Name;
        teamComparisonTable.classList.remove("custom-none-display");

        //remove already existing images
        if(team1Header.getElementsByTagName('img').length > 0 || team2Header.getElementsByTagName('img').length > 0) {
            team1Header.getElementsByTagName('img')[0].remove();
            team2Header.getElementsByTagName('img')[0].remove();

            team1Header.prepend(team1Image);
            team2Header.prepend(team2Image);
        }
        else {
            team1Header.prepend(team1Image);
            team2Header.prepend(team2Image);
        }

        if (winsRow && lossesRow) { //Wins losses rows
            var teamMatchups = getMatchupsBetweenRosters(rosterId1, rosterId2, allTimeMatchups, currentWeek, currentSeason);
            var winsLosses = getRostersWinsLosses(teamMatchups, helper, rosterId1);
            var team1WinsResult = winsRow.getElementsByClassName('custom-team1-result')[0];
            var team2WinsResult = winsRow.getElementsByClassName('custom-team2-result')[0];
            team1WinsResult.innerText = winsLosses.team1.wins;
            team2WinsResult.innerText = winsLosses.team2.wins;
            var team1LossesResult = lossesRow.getElementsByClassName('custom-team1-result')[0];
            var team2LossesResult = lossesRow.getElementsByClassName('custom-team2-result')[0];
            team1LossesResult.innerText = winsLosses.team1.losses;
            team2LossesResult.innerText = winsLosses.team2.losses;

        }
        if (avgPtsForRow && avgPtsAgnstRow) { //Avg pts for/against rows
            var teamMatchups = getMatchupsBetweenRosters(rosterId1, rosterId2, allTimeMatchups, currentWeek, currentSeason);
            var totalPoints = getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper);

            var team1avgPtsVal = totalPoints.team1.pointsFor / teamMatchups.length;
            var team2avgPtsVal = totalPoints.team2.pointsFor / teamMatchups.length;
            var team1avgPtsResult = avgPtsForRow.getElementsByClassName('custom-team1-result')[0];
            var team2avgPtsResult = avgPtsForRow.getElementsByClassName('custom-team2-result')[0];
            team1avgPtsResult.innerText = team1avgPtsVal.toFixed(2);
            team2avgPtsResult.innerText = team2avgPtsVal.toFixed(2);

            var team1AvgPtsAgnstVal = totalPoints.team1.pointsAgainst / teamMatchups.length;
            var team2AvgPtsAgnstVal = totalPoints.team2.pointsAgainst / teamMatchups.length;
            var team1AvgPtsAgnstResult = avgPtsAgnstRow.getElementsByClassName('custom-team1-result')[0];
            var team2AvgPtsAgnstResult = avgPtsAgnstRow.getElementsByClassName('custom-team2-result')[0];
            team1AvgPtsAgnstResult.innerText = team1AvgPtsAgnstVal.toFixed(2);
            team2AvgPtsAgnstResult.innerText = team2AvgPtsAgnstVal.toFixed(2);

        }
        if(highScorePlayersRow){ //High scorer in matchups
            var highScorePlayers = getHighScorerPlayerInMatchups(teamMatchups, helper);
            var team1Player = highScorePlayers.find(player => player.roster_id === rosterId1);
            var team2Player = highScorePlayers.find(player => player.roster_id === rosterId2);
            var team1PlayerResult = highScorePlayersRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = highScorePlayersRow.getElementsByClassName('custom-team2-result')[0];
            var player1Year = team1Player.year;
            var player2Year = team2Player.year;
            var player1Date = "week " + team1Player.week + " '" + player1Year.toString().substring(2,4)
            var player2Date = "week " + team2Player.week + " '" + player2Year.toString().substring(2,4)

            var player1Div = document.createElement('div');
            var player1Details = document.createElement('div');
            var playerName_1 = document.createElement('span');
            var playerPoints_1 = document.createElement('span');
            var player2Div = document.createElement('div');
            var player2Details = document.createElement('div');
            var playerName_2 = document.createElement('span');
            var playerPoints_2 = document.createElement('span');

            playerName_1.innerText = helper.getFullPlayerName(team1Player.player_id);
            playerName_2.innerText = helper.getFullPlayerName(team2Player.player_id);
            playerPoints_1.innerText = team1Player.maxPoints
            playerPoints_2.innerText = team2Player.maxPoints
            player1Details.setAttribute('class', 'custom-player-details');
            player1Details.innerText = player1Date
            player2Details.setAttribute('class', 'custom-player-details');
            player2Details.innerText = player2Date
            playerName_1.setAttribute('class', 'custom-player-name');
            playerName_2.setAttribute('class', 'custom-player-name');
            playerPoints_1.setAttribute('class', 'custom-player-points');
            playerPoints_2.setAttribute('class', 'custom-player-points');


            while (team1PlayerResult.firstChild) {
                team1PlayerResult.removeChild(team1PlayerResult.firstChild);
            }

            while (team2PlayerResult.firstChild) {
                team2PlayerResult.removeChild(team2PlayerResult.firstChild);
            }

            player1Div.appendChild(playerName_1);
            player1Div.appendChild(playerPoints_1);
            player2Div.appendChild(playerName_2);
            player2Div.appendChild(playerPoints_2);
            team1PlayerResult.appendChild(player1Div);
            team1PlayerResult.appendChild(player1Details);
            team2PlayerResult.appendChild(player2Div);
            team2PlayerResult.appendChild(player2Details);

        }
        if(lowScorePlayersRow){ //Low scorer in matchups
            var lowScorePlayers = getLowScorerPlayerInMatchups(teamMatchups, helper);
            var team1Player = lowScorePlayers.find(player => player.roster_id === rosterId1);
            var team2Player = lowScorePlayers.find(player => player.roster_id === rosterId2);
            var team1PlayerResult = lowScorePlayersRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = lowScorePlayersRow.getElementsByClassName('custom-team2-result')[0];
            var player1Year = team1Player.year;
            var player2Year = team2Player.year;
            var player1Date = "week " + team1Player.week + " '" + player1Year.toString().substring(2,4)
            var player2Date = "week " + team2Player.week + " '" + player2Year.toString().substring(2,4)

            var player1Div = document.createElement('div');
            var player1Details = document.createElement('div');
            var playerName_1 = document.createElement('span');
            var playerPoints_1 = document.createElement('span');
            var player2Div = document.createElement('div');
            var player2Details = document.createElement('div');
            var playerName_2 = document.createElement('span');
            var playerPoints_2 = document.createElement('span');

            playerName_1.innerText = helper.getFullPlayerName(team1Player.player_id);
            playerName_2.innerText = helper.getFullPlayerName(team2Player.player_id);
            playerPoints_1.innerText = team1Player.maxPoints
            playerPoints_2.innerText = team2Player.maxPoints
            player1Details.setAttribute('class', 'custom-player-details');
            player1Details.innerText = player1Date
            player2Details.setAttribute('class', 'custom-player-details');
            player2Details.innerText = player2Date
            playerName_1.setAttribute('class', 'custom-player-name');
            playerName_2.setAttribute('class', 'custom-player-name');
            playerPoints_1.setAttribute('class', 'custom-player-points');
            playerPoints_2.setAttribute('class', 'custom-player-points');


            while (team1PlayerResult.firstChild) {
                team1PlayerResult.removeChild(team1PlayerResult.firstChild);
            }

            while (team2PlayerResult.firstChild) {
                team2PlayerResult.removeChild(team2PlayerResult.firstChild);
            }

            player1Div.appendChild(playerName_1);
            player1Div.appendChild(playerPoints_1);
            player2Div.appendChild(playerName_2);
            player2Div.appendChild(playerPoints_2);
            team1PlayerResult.appendChild(player1Div);
            team1PlayerResult.appendChild(player1Details);
            team2PlayerResult.appendChild(player2Div);
            team2PlayerResult.appendChild(player2Details);
        }
    }
    else
    {
        window.alert("Please ensure two different teams have been chosen.");
    }
}

function getMatchupsBetweenRosters(rosterid_1, rosterid_2, allTimeMatchups, currentWeek, currentSeason) {

    const allMatchups = [];

    for (matchupWeek of allTimeMatchups) {
        Object.keys(matchupWeek).forEach(key => {

            if (isNaN(key)) return;
            const matchup = matchupWeek[key];
            const matchup_id = matchup.matchup_id;
            if (matchup.roster_id == rosterid_1 && (parseInt(matchupWeek.year) < parseInt(currentSeason) || (parseInt(matchupWeek.year) == parseInt(currentSeason) && parseInt(matchupWeek.week) < parseInt(currentWeek))))
            {

                let thisMatchup = Object.values(matchupWeek).filter(e => e.matchup_id == matchup_id && e.matchup_id !== null);
                if (thisMatchup && parseInt(thisMatchup[0].points) !== 0 && parseInt(thisMatchup[1].points) !== 0
                    &&  thisMatchup[0].roster_id == rosterid_2 || thisMatchup[1].roster_id == rosterid_2)
                {
                    allMatchups.push({...thisMatchup, "week":matchupWeek.week, "year":matchupWeek.year});
                }
            }

        });
    }

    return allMatchups.sort(function (a, b) {

        if(parseInt(a.season) !== parseInt(b.season))
        {
            return parseInt(b.season) - parseInt(a.season)
        }
        else {
            return parseInt(b.week) - parseInt(a.week);
        }
    });
}

function getRostersWinsLosses(teamMatchups, helper, rosterId1) {
    let teamsRecord = {
        "team1": {
            wins: 0,
            losses: 0
        },
        "team2": {
            wins: 0,
            losses: 0
        }
    };
    var allMatchups = teamMatchups
    for(matchup of allMatchups)
    {
        matchupWinners = helper.getMatchupWeekWinner(matchup, matchup[0].matchup_id);

        if(matchupWinners[0].roster_id === rosterId1)
        {
            teamsRecord.team1.wins += 1
            teamsRecord.team2.losses += 1
        }
        else
        {
            teamsRecord.team2.wins += 1
            teamsRecord.team1.losses += 1
        }
    }

    return teamsRecord;

}

function getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper) {
    let teamsPoints = {
        "team1": {
            pointsFor: 0,
            pointsAgainst: 0,
            totalGames: teamMatchups.length
        },
        "team2": {
            pointsFor: 0,
            pointsAgainst: 0,
            totalGames: teamMatchups.length
        }
    };
    var allMatchups = teamMatchups
    for (matchup of allMatchups) {
        matchup = helper.getMatchupWeekWinner(matchup, matchup[0].matchup_id);
        if (matchup[0].roster_id === rosterId1) {
            teamsPoints.team1.pointsFor += matchup[0].points;
            teamsPoints.team2.pointsAgainst += matchup[0].points;

            teamsPoints.team2.pointsFor += matchup[1].points;
            teamsPoints.team1.pointsAgainst += matchup[1].points;
        }
        else {
            teamsPoints.team1.pointsAgainst += matchup[0].points;
            teamsPoints.team2.pointsFor += matchup[0].points;

            teamsPoints.team2.pointsAgainst += matchup[1].points;
            teamsPoints.team1.pointsFor += matchup[1].points;
        }
    }

    return teamsPoints;
}

function getHighScorerPlayerInMatchups(teamMatchups, helper) {
    let teamHighScorer = {
        "players":{}
    };
    var allMatchups = teamMatchups;
    for(matchup of allMatchups)
    {

        var team1Starters = matchup[0].starters;
        var team1Points = matchup[0].players_points;
        var team2Starters = matchup[1].starters;
        var team2Points = matchup[1].players_points;
        var team1Player = helper.highScorerInMatchupStarters(team1Starters, team1Points);
        var team2Player = helper.highScorerInMatchupStarters(team2Starters, team2Points);
        if(team1Player)
        {
            if(!teamHighScorer.players[team1Player.player_id])
            {
                teamHighScorer.players[team1Player.player_id] = [];
                teamHighScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }
            else
            {
                teamHighScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }

        }
        if(team2Player)
        {
            if(!teamHighScorer.players[team2Player.player_id])
            {
                teamHighScorer.players[team2Player.player_id] = [];
                teamHighScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            else {
                teamHighScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            
        }
    }

    let sortedHighestEntries = Object.entries(teamHighScorer.players)
    .map(([player_id, entries]) => {
        //Find the highest points for each player
        const maxPointsEntry = entries.reduce((max, entry) => {
            return entry.points > max.points ? entry : max;
        }, entries[0]);
        
        return { player_id, maxPoints: maxPointsEntry.points, week: maxPointsEntry.week, year: maxPointsEntry.year, roster_id: maxPointsEntry.roster_id };
    })
    .sort((a, b) => b.maxPoints - a.maxPoints);

    // Step 4: Convert back to an object if needed
    let sortedTeamHighScorer = {};
    sortedHighestEntries.forEach(({ playerId, entries }) => {
        sortedTeamHighScorer[playerId] = entries;
    });

    return sortedHighestEntries;
}

function getLowScorerPlayerInMatchups(teamMatchups, helper) {
    let teamLowScorer = {
        "players":{}
    };
    var allMatchups = teamMatchups;
    for(matchup of allMatchups)
    {

        var team1Starters = matchup[0].starters;
        var team1Points = matchup[0].players_points;
        var team2Starters = matchup[1].starters;
        var team2Points = matchup[1].players_points;
        var team1Player = helper.lowScorerInMatchupStarters(team1Starters, team1Points);
        var team2Player = helper.lowScorerInMatchupStarters(team2Starters, team2Points);

        if(team1Player)
        {
            if(!teamLowScorer.players[team1Player.player_id])
            {
                teamLowScorer.players[team1Player.player_id] = [];
                teamLowScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }
            else
            {
                teamLowScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }

        }
        if(team2Player)
        {
            if(!teamLowScorer.players[team2Player.player_id])
            {
                teamLowScorer.players[team2Player.player_id] = [];
                teamLowScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            else {
                teamLowScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            
        }
    }

    let sortedLowestEntries = Object.entries(teamLowScorer.players)
    .map(([player_id, entries]) => {
        //Find the highest points for each player
        const maxPointsEntry = entries.reduce((max, entry) => {
            return entry.points > max.points ? entry : max;
        }, entries[0]);
        
        return { player_id, maxPoints: maxPointsEntry.points, week: maxPointsEntry.week, year: maxPointsEntry.year, roster_id: maxPointsEntry.roster_id };
    })
    .sort((a, b) => a.maxPoints - b.maxPoints);

    // Step 4: Convert back to an object if needed
    let sortedTeamLowScorer = {};
    sortedLowestEntries.forEach(({ playerId, entries }) => {
        sortedTeamLowScorer[playerId] = entries;
    });

    return sortedLowestEntries;
}