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
        const users = usersData.map((user) => user);

        for (let user of users)
        {
            if(user.user_id==userid)
            {
                var powerRanking = document.getElementById("PowerRanking1");
                powerRanking.innerHTML=user.metadata.team_name
            }
        }
        return "displayNames";
    }
    
}

async function getOwnerAvatarForLeague(leagueId,userid=-1) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();

    if(userid==-1)
    {    
        const avatarURL = usersData.map((user) => user.metadata.avatar);
        for (let avatar of avatarURL)
        {
            var img = document.createElement("img");
            img.setAttribute('src', avatar);
            document.body.appendChild(img);
        }
    }
    else
    {
        const users = usersData.map((user) => user);
        for (let user of users)
        {
            if(user.user_id==userid)
            {
                var powerRanking = document.getElementById("PowerRanking1");
                const avatarURL = user.metadata.avatar;
                var img = document.createElement("img");
                img.setAttribute('src', avatarURL);
                img.setAttribute('class', "custom-avatar-list-group");
                powerRanking.prepend(img);
            }

        }
    }


}