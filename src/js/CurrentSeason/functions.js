async function OpenTeamRosterModal(userid,teamname) {
    const helper = await import('../util/helper.js');
    var rosterData = helper.rosters;
    var playerData = helper.players;
    
    var modalRosterTeamName = document.querySelector('#ModalRosterTeamName');
    var rosterTable = document.querySelector('#RosterTable');
    var tablebody = rosterTable.childNodes[1];
    const leaguePositionList = helper.getLeaguePositions();

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
            var teamImage = helper.createOwnerAvatarImage(roster.owner_id);
            modalRosterTeamName.prepend(teamImage);

            //Sets the roster stats on the roster modal
            var rosterStats = helper.getRosterStats(roster.roster_id);
            const record = document.getElementById("rosterRecord");
            const leaguePositionsLink = document.getElementById("starterPositions");
            const age = document.getElementById("rosterAge");
            const highScorers = document.getElementsByClassName("custom-roster-high-scorer");
            const wins = document.createElement('div');
            const losses = document.createElement('div');
            const points = document.createElement('div');
            record.innerText = "";//Reset record after each click

            for(let currentHighScorer of highScorers)
            {
                // Remove all children elements
                while (currentHighScorer.firstChild) {
                    currentHighScorer.removeChild(currentHighScorer.firstChild);
                }
            }

            let highScorerPlayers = [
                rosterStats.QBpts,
                rosterStats.RBpts,
                rosterStats.WRpts,
                rosterStats.TEpts
            ];
            wins.setAttribute('class', 'custom-roster-record');
            losses.setAttribute('class', 'custom-roster-record');
            points.setAttribute('class', 'custom-roster-record');
            wins.innerText = rosterStats.wins + "-" + rosterStats.losses + " (" +rosterStats.fpts + " pts)";
            leaguePositionsLink.title = "Toggle Starters (" + leaguePositionList + ")";
            leaguePositionsLink.setAttribute('onclick', 'toggleStarters(' + roster.roster_id +')');
            age.innerText = rosterStats.AvgAge + " yrs";

            record.appendChild(wins);


            //length of highScorers and highScorerPlayers must match
            for(let i =0; i < highScorers.length; i++)
            {
                var playerImg = helper.createPlayerImage(highScorerPlayers[i].player_id);
                playerImg.setAttribute('class', 'custom-small-player-avatar');
                
                var playerName = helper.getFullPlayerName(highScorerPlayers[i].player_id);
                var playerNameDiv = document.createElement("div");
                var playerPointsDiv = document.createElement("div");

                playerPointsDiv.innerText = highScorerPlayers[i].points + " pts";
                playerNameDiv.setAttribute('class', 'custom-playername-small');
                playerPointsDiv.setAttribute('class', 'custom-player-points');
                playerNameDiv.innerText = playerName;
                
                highScorers[i].append(playerNameDiv);
                highScorers[i].append(playerPointsDiv);
                highScorers[i].prepend(playerImg);
            }

            let sortedPlayers = helper.sortByPosition(roster.players);

            //Go through each player from this roster
            for(let players of sortedPlayers)
            {
                if(localStorage.getItem("PlayerData"))
                {

                    let player = playerData.players.find(e => e.player_id === players.player_id);

                    if(player)
                    {
                        let playerName = player.firstname + " " + player.lastname;
                        let playerTeam = player.team;
                        var playerimg = helper.createPlayerImage(player.player_id);
                        var tr = document.createElement("div");
                        var playerposition = document.createElement("div");
                        playerposition.innerText=player.position;
                        playerposition.setAttribute('class', 'custom-roster-player-position col');
                        tr.setAttribute('class', 'custom-shown-row row')
                        tr.setAttribute('data-playerid', player.player_id);
                        tr.appendChild(playerposition);
                        var nameOfPlayer = document.createElement("div");
                        nameOfPlayer.innerText=playerName + " (" + playerTeam + ")";
                        nameOfPlayer.setAttribute("class", "custom-roster-player-name col");
                        nameOfPlayer.prepend(playerimg);
                        tr.appendChild(nameOfPlayer);
                        var yrsExp = document.createElement("div");
                        yrsExp.innerText=player.age + " yrs";
                        yrsExp.setAttribute("class", "custom-roster-player-age col");
                        tr.appendChild(yrsExp);
                        tablebody.append(tr);
                    }
                }
            }
        }
    }
}

async function toggleStarters(rosterId) {
    const helper = await import('../util/helper.js');
    var rosterData = helper.rosters;

    let roster = rosterData.find(x => x.roster_id === parseInt(rosterId));
    let tableRows = document.querySelectorAll('.custom-shown-row');
    let hiddenRows = document.querySelectorAll('.custom-hidden-row');
    let rosterTable = document.getElementsByClassName('custom-roster-players-container')[0];
    let rosterDetails = document.getElementsByClassName('custom-roster-container')[0];

    let starters = roster.starters;

    if(hiddenRows.length > 0)
    {
        for(let row of hiddenRows)
        {
            row.setAttribute('class', 'custom-shown-row row');
        }
        for (let row of tableRows) {

            row.classList.remove('custom-starter');

        }
        rosterTable.classList.add("custom-default-background");
        rosterDetails.classList.add("custom-default-background");

        rosterTable.classList.remove("custom-selected-background");
        rosterDetails.classList.remove("custom-selected-background");
    }
    else
    {
        for(let row of tableRows)
        {
            if(!starters.includes(row.dataset.playerid))
            {
                row.setAttribute('class', 'custom-hidden-row row');
            }
            else {
                row.classList.add('custom-starter');
            }
        }
        rosterTable.classList.add("custom-selected-background");
        rosterDetails.classList.add("custom-selected-background");

        rosterTable.classList.remove("custom-default-background");
        rosterDetails.classList.remove("custom-default-background");
    }
}