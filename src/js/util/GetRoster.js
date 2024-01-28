import { leagueID } from './leagueInfo.js';
console.log(leagueID);
async function getRostersForLeague(leagueID){
    const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
    const rosterData = await rosterResponse.json(); 

    if(localStorage.getItem("RosterData"))
    {
        localStorage.clear("RosterData");
        localStorage.setItem("RosterData", JSON.stringify(rosterData));
    }
    else
    {
        localStorage.clear("RosterData");
        localStorage.setItem("RosterData", JSON.stringify(rosterData));
    }
    
}