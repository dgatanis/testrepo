import { 
    rosters, 
    users, 
    players, 
    matchups, 
    playoffs, 
    getFullPlayerName, 
    createOwnerAvatarImage, 
    getRosterStats, 
    sortTeamRankings, 
    createPlayerImage,
    getTeamName,
    getMatchupWeekWinner,
    getRosterHighScorerWeek,
    highScorerInMatchupStarters,
    allTimeMatchupData,
    setLeagueName,
    setLinkSource 
    } from '../util/helper.js';
import { 
    getCurrentSeason,
    inauguralSeason
        } from '../util/leagueInfo.js';

let userData = users;
let rosterData = rosters;
let playerData = players;
let matchupData = matchups;
let playoffData = playoffs;

loadContents();

//This loads the page contents dynamically
function loadContents() {
    try{
        setLinkSource("keep-trade-cut");
        setLeagueName("footerName");
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}

function setTableData()
{
    var tables = ['allTimeLowScorerTeam','allTimeLowScorerPlayer','allTimeHighScorerTeam','allTimeHighScorerPlayer'];

    for(let table of tables)
    {
        var table = document.getElementById(table);


    }

}