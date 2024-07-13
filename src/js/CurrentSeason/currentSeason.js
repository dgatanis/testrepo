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
        highScorerInMatchupStarters,
        getPlayerNickNames ,
        createNFLTeamImage,
        setLeagueName,
        setLinkSource,
        getTransactionsData 
} from '../util/helper.js';

let userData = users;
let rosterData = rosters;
let playerData = players;
let matchupData = matchups;
let playoffData = playoffs;

loadContents();

//This loads the page contents dynamically
async function loadContents() {

    setLeagueName("footerName");
    setLinkSource("keep-trade-cut");
    try{

        const leagueInfo = await import('../util/leagueInfo.js');
        const currentLeagueId = await leagueInfo.default();
        const currentSeason = await leagueInfo.getCurrentSeason();
        const currentWeek = await leagueInfo.getCurrentWeek();
        const weeklyWinnerPayout = leagueInfo.weeklyWinner;
        const dues = leagueInfo.dues;
        loadSeasonRankings();
        loadMatchupsList(); 
        loadBankroll(currentWeek,dues,weeklyWinnerPayout); 
        //loadBankroll('10',dues,weeklyWinnerPayout); 
        loadPlayoffs();
        getLatestTransactions(currentLeagueId, currentWeek); 
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
    
        var rank = 1;
        const sortedTeams = sortTeamRankings();
        
        for(let team of sortedTeams)
        {
            let roster = rosterData.find(x => x.owner_id === team.owner_id);
            let user = userData.find(x => x.user_id === team.owner_id);
            var rosterStats = getRosterStats(roster.roster_id);
            var teamNameDisplay = getTeamName(user.user_id);
        
            var teamName = document.createElement("div");
            teamName.setAttribute('class', 'custom-teamname-normal');

            if(rank <=2 )
            {
                teamName.innerText=teamNameDisplay + " - z"
            }
            else if(rank > 2 && rank <=6)
            {
                teamName.innerText=teamNameDisplay + " - x"
            }
            else if(rank < 10)
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
            
            var ownerImage = createOwnerAvatarImage(user.user_id);
            ownerImage.setAttribute('title', getRandomString());
            var teamRecord = document.createElement("div");
            teamRecord.setAttribute('class', 'custom-standings-record');
            teamRecord.innerText = "("+rosterStats.wins + "-" + rosterStats.losses + "-" + rosterStats.losses + ")";
            var standingsElementId = "Standings_"+rank;
            var rosterButtonId = "GetRosterButton_"+rank;
            var standing = document.getElementById(standingsElementId);
            var rosterButton = document.getElementById(rosterButtonId);
            
            standing.append(ownerImage);
            standing.append(teamName);
            standing.append(teamRecord);
            
            rosterButton.setAttribute("onclick", "OpenTeamRosterModal(" + user.user_id + ", '" + teamNameDisplay + "')");

            rosterButton.setAttribute('title', 'Look at their wack ass lineup.');
            rank++;
            
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
                        let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                        let user = userData.find(x => x.user_id === roster.owner_id);

                        let winningTeam = getMatchupWeekWinner(matchups, matchup.matchup_id);
                        let highestScorer = highScorerInMatchupStarters(matchup.starters, matchup.players_points);
                        let playerName = getFullPlayerName(highestScorer.player_id);
                        let userName = getTeamName(user.user_id);
                        let playerPoints = highestScorer.points + " pts";

                        var matchupDiv = document.createElement("div");
                        var playerDiv = document.createElement("div");
                        var teamNameSpan = document.createElement("span");
                        var teamScoreDiv = document.createElement("div");
                        var playerimg = createPlayerImage(highestScorer.player_id);
                        var playerNickName = getPlayerNickNames(roster.roster_id, highestScorer.player_id);
                        var teamImage = createOwnerAvatarImage(user.user_id);
                        var teamPoints = document.createElement("div");

                        playerDiv.innerText = playerName + ": " + playerPoints;
                        playerDiv.setAttribute("class", "custom-matchup-player");
                        playerDiv.prepend(playerimg);
                        matchupDiv.id = "rosterid_" + matchup.roster_id;
                        matchupDiv.setAttribute("class", "custom-matchup-row");
                        teamPoints.innerText = matchup.points + " pts";
                        teamPoints.setAttribute('class', 'custom-pts');
                        teamNameSpan.innerText= userName + ": ";
                        teamScoreDiv.setAttribute('class', 'custom-team-score');

                        if(playerNickName != "")
                        {
                            playerimg.setAttribute('title', playerNickName);
                        }
                    
                        //if this is the winning team
                        if(winningTeam[0].roster_id == roster.roster_id)
                        {
                            teamPoints.setAttribute('style', 'color:#00a700');

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
                            else if(Number(matchup.points) < 100)
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
                                weeklyHighScorer.setAttribute('src', '../src/static/images/crown.png');
                                weeklyHighScorer.setAttribute('title', 'Weekly high scorer');
    
                                teamScoreDiv.append(weeklyHighScorer);
                            }
                            
                        }
                        else
                        {
                            teamPoints.setAttribute('style', 'color:#cb1919');
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
            else if(rosterBankrolls[0].bankroll == 0 && rosterBankrolls[i].weeks_won < 1)
            {
                row.setAttribute('style', 'background:#a3a3a3;');
            }
            else
            {
                row.setAttribute('style', 'background:#cb19198c;');
            }

            for(let j = 0; j<rosterBankrolls[i].weeks_won; j++)
            {
                var highScorerImg = createMatchupIconImg();
                highScorerImg.setAttribute('src', '../src/static/images/crown.png');
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
        if(week == 0)
        {
            week = 1;
        }

        const transactionsData = await getTransactionsData(leagueId, week);
        var allTransactions = getFormattedTransactionData(transactionsData);
        
        let noTransactions = document.getElementById("noTransactions");
        let transactionCarousel = document.getElementById("custom_transaction_inner");
        let counter = 0;

        //transactiontypes: waiver, free_agent, trade
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
                            var player = playerData.players.find(x => x.player_id === parseInt(addedPlayers[i]));
                            var playerDiv = createPlayerDiv(addedPlayers[i], 'add');
                            var nflTeamImg = createNFLTeamImage(player.team);
                            description += getFullPlayerName(addedPlayers[i]);

                            playerDiv.append(nflTeamImg);
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
                            var player = playerData.players.find(x => x.player_id === parseInt(droppedPlayers[i]));
                            var playerDiv = createPlayerDiv(droppedPlayers[i], 'drop');
                            var nflTeamImg = createNFLTeamImage(player.team);
                            description += getFullPlayerName(droppedPlayers[i]);

                            playerDiv.append(nflTeamImg);
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
                    var transactionDraftPicks = transaction.draft_picks;

                    for(let i = 0; i < tradePartners; i++)
                    {
                        var rosterid = transaction.roster_id[i];
                        let roster = rosterData.find(x => x.roster_id === parseInt(rosterid));
                        var thisTeamStats = getRosterStats(roster.roster_id);
                        var teamRecord = document.createElement("div");
                        var addsCount = 0;
                        teamRecord.setAttribute('class', 'custom-team-record');
                        teamRecord.innerText = thisTeamStats.wins + "-" + thisTeamStats.losses +"-"+ thisTeamStats.ties;

                        //If its on the second+ team then create new divs and append these to current carousel item
                        if(i >= 1)
                        {
                            var newdroppedPlayers = document.createElement("div");
                            newdroppedPlayers.setAttribute('class', 'custom-dropped-players custom-none-display'); 
                            var newaddedPlayers = document.createElement("div");
                            newaddedPlayers.setAttribute('class', 'custom-added-players custom-none-display');
                            var newTradedPicks = document.createElement("div");
                            newTradedPicks.setAttribute('class', 'custom-traded-picks custom-none-display');

                            description += " while " + getTeamName(roster.owner_id).toString() + " received ";
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
                        
                        //loop through adds and create player image/name and append to added players div
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
                                    var nflTeamImg = createNFLTeamImage(player.team);

                                    if(i >= 1)
                                    {
                                        playerDiv.append(nflTeamImg);
                                        newaddedPlayers.append(playerDiv);
                                        newaddedPlayers.classList.add('custom-block-display');
                                        newaddedPlayers.classList.remove('custom-none-display');
                                    }
                                    else
                                    {
                                        addedPlayerDiv.append(playerDiv);
                                    }
                                    addsCount++;
                                }
                                
                            }
                            if(addedPlayersArray.length > 1)
                            {
                                addedPlayersArray[addedPlayersArray.length-1] = "and " + addedPlayersArray[addedPlayersArray.length-1];
                            }
                               
                            var newString = addedPlayersArray.toString().replaceAll(",", ", ").replace(", and", " and ");
                            description += newString;

                            addedPlayerDiv.classList.add('custom-block-display');
                            addedPlayerDiv.classList.remove('custom-none-display');
                        }
                        //loop through drops and create player image/name and append to dropped players div
                        if(transaction.drops)
                        {  
                            
                            for(let j= 0; j< droppedPlayers.length; j++)
                            {
                                //If a dropped player is not included in the additions
                                if(rosterid == transaction.drops[droppedPlayers[j]] && !addedPlayers.includes(droppedPlayers[j]))
                                {
                                    var player = playerData.players.find(x => x.player_id === parseInt(droppedPlayers[j]));
                                    var playerDiv = createPlayerDiv(player.player_id, 'drop');
                                    var nflTeamImg = createNFLTeamImage(player.team);
                                    
                                    if(i >= 1)
                                    {
                                        playerDiv.append(nflTeamImg);
                                        newdroppedPlayers.append(playerDiv);
                                        newdroppedPlayers.classList.add('custom-block-display');
                                        newdroppedPlayers.classList.remove('custom-none-display');
                                    }
                                    else
                                    {
                                        playerDiv.append(nflTeamImg);
                                        droppedPlayerDiv.append(playerDiv);
                                    }

                                    droppedPlayerDiv.classList.add('custom-block-display');
                                    droppedPlayerDiv.classList.remove('custom-none-display');
                                }
                            }
                        }
                        //loop through traded draft picks and format/append to traded picks div
                        if(transactionDraftPicks) 
                        {
                            var draftPickCount = 0;

                            for(let draftPick of transactionDraftPicks)
                            {
                                draftPickCount++;

                                //owner_id is the rosterid of the player that is receiving the pick
                                if(rosterid == draftPick.owner_id)
                                {
                                    var formattedRound;

                                    if(draftPick.round==1)
                                    {
                                        formattedRound = draftPick.round + "st round pick";
                                    }
                                    else if(draftPick.round==2)
                                    {
                                        formattedRound = draftPick.round + "nd round pick";
                                    }
                                    else if(draftPick.round==3)
                                    {
                                        formattedRound = draftPick.round + "rd round pick";
                                    }
                                    else 
                                    {
                                        formattedRound = draftPick.round + "th round pick";
                                    }

                                    //If on the 2nd+ team through the loop
                                    if(i >= 1)
                                    {
                                        var draftPickDiv = document.createElement('div');
                                        var round = document.createElement('div');
                                        var season = document.createElement('div');

                                        draftPickDiv.setAttribute('class', 'custom-draft-picks');
                                        round.setAttribute('class', 'custom-draft-pick-round');
                                        season.setAttribute('class', 'custom-draft-pick-season');
                                        round.innerText = formattedRound;
                                        season.innerText = " - " + draftPick.season;

                                        draftPickDiv.appendChild(round);
                                        draftPickDiv.appendChild(season);
                                        
                                        //If the original owner of the pick is not the person who traded away the pick
                                        if(draftPick.roster_id != draftPick.previous_owner_id)
                                        {
                                            var originalOwner = rosterData.find(x => x.roster_id === draftPick.roster_id);
                                            var originalOwnerDiv = document.createElement('div');
                                            originalOwnerDiv.setAttribute('class', 'custom-draft-pick-original-owner');
                                            originalOwnerDiv.innerText = "(via " + getTeamName(originalOwner.owner_id) + ")";
                                            draftPickDiv.appendChild(originalOwnerDiv);
                                        }
                                        newTradedPicks.classList.remove('custom-none-display');
                                        newTradedPicks.append(draftPickDiv);

                                        //If no adds then the player only received pick(s)
                                        if(addsCount == 0)
                                        {
                                            if(draftPickCount <=1)
                                            {
                                                description += " pick(s) ";
                                            }
                                        }
                                        else
                                        {
                                            description += " and pick(s) ";
                                        }
                                        
                                    }
                                    else
                                    {
                                        
                                        var draftPickDiv = document.createElement('div');
                                        var round = document.createElement('div');
                                        var season = document.createElement('div');

                                        draftPickDiv.setAttribute('class', 'custom-draft-picks');
                                        round.setAttribute('class', 'custom-draft-pick-round');
                                        season.setAttribute('class', 'custom-draft-pick-season');
                                        round.innerText = formattedRound;
                                        season.innerText = " - " + draftPick.season;


                                        draftPickDiv.appendChild(round);
                                        draftPickDiv.appendChild(season);

                                        //If the original owner of the pick is not the person who traded away the pick
                                        if(draftPick.roster_id != draftPick.previous_owner_id)
                                        {
                                            var originalOwner = rosterData.find(x => x.roster_id === draftPick.roster_id);
                                            var originalOwnerDiv = document.createElement('div');
                                            originalOwnerDiv.setAttribute('class', 'custom-draft-pick-original-owner');
                                            originalOwnerDiv.innerText = "(via " + getTeamName(originalOwner.owner_id) + ")";
                                            draftPickDiv.appendChild(originalOwnerDiv);
                                        }
                                        tradedPicksDiv.classList.remove('custom-none-display');
                                        tradedPicksDiv.append(draftPickDiv);

                                        //If no adds then the player only received pick(s)
                                        if(addsCount == 0)
                                        {
                                            if(draftPickCount <=1)
                                            {
                                                description += " pick(s) ";
                                            }
                                        }
                                        else
                                        {
                                            description += " and pick(s) ";
                                        }
                                    }
                                }
                            }
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
                            teamDiv.parentNode.insertBefore(newTradedPicks, teamDiv.nextSibling);
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
                var dateString = transactionDate.toLocaleString().replaceAll(",", "");

                if (dateString.endsWith("AM")) {
                    var formattedDate = dateString.toString().substring(0, dateString.lastIndexOf(":"));
                    formattedDate += " AM";
                }
                else if (dateString.endsWith("PM")) {
                    var formattedDate = dateString.toString().substring(0, dateString.lastIndexOf(":"));
                    formattedDate += " PM";
                }
                dateOfTransaction.innerText = formattedDate;
                dateOfTransaction.classList.add('custom-block-display');
                dateOfTransaction.classList.remove('custom-none-display');

                teamDiv.classList.remove('custom-none-display');
                teamDiv.classList.add('custom-block-display');

                cardBody.innerText = transType;
                transactionCarousel.append(carouselItem);

                noTransactions.classList.remove('custom-block-display');
                noTransactions.classList.remove('carousel-item');
                noTransactions.classList.add('custom-none-display');
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

function loadPlayoffs() {

    var thePlayoffs = playoffData;
    
    for(let playoffRound of thePlayoffs)
    {
        var matchupId = playoffRound.m;
        var winner = null;

        if(playoffRound.r == 1)//Round 1
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));

            if(team1 && team2)
            {
                winner = playoffRound.w;
                createPlayoffMatchup('round1', team1, team2, matchupId, winner); //round string param is the id of the element
            }

        }
        else if(playoffRound.r == 2)//Semis
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));

            if(team1 && team2 && !playoffRound.t1_from)//t1_from.w signals that this matchup comes from winners of another matchup 
            {
                winner = playoffRound.w;
                createPlayoffMatchup('round2', team1, team2, matchupId, winner);
            }
            else if(team1 && !team2 && !playoffRound.t1_from)
            {
                winner = playoffRound.w;
                createPlayoffMatchup('round2', team1, null, matchupId, winner); 
            }
        }
        else if(playoffRound.r == 3)//Finals
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));
            
            if(team1 && team2 && playoffRound.t1_from.w) //t1_from.w signals that this matchup comes from winners of another matchup
            {
                winner = playoffRound.w;
                createPlayoffMatchup('round3', team1, team2, matchupId, winner);
            }
            else if (playoffRound.t1_from.w && (!team1 || !team2))
            {
                winner = playoffRound.w;
                createPlayoffMatchup('round3', null, null, matchupId, winner);
            }
        }
        
    }

}

function createPlayoffMatchup(round, team1 = null, team2 = null, matchupId, winner) {
    var thisRound = document.getElementById(round);

    if(!thisRound.children[0].getAttribute('data-matchup-id'))
    {
        thisRound.children[0].setAttribute('data-matchup-id', matchupId);

        if(team1)
        {
            var team1Image = createOwnerAvatarImage(team1.owner_id);
            var team1Name = document.createElement('div');
        
            team1Name.setAttribute('class', 'custom-playoff-team-name');
            team1Image.setAttribute('class', 'custom-xsmall-avatar');
            team1Name.innerText = getTeamName(team1.owner_id);
            thisRound.children[0].children[0].prepend(team1Image);
            thisRound.children[0].children[0].append(team1Name);

            if(winner && winner == team1.roster_id) //winner
            {
                thisRound.children[0].children[0].setAttribute('style', 'background-color:var(--Add)');

                if(round == 'round3') //Finals
                {
                    var throneImg = document.createElement('img');
                    throneImg.setAttribute('src','../src/static/images/throne.png');
                    throneImg.setAttribute('class', 'custom-throne-icon-xsmall');
                    throneImg.setAttribute('title', 'The Throne');

                    thisRound.children[0].children[2].append(throneImg);
                }
            }
            else if(winner && winner != team1.roster_id) //loser
            {
                thisRound.children[0].children[0].setAttribute('style', 'background-color:var(--Drop)');
            }
        }
        else
        {
            thisRound.children[0].children[0].innerText= 'TBD'
        }

        if(team2)
        {
            var team2Image = createOwnerAvatarImage(team2.owner_id);
            var team2Name = document.createElement('div');

            team2Name.setAttribute('class', 'custom-playoff-team-name');
            team2Image.setAttribute('class', 'custom-xsmall-avatar');
            team2Name.innerText = getTeamName(team2.owner_id);
            thisRound.children[0].children[2].prepend(team2Image);
            thisRound.children[0].children[2].append(team2Name);

            if(winner && winner == team2.roster_id)
            {
                thisRound.children[0].children[2].setAttribute('style', 'background-color:var(--Add)');

                if(round == 'round3')
                {
                    var throneImg = document.createElement('img');
                    throneImg.setAttribute('src','../src/static/images/throne.png');
                    throneImg.setAttribute('class', 'custom-throne-icon-xsmall');
                    throneImg.setAttribute('title', 'The Throne');

                    thisRound.children[0].children[2].append(throneImg);
                }
            }
            else if(winner && winner != team2.roster_id)
            {
                thisRound.children[0].children[2].setAttribute('style', 'background-color:var(--Drop)');
            }
        }
        else
        {
            thisRound.children[0].children[2].innerText= 'TBD';
        }
    
    }
    else
    {

        thisRound.children[1].setAttribute('data-matchup-id', matchupId);

        if(team1)
        {
            var team1Image = createOwnerAvatarImage(team1.owner_id);
            var team1Name = document.createElement('div');
        
            team1Name.setAttribute('class', 'custom-playoff-team-name');
            team1Image.setAttribute('class', 'custom-xsmall-avatar');
            team1Name.innerText = getTeamName(team1.owner_id);
            thisRound.children[1].children[0].prepend(team1Image);
            thisRound.children[1].children[0].append(team1Name);

            if(winner && winner == team1.roster_id)
            {
                thisRound.children[1].children[0].setAttribute('style', 'background-color:var(--Add)');
            }
            else if(winner && winner != team1.roster_id)
            {
                thisRound.children[1].children[0].setAttribute('style', 'background-color:var(--Drop)');
            }
        }
        else
        {
            thisRound.children[1].children[0].innerText = 'TBD';
        }
        if(team2)
        {
            var team2Image = createOwnerAvatarImage(team2.owner_id);
            var team2Name = document.createElement('div');

            team2Name.setAttribute('class', 'custom-playoff-team-name');
            team2Image.setAttribute('class', 'custom-xsmall-avatar');
            team2Name.innerText = getTeamName(team2.owner_id);
            thisRound.children[1].children[2].prepend(team2Image);
            thisRound.children[1].children[2].append(team2Name);

            if(winner && winner == team2.roster_id)
            {
                thisRound.children[1].children[2].setAttribute('style', 'background-color:var(--Add)');
            }
            else if(winner && winner != team2.roster_id)
            {
                thisRound.children[1].children[2].setAttribute('style', 'background-color:var(--Drop)');
            }
        }
        else
        {
            thisRound.children[1].children[2].innerText= 'TBD';
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
    var playerPosition = document.createElement("div");
    var addDropIcon = createAddDropImg(addDrop);

    playerName.setAttribute('class', 'custom-playername-small');


    if(player) //Can Remove this once finished - just used for testing DEF
    {
        playerName.innerText = getFullPlayerName(playerid);
        playerPosition.innerText= "- " + player.position;
        playerPosition.setAttribute('class', 'custom-player-position');
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
    playerDiv.append(playerPosition);

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
            "roster_id": highScorer.roster_id,
            "wk_won": i +1
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
        "*dry heaving*",
        "This hurts to look at",
        "Why are you like this"
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

function createAccordionItem(weekNumber) {
    var headerId = "weekHeader_" + weekNumber;
    var colors = ["pink", "red", "yellow"];

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

    var pacman = document.createElement("img");
    var color = colors[Math.floor(Math.random()*3)];
    pacman.setAttribute("src", "../src/static/images/ghost-" + color + ".gif"); 
    pacman.setAttribute('id', 'ghost');

    var listItems = createMatchupListElement(weekNumber);

    //Add list items to body and add them to the collapsible
    accordionBody.appendChild(pacman);
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