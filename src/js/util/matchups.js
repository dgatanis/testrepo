// const leagueInfo = await import('../util/leagueInfo.js');

// const leagueDataStorage = localStorage.getItem("LeagueData");
// const leagueData = JSON.parse(leagueDataStorage); 

// const currentWeek = leagueInfo.getCurrentWeek();

// let tries = 0;
// while(tries <= 2)
// {
//     try{
//         currentWeek.then((thisWeek) => {
//             setBrowserData(leagueData.league_id,thisWeek);
//         }).catch((error) => {
//             tries++;
//             console.log(error);
//         });
//         tries=9;
//     }
//     catch (error) {
//         tries++;
//         console.error(`Error: ${error.message}`);
//     }
// }

// function setBrowserData(leagueID,currentWeek){
//     setMatchupData(leagueID,currentWeek);
// }

