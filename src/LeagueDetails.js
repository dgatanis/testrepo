async function getLeagueData() { 
  const response = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/users`);
  const data = await response.json();
  const users = data.map((user) => user.user_id);
  const displayNames = data.map((user) => user.metadata.team_name);
  const usersElement = document.getElementById("myUsers");
  return 
}

async function getRostersForLeague(leagueId){
  const userResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`); 
  const userData = await userResponse.json(); 
  const usersElement = document.getElementById("myUsers");
  for (let users of userData) {
    usersElement.append(users.players + '\n');
  }
}