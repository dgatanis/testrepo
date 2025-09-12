function expandSeasonWeek(season, week, matchupId) {

    var seasonGroup = document.getElementById('season_'+season);
    var seasonButton = document.getElementById('buttonWeek_'+week);
    var teamGroupChildren = seasonGroup.children;
    var showFields = true;

    if(seasonButton.classList.value == 'accordion-collapse collapse show')
    {
        showFields = false;
    }

    for(let accordionItem of teamGroupChildren)
    {
        var accordionBodys = accordionItem.getElementsByClassName('accordion-collapse');
        var accordionButtons = accordionItem.getElementsByClassName('accordion-button');

        for(let accordionBody of accordionBodys)
        {
            if(accordionBody.id == ("collapse_" + week.toString() + "_" + season.toString()) || accordionBody.id == ("collapse_" + season.toString() + "_" + season.toString())) { //only open chosen season/week
                
                if(showFields){
                    accordionBody.setAttribute('class', 'accordion-collapse collapse show');
                }
                else{
                    accordionBody.setAttribute('class', 'accordion-collapse collapse');
                }
            }
        }
        for(let accordionButton of accordionButtons)
        {
            if(accordionButton.id == ("buttonWeek_" + week.toString()) || accordionButton.id == ("buttonWeek_" + season.toString())) { //only open chosen season/week
                
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
    jump(season, week, matchupId);
}

function jump(season, week, matchupId){             
    let anchor = "#matchup_"+ matchupId + "_season_" + season + "_" + week;                 
    document.getElementById(anchor).scrollIntoView({ behavior: 'smooth' });
}