import { leagueID } from './leagueInfo.js';
console.log(leagueID);
async function getRostersForLeague(leagueID){
    const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
    const rosterData = await rosterResponse.json(); 
    console.log(JSON.stringify(rosterData));
    localStorage.setItem("RosterData", JSON.stringify(rosterData));
    
}