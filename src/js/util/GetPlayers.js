import { leagueID } from './leagueInfo.js';


setPlayerData();

function setPlayerData () {

    if(!localStorage.getItem("PlayerData"))
    {
        getPlayers();
    }
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