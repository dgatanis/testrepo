function openRostersPage(rosterid) {
    window.location.assign('/CrushCitiesFFL/web/Rosters.html?callFunction=openRoster&rosterId='+rosterid);
    return;
}

function openRotoWirePage(rotowire_id, first_name, last_name){
    var formattedName = first_name.toString().toLowerCase() + "-" + last_name.toString().toLowerCase();
    window.open(`https://www.rotowire.com/football/player/${formattedName}-${rotowire_id}`,'_blank');
    return;
}

function openRotoWirePageDef(first_name, last_name, team){
    var formatFirstName = first_name.toString().toLowerCase();
    var formatLastName = last_name.toString().toLowerCase();
    var formatTeam = team.toString().toLowerCase();
    window.open(`https://www.rotowire.com/football/team/${formatFirstName}-${formatLastName}-${formatTeam}`,'_blank');
    return;
}

function showPage(pageNumber) {
    var trades = document.getElementsByClassName('custom-trades-page-'+pageNumber.toString());
    hideAllPages(pageNumber);

    for(let trade of trades)
    {
        trade.classList.remove('custom-none-display');
    }

    var paginationList = document.getElementById('trades-pagination');
    paginationList.setAttribute('data-current-page', pageNumber);
}

function hideAllPages(exceptPage) {
    const elements = document.querySelectorAll('[class*="custom-trades-page-"]');

    for(let element of elements)
    {
        if(!element.classList.contains('custom-trades-page-'+exceptPage.toString()))
        {
            element.classList.add('custom-none-display');
        }
    }
}

function togglePage(nextPrev) {
    var currentPage = document.getElementById('trades-pagination').getAttribute('data-current-page');
    
    if(nextPrev == 'N')
    {
        var pageNum = parseInt(currentPage)+1

        if(document.getElementsByClassName('custom-trades-page-'+pageNum.toString()).length >= 1)
        {
            showPage(pageNum);
        }
        
    }
    else if (nextPrev == 'P')
    {
        var pageNum = parseInt(currentPage)-1

        if(document.getElementsByClassName('custom-trades-page-'+pageNum.toString()).length >= 1)
        {
            showPage(pageNum);
        }
    }
    
}