import { 
    rosters,
    players, 
    users,
    createOwnerAvatarImage, 
    getTeamName,
    playoffs,
    leagueDescription,
    setLeagueName,
    setLinkSource,
    getLeagueDrafts,
    allTimeLeagueIds,
    getDraftPicks,
    removeSpinner,
    getDraftOrder,
    createPlayerImage,
    getPlayerNickNames,
    createNFLTeamImage,
    setDarkMode
    } from '../util/helper.js';

let leagueIds = allTimeLeagueIds.ATLeagueId;
let playerData = players;
let userData = users;
let rosterData = rosters;

loadContents();

async function loadContents() {
    setDarkMode();
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
        var draft_grid;

        draft_season.innerText = league.year + " Season";
        draft_season.setAttribute("class", "custom-season-header");

        if(draft_data.length >= 1) {

            if(leagueId != league.leagueId) {//If new season create new grid
                leagueId = league.league_id;
                draft_grid = createDraftGrid(draft_order[0].draft_order, draft_order[0].rounds, league.year);
            }
            for(let draft_pick of draft_data) {
                var pick_slot = draft_grid.getElementsByClassName("row")[draft_pick.round].getElementsByClassName("col")[draft_pick.draft_slot - 1];
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

            var button = document.createElement("button");
            var buttonDiv = document.createElement("div");
            var scatter_div = document.createElement("div");
            buttonDiv.setAttribute("class", "custom-button-container");
            button.setAttribute("class","btn btn-primary");
            button.setAttribute("onclick","toggleGraph(" + league.year + ")");
            button.innerText = league.year + " ADP Chart";
            scatter_div.setAttribute('id', league.year + "_scatter");
            scatter_div.setAttribute('class', "custom-scatter custom-none-display");
            
            setScatterPlots(league.year);
            buttonDiv.appendChild(button);
            draft_grid.appendChild(buttonDiv);
            draft_grid.appendChild(scatter_div);   
            body.appendChild(draft_grid);
            draft_grid.prepend(draft_season);
            
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
    var team_div = createNFLTeamImage(player.team);
    var player_position_div = document.createElement("div");
    var player_college_div = document.createElement("div");

    player_college_div.setAttribute("class", "custom-player-college");
    player_college_div.innerText = player.college;
    player_position_div.setAttribute("class", "custom-player-position");
    player_position_div.innerText = player.position;
    nickname_div.innerText = getPlayerNickNames(roster.roster_id, player_id); 
    nickname_div.setAttribute("class", "custom-player-nickname");
    nickname_div.setAttribute("title", getPlayerNickNames(roster.roster_id, player_id));
    player_div.setAttribute("class", "custom-player-name");
    player_div.innerText = player.firstname + " " + player.lastname;
    player_div.setAttribute("title", player.firstname + " " + player.lastname);
    pick_container.setAttribute("class", "custom-pick-container");
    pick_container.setAttribute("data-picked-by-user",picked_by);
    user_div.setAttribute("class", "custom-user");

    if(picked_by.toString() != original_owner.toString()) {
        var user = userData.find(e => e.user_id === picked_by);
        user_div.style = "background:var(--custom-dark-mode-background);";
        user_div.innerText = getTeamName(user.user_id);
    }          
    
    player_image.appendChild(team_div);
    pick_container.appendChild(player_div);
    pick_container.appendChild(player_college_div);
    pick_container.appendChild(nickname_div);
    pick_container.appendChild(player_image);
    pick_container.appendChild(user_div);
    pick_container.appendChild(player_position_div);

    return pick_container;
}

async function setScatterPlots (year) {

    var data = await fetchCSVData(`../src/static/rookie_rankings/${year}_rookie_rankings.csv`);

    let colorMapping = new Map([
        ['QB', '#ff2a6d'],
        ['RB', '#00ceb8'],
        ['WR', '#58a7ff'],
        ['TE', '#ffae58'],
        ['K', '#bd66ff']
    ]);


    if(data) {
        var scatterLine = {
            x: [1,10,20,30,40],
            y: [1,10,20,30,40],
            mode: 'lines',
            type: 'scatter',
            name: 'Average Draft Position',
            marker: {color: '#00c14157'}
        };

        var scatterData = [ scatterLine ];
        
        for(let row of data) {
            //row: name,team,position,age,sleeperId,selected,ranked,comments

            if(row[0] != 'name') {
                var round_selected = parseInt(row[5].split('.')[0]);
                var pick_selected = parseInt(row[5].split('.')[1]);
                var round_ranked = parseInt(row[6].split('.')[0]);
                var selected_ranked = parseInt(row[6].split('.')[1]);
                
                if(round_selected && pick_selected) {
                    var overall_pick = (round_selected - 1) * 10 + pick_selected;
                    var ranked_pick = (round_ranked - 1) * 10 + selected_ranked;
                    var pick_diff = overall_pick - ranked_pick;
                    var plot_point = overall_pick + pick_diff;
                    if(pick_diff > 0) {
                        pick_diff = "+"+pick_diff;
                    }

                    var trace = {
                        x: [overall_pick],
                        y: [plot_point],
                        mode: 'markers+text',
                        type: 'scatter',
                        name: `(${row[5]}) ${row[0]}`, //Player name and draft position
                        text: `${row[0]}`, //Player Name
                        textposition: 'right',
                        textfont: {
                            family:  'Raleway, sans-serif'
                        },
                        marker: { size: 10, color:colorMapping.get(row[2]), opacity:.75},
                        hovertemplate: `Projected: ${row[6]} <br>Value: ${pick_diff} <br>${row[7]}`,//Comments
                        showlegend: false
                    };
                    
                    scatterData.push(trace);
                }

            }

        }
        var layout = {
            showlegend: false,
            autosize: true,
            minreducedwidth: 400,
            margin: {
                pad: 0,
                r:0,
                l:35
            },
            xaxis: {
                range: [0, 45],
                automargin: false,
                autorange: true,
                title: 'Average Draft Position (ADP)',
                tickmode: 'linear',
                dtick: 10
            },
            yaxis: {
                range: [45, 0],
                automargin: false,
                autorange: true,
                title: 'Actual Draft Position',
                tickmode: 'linear',
                dtick: 10
            },
            dragmode: "pan",
            hoverlabel : {bordercolor: "black", font:{color:"black"}, namelength: -1},
            title: {text: `${year} Actual Draft Position vs. ADP`}
        };

        var config = {
            modeBarButtonsToRemove: ['zoom2d', 'pan2d', 'select2d','lasso2d' ]
        };

        Plotly.newPlot(`${year}_scatter`, scatterData, layout, config);
    }
}


async function fetchCSVData(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        if(data && response.ok) {
            const rows = data.trim().replaceAll("\r", "").split('\n').map(row => row.split(','));
            return rows;
        }

    } catch (error) {
        console.error('Error fetching CSV:', error);
    }

}

