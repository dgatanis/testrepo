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
    getFullPlayerName
} from '../util/helper.js';

let userData = users;
let rosterData = rosters;
let matchupData = matchups;
let playoffData = playoffs;
let playerData = players;

loadContents();

//This loads the page contents dynamically
async function loadContents() {

    try{

        const leagueInfo = await import('../util/leagueInfo.js');
        const inauguralSeason = leagueInfo.inauguralSeason;

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

    //Create rows for league winners before move to sleeper
    for(var i = 2020; i<inauguralSeason; i++)
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

    for(let league of leagues.ATLeagueId)
    {
        var playoffRound = await getChampionForLeague('998356266604916736');//getChampionForLeague(league.league_id);
        
        if(playoffRound)
        {
            var roster = rosterData.find(x => x.roster_id === parseInt(playoffRound.w));//winner of the finals
            var user = userData.find(x => x.user_id === roster.owner_id);

            var leagueChampRow = createLeagueChampRow(roster, user, league.year);
            
            tableBody.appendChild(leagueChampRow);
        }

    }
}

async function getChampionForLeague(leagueId) {

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

async function createLeagueChampRow(roster, user, year) {

    var tr = document.createElement('tr');
    var thYear = document.createElement('th');
    var tdTeam = document.createElement('td');
    var teamImage = createOwnerAvatarImage(user.user_id);
    var teamName = document.createElement('div');

    if(year >= 2024)
    {
        var matchups =  await getFinalsMatchups(league.league_id);
        var finals = matchups.find(x => x.roster_id === parseInt(roster.roster_id));
        var highScorer = highScorerInMatchupStarters(finals.starters, finals.players_points);


        var playerName = document.createElement('div');
        playerName.innerText = getFullPlayerName(highScorer.player_id);

        //teamName.append(playerName);
    }

    teamName.setAttribute('class', 'custom-team-name');
    teamName.innerText=getTeamName(user.user_id);
    thYear.innerText = year;

    tdTeam.appendChild(teamImage);
    tdTeam.appendChild(teamName);

    tr.appendChild(thYear);
    tr.appendChild(tdTeam);

    return tr;
}