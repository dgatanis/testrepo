function expandAll() {

    var accordionBodys = document.getElementsByClassName('accordion-collapse');
    var accordionButtons = document.getElementsByClassName('accordion-button');

    for(let accordionBody of accordionBodys)
    {
        accordionBody.setAttribute('class', 'accordion-collapse collapse show');
    }
    for(let accordionButton of accordionButtons)
    {
        accordionButton.setAttribute('class', 'accordion-button');
        accordionButton.setAttribute('aria-expanded', 'true');
    }
}

function collapseAll() {
    var accordionBodys = document.getElementsByClassName('accordion-collapse');
    var accordionButtons = document.getElementsByClassName('accordion-button');

    for(let accordionBody of accordionBodys)
    {
        accordionBody.setAttribute('class', 'accordion-collapse collapse');
    }
    for(let accordionButton of accordionButtons)
    {
        accordionButton.setAttribute('class', 'accordion-button collapsed');
        accordionButton.setAttribute('aria-expanded', 'false');
    }
}

function expandCollapseTeam(rosterid) {

    var teamGroup = document.getElementById('teamGroup'+rosterid);
    var teamStarters = document.getElementById('startersTeam'+rosterid);
    var teamBench = document.getElementById('benchTeam'+rosterid);
    var teamTaxi = document.getElementById('taxiTeam'+rosterid);
    var teamStats = document.getElementById('statsTeam'+rosterid);
    var teamGroupChildren = teamGroup.children;
    var showFields = true;

    if(teamStarters.classList.value == 'accordion-collapse collapse show' ||
    teamBench.classList.value == 'accordion-collapse collapse show' ||
    teamTaxi.classList.value == 'accordion-collapse collapse show' ||
    teamStats.classList.value == 'accordion-collapse collapse show' )
    {
        showFields = false;
    }

    for(let accordionItem of teamGroupChildren)
    {
        var accordionBodys = accordionItem.getElementsByClassName('accordion-collapse');
        var accordionButtons = accordionItem.getElementsByClassName('accordion-button');

        for(let accordionBody of accordionBodys)
        {
            if(showFields)
            {
                accordionBody.setAttribute('class', 'accordion-collapse collapse show');
            }
            else
            {
                accordionBody.setAttribute('class', 'accordion-collapse collapse');
            }
            
        }
        for(let accordionButton of accordionButtons)
        {
            if(showFields)
            {
                accordionButton.setAttribute('class', 'accordion-button');
                accordionButton.setAttribute('aria-expanded', 'true');
            }
            else 
            {
                accordionButton.setAttribute('class', 'accordion-button collapsed');
                accordionButton.setAttribute('aria-expanded', 'false');
            }

        }
    }
}