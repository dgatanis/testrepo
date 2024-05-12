import { league } from "../initData";

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