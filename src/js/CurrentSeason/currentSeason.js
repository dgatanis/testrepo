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

        const leagueInfo = await import('../util/leagueInfo.js');
        const leagueInfoLeagueId = leagueInfo.default();
        const currentWeek = leagueInfo.getCurrentWeek();
        const currentSeason = leagueInfo.getCurrentSeason();
        const weeklyWinnerPayout = leagueInfo.weeklyWinner;
        const dues = leagueInfo.dues;

        const currentLeagueId = await leagueInfoLeagueId;
        const thisSeason = await currentSeason;
        const leagueId = currentLeagueId;
        const week = currentWeek;
        const season = thisSeason;

        loadSeasonRankings(leagueId);
        loadBankroll('10',dues,weeklyWinnerPayout); //TESTING
        getLatestTransactions('1');
        setSeasonTitle(season);
        loadMatchupsList(); 
        return;
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

function setSeasonTitle(season) {
    var seasonTitle = document.getElementById('seasonTitle');

    seasonTitle.innerText= season + " Season";
}

function loadSeasonRankings(leagueId) { 
    const userDataStorage = localStorage.getItem("UserData");
    const userData = JSON.parse(userDataStorage);

    try {
    
        const users = userData.map((user) => user);
        var powerRank = 1;
        const sortedTeams = sortTeamRankings();
        
        for(let team of sortedTeams)
        {
            let user = userData.find(x => x.user_id === team.owner_id);
            var ownerImage = createOwnerAvatarImage(user.user_id);
            var teamNameDisplay = getTeamName(user.user_id);
            var teamName = document.createElement("div");
            teamName.setAttribute('class', 'custom-teamname-normal');
            teamName.innerText=teamNameDisplay;
            ownerImage.setAttribute('title', getRandomString());

            var powerRankingElementId = "PowerRanking_"+powerRank;
            var rosterButtonId = "GetRosterButton_"+powerRank;
            var powerRanking = document.getElementById(powerRankingElementId);
            var rosterButton = document.getElementById(rosterButtonId);
            
            powerRanking.append(ownerImage);
            powerRanking.append(teamName);
            
            rosterButton.setAttribute("onclick", "OpenTeamRosterModal(" + user.user_id + ", '" + teamNameDisplay + "')");

            rosterButton.setAttribute('title', 'Look at their wack ass lineup.');
            powerRank++;
            
        }
    }
    catch(error){
        console.error(`Error ${error.message}`);
    }
}

/*
** Async functions **
*/          

function loadMatchups(weekNumber) {
    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 
    const userDataStorage = localStorage.getItem("UserData");
    const userData = JSON.parse(userDataStorage);
    const matchupWeekStorage = sessionStorage.getItem("MatchupData");
    const matchupData = JSON.parse(matchupWeekStorage); 

    const noMatchup = document.getElementById("nomatchups_"+weekNumber);
    
    try{

        var arrayNum = parseInt(weekNumber) - 1;
        const matchups = matchupData[0].matchupWeeks[arrayNum];

        if(matchups && noMatchup.classList.contains('custom-block-display'))
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
                        
                        let winningTeam = getMatchupWeekWinner(matchups, matchup.matchup_id);
                        let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                        let user = userData.find(x => x.user_id === roster.owner_id);
                        
                        let highestScorer = highScorerInMatchupStarters(matchup.starters, matchup.players_points);
                        let playerName = getFullPlayerName(highestScorer.player_id);
                        let userName = getTeamName(user.user_id);
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
                        matchupDiv.innerText= userName + ": "
                    
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

            noMatchup.classList.remove('custom-block-display');
            noMatchup.classList.add('custom-none-display');
                    
        }
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }
}

function OpenTeamRosterModal(userid,teamname) {

    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 
    const playerDataStorage = localStorage.getItem("PlayerData");
    const playerData = JSON.parse(playerDataStorage); 

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

function loadBankroll(week,dues,weeklyWinnerPayout) {

    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 
    
    try
    {
        let thisWeek = parseInt(week);
        let negDues = -Math.abs(dues);
        let highScorers = getHighScorerCount(thisWeek);
        let rosterBankrolls =[];

        for(let roster of rosterData)
        {
            let highScoreCount = highScorers[roster.roster_id];
            let weeksWon = 0;
            var totalBankRoll = 0;

            if(highScoreCount)
            {
            weeksWon = highScoreCount;
            }
            totalBankRoll = negDues + (weeksWon * parseInt(weeklyWinnerPayout));

            rosterBankrolls.push({
                "roster_id": roster.roster_id,
                "user_id": roster.owner_id,
                "bankroll": totalBankRoll,
                "weeks_won": weeksWon
            });
        }

        rosterBankrolls.sort((a, b) => b.bankroll - a.bankroll);

        for(let i = 0; i < rosterBankrolls.length; i++)
        {
            let row = document.getElementById("bankrollTeam_" + i);
            let rowTeam = row.getElementsByTagName('th');
            let rowBankRoll = row.getElementsByTagName('td');
            let rowTeamName = rowTeam[0].getElementsByClassName('custom-teamname-normal');

            var ownerAvatar = createOwnerAvatarImage(rosterBankrolls[i].user_id);
            var teamName = getTeamName(rosterBankrolls[i].user_id);
            ownerAvatar.setAttribute('class', 'custom-small-avatar');
            
            rowTeamName[0].innerText = teamName;
            rowTeam[0].prepend(ownerAvatar);
            rowBankRoll[0].innerText = "$" + rosterBankrolls[i].bankroll;
            rowBankRoll[0].setAttribute('style', 'padding-top:1rem;');

            if(rosterBankrolls[i].weeks_won > 3)
            {
                row.setAttribute('style', 'background:#006f005c;');
            }
            else if(rosterBankrolls[i].weeks_won == 3)
            {
                row.setAttribute('style', 'background:#ffc8003d;');
            }
            else if(rosterBankrolls[i].weeks_won == 2)
            {
                row.setAttribute('style', 'background:#ed990069;');
            }
            else if(rosterBankrolls[i].weeks_won == 1)
            {
                row.setAttribute('style', 'background:#d3571a94;');
            }
            else
            {
                row.setAttribute('style', 'background:#cb19198c;');
            }

            for(let j = 0; j<rosterBankrolls[i].weeks_won; j++)
            {
                var highScorerImg = createMatchupWeekHighScorerImg();
                highScorerImg.setAttribute('class', 'custom-highscorer-small');
                highScorerImg.setAttribute('style', 'padding-top: .5rem');

                rowTeam[0].append(highScorerImg);
            }
        }

        var legend = document.getElementById('bankrollLegend');
        legend.innerText="Weekly Payouts: $" + weeklyWinnerPayout + " Dues: $" + dues;
    }
    catch(error)
    {
        console.error(`Error: ${error.message}`);
    }

}

async function getLatestTransactions(week) {

    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage);
    const playerDataStorage = localStorage.getItem("PlayerData");
    const playerData = JSON.parse(playerDataStorage); 

    try {
        const transactions  = await fetch(`https://api.sleeper.app/v1/league/998356266604916736/transactions/8`);
        //const transactions  = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`);
        const transactionsData = await transactions.json();
        //transactiontypes: waiver, free_agent, trade
        
        var allTransactions = getFormattedTransactionData(transactionsData);
        let noTransactions = document.getElementById("noTransactions");
        let transactionCarousel = document.getElementById("custom_transaction_inner");
        let counter = 0;

        if(noTransactions.classList.contains('custom-block-display'))
        {
            for(let transaction of allTransactions)
            {  
                var rosterId;
                var transactionDate = new Date(transaction.date);
                let transType = "";
                let description = "";

                //Handle trades differently than waiver/free agent
                if(transaction.type.toString().toLowerCase() != "trade")
                { 
                    //Create carousel item and get each of the divs that were created
                    var carouselItem = createTransactionCarouselItem();
                    var cardBody = carouselItem.children[0].getElementsByClassName("card-body")[0];
                    var addedPlayerDiv = carouselItem.getElementsByClassName("custom-added-players")[0];
                    var droppedPlayerDiv = carouselItem.getElementsByClassName("custom-dropped-players")[0];
                    var tradedPicksDiv = carouselItem.getElementsByClassName("custom-traded-picks")[0];
                    var transactionDescription = carouselItem.getElementsByClassName("custom-transaction-description")[0];
                    var dateOfTransaction = carouselItem.getElementsByClassName("custom-date-transaction")[0];
                    var teamDiv = carouselItem.getElementsByClassName("custom-team-div")[0]; 

                    if(counter == 0)
                    {
                        carouselItem.classList.add('active');
                    }
                    counter++;

                    if(transaction.type.toString().toLowerCase() == "free_agent")
                    {
                        transType = "Free Agent";
                    }
                    else if(transaction.type.toString().toLowerCase() == "waiver")
                    {
                        transType = "Waiver Claim";
                    }

                    rosterId = transaction.roster_id[0];
                    let roster = rosterData.find(x => x.roster_id === parseInt(rosterId));

                    var teamImg = createOwnerAvatarImage(roster.owner_id);
                    teamImg.classList.add('custom-small-avatar');
                    teamImg.classList.remove('custom-medium-avatar');
                    
                    var teamName = document.createElement("div");
                    teamName.innerText = getTeamName(roster.owner_id);
                    teamName.setAttribute('class', 'custom-teamname-small');

                    var teamRecord = document.createElement("div");
                    teamRecord.setAttribute('class', 'custom-team-record');
                    var thisTeamStats = getRosterStats(roster.roster_id);
                    teamRecord.innerText = thisTeamStats.wins + "-" + thisTeamStats.losses +"-"+ thisTeamStats.ties;
                    
                    teamDiv.append(teamImg);
                    teamDiv.append(teamName);
                    teamDiv.append(teamRecord);
                    
                    //iterate through added/dropped players and create player images and append to their respective divs
                    if(transaction.adds)
                    {
                        let addedPlayers = Object.keys(transaction.adds);
                        description += "added ";
                        for(let i = 0; i< addedPlayers.length; i++)
                        {
                            description += getFullPlayerName(addedPlayers[i]);
                            var player = playerData.players.find(x => x.player_id === parseInt(addedPlayers[i]));
                            var playerDiv = document.createElement("div");
                            playerDiv.setAttribute('class', 'custom-player');
                            var playerImg = createPlayerImage(addedPlayers[i]);
                            var playerName = document.createElement("div");
                            var addedIcon = createAddDropImg("add");

                            playerName.setAttribute('class', 'custom-playername-small');

                            if(player) //Can Remove this once finished - just used for testing DEF
                            {
                                playerName.innerText = getFullPlayerName(addedPlayers[i]) + " ("+ player.position +")";
                            }
                            else
                            {
                                playerName.innerText = getFullPlayerName(addedPlayers[i]);
                            }

                            playerDiv.append(addedIcon);
                            playerDiv.append(playerImg);
                            playerDiv.append(playerName);

                            addedPlayerDiv.append(playerDiv);
                        }

                        addedPlayerDiv.classList.add('custom-block-display');
                        addedPlayerDiv.classList.remove('custom-none-display');
                    }
                    if(transaction.drops)
                    {
                        if(transaction.adds)
                        {
                            description += " and dropped ";
                        }
                        else
                        {
                            description += "dropped ";
                        }

                        let droppedPlayers = Object.keys(transaction.drops);
                        
                        for(let i = 0; i< droppedPlayers.length; i++)
                        {
                            description += getFullPlayerName(droppedPlayers[i]);
                            var player = playerData.players.find(x => x.player_id === parseInt(droppedPlayers[i]));
                            var playerDiv = document.createElement("div");
                            playerDiv.setAttribute('class', 'custom-player');
                            var playerImg = createPlayerImage(droppedPlayers[i]);
                            var playerName = document.createElement("div");
                            var droppedIcon = createAddDropImg("drop");

                            playerName.setAttribute('class', 'custom-playername-small');

                            if(player) //Can Remove this once finished - just used for testing DEF
                            {
                                playerName.innerText = getFullPlayerName(droppedPlayers[i]) + " (" + player.position +")";
                            }
                            else
                            {
                                playerName.innerText = getFullPlayerName(droppedPlayers[i]);
                            }
                            
                            playerDiv.append(droppedIcon);
                            playerDiv.append(playerImg);
                            playerDiv.append(playerName);
                            
                            droppedPlayerDiv.append(playerDiv);

                        }
                        droppedPlayerDiv.classList.add('custom-block-display');
                        droppedPlayerDiv.classList.remove('custom-none-display');
                    }

                    description = getTeamName(roster.owner_id).toString() + " " + description + "... " + getRandomString() + ".";
                    transactionDescription.innerText = description;
                }
                else if(transaction.type.toString().toLowerCase() == "trade")
                {
                    //Create carousel item and get each of the divs that were created
                    var carouselItem = createTransactionCarouselItem();
                    var cardBody = carouselItem.children[0].getElementsByClassName("card-body")[0];
                    var addedPlayerDiv = carouselItem.getElementsByClassName("custom-added-players")[0];
                    var droppedPlayerDiv = carouselItem.getElementsByClassName("custom-dropped-players")[0];
                    var tradedPicksDiv = carouselItem.getElementsByClassName("custom-traded-picks")[0];
                    var transactionDescription = carouselItem.getElementsByClassName("custom-transaction-description")[0];
                    var dateOfTransaction = carouselItem.getElementsByClassName("custom-date-transaction")[0];
                    var teamDiv = carouselItem.getElementsByClassName("custom-team-div")[0];

                    if(counter == 0)
                    {
                        carouselItem.classList.add('active');
                    }
                    counter++;
                    transType = "Trade";

                    var tradePartners = Object.keys(transaction.roster_id).length;

                    for(let i = 0; i < tradePartners; i++)
                    {
                        var rosterid = transaction.roster_id[i];
                        let roster = rosterData.find(x => x.roster_id === parseInt(rosterid));
                        var thisTeamStats = getRosterStats(roster.roster_id);
                        var teamRecord = document.createElement("div");
                        teamRecord.setAttribute('class', 'custom-team-record');
                        teamRecord.innerText = thisTeamStats.wins + "-" + thisTeamStats.losses +"-"+ thisTeamStats.ties;

                        //If its on the second+ team then create new divs and append these to current carousel item
                        if(i >= 1)
                        {
                            var newdroppedPlayers = document.createElement("div");
                            newdroppedPlayers.setAttribute('class', 'custom-dropped-players custom-none-display'); 
                            var newaddedPlayers = document.createElement("div");
                            newaddedPlayers.setAttribute('class', 'custom-added-players custom-none-display');

                            description += " from " + getTeamName(roster.owner_id).toString() + " for ";
                        }
                        else
                        {
                            description += getTeamName(roster.owner_id).toString() + " received ";
                        }

                        let addedPlayers = Object.keys(transaction.adds);
                        let droppedPlayers = Object.keys(transaction.drops);
                        
                        
                        var teamImg = createOwnerAvatarImage(roster.owner_id);
                        teamImg.classList.add('custom-small-avatar');
                        teamImg.classList.remove('custom-medium-avatar');

                        var teamName = document.createElement("div");
                        teamName.innerText = getTeamName(roster.owner_id);
                        teamName.setAttribute('class', 'custom-teamname-small');
                        
                        if(transaction.adds)
                        {
                            var addedPlayersArray = [];
                            for(let j = 0; j< addedPlayers.length; j++)
                            {                
                                if(rosterid == transaction.adds[addedPlayers[j]])
                                {
                                    addedPlayersArray.push(getFullPlayerName(addedPlayers[j]));
                                    var player = playerData.players.find(x => x.player_id === parseInt(addedPlayers[j]));
                                    var playerDiv = document.createElement("div");
                                    playerDiv.setAttribute('class', 'custom-player');
                                    var playerImg = createPlayerImage(addedPlayers[j]);
                                    var playerName = document.createElement("div");
                                    var addedIcon = createAddDropImg("add");

                                    playerName.setAttribute('class', 'custom-playername-small');

                                    if(player) //Can Remove this once finished - just used for testing DEF
                                    {
                                        playerName.innerText = getFullPlayerName(addedPlayers[j]) + " ("+ player.position +")";
                                    }
                                    else
                                    {
                                        playerName.innerText = getFullPlayerName(addedPlayers[j]);
                                    }

                                    playerDiv.append(addedIcon);
                                    playerDiv.append(playerImg);
                                    playerDiv.append(playerName);

                                    if(i >= 1)
                                    {
                                        newaddedPlayers.append(playerDiv);
                                        newaddedPlayers.classList.add('custom-block-display');
                                        newaddedPlayers.classList.remove('custom-none-display');
                                    }
                                    else
                                    {
                                        addedPlayerDiv.append(playerDiv);
                                    }
                                    
                                }
                            }
                            addedPlayersArray[addedPlayersArray.length-1] = "and " + addedPlayersArray[addedPlayersArray.length-1];
                            var lastComma = addedPlayersArray.toString().lastIndexOf(",");
                            var newString = addedPlayersArray.toString().replaceAll(",", ", ").replace(", and", " and ");
                            description += newString;

                            addedPlayerDiv.classList.add('custom-block-display');
                            addedPlayerDiv.classList.remove('custom-none-display');
                        }
                        if(transaction.drops)
                        {  
                            
                            for(let j= 0; j< droppedPlayers.length; j++)
                            {
                                //If a dropped player is not included in the additions
                                if(rosterid == transaction.drops[droppedPlayers[j]] && !addedPlayers.includes(droppedPlayers[j]))
                                {
                                    var player = playerData.players.find(x => x.player_id === parseInt(droppedPlayers[j]));
                                    var playerDiv = document.createElement("div");
                                    playerDiv.setAttribute('class', 'custom-player');
                                    var playerImg = createPlayerImage(droppedPlayers[j]);
                                    var playerName = document.createElement("div");
                                    var droppedIcon = createAddDropImg("drop");

                                    playerName.setAttribute('class', 'custom-playername-small');

                                    if(player) //Can Remove this once finished - just used for testing DEF
                                    {
                                        playerName.innerText = getFullPlayerName(droppedPlayers[j]) + " (" + player.position +")";
                                    }
                                    else
                                    {
                                        playerName.innerText = getFullPlayerName(droppedPlayers[j]);
                                    }
                                    
                                    playerDiv.append(droppedIcon);
                                    playerDiv.append(playerImg);
                                    playerDiv.append(playerName);
                                    
                                    if(i >= 1)
                                    {
                                        newdroppedPlayers.append(playerDiv);
                                        newdroppedPlayers.classList.add('custom-block-display');
                                        newdroppedPlayers.classList.remove('custom-none-display');
                                    }
                                    else
                                    {
                                        droppedPlayerDiv.append(playerDiv);
                                    }

                                    droppedPlayerDiv.classList.add('custom-block-display');
                                    droppedPlayerDiv.classList.remove('custom-none-display');
                                }
                            }
                        }
                        if(transaction.draft_picks) //TODO
                        {
                            
                        }

                        //append second+ teams additions/drops to the same carousel item
                        if(i >= 1)
                        {
                            var newteam = document.createElement("div");
                            newteam.setAttribute('class', 'custom-team-div');

                            newteam.append(teamImg);
                            newteam.append(teamName);
                            newteam.append(teamRecord);
                            teamDiv.parentNode.insertBefore(newteam, teamDiv.nextSibling);
                            teamDiv.parentNode.insertBefore(newdroppedPlayers, teamDiv.nextSibling);
                            teamDiv.parentNode.insertBefore(newaddedPlayers, teamDiv.nextSibling);
                        }
                        else
                        {
                            teamDiv.append(teamImg);
                            teamDiv.append(teamName);
                            teamDiv.append(teamRecord);
                        }
                        
                    }   
                    transactionDescription.innerText = description + "... " + getRandomString() + ".";
                }
                    
                dateOfTransaction.classList.add('custom-block-display');
                dateOfTransaction.classList.remove('custom-none-display');
                dateOfTransaction.innerText = transactionDate.toLocaleString().replaceAll(",", "");
                teamDiv.classList.remove('custom-none-display');
                teamDiv.classList.add('custom-block-display');

                cardBody.innerText = transType;
                transactionCarousel.append(carouselItem);
            }
            noTransactions.classList.remove('custom-block-display');
            noTransactions.classList.remove('carousel-item');
            noTransactions.classList.add('custom-none-display');
        }
    }
    catch(error)
    {
        console.error(`Error: ${error.message}`);
    }
}

function getFormattedTransactionData(transactions){

    const allTransactions = [];

    for(let transaction of transactions)
    {
        if(transaction.status.toString().toLowerCase() == "complete")
        {
            if(transaction.type.toString().toLowerCase() == "free_agent" || transaction.type.toString().toLowerCase() == "waiver")
            {
                
                let roster_id = transaction.roster_ids;
                let drops = transaction.drops;
                let adds = transaction.adds;
                let type = transaction.type;
                let date = transaction.status_updated;

                allTransactions.push({
                    "type": type,
                    "date": date,
                    "roster_id": roster_id,
                    "drops": drops,
                    "adds": adds,
                    "draft_picks": null,
                    "consenter_ids": null,
                    "waiver_budget": null
                });
            }
            else if (transaction.type.toString().toLowerCase() == "trade")
            {
                let roster_id = transaction.roster_ids;
                let drops = transaction.drops;
                let adds = transaction.adds;
                let draft_picks =  transaction.draft_picks;
                let consenter_ids = transaction.consenter_ids;
                let waiver_budget = transaction.waiver_budget;
                let type = "trade";
                let date = transaction.status_updated;

                allTransactions.push({
                    "type": type,
                    "date": date,
                    "roster_id": roster_id,
                    "drops": drops,
                    "adds": adds,
                    "draft_picks": draft_picks,
                    "consenter_ids": consenter_ids,
                    "waiver_budget": waiver_budget,
                });
            }
        }   
    }
    return allTransactions;
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

function highestScorerByPosition(rosterid) {
    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 

    const roster = rosterData.find(x => x.roster_id === parseInt(rosterid));
    const weeksPlayed = matchupData[0].matchupWeeks.length;
    const players = roster.players;
    const teamQB = [];
    const teamRB = [];
    const teamWR = [];
    const teamTE = [];

    for(let player of players)
    {
        let playerPoints = 0;
        let playerid = player;
        let thisPlayer = playerData.players.find(x => x.player_id === parseInt(playerid));

        for(let i = 0; i < weeksPlayed; i++)
        {
            let points = getPlayerPointsForWeek(playerid,i,rosterid);
            playerPoints += points;
        }

        if(thisPlayer.position == "QB")
        {        
            teamQB.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })
        }
        else if(thisPlayer.position == "RB")
        {        
            teamRB.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })

        }
        else if(thisPlayer.position == "WR")
        {        
            teamWR.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })

        }
        else if(thisPlayer.position == "TE")
        {        
            teamTE.push({
                "player_id": playerid,
                "position": thisPlayer.position,
                "points" : playerPoints
            })

        }

    }
    teamQB.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.wins < b.wins && a.fpts < b.fpts) {
          return 1;
        }
        return 0;
    });
    teamRB.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.wins < b.wins && a.fpts < b.fpts) {
          return 1;
        }
        return 0;
    });
    teamWR.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.wins < b.wins && a.fpts < b.fpts) {
          return 1;
        }
        return 0;
    });
    teamTE.sort(function (a, b) {
        if (a.points > b.points) {
          return -1;
        }
        if (a.wins < b.wins && a.fpts < b.fpts) {
          return 1;
        }
        return 0;
    });

    return teamQB[0], teamRB[0], teamWR[0], teamTE[0];

}

function getFullPlayerName(playerid) {

    const playerDataStorage = localStorage.getItem("PlayerData");
    const playerData = JSON.parse(playerDataStorage); 

    let player = playerData.players.find(x => x.player_id === parseInt(playerid));

    let playerName = playerid;

    if(player != undefined && player.firstname && player.lastname)
    {
        playerName = player.firstname + " " + player.lastname;
    }

    return playerName;
    
}

function sortByPosition(players) {

    const playerDataStorage = localStorage.getItem("PlayerData");
    const playerData = JSON.parse(playerDataStorage); 

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

    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 

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

    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 

    const rosters = rosterData.map((x) => x);
    let roster = rosters.find(x => x.roster_id === parseInt(rosterid));
    console.log(highestScorerByPosition(rosterid));

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

    const playerDataStorage = localStorage.getItem("PlayerData");
    const playerData = JSON.parse(playerDataStorage); 

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

    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 

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

    const playerDataStorage = localStorage.getItem("PlayerData");
    const playerData = JSON.parse(playerDataStorage); 

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

function toggleStarters(rosterId) {

    const rosterDataStorage = localStorage.getItem("RosterData");
    const rosterData = JSON.parse(rosterDataStorage); 

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


function getTeamName(userid) {

    const userDataStorage = localStorage.getItem("UserData");
    const userData = JSON.parse(userDataStorage);

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

function getPlayerPointsForWeek(playerid,week,rosterid) {

    let matchups = matchupData[0].matchupWeeks[week];
    let matchupsLength = Object.keys(matchups).length;
    
    for(let i =0; i<matchupsLength; i++)
    {
        let matchup = matchups[i];
        
        if(matchup.roster_id == rosterid)
        {
            let matchupPoints = matchup.players_points;
            if(matchupPoints[playerid] != null && matchupPoints[playerid] != undefined)
            {
                return parseFloat(matchupPoints[playerid]);
            }
            else
            {
                return 0;
            }
        }
    }
}

function getHighScorerCount(week) {

    const matchupWeekStorage = sessionStorage.getItem("MatchupData");
    const matchupData = JSON.parse(matchupWeekStorage); 

    let thisWeek = parseInt(week);
    let rosterHighScorers = [];
    const counter = {};

    for(let i = 0; i < thisWeek; i++)
    {
        let matchups = matchupData[0].matchupWeeks[i]
        let highScorer = getRosterHighScorerWeek(matchups);
        rosterHighScorers.push ({
            "roster_id": highScorer.roster_id
        });
    }

    rosterHighScorers.forEach(x => {

        if (counter[x.roster_id]) {
        counter[x.roster_id] += 1;
        } else {
            counter[x.roster_id] = 1;
        } 

    });
    
    return counter;
}

function getRandomString() {

    var myArray = [
        "What an idiot",
        "*rolls eyes*",
        "Every league needs a taco amirite",
        "Well this certainly isn't going to work out",
        "Yikes",
        "Is this season over yet",
        "https://www.nflshop.com/<enter jersey they're buying here>",
        "Wack",
        "Anyone else throw-up in their mouth a little",
        "You're probably wondering how we got here",
        "Softer than Charmin",
        "Yea we're all thinking the same thing",
        "*yawns*",
        "Be better",
        "Jerseys aint cheap"
    ]
    var randomNumber = Math.floor(Math.random()*myArray.length);

    return myArray[randomNumber];
}

/*
** HTML Create/edit elements functions **
*/     
function createAddDropImg(addDrop) {

    var img = document.createElement('img');
    img.setAttribute('class', 'custom-add-drop-icon');

    if(addDrop.toString().toLowerCase() == "add")
    {
        img.setAttribute('src', '../src/static/images/add-sign.png');
    }
    else if (addDrop.toString().toLowerCase() == "drop")
    {
        img.setAttribute('src', '../src/static/images/drop-sign.png');
    }
    
    
    return img
}

function createTransactionCarouselItem() {
    var carouselItem = document.createElement("div");
    carouselItem.setAttribute('class', 'carousel-item custom-carousel-item');

    var card = document.createElement("div");
    card.setAttribute('class', 'card custom-card');

    var cardBody = document.createElement("div");
    cardBody.setAttribute('class', 'card-body');
    
    var addedPlayers = document.createElement("div");
    addedPlayers.setAttribute('class', 'custom-added-players custom-none-display');

    var droppedPlayers = document.createElement("div");
    droppedPlayers.setAttribute('class', 'custom-dropped-players custom-none-display');

    var tradedPicks = document.createElement("div");
    tradedPicks.setAttribute('class', 'custom-traded-picks custom-none-display');

    var dateTransaction = document.createElement("div");
    dateTransaction.setAttribute('class', 'custom-date-transaction custom-none-display');

    var transactionDescription = document.createElement("div");
    transactionDescription.setAttribute('class', 'custom-transaction-description');

    var teamDiv = document.createElement("div");
    teamDiv.setAttribute('class', 'custom-team-div custom-none-display');

    card.appendChild(cardBody);
    carouselItem.appendChild(card);
    carouselItem.append(transactionDescription);
    carouselItem.append(addedPlayers);
    carouselItem.append(droppedPlayers);
    carouselItem.append(tradedPicks);
    carouselItem.append(teamDiv);
    carouselItem.append(dateTransaction);
    

    return carouselItem;
}

function loadMatchupsList(){

    const matchupWeekStorage = sessionStorage.getItem("MatchupData");
    const matchupData = JSON.parse(matchupWeekStorage); 

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

    const userDataStorage = localStorage.getItem("UserData");
    const userData = JSON.parse(userDataStorage);

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

function createPlayerImage(playerId) {
    let playerDataStorage = localStorage.getItem("PlayerData");
    let playerData = JSON.parse(playerDataStorage);
    let player = playerData.players.find(e => e.player_id === parseInt(playerId));

    if(player)
    {
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
    img.setAttribute('class', "custom-highscorer-medium");
    img.setAttribute('title', 'Weekly high scorer');

    return img;
}