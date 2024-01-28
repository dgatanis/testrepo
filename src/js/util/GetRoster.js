import { leagueID } from './leagueInfo.js';
console.log(leagueID);
async function getRostersForLeague(leagueID){
    const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
    const rosterData = await rosterResponse.json(); 

    if(localStorage.getItem("RosterData"))
    {
        localStorage.clear("RosterData");
    }
    
    if(typeof window !== 'undefined') {
        localStorage.setItem("RosterData", JSON.stringify(rosterData));
    }

    
}