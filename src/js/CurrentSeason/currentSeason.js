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
    getPlayerNickNames,
    createNFLTeamImage,
    setLeagueName,
    setLinkSource,
    getTransactionsData,
    getRandomString,
    removeSpinner
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
    try {

        const leagueInfo = await import('../util/leagueInfo.js');
        const currentLeagueId = await leagueInfo.default();
        const currentSeason = await leagueInfo.getCurrentSeason();
        const currentWeek = await leagueInfo.getCurrentWeek();
        const weeklyWinnerPayout = leagueInfo.weeklyWinner;
        const dues = leagueInfo.dues;
        loadSeasonRankings();
        loadMatchupsList(currentWeek);
        loadBankroll(currentWeek, dues, weeklyWinnerPayout);
        //loadBankroll('10',dues,weeklyWinnerPayout); 
        loadPlayoffs(currentWeek);
        getLatestTransactions(currentLeagueId, currentWeek);
        setSeasonTitle(currentSeason);
        removeSpinner();
        return;
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }

}

function setSeasonTitle(season) {
    var seasonTitle = document.getElementById('seasonTitle');

    seasonTitle.innerText = season + " Season";
}

function loadSeasonRankings() { 

    try {

        var rank = 1;
        const sortedTeams = sortTeamRankings();

        for (let team of sortedTeams) {
            let roster = rosterData.find(x => x.owner_id === team.owner_id);
            let user = userData.find(x => x.user_id === team.owner_id);
            var rosterStats = getRosterStats(roster.roster_id);
            var teamNameDisplay = getTeamName(user.user_id);

            var teamName = document.createElement("div");
            teamName.setAttribute('class', 'custom-teamname-normal');

            if (rank <= 2) {
                teamName.innerText = teamNameDisplay + " - z"
            }
            else if (rank > 2 && rank <= 6) {
                teamName.innerText = teamNameDisplay + " - x"
            }
            else if (rank < 10) {
                teamName.innerText = teamNameDisplay;
            }
            else {
                var lastPlaceImg = document.createElement("img");
                lastPlaceImg.setAttribute('src', '../src/static/images/lastPlace.png');
                lastPlaceImg.setAttribute('style', "max-width:1.5rem; margin-right:0.5rem;");
                lastPlaceImg.setAttribute('title', 'This guy STINKS');
                teamName.innerText = teamNameDisplay + " ";
                teamName.append(lastPlaceImg);
            }

            var ownerImage = createOwnerAvatarImage(user.user_id);
            ownerImage.setAttribute('title', getRandomString());
            var teamRecord = document.createElement("div");
            teamRecord.setAttribute('class', 'custom-standings-record');
            teamRecord.innerText = "(" + rosterStats.wins + "-" + rosterStats.losses + "-" + rosterStats.ties + ")";
            var standingsElementId = "Standings_" + rank;
            var rosterButtonId = "GetRosterButton_" + rank;
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
    catch (error) {
        console.error(`Error ${error.message}`);
    }
}


function loadMatchups(weekNumber,currentWeek) {

    const noMatchup = document.getElementById("nomatchups_" + weekNumber);

    try {

        var arrayNum = parseInt(weekNumber) - 1;
        const matchups = matchupData[0].matchupWeeks[arrayNum];

        if (matchups && noMatchup.classList.contains('custom-block-display')) {
            const matchupsLength = Object.keys(matchups).length;

            const highScoreTeam = getRosterHighScorerWeek(matchups);
            const totalMatchups = matchupsLength / 2; //Every matchup should have two rosters

            var weekList = document.getElementById("matchupWeekList_" + weekNumber);
            var highScoringWeekRoster = highScoreTeam.roster_id;

            for (let i = 1; i <= totalMatchups; i++) {
                let matchupId = i;
                let counter = 0;

                var versus = document.createElement('div');
                var matchupTeams = document.createElement('div');
                
                versus.setAttribute('class', "custom-versus-matchup");
                matchupTeams.setAttribute('class', "custom-matchup-teams");

                for (let j = 0; j < matchupsLength; j++) {
                let matchup = matchups[j];

                if (matchup.matchup_id == matchupId) {
                    counter++;
                    let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                    let user = userData.find(x => x.user_id === roster.owner_id);

                    let winningTeam = getMatchupWeekWinner(matchups, matchup.matchup_id);
                    let userName = getTeamName(user.user_id);
                    var matchupDiv = document.createElement("div");
                    var teamScoreDiv = document.createElement("div");
                    var teamImage = createOwnerAvatarImage(user.user_id);
                    var teamPoints = document.createElement("div");
                    var teamDiv = document.createElement("div");

                    teamDiv.setAttribute('class', 'custom-team-matchup')
                    matchupDiv.id = "rosterid_" + matchup.roster_id;
                    matchupDiv.setAttribute("class", "custom-matchup-row");
                    teamPoints.innerText = matchup.points + " pts";
                    teamPoints.setAttribute('class', 'custom-pts');
                    teamScoreDiv.setAttribute('class', 'custom-team-score');
                    
                    if(matchup.points != 0)
                    {
                        let highestScorer = highScorerInMatchupStarters(matchup.starters, matchup.players_points);
                        let playerName = getFullPlayerName(highestScorer.player_id);
                        var playerDiv = document.createElement("div");
                        var playerimg = createPlayerImage(highestScorer.player_id);
                        var playerNickName = getPlayerNickNames(roster.roster_id, highestScorer.player_id);
                        let playerPoints = highestScorer.points + " pts";
                        playerDiv.innerText = playerName + ": " + playerPoints;
                        playerDiv.setAttribute("class", "custom-matchup-player");
                        playerDiv.prepend(playerimg);

                        if (playerNickName != "") {
                            playerimg.setAttribute('title', playerNickName);
                        }
    
                    }
                    //if this is the winning team
                    if (winningTeam[0].roster_id == roster.roster_id && winningTeam[0].points != 0) {
                        teamPoints.setAttribute('style', 'color:#00a700');
                        teamScoreDiv.setAttribute('style', 'border: 1px solid #00a700');

                        if(weekNumber<currentWeek)
                        {
                            //Ifs used to set different images/colors
                            if (Number(matchup.points) - Number(winningTeam[1].points) <= 2) {
                                var angelImg = createMatchupIconImg();
                                angelImg.setAttribute('src', '../src/static/images/angel-wings.png');
                                angelImg.setAttribute('title', 'The Fantasy Gods shine upon you');

                                //teamScoreDiv.append(teamNameSpan);
                                teamScoreDiv.append(teamPoints);
                                teamScoreDiv.append(angelImg);
                            }
                            else if (Number(matchup.points) < 100) {
                                var luckyImg = createMatchupIconImg();
                                luckyImg.setAttribute('src', '../src/static/images/horseshoe.png');
                                luckyImg.setAttribute('title', 'You lucky SOB');

                                //teamScoreDiv.append(teamNameSpan);
                                teamScoreDiv.append(teamPoints);
                                teamScoreDiv.append(luckyImg);
                            }
                            else {
                                //teamScoreDiv.append(teamNameSpan);
                                teamScoreDiv.append(teamPoints);
                            }
                        }
                        else {
                            //teamScoreDiv.append(teamNameSpan);
                            teamScoreDiv.append(teamPoints);
                        }

                        if (roster.roster_id == highScoringWeekRoster) {
                            var weeklyHighScorer = createMatchupIconImg();
                            weeklyHighScorer.setAttribute('src', '../src/static/images/crown.png');
                            weeklyHighScorer.setAttribute('title', 'Weekly high scorer');

                            teamScoreDiv.append(weeklyHighScorer);
                        }

                    }
                    else if(winningTeam[0].points != 0) {
                        teamPoints.setAttribute('style', 'color:#cb1919');
                        teamScoreDiv.setAttribute('style', 'border: 1px solid #cb1919');
                        //teamScoreDiv.append(teamNameSpan);
                        teamScoreDiv.append(teamPoints);
                    }
                    else {
                        teamPoints.setAttribute('style', 'color:yellow;');
                        //teamScoreDiv.append(teamNameSpan);
                        teamScoreDiv.append(teamPoints);
                    }

                    //Add all the elements to the matchup
                    matchupDiv.append(teamScoreDiv);

                    if(matchup.points != 0)
                    {
                        matchupDiv.append(playerDiv);
                    }


                    var teamNameSpan = document.createElement("span");
                    teamNameSpan.innerText = userName;
                    teamDiv.append(teamImage);
                    teamDiv.append(teamNameSpan);
                    versus.appendChild(teamDiv);
                    

                    //Add matchup header
                    if (counter == 1) {
                        weekList.append(versus);
                    }
                    matchupTeams.append(matchupDiv);
                    weekList.append(matchupTeams);

                }
            }

        }

            noMatchup.classList.remove('custom-block-display');
            noMatchup.classList.add('custom-none-display');

        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

function loadBankroll(week,dues,weeklyWinnerPayout) {

    try {
        let thisWeek = parseInt(week);
        let highScorers = getHighScorerCount(thisWeek);
        let rosterBankrolls = [];

        for (let roster of rosterData) {
            let highScoreCount = highScorers[roster.roster_id];
            let weeksWon = 0;
            var totalBankRoll = 0;

            if (highScoreCount) {
                weeksWon = highScoreCount;
            }
            totalBankRoll = weeksWon * parseInt(weeklyWinnerPayout);

            if (roster.owner_id) {
            rosterBankrolls.push({
                "roster_id": roster.roster_id,
                "user_id": roster.owner_id,
                "bankroll": totalBankRoll,
                "weeks_won": weeksWon
            });
        }

        }

        rosterBankrolls.sort((a, b) => b.bankroll - a.bankroll);

        //Iterate through each row in the table and add team to each row
        for (let i = 0; i < rosterBankrolls.length; i++) {
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

            if (rosterBankrolls[i].weeks_won > 3) {
                row.setAttribute('style', 'background:#006f005c;');
            }
        else if (rosterBankrolls[i].weeks_won == 3) {
            row.setAttribute('style', 'background:#ffc8003d;');
        }
        else if (rosterBankrolls[i].weeks_won == 2) {
            row.setAttribute('style', 'background:#ed990069;');
        }
        else if (rosterBankrolls[i].weeks_won == 1) {
            row.setAttribute('style', 'background:#d3571a94;');
        }
        else if (rosterBankrolls[i].bankroll == 0 && rosterBankrolls[i].weeks_won < 1) {
            row.setAttribute('style', 'background:#a3a3a3;');
        }
        else {
            row.setAttribute('style', 'background:#cb19198c;');
        }

            for (let j = 0; j < rosterBankrolls[i].weeks_won; j++) {
                var highScorerImg = createMatchupIconImg();
                highScorerImg.setAttribute('src', '../src/static/images/crown.png');
                highScorerImg.setAttribute('class', 'custom-matchup-icon-small');
                highScorerImg.setAttribute('style', 'padding-top: .5rem');
                highScorerImg.setAttribute('title', 'Weekly high scorer');

                rowTeam[0].append(highScorerImg);
            }
        }

        var legend = document.getElementById('bankrollLegend');
        legend.innerText = "Weekly Payouts: $" + weeklyWinnerPayout + " Dues: $" + dues;
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }

}

async function getLatestTransactions(leagueId,week) {

    try {
        if (week == 0) {
            week = 1;
        }

        const transactionsData = await getTransactionsData(leagueId, week);
        var allTransactions = getFormattedTransactionData(transactionsData);

        let noTransactions = document.getElementById("noTransactions");
        let transactionCarousel = document.getElementById("custom_transaction_inner");
        let counter = 0;

        //transactiontypes: waiver, free_agent, trade
        if (noTransactions.classList.contains('custom-block-display') && allTransactions.length > 0) {
            for (let transaction of allTransactions) {
                var rosterId;
                var transactionDate = new Date(transaction.date);
                let transType = "";
                let description = "";

                //Handle trades differently than waiver/free agent
                if (transaction.type.toString().toLowerCase() != "trade") {
                    //Create carousel item and get each of the divs that were created
                    var carouselItem = createTransactionCarouselItem();
                    var cardBody = carouselItem.children[0].getElementsByClassName("card-body")[0];
                    var addedPlayerDiv = carouselItem.getElementsByClassName("custom-added-players")[0];
                    var droppedPlayerDiv = carouselItem.getElementsByClassName("custom-dropped-players")[0];
                    var tradedPicksDiv = carouselItem.getElementsByClassName("custom-traded-picks")[0];
                    var transactionDescription = carouselItem.getElementsByClassName("custom-transaction-description")[0];
                    var dateOfTransaction = carouselItem.getElementsByClassName("custom-date-transaction")[0];
                    var teamDiv = carouselItem.getElementsByClassName("custom-team-div")[0]; 

                if (counter == 0) {
                    carouselItem.classList.add('active');
                }
                counter++;

                if (transaction.type.toString().toLowerCase() == "free_agent") {
                    transType = "Free Agent";
                }
                else if (transaction.type.toString().toLowerCase() == "waiver") {
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
                teamRecord.innerText = thisTeamStats.wins + "-" + thisTeamStats.losses + "-" + thisTeamStats.ties;

                teamDiv.append(teamImg);
                teamDiv.append(teamName);
                teamDiv.append(teamRecord);

                //iterate through added/dropped players and create player images and append to their respective divs
                if (transaction.adds) {
                    let addedPlayers = Object.keys(transaction.adds);
                    description += "added ";
                    for (let i = 0; i < addedPlayers.length; i++) {
                        var player = playerData.players.find(x => x.player_id === addedPlayers[i]);
                        var playerDiv = createPlayerDiv(addedPlayers[i], 'add');
                        var nflTeamImg = createNFLTeamImage(player.team);

                        playerDiv.append(nflTeamImg);

                        if (transaction.settings && transaction.settings["waiver_bid"] > 0) {
                            var waiverBid = document.createElement('div');
                            waiverBid.setAttribute('class', 'custom-waiver-bid');
                            waiverBid.innerText = "-$" + transaction.settings["waiver_bid"];

                            playerDiv.append(waiverBid);
                        }
                        addedPlayerDiv.append(playerDiv);

                        description += getFullPlayerName(addedPlayers[i]);
                    }

                    addedPlayerDiv.classList.add('custom-block-display');
                    addedPlayerDiv.classList.remove('custom-none-display');
                }
                if (transaction.drops) {
                    if (transaction.adds) {
                        description += " and dropped ";
                    }
                    else {
                        description += "dropped ";
                    }

                    let droppedPlayers = Object.keys(transaction.drops);

                    for (let i = 0; i < droppedPlayers.length; i++) {
                        var player = playerData.players.find(x => x.player_id === droppedPlayers[i]);
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

            }
            noTransactions.classList.remove('custom-block-display');
            noTransactions.classList.remove('carousel-item');
            noTransactions.classList.add('custom-none-display');
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

function loadMatchupsList(currentWeek){

    var currentWeek = matchupData[0].matchupWeeks.length;
    var matchupDiv = document.getElementById("matchupWeeks");
    var week = document.getElementById("currentWeek");

    for (let i = 1; i < 15; i++) {
        var accordionItem = createAccordionItem(i);
        matchupDiv.appendChild(accordionItem);
        if (currentWeek > 0) {
            loadMatchups(i,currentWeek);
        }

    }
    if (currentWeek > 0) {
        week.innerText = "Week: " + currentWeek;
    }
    else {
        week.innerText = "N/A";
    }
}

function loadPlayoffs(currentWeek) {

    var thePlayoffs = playoffData;

    for (let playoffRound of thePlayoffs) {
        var matchupId = playoffRound.m;
        var winner = null;

        if (playoffRound.r == 1)//Round 1
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));

            if (team1 && team2) {
                winner = playoffRound.w;
                createPlayoffMatchup('round1', team1, team2, matchupId, winner); //round string param is the id of the element
            }

        }
        else if (playoffRound.r == 2)//Semis
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));

            if (team1 && team2 && !playoffRound.t1_from)//t1_from.w signals that this matchup comes from winners of another matchup 
            {
                winner = playoffRound.w;
                createPlayoffMatchup('round2', team1, team2, matchupId, winner);
            }
        else if (team1 && !team2 && !playoffRound.t1_from) {
                winner = playoffRound.w;
            createPlayoffMatchup('round2', team1, null, matchupId, winner);
            }
        }
        else if (playoffRound.r == 3)//Finals
        {
            var team1 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t1));
            var team2 = rosterData.find(x => x.roster_id === parseInt(playoffRound.t2));

            if (team1 && team2 && playoffRound.t1_from.w) //t1_from.w signals that this matchup comes from winners of another matchup
            {
                winner = playoffRound.w;
                createPlayoffMatchup('round3', team1, team2, matchupId, winner);
            }
        else if (playoffRound.t1_from.w && (!team1 || !team2)) {
                winner = playoffRound.w;
                createPlayoffMatchup('round3', null, null, matchupId, winner);
            }
        }

    }

    if (currentWeek <= 13) {
        var playoffsTitle = document.getElementsByClassName('custom-playoffs-label')[0];
        playoffsTitle.setAttribute('style', 'font-size: 2.5rem;word-spacing: 1rem;');
        playoffsTitle.innerText = 'Projected Playoffs';

    }

}

function createPlayoffMatchup(round, team1 = null, team2 = null, matchupId, winner) {
    var thisRound = document.getElementById(round);

    if (!thisRound.children[0].getAttribute('data-matchup-id')) {
        thisRound.children[0].setAttribute('data-matchup-id', matchupId);

        if (team1) {
            var teamStats = getRosterStats(team1.roster_id);
            var team1Image = createOwnerAvatarImage(team1.owner_id);
            var team1Name = document.createElement('div');

            team1Name.setAttribute('class', 'custom-playoff-team-name');
            team1Image.setAttribute('class', 'custom-xsmall-avatar');
            team1Image.setAttribute('title', 'W: ' + teamStats.wins + " L: " + teamStats.losses + " Pts: " + teamStats.fpts);

            team1Name.innerText = getTeamName(team1.owner_id);
            thisRound.children[0].children[0].prepend(team1Image);
            thisRound.children[0].children[0].append(team1Name);

            if (winner && winner == team1.roster_id) //winner
            {
                thisRound.children[0].children[0].setAttribute('style', 'background-color:var(--Add); border-color: var(--custom-green);');
                thisRound.children[0].children[0].children[1].setAttribute('style', 'color:black;');

            if (round == 'round3') //Finals
            {
                var throneImg = document.createElement('img');
                throneImg.setAttribute('src', '../src/static/images/throne.png');
                throneImg.setAttribute('class', 'custom-throne-icon-xsmall');
                throneImg.setAttribute('title', 'The Throne');

                thisRound.children[0].children[2].append(throneImg);
            }
        }
            else if (winner && winner != team1.roster_id) //loser
            {
                thisRound.children[0].children[0].setAttribute('style', 'background-color:var(--Drop); border-color: var(--custom-red);');
                thisRound.children[0].children[0].children[1].setAttribute('style', 'color:black;');
            }
        }
        else {
            thisRound.children[0].children[0].innerText = 'TBD'
        }

        if (team2) {
            var teamStats = getRosterStats(team1.roster_id);
            var team2Image = createOwnerAvatarImage(team2.owner_id);
            var team2Name = document.createElement('div');

            team2Name.setAttribute('class', 'custom-playoff-team-name');
            team2Image.setAttribute('class', 'custom-xsmall-avatar');
            team2Image.setAttribute('title', 'W: ' + teamStats.wins + " L: " + teamStats.losses + " Pts: " + teamStats.fpts);
            team2Name.innerText = getTeamName(team2.owner_id);

            thisRound.children[0].children[2].prepend(team2Image);
            thisRound.children[0].children[2].append(team2Name);

            if (winner && winner == team2.roster_id) {
                thisRound.children[0].children[2].setAttribute('style', 'background-color:var(--Add); border-color: var(--custom-green);');
                thisRound.children[0].children[2].children[1].setAttribute('style', 'color:black;');

            if (round == 'round3') {
                var throneImg = document.createElement('img');
                throneImg.setAttribute('src', '../src/static/images/throne.png');
                throneImg.setAttribute('class', 'custom-throne-icon-xsmall');
                throneImg.setAttribute('title', 'The Throne');

                thisRound.children[0].children[2].append(throneImg);
            }
        }
            else if (winner && winner != team2.roster_id) {
                thisRound.children[0].children[2].setAttribute('style', 'background-color:var(--Drop); border-color: var(--custom-red);');
                thisRound.children[0].children[2].children[1].setAttribute('style', 'color:black;');
            }
        }
        else {
            thisRound.children[0].children[2].innerText = 'TBD';
        }

    }
    else //two children of thisRound element left=.children[0] right=.children[1]
    {

        thisRound.children[1].setAttribute('data-matchup-id', matchupId);

        if (team1) {
            var teamStats = getRosterStats(team1.roster_id);
            var team1Image = createOwnerAvatarImage(team1.owner_id);
            var team1Name = document.createElement('div');

            team1Name.setAttribute('class', 'custom-playoff-team-name');
            team1Image.setAttribute('class', 'custom-xsmall-avatar');
            team1Image.setAttribute('title', 'W: ' + teamStats.wins + " L: " + teamStats.losses + " Pts: " + teamStats.fpts);
            team1Name.innerText = getTeamName(team1.owner_id);

            thisRound.children[1].children[0].prepend(team1Image);
            thisRound.children[1].children[0].append(team1Name);

            if (winner && winner == team1.roster_id) {
                thisRound.children[1].children[0].setAttribute('style', 'background-color:var(--Add); border-color: var(--custom-green);');
                thisRound.children[1].children[0].children[1].setAttribute('style', 'color:black;');
            }
            else if (winner && winner != team1.roster_id) {
                thisRound.children[1].children[0].setAttribute('style', 'background-color:var(--Drop); border-color: var(--custom-red);');
                thisRound.children[1].children[0].children[1].setAttribute('style', 'color:black;');
            }
        }
        else {
            thisRound.children[1].children[0].innerText = 'TBD';
        }
        if (team2) {
            var teamStats = getRosterStats(team1.roster_id);
            var team2Image = createOwnerAvatarImage(team2.owner_id);
            var team2Name = document.createElement('div');

            team2Name.setAttribute('class', 'custom-playoff-team-name');
            team2Image.setAttribute('class', 'custom-xsmall-avatar');
            team2Image.setAttribute('title', 'W: ' + teamStats.wins + " L: " + teamStats.losses + " Pts: " + teamStats.fpts);
            team2Name.innerText = getTeamName(team2.owner_id);

            thisRound.children[1].children[2].prepend(team2Image);
            thisRound.children[1].children[2].append(team2Name);

            if (winner && winner == team2.roster_id) {
                thisRound.children[1].children[2].setAttribute('style', 'background-color:var(--Add); border-color: var(--custom-green);');
                thisRound.children[1].children[2].children[1].setAttribute('style', 'color:black;');
            }
            else if (winner && winner != team2.roster_id) {
                thisRound.children[1].children[2].setAttribute('style', 'background-color:var(--Drop); border-color: var(--custom-red);');
                thisRound.children[1].children[2].children[1].setAttribute('style', 'color:black;');
            }
        }
        else {
            thisRound.children[1].children[2].innerText = 'TBD';
        }
    }

}

function getFormattedTransactionData(transactions){

    const allTransactions = [];

    for (let transaction of transactions) {
        if (transaction.status.toString().toLowerCase() == "complete") {
            if (transaction.type.toString().toLowerCase() == "free_agent" || transaction.type.toString().toLowerCase() == "waiver") {

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
                    "waiver_budget": null,
                    "settings": transaction.settings
                });
            }
        }
    }
    return allTransactions;
}


function createPlayerDiv(playerid, addDrop) {

    var player = playerData.players.find(x => x.player_id === playerid);
    var playerDiv = document.createElement("div");
    playerDiv.setAttribute('class', 'custom-player');
    var playerImg = createPlayerImage(playerid);
    var playerName = document.createElement("div");
    var playerPosition = document.createElement("div");
    var addDropIcon = createAddDropImg(addDrop);

    playerName.setAttribute('class', 'custom-playername-small');


    if (player) //Can Remove this once finished - just used for testing DEF
    {
        playerName.innerText = getFullPlayerName(playerid);
        playerPosition.innerText = "- " + player.position;
        playerPosition.setAttribute('class', 'custom-player-position');
        playerImg.classList.add('custom-' + addDrop.toLowerCase() + '-player');
        addDropIcon.classList.add('custom-' + addDrop.toLowerCase() + '-icon');
    }
    else {
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

    for (let i = 0; i < thisWeek; i++) {
        let matchups = matchupData[0].matchupWeeks[i];
        let highScorer = getRosterHighScorerWeek(matchups);
        if (highScorer.points > 0) {
        rosterHighScorers.push ({
            "roster_id": highScorer.roster_id,
            "wk_won": i +1
        });
    }

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

/*
** HTML Create/edit elements functions **
*/     
function createAddDropImg(addDrop) {

    var img = document.createElement('img');
    img.setAttribute('class', 'custom-add-drop-icon');

    if (addDrop.toString().toLowerCase() == "add") {
        img.setAttribute('src', '../src/static/images/add-sign.png');
    }
    else if (addDrop.toString().toLowerCase() == "drop") {
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
    var color = colors[Math.floor(Math.random() * 3)];
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
    button.setAttribute("data-bs-target", "#week_" + weekNumber);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "week_" + weekNumber);
    button.setAttribute("id", "buttonWeek_" + weekNumber)
    button.innerText = "Week #" + weekNumber;

    return button;
}   

function createMatchupListElement(weekNumber) {
    var list = document.createElement("ul");
    list.setAttribute("id", "matchupWeekList_" + weekNumber);
    list.setAttribute("class", "list-group custom-matchup-list list-group-flush");

    var firstListItem = document.createElement("li");
    firstListItem.setAttribute("class", "h4 list-group-item custom-matchup-list-item shadow p-3 mb-5 bg-body rounded");
    firstListItem.innerText = "Matchups and High Scorer";
    firstListItem.setAttribute('style', 'border-bottom: none;');

    var noMatchups = document.createElement("div");
    noMatchups.setAttribute("class", "custom-block-display custom-nomatchup");
    noMatchups.setAttribute("id", "nomatchups_" + weekNumber);
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