const leagueInfo = await import('../util/leagueInfo.js');

const leagueDataStorage = localStorage.getItem("LeagueData");
const leagueData = JSON.parse(leagueDataStorage); 

const currentWeek = leagueInfo.getCurrentWeek();

currentWeek.then((thisWeek) => {
    setBrowserData(leagueData.league_id,5);
}).catch((error) => {
    console.error(`Error: ${error.message}`);
});

function setBrowserData(leagueID,currentWeek){
    setMatchupData(leagueID,currentWeek);
}

function setMatchupData(leagueID,currentWeek){
    if(!sessionStorage.getItem("MatchupData"))
    {
        getMatchupData(leagueID, currentWeek);
    }
}

async function getMatchupData(leagueID, currentWeek) {

    let totalWeeksPlayed = parseInt(currentWeek);
    leagueID = '1003692635549462528'; //TESTING LEAGUE
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