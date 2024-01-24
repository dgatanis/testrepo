async function getRostersForLeague(leagueId){
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`); 
  const rosterData = await rosterResponse.json(); 
  const usersElement = document.getElementById("myUsers");
  for (let users of rosterData) {
    usersElement.append(users.players + '\n');
  }
  console.log(rosterData);
}

async function OpenTeamRosterModal(userid,teamname) {
  const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`); 
  const rosterData = await rosterResponse.json(); 
  
  var modalRosterTeamName = document.querySelector('#ModalRosterTeamName');
  var rosterTable = document.querySelector('#RosterTable');
  var tablebody = rosterTable.childNodes[3];
  
  //show table and set team name
  modalRosterTeamName.innerText = teamname;

  //Remove players in list
  while(tablebody.firstChild) {
    tablebody.removeChild(tablebody.firstChild);
  }

  //Create table rows for players
  const teams = rosterData.map((roster) => roster);
  for(let roster of teams) {
    if(roster.owner_id==userid)
    {
      for(let players of roster.players)
        {
          var tr = document.createElement("tr");
          var th = document.createElement("th");
          th.innerText="Position";
          th.setAttribute('scope', 'row');
          tr.appendChild(th);
          var td = document.createElement("td");
          td.innerText=players;
          tr.appendChild(td);
          tablebody.append(tr);
        }
    }
  }
}