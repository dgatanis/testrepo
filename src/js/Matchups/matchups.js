import { 
    rosters,
    users,
    players,
    matchups,
    allTimeMatchupData,
    allTimeLeagueIds,
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
    getPlayoffsData,
    removeSpinner
} from '../util/helper.js';

let userData = users;
let rosterData = rosters;
let playerData = players;
let matchupData = allTimeMatchupData[0].matchupWeeks;
let leagueIds = allTimeLeagueIds;
let winLossRecords = [];

loadContents();

async function loadContents() {
    setLeagueName("footerName");
    setLinkSource("keep-trade-cut");
    try {

        const leagueInfo = await import('../util/leagueInfo.js');
        const currentSeason = await leagueInfo.getCurrentSeason();
        const currentWeek = await leagueInfo.getCurrentWeek();
        loadMatchupsList(currentWeek, currentSeason);
        removeSpinner();
        
        return;
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
    }

}

async function loadMatchupsList(currentWeek, currentSeason) {
    var currentWeek = matchupData.length;
    var matchupDiv = document.getElementById("allTimeMatchups");
    var year = null;
    var seasonAccordionItem = null;
    var accordionContainer = null;

    var fullPlayoffData = [];

    for(let leagueId of leagueIds.ATLeagueId) { //loop to get all playoffs data
        var leaguePlayoff = await loadPlayoffs(leagueId.league_id, leagueId.year);

        fullPlayoffData.push({
            ...leaguePlayoff[0]
        })
    }

    for (let i = 0; i < matchupData.length; i++) {
        var thisWeek = matchupData[i];
        var thisYear = matchupData[i].year;

        if (thisWeek.week != 18 && thisWeek.week != 0 && (thisWeek > currentWeek && thisWeek.year <= currentSeason || (thisWeek.year < currentSeason))) {
            if (year == null || year != thisYear) {
                year = thisYear;
                accordionContainer = document.createElement("div"); //create accordion container per season
                accordionContainer.setAttribute("class", "accordion custom-div-shadow accordion-container-season")
                accordionContainer.setAttribute("id", "season_" + thisWeek.year);
                seasonAccordionItem = createAccordionItem(thisYear, "#season_" + thisWeek.year);
                accordionContainer.appendChild(seasonAccordionItem);
                matchupDiv.appendChild(accordionContainer);
            }
            var weekAccordionItem = createAccordionItem(thisWeek.week, "#week_" + thisWeek.year); //create and append week accordion to season accordion
            seasonAccordionItem.getElementsByClassName("accordion-container")[0].appendChild(weekAccordionItem);
            var matchup = loadMatchups(thisWeek.week, thisWeek.year, fullPlayoffData); //create matchup and append to the designated week
            weekAccordionItem.getElementsByClassName("accordion-body")[0].appendChild(matchup);
        }
    }
    console.log(winLossRecords);
}

async function loadPlayoffs(leagueId, year){
    var playoff = await getPlayoffsData(leagueId);
    let playoffArray = [];

    playoffArray.push({
        "league_id": leagueId,
        "year": year,
        ...playoff
    });

    return playoffArray;
}

function loadMatchups(weekNumber, season, fullPlayoffData) {

    var matchupWeek = matchupData.find(x => x.week == weekNumber && x.year == season);
    const week = matchupWeek.week;
    const year = matchupWeek.year;
    delete matchupWeek.week;
    delete matchupWeek.year;
    var validMatchupIds;

    if(weekNumber >=15) {
        //debugger;
        var playoffYear = fullPlayoffData.find(x => x.year === season);
        if (weekNumber == 15) {
            var playoffMatchupDetails = Object.values(playoffYear).filter(entry => typeof entry === 'object' && entry.r === 1 && entry.p != 3 && entry.p != 5);
            validMatchupIds = new Set(playoffMatchupDetails.map(detail => detail.m));
        }
        else if (weekNumber == 16) {
            var playoffMatchupDetails = Object.values(playoffYear).filter(entry => typeof entry === 'object' && entry.r === 2 && entry.p != 3 && entry.p != 5);
            var rosterIds = new Set(playoffMatchupDetails.flatMap(detail => [detail.t1, detail.t2])); //filter on rosterids to find matchupids
            var rosterMatchups = Object.values(matchupWeek).filter(x => typeof x === 'object' && rosterIds.has(x.roster_id))
            validMatchupIds = new Set(rosterMatchups.map(detail => detail.matchup_id));
        }
        else if (weekNumber == 17) {
            var playoffMatchupDetails = Object.values(playoffYear).filter(entry => typeof entry === 'object' && entry.r === 3 && entry.p != 3 && entry.p != 5);
            var rosterIds = new Set(playoffMatchupDetails.flatMap(detail => [detail.t1, detail.t2])); //filter on rosterids to find matchupids
            var rosterMatchups = Object.values(matchupWeek).filter(x => typeof x === 'object' && rosterIds.has(x.roster_id))
            validMatchupIds = new Set(rosterMatchups.map(detail => detail.matchup_id));
        }

        for (const key in matchupWeek) {
            if (!validMatchupIds.has(matchupWeek[key].matchup_id)) {
                delete matchupWeek[key];
            }
        }
    }

    const totalMatchups = Object.keys(matchupWeek).length / 2; //Every matchup should have two rosters
    try {
        var weekMatchups = document.createElement("div");
        weekMatchups.classList.add("custom-team-table-container");
        for (let i = 1; i <= totalMatchups; i++) {
            let matchupId = i;

            if (weekNumber >= 15) {
                matchupId = Array.from(validMatchupIds)[i - 1];
            }

            var matchupDiv = document.createElement("div");
            matchupDiv.setAttribute("data-matchup-id", matchupId);
            matchupDiv.setAttribute("data-year", year);
            matchupDiv.setAttribute("data-week", week);
            matchupDiv.setAttribute("class", "custom-matchup-container");
            var counter = 0;
            var teamScore = 0;


            if (weekNumber >= 15) {
                for (const key in matchupWeek) {
                    var matchup = matchupWeek[key]
                    if (matchup.matchup_id == matchupId) {
                        counter++;
                        let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                        let user = userData.find(x => x.user_id === roster.owner_id);
                        var teamTable = createTeamTable(matchup.starters.length);//create table and insert players in each row
                        var starters = matchup.starters;
                        var teamContainer = document.createElement("div");
                        var winningTeam = getMatchupWeekWinner(matchupWeek, matchup.matchup_id)[0];

                        teamTable.setAttribute("class", "row custom-team-table custom-team-table-" + counter);
                        teamScore = matchup.points;
                        teamContainer.setAttribute("class", "container text-center custom-team-container-"+counter);


                        for (let k = 0; k < starters.length; k++) {
                            let player = playerData.players.find(x => x.player_id == starters[k]);
                            if (player) {
                                let cell = teamTable.children[k];
                                const positionDiv = document.createElement("div");
                                const playerDiv = document.createElement("div");
                                const pointsDiv = document.createElement("div");

                                cell.classList.add("custom-player-" + player.position);
                                positionDiv.innerText = player.position;
                                positionDiv.classList.add("custom-player-position")
                                playerDiv.innerText = getFullPlayerName(player.player_id);
                                playerDiv.classList.add("custom-player-name");
                                pointsDiv.innerText = matchup.players_points[player.player_id];
                                pointsDiv.classList.add("custom-player-points");

                                if (counter > 1) {
                                    cell.appendChild(pointsDiv);
                                    cell.appendChild(playerDiv);
                                    cell.appendChild(positionDiv);
                                }
                                else {
                                    cell.appendChild(positionDiv);
                                    cell.appendChild(playerDiv);
                                    cell.appendChild(pointsDiv);
                                }

                            }

                        }

                        var teamDetailsDiv = document.createElement("div");
                        var teamNameDiv = document.createElement("div");
                        var teamNameContainer = document.createElement("div");
                        var teamScoreDiv = document.createElement("div");
                        var teamRecord = document.createElement("div");
                        var teamImageContainer = document.createElement("div");
                        var teamImage = createOwnerAvatarImage(user.user_id);
                        var scoreSpan = document.createElement("span");

                        if (winningTeam.roster_id == matchup.roster_id) {
                            teamScoreDiv.classList.add("custom-winning-score");
                            let existingEntry = winLossRecords.find(entry => entry.season === season && entry.roster_id === roster.roster_id)
                            if (existingEntry) {
                                existingEntry.wins++;
                            }
                            else {
                                winLossRecords.push({
                                    "season": season,
                                    "roster_id": roster.roster_id,
                                    "wins": 1,
                                    "losses": 0
                                })
                            }
                        }
                        else {
                            teamScoreDiv.classList.add("custom-losing-score");
                            let existingEntry = winLossRecords.find(entry => entry.season === season && entry.roster_id === roster.roster_id)
                            if (existingEntry) {
                                existingEntry.losses++;
                            }
                            else {
                                winLossRecords.push({
                                    "season": season,
                                    "roster_id": roster.roster_id,
                                    "wins": 0,
                                    "losses": 1
                                })
                            }
                        }

                        var record = winLossRecords.find(entry => entry.season === season && entry.roster_id === roster.roster_id);
                        teamNameContainer.setAttribute("class","custom-team-name-container");
                        teamNameDiv.innerText = getTeamName(user.user_id);
                        teamNameDiv.classList.add("custom-team-name-" + counter, "custom-team-name");
                        scoreSpan.innerText = matchup.points;
                        scoreSpan.setAttribute("class", "custom-score-span");
                        teamScoreDiv.classList.add("custom-team-score", "custom-team-score-" + counter);
                        teamDetailsDiv.classList.add("custom-team-details");
                        teamImage.classList.add("custom-medium-avatar-" + counter);
                        teamRecord.setAttribute("class", "custom-team-record");
                        teamRecord.innerText = record.wins + "-" + record.losses;
                        teamImageContainer.setAttribute("class", "custom-team-image-container");

                        teamScoreDiv.appendChild(scoreSpan);
                        teamNameContainer.appendChild(teamNameDiv);
                        teamImageContainer.appendChild(teamImage);
                        teamImageContainer.appendChild(teamRecord);
                        teamDetailsDiv.appendChild(teamImageContainer);
                        teamDetailsDiv.appendChild(teamNameContainer);
                        teamDetailsDiv.appendChild(teamScoreDiv);;
                        teamContainer.appendChild(teamDetailsDiv);
                        teamContainer.appendChild(teamTable);
                        matchupDiv.appendChild(teamContainer);
                    }
                }
            }
            else {
                for (let j = 0; j < Object.keys(matchupWeek).length; j++) {
                    let matchup = matchupWeek[j];

                    if (matchup.matchup_id == matchupId) {
                        counter++;
                        let roster = rosterData.find(x => x.roster_id === matchup.roster_id);
                        let user = userData.find(x => x.user_id === roster.owner_id);
                        var teamTable = createTeamTable(matchup.starters.length);//create table and insert players in each row
                        var starters = matchup.starters;
                        var teamContainer = document.createElement("div");
                        let winningTeam = getMatchupWeekWinner(matchupWeek, matchup.matchup_id)[0];

                        teamTable.setAttribute("class", "row custom-team-table custom-team-table-" + counter);
                        teamScore = matchup.points;
                        teamContainer.setAttribute("class", "container text-center custom-team-container-"+counter);

                        for (let k = 0; k < starters.length; k++) {
                            let player = playerData.players.find(x => x.player_id == starters[k]);
                            if (player) {
                                let cell = teamTable.children[k];
                                const positionDiv = document.createElement("div");
                                const playerDiv = document.createElement("div");
                                const pointsDiv = document.createElement("div");

                                cell.classList.add("custom-player-" + player.position);
                                positionDiv.innerText = player.position;
                                positionDiv.classList.add("custom-player-position")
                                playerDiv.innerText = getFullPlayerName(player.player_id);
                                playerDiv.classList.add("custom-player-name");
                                pointsDiv.innerText = matchup.players_points[player.player_id];
                                pointsDiv.classList.add("custom-player-points");

                                if (counter > 1) {
                                    cell.appendChild(pointsDiv);
                                    cell.appendChild(playerDiv);
                                    cell.appendChild(positionDiv);
                                }
                                else {
                                    cell.appendChild(positionDiv);
                                    cell.appendChild(playerDiv);
                                    cell.appendChild(pointsDiv);
                                }
                            }

                        }

                        var teamDetailsDiv = document.createElement("div");
                        var teamNameDiv = document.createElement("div");
                        var teamNameContainer = document.createElement("div");
                        var teamScoreDiv = document.createElement("div");
                        var teamRecord = document.createElement("div");
                        var teamImageContainer = document.createElement("div");
                        var teamImage = createOwnerAvatarImage(user.user_id);
                        var scoreSpan = document.createElement("span");

                        if (winningTeam.roster_id == matchup.roster_id) {
                            teamScoreDiv.classList.add("custom-winning-score");

                            let existingEntry = winLossRecords.find(entry => entry.season === season && entry.roster_id === roster.roster_id)
                            if (existingEntry) {
                                existingEntry.wins++;
                            }
                            else {
                                winLossRecords.push({
                                    "season": season,
                                    "roster_id": roster.roster_id,
                                    "wins": 1,
                                    "losses": 0
                                })
                            }
                        }
                        else {
                            teamScoreDiv.classList.add("custom-losing-score");

                            let existingEntry = winLossRecords.find(entry => entry.season === season && entry.roster_id === roster.roster_id)
                            if (existingEntry) {
                                existingEntry.losses++;
                            }
                            else {
                                winLossRecords.push({
                                    "season": season,
                                    "roster_id": roster.roster_id,
                                    "wins": 0,
                                    "losses": 1
                                })
                            }
                        }

                        var record = winLossRecords.find(entry => entry.season === season && entry.roster_id === roster.roster_id);
                        teamNameContainer.setAttribute("class","custom-team-name-container");
                        teamNameDiv.innerText = getTeamName(user.user_id);
                        teamNameDiv.classList.add("custom-team-name-" + counter, "custom-team-name");
                        scoreSpan.innerText = matchup.points;
                        scoreSpan.setAttribute("class", "custom-score-span");
                        teamScoreDiv.classList.add("custom-team-score", "custom-team-score-" + counter);
                        teamDetailsDiv.classList.add("custom-team-details");
                        teamImage.classList.add("custom-medium-avatar-" + counter);
                        teamRecord.setAttribute("class", "custom-team-record");
                        teamRecord.innerText = record.wins + "-" + record.losses;
                        teamImageContainer.setAttribute("class", "custom-team-image-container");

                        teamScoreDiv.appendChild(scoreSpan);
                        teamNameContainer.appendChild(teamNameDiv);
                        teamImageContainer.appendChild(teamImage);
                        teamImageContainer.appendChild(teamRecord);
                        teamDetailsDiv.appendChild(teamImageContainer);
                        teamDetailsDiv.appendChild(teamNameContainer);
                        teamDetailsDiv.appendChild(teamScoreDiv);;
                        teamContainer.appendChild(teamDetailsDiv);
                        teamContainer.appendChild(teamTable);
                        matchupDiv.appendChild(teamContainer);
                    }
                }
            }
            var anchor = document.createElement("a");
            anchor.setAttribute("id", "#matchup_" + matchupId + "_season_" + season + "_" + weekNumber);
            weekMatchups.appendChild(anchor);
            weekMatchups.appendChild(matchupDiv);
        }
        return weekMatchups;
    }
    catch (error) {
       console.error(`Error: ${error.message}`);
    }
}

function createTeamTable(maxPlayers) {
    var table = document.createElement("div");

    for (let i = 0; i < maxPlayers; i++) {
        var col = document.createElement("col");
        col.setAttribute("class", "col");
        table.appendChild(col);
    }
    return table;
}

function createAccordionItem(num, dataParent) {
    var headerId = "itemHeader_" + num;

    var accordionItem = document.createElement("div");
    accordionItem.setAttribute("class", "accordion-item");

    var accordionHeader = document.createElement("h2");
    accordionHeader.setAttribute("class", "accordion-header");
    accordionHeader.setAttribute("id", headerId);

    var button = createMatchupButtonElement(num);
    accordionHeader.appendChild(button);

    var accordionCollapsible = document.createElement("div"); 
    accordionCollapsible.setAttribute("class", "accordion-collapse collapse");
    accordionCollapsible.setAttribute("aria-labelledby", headerId);
    accordionCollapsible.setAttribute("data-bs-parent", dataParent);
    accordionCollapsible.setAttribute("id", "collapse_" + num);

    var accordionBody = document.createElement("div");
    accordionBody.setAttribute("class", "accordion-body custom-matchup-list");

    if (num < 2000) {
        accordionCollapsible.appendChild(accordionBody);
    }
    else {
        var accordionContainer = document.createElement("div"); //create container for weeks of this season
        accordionContainer.setAttribute("class", "accordion accordion-container")
        accordionContainer.setAttribute("id", "week_" + num);

        accordionCollapsible.appendChild(accordionContainer);
        accordionCollapsible.appendChild(accordionBody);
    }

    //add header and collapsible with sub items to whole accordion
    accordionItem.appendChild(accordionHeader);
    accordionItem.appendChild(accordionCollapsible);

    return accordionItem;
}

function createMatchupButtonElement(num) {
    var button = document.createElement("button");
    button.setAttribute("class", "accordion-button custom-matchup-week collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", "#collapse_" + num);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", "collapse_" + num);
    button.setAttribute("id", "buttonWeek_" + num)

    if (num > 2000) {
        button.innerText = num + " Season" ;
        button.style = "font-size: 1em;"
    }
    else if(num == 15){
        button.innerText = "Playoffs Round 1"
    }
    else if(num == 16){
        button.innerText = "Semifinals"
    }
    else if(num == 17){
        button.innerText = "Championship"
    }
    else {
        button.innerText = "Week #" + num;
    }


    return button;
}   