import { 
    rosters, 
    createOwnerAvatarImage, 
    getTeamName,
    playoffs,
    leagueDisplayName,
    leagueDescription,
    setLeagueName,
    setLinkSource,
    removeSpinner,
    setDarkMode,
    getCurrentSeason,
    league
    } from '../util/helper.js';

let rosterData = rosters;
let playoffData = playoffs;

loadContents();

function loadContents() {
    setDarkMode();
    setLeagueName("footerName");
    setLeagueName("pageTitle");
    setLinkSource("keep-trade-cut")
    loadLeagueDescription();
    loadTeams();
    removeSpinner();
}

function loadLeagueDescription() {
    var description = document.getElementsByClassName('custom-league-description');

    description[0].innerText = leagueDescription;
}

async function loadTeams() {
    try{
        var teams = document.querySelectorAll('[id*=team]');
        var champRosterId = null;
        var currentSeason = await getCurrentSeason()

        if(league.status === 'pre_draft') {
            currentSeason = currentSeason - 1;
        }
        
        for(let playoffRound of playoffData)
        {
            if(playoffRound.r == 3 && playoffRound.t1_from.w)
            {
                champRosterId = playoffRound.w
            }
        }

        for(let i = 0; i < teams.length; i++)
        {
            
            let rosterid = i + 1;
            let roster = rosterData.find(x => x.roster_id === rosterid);
            let teamName = getTeamName(roster.owner_id);
            let playerImg = createOwnerAvatarImage(roster.owner_id, "home");

            teams[i].children[0].children[0].innerText = teamName;
            teams[i].children[0].prepend(playerImg);
            teams[i].children[0].setAttribute('onclick', 'openRostersPage(' + roster.roster_id + ')');
    
            if(champRosterId && champRosterId == roster.roster_id)
            {
                var throneImg = document.createElement('img');
                throneImg.setAttribute('src','src/static/images/throne.png');
                throneImg.setAttribute('class', 'custom-throne-icon-medium');
                throneImg.setAttribute('title', 'The Throne');
                throneImg.setAttribute('onclick', 'openMatchupsPage(' + currentSeason + ',17,1)')
     
    
                teams[i].children[0].append(throneImg);
            }
            
        }
    }
    catch (error)
    {
        console.error(error.message);
    }
}