const rosterDataStorage = localStorage.getItem("RosterData");
var rosterData = JSON.parse(rosterDataStorage); 
const userDataStorage = localStorage.getItem("UserData");
var userData = JSON.parse(userDataStorage);
const matchupWeekStorage = sessionStorage.getItem("MatchupData");
var matchupData = JSON.parse(matchupWeekStorage); 
const playerDataStorage = localStorage.getItem("PlayerData");
var playerData = JSON.parse(playerDataStorage); 
console.log('rosterData 1');
console.log(rosterData);
//This loads the page contents dynamically
async function loadConstants() {
    if(!rosterData)
    {
        console.log("noRosters");
    
        try{
            const browserData = await import('../util/browserData.js');
            rosterData = browserData.getRostersForLeague(1046222222567784448);
            init();
        }
        catch (error){
            console.error(`Error: ${error.message}`);
        }
    }
}

async function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

async function init() {
    try {
        await loadScript('../src/js/util/browserData.js');
        const browserDatas = await import('../util/browserData.js');
        var x = browserDatas.getRostersForLeague(1046222222567784448);
        console.log(x); // Do whatever you need with rosterData
        // Now you can proceed with the rest of your code knowing that rosterData is available
    } catch (error) {
        console.error('Error loading or executing script:', error);
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
            var statsTable = document.querySelector('#statsTable'+roster.roster_id);
            var statsTeam = statsTable.children[0]; //different than others above
            var teamImage = createOwnerAvatarImage(roster.owner_id);

            teamImage.setAttribute('onclick', "expandCollapseTeam('" + roster.roster_id + "');");
            teamName.setAttribute('class', 'custom-team');
            teamName.setAttribute('onclick', "expandCollapseTeam('" + roster.roster_id + "');");
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
                        let playerRow = unusedPlayerRow(player.position, starterTeam);
                        var td = document.createElement('td');
                        let playerName = player.firstname + " " + player.lastname;
                        let playerTeam = player.team;
                        var playerimg = createPlayerImage(player.player_id);

                        playerRow.setAttribute('data-playerid', player.player_id);
                        td.innerText=playerName + " (" + playerTeam + ")";
                        td.prepend(playerimg);
                        
                        if(playerRow.classList.value == 'custom-player-SF-row' || playerRow.classList.value == 'custom-player-FLEX-row')
                        {
                            playerRow.children[0].classList.value = 'custom-'+player.position.toLowerCase()+'-roster';
                        }
                        playerRow.append(td);
                    }
                }

            }

            //bench
            for(let bench of allSortedPlayers)
            {
                if(!roster.starters.includes(bench.player_id.toString()))
                {
                    if(!roster.taxi || roster.taxi && !roster.taxi.includes(bench.player_id.toString()))
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
                                tr.setAttribute('class', 'custom-bench-row');
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
                            tr.setAttribute('class', 'custom-bench-row');
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

            var rosterStats = getRosterStats(roster.roster_id);

            if(rosterStats)
            {
                var positionCountRow = statsTeam.getElementsByClassName('custom-stats-position-count-row');
                var playerAgeRow = statsTeam.getElementsByClassName('custom-stats-players-age-row');
                var positionAgeRow = statsTeam.getElementsByClassName('custom-stats-position-age-row');
                var statsTestRow = statsTeam.getElementsByClassName('custom-stats-test-row'); 

                if(positionCountRow)
                {
                    var positionCountChild = positionCountRow[0].children[0];
                    positionCountChild.children[0].innerText = "Position Count: QB:" + rosterStats.QB + " RB:"  + rosterStats.RB + " WR:" + rosterStats.WR + " TE:" + rosterStats.TE + " K:" + rosterStats.K;
                }
                if (playerAgeRow)
                {
                    var playerAgeChild = playerAgeRow[0].children[0];
                    playerAgeChild.children[0].innerText = "Roster Age: "+ rosterStats.AvgAge + "yrs";
                }
                if (positionAgeRow)
                {
                    var positionAgeChild = positionAgeRow[0].children[0];
                    positionAgeChild.children[0].innerText = "QB: " + rosterStats.qbAge + "yrs RB:"  + rosterStats.rbAge + "yrs WR:" + rosterStats.wrAge + "yrs TE:" + rosterStats.teAge + "yrs";
                }
                if (statsTestRow)
                {
                    console.log('test');
                }
            }
        }
    }
    catch(error)
    {
        console.error(error.message);
    }
}

function unusedPlayerRow(position,starterTeam) {

    var playerRow = starterTeam.getElementsByClassName('custom-player-'+ position +'-row');
    var superFlexRows = starterTeam.getElementsByClassName('custom-player-SF-row');
    var flexRows = null;

    if(position == 'RB' || position == 'WR' || position == 'TE')
    {
        flexRows = starterTeam.getElementsByClassName('custom-player-FLEX-row');
    }

    if(playerRow)
    {
        for(let row of playerRow)
        {
            if(!row.getAttribute('data-playerid'))
            {
                return row;
            }
        }
    }
    if(flexRows)
    {
        for(let row of flexRows)
        {
            if(!row.getAttribute('data-playerid'))
            {
                return row;
            }
        }
    }
    if(superFlexRows)
    {
        for(let row of superFlexRows)
        {
            if(!row.getAttribute('data-playerid'))
            {
                return row;
            }
        }
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
    var teamStarters = document.getElementById('startersTeam'+rosterid);
    var teamBench = document.getElementById('benchTeam'+rosterid);
    var teamTaxi = document.getElementById('taxiTeam'+rosterid);
    var teamStats = document.getElementById('statsTeam'+rosterid);
    var teamGroupChildren = teamGroup.children;
    var showFields = true;

    if(teamStarters.classList.value == 'accordion-collapse collapse show' ||
    teamBench.classList.value == 'accordion-collapse collapse show' ||
    teamTaxi.classList.value == 'accordion-collapse collapse show' ||
    teamStats.classList.value == 'accordion-collapse collapse show' )
    {
        showFields = false;
    }

    for(let accordionItem of teamGroupChildren)
    {
        var accordionBodys = accordionItem.getElementsByClassName('accordion-collapse');
        var accordionButtons = accordionItem.getElementsByClassName('accordion-button');

        for(let accordionBody of accordionBodys)
        {
            if(showFields)
            {
                accordionBody.setAttribute('class', 'accordion-collapse collapse show');
            }
            else
            {
                accordionBody.setAttribute('class', 'accordion-collapse collapse');
            }
            
        }
        for(let accordionButton of accordionButtons)
        {
            if(showFields)
            {
                accordionButton.setAttribute('class', 'accordion-button');
                accordionButton.setAttribute('aria-expanded', 'true');
            }
            else 
            {
                accordionButton.setAttribute('class', 'accordion-button collapsed');
                accordionButton.setAttribute('aria-expanded', 'false');
            }

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
        var playerPositionAge = calcPositionAge(roster.players);
        var playerAge = calcRosterAge(roster.players);
        var teamRecord = getTeamRecord(rosterid);
        //getTeamStacks(rosterid);

        let rosterStats = {
            ...playerPositionCount[0],
            ...playerAge[0],
            ...teamRecord[0],
            ...playerPositionAge
        };

        return rosterStats;
    }
}

function getTeamStacks(rosterid) {

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


function calcRosterAge(players) {

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

function calcPositionAge(players) {

    const calculatedAge = [];
    var totalAge = 0;
    var qbAge = 0;
    var rbAge = 0;
    var wrAge = 0;
    var teAge = 0;
    var values = {"qbAge": 0,"rbAge": 0,"wrAge": 0,"teAge": 0};

    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));

        if(thisPlayer.position == 'QB')
        {
            qbAge += parseInt(thisPlayer.age);
        }
        else if(thisPlayer.position == 'RB')
        {
            rbAge += parseInt(thisPlayer.age);
        }
        else if(thisPlayer.position == 'WR')
        {
            wrAge += parseInt(thisPlayer.age);
        }
        else if(thisPlayer.position == 'TE')
        {
            teAge += parseInt(thisPlayer.age);
        }
    }
    var playerPositionCount = calcPlayerPositions(players);
    
    qbAge = qbAge / playerPositionCount[0].QB;
    rbAge = rbAge / playerPositionCount[0].RB;
    wrAge = wrAge / playerPositionCount[0].WR;
    teAge = teAge / playerPositionCount[0].TE;

    values.qbAge = qbAge.toFixed(2);
    values.rbAge = rbAge.toFixed(2);
    values.wrAge = wrAge.toFixed(2);
    values.teAge = teAge.toFixed(2);

    return values;
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