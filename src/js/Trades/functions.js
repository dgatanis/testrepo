async function openRostersPage(rosterid) {
    const leagueInfo = await import('../util/leagueInfo.js');
    var relativePath = './web/Rosters.html'
    var newURL = new URL(relativePath, leagueInfo.getLeagueURL());
    newURL.searchParams.append('callFunction', 'openRoster');
    newURL.searchParams.append('rosterId', rosterid);

    window.open(newURL.href,'_blank');
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
    var allTrades = document.querySelectorAll('[class*=custom-transaction-row]');
    var totalPages = Math.ceil(allTrades.length / 10);

    hideAllPages(pageNumber);

    for(let trade of trades)
    {
        trade.classList.remove('custom-none-display');
    }

    var paginationList = document.getElementById('trades-pagination');
    paginationList.setAttribute('data-current-page', pageNumber);

    updatePagination(pageNumber, totalPages);
    
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
            var pageNumberLinks = document.getElementsByClassName('page-number')
            pageNumberLinks[parseInt(currentPage)].focus();
        }
        
    }
    else if (nextPrev == 'P')
    {
        var pageNum = parseInt(currentPage)-1

        if(document.getElementsByClassName('custom-trades-page-'+pageNum.toString()).length >= 1)
        {
            showPage(pageNum);
            var pageNumberLinks = document.getElementsByClassName('page-number')
            pageNumberLinks[parseInt(currentPage)-2].focus();
        }
    }
    
}

function updatePagination(currentPage, totalPages) {
    const pagination = document.getElementById('trades-pagination');
    const pageItems = pagination.getElementsByClassName('page-number');
    const ellipsis = pagination.querySelectorAll('.ellipsis');
    
    // Hide all pages initially
    for (let item of pageItems) {
        item.classList.add('custom-none-display');
    }
    let start = Math.max(1, currentPage - 2);  // Show 2 pages before the current one
    let end = Math.min(totalPages, parseInt(currentPage) + 2);  // Show 2 pages after the current one
    
    if (start > 1) {
        ellipsis[0].classList.remove('custom-none-display');
        ellipsis[1].classList.remove('custom-none-display');
    } else {
        ellipsis[0].classList.add('custom-none-display');
        ellipsis[1].classList.add('custom-none-display');
    }

    if(end <= 5)
    {
        ellipsis[1].classList.remove('custom-none-display');
    }

    if(currentPage == totalPages)
    {
        ellipsis[1].classList.add('custom-none-display');
    }

    if(totalPages<=5)
    {
        ellipsis[1].classList.add('custom-none-display');
    }

    for (let i = start - 1; i < end; i++) {
        pageItems[i].classList.remove('custom-none-display');
    }
}
