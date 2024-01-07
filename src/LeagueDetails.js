async function getLeagueData() { 
  const response = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/users`);
  const data = await response.json();
  const users = data.map((user) => user.user_id);
  const displayNames = data.map((user) => user.metadata.team_name);
  const usersElement = document.getElementById("myUsers");
  return 
}

async function getRostersForLeague(leagueId){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`); 
  const rosterData = await rosterResponse.json(); 
  const usersElement = document.getElementById("myUsers");
  for (let users of rosterData) {
    usersElement.append(users.players + '\n');
  }
  console.log(rosterData);
}