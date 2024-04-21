//Sets the browser data needed for other scripts
try{
    setBrowserData();
}
catch (error) {
    console.error(`Error: ${error.message}`);
}

async function setBrowserData() {
    try{

        const leagueInfo = await import('./leagueInfo.js');
        const leagueInfoLeagueId = leagueInfo.default();
        const currentWeek = leagueInfo.getCurrentWeek();
        const currentLeagueId = await leagueInfoLeagueId;
        const leagueId = currentLeagueId;
        const thisWeek = currentWeek;

        const expiration = new Date().getTime() + (6*60*60*1000); //6hrs
        const now = new Date().getTime();

        if(!localStorage.getItem("expiration") || localStorage.getItem("expiration") < now)
        {
            localStorage.clear();
            localStorage.setItem("expiration", expiration); 
            getPlayers();
            getRostersForLeague(leagueId);
            getUserData(leagueId);
            getLeagueDetails(leagueId);

        }
        if(!sessionStorage.getItem("MatchupData"))
        {
            //TESTING
            //setMatchupData(leagueId,currentWeek);
            getMatchupData('1003692635549462528','10');
            //console.log(leagueId + " " + thisWeek);
            //getMatchupData(leagueId,thisWeek);

        }
        
    }
    catch(error){
        console.error(`Error: ${error.message}`);
    }

}

async function getRostersForLeague(leagueID){
    try
    {
        const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`); 
        const rosterData = await rosterResponse.json(); 

        localStorage.setItem("RosterData", JSON.stringify(rosterData));
        return rosterData;
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

    try
    {
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
    catch (error)
    {
        console.error(`Error: ${error.message}`);
    }

}