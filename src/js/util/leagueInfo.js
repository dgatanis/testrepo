export const leagueID = "1046222222567784448"
export const leagueName = "Crush Cities "; // your league name
export const dues = 200; // (optional) used in template constitution page
export const dynasty = true; // true for dynasty leagues, false for redraft and keeper

export const inauguralSeason = 2024;


export default async function currentLeagueId() {
    const nflState = getNFLState();
    let thisYear;
    nflState.then((nflData) => {
        thisYear = nflData.league_season;
        }).catch((error) => {
            console.error(`Error fetching currentLeagueID: ${error.message}`);
        });
        
    const myUserId = '467550885086490624';
    const userLeagues = await fetch(`https://api.sleeper.app/v1/user/${myUserId}/leagues/nfl/${thisYear}`);
    const leagueData = await userLeagues.json();
    const leagues = leagueData.map((league) => league);

    for(let league of leagues)
    {
        if(leagueData.find(x => x.name === leagueName))
        {
            let currentLeagueId = league.league_id;
            return currentLeagueId;
        }
    } 
}


async function getNFLState() {
    const nfl = await fetch(`https://api.sleeper.app/v1/state/nfl`);
    const nflData = await nfl.json(); 

    return nflData;
}
