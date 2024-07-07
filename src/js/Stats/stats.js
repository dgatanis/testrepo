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
    previousLeagueId,
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
async function loadContents() {
    try{
        setLinkSource("keep-trade-cut");
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}