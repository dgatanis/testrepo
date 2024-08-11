async function OpenTeamRosterModal(userid,teamname) {
    const helper = await import('../util/helper.js');
    var rosterData = helper.rosters;
    var playerData = helper.players;
    
    var modalRosterTeamName = document.querySelector('#ModalRosterTeamName');
    var rosterTable = document.querySelector('#RosterTable');
    var tablebody = rosterTable.childNodes[3];
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

            record.innerText = "Wins: " + rosterStats.wins + " Losses: " + rosterStats.losses + " Pts: " + rosterStats.fpts;
            leaguePositionsLink.title = "Toggle Starters (" + leaguePositionList + ")";
            leaguePositionsLink.setAttribute('onclick', 'toggleStarters(' + roster.roster_id +')');
            age.innerText = rosterStats.AvgAge + " yrs";

            //length of highScorers and highScorerPlayers must match
            for(let i =0; i < highScorers.length; i++)
            {
                var playerImg = helper.createPlayerImage(highScorerPlayers[i].player_id);
                playerImg.setAttribute('class', 'custom-small-player-avatar');
                
                var playerName = helper.getFullPlayerName(highScorerPlayers[i].player_id);
                var playerNameDiv = document.createElement("div");
                playerNameDiv.setAttribute('class', 'custom-playername-small');
                playerNameDiv.setAttribute('style', 'margin-top:.2rem;');
                playerNameDiv.innerText = playerName + ": " + highScorerPlayers[i].points + "pts"
                 
                highScorers[i].append(playerNameDiv);
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

async function toggleStarters(rosterId) {
    const helper = await import('../util/helper.js');
    var rosterData = helper.rosters;

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