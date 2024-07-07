import { 
    rosters, 
    createOwnerAvatarImage, 
    getTeamName,
    playoffs,
    leagueDisplayName,
    leagueDescription,
    setLeagueName,
    setLinkSource
    } from '../util/helper.js';

let rosterData = rosters;
let playoffData = playoffs;

loadContents();

function loadContents() {

    setLeagueName("footerName");
    setLeagueName("pageTitle");
    setLinkSource("keep-trade-cut")
    loadLeagueDescription();
    loadTeams();
}

function loadLeagueDescription() {
    var description = document.getElementsByClassName('custom-league-description');

    description[0].innerText = leagueDescription;
}

function loadTeams() {
    try{
        var teams = document.querySelectorAll('[id*=team]');
        var champRosterId = null;

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
    
    
                teams[i].children[0].append(throneImg);
            }
            
        }
    }
    catch (error)
    {
        console.error(error.message);
    }
}