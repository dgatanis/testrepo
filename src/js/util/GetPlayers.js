import { leagueID } from './leagueInfo.js';


setPlayerData();

function setPlayerData () {

    if(!localStorage.getItem("PlayerData"))
    {
        getPlayers(leagueID);
    }
}


async function getPlayers(leagueID) {
    let playersInfo = {};

    const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
    const data = await res.json();
    const players = Object.keys(data);
    let counter = 0;

    for(let player of players)
    {
        counter++;
        if(counter < 11)
        {
            //console.log(data[player]);
        }
        
        //localStorage.setItem("PlayerData", JSON.stringify(testing))
    }


    /*
    var testingMap = { 
        player : []
        
    };
    let counter = 0;
        const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
        const data = await res.json();
        const players = Object.keys(data);

        for(let i=0; i<10; i++)
        {
            let test = {};
            counter++;
            if(counter < 11)
            {
                console.log(data[i]);
                test["player_id"] = i;
                test["position"] = "test";
            }
        testingMap.player.push(test);
        }
    testingMap;
    */
    
}