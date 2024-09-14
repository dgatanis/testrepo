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
        removeSpinner();
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

function initTableData()
{
    var tables = ['allTimeLowScorerTeam','allTimeLowScorerPlayer','allTimeHighScorerTeam','allTimeHighScorerPlayer'];

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

                if (matchupWeek[i] && matchupWeek[i].starters && matchupWeek.week != 0) {
                    for (let starter of matchupWeek[i].starters) {
                        let player = playerData.players.find(e => e.player_id === starter);
                        if (matchupWeek[i].players_points[starter] && player.position != "DEF") {
                            playerScores.push({
                                "player_id": starter,
                                "player_points": matchupWeek[i].players_points[starter],
                                "season": matchupWeek.year,
                                "week": matchupWeek.week,
                                "roster_id": matchupWeek[i].roster_id
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

                if (matchupWeek[i] && matchupWeek[i].points) {
                    teamScores.push({
                        "roster_id": matchupWeek[i].roster_id,
                        "team_points": matchupWeek[i].points,
                        "season": matchupWeek.year,
                        "week": matchupWeek.week
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
            
            if(a.week == currentWeek)
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
            season.innerText = sortedList[i].season;
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "wk: " + sortedList[i].week;

            name.appendChild(teamImage);
            name.appendChild(team);
            details.append(week);
            details.append(season);
        }
    }
    else if (tableName == 'allTimeHighScorerTeam') {
        var tableRows = thisTable.children[1].children;
        var sortedList = teamScores.sort(function (a, b) {

            if(a.week == currentWeek)
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
            season.innerText = sortedList[i].season;
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "wk: " + sortedList[i].week;

            name.appendChild(teamImage);
            name.appendChild(team);
            details.append(week);
            details.append(season);
        }
    }
    else if (tableName == 'allTimeLowScorerPlayer') {
        var tableRows = thisTable.children[1].children;
        var sortedList = playerScores.sort(function (a, b) {

            if(a.week == currentWeek)
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
            season.innerText = sortedList[i].season;
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "wk: " + sortedList[i].week;

            details.append(teamImage);
            details.append(team);
            details.append(week);
            details.append(season);
        }
    }
    else if (tableName == 'allTimeHighScorerPlayer') {
        var tableRows = thisTable.children[1].children;
        var sortedList = playerScores.sort(function (a, b) {

            if(a.week == currentWeek)
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
            season.innerText = sortedList[i].season;
            week.setAttribute('class', 'custom-details-week');
            week.innerText = "wk: " + sortedList[i].week;

            details.append(teamImage);
            details.append(team);
            details.append(week);
            details.append(season);
        }
    }

}