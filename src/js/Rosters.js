async function getRostersForLeague(leagueId){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`); 
  const rosterData = await rosterResponse.json(); 
  const usersElement = document.getElementById("myUsers");
  for (let users of rosterData) {
    usersElement.append(users.players + '\n');
  }
  console.log(rosterData);
}

async function OpenTeamRoster(userid,teamname) {
  console.log("MyTest()" + userid);

  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`); 
  const rosterData = await rosterResponse.json(); 
  
}