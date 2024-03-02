import getCurrentLeagueId from './leagueInfo.js';
import getCurrentWeek from './leagueInfo.js';

const currentLeague = getCurrentLeagueId();
const currentWeek = getCurrentWeek();

try{
    currentLeague.then((currentLeagueId) => {
        setBrowserData(currentLeagueId);
    }).catch((error) => {
        console.error(`Error: ${error.message}`);
    });

}
catch (error) {
    tries++;
    console.error(`Error: ${error.message}`);
}

function setBrowserData(leagueID) {
    try{
        const expiration = new Date().getTime() + (6*60*60*1000); //6hrs
        const now = new Date().getTime();
        
        if(!localStorage.getItem("expiration") || localStorage.getItem("expiration") < now)
        {
            console.log("setBrowserData: " + leagueID);
            localStorage.clear();
            localStorage.setItem("expiration", expiration);
            setPlayerData();
            setRosterData(leagueID);
            setUserData(leagueID);
            setLeagueData(leagueID);
        }
        if(!sessionStorage.getItem("MatchupData"))
        {
            //TESTING
            //setMatchupData(leagueID,currentWeek);
            setMatchupData('1003692635549462528','10');
        }
        
    }
    catch(error){
        console.error(`Error: ${error.message}`);
    }

}


function setPlayerData () {
    if(!localStorage.getItem("PlayerData") || localStorage.getItem("PlayerData") === null || localStorage.getItem("PlayerData") === undefined)
    {
        console.log("setPlayerData");
        getPlayers();
    }
}

function setRosterData (leagueID) {
    if(!localStorage.getItem("RosterData") || localStorage.getItem("RosterData") === null || localStorage.getItem("RosterData") === undefined)
    {
        console.log("setRosterData");
        getRostersForLeague(leagueID);
    }
}

function setUserData (leagueID) {
    if(!localStorage.getItem("UserData") || localStorage.getItem("UserData") === null || localStorage.getItem("UserData") === undefined)
    {
        console.log("setUserData");
        getUserData(leagueID);
    }
}

function setLeagueData (leagueID) {
    if(!localStorage.getItem("LeagueData") || localStorage.getItem("LeagueData") === null || localStorage.getItem("LeagueData") === undefined)
    {
        console.log("setLeagueData");
        getLeagueDetails(leagueID);
    }
}

function setMatchupData(leagueID,currentWeek){
    if(!sessionStorage.getItem("MatchupData") || localStorage.getItem("MatchupData") === null || localStorage.getItem("MatchupData") === undefined)
    {
        console.log("setMatchupData");
        getMatchupData(leagueID, currentWeek);
    }
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

async function getMatchupData(leagueID, currentWeek) {

    let totalWeeksPlayed = parseInt(currentWeek);
    //leagueID = '1003692635549462528'; //TESTING LEAGUE
    let matchupWeeks = [];
    let upToCurrentWeekMatchups = [];

    for(let i = 1; i<=totalWeeksPlayed; i++)
    {
        let matchupsArray = [];
        const matchup = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/matchups/${i}`);
        const matchupData = await matchup.json(); 

        if(matchupData)
        {
            for(let matchups of matchupData)
            {
                matchupsArray.push({
                    ...matchups
                });
            }
            matchupWeeks.push({
                ...matchupsArray
            });

        }
        
    }

    upToCurrentWeekMatchups.push({
        matchupWeeks
    });

    sessionStorage.setItem("MatchupData", JSON.stringify(upToCurrentWeekMatchups));

}