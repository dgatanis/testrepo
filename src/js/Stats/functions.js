async function submitTeams() {
    const helper = await import('../util/helper.js');
    const allTimeMatchups = helper.allTimeMatchupData[0].matchupWeeks;
    const leagueInfo = await import('../util/leagueInfo.js');
    const currentSeason = await leagueInfo.getCurrentSeason();
    const currentWeek = await leagueInfo.getCurrentWeek();
    var team1Name = document.getElementById('teamButton1').innerText;
    var team2Name = document.getElementById('teamButton2').innerText;
    var teamComparisonTable = document.getElementById('teamComparison');

    var team1UserId = helper.getUserByName(team1Name);
    var team2UserId = helper.getUserByName(team2Name);

    var rosterId1 = helper.getRosterByUserId(team1UserId);
    var rosterId2 = helper.getRosterByUserId(team2UserId);

    var teamMatchups = getMatchupsBetweenRosters(rosterId1, rosterId2, allTimeMatchups, currentWeek, currentSeason);
    var winsRow = document.getElementById("wins");
    var lossesRow = document.getElementById("losses");
    var avgPtsForRow = document.getElementById("avgPtsFor");
    var avgPtsAgnstRow = document.getElementById("avgPtsAgnst");
    if (rosterId1 != rosterId2) {

    var team1Header = document.getElementById('team1Header');
    var team2Header = document.getElementById('team2Header');
    team1Header.innerText = team1Name;
    team2Header.innerText = team2Name;
    teamComparisonTable.classList.remove("custom-none-display");
    if(winsRow)
    {
        var winsLosses = getRostersWinsLosses(teamMatchups, helper, rosterId1);
        var team1Result = winsRow.getElementsByClassName('custom-team1-result')[0];
        var team2Result = winsRow.getElementsByClassName('custom-team2-result')[0];
        team1Result.innerText = winsLosses.team1.wins;
        team2Result.innerText = winsLosses.team2.wins;

        if (winsLosses.team1.wins > winsLosses.team2.wins) {
            winsRow.children[1].classList.add('custom-team1-superior');
            winsRow.children[1].classList.remove('custom-team2-superior');
        }
        else {
            winsRow.children[1].classList.add('custom-team2-superior');
            winsRow.children[1].classList.remove('custom-team1-superior');
        }
    }
    if(lossesRow)
    {
        var winsLosses = getRostersWinsLosses(teamMatchups, helper, rosterId1);
        var team1Result = lossesRow.getElementsByClassName('custom-team1-result')[0];
        var team2Result = lossesRow.getElementsByClassName('custom-team2-result')[0];
        team1Result.innerText = winsLosses.team1.losses;
        team2Result.innerText = winsLosses.team2.losses;

        if (winsLosses.team1.losses < winsLosses.team2.losses) {
            lossesRow.children[1].classList.add('custom-team1-superior');
            lossesRow.children[1].classList.remove('custom-team2-superior');
        }
            else {
                lossesRow.children[1].classList.add('custom-team2-superior');
                lossesRow.children[1].classList.remove('custom-team1-superior');
            }
        }
        if (avgPtsForRow) {
            var totalPoints = getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper);
            var team1Val = parseInt(totalPoints.team1.pointsFor) / teamMatchups.length;
            var team2Val = parseInt(totalPoints.team2.pointsFor) / teamMatchups.length;
            var team1Result = avgPtsForRow.getElementsByClassName('custom-team1-result')[0];
            var team2Result = avgPtsForRow.getElementsByClassName('custom-team2-result')[0];
            team1Result.innerText = team1Val.toFixed(2);
            team2Result.innerText = team2Val.toFixed(2);

            if (team1Val > team2Val) {
                avgPtsForRow.children[1].classList.add('custom-team1-superior');
                avgPtsForRow.children[1].classList.remove('custom-team2-superior');
            }
            else {
                avgPtsForRow.children[1].classList.add('custom-team2-superior');
                avgPtsForRow.children[1].classList.remove('custom-team1-superior');
            }
        }
        if (avgPtsAgnstRow) {
            var totalPoints = getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper);
            var team1Val = parseInt(totalPoints.team1.pointsAgainst) / teamMatchups.length;
            var team2Val = parseInt(totalPoints.team2.pointsAgainst) / teamMatchups.length;
            var team1Result = avgPtsAgnstRow.getElementsByClassName('custom-team1-result')[0];
            var team2Result = avgPtsAgnstRow.getElementsByClassName('custom-team2-result')[0];
            team1Result.innerText = team1Val.toFixed(2);
            team2Result.innerText = team2Val.toFixed(2);

            if (team1Val > team2Val) {
                avgPtsAgnstRow.children[1].classList.add('custom-team1-superior');
                avgPtsAgnstRow.children[1].classList.remove('custom-team2-superior');
            }
            else {
                avgPtsAgnstRow.children[1].classList.add('custom-team2-superior');
                avgPtsAgnstRow.children[1].classList.remove('custom-team1-superior');
            }
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

    for(matchup of teamMatchups)
    {
        var week = matchup.week;
        var season = matchup.year;
        delete matchup.week;
        delete matchup.year;
        var teamMatchups = helper.getMatchupWeekWinner(matchup, matchup[0].matchup_id);
        matchup.week = week;
        matchup.year = season;

        if(teamMatchups[0].roster_id === rosterId1)
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

    for (matchup of teamMatchups) {
        var week = matchup.week;
        var season = matchup.year;
        delete matchup.week;
        delete matchup.year;

        if (matchup[0].roster_id === rosterId1) {
            teamsPoints.team1.pointsFor += matchup[0].points;
            teamsPoints.team2.pointsAgainst += matchup[0].points;

            teamsPoints.team2.pointsFor += matchup[1].points;
            teamsPoints.team1.pointsAgainst += matchup[1].points;
        }
        else if (matchup[0].roster_id === rosterId2) {
            teamsPoints.team1.pointsFor += matchup[0].points;
            teamsPoints.team2.pointsAgainst += matchup[0].points;

            teamsPoints.team2.pointsFor += matchup[1].points;
            teamsPoints.team1.pointsAgainst += matchup[1].points;
        }

        matchup.week = week;
        matchup.year = season;

    }

    return teamsPoints;
}