async function getTeamNamesForLeague(leagueId,userid=-1) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();
    if(userid==-1)
    {
        const displayNames = usersData.map((user) => user.metadata.team_name);
        return displayNames;
    }
    else
    {
        return "displayNames";
    }
    
}

async function getOwnerAvatarForLeague(leagueId) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();
    const avatarURL = usersData.map((user) => user.metadata.avatar);
    for (let avatar of avatarURL)
    {
        var img = document.createElement("img");
        img.setAttribute('src', avatar);
        document.body.appendChild(img);
    }
}