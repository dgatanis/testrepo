const rosterDataStorage = localStorage.getItem("RosterData");
var rosterData = JSON.parse(rosterDataStorage); 
const userDataStorage = localStorage.getItem("UserData");
var userData = JSON.parse(userDataStorage);
const matchupWeekStorage = sessionStorage.getItem("MatchupData");
var matchupData = JSON.parse(matchupWeekStorage); 
const playerDataStorage = localStorage.getItem("PlayerData");
var playerData = JSON.parse(playerDataStorage); 


async function checkBrowserData() {

    if(!rosterData)
    {
        try{
            initBrowserData();
        }
        catch (error){
            console.error(`Error: ${error.message}`);
        }
    }
    else
    {
        loadSortedRosters();
    }
}

function waitForLocalStorageItem(key) {
    return new Promise((resolve) => {
        const checkLocalStorage = () => {
            const item = localStorage.getItem(key);
            if (item !== null) {
                resolve(item);
            } else {
                setTimeout(checkLocalStorage, 100); // Check again in 100 milliseconds
            }
        };
        checkLocalStorage();
    });
}

function waitForSessionStorageItem(key) {
    return new Promise((resolve) => {
        const checkSessionStorage = () => {
            const item = sessionStorage.getItem(key);
            if (item !== null) {
                resolve(item);
            } else {
                setTimeout(checkSessionStorage, 100); // Check again in 100 milliseconds
            }
        };
        checkSessionStorage();
    });
}

async function initBrowserData() {
    try {
        const localRosterData = await waitForLocalStorageItem("RosterData");
        const localLeagueData = await waitForLocalStorageItem("LeagueData");
        const localPlayerData = await waitForLocalStorageItem("PlayerData");
        const localUserData = await waitForLocalStorageItem("UserData");
        const localMatchupData = await waitForSessionStorageItem("MatchupData");

        rosterData = JSON.parse(localRosterData);
        userData = JSON.parse(localUserData);
        playerData = JSON.parse(localPlayerData);
        leagueData = JSON.parse(localLeagueData);
        matchupData = JSON.parse(localMatchupData);

        loadSortedRosters();

    } catch (error) {
        console.error('Error loading or executing script:', error);
    }
}

//This loads the page contents dynamically
function loadSortedRosters() {

    try{
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
                        var playerDetailsDiv = document.createElement('div');
                        var playerNameDiv = document.createElement('div');
                        var playerAgeDiv = document.createElement('div');
                        var playerHeightDiv = document.createElement('div');
                        var playerWeightDiv = document.createElement('div');
                        var playerNumberDiv = document.createElement('div');
                        let playerName = player.firstname + " " + player.lastname;
                        let playerAge = player.age;
                        let playerNumber = player.number;
                        var playerimg = createPlayerImage(player.player_id);
                        var teamImage = createNFLTeamImage(player.team);

                        playerRow.setAttribute('data-playerid', player.player_id);
                        playerNameDiv.setAttribute('class', 'custom-player-name');
                        playerNameDiv.innerText=playerName;
                        playerAgeDiv.setAttribute('class', 'custom-player-age');
                        playerAgeDiv.innerText =  "Age: " + playerAge ;
                        playerDetailsDiv.setAttribute('class', 'custom-player-details');
                        playerNumberDiv.setAttribute('class', 'custom-player-number');
                        playerNumberDiv.innerText = "#" + playerNumber;
                        playerHeightDiv .setAttribute('class', 'custom-player-height');
                        playerHeightDiv.innerText = calculateHeight(player.height);
                        playerWeightDiv .setAttribute('class', 'custom-player-weight');
                        playerWeightDiv.innerText = player.weight + "lbs";

                        playerDetailsDiv.appendChild(playerAgeDiv);
                        playerDetailsDiv.appendChild(playerHeightDiv);
                        playerDetailsDiv.appendChild(playerWeightDiv);
                        
                        var loadingIcon = playerRow.getElementsByClassName('custom-load-icon');
                        if(loadingIcon[0])
                        {
                            loadingIcon[0].style.display = 'none';
                        }
                        td.prepend(playerimg);
                        td.append(playerNumberDiv);
                        td.append(playerNameDiv);
                        td.append(teamImage);
                        td.append(playerDetailsDiv);
                        
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
                                let playerAge = player.age;
                                let playerNumber = player.number;
                                var playerimg = createPlayerImage(player.player_id);
                                var teamImage = createNFLTeamImage(player.team);
                                var playerDetailsDiv = document.createElement('div');
                                var playerNameDiv = document.createElement('div');
                                var playerAgeDiv = document.createElement('div');
                                var playerNumberDiv = document.createElement('div');
                                var playerHeightDiv = document.createElement('div');
                                var playerWeightDiv = document.createElement('div');
                                var tr = document.createElement("tr");
                                var th = document.createElement("th");
                                var td = document.createElement("td");

                                th.innerText=player.position;
                                th.setAttribute('scope', 'row');
                                tr.setAttribute('class', 'custom-bench-row');
                                tr.setAttribute('data-playerid', player.player_id);
                                playerNameDiv.setAttribute('class', 'custom-player-name');
                                playerNameDiv.innerText=playerName;
                                playerAgeDiv.setAttribute('class', 'custom-player-age');
                                playerAgeDiv.innerText =  "Age: " + playerAge ;
                                playerDetailsDiv.setAttribute('class', 'custom-player-details');
                                playerNumberDiv.setAttribute('class', 'custom-player-number');
                                playerNumberDiv.innerText = "#" + playerNumber;
                                playerHeightDiv .setAttribute('class', 'custom-player-height');
                                playerHeightDiv.innerText = calculateHeight(player.height);
                                playerWeightDiv .setAttribute('class', 'custom-player-weight');
                                playerWeightDiv.innerText = player.weight + "lbs";

                                playerDetailsDiv.appendChild(playerAgeDiv);
                                playerDetailsDiv.appendChild(playerHeightDiv);
                                playerDetailsDiv.appendChild(playerWeightDiv);
        

                                tr.appendChild(th);
                                td.prepend(playerimg);
                                td.append(playerNumberDiv);
                                td.append(playerNameDiv);
                                td.append(teamImage);
                                td.append(playerDetailsDiv);
                                tr.appendChild(td);
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
                            let playerAge = player.age;
                            let playerNumber = player.number;
                            var playerimg = createPlayerImage(player.player_id);
                            var teamImage = createNFLTeamImage(player.team);
                            var tr = document.createElement("tr");
                            var th = document.createElement("th");
                            var td = document.createElement("td");
                            var playerDetailsDiv = document.createElement('div');
                            var playerNameDiv = document.createElement('div');
                            var playerAgeDiv = document.createElement('div');
                            var playerNumberDiv = document.createElement('div');
                            var playerHeightDiv = document.createElement('div');
                            var playerWeightDiv = document.createElement('div');


                            th.innerText=player.position;
                            th.setAttribute('scope', 'row');
                            tr.setAttribute('class', 'custom-bench-row');
                            tr.setAttribute('data-playerid', player.player_id);
                            playerNameDiv.setAttribute('class', 'custom-player-name');
                            playerNameDiv.innerText=playerName;
                            playerAgeDiv.setAttribute('class', 'custom-player-age');
                            playerAgeDiv.innerText =  "Age: " + playerAge ;
                            playerDetailsDiv.setAttribute('class', 'custom-player-details');
                            playerNumberDiv.setAttribute('class', 'custom-player-number');
                            playerNumberDiv.innerText = "#" + playerNumber;
                            playerHeightDiv .setAttribute('class', 'custom-player-height');
                            playerHeightDiv.innerText = calculateHeight(player.height);
                            playerWeightDiv .setAttribute('class', 'custom-player-weight');
                            playerWeightDiv.innerText = player.weight + "lbs";

                            playerDetailsDiv.appendChild(playerAgeDiv);
                            playerDetailsDiv.appendChild(playerHeightDiv);
                            playerDetailsDiv.appendChild(playerWeightDiv);

                            tr.appendChild(th);
                            td.prepend(playerimg);
                            td.append(playerNumberDiv);
                            td.append(playerNameDiv);
                            td.append(teamImage);
                            td.append(playerDetailsDiv);
                            tr.appendChild(td);
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
                var statsStacksRow = statsTeam.getElementsByClassName('custom-stats-stacks-row'); 

                if(positionCountRow)
                {
                    var positionCountChild = positionCountRow[0].children[0].children[1];
                    positionCountChild.innerText = "QB: " + rosterStats.QB + " RB: "  + rosterStats.RB + " WR: " + rosterStats.WR + " TE: " + rosterStats.TE + " K: " + rosterStats.K;
                }
                if (playerAgeRow)
                {
                    var playerAgeChild = playerAgeRow[0].children[0].children[1];
                    playerAgeChild.innerText = "Team: " + rosterStats.AvgAge + "yrs";
                }
                if (positionAgeRow)
                {
                    var positionAgeChild = positionAgeRow[0].children[0];
                    var qbAgeString = "QB: " + rosterStats.qbAge + "yrs";
                    var rbAgeString = "RB: "  + rosterStats.rbAge + "yrs";
                    var wrAgeString = "WR: " + rosterStats.wrAge + "yrs";
                    var teAgeString = "TE: " + rosterStats.teAge + "yrs";

                    var qbAge = document.createElement('div');
                    qbAge.setAttribute('class', 'custom-position-age');
                    qbAge.setAttribute('style', 'color: #ff2a6d;');
                    qbAge.innerText = qbAgeString;

                    var rbAge = document.createElement('div');
                    rbAge.setAttribute('class', 'custom-position-age');
                    rbAge.setAttribute('style', 'color: #00ceb8;');
                    rbAge.innerText = rbAgeString;

                    var wrAge = document.createElement('div');
                    wrAge.setAttribute('class', 'custom-position-age');
                    wrAge.setAttribute('style', 'color: #58a7ff;');
                    wrAge.innerText = wrAgeString;

                    var teAge = document.createElement('div');
                    teAge.setAttribute('class', 'custom-position-age');
                    teAge.setAttribute('style', 'color: #ffae58;');
                    teAge.innerText = teAgeString;                   

                    positionAgeChild.append(qbAge);
                    positionAgeChild.append(rbAge);
                    positionAgeChild.append(wrAge);
                    positionAgeChild.append(teAge);
                }
                if (statsStacksRow)
                {
                    var statsStacksChild = statsStacksRow[0].children[0];
                    var noneDiv = statsStacksChild.children[0].children[1];
                    var sameTeam = "";
                    var count = 0;

                    for(let thisPlayer of rosterStats.team_stacks)
                    {
                        let player = playerData.players.find(e => e.player_id === parseInt(thisPlayer.player_id));
                        
                        if(sameTeam == "" || sameTeam != player.team)
                        {
                            var stacksTeamName = document.createElement('div');
                            var stacksPlayer = document.createElement('div');

                            stacksTeamName.setAttribute('class', 'custom-stacks-teamname');
                            stacksTeamName.innerText = player.team;
                            stacksPlayer.setAttribute('class', 'custom-stacks-player');
                            stacksPlayer.innerText = getFullPlayerName(player.player_id) + " " + player.position;

                            statsStacksChild.append(stacksTeamName);
                            statsStacksChild.append(stacksPlayer);

                            sameTeam = player.team;
                            count++;
                        }
                        else
                        {
                            var stacksPlayer = document.createElement('div');
                            stacksPlayer.setAttribute('class', 'custom-stacks-player');
                            stacksPlayer.innerText = getFullPlayerName(player.player_id) + " " + player.position;

                            statsStacksChild.append(stacksPlayer);
                            
                            sameTeam = player.team;
                            count++;
                        }
                        
                    }
                    if(count > 0)
                    {
                        noneDiv.classList.remove('custom-block-display');
                        noneDiv.classList.add('custom-none-display');
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
        var teamStackPlayers = getTeamStacks(rosterid);

        let rosterStats = {
            ...playerPositionCount[0],
            ...playerAge[0],
            ...teamRecord[0],
            ...playerPositionAge,
            ...teamStackPlayers
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

function getTeamStacks(rosterid) {

    var teamStacks = [];
    var teams = [];
    var result = {};
    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));

    if(roster)
    {
        let rosterPlayers = sortByTeam(roster.players);

        if(rosterPlayers)
        {
            //loop through players to get only teams for qbs
            for(let thisPlayer of rosterPlayers)
            {
                let player = playerData.players.find(e => e.player_id === parseInt(thisPlayer.player_id));
                
                if(player.position == 'QB')
                {
                    teams.push(player.team)
                }

            }

            let commonTeams = countCommonTeams(rosterPlayers);
            //loop through players again and only select ones with qb stacks
            for(let thisPlayer of rosterPlayers)
            {
                let player = playerData.players.find(e => e.player_id === parseInt(thisPlayer.player_id));
                
                if(teams.includes(player.team) && player.position != 'K' && commonTeams[parseInt(player.player_id)] >= 1)
                {
                    teamStacks.push({
                        "player_id": player.player_id,
                        "team": player.team
                    });
                }

            }
        }

        result['team_stacks'] = teamStacks;

        return result;
        
    }
}

function countCommonTeams(players) {

    const result = {};
    
    players.forEach(player => {
        if (!result[player.player_id]) {
            result[player.player_id] = 0;
        }
        // Loop through the players again to compare teams
        players.forEach(otherPlayer => {
            // Count common teams for each player
            if (player.player_id !== otherPlayer.player_id && player.team === otherPlayer.team) {
                result[player.player_id]++;
            }
        });
    });
    
    return result;
}


function sortByTeam(players) {

    const sortedPlayers = [];
    
    for(let player of players)
    {
        let thisPlayer = playerData.players.find(e => e.player_id === parseInt(player));
        if(thisPlayer)
        {
            sortedPlayers.push({
                "player_id": thisPlayer.player_id.toString(),
                "team": thisPlayer.team
            });
            
        }
    }

    sortedPlayers.sort(function (a, b) {
        if (a.team > b.team) {
        return 1;
        }
        if (a.team < b.team) {
        return -1;
        }
        return 0;
    });

    if(sortedPlayers)
    {
        return sortedPlayers;
    }
}

function calculateHeight(inches) {
    var feet = Math.floor(inches / 12);
    var remainingInches = inches % 12;
    return feet + "'" + remainingInches + "\"";
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
        var playerimg = document.createElement("div");
        playerimg.setAttribute("style",  "background-image: url(https://sleepercdn.com/content/nfl/players/thumb/"+player.player_id+".jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp)");
        playerimg.setAttribute('class', "custom-player-avatar");

        return playerimg;
    }
}

function createNFLTeamImage(team) {
    var teamAbrv = team.toLowerCase();
    var teamImage = document.createElement("img");
    teamImage.setAttribute("src",  `https://sleepercdn.com/images/team_logos/nfl/${teamAbrv}.png`);
    teamImage.setAttribute('class', "custom-team-logo");

    return teamImage;
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