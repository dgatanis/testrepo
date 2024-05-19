import { league } from "../initData.js";

var leagueData = league;

export function getLeaguePositions() {

    const leaguePositions = leagueData.roster_positions;

    const positions = [];

    for(let starterPosition of leaguePositions)
        {
            if(starterPosition != "BN")
            {
                if(starterPosition == "SUPER_FLEX")
                {
                    positions.push("SF");
                }
                else
                {
                    positions.push(starterPosition);
                }
            }
        }

    return positions.toString().replaceAll(",", ", ");
}

export async function previousLeagueId(year) {
    const myUserId = '467550885086490624';
    const leagueName = "Crush Cities ";
    const userLeagues = await fetch(`https://api.sleeper.app/v1/user/${myUserId}/leagues/nfl/${year}`);
    const leagueData = await userLeagues.json();

    const leagues = leagueData.map((league) => league);
    
    for(let league of leagues)
    {
        if(leagueData.find(x => x.name === leagueName))
        {
            let previousLeagueId = league.previous_league_id;
            return previousLeagueId;
        }
    }
}