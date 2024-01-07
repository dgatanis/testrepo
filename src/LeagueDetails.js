async function myFunction(){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`, {compress: true}).catch((err) => { console.error(err); });
  const rosters = await rosterResponse.json();
  console.log(rosters);
  return 
}
async function getLeagueData() { 
  const response = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/users`);
  const data = await response.json();
  const users = data.map((user) => user.user_id);
  const displayNames = data.map((user) => user.metadata.team_name);
  const usersElement = document.getElementById("myUsers");
  for (let userId of users) {
    for (let team of displayNames) {
      usersElement.append('User: ' + team);
      getRosterForUser(userId);
    }
  }
  //usersElement.textContent = 'User: ' + displayNames;
  return 
}

async function getRosterForUser(userId){
  const userResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`); 
  const userData = await userResponse.json(); 
  const usersElement = document.getElementById("myUsers");
  usersElement.append("test");
  //return
}