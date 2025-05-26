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
    createPlayerImage
    } from '../util/helper.js';

let leagueIds = allTimeLeagueIds.ATLeagueId;
let playerData = players;
let userData = users;

loadContents();

async function loadContents() {
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
        var draftGrid;

        if(draft_data.length >= 1) {

            if(leagueId != league.leagueId) {//If new season create new grid
                leagueId = league.league_id;
                draftGrid = createDraftGrid(draft_order[0].draft_order, draft_order[0].rounds);
            }
            for(let draft_pick of draft_data) {
                var pick_slot = draftGrid.getElementsByClassName("row")[draft_pick.round-1].getElementsByClassName("col")[draft_pick.draft_slot-1];
                var grid_item = createDraftPickGridItem(draft_pick.round, draft_pick.draft_slot, draft_pick.metadata.player_id, draft_pick.picked_by, pick_slot.getAttribute("data-original-pick-owner"));
                pick_slot.appendChild(grid_item);
                pick_slot.classList.add("custom-" + draft_pick.metadata.position + "-position");
            }

            body.appendChild(draftGrid);
        }
    }
    
}

function createDraftGrid(draft_order, rounds) {
    var scrollContainer = document.createElement("div");
    var container = document.createElement("div");
    container.setAttribute("class", "container text-center");
    scrollContainer.setAttribute("class", "custom-grid-container");

    for(let i = 1; i<=rounds; i++){
        var row = document.createElement("div");
        row.setAttribute("class", "row");
        row.setAttribute("data-round", i);

        Object.entries(draft_order).forEach(([key, value], index) => {
            var column = document.createElement("col");
            column.setAttribute("class", "col");
            column.setAttribute("data-pick", index + 1);
            column.setAttribute("data-original-pick-owner", key);
            row.appendChild(column);
        });
        container.appendChild(row);
    }
    scrollContainer.appendChild(container);
    return scrollContainer;
}

function createDraftPickGridItem(round, pick_num, player_id, picked_by, original_owner) {
    var pick_container = document.createElement("div");
    var player = playerData.players.find(e => e.player_id === player_id);
    var player_div = document.createElement("div");
    var player_image = createPlayerImage(player.player_id);

    player_div.setAttribute("class", "custom-player-name");
    player_div.innerText = player.firstname + " " + player.lastname;
    pick_container.setAttribute("class", "custom-pick-container");
    pick_container.appendChild(player_div);
    pick_container.appendChild(player_image);

    if(picked_by.toString() != original_owner.toString()) {
        var user = userData.find(e => e.user_id === picked_by);
        var user_div = document.createElement("div");
        
        user_div.setAttribute("class", "custom-user");
        user_div.innerText = user.display_name;
        pick_container.appendChild(user_div);
        pick_container.appendChild(user_div);
    }

    return pick_container;
}