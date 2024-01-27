async function getTeamNamesForLeague(leagueId,userid=-1) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();
    if(userid==-1)
    {
        const users = usersData.map((user) => user);
        var powerRank = 1;
        for (let user of users)
        {
            var powerRankingElementId = "PowerRanking_"+powerRank;
            var rosterButtonId = "GetRosterButton_"+powerRank;
            var powerRanking = document.getElementById(powerRankingElementId);
            var rosterButton = document.getElementById(rosterButtonId);

            if(user.metadata.team_name != undefined)
            {
                powerRanking.append(user.metadata.team_name);
                rosterButton.setAttribute("onclick", "OpenTeamRosterModal(" + user.user_id + ", '" + user.metadata.team_name + "')");
            }
            else
            {
                powerRanking.append(user.display_name);
                rosterButton.setAttribute("onclick", "OpenTeamRosterModal(" + user.user_id + ", '" + user.display_name + "')");
            }
            rosterButton.setAttribute('title', 'Look at their wack ass lineup.');
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


async function getTeamNamesForPowerRank(leagueId) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();

    const users = usersData.map((user) => user);

    for (let user of users)
    {
        var powerRankingElementId = "PowerRankTeamList";
        var powerRanking = document.getElementById(powerRankingElementId);

        if(user.metadata.team_name != undefined)
        {
            var teamList = document.createElement("option");
            teamList.setAttribute("value", user.user_id);
            teamList.innerText=user.metadata.team_name;
            powerRanking.prepend(teamList);
        }
        else
        {
            var teamList = document.createElement("option");
            teamList.setAttribute("value", user.user_id);
            teamList.innerText=user.display_name;
            powerRanking.prepend(teamList);
        }
    }
    
}