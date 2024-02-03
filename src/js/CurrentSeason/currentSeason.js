async function loadConstants() {
    try {
        const leagueInfo = await import('../util/leagueInfo.js');
        var leagueInfoLeagueId = leagueInfo.default();

        leagueInfoLeagueId.then((currentLeagueId) => {
            
            getTeamNamesForLeague(currentLeagueId);
            getOwnerAvatarForLeague(currentLeagueId);
            createMatchupsList();

        }).catch((error) => {
            console.error(`Error: ${error.message}`);
        });
    }
    catch (error) {
        console.log(error);
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
    }
    
}

async function loadMatchups(weekNumber) {
    const dataStorage = localStorage.getItem("RosterData")
    rosterData = JSON.parse(dataStorage); 

    const matchup = await fetch(`https://api.sleeper.app/v1/league/1003692635549462528/matchups/${weekNumber}`);
    const matchupData = await matchup.json(); 
    const matchups = matchupData.map((team) => team);
    const totalMatchups = matchups.length / 2;
    const idList = "matchupWeekList_" + weekNumber;
    var weekList = document.getElementById(idList);

    if(weekList.childElementCount <= 4)
    {
        for(let i =1; i <= totalMatchups; i++)
        {
            let matchupId = i;
            
            for(let matchup of matchups)
            {
                if(matchup.matchup_id == matchupId)
                {
                    var y = document.createElement("div");
                    let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                    y.id = "rosterid_" + matchup.roster_id;
                    y.innerText = matchup.roster_id + " " + matchup.points;
                    weekList.append(y);
                }
            }
            
            var x = document.createElement("li");
            x.setAttribute("class", "list-group-item");
            weekList.append(x);
        }
    }
}

async function OpenTeamRosterModal(userid,teamname,leagueID = "1046222222567784448") {
    
    var rosterData;

    if(localStorage.getItem("RosterData"))
    {
        const dataStorage = localStorage.getItem("RosterData")
        rosterData = JSON.parse(dataStorage);
    }
    else
    {
        const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
        rosterData = await rosterResponse.json(); 
    }
    
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

    //Loop through each roster of team and display player data for selected team
    for(let roster of teams) 
    {
      if(roster.owner_id==userid)
      {
        for(let players of roster.players)
        {
            if(localStorage.getItem("PlayerData"))
            {
                let playerDataStorage = localStorage.getItem("PlayerData");
                let playerData = JSON.parse(playerDataStorage);
                let player = playerData.players.find(e => e.player_id === parseInt(players));

                if(player)
                {
                    let playerName = player.firstname + " " + player.lastname;
                    var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    th.innerText=player.position;
                    th.setAttribute('scope', 'row');
                    tr.appendChild(th);
                    var td = document.createElement("td");
                    td.innerText=playerName;
                    tr.appendChild(td);
                    tablebody.append(tr);
                }
            }
        }
      }
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
                powerRanking.prepend(img);
            }
            else
            {
                var img = document.createElement("img");
                img.setAttribute('src', '../src/static/images/trashcan.jpg');
                img.setAttribute('class', "custom-avatar-list-group");
                img.setAttribute('id', user.user_id);
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

function createMatchupsList(){
    var x = document.getElementById("matchupWeeks");
    for(let i = 1; i<15; i++)
    {
        var y = createAccordianItem(i);
        x.append(y);
    }
}

function createMatchupButtonElement(weekNumber){
    var button = document.createElement("button");
    button.setAttribute("onclick", "loadMatchups('"+ weekNumber +"')");
    button.setAttribute("class", "accordion-button collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-toggle", "#week"+weekNumber);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "week"+weekNumber);

    return button;
}   

function createAccordianItem(weekNumber) {
    var headerId = "weekHeader_"+weekNumber
    var accordianItem = document.createElement("div");
    accordianItem.setAttribute("class", "accordion-item");

    var accordianHeader = document.createElement("h2");
    accordianHeader.setAttribute("class", "accordion-header");
    accordianHeader.setAttribute("id", headerId);

    var accordianCollapsible = document.createElement("div");
    accordianCollapsible.setAttribute("class", "accordion-collapse collapse");
    accordianCollapsible.setAttribute("aria-labelledby", headerId);
    accordianCollapsible.setAttribute("data-bs-parent", "#matchupWeeks");

    var accordianBody = document.createElement("div");
    accordianBody.setAttribute("class", "accordion-body");
    accordianBody.setAttribute("id","weekBody_"+weekNumber);
    
    accordianCollapsible.appendChild(accordianBody);

    accordianItem.appendChild(accordianHeader);
    accordianItem.appendChild(accordianCollapsible);

    return accordianItem;
}