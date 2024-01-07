async function myFunction(){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`, {compress: true}).catch((err) => { console.error(err); });
  const rosters = await rosterResponse.json();
  console.log(rosters);
  return 
}
async function getLeagueData() { 
  const response = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/users`); 
  const users = await response.json(); const matchupsResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/matchups/4`); 
  const matchups = await matchupsResponse.json(); const usersByMatchup = matchups.map(matchup => { 
      const userIDs = matchup.users; 
      const matchupUsers = userIDs.map(userID => { 
          const user = users.find(user => user.user_id === userID); 
          const userResponse = await fetch(`https://api.sleeper.app/v1/user/${user.user_id}`); 
          const userData = await userResponse.json(); 
          return { ...user, display_name: userData.display_name }; 
      }); 
      return matchupUsers; 
  }); 
  return { usersByMatchup, matchups }; 
}

// Call start
(async() => {
  console.log('before start');

  await start();
  
  console.log('after start');
})();
