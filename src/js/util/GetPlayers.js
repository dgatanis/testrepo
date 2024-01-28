import { leagueID } from './leagueInfo.js';


setPlayerData();

function setPlayerData () {

    if(!localStorage.getItem("PlayerData"))
    {
        getPlayers(leagueID);
    }
}


async function getPlayers(leagueID) {
    let playersInfo = null;

    const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
    const data = await res.json();
    const players = Object.keys(data)
    let counter = 0;
    
    for(let player of players)
    {
        counter++;
        if(counter < 11)
        {
            console.log(player.search_full_name);
        }
        
        //localStorage.setItem("PlayerData", JSON.stringify(testing))
    }
    
}