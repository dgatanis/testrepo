export const leagueDisplayName = "Crush Cities ";//"The Greatest Show on Paper"; 
export const dues = 200; 
export const leagueUser = '467550885086490624';//'340347079136137216';
export const dynasty = true; 
export const weeklyWinner = 35; //Amount won for highest weekly scorer
export const inauguralSeason = 2024; //year league began in Sleeper

export const leagueDescription = "Welcome to the Crush Cities dynasty fantasy football league, founded in the summer of 2020. This league is comprised of 10 members who dream of bringing home a jersey of their choice, each and every year. However, some owners' dreams are just that, dreams. At the conclusion of the season, the champion is given the opportunity to select our new destination to draft rookies that will almost certainly become future waiver additions for someone else. Luck? Skill? Who cares. The only thing that matters is: Don't. Finish. Last."

export default async function getCurrentLeagueId() {
    try {
        const thisSeason = await getCurrentSeason();
        const myLeagueId = await currentLeagueId(thisSeason);

        return myLeagueId;
    }
    catch (error) {
        console.log("Error: ", error);
    }

}

export async function getCurrentSeason() {
    try {
        const nflState = await getNFLState();
        return nflState.league_season;
    } catch (error) {
        console.log("Error: ", error);
    }

}

export async function getCurrentWeek() {
    try {
        const nflState = await getNFLState();
        return nflState.leg;
    } catch (error) {
        console.log("Error: ", error);
    }

}

async function currentLeagueId(thisYear) {
    const myUserId = leagueUser;
    const leagueName = leagueDisplayName;
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

export function setLeagueName(elementId) {
    var element = document.getElementById(elementId)

    element.innerText = leagueDisplayName.trim() + " FFL"
}

export async function setLinkSource(elementId) {
    var element = document.getElementById(elementId);
    var leagueId = await getCurrentLeagueId();

    element.setAttribute('href', `https://keeptradecut.com/dynasty/power-rankings/league-overview?leagueId=${leagueId}&platform=Sleeper`)
}