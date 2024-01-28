import { leagueID } from './leagueInfo';

async function getRostersForLeague(leagueID){
    const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
    const rosterData = await rosterResponse.json(); 

    console.log(rosterData);
  }