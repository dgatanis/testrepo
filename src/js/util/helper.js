import { rosters, users, players, playoffs, matchups, league, allTimeLeagueIds, allTimeMatchupData } from '../util/initData.js';
import { getRosterStats, sortTeamRankings, calcRosterAge, getPlayerNickNames } from '../util/RosterData/rosterData.js';
import { getPlayerPointsForWeek, getMatchupWeekWinner, getRosterHighScorerWeek, highScorerInMatchupStarters, getRosterLowScorerWeek, lowScorerInMatchupStarters } from './MatchupData/matchupData.js';
import { getFullPlayerName, createPlayerImage, createNFLTeamImage, sortByPosition  } from './PlayerData/playerData.js';
import { createOwnerAvatarImage, getTeamName, getUserByName, getRosterByUserId } from './UserData/userData.js';
import { getLeaguePositions, getTransactionsData } from './LeagueData/leagueData.js';
import { leagueDisplayName, leagueDescription, setLeagueName, inauguralSeason, setLinkSource, getRandomString, getPlayoffsData, getLeagueURL } from './leagueInfo.js';
import { getLeagueDrafts, getDraftPicks, getDraftOrder } from './DraftData/draftData.js';

export { 
    rosters, 
    league,
    users,
    players,
    playoffs,
    matchups,
    allTimeLeagueIds,
    allTimeMatchupData,
    getRosterStats,
    getPlayerPointsForWeek,
    getFullPlayerName,
    sortTeamRankings,
    createOwnerAvatarImage,
    getLeaguePositions,
    getTeamName,
    createPlayerImage,
    createNFLTeamImage,
    sortByPosition,
    calcRosterAge,
    getMatchupWeekWinner,
    getRosterHighScorerWeek,
    highScorerInMatchupStarters,
    getPlayerNickNames,
    leagueDisplayName,
    leagueDescription,
    setLeagueName,
    inauguralSeason,
    setLinkSource,
    getTransactionsData,
    getRandomString,
    getRosterLowScorerWeek,
    getUserByName,
    getRosterByUserId,
    lowScorerInMatchupStarters,
    getPlayoffsData,
    getLeagueDrafts,
    getDraftPicks,
    getDraftOrder,
    getLeagueURL
};

export function removeSpinner() {
    var loadingSpinner =  document.getElementById("page-loading");
    loadingSpinner.classList.add('custom-none-display');

    var bodyItems = document.getElementsByClassName('custom-body');
    
    for(let body of bodyItems)
    {
        body.classList.remove('custom-none-display');
    }
}