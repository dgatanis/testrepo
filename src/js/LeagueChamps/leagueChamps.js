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
    leagueDisplayName
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
        
        return;
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

async function loadLeagueChamps(inauguralSeason) {

    var table = document.getElementById('LeagueChampsTable');
    var tableBody = table.children[0];
    var leagues = allTimeLeagueIds;

    var rosterId;

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
            
            tableBody.appendChild(leagueChampRow);
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
            
            tableBody.appendChild(leagueChampRow);
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

    var tr = document.createElement('tr');
    var thYear = document.createElement('th');
    var tdTeam = document.createElement('td');
    var teamImage = createOwnerAvatarImage(user.user_id);
    var teamName = document.createElement('div');

    teamName.setAttribute('class', 'custom-team-name');
    teamName.innerText=getTeamName(user.user_id);
    thYear.innerText = year;

    tdTeam.appendChild(teamImage);
    tdTeam.appendChild(teamName);

    if(matchups != null)
    {
        var finals = matchups.find(x => x.roster_id === parseInt(roster.roster_id));
        var highScorer = highScorerInMatchupStarters(finals.starters, finals.players_points);

        if(highScorer)
        {
            var playerDiv = createPlayerDiv(highScorer);

            tdTeam.appendChild(playerDiv);
        }

    }

    tr.appendChild(thYear);
    tr.appendChild(tdTeam);

    return tr;
}

function createPlayerDiv(highScorer) {

    var playerDiv = document.createElement('div');
    var playerName = document.createElement('div');
    var playerPts = document.createElement('div');
    var labelDiv = document.createElement('div');
    var label = document.createElement('div');
    var lionImg = document.createElement('img');
    var playerImg = createPlayerImage(highScorer.player_id);

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


    labelDiv.appendChild(label);
    labelDiv.appendChild(lionImg)
    playerDiv.appendChild(labelDiv);
    playerDiv.appendChild(playerImg);
    playerDiv.appendChild(playerName);
    playerDiv.appendChild(playerPts);
    
    return playerDiv;
}