async function getUsersForLeague(leagueId) {
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();

    return usersData;
}

async function getTeamNamesForLeague(leagueId,userid=-1) { 
    const usersData = getUsersForLeague(1046222222567784448);
    
    if(userid==-1)
    {
        const users = usersData.map((user) => user);
        var powerRank = 1;
        for (let user of users)
        {
            var powerRankingElementId = "PowerRanking_"+powerRank;
            var powerRanking = document.getElementById(powerRankingElementId);
            powerRanking.append(user.metadata.team_name);
            powerRank++;
        }
    }
    else
    {
        const users = usersData.map((user) => user);
        
        for (let user of users)
        {
            if(user.user_id==userid)
            {
                var powerRanking = document.getElementById("PowerRanking_1");
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
        const users = usersData.map((user) => user);
        var powerRank = 1;
        for (let user of users)
        {
            var powerRankingElementId = "PowerRanking_" + powerRank;
            var powerRanking = document.getElementById(powerRankingElementId);
            const avatarURL = user.metadata.avatar;
            if(avatarURL)
            {
                var img = document.createElement("img");
                img.setAttribute('src', avatarURL);
                img.setAttribute('class', "custom-avatar-list-group");
                img.setAttribute('id', user.user_id);
                img.setAttribute('title', 'Look at their wack ass lineup.');
                img.setAttribute('onclick', 'OpenTeamRoster(' + user.user_id + ', "' + user.metadata.team_name + '");');
                powerRanking.prepend(img);
            }
            powerRank++;
        }
    }
    else
    {
        const users = usersData.map((user) => user);
        for (let user of users)
        {
            if(user.user_id==userid)
            {
                var powerRanking = document.getElementById("PowerRanking_1");
                const avatarURL = user.metadata.avatar;
                var img = document.createElement("img");
                img.setAttribute('src', avatarURL);
                img.setAttribute('class', "custom-avatar-list-group");
                powerRanking.prepend(img);
            }

        }
    }


}