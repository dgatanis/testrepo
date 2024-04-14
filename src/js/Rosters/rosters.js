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
        loadSortedRosters();
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

    try{
        //const leaguePositionList = getLeaguePositions();

        //Create table rows for players
        const teams = rosterData.map((roster) => roster);

        //Loop through each roster of team and display player data for selected team
        for(let roster of teams) 
        {
            var team = document.querySelector('#team'+roster.roster_id);
            var teamName = team.children[0];
            var starterTable = document.querySelector('#startersTable'+roster.roster_id);
            var starterTeam = starterTable.childNodes[1];
            var benchTable = document.querySelector('#benchTable'+roster.roster_id);
            var benchTeam = benchTable.childNodes[1];
            var taxiTable = document.querySelector('#taxiTable'+roster.roster_id);
            var taxiTeam = taxiTable.childNodes[1];
            var teamImage = createOwnerAvatarImage(roster.owner_id);

            teamImage.setAttribute('onlcick', 'expandCollapseTeam(' + roster.roster_id + ');');
            teamName.setAttribute('class', 'custom-team');
            teamName.setAttribute('onlcick', 'expandCollapseTeam(' + roster.roster_id + ');');
            teamName.innerText=getTeamName(roster.owner_id);
            team.prepend(teamImage);

            let allSortedPlayers = sortByPosition(roster.players);
            let starterSortedPlayers = sortByPosition(roster.starters);
            let IRPlayers = roster.reserves;

            //starters
            for(let starter of starterSortedPlayers)
            {
                if(localStorage.getItem("PlayerData"))
                {
                    let player = playerData.players.find(e => e.player_id === parseInt(starter.player_id));


                    if(player)
                    {
                        let playerName = player.firstname + " " + player.lastname;
                        let playerTeam = player.team;
                        var playerimg = createPlayerImage(player.player_id);
                        var tr = document.createElement("tr");
                        var th = document.createElement("th");
                        if(player.position == 'QB')
                        {
                            th.setAttribute('class', 'custom-qb-roster');
                        }
                        if(player.position == 'RB')
                        {
                            th.setAttribute('class', 'custom-rb-roster');
                        }
                        if(player.position == 'WR')
                        {
                            th.setAttribute('class', 'custom-wr-roster');
                        }
                        if(player.position == 'TE')
                        {
                            th.setAttribute('class', 'custom-te-roster');
                        }
                        if(player.position == 'K')
                        {
                            th.setAttribute('class', 'custom-k-roster');
                        }
                        th.innerText=player.position;
                        th.setAttribute('scope', 'row');
                        tr.setAttribute('class', 'custom-shown-row')
                        tr.setAttribute('data-playerid', player.player_id);
                        tr.appendChild(th);
                        var nameOfPlayer = document.createElement("td");
                        nameOfPlayer.innerText=playerName + " (" + playerTeam + ")";
                        nameOfPlayer.prepend(playerimg);
                        tr.appendChild(nameOfPlayer);
                        starterTeam.append(tr);
                    }
                }

            }

            //bench
            for(let bench of allSortedPlayers)
            {
                if(!roster.starters.includes(bench.player_id.toString()))
                {
                    if(localStorage.getItem("PlayerData"))
                    {
                        let player = playerData.players.find(e => e.player_id === parseInt(bench.player_id));
    
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
                            benchTeam.append(tr);
                        }
                    }
                }
            }

            //taxi
            if(roster.taxi)
            {
                let taxiSortedPlayers = sortByPosition(roster.taxi);

                for(let taxi of taxiSortedPlayers)
                {
                    if(localStorage.getItem("PlayerData"))
                    {
                        let player = playerData.players.find(e => e.player_id === parseInt(taxi.player_id));


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
                            taxiTeam.append(tr);
                        }
                    }

                }
            }
        }
    }
    catch(error)
    {
        console.error(error.message);
    }
}

function expandAll() {

    var accordionBodys = document.getElementsByClassName('accordion-collapse');
    var accordionButtons = document.getElementsByClassName('accordion-button');

    for(let accordionBody of accordionBodys)
    {
        accordionBody.setAttribute('class', 'accordion-collapse collapse show');
    }
    for(let accordionButton of accordionButtons)
    {
        accordionButton.setAttribute('class', 'accordion-button');
        accordionButton.setAttribute('aria-expanded', 'true');
    }
}

function collapseAll() {
    var accordionBodys = document.getElementsByClassName('accordion-collapse');
    var accordionButtons = document.getElementsByClassName('accordion-button');

    for(let accordionBody of accordionBodys)
    {
        accordionBody.setAttribute('class', 'accordion-collapse collapse');
    }
    for(let accordionButton of accordionButtons)
    {
        accordionButton.setAttribute('class', 'accordion-button collapsed');
        accordionButton.setAttribute('aria-expanded', 'false');
    }
}

function expandCollapseTeam(rosterid) {

    var teamGroup = document.getElementById('teamGroup'+rosterid);
    var teamGroupChildren = teamGroup.children;

    for(let accordionItem of teamGroupChildren)
    {
        var accordionBodys = accordionItem.getElementsByClassName('accordion-collapse');
        var accordionButtons = accordionItem.getElementsByClassName('accordion-button');

        for(let accordionBody of accordionBodys)
        {
            accordionBody.setAttribute('class', 'accordion-collapse collapse show');
        }
        for(let accordionButton of accordionButtons)
        {
            accordionButton.setAttribute('class', 'accordion-button');
            accordionButton.setAttribute('aria-expanded', 'true');
        }

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
            ...teamRecord[0]
        };

        return rosterStats;
    }
}

function getTeamName(userid) {

    let user = userData.find(x => x.user_id === userid.toString());
    let userName = "";

    if(user.metadata.team_name != undefined)
    {
        userName = user.metadata.team_name;
    }
    else
    {
        userName = user.display_name;
    }

    return userName.toString();
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