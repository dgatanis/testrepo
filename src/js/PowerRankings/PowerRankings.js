async function loadPowerRankModal(leagueId) { 
    const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
    const usersData = await usersResponse.json();

    const users = usersData.map((user) => user);

    for (let i=0; i<users.length; i++)
    {
        var updateForm = document.getElementById("UpdatePowerRankList");
        var newRow = createPowerRankList(i, users[i].user_id);
        updateForm.append(newRow);
        // if(users[i].metadata.team_name != undefined)
        // {
        //     var teamList = document.createElement("option");
        //     teamList.setAttribute("id", users[i].user_id);
        //     teamList.setAttribute("value", (i+1))
        //     teamList.innerText=users[i].metadata.team_name;
        //     powerRanking.prepend(teamList);
        // }
        // else
        // {
        //     var teamList = document.createElement("option");
        //     teamList.setAttribute("value", users[i].user_id);
        //     teamList.setAttribute("value", (i+1))
        //     teamList.innerText=users[i].display_name;
        //     powerRanking.prepend(teamList);
        // }
    }
    
}

function createPowerRankList (id, userid) {
    var powerRankRow = document.createElement("div");
    powerRankRow.setAttribute("id", "PowerRankRow_" + id);
    powerRankRow.setAttribute("class", "row");

    var rankTeamGroup = document.createElement("div");
    rankTeamGroup.setAttribute("class", "col");

    var ranking = document.createElement("input");
    ranking.setAttribute("type", "text");
    ranking.setAttribute("class", "form-control custom-powerrank")
    ranking.setAttribute("readonly", true);

    var selectList = document.createElement("select");
    selectList.setAttribute("id", "PowerRankList");
    selectList.setAttribute("class", "form-select custom-powerrank-team");
    selectList.setAttribute("aria-label", "PowerRankTeamList");

    powerRankRow.prepend(rankTeamGroup);
    rankTeamGroup.prepend(ranking);
    rankTeamGroup.append(selectList);

    var comments = document.createElement("div");
    comments.setAttribute("class", "col");

    var commentText = document.createElement("textarea");
    commentText.setAttribute("class", "custom-powerrank-comments");
    commentText.setAttribute("type", "text");
    commentText.setAttribute("rows", 3);
    commentText.setAttribute("placeholder", "Comments");

    comments.prepend(commentText);
    powerRankRow.append(comments);

    return powerRankRow;
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
