const rosterDataStorage = localStorage.getItem("RosterData");
const rosterData = JSON.parse(rosterDataStorage); 
const userDataStorage = localStorage.getItem("UserData");
const userData = JSON.parse(userDataStorage);
const matchupWeekStorage = sessionStorage.getItem("MatchupData");
const matchupData = JSON.parse(matchupWeekStorage); 
const playerDataStorage = localStorage.getItem("PlayerData");
const playerData = JSON.parse(playerDataStorage); 

//This loads the page contents dynamically
async function loadConstants() {

    try{

        // const leagueInfo = await import('../util/leagueInfo.js');
        // const leagueInfoLeagueId = leagueInfo.default();
        // const currentWeek = leagueInfo.getCurrentWeek();
        // const currentSeason = leagueInfo.getCurrentSeason();
        // const weeklyWinnerPayout = leagueInfo.weeklyWinner;
        // const dues = leagueInfo.dues;

        // const currentLeagueId = await leagueInfoLeagueId;
        // const thisSeason = await currentSeason;
        // const leagueId = currentLeagueId;
        // const week = currentWeek;
        // const season = thisSeason;

        // loadSeasonRankings(leagueId);
        // loadBankroll('10',dues,weeklyWinnerPayout); //TESTING
        // getLatestTransactions('1');
        // setSeasonTitle(season);
        // loadMatchupsList(); 
        // return;
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

function loadSortedRosters() {

    //var modalRosterTeamName = document.querySelector('#ModalRosterTeamName');
    var rosterTable = document.querySelector('#taxiTable10');
    var tablebody = rosterTable.childNodes[3];
    var rosterBody = document.getElementById("ModalRosterBody");
    const leaguePositionList = getLeaguePositions();

  
    //Create table rows for players
    const teams = rosterData.map((roster) => roster);

    //Loop through each roster of team and display player data for selected team
    for(let roster of teams) 
    {
        var teamImage = createOwnerAvatarImage(roster.owner_id);
        //modalRosterTeamName.prepend(teamImage);

        let sortedPlayers = sortByPosition(roster.players);

        //Go through each player from this roster
        for(let players of sortedPlayers)
        {
            if(localStorage.getItem("PlayerData"))
            {

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
        return; 
    }
}

function getFullPlayerName(playerid) {

    let player = playerData.players.find(x => x.player_id === parseInt(playerid));

    let playerName = playerid;

    if(player != undefined && player.firstname && player.lastname)
    {
        playerName = player.firstname + " " + player.lastname;
    }

    return playerName;
    
}

function getRosterStats(rosterid) {

    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));

    if(roster)
    {
        var playerPositionCount = calcPlayerPositions(roster.players);
        var playerAge = calcPlayerAge(roster.players);
        var teamRecord = getTeamRecord(rosterid);

        let rosterStats = {
            ...playerPositionCount[0],
            ...playerAge[0],
            ...teamRecord[0],
            ...highScorerPlayers[0]
        };

        return rosterStats;
    }
}

function getLeaguePositions(){

    const leagueDataStorage = localStorage.getItem("LeagueData");
    const leagueData = JSON.parse(leagueDataStorage);

    leaguePositions = leagueData.roster_positions;
    const positions = [];

    for(let starterPosition of leaguePositions)
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

    return positions.toString().replaceAll(",", ", ");
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

function createPlayerImage(playerId) {

    let player = playerData.players.find(e => e.player_id === parseInt(playerId));

    if(player)
    {
        var playerimg = document.createElement("img");
        playerimg.setAttribute("src", "https://sleepercdn.com/content/nfl/players/thumb/"+player.player_id+".jpg");
        playerimg.setAttribute('class', "custom-player-avatar");

        return playerimg;
    }
}

function createOwnerAvatarImage(userId) { 

    let user = userData.find(x => x.user_id === userId);
    const avatarURL = user.metadata.avatar;
    
    if(avatarURL)
    {
        var img = document.createElement("img");
        img.setAttribute('src', avatarURL);
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    else
    {
        var img = document.createElement("img");
        img.setAttribute('src', '../src/static/images/trashcan.png');
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('style', "border-radius: unset;");
        img.setAttribute('data-userid', user.user_id);
    }
    return img;
}