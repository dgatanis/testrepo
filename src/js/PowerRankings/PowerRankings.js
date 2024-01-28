async function loadModalPowerRank(leagueId) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();

    var users = usersData.map((user) => user);

    for (let i=0; i<users.length; i++)
    {
        var updateForm = document.getElementById("UpdatePowerRankList");
        var newRow = createModalPowerRankList(i, users);
        updateForm.append(newRow);
    }
    
}

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


async function OpenTeamRosterModal(userid,teamname) {
    const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`); 
    const rosterData = await rosterResponse.json(); 
    
    var modalRosterTeamName = document.querySelector('#ModalRosterTeamName');
    var rosterTable = document.querySelector('#RosterTable');
    var tablebody = rosterTable.childNodes[3];
    
    //show table and set team name
    modalRosterTeamName.innerText = teamname;
  
    //Remove players in list
    while(tablebody.firstChild) {
      tablebody.removeChild(tablebody.firstChild);
    }
  
    //Create table rows for players
    const teams = rosterData.map((roster) => roster);
    for(let roster of teams) {
      if(roster.owner_id==userid)
      {
        for(let players of roster.players)
          {
            var tr = document.createElement("tr");
            var th = document.createElement("th");
            th.innerText="Position";
            th.setAttribute('scope', 'row');
            tr.appendChild(th);
            var td = document.createElement("td");
            td.innerText=players;
            tr.appendChild(td);
            tablebody.append(tr);
          }
      }
    }
}


function createModalPowerRankList (rownum, usersList) {

    //Create the row
    var powerRankRow = document.createElement("div");
    powerRankRow.setAttribute("id", "PowerRankRow_" + rownum);
    powerRankRow.setAttribute("class", "row");
    var rankTeamGroup = document.createElement("div");
    rankTeamGroup.setAttribute("class", "col");

    //Create ranking # and Team list
    var ranking = document.createElement("input");
    ranking.setAttribute("type", "text");
    ranking.setAttribute("class", "form-control custom-powerrank");
    ranking.value=rownum+1;
    ranking.setAttribute("readonly", true);
    var teamList = document.createElement("select");
    teamList.setAttribute("id", "PowerRankTeamList_" + rownum);
    teamList.setAttribute("class", "form-select custom-powerrank-team");
    teamList.setAttribute("aria-label", "PowerRankTeamList");
    teamList.setAttribute("onchange", 'hideShowSelectedOptions();');
    var defaultOption = document.createElement("option")
    defaultOption.setAttribute("selected", true);
    defaultOption.innerText="Choose Team";
    defaultOption.setAttribute("value", -1);

    //Add teams to list
    for(let user of usersList)
    {
        var options = document.createElement("option");
        if(user.metadata.team_name != undefined)
        {
            options.setAttribute("value", user.user_id);
            options.innerText=user.metadata.team_name;
        }
        else
        {
            options.setAttribute("value", user.user_id);
            options.innerText=user.display_name;
        }
        teamList.append(options);
    }
    teamList.prepend(defaultOption);

    //Add ranking # and teamList to div from above
    //Add that div to the row
    rankTeamGroup.prepend(ranking);
    rankTeamGroup.append(teamList);
    powerRankRow.prepend(rankTeamGroup);

    //Create comments input
    var comments = document.createElement("div");
    comments.setAttribute("class", "col");
    var commentText = document.createElement("textarea");
    commentText.setAttribute("class", "custom-powerrank-comments");
    commentText.setAttribute("type", "text");
    commentText.setAttribute("rows", 3);
    commentText.setAttribute("placeholder", "Comments");

    //Add comments to div
    //Add that div to the row
    comments.prepend(commentText);
    powerRankRow.append(comments);
    powerRankRow.append(document.createElement("HR"));

    return powerRankRow;
}

function hideShowSelectedOptions () {
    let powerRankingTeamList = document.querySelectorAll("[id^=PowerRankTeamList_]");

    for(let teamList of powerRankingTeamList)
    {
        if(teamList.value != -1) 
        {
            let selectedTeam = teamList.value;
            
            for(let otherTeamList of powerRankingTeamList)
            {
                let otherInputsValue = otherTeamList.value;
                console.log("otherInputsValue: " + otherInputsValue);
                console.log("selectedTeam: " + selectedTeam);

                if(otherInputsValue == selectedTeam)
                {
                    alert("Team " + teamList.value + " is listed twice in the rankings.");
                    return
                }
            }
        }
    }
}