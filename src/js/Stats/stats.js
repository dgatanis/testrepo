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
    previousLeagueId 
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
        var year = await getCurrentSeason();
        var lastLeagueId;
        const firstSeason = inauguralSeason;

        for(var i=year; i>=firstSeason; i--)
        {
            while(lastLeagueId != 0)
            {
                lastLeagueId = await previousLeagueId(i);
                console.log(previousLeagueId); 
            }
        }


    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}