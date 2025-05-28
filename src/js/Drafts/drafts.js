import { 
    rosters,
    players, 
    users,
    createOwnerAvatarImage, 
    getTeamName,
    playoffs,
    leagueDisplayName,
    leagueDescription,
    setLeagueName,
    setLinkSource,
    getLeagueDrafts,
    allTimeLeagueIds,
    getDraftPicks,
    removeSpinner,
    getDraftOrder,
    createPlayerImage,
    getPlayerNickNames
    } from '../util/helper.js';

let leagueIds = allTimeLeagueIds.ATLeagueId;
let playerData = players;
let userData = users;
let rosterData = rosters;

loadContents();

async function loadContents() {
    setLeagueName("footerName");
    setLinkSource("keep-trade-cut");
    loadDraftData();
    removeSpinner();
}

async function loadDraftData() {
    //loop through each ATLeagueId and get the draftid per leagueid
    //get draft picks per draftid
    const body = document.getElementsByClassName("custom-body")[0];
    var leagueId = "";

    for(let league of leagueIds) {
        var draft_id = await getLeagueDrafts(league.league_id);
        var draft_data = await getDraftPicks(draft_id);
        var draft_order = await getDraftOrder(draft_id);
        var draft_season = document.createElement("div");
        var draftGrid;

        draft_season.innerText = league.year + " Season";
        draft_season.setAttribute("class", "custom-season-header");

        if(draft_data.length >= 1) {

            if(leagueId != league.leagueId) {//If new season create new grid
                leagueId = league.league_id;
                draftGrid = createDraftGrid(draft_order[0].draft_order, draft_order[0].rounds, league.year);
            }
            for(let draft_pick of draft_data) {
                var pick_slot = draftGrid.getElementsByClassName("row")[draft_pick.round].getElementsByClassName("col")[draft_pick.draft_slot - 1];
                var grid_item = createDraftPickGridItem(draft_pick.metadata.player_id, draft_pick.picked_by, pick_slot.getAttribute("data-original-pick-owner"));
                var selection_num = document.createElement("div");
                selection_num.setAttribute("class", "custom-selection-number");
                selection_num.innerText = draft_pick.round + ".0" + draft_pick.draft_slot;

                if(draft_pick.draft_slot >= 10){
                    selection_num.innerText = draft_pick.round + "." + draft_pick.draft_slot;
                }
                grid_item.appendChild(selection_num);
                pick_slot.appendChild(grid_item);
                pick_slot.classList.add("custom-" + draft_pick.metadata.position + "-position");
            }

            body.appendChild(draftGrid);
            draftGrid.prepend(draft_season);
        }
    }
    
}

function createDraftGrid(draft_order, rounds, year) {
    var scrollContainer = document.createElement("div");
    var container = document.createElement("div");
    container.setAttribute("class", "container text-center");
    container.setAttribute("data-grid-year", year);
    scrollContainer.setAttribute("class", "custom-grid-container");

    for (let i = 0; i <= rounds; i++) {//loop through rounds
        var row = document.createElement("div");
        const sorted_draft_order = Object.fromEntries(
            Object.entries(draft_order).sort(([, a], [, b]) => a - b)
        );

        row.setAttribute("class", "row");
        row.setAttribute("data-round", i);

        Object.entries(sorted_draft_order).forEach(([key, value], index) => { //loop through user/draft order mapping
            var column = document.createElement("col");
            column.setAttribute("class", "col");
            column.setAttribute("data-pick", index + 1);
            column.setAttribute("data-original-pick-owner", key);

            if (i == 0) {
                var user = userData.find(e => e.user_id === key);
                var team_div = document.createElement("div");
                var pick_container = document.createElement("div");
                var team_image = createOwnerAvatarImage(user.user_id);

                team_div.innerText = getTeamName(user.user_id);
                team_div.setAttribute("class", "custom-team-name");
                team_image.setAttribute("onclick", "getTeamPicks('"+user.user_id+"', '" + year + "')");
                pick_container.setAttribute("class", "custom-pick-container");

                pick_container.appendChild(team_image);
                pick_container.appendChild(team_div);
                column.appendChild(pick_container);
            }

            row.appendChild(column);
        });
        container.appendChild(row);
    }
    scrollContainer.appendChild(container);
    return scrollContainer;
}

function createDraftPickGridItem(player_id, picked_by, original_owner) {
    var roster = rosterData.find(e => e.owner_id === picked_by);
    var pick_container = document.createElement("div");
    var player = playerData.players.find(e => e.player_id === player_id);
    var player_div = document.createElement("div");
    var player_image = createPlayerImage(player.player_id);
    var nickname_div = document.createElement("div");
    var user_div = document.createElement("div");

    nickname_div.innerText = getPlayerNickNames(roster.roster_id, player_id); 
    nickname_div.setAttribute("class", "custom-player-nickname");
    player_div.setAttribute("class", "custom-player-name");
    player_div.innerText = player.firstname + " " + player.lastname;
    pick_container.setAttribute("class", "custom-pick-container");
    pick_container.setAttribute("data-picked-by-user",picked_by);
    user_div.setAttribute("class", "custom-user");

    if(picked_by.toString() != original_owner.toString()) {
        var user = userData.find(e => e.user_id === picked_by);
        user_div.style = "background:black";
        user_div.innerText = getTeamName(user.user_id);
    }          
    
    pick_container.appendChild(player_div);
    pick_container.appendChild(nickname_div);
    pick_container.appendChild(player_image);
    pick_container.appendChild(user_div);

    return pick_container;
}