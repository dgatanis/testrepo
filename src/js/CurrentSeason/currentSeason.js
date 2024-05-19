import { 
        rosters, 
        users, 
        players, 
        matchups, 
        playoffs, 
        getFullPlayerName, 
        createOwnerAvatarImage, 
        getRosterStats, 
        sortTeamRankings, 
        createPlayerImage,
        getTeamName,
        getMatchupWeekWinner,
        getRosterHighScorerWeek,
        highScorerInMatchupStarters 
        } from '../util/helper.js';

let userData = users;
let rosterData = rosters;
let playerData = players;
let matchupData = matchups;
let playoffData = playoffs;

loadContents();

//This loads the page contents dynamically
async function loadContents() {

    try{

        const leagueInfo = await import('../util/leagueInfo.js');
        const currentLeagueId = await leagueInfo.default();
        const currentSeason = await leagueInfo.getCurrentSeason();
        const currentWeek = await leagueInfo.getCurrentWeek();
        const weeklyWinnerPayout = leagueInfo.weeklyWinner;
        const dues = leagueInfo.dues;

        loadPlayoffs();
        loadSeasonRankings();
        loadMatchupsList(); 
        loadBankroll(currentWeek,dues,weeklyWinnerPayout); 
        //getLatestTransactions(currentLeagueId, currentWeek); 
        getLatestTransactions('998356266604916736','8');
        setSeasonTitle(currentSeason);
        
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

function loadSeasonRankings() { 

    try {
    
        var powerRank = 1;
        const sortedTeams = sortTeamRankings();
        
        for(let team of sortedTeams)
        {
            let user = userData.find(x => x.user_id === team.owner_id);
            var ownerImage = createOwnerAvatarImage(user.user_id);
            ownerImage.setAttribute('title', getRandomString());
            var teamNameDisplay = getTeamName(user.user_id);
            var teamName = document.createElement("div");
            teamName.setAttribute('class', 'custom-teamname-normal');

            if(powerRank <=2 )
            {
                teamName.innerText=teamNameDisplay + " - z"
            }
            else if(powerRank > 2 && powerRank <=6)
            {
                teamName.innerText=teamNameDisplay + " - x"
            }
            else if(powerRank < 10)
            {
                teamName.innerText=teamNameDisplay;
            }
            else
            {
                var lastPlaceImg = document.createElement("img");
                lastPlaceImg.setAttribute('src', '../src/static/images/lastPlace.png');
                lastPlaceImg.setAttribute('style', "max-width:1.5rem; margin-right:0.5rem;");
                lastPlaceImg.setAttribute('title', 'This guy STINKS');
                teamName.innerText=teamNameDisplay + " ";
                teamName.append(lastPlaceImg);
            }
            let roster = rosterData.find(x => x.owner_id === team.owner_id);
            var rosterStats = getRosterStats(roster.roster_id);
            var teamRecord = document.createElement("div");
            teamRecord.setAttribute('class', 'custom-standings-record');
            teamRecord.innerText = "("+rosterStats.wins + "-" + rosterStats.losses + "-" + rosterStats.losses + ")";
            var powerRankingElementId = "PowerRanking_"+powerRank;
            var rosterButtonId = "GetRosterButton_"+powerRank;
            var powerRanking = document.getElementById(powerRankingElementId);
            var rosterButton = document.getElementById(rosterButtonId);
            
            powerRanking.append(ownerImage);
            powerRanking.append(teamName);
            powerRanking.append(teamRecord);
            
            rosterButton.setAttribute("onclick", "OpenTeamRosterModal(" + user.user_id + ", '" + teamNameDisplay + "')");

            rosterButton.setAttribute('title', 'Look at their wack ass lineup.');
            powerRank++;
            
        }
    }
    catch(error){
        console.error(`Error ${error.message}`);
    }
}
     

function loadMatchups(weekNumber) {

    const noMatchup = document.getElementById("nomatchups_"+weekNumber);
    
    try{

        var arrayNum = parseInt(weekNumber) - 1;
        const matchups = matchupData[0].matchupWeeks[arrayNum];

        if(matchups && noMatchup.classList.contains('custom-block-display'))
        {
            const matchupsLength = Object.keys(matchups).length;

            const highScoreTeam = getRosterHighScorerWeek(matchups);
            const totalMatchups = matchupsLength / 2; //Every matchup should have two rosters

            var weekList = document.getElementById("matchupWeekList_" + weekNumber);
            var highScoringWeekRoster = highScoreTeam.roster_id;

            for(let i =1; i <= totalMatchups; i++)
            {
                let matchupId = i;
                let counter = 0;

                for(let j=0; j<matchupsLength; j++)
                {
                    let matchup = matchups[j];

                    if(matchup.matchup_id == matchupId)
                    {
                        counter++;   
                        let winningTeam = getMatchupWeekWinner(matchups, matchup.matchup_id);
                        let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                        let user = userData.find(x => x.user_id === roster.owner_id);
                        
                        let highestScorer = highScorerInMatchupStarters(matchup.starters, matchup.players_points);
                        let playerName = getFullPlayerName(highestScorer.player_id);
                        let userName = getTeamName(user.user_id);
                        let playerPoints = highestScorer.points + " pts";

                        var matchupDiv = document.createElement("div");
                        var playerDiv = document.createElement("div");
                        var teamNameSpan = document.createElement("span");
                        var teamScoreDiv = document.createElement("div");
                        var playerimg = createPlayerImage(highestScorer.player_id);
                        var teamImage = createOwnerAvatarImage(user.user_id);
                        var teamPoints = document.createElement("font");

                        playerDiv.innerText = playerName + ": " + playerPoints;
                        playerDiv.setAttribute("class", "custom-matchup-player");
                        playerDiv.prepend(playerimg);
                        matchupDiv.id = "rosterid_" + matchup.roster_id;
                        matchupDiv.setAttribute("class", "custom-matchup-row");
                        teamPoints.innerText = matchup.points + " pts";
                        teamPoints.setAttribute('class', 'custom-pts');
                        teamNameSpan.innerText= userName + ": ";
                        teamScoreDiv.setAttribute('class', 'custom-team-score');
                    
                        if(winningTeam[0].roster_id == roster.roster_id)
                        {
                            teamPoints.setAttribute('color', '#00a700');

                            //Ifs used to set different images/colors
                            if(Number(matchup.points) - Number(winningTeam[1].points) <= 2)
                            {
                                var angelImg = createMatchupIconImg();
                                angelImg.setAttribute('src','../src/static/images/angel-wings.png');
                                angelImg.setAttribute('title', 'The Fantasy Gods shine upon you');

                                teamScoreDiv.append(teamNameSpan);
                                teamScoreDiv.append(teamPoints);
                                teamScoreDiv.append(angelImg);
                            }
                            else if(Number(matchup.points) < 90)
                            {
                                var luckyImg = createMatchupIconImg();
                                luckyImg.setAttribute('src','../src/static/images/horseshoe.png');
                                luckyImg.setAttribute('title', 'You lucky SOB');
                                
                                teamScoreDiv.append(teamNameSpan);
                                teamScoreDiv.append(teamPoints);
                                teamScoreDiv.append(luckyImg);
                            }
                            else
                            {
                                teamScoreDiv.append(teamNameSpan);
                                teamScoreDiv.append(teamPoints);
                            }
                            
                            if(roster.roster_id == highScoringWeekRoster)
                            {
                                var weeklyHighScorer = createMatchupIconImg();
                                weeklyHighScorer.setAttribute('src', '../src/static/images/crown1.png');
                                weeklyHighScorer.setAttribute('title', 'Weekly high scorer');
    
                                teamScoreDiv.append(weeklyHighScorer);
                            }
                            
                        }
                        else
                        {
                            teamPoints.setAttribute('color', '#cb1919');
                            teamScoreDiv.append(teamNameSpan);
                            teamScoreDiv.append(teamPoints);
                        }

                        //Add all the elements to the matchup
                        matchupDiv.prepend(teamImage);
                        matchupDiv.append(teamScoreDiv);
                        matchupDiv.append(playerDiv);

                        var versus = document.createElement('span');
                        versus.setAttribute('class', 'custom-versus-matchup');
                        versus.innerText = 'Matchup ' + matchup.matchup_id;

                        //Add matchup header
                        if(counter == 1)
                        {
                            weekList.append(versus);
                        }

                        weekList.append(matchupDiv);
                        
                    }
                }
                
                if(totalMatchups != matchupId)
                {
                    var pacman = document.createElement("img");
                    pacman.setAttribute("src", "../src/static/images/pacman.gif"); 
                    pacman.setAttribute('id', 'pacman');
                    weekList.append(pacman);
                }

            }

            noMatchup.classList.remove('custom-block-display');
            noMatchup.classList.add('custom-none-display');
                    
        }
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }
}

function loadBankroll(week,dues,weeklyWinnerPayout) {
    
    try
    {
        let thisWeek = parseInt(week);
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
            totalBankRoll = weeksWon * parseInt(weeklyWinnerPayout);

            rosterBankrolls.push({
                "roster_id": roster.roster_id,
                "user_id": roster.owner_id,
                "bankroll": totalBankRoll,
                "weeks_won": weeksWon
            });
        }

        rosterBankrolls.sort((a, b) => b.bankroll - a.bankroll);

        //Iterate through each row in the table and add team to each row
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
            rowTeamName[0].setAttribute("style", "display: inline;");
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
                var highScorerImg = createMatchupIconImg();
                highScorerImg.setAttribute('src', '../src/static/images/crown1.png');
                highScorerImg.setAttribute('class', 'custom-matchup-icon-small');
                highScorerImg.setAttribute('style', 'padding-top: .5rem');
                highScorerImg.setAttribute('title', 'Weekly high scorer');

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

async function getLatestTransactions(leagueId,week) {

    try {
        //const transactions  = await fetch(`https://api.sleeper.app/v1/league/998356266604916736/transactions/8`);
        const transactions  = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`);
        const transactionsData = await transactions.json();
        //transactiontypes: waiver, free_agent, trade
        
        var allTransactions = getFormattedTransactionData(transactionsData);
        let noTransactions = document.getElementById("noTransactions");
        let transactionCarousel = document.getElementById("custom_transaction_inner");
        let counter = 0;

        if(noTransactions.classList.contains('custom-block-display') && allTransactions.length > 0)
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

                    //Get roster of transaction and create div for it
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
                            var playerDiv = createPlayerDiv(addedPlayers[i], 'add');

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
                            var playerDiv = createPlayerDiv(droppedPlayers[i], 'drop');
                            
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
                                    var playerDiv = createPlayerDiv(player.player_id, 'add');

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
                                    var playerDiv = createPlayerDiv(player.player_id, 'drop');
                                    
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
                //Add the whole item to the carousel
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

function loadPlayoffs() {

    var thePlayoffs = playoffData;
    
    for(let playoffRound of thePlayoffs)
    {
        var matchupId = playoffRound.m;

        if(playoffRound.r == 1)//Round 1
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));
            var round1 = document.getElementById('round1');

            if(team1)
                {
                    if(!round1.children[0].getAttribute('data-matchup-id'))
                    {
                        round1.children[0].setAttribute('data-matchup-id', matchupId);
                        round1.children[0].children[0].innerText = getTeamName(team1.owner_id);
                    }
                    else
                    {
                        round1.children[1].setAttribute('data-matchup-id', matchupId);
                        round1.children[1].children[0].innerText = getTeamName(team1.owner_id);
                    }
    
                }
                else if(team2)
                {
                    if(!round1.children[0].getAttribute('data-matchup-id'))
                    {
                        round1.children[0].setAttribute('data-matchup-id', matchupId);
                        round1.children[0].children[1].innerText = getTeamName(team2.owner_id);
                    }
                    else
                    {
                        round1.children[1].setAttribute('data-matchup-id', matchupId);
                        round1.children[1].children[1].innerText = getTeamName(team2.owner_id);
                    }
    
                }
        }
        else if(playoffRound.r == 2)//Semis
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));
            var round2 = document.getElementById('round2');

            if(team1)
            {
                if(!round2.children[0].getAttribute('data-matchup-id'))
                {
                    round2.children[0].setAttribute('data-matchup-id', matchupId);
                    round2.children[0].children[0].innerText = getTeamName(team1.owner_id);
                }
                else
                {
                    round2.children[1].setAttribute('data-matchup-id', matchupId);
                    round2.children[1].children[0].innerText = getTeamName(team1.owner_id);
                }

            }
            else if(team2)
            {
                if(!round2.children[0].getAttribute('data-matchup-id'))
                {
                    round2.children[0].setAttribute('data-matchup-id', matchupId);
                    round2.children[0].children[1].innerText = getTeamName(team2.owner_id);
                }
                else
                {
                    round2.children[1].setAttribute('data-matchup-id', matchupId);
                    round2.children[1].children[1].innerText = getTeamName(team2.owner_id);
                }

            }
        }
        else if(playoffRound.r == 3)//Finals
        {
            if(playoffRound.t2_from.w)
            {
                console.log("R3");
            }
        }
        
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


function createPlayerDiv(playerid, addDrop) {

    var player = playerData.players.find(x => x.player_id === parseInt(playerid));
    var playerDiv = document.createElement("div");
    playerDiv.setAttribute('class', 'custom-player');
    var playerImg = createPlayerImage(playerid);
    var playerName = document.createElement("div");
    var addDropIcon = createAddDropImg(addDrop);

    playerName.setAttribute('class', 'custom-playername-small');


    if(player) //Can Remove this once finished - just used for testing DEF
    {
        playerName.innerText = getFullPlayerName(playerid) + " (" + player.position +")";
        playerImg.classList.add('custom-' + addDrop.toLowerCase() + '-player');
        addDropIcon.classList.add('custom-' + addDrop.toLowerCase() + '-icon');
    }
    else
    {
        playerName.innerText = getFullPlayerName(playerid);
    }
    
    playerDiv.append(addDropIcon);
    playerDiv.append(playerImg);
    playerDiv.append(playerName);

    return playerDiv;
}

function getHighScorerCount(week) {

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
        "Jerseys aint cheap",
        "Tanking allegations ensuing",
        "We can do better than this",
        "*dry heaving*"
    ]
    var randomNumber=Math.random()*myArray.length;
    randomNumber= Math.random()*myArray.length;
    var roundRandomNumber = Math.floor(randomNumber);

    return myArray[roundRandomNumber];
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

    var currentWeek = matchupData[0].matchupWeeks.length;
    var matchupDiv = document.getElementById("matchupWeeks");
    var week = document.getElementById("currentWeek");

    for(let i = 1; i<15; i++)
    {
        var accordionItem = createAccordionItem(i);
        matchupDiv.appendChild(accordionItem);
        if(currentWeek > 0)
        {
            loadMatchups(i);
        }
        
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

function createMatchupButtonElement(weekNumber){
    var button = document.createElement("button");
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
    firstListItem.setAttribute('style', 'border-bottom: none;');

    var noMatchups = document.createElement("div");
    noMatchups.setAttribute("class", "custom-block-display custom-nomatchup");
    noMatchups.setAttribute("id", "nomatchups_"+weekNumber);
    noMatchups.innerText = "Check back when this week has started...";    

    list.appendChild(firstListItem);
    list.append(noMatchups);

    return list;
}

function createMatchupIconImg(){

    var img = document.createElement("img");
    img.setAttribute('class', "custom-matchup-icon-medium");

    return img;
}