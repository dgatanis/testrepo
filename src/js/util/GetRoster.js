import { leagueID } from './leagueInfo.js';

setRosterData();

function setRosterData () {

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