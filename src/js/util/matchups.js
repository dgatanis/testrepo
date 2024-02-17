const leagueInfo = await import('../util/leagueInfo.js');

const currentLeagueId = leagueInfo.default();
const currentWeek = leagueInfo.getCurrentWeek();

currentLeagueId.then(currentWeek => {
    setBrowserData(currentLeagueId,currentWeek);
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
    //const matchup = await fetch(`https://api.sleeper.app/v1/league/1003692635549462528/matchups/2`);
    const matchup = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${weekNumber}`);
    const matchupData = await matchup.json(); 
    console.log(leagueID);
    console.log("week: " + currentWeek);
    sessionStorage.setItem("MatchupData", JSON.stringify(matchupData));
}