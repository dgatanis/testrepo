function openRostersPage(rosterid) {
    window.location.assign('/CrushCitiesFFL/web/Rosters.html?callFunction=openRoster&rosterId='+rosterid);
    return;
}

function openRotoWirePage(rotowire_id, first_name, last_name){
    var formattedName = first_name.toString().toLowerCase() + "-" + last_name.toString().toLowerCase();
    window.open(`https://www.rotowire.com/football/player/${formattedName}-${rotowire_id}`,'_blank');
    return;
}