function openRostersPage(rosterid) {
    var url = new URL(window.location.href.toString());
    var newURL = new URL('https://dgatanis.github.io/testrepo/web/Rosters.html');
    newURL.searchParams.append('callFunction', 'openRoster');
    newURL.searchParams.append('rosterId', rosterid);

    history.pushState(null, null, url.toString());
    history.pushState(null, null, newURL.toString());
    window.location.href = newURL;
    return;
}