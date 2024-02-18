import getCurrentLeagueId from './leagueInfo.js';

const currentLeague = getCurrentLeagueId();
let tries = 0;

while(tries <= 2)
{
    try{
        currentLeague.then((currentLeagueId) => {
            setBrowserData(currentLeagueId);
        }).catch((error) => {
            tries++;
        });
        tries=9;
        
    }
    catch (error) {
        tries++;
        console.error(`Error: ${error.message}`);
    }
}

function setBrowserData(leagueID) {
    try{
        const expiration = new Date().getTime() + (6*60*60*1000); //6hrs
        const now = new Date().getTime();
        
        if(!localStorage.getItem("expiration") || localStorage.getItem("expiration") < now)
        {
            localStorage.clear();
            localStorage.setItem("expiration", expiration);
            setPlayerData();
            setRosterData(leagueID);
            setUserData(leagueID);
            setLeagueData(leagueID);
        }
        setPlayerData();
        setRosterData(leagueID);
        setUserData(leagueID);
        setLeagueData(leagueID);
    }
    catch(error){
        console.error(`Error: ${error.message}`);
    }

}


function setPlayerData () {
    if(!localStorage.getItem("PlayerData"))
    {
        getPlayers();
    }
    console.log(!localStorage.getItem("PlayerData") || localStorage.getItem("PlayerData") == null || localStorage.getItem("PlayerData") == undefined);
}

function setRosterData (leagueID) {
    if(!localStorage.getItem("RosterData"))
    {
        getRostersForLeague(leagueID);
    }
    console.log(!localStorage.getItem("RosterData"));
}

function setUserData (leagueID) {
    if(!localStorage.getItem("UserData"))
    {
        getUserData(leagueID);
    }
    console.log(!localStorage.getItem("UserData"));
}

function setLeagueData (leagueID) {
    if(!localStorage.getItem("LeagueData"))
    {
        getLeagueDetails(leagueID);
    }
    console.log(!localStorage.getItem("LeagueData"));
}

async function getRostersForLeague(leagueID){
    try
    {
        const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
        const rosterData = await rosterResponse.json(); 
        localStorage.setItem("RosterData", JSON.stringify(rosterData));
    }
    catch (error) {
        console.log(error);
    }

}

async function getPlayers() {

    try
    {    
        var myPlayerMap = { 
            "players" : []
        };
        const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
        const data = await res.json();
        let maxId = parseInt(Object.keys(data).sort((a, b) => b - a)); //organize by Id;
        const playerPositions = ["QB", "RB", "WR", "TE", "K"];

        for(let i=0; i<maxId; i++)
        {
           if(data[i] && playerPositions.includes(data[i].position))
           {
                let playerTeam = data[i].team;

                if(playerTeam === null)
                {
                    playerTeam = "FA";
                }
                myPlayerMap.players.push({
                    "player_id": parseInt(data[i].player_id),
                    "position": data[i].position,
                    "firstname": data[i].first_name,
                    "lastname": data[i].last_name,
                    "age": data[i].age,
                    "team": playerTeam
                });  
           }
        }

        localStorage.setItem("PlayerData", JSON.stringify(myPlayerMap));
    }
    catch (error) {
        console.log(error);
    }
}


async function getUserData(leagueID){
    try {
        const res = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`); 
        const data = await res.json(); 
        localStorage.setItem("UserData", JSON.stringify(data));
    }
    catch (error) {
        console.log(error);
    }
}

async function getLeagueDetails(leagueID) {
    try {
        const leagueData = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`);
        const league = await leagueData.json(); 

        localStorage.setItem("LeagueData", JSON.stringify(league));
    }
    catch (error) {
        console.log(error);
    }
}