import getCurrentLeagueId from './leagueInfo.js';

const currentLeague = getCurrentLeagueId();

currentLeague.then((currentLeagueId) => {
    setBrowserData(currentLeagueId);
}).catch((error) => {
    console.error(`Error: ${error.message}`);
});

