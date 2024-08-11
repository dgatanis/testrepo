import { getTransactionsData, setLinkSource, createOwnerAvatarImage, getTeamName, allTimeLeagueIds, setLeagueName, createPlayerImage, getFullPlayerName, createNFLTeamImage, players, rosters } from '../util/helper.js';

const rosterData = rosters;
const playerData = players;

loadContents();

function loadContents() {
    setLeagueName("footerName");
    setLinkSource("keep-trade-cut");
    loadTradeTransactions();
}

async function loadTradeTransactions() {

    var allTradeTransactions = await getTradeTransactions();
    var body = document.getElementsByClassName('custom-body')[0];
    var page = 0;

    for(let trades of allTradeTransactions)
    {
        if(trades.data.length >= 1)
        {
            for(let [index, trade] of trades.data.entries())
            {
                //Used for pagination
                if(index % 10 == 0)
                {
                    page += 1
                }
                
                var tradePartners = Object.keys(trade.roster_ids).length;
                var transactionRow = createTransactionRow(page);
                var totalPlayers = 0;
                var totalSearchRank = 0;
                var draftPicksCount = {"1": 0, "2": 0}

                for (let i = 0; i < tradePartners; i++) {
                    var rosterid = trade.roster_ids[i];
                    let roster = rosterData.find(x => x.roster_id === parseInt(rosterid));

                    //More than 2 trade partners
                    if (i >= 2) {
                        var lastTeamGroup = transactionRow.getElementsByClassName('custom-team-group')[transactionRow.getElementsByClassName('custom-team-group').length - 1];
                        var teamGroup = document.createElement("div");
                        teamGroup.setAttribute('class', 'custom-team-group');

                        lastTeamGroup.after(teamGroup);
                    }
                    else {
                        var teamGroup = transactionRow.getElementsByClassName('custom-team-group')[i];
                    }

                    //Create team containers for name/image
                    var teamContainer = document.createElement('div');
                    teamContainer.setAttribute('class', 'custom-team-container');

                    var teamImg = createOwnerAvatarImage(roster.owner_id);
                    teamImg.classList.add('custom-small-avatar');
                    teamImg.classList.remove('custom-medium-avatar');
                    teamImg.setAttribute('onclick', 'openRostersPage(' + rosterid + ')');

                    var teamName = document.createElement("div");
                    teamName.innerText = getTeamName(roster.owner_id);
                    teamName.setAttribute('class', 'custom-teamname-small');
                    teamName.setAttribute('onclick', 'openRostersPage(' + rosterid + ')');

                    teamContainer.appendChild(teamImg);
                    teamContainer.appendChild(teamName);

                    teamGroup.prepend(teamContainer);

                    //Check the trade for all its components
                    if (trade.adds) {
                        let addedPlayers = Object.keys(trade.adds);
                        var addedPlayersArray = [];
                        for (let j = 0; j < addedPlayers.length; j++) {
                            if (rosterid == trade.adds[addedPlayers[j]]) {
                                var player = playerData.players.find(x => x.player_id === addedPlayers[j]);
                                var playerDiv = createPlayerDiv(player.player_id, 'add');
                                var nflTeamImg = createNFLTeamImage(player.team);

                                playerDiv.append(nflTeamImg);
                                teamGroup.appendChild(playerDiv);

                                totalPlayers++;
                                totalSearchRank += player.search_rank;
                            }
                        }

                    }
                    if (trade.draft_picks) {

                        for (let draftPick of trade.draft_picks) {

                            if (rosterid == draftPick.owner_id) { //owner_id = rosterId that owns the pick now

                                var formattedRound;
                                var originalOwner = rosterData.find(x => x.roster_id === draftPick.roster_id);
                                var draftPickDiv = document.createElement('div');
                                var round = document.createElement('div');
                                var season = document.createElement('div');
                                round.setAttribute('class', 'custom-draft-pick-round');
                                season.setAttribute('class', 'custom-draft-pick-season');
                                draftPickDiv.setAttribute('class', 'custom-draft-pick');

                                if (draftPick.round == 1) {
                                    draftPicksCount["1"]++;
                                    formattedRound = draftPick.round + "st Round";
                                }
                                else if (draftPick.round == 2) {
                                    draftPicksCount["2"]++;
                                    formattedRound = draftPick.round + "nd Round";
                                }
                                else if (draftPick.round == 3) {
                                    formattedRound = draftPick.round + "rd Round";
                                }
                                else {
                                    formattedRound = draftPick.round + "th Round";
                                }

                                draftPickDiv.setAttribute('title', formattedRound + ' pick via ' + getTeamName(originalOwner.owner_id));

                                round.innerText = formattedRound;
                                season.innerText = " - " + draftPick.season;

                                draftPickDiv.appendChild(round);
                                draftPickDiv.appendChild(season);
                                //previous_owner_id = player that traded pick away
                                if (draftPick.roster_id != draftPick.previous_owner_id || tradePartners > 2) { //roster_id = original owner of pick 
                                    var originalOwnerDiv = document.createElement('div');
                                    originalOwnerDiv.setAttribute('class', 'custom-draft-pick-original-owner');
                                    originalOwnerDiv.innerText = "(via " + getTeamName(originalOwner.owner_id) + ")";
                                    draftPickDiv.appendChild(originalOwnerDiv);
                                }

                                teamGroup.appendChild(draftPickDiv);
                            }
                        }
                    }
                    if (trade.waiver_budget.length >= 1) {
                        for (let faab of trade.waiver_budget) {
                            if (faab.receiver == rosterid) {
                                var waiverBudgDiv = document.createElement('div');
                                waiverBudgDiv.setAttribute('class', 'custom-waiver-budget');
                                waiverBudgDiv.innerText = "$" + faab.amount + " - FAAB";
                                
                                teamGroup.appendChild(waiverBudgDiv);
                            }
                        }

                    }
                }
                var transactionDate = new Date(trade.created);
                var dateString = transactionDate.toLocaleString().replaceAll(",", "");
                var dateOfTransaction = transactionRow.getElementsByClassName('custom-date')[0];

                if (dateString.endsWith("AM")) {
                    var formattedDate = dateString.toString().substring(0, dateString.lastIndexOf(":"));
                    formattedDate += " AM";
                }
                else if (dateString.endsWith("PM")) {
                    var formattedDate = dateString.toString().substring(0, dateString.lastIndexOf(":"));
                    formattedDate += " PM";
                }
                dateOfTransaction.innerText = formattedDate;

                //Create handshake icon
                var lastTeamGroup = transactionRow.getElementsByClassName('custom-team-group')[transactionRow.getElementsByClassName('custom-team-group').length - 1];
                var handshakeImage = document.createElement('img');
                handshakeImage.setAttribute('src', '../src/static/images/trading-icon.png');
                handshakeImage.setAttribute('class', 'custom-handshake-icon');

                lastTeamGroup.after(handshakeImage);

                //Create trade badge icon
                if(totalPlayers >=1 && totalSearchRank/totalPlayers <= 25 || tradePartners >=3 || draftPicksCount["1"] >= 2 || draftPicksCount["2"] >= 4 || totalPlayers >= 4)
                {
                    var tradeBadge = document.createElement('img');
                    tradeBadge.setAttribute('class', 'custom-trade-badge');
                    tradeBadge.setAttribute('src', '../src/static/images/alert.png');
                    tradeBadge.setAttribute('title', 'Big Trade Alert!');

                    lastTeamGroup.after(tradeBadge);
                }
                else if (totalPlayers >= 1 && totalSearchRank / totalPlayers <= 60 || draftPicksCount["2"] >= 3 || draftPicksCount["1"] >= 1)
                {
                    var tradeBadge = document.createElement('img');
                    tradeBadge.setAttribute('class', 'custom-trade-badge');
                    tradeBadge.setAttribute('src', '../src/static/images/wow-icon.png');
                    tradeBadge.setAttribute('style', 'width:2.5rem;');
                    tradeBadge.setAttribute('title', 'Wow!');

                    lastTeamGroup.after(tradeBadge);
                }
                else if(totalPlayers == 1 && draftPicksCount["2"] == 0 && draftPicksCount["1"] == 0)
                {
                    var tradeBadge = document.createElement('img');
                    tradeBadge.setAttribute('class', 'custom-trade-badge');
                    tradeBadge.setAttribute('src', '../src/static/images/puke-emoji.png');
                    tradeBadge.setAttribute('title', 'Gross!');

                    lastTeamGroup.after(tradeBadge);
                }

                //append trade to the body
                body.appendChild(transactionRow);
            }
        }
    }
    addPagesToTrades();
    var loadingSpinner =  document.getElementById("page-loading");
    loadingSpinner.classList.add('custom-none-display');
}

async function getTradeTransactions() {

    var allTradeTransactions = [];
    
    for(let league of allTimeLeagueIds.ATLeagueId)
    {
        for(let i = 0; i <= 18; i++)
        {
            var transactions = await getTransactionsData(league.league_id, i, "trade");

            allTradeTransactions.push ({
                "season": league.year,
                "league_id": league.league_id,
                "week": i,
                "data": transactions
            });
        }
    }

    return allTradeTransactions;
}

function addPagesToTrades() {
    var allTrades = document.querySelectorAll('[class*=custom-transaction-row]');
    var page;

    for(let i = 0; i <= allTrades.length-1; i++)
    {
        
        if(i % 10 == 0)
        {
           
            page = (i / 10) + 1;
            allTrades[i].classList.add('custom-trades-page-'+ page);
        }
        else
        {
            if(i >= 10)
            {
                page = Math.floor(i/10) + 1;
                allTrades[i].classList.add('custom-trades-page-'+ page)
            }
            else
            {
                page = 1;
                allTrades[i].classList.add('custom-trades-page-'+ page);
            }
        }
    }

    createPaginationList(page);
}

function createPaginationList(maxPages) {
    var paginationList = document.getElementById('trades-pagination');

    for(let i = parseInt(maxPages); i>0; i--)
    {
        var pageItem = document.createElement('li');
        pageItem.setAttribute("class", "page-item");
    
        var pageLink = document.createElement('a');
        if(i > 5)
        {
            pageLink.setAttribute('class','page-link page-number custom-none-display');
        }
        else
        {
            pageLink.setAttribute('class','page-link page-number');
        }
        
        pageLink.setAttribute('href', "#");
        pageLink.setAttribute('onclick', "showPage('"+ i +"')");
        pageLink.innerText = i;

        pageItem.appendChild(pageLink);

        paginationList.children[1].after(pageItem);
    }


    paginationList.classList.remove('custom-none-display');
}

function createTransactionRow(page) {
    var transactionRow = document.createElement('div');

    if(page > 1)
    {
        transactionRow.setAttribute('class', 'custom-transaction-row custom-none-display');

    }
    else {
        transactionRow.setAttribute('class', 'custom-transaction-row');
    }

    var card = document.createElement('div');
    card.setAttribute('class', 'card custom-card custom-div-shadow');

    var cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body');

    var teamGroup = document.createElement('div');
    teamGroup.setAttribute('class', 'custom-team-group');

    var teamGroup2 = document.createElement('div');
    teamGroup2.setAttribute('class', 'custom-team-group');

    var transactionDate = document.createElement('div');
    transactionDate.setAttribute('class', 'custom-transaction-date');

    var date = document.createElement('div');
    date.setAttribute('class', 'custom-date');

    transactionDate.appendChild(date);
    cardBody.appendChild(transactionDate);
    cardBody.appendChild(teamGroup);
    cardBody.appendChild(teamGroup2);
    card.appendChild(cardBody);
    transactionRow.appendChild(card);

    return transactionRow;

}

function createPlayerDiv(playerid, addDrop) {
    var player = playerData.players.find(x => x.player_id === playerid);
    var playerDiv = document.createElement("div");
    playerDiv.setAttribute('class', 'custom-player');

    if(player.position != "DEF")
    {
        playerDiv.setAttribute('onclick', 'openRotoWirePage('+ player.rotowire_id + ",\'" + player.firstname + "\',\'" + player.lastname + "\')");

    }
    else {
        playerDiv.setAttribute('onclick', 'openRotoWirePageDef(\'' + player.firstname.replaceAll("'","").replaceAll(' ', "-") + "\',\'" + player.lastname.replaceAll("'","") +"\', \'"+ player.team +"\')");
    }
    playerDiv.setAttribute('title', player.firstname + " " + player.lastname + " Stats and News");

    var playerImg = createPlayerImage(playerid);
    var playerName = document.createElement("div");
    var playerPosition = document.createElement("div");
    var addDropIcon = createAddDropImg(addDrop);

    playerName.setAttribute('class', 'custom-playername-large');

    if (player) 
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