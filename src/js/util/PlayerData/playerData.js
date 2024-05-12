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