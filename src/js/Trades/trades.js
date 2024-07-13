import { getTransactionsData, allTimeLeagueIds, setLeagueName } from '../util/helper.js';

loadContents();

function loadContents() {
    setLeagueName("footerName");
    loadTradeTransactions();
}

async function loadTradeTransactions() {

    var allTradeTransactions = await getTradeTransactions();

    for(let trades of allTradeTransactions)
    {
        if(trades.data.length >= 1)
        {
            for(let trade of trades.data)
            {
                console.log(trade);
            }
        }
    }
}

async function getTradeTransactions() {

    var allTradeTransactions = [];
    
    for(let league of allTimeLeagueIds.ATLeagueId)
    {
        for(let i = 0; i <= 18; i++)
        {
            var transactions = await getTransactionsData(league.league_id, i, "trade");

            allTradeTransactions.push ({
                "season": league.year,
                "league_id": league.league_id,
                "week": i,
                "data": transactions
            });
        }
    }

    return allTradeTransactions;
}