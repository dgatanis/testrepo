async function openMatchupsPage(season, week, matchupId) {
    const leagueInfo = await import('../util/leagueInfo.js');
    var relativePath = './web/Matchups.html'
    var newURL = new URL(relativePath, leagueInfo.getLeagueURL());
    newURL.searchParams.append('callFunction', 'expandSeasonWeek');
    newURL.searchParams.append('season', season);
    newURL.searchParams.append('week', week);
    newURL.searchParams.append('matchupId', matchupId);

    window.open(newURL.href,'_blank');
    return;
}