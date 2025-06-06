function openRostersPage(rosterid) {
    var newURL = new URL('https://dgatanis.github.io/CrushCitiesFFL/web/Rosters.html');
    newURL.searchParams.append('callFunction', 'openRoster');
    newURL.searchParams.append('rosterId', rosterid);

    history.pushState({}, '', newURL);
    window.location.href = newURL;
    return;
}