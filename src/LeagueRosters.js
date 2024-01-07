async function myFunction(){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`, {compress: true}).catch((err) => { console.error(err); });
  const rosters = await rosterResponse.json();
  console.log(rosters);
  return 
}
async function getLeagueData() { 
  const response = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/users`);
  const data = await response.json();
  const displayNames = data.map((user) => user.display_name);
  const usersElement = document.getElementById("myUsers");
  usersElement.textContent = 'User: ' + displayNames;
  return 
}

async function getUser(userId){
  const userResponse = await fetch(`https://api.sleeper.app/v1/user/${userId}`); 
  const userData = await userResponse.json(); 
  return { ...user, display_name: userData.display_name }; 
}