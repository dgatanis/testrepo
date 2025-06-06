function openRostersPage(rosterid) {
    var newURL = new URL('https://dgatanis.github.io/CrushCitiesFFL/web/Rosters.html');
    newURL.searchParams.append('callFunction', 'openRoster');
    newURL.searchParams.append('rosterId', rosterid);

    history.replaceState(null, null, newURL.toString());
    history.pushState(null, null, newURL.toString());
    //window.location.href = newURL;
    return;
}