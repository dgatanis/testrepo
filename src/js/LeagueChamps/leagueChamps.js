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
        const currentLeagueId = await leagueInfo.default();

        loadLeagueChamps();
        return;
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

function loadLeagueChamps() {

    var leagues = allTimeLeagueIds

    for(let league of leagues.ATLeagueId)
    {
        var rosterId = getChampionForLeague('998356266604916736');//getChampionForLeague(league.league_id);
        var roster = rosterData.find(x => x.roster_id === parseInt(rosterId));
        var user = userData.find(x => x.user_id === parseInt(roster.owner_id));

        var div = document.getElementById('myFirstTest');

        // var test = createOwnerAvatarImage(user.user_id);
        // div.append(test);
        div.innerText = getTeamName(user.user_id);
    }
}

async function getChampionForLeague(leagueId) {

    const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/winners_bracket`); 
    const data = await res.json(); 

    var playoffData = JSON.parse(data);

    for(let playoffRound of playoffData)
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