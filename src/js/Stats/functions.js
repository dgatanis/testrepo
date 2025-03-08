async function submitTeams() {
    const helper = await import('../util/helper.js');
    const leagueInfo = await import('../util/leagueInfo.js');
    const currentSeason = await leagueInfo.getCurrentSeason();
    const currentWeek = await leagueInfo.getCurrentWeek();
    const allTimeMatchups = helper.allTimeMatchupData[0].matchupWeeks;
    const playerData = helper.players;

    var team1Name = document.getElementById('teamButton1').innerText;
    var team2Name = document.getElementById('teamButton2').innerText;
    var teamComparisonTable = document.getElementById('teamComparison');
    var team1UserId = helper.getUserByName(team1Name);
    var team2UserId = helper.getUserByName(team2Name);
    var rosterId1 = helper.getRosterByUserId(team1UserId);
    var rosterId2 = helper.getRosterByUserId(team2UserId);
    var winsRow = document.getElementById("wins");
    var avgPtsForRow = document.getElementById("avgPtsFor");
    var highScorePlayersRow = document.getElementById("highScorePlayers");
    var lowScorePlayersRow = document.getElementById("lowScorePlayers");
    var startSitAccRow = document.getElementById("startSitAcc");
    var postWinsRow = document.getElementById("postseasonWins");
    var postAvgPtsForRow = document.getElementById("postseasonAvgPtsFor");
    var postHighScorePlayersRow = document.getElementById("postseasonHighScorePlayers");
    var postLowScorePlayersRow = document.getElementById("postseasonLowScorePlayers");
    var postStartSitAccRow = document.getElementById("postseasonStartSitAcc");
    var overallTradesRow = document.getElementById("overallTrades");
    var overallRecordRow = document.getElementById("record");
    var overallAvgPtsForRow = document.getElementById("overallAvgPtsFor");
    var overallStartSitAccRow = document.getElementById("overallStartSitAcc");

    if (rosterId1 != rosterId2) {
        teamComparisonTable.classList.add('custom-none-display');
        document.getElementById('page-loading').classList.remove('custom-none-display');
        document.getElementById('h2hLegend').classList.add('custom-none-display');
        //Set team info
        var team1Header = document.getElementById('team1Header');
        var team2Header = document.getElementById('team2Header');
        var ownerName1 = team1Header.getElementsByTagName('span')[0];
        var ownerName2 = team2Header.getElementsByTagName('span')[0];
        var team1Image = helper.createOwnerAvatarImage(team1UserId);
        var team2Image = helper.createOwnerAvatarImage(team2UserId);
        var allTrades = await getTradeTransactions(helper);

        helper.setLinkSource('keep-trade-roster-comp', team1UserId, team2UserId);
        ownerName1.innerText = team1Name;
        ownerName2.innerText = team2Name;
        teamComparisonTable.classList.remove("custom-none-display");

        var progressBars = teamComparisonTable.getElementsByClassName('progress-bar');
        team1Image.classList.add("custom-team1-image-display");
        team2Image.classList.add("custom-team2-image-display");
        for(progress of progressBars) //reset progress bars
        {
            progress.setAttribute('style', 'width: 50%');
            progress.setAttribute('aria-valuenow', '50');
        }

        //remove already existing images
        if(team1Header.getElementsByTagName('img').length > 0 || team2Header.getElementsByTagName('img').length > 0) {
            team1Header.getElementsByTagName('img')[0].remove();
            team2Header.getElementsByTagName('img')[0].remove();
            team1Header.prepend(team1Image);
            team2Header.prepend(team2Image);
        }
        else {
            team1Header.prepend(team1Image);
            team2Header.prepend(team2Image);
        }

        const allMatchups = getMatchupsBetweenRosters(rosterId1, rosterId2, allTimeMatchups, currentWeek, currentSeason);
        var postSeasonMatchups = 0;
        var regularSeasonMatchups = 0;

        for (matchup of allMatchups)
        {
            if(matchup.week <= 14) 
            {
                regularSeasonMatchups++;
            }
            else if(matchup.week > 14) 
            {
                postSeasonMatchups++;
            }
        }

        if (winsRow) { //Wins losses rows
            var teamMatchups = allMatchups;
            var winsLosses = getRostersWinsLosses(teamMatchups, helper, rosterId1, rosterId2, 'N');
            var team1WinsResult = winsRow.getElementsByClassName('custom-team1-result')[0];
            var team2WinsResult = winsRow.getElementsByClassName('custom-team2-result')[0];
            var progress = winsRow.getElementsByClassName('progress')[0];
            
            team1WinsResult.innerText = winsLosses.team1.wins;
            team2WinsResult.innerText = winsLosses.team2.wins;

            if(winsLosses.team1.wins > 0)
            {
                var totalWins = winsLosses.team1.wins + winsLosses.team2.wins;
                var team1Percentage = (parseFloat(winsLosses.team1.wins / totalWins) * 100).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
            else if(winsLosses.team2.wins > 0)
            {
                var totalWins = winsLosses.team1.wins + winsLosses.team2.wins;
                var team2Percentage = (parseFloat(winsLosses.team2.wins / totalWins) * 100).toFixed(2);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
                var team1Percentage = parseFloat(100 - team2Percentage);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
            }

        }
        if (avgPtsForRow) { //Avg pts for/against rows
            var teamMatchups = allMatchups;
            var totalPoints = getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper, 'N');
            var team1avgPtsVal = totalPoints.team1.pointsFor / parseInt(regularSeasonMatchups);
            var team2avgPtsVal = totalPoints.team2.pointsFor / parseInt(regularSeasonMatchups);
            var team1avgPtsResult = avgPtsForRow.getElementsByClassName('custom-team1-result')[0];
            var team2avgPtsResult = avgPtsForRow.getElementsByClassName('custom-team2-result')[0];
            var progress = avgPtsForRow.getElementsByClassName('progress')[0];
            var totalPoints = parseFloat(team1avgPtsVal + team2avgPtsVal).toFixed(2);

            team1avgPtsResult.innerText = team1avgPtsVal.toFixed(2) + " pts";
            team2avgPtsResult.innerText = team2avgPtsVal.toFixed(2) + " pts";

            if (totalPoints) { 
                var team1Percentage = parseFloat((team1avgPtsVal / totalPoints) * 100).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
        }
        if(highScorePlayersRow){ //High scorer in matchups
            var teamMatchups = allMatchups;
            var highScorePlayers = getHighScorerPlayerInMatchups(teamMatchups, helper, 'N');
            var team1Player = highScorePlayers.find(player => player.roster_id === rosterId1);
            var team2Player = highScorePlayers.find(player => player.roster_id === rosterId2);
            var team1PlayerResult = highScorePlayersRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = highScorePlayersRow.getElementsByClassName('custom-team2-result')[0];
            var progress = highScorePlayersRow.getElementsByClassName('progress')[0];
            var player1Year = team1Player.year;
            var player2Year = team2Player.year;
            var player1Date = "week " + team1Player.week + " '" + player1Year.toString().substring(2,4)
            var player2Date = "week " + team2Player.week + " '" + player2Year.toString().substring(2,4)

            var player1Div = document.createElement('div');
            var player1Details = document.createElement('div');
            var playerName_1 = document.createElement('span');
            var playerPoints_1 = document.createElement('span');
            var player2Div = document.createElement('div');
            var player2Details = document.createElement('div');
            var playerName_2 = document.createElement('span');
            var playerPoints_2 = document.createElement('span');

            playerName_1.innerText = helper.getFullPlayerName(team1Player.player_id);
            playerName_2.innerText = helper.getFullPlayerName(team2Player.player_id);
            playerPoints_1.innerText = team1Player.maxPoints + " pts"
            playerPoints_2.innerText = team2Player.maxPoints + " pts"
            player1Details.setAttribute('class', 'custom-player-details');
            player1Details.innerText = player1Date
            player2Details.setAttribute('class', 'custom-player-details');
            player2Details.innerText = player2Date
            playerName_1.setAttribute('class', 'custom-player-name');
            playerName_2.setAttribute('class', 'custom-player-name');
            playerPoints_1.setAttribute('class', 'custom-player-points');
            playerPoints_2.setAttribute('class', 'custom-player-points');

            while (team1PlayerResult.firstChild) {
                team1PlayerResult.removeChild(team1PlayerResult.firstChild);
            }

            while (team2PlayerResult.firstChild) {
                team2PlayerResult.removeChild(team2PlayerResult.firstChild);
            }

            if (team1Player.maxPoints && team2Player.maxPoints) {
                var totalPoints = parseFloat(team1Player.maxPoints + team2Player.maxPoints).toFixed(2);
                var team1Percentage = parseFloat((team1Player.maxPoints / totalPoints) * 100).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }


            player1Div.appendChild(playerName_1);
            player1Div.appendChild(playerPoints_1);
            player2Div.appendChild(playerName_2);
            player2Div.appendChild(playerPoints_2);
            team1PlayerResult.appendChild(player1Div);
            team1PlayerResult.appendChild(player1Details);
            team2PlayerResult.appendChild(player2Div);
            team2PlayerResult.appendChild(player2Details);

        }
        if(lowScorePlayersRow){ //Low scorer in matchups
            var teamMatchups = allMatchups;
            var lowScorePlayers = getLowScorerPlayerInMatchups(teamMatchups, helper, 'N');
            var team1Player = lowScorePlayers.find(player => player.roster_id === rosterId1);
            var team2Player = lowScorePlayers.find(player => player.roster_id === rosterId2);
            var team1PlayerResult = lowScorePlayersRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = lowScorePlayersRow.getElementsByClassName('custom-team2-result')[0];
            var progress = lowScorePlayersRow.getElementsByClassName('progress')[0];
            var player1Year = team1Player.year;
            var player2Year = team2Player.year;
            var player1Date = "week " + team1Player.week + " '" + player1Year.toString().substring(2,4)
            var player2Date = "week " + team2Player.week + " '" + player2Year.toString().substring(2,4)

            var player1Div = document.createElement('div');
            var player1Details = document.createElement('div');
            var playerName_1 = document.createElement('span');
            var playerPoints_1 = document.createElement('span');
            var player2Div = document.createElement('div');
            var player2Details = document.createElement('div');
            var playerName_2 = document.createElement('span');
            var playerPoints_2 = document.createElement('span');

            playerName_1.innerText = helper.getFullPlayerName(team1Player.player_id);
            playerName_2.innerText = helper.getFullPlayerName(team2Player.player_id);
            playerPoints_1.innerText = team1Player.maxPoints + " pts";
            playerPoints_2.innerText = team2Player.maxPoints + " pts";
            player1Details.setAttribute('class', 'custom-player-details');
            player1Details.innerText = player1Date
            player2Details.setAttribute('class', 'custom-player-details');
            player2Details.innerText = player2Date
            playerName_1.setAttribute('class', 'custom-player-name');
            playerName_2.setAttribute('class', 'custom-player-name');
            playerPoints_1.setAttribute('class', 'custom-player-points');
            playerPoints_2.setAttribute('class', 'custom-player-points');

            while (team1PlayerResult.firstChild) {
                team1PlayerResult.removeChild(team1PlayerResult.firstChild);
            }

            while (team2PlayerResult.firstChild) {
                team2PlayerResult.removeChild(team2PlayerResult.firstChild);
            }

            if (team1Player && team2Player) {
                var team1Percentage = team1Player.maxPoints > team2Player.maxPoints ? 66.67 : 33.33;
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }

            player1Div.appendChild(playerName_1);
            player1Div.appendChild(playerPoints_1);
            player2Div.appendChild(playerName_2);
            player2Div.appendChild(playerPoints_2);
            team1PlayerResult.appendChild(player1Div);
            team1PlayerResult.appendChild(player1Details);
            team2PlayerResult.appendChild(player2Div);
            team2PlayerResult.appendChild(player2Details);
        }
        if(startSitAccRow){
            var teamMatchups = allMatchups;
            var team1PlayerResult = startSitAccRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = startSitAccRow.getElementsByClassName('custom-team2-result')[0];
            var teamStartSitAcc = allTeamMatchupAccuracy(teamMatchups, playerData, rosterId1, rosterId2, 'N');
            var team1Accuracy = parseFloat(teamStartSitAcc.team1.totalAcc / parseInt(regularSeasonMatchups)).toFixed(2);
            var team2Accuracy = parseFloat(teamStartSitAcc.team2.totalAcc / parseInt(regularSeasonMatchups)).toFixed(2);
            var progress = startSitAccRow.getElementsByClassName('progress')[0];

            team1PlayerResult.innerText = team1Accuracy + "%";
            team2PlayerResult.innerText = team2Accuracy + "%";

            if (team1Accuracy && team2Accuracy) {
                var team1Percentage = (parseFloat(team1Accuracy - team2Accuracy)+ 50).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
        }
        if (postWinsRow) {
            var teamMatchups = allMatchups;
            var winsLosses = getRostersWinsLosses(teamMatchups, helper, rosterId1, rosterId2, 'Y');
            var team1WinsResult = postWinsRow.getElementsByClassName('custom-team1-result')[0];
            var team2WinsResult = postWinsRow.getElementsByClassName('custom-team2-result')[0];
            var progress = postWinsRow.getElementsByClassName('progress')[0];

            team1WinsResult.innerText = winsLosses.team1.wins;
            team2WinsResult.innerText = winsLosses.team2.wins;

            if(winsLosses.team1.wins > 0)
            {
                var totalWins = winsLosses.team1.wins + winsLosses.team2.wins;
                var team1Percentage = (parseFloat(winsLosses.team1.wins / totalWins) * 100).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
            else if(winsLosses.team2.wins > 0)
            {
                var totalWins = winsLosses.team1.wins + winsLosses.team2.wins;
                var team2Percentage = (parseFloat(winsLosses.team2.wins / totalWins) * 100).toFixed(2);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
                var team1Percentage = parseFloat(100 - team2Percentage);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
            }
        }
        if (postAvgPtsForRow) { //Avg pts for/against rows
            var teamMatchups = allMatchups;
            var totalPoints = getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper, 'Y');
            var team1avgPtsVal = parseFloat(totalPoints.team1.pointsFor / parseInt(postSeasonMatchups));
            var team2avgPtsVal = parseFloat(totalPoints.team2.pointsFor / parseInt(postSeasonMatchups));
            var team1avgPtsResult = postAvgPtsForRow.getElementsByClassName('custom-team1-result')[0];
            var team2avgPtsResult = postAvgPtsForRow.getElementsByClassName('custom-team2-result')[0];
            var progress = postAvgPtsForRow.getElementsByClassName('progress')[0];
            var totalPoints = parseFloat(team1avgPtsVal + team2avgPtsVal).toFixed(2);

            if (team1avgPtsVal > 0 && team2avgPtsVal > 0) { 
                team1avgPtsResult.innerText = team1avgPtsVal.toFixed(2) + " pts";;
                team2avgPtsResult.innerText = team2avgPtsVal.toFixed(2) + " pts";;
                var totalPoints = parseFloat(team1avgPtsVal + team2avgPtsVal).toFixed(2);
                var team1Percentage = parseFloat((team1avgPtsVal / totalPoints) * 100).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
            else
            {
                team1avgPtsResult.innerText = '00.00';
                team2avgPtsResult.innerText = '00.00';
            }

        }
        if (postHighScorePlayersRow) { //High scorer in matchups
            var teamMatchups = allMatchups;
            var highScorePlayers = getHighScorerPlayerInMatchups(teamMatchups, helper, 'Y');
            var team1PlayerResult = postHighScorePlayersRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = postHighScorePlayersRow.getElementsByClassName('custom-team2-result')[0];
            var progress = postHighScorePlayersRow.getElementsByClassName('progress')[0];

            if (highScorePlayers.length > 0) {
                var team1Player = highScorePlayers.find(player => player.roster_id === rosterId1);
                var team2Player = highScorePlayers.find(player => player.roster_id === rosterId2);
                var player1Year = team1Player.year;
                var player2Year = team2Player.year;
                var player1Date = "week " + team1Player.week + " '" + player1Year.toString().substring(2, 4)
                var player2Date = "week " + team2Player.week + " '" + player2Year.toString().substring(2, 4)
                var player1Div = document.createElement('div');
                var player1Details = document.createElement('div');
                var playerName_1 = document.createElement('span');
                var playerPoints_1 = document.createElement('span');
                var player2Div = document.createElement('div');
                var player2Details = document.createElement('div');
                var playerName_2 = document.createElement('span');
                var playerPoints_2 = document.createElement('span');

                playerName_1.innerText = helper.getFullPlayerName(team1Player.player_id);
                playerName_2.innerText = helper.getFullPlayerName(team2Player.player_id);
                playerPoints_1.innerText = team1Player.maxPoints + " pts"
                playerPoints_2.innerText = team2Player.maxPoints + " pts"
                player1Details.setAttribute('class', 'custom-player-details');
                player1Details.innerText = player1Date
                player2Details.setAttribute('class', 'custom-player-details');
                player2Details.innerText = player2Date
                playerName_1.setAttribute('class', 'custom-player-name');
                playerName_2.setAttribute('class', 'custom-player-name');
                playerPoints_1.setAttribute('class', 'custom-player-points');
                playerPoints_2.setAttribute('class', 'custom-player-points');

                while (team1PlayerResult.firstChild) {
                    team1PlayerResult.removeChild(team1PlayerResult.firstChild);
                }

                while (team2PlayerResult.firstChild) {
                    team2PlayerResult.removeChild(team2PlayerResult.firstChild);
                }

                if (team1Player.maxPoints && team2Player.maxPoints) {
                    var totalPoints = parseFloat(team1Player.maxPoints + team2Player.maxPoints).toFixed(2);
                    var team1Percentage = parseFloat((team1Player.maxPoints / totalPoints) * 100).toFixed(2);
                    progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                    progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                    var team2Percentage = parseFloat(100 - team1Percentage);
                    progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                    progress.children[1].setAttribute('aria-valuenow', team2Percentage);
                }

                player1Div.appendChild(playerName_1);
                player1Div.appendChild(playerPoints_1);
                player2Div.appendChild(playerName_2);
                player2Div.appendChild(playerPoints_2);
                team1PlayerResult.appendChild(player1Div);
                team1PlayerResult.appendChild(player1Details);
                team2PlayerResult.appendChild(player2Div);
                team2PlayerResult.appendChild(player2Details);
            }
            else {
                team1PlayerResult.innerText = 'N/A';
                team2PlayerResult.innerText = 'N/A';
            }

        }
        if (postLowScorePlayersRow) {
            var teamMatchups = allMatchups;
            var lowScorePlayers = getLowScorerPlayerInMatchups(teamMatchups, helper, 'Y');
            var team1PlayerResult = postLowScorePlayersRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = postLowScorePlayersRow.getElementsByClassName('custom-team2-result')[0];
            var progress = postLowScorePlayersRow.getElementsByClassName('progress')[0];

            if (lowScorePlayers.length > 0) {
                var team1Player = lowScorePlayers.find(player => player.roster_id === rosterId1);
                var team2Player = lowScorePlayers.find(player => player.roster_id === rosterId2);
                var player1Year = team1Player.year;
                var player2Year = team2Player.year;
                var player1Date = "week " + team1Player.week + " '" + player1Year.toString().substring(2, 4)
                var player2Date = "week " + team2Player.week + " '" + player2Year.toString().substring(2, 4)

                var player1Div = document.createElement('div');
                var player1Details = document.createElement('div');
                var playerName_1 = document.createElement('span');
                var playerPoints_1 = document.createElement('span');
                var player2Div = document.createElement('div');
                var player2Details = document.createElement('div');
                var playerName_2 = document.createElement('span');
                var playerPoints_2 = document.createElement('span');

                playerName_1.innerText = helper.getFullPlayerName(team1Player.player_id);
                playerName_2.innerText = helper.getFullPlayerName(team2Player.player_id);
                playerPoints_1.innerText = team1Player.maxPoints + " pts";
                playerPoints_2.innerText = team2Player.maxPoints + " pts";
                player1Details.setAttribute('class', 'custom-player-details');
                player1Details.innerText = player1Date
                player2Details.setAttribute('class', 'custom-player-details');
                player2Details.innerText = player2Date
                playerName_1.setAttribute('class', 'custom-player-name');
                playerName_2.setAttribute('class', 'custom-player-name');
                playerPoints_1.setAttribute('class', 'custom-player-points');
                playerPoints_2.setAttribute('class', 'custom-player-points');

                while (team1PlayerResult.firstChild) {
                    team1PlayerResult.removeChild(team1PlayerResult.firstChild);
                }

                while (team2PlayerResult.firstChild) {
                    team2PlayerResult.removeChild(team2PlayerResult.firstChild);
                }

                if (team1Player && team2Player) {
                    var team1Percentage = team1Player.maxPoints > team2Player.maxPoints ? 66.67 : 33.33;
                    progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                    progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                    var team2Percentage = parseFloat(100 - team1Percentage);
                    progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                    progress.children[1].setAttribute('aria-valuenow', team2Percentage);
                }

                player1Div.appendChild(playerName_1);
                player1Div.appendChild(playerPoints_1);
                player2Div.appendChild(playerName_2);
                player2Div.appendChild(playerPoints_2);
                team1PlayerResult.appendChild(player1Div);
                team1PlayerResult.appendChild(player1Details);
                team2PlayerResult.appendChild(player2Div);
                team2PlayerResult.appendChild(player2Details);
            }
            else {
                team1PlayerResult.innerText = 'N/A';
                team2PlayerResult.innerText = 'N/A';
            }
        }
        if (postStartSitAccRow) {
            var teamMatchups = allMatchups;
            var team1PlayerResult = postStartSitAccRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = postStartSitAccRow.getElementsByClassName('custom-team2-result')[0];
            var progress = postStartSitAccRow.getElementsByClassName('progress')[0];
            var teamStartSitAcc = allTeamMatchupAccuracy(teamMatchups, playerData, rosterId1, rosterId2, 'Y');
            var team1Accuracy = parseFloat(teamStartSitAcc.team1.totalAcc / parseInt(postSeasonMatchups)).toFixed(2);
            var team2Accuracy = parseFloat(teamStartSitAcc.team2.totalAcc / parseInt(postSeasonMatchups)).toFixed(2);

            if (team1Accuracy > 0 && team2Accuracy > 0) {
                team1PlayerResult.innerText = team1Accuracy + "%";
                team2PlayerResult.innerText = team2Accuracy + "%";
                var team1Percentage = (parseFloat(team1Accuracy - team2Accuracy)+ 50).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
            else
            {
                team1PlayerResult.innerText = '00.00%';
                team2PlayerResult.innerText = '00.00%';
            }
        }
        if (overallTradesRow) {
            var trades = getTradesBetweenRosters(allTrades, rosterId1, rosterId2);
            var team1Result = overallTradesRow.getElementsByClassName('custom-team1-result')[0];
            var team2Result = overallTradesRow.getElementsByClassName('custom-team2-result')[0];
            team1Result.innerText = trades.total;
            team2Result.innerText = trades.total;

        }
        if (overallRecordRow) { //Wins losses rows
            var teamMatchups = allMatchups;
            var winsLosses = getRostersWinsLosses(teamMatchups, helper, rosterId1, rosterId2);
            var team1WinsResult = overallRecordRow.getElementsByClassName('custom-team1-result')[0];
            var team2WinsResult = overallRecordRow.getElementsByClassName('custom-team2-result')[0];
            var progress = overallRecordRow.getElementsByClassName('progress')[0];
            var totalMatchups = teamMatchups.length;

            team1WinsResult.innerText = winsLosses.team1.wins + '-' + winsLosses.team1.losses + '-' + winsLosses.team1.ties;
            team2WinsResult.innerText = winsLosses.team2.wins + '-' + winsLosses.team2.losses + '-' + winsLosses.team2.ties;

            if(winsLosses.team1.wins > 0)
            {
                var team1Percentage = parseFloat((winsLosses.team1.wins / totalMatchups) * 100).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
            else if(winsLosses.team2.wins > 0)
            {
                var team2Percentage = parseFloat((winsLosses.team2.wins / totalMatchups) * 100).toFixed(2);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
                var team1Percentage = parseFloat(100 - team2Percentage);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
            }


        }
        if (overallAvgPtsForRow) { //Avg pts for/against rows
            var teamMatchups = allMatchups;
            var totalPoints = getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper);
            var team1avgPtsVal = totalPoints.team1.pointsFor / teamMatchups.length;
            var team2avgPtsVal = totalPoints.team2.pointsFor / teamMatchups.length;
            var team1avgPtsResult = overallAvgPtsForRow.getElementsByClassName('custom-team1-result')[0];
            var team2avgPtsResult = overallAvgPtsForRow.getElementsByClassName('custom-team2-result')[0];
            var progress = overallAvgPtsForRow.getElementsByClassName('progress')[0];
            var totalPoints = parseFloat(team1avgPtsVal + team2avgPtsVal).toFixed(2);

            team1avgPtsResult.innerText = team1avgPtsVal.toFixed(2) + " pts";
            team2avgPtsResult.innerText = team2avgPtsVal.toFixed(2) + " pts";

            if (totalPoints) { 
                var team1Percentage = parseFloat((team1avgPtsVal / totalPoints) * 100).toFixed(2);
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }

        }
        if(overallStartSitAccRow){
            var teamMatchups = allMatchups;
            var team1PlayerResult = overallStartSitAccRow.getElementsByClassName('custom-team1-result')[0];
            var team2PlayerResult = overallStartSitAccRow.getElementsByClassName('custom-team2-result')[0];
            var teamStartSitAcc = allTeamMatchupAccuracy(teamMatchups, playerData, rosterId1, rosterId2);
            var team1Accuracy = (teamStartSitAcc.team1.totalAcc / parseInt(postSeasonMatchups + regularSeasonMatchups)).toFixed(2);
            var team2Accuracy = (teamStartSitAcc.team2.totalAcc / parseInt(postSeasonMatchups + regularSeasonMatchups)).toFixed(2);
            var progress = overallStartSitAccRow.getElementsByClassName('progress')[0];

            team1PlayerResult.innerText = team1Accuracy + "%";
            team2PlayerResult.innerText = team2Accuracy + "%";

            if (team1Accuracy && team2Accuracy) {
                var team1Percentage = (parseFloat(team1Accuracy - team2Accuracy)+ 50).toFixed(2) ;
                progress.children[0].setAttribute('style', 'width: ' + team1Percentage + '%');
                progress.children[0].setAttribute('aria-valuenow', team1Percentage);
                var team2Percentage = parseFloat(100 - team1Percentage);
                progress.children[1].setAttribute('style', 'width: ' + team2Percentage + '%');
                progress.children[1].setAttribute('aria-valuenow', team2Percentage);
            }
        }

        document.getElementById('h2hLegend').classList.remove('custom-none-display');
        helper.removeSpinner();
        teamComparisonTable.classList.remove('custom-none-display');
    }
    else
    {
        window.alert("Please ensure two different teams have been chosen.");
    }
}

async function getTradeTransactions(helper) {

    var allTradeTransactions = [];

    for (let league of helper.allTimeLeagueIds.ATLeagueId) {
        for (let i = 0; i <= 18; i++) {
            var transactions = await helper.getTransactionsData(league.league_id, i, "trade");

            allTradeTransactions.push({
                "season": league.year,
                "league_id": league.league_id,
                "week": i,
                "data": transactions
            });
        }
    }

    return allTradeTransactions;
}

function getTradesBetweenRosters(allTrades, roster_id1, roster_id2) {

    let totalTrades = {
        "total": 0
    };

    for (let trades of allTrades) {
        
        if (trades.data.length >= 1) {
            for (let trade of trades.data) {

                if(trade.roster_ids.includes(roster_id1) && trade.roster_ids.includes(roster_id2))
                {
                    totalTrades.total += 1;
                }

            }

        }
    }
    return totalTrades;
}

function getMatchupsBetweenRosters(rosterid_1, rosterid_2, allTimeMatchups, currentWeek, currentSeason) {
    const allMatchups = [];
    for (matchupWeek of allTimeMatchups) {
        Object.keys(matchupWeek).forEach(key => {
            if (isNaN(key)) return;
            const matchup = matchupWeek[key];
            const matchup_id = matchup.matchup_id;
            if (matchup.roster_id == rosterid_1 && (parseInt(matchupWeek.year) < parseInt(currentSeason) || (parseInt(matchupWeek.year) == parseInt(currentSeason) && parseInt(matchupWeek.week) < parseInt(currentWeek))))
            {
                let thisMatchup = Object.values(matchupWeek).filter(e => e.matchup_id == matchup_id && e.matchup_id !== null);
                if (thisMatchup && parseInt(thisMatchup[0].points) !== 0 && parseInt(thisMatchup[1].points) !== 0
                    &&  thisMatchup[0].roster_id == rosterid_2 || thisMatchup[1].roster_id == rosterid_2)
                {
                    allMatchups.push({...thisMatchup, "week":matchupWeek.week, "year":matchupWeek.year});
                }
            }

        });
    }

    return allMatchups.sort(function (a, b) {

        if(parseInt(a.season) !== parseInt(b.season))
        {
            return parseInt(b.season) - parseInt(a.season)
        }
        else {
            return parseInt(b.week) - parseInt(a.week);
        }
    });
}

    function getRostersWinsLosses(teamMatchups, helper, rosterId1, rosterId2, postseasonFilter = null) {
    let teamsRecord = {
        "team1": {
            wins: 0,
            losses: 0,
            ties: 0
        },
        "team2": {
            wins: 0,
            losses: 0,
            ties: 0
        }
    };
    var allMatchups = teamMatchups
    for(matchup of allMatchups)
    {
        if (postseasonFilter && postseasonFilter == 'Y' && matchup.week <= 14) continue;
        if (postseasonFilter && postseasonFilter == 'N' && matchup.week >= 15) continue;
        matchupWinners = helper.getMatchupWeekWinner(matchup, matchup[0].matchup_id);
        if(matchupWinners[0].roster_id === rosterId1 && matchupWinners[0].points != matchupWinners[1].points)
        {
            teamsRecord.team1.wins += 1
            teamsRecord.team2.losses += 1
        }
        else if(matchupWinners[0].roster_id === rosterId2 && matchupWinners[0].points != matchupWinners[1].points)
        {
            teamsRecord.team2.wins += 1
            teamsRecord.team1.losses += 1
        }
        else
        {
            teamsRecord.team1.ties += 1
            teamsRecord.team2.ties += 1
        }
    }

    return teamsRecord;

}

    function getTotalPtsInMatchup(teamMatchups, rosterId1, rosterId2, helper, postseasonFilter = null) {
    let teamsPoints = {
        "team1": {
            pointsFor: 0,
            pointsAgainst: 0,
            totalGames: teamMatchups.length
        },
        "team2": {
            pointsFor: 0,
            pointsAgainst: 0,
            totalGames: teamMatchups.length
        }
    };
    var allMatchups = teamMatchups
    for (matchup of allMatchups) {

        if (postseasonFilter && postseasonFilter == 'Y' && matchup.week <= 14) continue;
        if (postseasonFilter && postseasonFilter == 'N' && matchup.week >= 15) continue;
        matchup = helper.getMatchupWeekWinner(matchup, matchup[0].matchup_id);
        if (matchup[0].roster_id === rosterId1) {
            teamsPoints.team1.pointsFor += matchup[0].points;
            teamsPoints.team2.pointsAgainst += matchup[0].points;

            teamsPoints.team2.pointsFor += matchup[1].points;
            teamsPoints.team1.pointsAgainst += matchup[1].points;
        }
        else {
            teamsPoints.team1.pointsAgainst += matchup[0].points;
            teamsPoints.team2.pointsFor += matchup[0].points;

            teamsPoints.team2.pointsAgainst += matchup[1].points;
            teamsPoints.team1.pointsFor += matchup[1].points;
        }
    }

    return teamsPoints;
}

    function getHighScorerPlayerInMatchups(teamMatchups, helper, postseasonFilter = null) {
    let teamHighScorer = {
        "players":{}
    };
    var allMatchups = teamMatchups;
    for(matchup of allMatchups)
    {
        if (postseasonFilter && postseasonFilter == 'Y' && matchup.week <= 14) continue;
        if (postseasonFilter && postseasonFilter == 'N' && matchup.week >= 15) continue;
        var team1Starters = matchup[0].starters;
        var team1Points = matchup[0].players_points;
        var team2Starters = matchup[1].starters;
        var team2Points = matchup[1].players_points;
        var team1Player = helper.highScorerInMatchupStarters(team1Starters, team1Points);
        var team2Player = helper.highScorerInMatchupStarters(team2Starters, team2Points);
        if(team1Player)
        {
            if(!teamHighScorer.players[team1Player.player_id])
            {
                teamHighScorer.players[team1Player.player_id] = [];
                teamHighScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }
            else
            {
                teamHighScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }

        }
        if(team2Player)
        {
            if(!teamHighScorer.players[team2Player.player_id])
            {
                teamHighScorer.players[team2Player.player_id] = [];
                teamHighScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            else {
                teamHighScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            
        }
    }

    let sortedHighestEntries = Object.entries(teamHighScorer.players)
    .map(([player_id, entries]) => {
        //Find the highest points for each player
        const maxPointsEntry = entries.reduce((max, entry) => {
            return entry.points > max.points ? entry : max;
        }, entries[0]);
        
        return { player_id, maxPoints: maxPointsEntry.points, week: maxPointsEntry.week, year: maxPointsEntry.year, roster_id: maxPointsEntry.roster_id };
    })
    .sort((a, b) => b.maxPoints - a.maxPoints);

    // Step 4: Convert back to an object if needed
    let sortedTeamHighScorer = {};
    sortedHighestEntries.forEach(({ playerId, entries }) => {
        sortedTeamHighScorer[playerId] = entries;
    });

    return sortedHighestEntries;
}

    function getLowScorerPlayerInMatchups(teamMatchups, helper, postseasonFilter = null) {
    let teamLowScorer = {
        "players":{}
    };
    var allMatchups = teamMatchups;
    for(matchup of allMatchups)
    {
        if (postseasonFilter && postseasonFilter == 'Y' && matchup.week <= 14) continue;
        if (postseasonFilter && postseasonFilter == 'N' && matchup.week >= 15) continue;
        var team1Starters = matchup[0].starters;
        var team1Points = matchup[0].players_points;
        var team2Starters = matchup[1].starters;
        var team2Points = matchup[1].players_points;
        var team1Player = helper.lowScorerInMatchupStarters(team1Starters, team1Points);
        var team2Player = helper.lowScorerInMatchupStarters(team2Starters, team2Points);

        if(team1Player)
        {
            if(!teamLowScorer.players[team1Player.player_id])
            {
                teamLowScorer.players[team1Player.player_id] = [];
                teamLowScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }
            else
            {
                teamLowScorer.players[team1Player.player_id].push({"points": team1Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[0].roster_id});
            }

        }
        if(team2Player)
        {
            if(!teamLowScorer.players[team2Player.player_id])
            {
                teamLowScorer.players[team2Player.player_id] = [];
                teamLowScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            else {
                teamLowScorer.players[team2Player.player_id].push({"points": team2Player.points, "week": matchup.week, "year": matchup.year, "roster_id":matchup[1].roster_id});
            }
            
        }
    }

    let sortedLowestEntries = Object.entries(teamLowScorer.players)
    .map(([player_id, entries]) => {
        //Find the highest points for each player
        const maxPointsEntry = entries.reduce((max, entry) => {
            return entry.points < max.points ? entry : max;
        }, entries[0]);
        
        return { player_id, maxPoints: maxPointsEntry.points, week: maxPointsEntry.week, year: maxPointsEntry.year, roster_id: maxPointsEntry.roster_id };
    })
    .sort((a, b) => a.maxPoints - b.maxPoints);

    // Step 4: Convert back to an object if needed
    let sortedTeamLowScorer = {};
    sortedLowestEntries.forEach(({ playerId, entries }) => {
        sortedTeamLowScorer[playerId] = entries;
    });

    return sortedLowestEntries;
}


function calculateOverallStartSitAccuracy(starters, bench) {
    const positions = ["QB", "RB", "WR", "TE"];
    const positionResults = {};
    let totalTeamPoints = 0;

    positions.forEach((position) => {
        const { surrenderedPercentage, bestPossiblePoints, starterPoints } = calculatePointsSurrendered(
            starters[position],
            bench[position]
        );
        positionResults[position] = {
            surrenderedPercentage,
            bestPossiblePoints,
            starterPoints
        };
        totalTeamPoints += bestPossiblePoints;
    });

    // Calculate overall accuracy
    let overallAccuracy = 0;
    positions.forEach((position) => {
        const { surrenderedPercentage, bestPossiblePoints } = positionResults[position];
        const rawAccuracy = 100 - Math.abs(surrenderedPercentage);
        const weightedAccuracy = (rawAccuracy * bestPossiblePoints) / totalTeamPoints;
        overallAccuracy += weightedAccuracy;
    });

    return overallAccuracy.toFixed(2);
}

function calculatePointsSurrendered(startingPlayers, benchPlayers) {
    const allPlayers = [...startingPlayers, ...benchPlayers];
    const sortedPlayers = allPlayers.sort((a, b) => b - a);
    const bestPossiblePoints = sortedPlayers.slice(0, startingPlayers.length).reduce((acc, points) => acc + points, 0);
    const starterPoints = startingPlayers.reduce((acc, points) => acc + points, 0);
    const pointsDifference = starterPoints - bestPossiblePoints;
    return {
        surrenderedPercentage: bestPossiblePoints === 0 ? 0 : (pointsDifference / bestPossiblePoints) * 100,
        bestPossiblePoints,
        starterPoints
    };
}

function allTeamMatchupAccuracy(teamMatchups, playerData, roster_id1, roster_id2, postseasonFilter = null) {

    let teamStartSitAcc = {
        "team1": {
            totalAcc: 0,
            totalMatchups: teamMatchups.length
        },
        "team2": {
            totalAcc: 0,
            totalMatchups: teamMatchups.length
        }
    };

    for(let matchup of teamMatchups)
    {
        if (postseasonFilter && postseasonFilter == 'Y' && matchup.week <= 14) continue;
        if (postseasonFilter && postseasonFilter == 'N' && matchup.week >= 15) continue;
        var matchupTeam1 = Object.values(matchup).filter(e => e.roster_id === roster_id1);
        var matchupTeam2 = Object.values(matchup).filter(e => e.roster_id === roster_id2);
        var team1Starters = matchupTeam1[0].starters;
        var team1Players= matchupTeam1[0].players;
        var team1PlayerPoints = matchupTeam1[0].players_points;
        var team2Starters = matchupTeam2[0].starters;
        var team2Players= matchupTeam2[0].players;
        var team2PlayerPoints = matchupTeam2[0].players_points;

        var starters1 = {
            "QB": [],
            "RB": [],
            "WR": [],
            "TE": []
        }
        var bench1 = {
            "QB": [],
            "RB": [],
            "WR": [],
            "TE": []
        }

        var starters2 = {
            'QB': [],
            'RB': [],
            'WR': [],
            'TE': []
        }
        var bench2 = {
            "QB": [],
            "RB": [],
            "WR": [],
            "TE": []
        }
        
        for(let thisPlayer of team1Players)
        {
            var player = playerData.players.find(e => e.player_id === thisPlayer);
            if(team1Starters.includes(thisPlayer))
            {
                var points = team1PlayerPoints[player.player_id];
                if(starters1[player.position.toString()]) {
                    starters1[player.position.toString()].push(points);
                }
            }
            else
            {
                var points = team1PlayerPoints[player.player_id];
                if(bench1[player.position.toString()]) {
                    bench1[player.position.toString()].push(points);
                }
            }
            
        }

        for(let thisPlayer of team2Players)
        {
            var player = playerData.players.find(e => e.player_id === thisPlayer);
            if(team2Starters.includes(thisPlayer)) {
                var points = team2PlayerPoints[player.player_id];
                if(starters2[player.position.toString()]) {
                    starters2[player.position.toString()].push(points);
                }
            }
            else
            {
                var points = team2PlayerPoints[player.player_id];
                if(bench2[player.position.toString()]) {
                    bench2[player.position.toString()].push(points);
                }
            }

        }

        var team1Acc = calculateOverallStartSitAccuracy(starters1, bench1);
        var team2Acc = calculateOverallStartSitAccuracy(starters2, bench2);
        teamStartSitAcc.team1.totalAcc += parseFloat(team1Acc);
        teamStartSitAcc.team2.totalAcc += parseFloat(team2Acc);
    }

        return teamStartSitAcc;
}
