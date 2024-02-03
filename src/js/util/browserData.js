import getCurrentLeagueId from './leagueInfo.js';

const currentLeague = await getCurrentLeagueId();

currentLeague.then((currentLeagueIds) => {
            console.log(currentLeagueIds);
            }).catch((error) => {
                console.error(`Error fetching currentLeagueID: ${error.message}`);
            });

function setBrowserData(leagueID) {
    const expiration = new Date().getTime() + (3*60*60*1000);
    const now = new Date().getTime();
    
    if(!localStorage.getItem("expiration") || localStorage.getItem("expiration") < now)
    {
        localStorage.clear();
        localStorage.setItem("expiration", expiration);
        setPlayerData();
        setRosterData(leagueID);
    }
}


function setPlayerData () {

    if(!localStorage.getItem("PlayerData"))
    {
        getPlayers();
    }
}

function setRosterData (leagueID) {

    if(!localStorage.getItem("RosterData"))
    {
        getRostersForLeague(leagueID);
    }
}

async function getRostersForLeague(leagueID){
    const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
    const rosterData = await rosterResponse.json(); 
    localStorage.setItem("RosterData", JSON.stringify(rosterData));
}

async function getPlayers() {
    
    //Need to figure out how to iterate over json created in this script
    
    var myPlayerMap = { 
        "players" : []
    };
    const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
    const data = await res.json();
    const players = Object.keys(data);

    for(let i=1; i<players.length; i++)
    {
        if(data[i])
        {
            myPlayerMap.players.push({
                "player_id": i,
                "position": data[i].position,
                "firstname": data[i].first_name,
                "lastname": data[i].last_name
            });     
        }
    }

    localStorage.setItem("PlayerData", JSON.stringify(myPlayerMap));

}