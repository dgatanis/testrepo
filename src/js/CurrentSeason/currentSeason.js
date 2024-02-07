async function loadConstants() {
    try {
        const leagueInfo = await import('../util/leagueInfo.js');
        var leagueInfoLeagueId = leagueInfo.default();

        leagueInfoLeagueId.then((currentLeagueId) => {
            
            getTeamNamesForLeague(currentLeagueId);
            //getOwnerAvatarForLeague(currentLeagueId);
            createMatchupsList();

        }).catch((error) => {
            console.error(`Error: ${error.message}`);
        });
    }
    catch (error) {
        console.log(error);
    }

}

function getTeamNamesForLeague(leagueId) { 
    const userDataStorage = localStorage.getItem("UserData");
    userData = JSON.parse(userDataStorage);


    const users = userData.map((user) => user);
    var powerRank = 1;
    const sortedTeams = sortTeamRankings();
    
    for(let team of sortedTeams)
    {
        let user = userData.find(x => x.user_id === team.owner_id);
        var ownerImage = createOwnerAvatarImage(user.user_id);
        var powerRankingElementId = "PowerRanking_"+powerRank;
        var rosterButtonId = "GetRosterButton_"+powerRank;
        var powerRanking = document.getElementById(powerRankingElementId);
        var rosterButton = document.getElementById(rosterButtonId);
        powerRanking.append(ownerImage);
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

async function loadMatchups(weekNumber) {
    const rosterDataStorage = localStorage.getItem("RosterData")
    rosterData = JSON.parse(rosterDataStorage); 
    const userDataStorage = localStorage.getItem("UserData")
    userData = JSON.parse(userDataStorage); 
    const playerDataStorage = localStorage.getItem("PlayerData")
    playerData = JSON.parse(playerDataStorage); 

    //Need to change matchups to our league when go live
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
                    let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                    let user = userData.find(x => x.user_id === roster.owner_id);
                    let highestScorer = highScorerInMatchupStarters(matchup.starters, matchup.players_points);
                    let playerName = getFullPlayerName(highestScorer.player_id);
                    let playerPoints = highestScorer.points;

                    var matchupDiv = document.createElement("div");
                    var playerDiv = document.createElement("div");
                    var playerimg = createPlayerImage(highestScorer.player_id);
                    var teamImage = createOwnerAvatarImage(user.user_id);

                    playerDiv.innerText = playerName + ": " + playerPoints;
                    playerDiv.setAttribute("class", "custom-matchup-player");
                    playerDiv.prepend(playerimg);
                    matchupDiv.id = "rosterid_" + matchup.roster_id;
                    matchupDiv.setAttribute("class", "custom-matchup-row");

                    if(user.metadata.team_name != undefined)
                    {
                        matchupDiv.innerText = user.metadata.team_name + ": " + matchup.points;
                    }
                    else
                    {
                        matchupDiv.innerText = user.display_name; + ": " + matchup.points;
                    }
                    matchupDiv.prepend(teamImage);
                    matchupDiv.append(playerDiv);
                    weekList.append(matchupDiv);
                }
            }
            
            var x = document.createElement("li");
            x.setAttribute("class", "list-group-item custom-matchup-list-item");
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
    var rosterBody = document.getElementById("ModalRosterBody");
    
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
            var record = getTeamRecord(roster.owner_id);
            var teamRecord = document.createElement("div");
            teamRecord.innerText = "Wins:" + teamRecord.wins + " Losses:" + teamRecord.losses + " Pts:" + teamRecord.fpts;
            teamRecord.setAttribute("color", "black");
            rosterBody.appendChild(teamRecord);
            let sortedPlayers = sortByPosition(roster.players);
            for(let players of sortedPlayers)
            {
                if(localStorage.getItem("PlayerData"))
                {
                    let playerDataStorage = localStorage.getItem("PlayerData");
                    let playerData = JSON.parse(playerDataStorage);
                    let player = playerData.players.find(e => e.player_id === parseInt(players.player_id));

                    if(player)
                    {
                        let playerName = player.firstname + " " + player.lastname;
                        var playerimg = createPlayerImage(player.player_id);
                        var tr = document.createElement("tr");
                        var th = document.createElement("th");
                        th.innerText=player.position;
                        th.setAttribute('scope', 'row');
                        tr.appendChild(th);
                        var td = document.createElement("td");
                        td.innerText=playerName;
                        td.prepend(playerimg);
                        tr.appendChild(td);
                        tablebody.append(tr);
                    }
                }
            }
        }
    }
}

/*
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
*/
function highScorerInMatchupStarters(starters, playerPoints){

    let startersPoints = [];

    for(let starter of starters)
    {
        if(playerPoints[starter])
        {
            startersPoints.push({
                "player_id": starter,
                "points" : playerPoints[starter]
            });
        }
    }

    if(startersPoints)
    {
        startersPoints.sort((a, b) => b.points - a.points);

        let highestScorer = startersPoints[0];

        return highestScorer;
    }
}

function getFullPlayerName(playerid) {
    const playerDataStorage = localStorage.getItem("PlayerData")
    playerData = JSON.parse(playerDataStorage); 

    let player = playerData.players.find(x => x.player_id === parseInt(playerid));
    let playerName = player.firstname + " " + player.lastname;

    if(playerName)
    {
        return playerName;
    }
}

function sortByPosition(players) {
    const playerDataStorage = localStorage.getItem("PlayerData")
    playerData = JSON.parse(playerDataStorage); 
    let sortedPlayers = [];

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));
        if(thisPlayer)
        {
            
            sortedPlayers.push ({
                "player_id": thisPlayer.player_id,
                "position": thisPlayer.position
            });

        }
    }

    //return sorted by position
    return sortedPlayers.sort(function (a, b) {
        if (a.position == "QB" || (b.position == "K" || b.position == "DEF") || a.position < b.position && a.position != "K" ) {
          return -1;
        }
        if (a.position > b.position) {
          return 1;
        }
        return 0;
      });
}

function sortTeamRankings() {
    const rosterDataStorage = localStorage.getItem("RosterData");
    rosterData = JSON.parse(rosterDataStorage);

    const rosters = rosterData.map((x) => x);
    const sortedList = [];

    for(let roster of rosters)
    {
        sortedList.push({
            "owner_id": roster.owner_id,
            "wins": roster.settings.wins,
            "losses": roster.settings.losses,
            "ties": roster.settings.ties,
            "fpts": roster.settings.fpts
        });
    }

    if(sortedList)
    {
        return sortedList.sort(function (a, b) {
            if (a.wins > b.wins) {
              return -1;
            }
            if (a.wins < b.wins && a.fpts < b.fpts) {
              return 1;
            }
            return 0;
        });
    }

}

function getTeamRecord(rosterid) {
    const rosterDataStorage = localStorage.getItem("RosterData");
    rosterData = JSON.parse(rosterDataStorage);

    let roster = rosterData.find(x => x.roster_id === parseInt(rosterid));
    const teamRecord = [];

    if (roster)
    {
        teamRecord.push({
            "owner_id": roster.owner_id,
            "wins": roster.settings.wins,
            "losses": roster.settings.losses,
            "ties": roster.settings.ties,
            "fpts": roster.settings.fpts
        });
    }

    return console.log(teamRecord);
}

//HTML Create/edit elements functions below

function createMatchupsList(){
    var matchupDiv = document.getElementById("matchupWeeks");
    for(let i = 1; i<15; i++)
    {
        var accordionItem = createAccordionItem(i);
        matchupDiv.appendChild(accordionItem);
    }
}

function createAccordionItem(weekNumber) {
    var headerId = "weekHeader_" + weekNumber;

    var accordionItem = document.createElement("div");
    accordionItem.setAttribute("class", "accordion-item");

    var accordionHeader = document.createElement("h2");
    accordionHeader.setAttribute("class", "accordion-header");
    accordionHeader.setAttribute("id", headerId);

    var button = createMatchupButtonElement(weekNumber);
    accordionHeader.appendChild(button);

    var accordionCollapsible = document.createElement("div");
    accordionCollapsible.setAttribute("class", "accordion-collapse collapse");
    accordionCollapsible.setAttribute("aria-labelledby", headerId);
    accordionCollapsible.setAttribute("data-bs-parent", "#matchupWeeks");
    accordionCollapsible.setAttribute("id", "week_" + weekNumber);

    var accordionBody = document.createElement("div");
    accordionBody.setAttribute("class", "accordion-body custom-matchup-list");

    var listItems = createMatchupListElement(weekNumber);

    //Add list items to body and add them to the collapsible
    accordionBody.appendChild(listItems);
    accordionCollapsible.appendChild(accordionBody);
    
    //add header and collapsible with sub items to whole accordion
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapsible);

    return accordionItem;
}

function createOwnerAvatarImage(userId) { 
    const dataStorage = localStorage.getItem("UserData")
    userData = JSON.parse(dataStorage);

    let user = userData.find(x => x.user_id === userId);
    const avatarURL = user.metadata.avatar;
    
    if(avatarURL)
    {
        var img = document.createElement("img");
        img.setAttribute('src', avatarURL);
        img.setAttribute('class', "custom-avatar-list-group");
        img.setAttribute('id', user.user_id);
    }
    else
    {
        var img = document.createElement("img");
        img.setAttribute('src', '../src/static/images/trashcan.jpg');
        img.setAttribute('class', "custom-avatar-list-group");
        img.setAttribute('id', user.user_id);
    }
    return img;
}

function createPlayerImage(playerId) {
    let playerDataStorage = localStorage.getItem("PlayerData");
    let playerData = JSON.parse(playerDataStorage);
    let player = playerData.players.find(e => e.player_id === parseInt(playerId));

    if(player)
    {
        let playerName = player.firstname + " " + player.lastname;
        var playerimg = document.createElement("img");
        playerimg.setAttribute("src", "https://sleepercdn.com/content/nfl/players/thumb/"+player.player_id+".jpg");
        playerimg.setAttribute('class', "custom-avatar-list-group");

        return playerimg;
    }
}

function createMatchupButtonElement(weekNumber){
    var button = document.createElement("button");
    button.setAttribute("onclick", "loadMatchups('"+ weekNumber +"');");
    button.setAttribute("class", "accordion-button custom-matchup-week collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", "#week_"+weekNumber);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "week_"+weekNumber);
    button.setAttribute("id","buttonWeek_"+weekNumber)
    button.innerText="Week #"+weekNumber;

    return button;
}   

function createMatchupListElement(weekNumber) {
    var list = document.createElement("ul");
    list.setAttribute("id", "matchupWeekList_"+weekNumber);
    list.setAttribute("class", "list-group custom-matchup-list list-group-flush");

    var firstListItem = document.createElement("li");
    firstListItem.setAttribute("class", "h4 list-group-item custom-matchup-list-item shadow p-3 mb-5 bg-body rounded");
    firstListItem.innerText="Matchups and High Scorer";

    list.appendChild(firstListItem);

    return list;
}