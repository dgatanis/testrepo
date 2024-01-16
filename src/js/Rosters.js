async function getRostersForLeague(leagueId){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`); 
  const rosterData = await rosterResponse.json(); 
  const usersElement = document.getElementById("myUsers");
  for (let users of rosterData) {
    usersElement.append(users.players + '\n');
  }
  console.log(rosterData);
}

async function OpenTeamRoster(userid,teamname) {
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`); 
  const rosterData = await rosterResponse.json(); 
  
  var rosterDiv = document.querySelector('#Roster');
  var rosterTable = document.querySelector('#RosterTable');
  rosterDiv.setAttribute('style', 'display="block"');
  var tablebody = rosterTable.childNodes[3];


  const teams = rosterData.map((roster) => roster);
  for(let roster of teams) {
    if(roster.owner_id==userid)
    {
      for(let players of roster.players)
        {
          var th = document.createElement("th");
          th.innerText="Position";
          th.setAttribute('scope', 'row');
          tablebody.append(th);
          var td = document.createElement("td");
          td.innerText=players;
          tablebody.append(td);
        }
    }
  }
}