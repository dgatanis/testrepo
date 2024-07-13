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

export async function getTransactionsData(leagueId, week, type = null) {

    const res  = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`);
    const data = await res.json();

    var allTransactions = [];

    if(type)
    {
        for(let transaction of data)
        {
            if(transaction.type == type)
            {
                allTransactions.push({
                    ...transaction
                });
            }
        }
    }
    else
    {
        for(let transaction of data)
        {
            allTransactions.push({
                ...transaction
            });
            
        }
    }
    

    return allTransactions;
}