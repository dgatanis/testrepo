import { players } from '../initData.js';

var playerData = players;

export function getFullPlayerName(playerid) {

    let player = playerData.players.find(x => x.player_id === parseInt(playerid));

    let playerName = playerid;

    if(player != undefined && player.firstname && player.lastname)
    {
        playerName = player.firstname + " " + player.lastname;
    }

    return playerName;
    
}

export function createPlayerImage(playerId) {

    let player = playerData.players.find(e => e.player_id === parseInt(playerId));

    if(player)
    {
        var playerimg = document.createElement("div");
        playerimg.setAttribute("style", "background-image:url(https://sleepercdn.com/content/nfl/players/thumb/"+player.player_id+".jpg), url(https://sleepercdn.com/images/v2/icons/player_default.webp); border: 2px solid var(--"+ player.position +");");
        
        if(playerId == '5849')
        {
            playerimg.setAttribute('class', "custom-tiny-player-avatar");
        }
        else
        {
            playerimg.setAttribute('class', "custom-player-avatar");
        }
        
        return playerimg;
    }
}

export function sortByPosition(players) {

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


export function createNFLTeamImage(team) {
    var teamAbrv = team.toLowerCase();
    var teamImage = document.createElement("img");
    teamImage.setAttribute("src",  `https://sleepercdn.com/images/team_logos/nfl/${teamAbrv}.png`);
    teamImage.setAttribute('class', "custom-team-logo");
    teamImage.setAttribute('title', team);

    return teamImage;
}