//Bankroll function
function getBankRoll (userid) {

    if(localStorage.getItem("RosterData"))
    {
        let rosterData = localStorage.getItem("RosterData");
        let rosters = JSON.parse(rosterData);
        
        let wins = null;
        let losses = null;
        let test = null;

        for(let roster of rosters)
        {
            if(roster.owner_id == userid)
            {
                test = roster.waiver_position;
                console.log(test);
            }
        }
    }

}

//Current Season matchups

//