import { 
    rosters, 
    users, 
    matchups, 
    playoffs, 
    allTimeLeagueIds,
    createOwnerAvatarImage, 
    getRosterStats, 
    getTeamName,
    createNFLTeamImage 
} from '../util/helper.js';

let userData = users;
let rosterData = rosters;
let matchupData = matchups;
let playoffData = playoffs;

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
    for(var i = 2021; i<=inauguralSeason; i++)
    {

        if(i == 2020)
        {
            rosterId = 8;
        }
        if(i == 2021)
        {
            rosterId = 5;
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
        var rosterId = await getChampionForLeague('998356266604916736');//getChampionForLeague(league.league_id);
        var roster = rosterData.find(x => x.roster_id === parseInt(rosterId));
        var user = userData.find(x => x.user_id === roster.owner_id);

        var leagueChampRow = createLeagueChampRow(roster, user, league.year);
        
        tableBody.appendChild(leagueChampRow);
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
                return playoffRound.w;
            }
        }
    }
}

function createLeagueChampRow(roster, user, year) {

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

    tr.appendChild(thYear);
    tr.appendChild(tdTeam);

    return tr;
}