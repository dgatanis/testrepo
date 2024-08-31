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
        const currentExp = new Date(parseInt(localStorage.getItem("expiration")));

        if(!localStorage.getItem("expiration") || currentExp < now)
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
        }
        if(!sessionStorage.getItem("MatchupData") || currentExp < now)
        {
            sessionStorage.clear();
            setMatchupData(currentLeagueId,currentWeek);
            setAllTimeMatchupData();
            //setMatchupData('1003692635549462528','10');
        }

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
    const userLeagues = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`);
    const leagueData = await userLeagues.json();

    let previousLeagueId = leagueData.previous_league_id;
    return previousLeagueId;

}

async function setATLeagueIds() {

    var leagueIds = {
        "ATLeagueId" : []
    };

    try{
        var thisYear = await getCurrentSeason();
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
        const playerPositions = ["QB", "RB", "WR", "TE", "K", "DEF"];

        for(let key in data)
        {
           if(data[key] && playerPositions.includes(data[key].position))
           {
                let playerTeam = data[key].team;

                if(playerTeam === null)
                {
                    playerTeam = "FA";
                }
                if(data[key].position =="DEF")
                {
                    myPlayerMap.players.push({
                        "player_id": data[key].player_id,
                        "position": data[key].position,
                        "firstname": data[key].first_name,
                        "lastname": data[key].last_name,
                        "age": 0,
                        "team": data[key].player_id,
                        "number": null,
                        "height": null,
                        "weight": null,
                        "years_exp": null,
                        "rotowire_id": null,
                        "college": null,
                        "search_rank": null,
                        "injury_status": null,
                        "injury_body_part": null
                    });
                }
                else {
                    myPlayerMap.players.push({
                        "player_id": data[key].player_id,
                        "position": data[key].position,
                        "firstname": data[key].first_name,
                        "lastname": data[key].last_name,
                        "age": data[key].age,
                        "team": playerTeam,
                        "number": data[key].number,
                        "height": data[key].height,
                        "weight": data[key].weight,
                        "years_exp": data[key].years_exp,
                        "rotowire_id": data[key].rotowire_id,
                        "college": data[key].college,
                        "search_rank": data[key].search_rank,
                        "injury_status": data[key].injury_status,
                        "injury_body_part": data[key].injury_body_part
                    });
                }

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

        sessionStorage.setItem("MatchupData", JSON.stringify(upToCurrentWeekMatchups));
    }
    catch (error)
    {
        console.error(`Error: ${error.message}`);
    }

}

async function setAllTimeMatchupData() {
    try{
        var thisYear = await getCurrentSeason();
        const currentLeagueId = await leagueInfo.default();
        var lastLeagueId = currentLeagueId;
        let matchupWeeks = [];
        let allTimeMatchups = [];

        while(lastLeagueId != 0 && lastLeagueId != null)
        {
            for(let i = 0; i<=18; i++)
            {
                const matchup = await fetch(`https://api.sleeper.app/v1/league/${lastLeagueId}/matchups/${i}`);
                const matchupData = await matchup.json();
                let matchupsArray = [];

                if(matchupData)
                {
                    for(let matchups of matchupData)
                    {
                        if(matchups)
                        {
                            matchupsArray.push({
                                ...matchups
                            });
                        }
                    }
                    matchupWeeks.push({
                        ...matchupsArray
                        ,"year": thisYear.toString()
                        ,"week": i
                    });
    
    
                }
            }
            thisYear = thisYear - 1;
            lastLeagueId = await previousLeagueId(lastLeagueId);
            
        }

        allTimeMatchups.push({
            matchupWeeks
        });

        sessionStorage.setItem("ATMatchupData", JSON.stringify(allTimeMatchups));

    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }
    

}