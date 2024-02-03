export const leagueID = "1046222222567784448"
export const dues = 200; // (optional) used in template constitution page
export const dynasty = true; // true for dynasty leagues, false for redraft and keeper

export const inauguralSeason = 2024;

export default async function getCurrentLeagueId() {
    try {
        const thisSeason = await currentSeason();
        const myLeagueId = await currentLeagueId(thisSeason);

        return myLeagueId;
    }
    catch (error) {
        console.log("Error: ", error);
    }

}

async function currentSeason() {
    try {
        const nflState = await getNFLState();
        return nflState.league_season;
    } catch (error) {
        console.log("Error: ", error);
    }

}

async function currentLeagueId(thisYear) {
    const myUserId = '467550885086490624';
    const leagueName = "Crush Cities ";
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
    try {
        const nfl = await fetch(`https://api.sleeper.app/v1/state/nfl`);
        const nflData = await nfl.json(); 
    
        return nflData;
    }
    catch(error) {
        console.log("Error: ", error);
    }

}
