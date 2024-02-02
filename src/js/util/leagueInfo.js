export const leagueID = currentLeagueId(); // your league ID
export const leagueName = "Crush Cities "; // your league name
export const dues = 200; // (optional) used in template constitution page
export const dynasty = true; // true for dynasty leagues, false for redraft and keeper

const thisYear = new Date().getFullYear;
const myUserId = '467550885086490624'

async function currentLeagueId() {
    const leagueID;
    const userLeagues = await fetch(`https://api.sleeper.app/v1/user/${myUserId}/leagues/nfl/${thisYear}`);
    const leagueData = await userLeagues.json();
    const leagues = leagueData.map((league) => league);

    for(let league of leagues)
    {
        if(leagueData.find(x => x.name === leagueName))
        {
            return league.league_id;
        }
    } 
}