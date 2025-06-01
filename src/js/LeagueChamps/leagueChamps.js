import { 
    rosters, 
    users, 
    players,
    matchups, 
    playoffs, 
    allTimeLeagueIds,
    createOwnerAvatarImage, 
    getRosterStats, 
    getTeamName,
    createNFLTeamImage, 
    highScorerInMatchupStarters,
    getFullPlayerName,
    createPlayerImage,
    setLeagueName,
    inauguralSeason,
    setLinkSource,
    leagueDisplayName,
    removeSpinner
} from '../util/helper.js';

let userData = users;
let rosterData = rosters;
let matchupData = matchups;
let playoffData = playoffs;
let playerData = players;

loadContents();

//This loads the page contents dynamically
async function loadContents() {

    setLeagueName("footerName");
    setLinkSource("keep-trade-cut");
    try{

        loadLeagueChamps(inauguralSeason);
        removeSpinner();
        return;
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

async function loadLeagueChamps(inauguralSeason) {

    var tableBody = document.getElementById('LeagueChampsTable');
    var row = document.createElement("div");
    var leagues = allTimeLeagueIds;
    var rosterId;

    row.setAttribute("class", "row");
    
    //Create rows for all of the league ids in sleeper
    for(let league of leagues.ATLeagueId)
    {
        var playoffRound = await getChampionshipPlayoffRound(league.league_id);
        
        if(playoffRound)
        {
            var roster = rosterData.find(x => x.roster_id === parseInt(playoffRound.w));//winner of the finals
            var user = userData.find(x => x.user_id === roster.owner_id);
            var matchups =  await getFinalsMatchups(league.league_id);
            var leagueChampRow = createLeagueChampRow(roster, user, league.year, matchups);
            
            row.appendChild(leagueChampRow);
            tableBody.appendChild(row);
        }

    }

    if (leagueDisplayName.toString().trim() == "Crush Cities") {
        //Create rows for league winners before move to sleeper
        for(var i = inauguralSeason-1; i>=2020; i--)
        {
            if(i == 2020)
            {
                rosterId = 7;
            }
            if(i == 2021)
            {
                rosterId = 4;
            }
            if(i == 2022)
            {
                rosterId = 2;
            }
            if(i == 2023)
            {
                rosterId = 10;
            }

            var roster = rosterData.find(x => x.roster_id === parseInt(rosterId));
            var user = userData.find(x => x.user_id === roster.owner_id);

            var leagueChampRow = createLeagueChampRow(roster, user, i);
            
            row.appendChild(leagueChampRow);
            tableBody.appendChild(row)
        }
    }
}

async function getChampionshipPlayoffRound(leagueId) {

    const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`); 
    const data = await res.json(); 

    for(let playoffRound of data)
    {
        if(playoffRound.r==3 && playoffRound.t1_from.w)
        {
            if(playoffRound.w)
            {
                return playoffRound;
            }
        }
    }
}

async function getFinalsMatchups(leagueId) {

    const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/17`);//last week of season  
    const data = await res.json(); 

    return data;
}

function createLeagueChampRow(roster, user, year, matchups = null) {

    var col = document.createElement('div');
    var year_div = document.createElement('div');
    var team_div = document.createElement('div');
    var teamImage = createOwnerAvatarImage(user.user_id);
    var teamName = document.createElement('div');

    teamName.setAttribute('class', 'custom-team-name');
    teamName.innerText=getTeamName(user.user_id);
    year_div.innerText = year;
    year_div.setAttribute('class', 'custom-year');
    team_div.setAttribute('class', 'custom-team');
    col.setAttribute("class", "col");
    team_div.appendChild(teamImage);
    team_div.appendChild(teamName);

    if(matchups != null)
    {
        var finals = matchups.find(x => x.roster_id === parseInt(roster.roster_id));
        var highScorer = highScorerInMatchupStarters(finals.starters, finals.players_points);

        if(highScorer)
        {
            var playerDiv = createPlayerDiv(highScorer);

            team_div.appendChild(playerDiv);
        }

    }

    col.appendChild(year_div);
    col.appendChild(team_div);

    return col;
}

function createPlayerDiv(highScorer) {

    var playerDiv = document.createElement('div');
    var playerContainer = document.createElement('div');
    var playerName = document.createElement('div');
    var playerPts = document.createElement('div');
    var labelDiv = document.createElement('div');
    var label = document.createElement('div');
    var lionImg = document.createElement('img');
    var playerImg = createPlayerImage(highScorer.player_id);

    labelDiv.setAttribute("class", "custom-label-container")
    label.innerText = 'King of the Finals';
    label.setAttribute('class','custom-finals-label');
    lionImg.setAttribute('src', '../src/static/images/lion.png');
    lionImg.setAttribute('class', 'custom-lion-image');
    lionImg.setAttribute('title', 'King of the Finals');
    playerPts.setAttribute('class', 'custom-player-pts');
    playerPts.innerText = highScorer.points + "pts";
    playerName.setAttribute('class', 'custom-player-name');
    playerName.innerText = getFullPlayerName(highScorer.player_id) + ":";
    playerDiv.setAttribute('class', 'custom-finals-player');
    playerContainer.setAttribute('class', 'custom-player-container');


    labelDiv.appendChild(label);
    labelDiv.appendChild(lionImg);
    playerContainer.appendChild(playerImg);
    playerContainer.appendChild(playerName);
    playerContainer.appendChild(playerPts);
    playerDiv.appendChild(labelDiv);
    playerDiv.appendChild(playerContainer);

    return playerDiv;
}