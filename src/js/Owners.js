async function getOwnersForLeague(leagueId) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();
    const displayNames = usersData.map((user) => user.metadata.team_name);
    console.log(displayNames);
    return 
  }