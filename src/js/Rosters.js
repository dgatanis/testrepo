async function getRostersForLeague(leagueId){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`); 
  const rosterData = await rosterResponse.json(); 
  const usersElement = document.getElementById("myUsers");
  for (let users of rosterData) {
    usersElement.append(users.players + '\n');
  }
  console.log(rosterData);
}