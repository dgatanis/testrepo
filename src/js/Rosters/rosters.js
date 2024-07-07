import { 
    rosters, 
    players, 
    getFullPlayerName, 
    createOwnerAvatarImage, 
    getRosterStats, 
    createPlayerImage,
    getTeamName,
    sortByPosition,
    createNFLTeamImage,
    getPlayerNickNames,
    setLeagueName,
    getLeaguePositions,
    setLinkSource 
    } from '../util/helper.js';

let rosterData = rosters;
let playerData = players;

loadContents();

//This loads the page contents dynamically
function loadContents() {
    setLeagueName("footerName");
    setLinkSource("keep-trade-cut");
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

                let player = playerData.players.find(e => e.player_id === parseInt(starter.player_id));

                if(player)
                {
                    let unusedRow = unusedPlayerRow(player.position, starterTeam);
                    let playerRow = createPlayerRow(player.player_id, roster.roster_id);
                    let playerDetails = playerRow.getElementsByTagName('td')[0]; //Only get the td element so we can append to existing row
                    
                    if(unusedRow.classList.value == 'custom-player-SF-row' || unusedRow.classList.value == 'custom-player-FLEX-row')
                    {
                        unusedRow.children[0].classList.value = 'custom-'+player.position.toLowerCase()+'-roster';
                    }

                    unusedRow.setAttribute('data-playerid', player.player_id);
                    unusedRow.append(playerDetails);
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
                                var playerRow = createPlayerRow(player.player_id, roster.roster_id);
                                playerRow.setAttribute('class', 'custom-bench-row');
                                benchTeam.append(playerRow);
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
                            var playerRow = createPlayerRow(player.player_id, roster.roster_id);
                            playerRow.setAttribute('class', 'custom-bench-row');
                            taxiTeam.append(playerRow);
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
                var teamNameRow = document.createElement('div');

                teamNameRow.setAttribute('class', 'custom-team-details-name');
                teamNameRow.innerText = getTeamName(roster.owner_id);
                statsTable.prepend(teamNameRow);
                
                if(positionCountRow)
                {
                    var chartId = positionCountRow[0].children[0].children[1].id;

                    var data1 = 
                    {
                        x: ['QB'],
                        y: [rosterStats.QB],
                        type: 'bar',
                        name: 'QB',
                        marker: {color: '#ff2a6d'},
                    };

                    var data2 = 
                    {
                        x: ['RB'],
                        y: [rosterStats.RB],
                        type: 'bar',
                        name: 'RB',
                        marker: {color: '#00ceb8'},
                    };
                    
                    var data3 = 
                    {
                        x: ['WR'],
                        y: [rosterStats.WR],
                        type: 'bar',
                        name: 'WR',
                        marker: {color: '#58a7ff'}
                    };

                    var data4 = 
                    {
                        x: ['TE'],
                        y: [rosterStats.TE],
                        type: 'bar',
                        name: 'TE',
                        marker: {color: '#ffae58'}
                    };

                    var data5 = 
                    {
                        x: ['K'],
                        y: [rosterStats.K],
                        type: 'bar',
                        name: 'K',
                        marker: {color: '#bd66ff'}
                    };
                    
                    var data = [data1, data2, data3, data4, data5];

                    var layout = {
                        scattermode: 'group',
                        barcornerradius: 15,
                        width: 400,
                        height: 300,
                        showlegend: false,
                        paper_bgcolor: "transparent",
                        plot_bgcolor: "transparent"
                      };

                    Plotly.newPlot(chartId, data, layout, {displayModeBar: false});
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
                            stacksPlayer.innerText = getFullPlayerName(player.player_id) + " - " + player.position;

                            statsStacksChild.append(stacksTeamName);
                            statsStacksChild.append(stacksPlayer);

                            sameTeam = player.team;
                            count++;
                        }
                        else
                        {
                            var stacksPlayer = document.createElement('div');
                            stacksPlayer.setAttribute('class', 'custom-stacks-player');
                            stacksPlayer.innerText = getFullPlayerName(player.player_id) + " - " + player.position;
                            var teamStacks = statsStacksChild.getElementsByClassName("custom-stacks-teamname");
                            var mostRecentTeam = teamStacks[teamStacks.length-1];

                            if(player.position == "QB")
                            {
                                mostRecentTeam.after(stacksPlayer);
                            }
                            else
                            {
                                statsStacksChild.append(stacksPlayer);
                            }
                            
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
    var leaguePositions = getLeaguePositions();
    var positionArray = leaguePositions.split(', ');
    var RB = 0;
    var WR = 0;
    var TE = 0;
    var DEF = 0;

    //Need to work on defense position

    for(var i=0;i<positionArray.length;i++){

        if(positionArray[i] == "RB")
        {
            RB++;
        }
        if(positionArray[i] == "WR")
        {
            WR++;
        }
        if(positionArray[i] == "TE")
        {
            TE++;
        }
        if(positionArray[i] == "DEF")
        {
            DEF++;
        }
    }
    
    if(position == 'RB' || position == 'WR' || position == 'TE')
    {
        flexRows = starterTeam.getElementsByClassName('custom-player-FLEX-row');
    }

    if(playerRow)
    {
        var counter = 0;
        
        for(let row of playerRow)
        {
            if(!row.getAttribute('data-playerid'))
            {
                return row;
            }
            else
            {
                counter++;
            }
        }

        //Create new rows if needed
        if((position == "RB" || position == "WR") && (RB > counter || WR > counter))
        {
            var tr = document.createElement("tr");
            var th = document.createElement("th");
            var lastPlayerPosition = playerRow[playerRow.length-1];

            tr.setAttribute('class', 'custom-player-'+ position + '-row');
            th.setAttribute('class', 'custom-'+ position.toLowerCase() + '-roster');
            th.setAttribute('scope', 'row');
            th.innerText = position;

            tr.appendChild(th);
            lastPlayerPosition.parentNode.insertBefore(tr, lastPlayerPosition.nextSibling);

            return tr;
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

function createPlayerRow(playerid, rosterid) {

    let player = playerData.players.find(e => e.player_id === parseInt(playerid));

    let playerName = player.firstname + " " + player.lastname;
    let playerAge = player.age;
    let playerNumber = player.number;
    var playerNickName = getPlayerNickNames(rosterid, playerid);
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
    playerWeightDiv.innerText = player.weight + " lbs";

    if(playerNickName != "")
    {
        playerimg.setAttribute('title', playerNickName);
    }
    
    playerDetailsDiv.appendChild(playerNumberDiv);
    playerDetailsDiv.appendChild(playerAgeDiv);
    playerDetailsDiv.appendChild(playerHeightDiv);
    playerDetailsDiv.appendChild(playerWeightDiv);


    tr.appendChild(th);
    td.prepend(playerimg);
    td.append(playerNameDiv);
    td.append(teamImage);
    td.append(playerDetailsDiv);
    tr.appendChild(td);

    return tr;
}


function calculateHeight(inches) {
    var feet = Math.floor(inches / 12);
    var remainingInches = inches % 12;
    return feet + "'" + remainingInches + "\"";
}