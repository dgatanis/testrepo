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

function togglePage(nextPrev) {
    var currentPage = parseInt(document.getElementById('trades-pagination').getAttribute('data-current-page'));
    var allTrades = document.querySelectorAll('[class*="custom-transaction-row"]');
    var allShownTrades = document.querySelectorAll(`[data-shown='true']`);
    var firstShownTrade = allShownTrades[0].getAttribute("data-transaction-date");
    var finalShownTrade = allShownTrades[allShownTrades.length - 1].getAttribute("data-transaction-date");
    var beginIndex = parseInt(Array.from(allTrades).findIndex(trade => parseInt(trade.getAttribute("data-transaction-date")) === parseInt(firstShownTrade)));
    var endIndex = parseInt(Array.from(allTrades).findIndex(trade => parseInt(trade.getAttribute("data-transaction-date")) === parseInt(finalShownTrade)));
    var totalPages = Math.ceil(allTrades.length / 10);
 
    for (var trade of allShownTrades) {
        trade.setAttribute("data-shown", "false");
        trade.classList.add("custom-none-display");
    }
    
    for (const [index, trade] of allTrades.entries()) {
        if (nextPrev == 'N') {
            var remainder = endIndex % 10;
            if (   index == endIndex + 1 
                || (index > endIndex && index <= endIndex + 10) 
                || (endIndex == allTrades.length - 1 && index <= endIndex && index >= endIndex - remainder)) { //If its final trade in index then get the last remaining trades until a number divisible by 10
                trade.setAttribute("data-shown", "true");
                trade.classList.remove("custom-none-display");
            }
            else {
                trade.setAttribute("data-shown", "false");
                trade.classList.add("custom-none-display");
            }
            
        }
        else if (nextPrev == 'P') {
            if (index == beginIndex - 1 || (index < beginIndex && index >= beginIndex - 10) || (beginIndex == 0 && index <= 9)) {
                trade.setAttribute("data-shown", "true");
                trade.classList.remove("custom-none-display");
            }
            else {
                trade.setAttribute("data-shown", "false");
                trade.classList.add("custom-none-display");
            }
        }
    }
    if(nextPrev == 'N') { //Set current page
        if(currentPage + 1 > totalPages) {
            currentPage = currentPage;
        }
        else {
            currentPage = currentPage + 1;
        }
    }
    else if(nextPrev == 'P') {
        if(currentPage - 1 <= 0) {
            currentPage = currentPage;
        } 
        else {
            currentPage = currentPage - 1;
        }
    }

    document.getElementById('trades-pagination').setAttribute('data-current-page', currentPage);
    updatePagination(currentPage, totalPages);
}

function updatePagination(currentPage, totalPages) {
    const pagination = document.getElementById('trades-pagination');
    const pageItems = pagination.getElementsByClassName('page-number');
    const ellipsis = pagination.querySelectorAll('.ellipsis');
    var currentPageItem = pageItems[currentPage-1];

    // Hide all pages initially
    for (let item of pageItems) {
        item.classList.add('custom-none-display');
        item.classList.remove("custom-active");
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

    currentPageItem.classList.add("custom-active");
}

async function filterTrades() {
    const helper = await import('../util/helper.js');
    var allTrades = document.querySelectorAll(`[data-transaction-date]`);
    var teamDropdown = document.getElementById("custom-team-selector-input");
    var startDate = document.getElementById("startDate");
    var endDate = document.getElementById("endDate");
    var selectedUserId = teamDropdown.innerText == '' ? null : helper.getUserByName(teamDropdown.innerText);
    var selectedStartDate = startDate.value == '' ? '1/1/1901' : startDate.value;
    var selectedEndDate = endDate.value == '' ? '1/1/2099' : endDate.value;

    document.getElementById("trade-page-navigation-container").classList.add("custom-none-display"); //hide the pagination

    if(validateFilters(selectedUserId, selectedStartDate, selectedEndDate) == 1) return;
    if(selectedUserId == null && startDate.value == '' && endDate.value == '') resetTradeFilters();

    for (var trade of allTrades) {
        var date = parseInt(trade.getAttribute("data-transaction-date"));

        if (parseInt(new Date(selectedStartDate).getTime()) <= date && date <= parseInt(new Date(selectedEndDate).getTime())) {

            if (selectedUserId != null) {
                var user = trade.querySelectorAll(`[data-userid='${selectedUserId}']`);

                if (user.length >= 1) {
                    trade.classList = 'custom-transaction-row';
                }
                else {
                    if (!trade.classList.contains("custom-none-display")) {
                        trade.classList.add("custom-none-display");
                    }
                }
            }
            else {
                trade.classList = 'custom-transaction-row';
            }
        }
        else {
            if (!trade.classList.contains("custom-none-display")) {
                trade.classList.add("custom-none-display")
            }
        }
    }

    

}

function validateFilters(selectedUserId, selectedStartDate, selectedEndDate) {
    const startDate = new Date(selectedStartDate);
    const endDate = new Date(selectedEndDate);

    if (endDate.getTime() < startDate.getTime()) {
        window.alert("From Date cannot precede To Date.");
        return 1;
    }
    else {
        return 0;
    }
}

function resetTradeFilters() {
    document.getElementById('trades-pagination').setAttribute('data-current-page',"1");
    var allTrades = document.querySelectorAll('[class*="custom-transaction-row"]');
    var allShownTrades = document.querySelectorAll(`[data-shown='true']`);
    var totalPages = Math.ceil(allTrades.length / 10);
 
    for (var trade of allShownTrades) {
        trade.setAttribute("data-shown", "false");
        trade.classList.add("custom-none-display");
    }

    for(const [index, trade] of allTrades.entries()) {
        if(index < 10 ) {
            trade.setAttribute("data-shown", "true");
            trade.classList.remove("custom-none-display");
        }
        else {
            trade.setAttribute("data-shown", "false");
            trade.classList.add("custom-none-display");
        }
    }
    document.getElementById("startDate").value = '';
    document.getElementById("endDate").value = '';
    document.getElementById("custom-team-selector-input").value = '';
    document.getElementById("custom-team-selector-input").innerText = 'Choose Team';
    document.getElementById("trade-page-navigation-container").classList.remove("custom-none-display");
    updatePagination(1, totalPages);
}