function openRostersPage(rosterid) {
    window.location.assign('/CrushCitiesFFL/web/Rosters.html?callFunction=openRoster&rosterId='+rosterid);
    return;
}

function openSwishPage(swish_id){
    window.open(`https://swishanalytics.com/nfl/players/player?id=${swish_id}&view=fantasy`,'_blank');
    return;
}