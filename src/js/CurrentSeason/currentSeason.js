const rosterDataStorage = localStorage.getItem("RosterData");
const rosterData = JSON.parse(rosterDataStorage); 
const userDataStorage = localStorage.getItem("UserData");
const userData = JSON.parse(userDataStorage);
const playerDataStorage = localStorage.getItem("PlayerData");
const playerData = JSON.parse(playerDataStorage); 
 
const matchupWeekStorage = sessionStorage.getItem("MatchupData");
const matchupData = JSON.parse(matchupWeekStorage); 

let tries = 0;
async function loadConstants() {

    try{
        const leagueDataStorage = localStorage.getItem("LeagueData");
        const leagueData = JSON.parse(leagueDataStorage);
        const leagueInfo = await import('../util/leagueInfo.js');
        var leagueInfoLeagueId = leagueInfo.default();
        var currentWeek = leagueInfo.getCurrentWeek();
        var dues = leagueInfo.dues;
        loadSeasonRankings(leagueData.league_id);
        loadMatchupsList();
        return -1;
    }
    catch (error){
        tries++;
        console.error(`Error: ${error.message}`);
    }

}

function loadSeasonRankings(leagueId) { 

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

/*
** Async functions **
*/          

async function loadMatchups(weekNumber) {

    const noMatchup = document.getElementById("nomatchups_"+weekNumber);
    var noMatchupClassList = noMatchup.classList;

    try{

        var arrayNum = parseInt(weekNumber) - 1;
        const matchups = matchupData[0].matchupWeeks[arrayNum];

        if(matchups)
        {
            const matchupsLength = Object.keys(matchups).length;

            const highScoreTeam = getRosterHighScorerWeek(matchups);
            const totalMatchups = matchupsLength / 2;

            var weekList = document.getElementById("matchupWeekList_" + weekNumber);
            var highScoringWeekRoster = highScoreTeam.roster_id;

            for(let i =1; i <= totalMatchups; i++)
            {
                let matchupId = i;
                
                for(let j=0; j<matchupsLength; j++)
                {
                    let matchup = matchups[j];

                    if(matchup.matchup_id == matchupId)
                    {
                        let userName;
                        let winningTeam = getMatchupWeekWinner(matchups, matchup.matchup_id);
                        let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                        let user = userData.find(x => x.user_id === roster.owner_id);
                        
                        let highestScorer = highScorerInMatchupStarters(matchup.starters, matchup.players_points);
                        let playerName = getFullPlayerName(highestScorer.player_id);
                        let playerPoints = highestScorer.points + " pts";

                        var matchupDiv = document.createElement("div");
                        var playerDiv = document.createElement("div");
                        var playerimg = createPlayerImage(highestScorer.player_id);
                        var teamImage = createOwnerAvatarImage(user.user_id);
                        var teamPoints = document.createElement('font');

                        playerDiv.innerText = playerName + ": " + playerPoints;
                        playerDiv.setAttribute("class", "custom-matchup-player");
                        playerDiv.prepend(playerimg);
                        matchupDiv.id = "rosterid_" + matchup.roster_id;
                        matchupDiv.setAttribute("class", "custom-matchup-row");
                        teamPoints.innerText = matchup.points + " pts";

                        if(user.metadata.team_name != undefined)
                        {
                            matchupDiv.innerText= user.metadata.team_name + ": "
                        }
                        else
                        {
                            matchupDiv.innerText= user.display_name + ": "
                        }

                        if(winningTeam[0].roster_id == roster.roster_id)
                        {
                            
                            teamPoints.setAttribute('color', '#006f00');
                        }
                        else
                        {
                            teamPoints.setAttribute('color', '#cb1919');
                        }

                        matchupDiv.append(teamPoints);

                        if(roster.roster_id == highScoringWeekRoster)
                        {
                            var highScorerDiv = document.createElement("div");
                            var weeklyHighScorer = createMatchupWeekHighScorerImg();

                            matchupDiv.appendChild(weeklyHighScorer);
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

            //hide no matchups div
            if(noMatchupClassList.contains('custom-block-display'))
            {
                noMatchup.classList.remove('custom-block-display');
                noMatchup.classList.add('custom-none-display');
            }
                    
        }
        else
        {
            //show no matchups div
            if(noMatchupClassList.contains('custom-none-display'))
            {
                noMatchup.classList.remove('custom-none-display');
                noMatchup.classList.add('custom-block-display');
            }
        }
    }
    catch (error){
        console.log(error);
    }
}

async function OpenTeamRosterModal(userid,teamname) {
    
    var modalRosterTeamName = document.querySelector('#ModalRosterTeamName');
    let myUserId = userid.toString();
    var rosterTable = document.querySelector('#RosterTable');
    var tablebody = rosterTable.childNodes[3];
    var rosterBody = document.getElementById("ModalRosterBody");
    const leaguePositionList = getLeaguePositions();

    modalRosterTeamName.innerText = teamname;

    rosterTable.classList.remove('table-dark');
    rosterTable.classList.add('table-secondary');
    
    
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
            var teamImage = createOwnerAvatarImage(roster.owner_id);
            modalRosterTeamName.prepend(teamImage);

            var rosterStats = getRosterStats(roster.roster_id);
            const record = document.getElementById("rosterRecord");
            const playerCount = document.getElementById("rosterPlayerCount");
            const leaguePositionsLink = document.getElementById("starterPositions");
            const age = document.getElementById("rosterAge");

            record.innerText = "Wins:" + rosterStats.wins + " Losses:" + rosterStats.losses + " Pts:" + rosterStats.fpts;
            playerCount.innerText = "QB:" + rosterStats.QB + " RB:"  + rosterStats.RB + " WR:" + rosterStats.WR + " TE:" + rosterStats.TE + " K:" + rosterStats.K;
            leaguePositionsLink.innerText = "Starters: (" + leaguePositionList + ")";
            leaguePositionsLink.title = "Toggle Starters";
            leaguePositionsLink.setAttribute('onclick', 'toggleStarters(' + roster.roster_id +')');
            age.innerText = rosterStats.AvgAge + " yrs";
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
                        let playerTeam = player.team;
                        var playerimg = createPlayerImage(player.player_id);
                        var tr = document.createElement("tr");
                        var th = document.createElement("th");
                        th.innerText=player.position;
                        th.setAttribute('scope', 'row');
                        tr.setAttribute('class', 'custom-shown-row')
                        tr.setAttribute('data-playerid', player.player_id);
                        tr.appendChild(th);
                        var nameOfPlayer = document.createElement("td");
                        nameOfPlayer.innerText=playerName + " (" + playerTeam + ")";
                        nameOfPlayer.prepend(playerimg);
                        tr.appendChild(nameOfPlayer);
                        var yrsExp = document.createElement("td");
                        yrsExp.innerText=player.age;
                        tr.appendChild(yrsExp);
                        tablebody.append(tr);
                    }
                }
            }
        }
    }
}

async function statsByWeek() {
    //Using specific week
    //Need to pull in current season and week (../2023/2)
    const res  = await fetch(`https://api.sleeper.app/v1/stats/nfl/regular/2023/2`); 
    const data = await res.json();
}

/*
** Helper functions **
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

    let player = playerData.players.find(x => x.player_id === parseInt(playerid));
    let playerName = player.firstname + " " + player.lastname;

    if(playerName)
    {
        return playerName;
    }
}

function sortByPosition(players) {
    let sortedPlayers = [];
    const sortedPositions = [];
    const qb = [];
    const rb = [];
    const wr = [];
    const te = [];
    const k = [];

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));
        if(thisPlayer)
        {
            if(thisPlayer.position == "QB")
            {
                qb.push ({
                "player_id": thisPlayer.player_id,
                "position": thisPlayer.position
                });   
            }
             if(thisPlayer.position == "RB")
            {
                rb.push ({
                "player_id": thisPlayer.player_id,
                "position": thisPlayer.position
                });   
            }
             if(thisPlayer.position == "WR")
            {
                wr.push ({
                "player_id": thisPlayer.player_id,
                "position": thisPlayer.position
                });   
            }
            if(thisPlayer.position == "TE")
            {
                te.push ({
                "player_id": thisPlayer.player_id,
                "position": thisPlayer.position
                });   
            }
            if(thisPlayer.position == "K")
            {
                k.push ({
                "player_id": thisPlayer.player_id,
                "position": thisPlayer.position
                });   
            }
        }
    }

    sortedPositions.push([qb, rb, wr, te, k]);

    for(let positions of sortedPositions)
    {
        for (let position of positions)
        {
            for (let player of position)
            {
                sortedPlayers.push ({
                    "player_id": player.player_id,
                    "position": player.position
                });
            }
        }
    }

    if(sortedPlayers)
    {
        return sortedPlayers;
    }
}

function sortTeamRankings() {

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

function getRosterStats(rosterid) {

    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));

    if(roster)
    {
        var playerPositionCount = calcPlayerPositions(roster.players);
        var playerAge = calcPlayerAge(roster.players);
        var teamRecord = getTeamRecord(rosterid);

        let rosterStatsArray = {
            ...playerPositionCount[0],
            ...playerAge[0],
            ...teamRecord[0]
        };

        return rosterStatsArray;
    }
}

function calcPlayerPositions(players){

    const calculatedPositions = [];
    var QB = 0;
    var RB = 0;
    var WR = 0;
    var TE = 0;
    var K = 0;

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));

        if(thisPlayer.position == "QB")
        {
            QB++;
        }
        if(thisPlayer.position == "RB")
        {
            RB++;
        }
        if(thisPlayer.position == "WR")
        {
            WR++;
        }
        if(thisPlayer.position == "TE")
        {
            TE++;
        }
        if(thisPlayer.position == "K")
        {
            K++;
        }
    }

    calculatedPositions.push({ 
        "QB": parseInt(QB),
        "RB": parseInt(RB),
        "WR": parseInt(WR),
        "TE": parseInt(TE),
        "K": parseInt(K)
    }); 

    return calculatedPositions;

}

function getTeamRecord(rosterid) {

    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));
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

    return teamRecord;
}

function calcPlayerAge(players) {

    const calculatedAge = [];
    var totalAge = 0;
    var avgAge;
    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));

        totalAge += parseInt(thisPlayer.age);
    }
    
    avgAge = totalAge / players.length;

    calculatedAge.push ({
        "AvgAge": avgAge.toFixed(2)
    });

    return calculatedAge;
}

function getRosterHighScorerWeek(matchups) {

    let rosters = [];
    let matchupsLength = Object.keys(matchups).length;

    for(let i =0; i<matchupsLength; i++)
    {
        rosters.push({
            "roster_id": matchups[i].roster_id,
            "points" : matchups[i].points
        });
    }

    rosters.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.points < b.points) {
          return 1;
        }
        return 0;
      });
    
    return rosters[0];
}

function getMatchupWeekWinner(matchups,matchupid) {

    let matchupScore = [];
    let matchupsLength = Object.keys(matchups).length;

    for(let i =0; i<matchupsLength; i++)
    {
        let matchup = matchups[i];

        if(matchup.matchup_id==matchupid)
        {
            matchupScore.push({
                "roster_id" : matchup.roster_id,
                "points": matchup.points,
                "matchup_id": matchup.matchup_id
            });
        }
    }


    return matchupScore.sort(function (a, b) {
                if (a.points > b.points) {
                return -1;
                }
                if (a.points < b.points) {
                return 1;
                }
                return 0;
            });
}

function getOwnerName(userId) {

    let user = userData.find(x => x.user_id === userId.toString());
    var ownerName;

    if(user.metadata.team_name != undefined)
    {
        ownerName = user.metadata.team_name;
    }
    else
    {
        ownerName = user.display_name;
    }

    return ownerName;
}

function toggleStarters(rosterId) {

    let roster = rosterData.find(x => x.roster_id === parseInt(rosterId));
    let tableRows = document.querySelectorAll('.custom-shown-row');
    let hiddenRows = document.querySelectorAll('.custom-hidden-row');
    let rosterTable = document.getElementById('RosterTable');

    let starters = roster.starters;

    if(hiddenRows.length > 0)
    {
        for(let row of hiddenRows)
        {
            row.setAttribute('class', 'custom-shown-row');
        }
        rosterTable.classList.add('table-secondary');
        rosterTable.classList.remove('table-dark');
    }
    else
    {
        for(let row of tableRows)
        {
            if(!starters.includes(row.dataset.playerid))
            {
                row.setAttribute('class', 'custom-hidden-row');
            }
        }
        rosterTable.classList.remove('table-secondary');
        rosterTable.classList.add('table-dark');
    }
}

function getLeaguePositions(){

    const leagueDataStorage = localStorage.getItem("LeagueData");
    const leagueData = JSON.parse(leagueDataStorage);

    leaguePositions = leagueData.roster_positions;
    const positions = [];

    for(let starterPosition of leaguePositions)
        {
            if(starterPosition != "BN")
            {
                if(starterPosition == "SUPER_FLEX")
                {
                    positions.push("SF");
                }
                else
                {
                    positions.push(starterPosition);
                }
            }
        }

    return positions.toString().replaceAll(",", ", ");
}

function getBankroll(currentWeek,dues) {
    console.log(currentWeek + " " + dues);
}
/*
** HTML Create/edit elements functions **
*/                                 
function loadMatchupsList(){
    var currentWeek = matchupData[0].matchupWeeks.length;
    var matchupDiv = document.getElementById("matchupWeeks");
    var week = document.getElementById("currentWeek");

    for(let i = 1; i<15; i++)
    {
        var accordionItem = createAccordionItem(i);
        matchupDiv.appendChild(accordionItem);
    }
    if(currentWeek > 0)
    {
        week.innerText="Week: " + currentWeek;
    }
    else
    {
        week.innerText="N/A";
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

    let user = userData.find(x => x.user_id === userId);
    const avatarURL = user.metadata.avatar;
    
    if(avatarURL)
    {
        var img = document.createElement("img");
        img.setAttribute('src', avatarURL);
        img.setAttribute('class', "custom-user-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    else
    {
        var img = document.createElement("img");
        img.setAttribute('src', '../src/static/images/trashcan.jpg');
        img.setAttribute('class', "custom-user-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    return img;
}

function createPlayerImage(playerId) {
    let playerDataStorage = localStorage.getItem("PlayerData");
    let playerData = JSON.parse(playerDataStorage);
    let player = playerData.players.find(e => e.player_id === parseInt(playerId));

    if(player)
    {
        let playerName = player.firstname.toString().trim() + " " + player.lastname;
        var playerimg = document.createElement("img");
        playerimg.setAttribute("src", "https://sleepercdn.com/content/nfl/players/thumb/"+player.player_id+".jpg");
        playerimg.setAttribute('class', "custom-player-avatar");

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

    var noMatchups = document.createElement("div");
    noMatchups.setAttribute("class", "custom-block-display");
    noMatchups.setAttribute("id", "nomatchups_"+weekNumber);
    noMatchups.innerText = "Check back when this week has started...";    

    list.appendChild(firstListItem);
    list.append(noMatchups);

    return list;
}

function createMatchupWeekHighScorerImg(){

    var img = document.createElement("img");
    img.setAttribute('src', '../src/static/images/crown-icon.png');
    img.setAttribute('class', "custom-highscorer");
    img.setAttribute('title', 'This weeks high scorer');

    return img;
}