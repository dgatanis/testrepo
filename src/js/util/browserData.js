//Sets the browser data needed for other scripts
import { getCurrentWeek, getCurrentSeason, inauguralSeason, leagueDisplayName, leagueUser } from './leagueInfo.js';
const leagueInfo = await import('./leagueInfo.js');

try{
    setBrowserData();
}
catch (error) {
    console.error(`Error: ${error.message}`);
}

async function setBrowserData() {
    try{

        const currentWeek = await getCurrentWeek();
        const currentLeagueId = await leagueInfo.default();

        const expiration = new Date().getTime() + (2*60*60*1000); //2hrs
        const now = new Date().getTime();

        if(!localStorage.getItem("expiration") || localStorage.getItem("expiration") < now)
        {
            localStorage.clear();
            localStorage.setItem("expiration", expiration);
            setPlayerData();
            setATLeagueIds();
            setRosterData(currentLeagueId);
            setUserData(currentLeagueId);
            //setUserData('1054609254864269312');
            setLeagueDetails(currentLeagueId);
            setPlayoffsData(currentLeagueId);
            //setPlayoffsData('998356266604916736');
            setMatchupData(currentLeagueId,currentWeek);
            //setMatchupData('1003692635549462528','10');
        }
        // if(!sessionStorage.getItem("MatchupData"))
        // {

        // }

    }
    catch(error){
        console.error(`Error: ${error.message}`);
    }

}

async function setRosterData(leagueID){
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

async function setPlayoffsData(leagueID) {
    try
    {
        const playoffResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/winners_bracket`);
        const playoffData = await playoffResponse.json();

        localStorage.setItem("PlayoffData", JSON.stringify(playoffData));
        return playoffData;
    }
    catch (error) {
        console.log(error);
    }
}

async function previousLeagueId(leagueID) {
    const myUserId = leagueUser;
    const leagueName = leagueDisplayName;
    const userLeagues = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`);
    const leagueData = await userLeagues.json();

    //const leagues = leagueData.map((league) => league);

    // for(let league of leagues)
    // {
    //     if(leagueData.find(x => x.name === leagueName))
    //     {
            let previousLeagueId = leagueData.previous_league_id;
            return previousLeagueId;
    //     }
    // }
}

async function setATLeagueIds() {

    var leagueIds = {
        "ATLeagueId" : []
    };

    try{
        var thisYear = await getCurrentSeason();
        const firstSeason = inauguralSeason;
        const currentLeagueId = await leagueInfo.default();
        var lastLeagueId = currentLeagueId;

        while(lastLeagueId != 0 && lastLeagueId != null)
        {
            leagueIds.ATLeagueId.push({
                "league_id": lastLeagueId,
                "year": thisYear.toString()
            });

            thisYear = thisYear - 1;
            lastLeagueId = await previousLeagueId(lastLeagueId);
            
        }

        localStorage.setItem("ATLeagueIds", JSON.stringify(leagueIds));

    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }
}

async function setPlayerData() {

    try
    {
        var myPlayerMap = {
            "players" : []
        };
        const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`);
        const data = await res.json();
        let maxId = parseInt(Object.keys(data).sort((a, b) => b - a)); //organize by Id;
        const playerPositions = ["QB", "RB", "WR", "TE", "K", "DEF"];

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
                    "team": playerTeam,
                    "number": data[i].number,
                    "height": data[i].height,
                    "weight": data[i].weight,
                    "years_exp": data[i].years_exp,
                    "swish_id": data[i].swish_id,
                    "college": data[i].college,
                    "search_rank": data[i].search_rank
                });
           }
        }

        localStorage.setItem("PlayerData", JSON.stringify(myPlayerMap));
    }
    catch (error) {
        console.log(error);
    }
}


async function setUserData(leagueID){
    try {
        const res = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`);
        const data = await res.json();
        localStorage.setItem("UserData", JSON.stringify(data));
    }
    catch (error) {
        console.log(error);
    }
}

async function setLeagueDetails(leagueID) {
    try {
        const leagueData = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`);
        const league = await leagueData.json();

        localStorage.setItem("LeagueData", JSON.stringify(league));
    }
    catch (error) {
        console.log(error);
    }
}

async function setMatchupData(leagueID, currentWeek) {

    try
    {
        let totalWeeksPlayed = parseInt(currentWeek);
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

        localStorage.setItem("MatchupData", JSON.stringify(upToCurrentWeekMatchups));
    }
    catch (error)
    {
        console.error(`Error: ${error.message}`);
    }

}