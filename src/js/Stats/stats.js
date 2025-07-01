import { 
    rosters, 
    users, 
    players, 
    matchups, 
    playoffs, 
    getFullPlayerName, 
    createOwnerAvatarImage, 
    getRosterStats, 
    sortTeamRankings, 
    createPlayerImage,
    getTeamName,
    getMatchupWeekWinner,
    getRosterHighScorerWeek,
    getRosterLowScorerWeek,
    highScorerInMatchupStarters,
    allTimeMatchupData,
    setLeagueName,
    setLinkSource,
    removeSpinner
    } from '../util/helper.js';
import { 
    getCurrentSeason,
    getCurrentWeek
        } from '../util/leagueInfo.js';

let userData = users;
let rosterData = rosters;
let playerData = players;
let matchupData = matchups;
let playoffData = playoffs;
let allTimeMatchups = allTimeMatchupData[0].matchupWeeks;

loadContents();

//This loads the page contents dynamically
function loadContents() {
    try{
        setLinkSource("keep-trade-cut");
        setLeagueName("footerName");
        initTableData();
        fillDropdownLists();
        hideShowTabs();
        removeSpinner();
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

function initTableData()
{
    var tables = ['allTimeLowScorerTeam','allTimeLowScorerPlayer','allTimeHighScorerTeam','allTimeHighScorerPlayer', 
                  'allTimeMostWins', 'allTimeMostLosses', 'allTimeHighScorerWeeks', 'allTimeLowScorerWeeks'];

    for(let table of tables)
    {
        setTableData(table);
    }

}

function getAllTimePlayerScores() {
    var playerScores = [];

    for (let matchupWeek of allTimeMatchups) {

        if (matchupWeek && matchupWeek.week != 0) {

            const matchupsLength = Object.keys(matchupWeek).length;
            for (let i = 0; i < matchupsLength; i++) {

                if (matchupWeek[i] && matchupWeek[i].matchup_id !== null && matchupWeek[i].starters && matchupWeek.week != 0) {
                    for (let starter of matchupWeek[i].starters) {
                        let player = playerData.players.find(e => e.player_id === starter);
                        if (matchupWeek[i].players_points[starter] && player && player.position != "DEF") {
                            playerScores.push({
                                "player_id": starter,
                                "player_points": matchupWeek[i].players_points[starter],
                                "season": matchupWeek.year,
                                "week": matchupWeek.week,
                                "roster_id": matchupWeek[i].roster_id,
                                "matchup_id": matchupWeek[i].matchup_id
                            });
                        }

                    }
                }
            }
        }
    }
    return playerScores;
}

function getAllTimeTeamScores() {
    var teamScores = [];
    for (let matchupWeek of allTimeMatchups) {

        if (matchupWeek && matchupWeek.week != 0) {

            const matchupsLength = Object.keys(matchupWeek).length;
            for (let i = 0; i < matchupsLength; i++) {

                if (matchupWeek[i] && matchupWeek[i].points && matchupWeek[i].matchup_id !== null) {
                    teamScores.push({
                        "roster_id": matchupWeek[i].roster_id,
                        "team_points": matchupWeek[i].points,
                        "season": matchupWeek.year,
                        "week": matchupWeek.week,
                        "matchup_id": matchupWeek[i].matchup_id
                    });
                }
            }
        }
    }


    return teamScores;
}

async function setTableData(tableName) {

    var thisTable = document.getElementById(tableName);
    var teamScores =  getAllTimeTeamScores();
    var playerScores =  getAllTimePlayerScores();
    var currentSeason = await getCurrentSeason();
    var currentWeek = await getCurrentWeek();
    

    if (tableName == 'allTimeLowScorerTeam') {
        var tableRows = thisTable.children[1].children;
        var sortedList = teamScores.sort(function (a, b) {
            
            if(a.week == currentWeek && a.season == currentSeason)
            {
                return 1;
            }
            if (a.team_points < b.team_points) {
                return -1;
            }
            if (a.team_points > b.team_points) {
                return 1;
            }
            return 0;
        });

        for (let i = 0; i < 10; i++) {
            let roster = rosterData.find(x => x.roster_id === sortedList[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');
            var season = document.createElement('div');
            var week = document.createElement('div');

            score.innerText = sortedList[i].team_points;
            teamImage.setAttribute('class','custom-small-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);
            season.setAttribute('class', 'custom-details-season');
            season.innerText = "'" + sortedList[i].season.slice(-2);
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "week " + sortedList[i].week;

            name.appendChild(teamImage);
            name.appendChild(team);
            details.setAttribute("onclick", "openMatchupsPage(" + sortedList[i].season + ", " + sortedList[i].week + ", " + sortedList[i].matchup_id + ")");
            details.append(week);
            details.append(season);
        }
    }
    else if (tableName == 'allTimeHighScorerTeam') {
        var tableRows = thisTable.children[1].children;
        var sortedList = teamScores.sort(function (a, b) {

            if(a.week == currentWeek && a.season == currentSeason)
            {
                return 1;
            }
            if (a.team_points > b.team_points) {
                return -1;
            }
            if (a.team_points < b.team_points) {
                return 1;
            }
            return 0;
        });

        for (let i = 0; i < 10; i++) {
            let roster = rosterData.find(x => x.roster_id === sortedList[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');
            var season = document.createElement('div');
            var week = document.createElement('div');

            score.innerText = sortedList[i].team_points;
            teamImage.setAttribute('class','custom-small-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);
            season.setAttribute('class', 'custom-details-season');
            season.innerText = "'" + sortedList[i].season.slice(-2);
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "week " + sortedList[i].week;

            name.appendChild(teamImage);
            name.appendChild(team);
            details.setAttribute("onclick", "openMatchupsPage(" + sortedList[i].season + ", " + sortedList[i].week + ", " + sortedList[i].matchup_id + ")");
            details.append(week);
            details.append(season);
        }
    }
    else if (tableName == 'allTimeLowScorerPlayer') {
        var tableRows = thisTable.children[1].children;
        var sortedList = playerScores.sort(function (a, b) {

            if(a.week == currentWeek && a.season == currentSeason)
            {
                return 1;
            }
            if (a.player_points < b.player_points) {
                return -1;
            }
            if (a.player_points > b.player_points) {
                return 1;
            }
            return 0;
        });

        for (let i = 0; i < 10; i++) {
            let roster = rosterData.find(x => x.roster_id === sortedList[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');
            var season = document.createElement('div');
            var week = document.createElement('div');


            name.innerText = getFullPlayerName(sortedList[i].player_id);
            score.innerText = sortedList[i].player_points;
            teamImage.setAttribute('class','custom-xsmall-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);
            season.setAttribute('class', 'custom-details-season');
            season.innerText = "'" + sortedList[i].season.slice(-2);
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "week " + sortedList[i].week;

            details.setAttribute("onclick", "openMatchupsPage(" + sortedList[i].season + ", " + sortedList[i].week + ", " + sortedList[i].matchup_id + ")");
            details.append(teamImage);
            details.append(team);
            details.append(week);
            details.append(season);
        }
    }
    else if (tableName == 'allTimeHighScorerPlayer') {
        var tableRows = thisTable.children[1].children;
        var sortedList = playerScores.sort(function (a, b) {

            if(a.week == currentWeek && a.season == currentSeason)
            {
                return 1;
            }
            if (a.player_points > b.player_points) {
                return -1;
            }
            if (a.player_points < b.player_points) {
                return 1;
            }
            return 0;
        });

        for (let i = 0; i < 10; i++) {
            let roster = rosterData.find(x => x.roster_id === sortedList[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');
            var season = document.createElement('div');
            var week = document.createElement('div');


            name.innerText = getFullPlayerName(sortedList[i].player_id);
            score.innerText = sortedList[i].player_points;
            teamImage.setAttribute('class','custom-xsmall-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);
            season.setAttribute('class', 'custom-details-season');
            season.innerText = "'" + sortedList[i].season.slice(-2);
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "week " + sortedList[i].week;

            details.setAttribute("onclick", "openMatchupsPage(" + sortedList[i].season + ", " + sortedList[i].week + ", " + sortedList[i].matchup_id + ")");
            details.append(teamImage);
            details.append(team);
            details.append(week);
            details.append(season);
        }
    }
    else if(tableName == 'allTimeMostWins') {
        var teamTotalWins = getAllTimeWins(currentWeek, currentSeason);
        var tableRows = thisTable.children[1].children;
        for (let i = 0; i < 10; i++) {
            let roster = rosterData.find(x => x.roster_id === teamTotalWins[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');
            
            score.innerText = teamTotalWins[i].wins;
            teamImage.setAttribute('class','custom-small-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);

            details.style.display = "none";
            name.append(teamImage);
            name.appendChild(team);
        }
    }
    else if(tableName == 'allTimeMostLosses') {
        var teamTotalLosses = getAllTimeLosses(currentWeek, currentSeason);
        var tableRows = thisTable.children[1].children;
        for (let i = 0; i < 10; i++) {
            let roster = rosterData.find(x => x.roster_id === teamTotalLosses[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');

            score.innerText = teamTotalLosses[i].losses;
            teamImage.setAttribute('class','custom-small-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);

            details.style.display = "none";
            name.append(teamImage);
            name.appendChild(team);

        }
    }
    else if(tableName == 'allTimeHighScorerWeeks') {
        var highScorers = getAllTimeHighScorerWeeks(currentWeek, currentSeason);
        var tableRows = thisTable.children[1].children;
        for (let i = 0; i < highScorers.length; i++) {
            let roster = rosterData.find(x => x.roster_id === highScorers[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');

            score.innerText = highScorers[i].amount;
            teamImage.setAttribute('class','custom-small-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);

            details.style.display = "none";
            name.append(teamImage);
            name.appendChild(team);
        }
    }
    else if(tableName == 'allTimeLowScorerWeeks') {
        var lowScorers = getAllTimeLowScorerWeeks(currentWeek, currentSeason);
        var tableRows = thisTable.children[1].children;
        for (let i = 0; i < lowScorers.length; i++) {
            let roster = rosterData.find(x => x.roster_id === lowScorers[i].roster_id);
            var name = tableRows[i].children[0].children[0];
            var details = tableRows[i].children[0].children[1];
            var score = tableRows[i].children[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            var team = document.createElement('div');

            score.innerText = lowScorers[i].amount;
            teamImage.setAttribute('class','custom-small-avatar');
            team.setAttribute('class', 'custom-details-team');
            team.innerText = getTeamName(roster.owner_id);

            details.style.display = "none";
            name.append(teamImage);
            name.appendChild(team);
        }
    }
}

function getAllTimeWins(currentWeek, currentSeason) {
    let winCounter = [];

    for(let week of allTimeMatchups)
    {  

        if (week[0] && (week.week != 0 && week.week <=14) && ((parseInt(week.year) == parseInt(currentSeason) && week.week < currentWeek) || parseInt(week.year) < parseInt(currentSeason)))
        {
            var thisWeek = week.week;
            var thisYear = week.year;
            var totalMatchups = Object.keys(week).length;

            delete week.week;
            delete week.year;
            
            for(var i = 1; i<totalMatchups/2; i++)
            {
                var winner = getMatchupWeekWinner(week,i)[0];
                if (winner) {
                    let rosterId = winner.roster_id;
                    let existingEntry = winCounter.find(entry => entry.roster_id === rosterId);

                    if (existingEntry) {
                        existingEntry.wins++;  // Increment wins count
                    } else {
                        winCounter.push({ roster_id: rosterId, wins: 1 });  // Initialize wins count
                    }
                }
            } 
            
            week.year = thisYear;
            week.week = thisWeek;
        }
    }
    
    winCounter.sort((a, b) => b.wins - a.wins);

    return winCounter;
}

function getAllTimeLosses(currentWeek, currentSeason) {
    let lossCounter = [];

    for(let week of allTimeMatchups)
    {  

        if(week[0] && (week.week != 0 && week.week <=14) && (parseInt(week.year) <= currentSeason && week.week < currentWeek || parseInt(week.year) < parseInt(currentSeason)))
        {
            
            var thisWeek = week.week;
            var thisYear = week.year;
            var totalMatchups = Object.keys(week).length;

            delete week.week;
            delete week.year;

            for(var i = 1; i<totalMatchups/2; i++)
            {
                var loser = getMatchupWeekWinner(week,i)[1]; //loser is second in list
                if (loser) {
                    let rosterId = loser.roster_id;
                    let existingEntry = lossCounter.find(entry => entry.roster_id === rosterId);

                    if (existingEntry) {
                        existingEntry.losses++;  // Increment loss count
                    } else {
                        lossCounter.push({ roster_id: rosterId, losses: 1 });  // Initialize loss count
                    }
                }
                
            } 

            week.year = thisYear;
            week.week = thisWeek;
        }
    }
    lossCounter.sort((a, b) => b.losses - a.losses);

    return lossCounter;
}

function getAllTimeHighScorerWeeks(currentWeek, currentSeason) {

    let counter = [];

    for(let roster of rosterData)
    {
        counter.push({roster_id: roster.roster_id, amount: 0});
    }
    for(let matchups of allTimeMatchups)
    {
       if(matchups[0] && (matchups.week != 0 && matchups.week <=14) && (parseInt(matchups.year) <= currentSeason && matchups.week < currentWeek || parseInt(matchups.year) < parseInt(currentSeason)))
       {
            var thisWeek = matchups.week;
            var thisYear = matchups.year;
            delete matchups.week;
            delete matchups.year;

            const highScorerRoster = getRosterHighScorerWeek(matchups);
            matchups.year = thisYear;
            matchups.week = thisWeek;
            
            let rosterId = highScorerRoster.roster_id;
            let existingEntry = counter.find(entry => entry.roster_id === rosterId);

            if (existingEntry) {
                existingEntry.amount++;  
            } else {
                counter.push({ roster_id: rosterId, amount: 1 });  
            }
       }
    }

    counter.sort((a, b) => b.amount - a.amount);

    return counter;
    
}

function getAllTimeLowScorerWeeks(currentWeek, currentSeason) {

    let counter = [];

    for(let roster of rosterData)
    {
        counter.push({roster_id: roster.roster_id, amount: 0});
    }
    for(let matchups of allTimeMatchups)
    {
       if(matchups[0] && (matchups.week != 0 && matchups.week <=14) && (parseInt(matchups.year) <= currentSeason && matchups.week < currentWeek || parseInt(matchups.year) < parseInt(currentSeason)))
       {
            var thisWeek = matchups.week;
            var thisYear = matchups.year;
            delete matchups.week;
            delete matchups.year;

            const lowScoreRoster = getRosterLowScorerWeek(matchups);
            matchups.year = thisYear;
            matchups.week = thisWeek;
            
            let rosterId = lowScoreRoster.roster_id;
            let existingEntry = counter.find(entry => entry.roster_id === rosterId);

            if (existingEntry) {
                existingEntry.amount++;  
            } else {
                counter.push({ roster_id: rosterId, amount: 1 });  
            }
       }
    }

    counter.sort((a, b) => b.amount - a.amount);

    return counter;
    
}

function fillDropdownLists() {
    var team_1 = document.getElementById('teamDropdown1');
    var team_2 = document.getElementById('teamDropdown2');

    for(let i = 0; i < rosterData.length; i++)
    {
        var listItem = document.createElement('li');
        var item = document.createElement('button');
        item.setAttribute('class', 'dropdown-item');
        item.setAttribute('type', 'button');
        item.innerText = getTeamName(rosterData[i].owner_id);
        listItem.addEventListener("click", function(event) {
            const selectedTeam = event.target.innerText; // The element that was clicked
            const teamButton = document.getElementById("teamButton1")
            teamButton.innerText = selectedTeam;
        });
        listItem.appendChild(item);
        team_1.appendChild(listItem);
    }

    for(let i = 0; i < rosterData.length; i++)
    {
        var listItem = document.createElement('li');
        var item = document.createElement('button');
        item.setAttribute('class', 'dropdown-item');
        item.setAttribute('type', 'button');
        item.innerText = getTeamName(rosterData[i].owner_id);
        listItem.addEventListener("click", function(event) {
            const selectedTeam = event.target.innerText; // The element that was clicked
            const teamButton = document.getElementById("teamButton2")
            teamButton.innerText = selectedTeam;
            
        });
        listItem.appendChild(item);
        team_2.appendChild(listItem);
    }
}

function hideShowTabs() {
    var statsDiv = document.getElementById("allTimeStats");
    var toolDiv = document.getElementById("teamComparisonTool");
    var statsTab = document.getElementById("statsTab");
    var toolTab = document.getElementById("teamCompTab");

    statsTab.addEventListener("click", function(event) {
        toolDiv.style.display = 'none';
        statsDiv.style.display = 'block';
    });
    toolTab.addEventListener("click", function(event) {
        statsDiv.style.display = 'none';
        toolDiv.style.display = 'block';
    });
}