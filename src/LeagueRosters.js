function myFunction(){
  const myTest = await fetch(`https://api.sleeper.app/v1/league/1046222222567784448/rosters`, {compress: true}).catch((err) => { console.error(err); });
  console.log(myTest.toString());

  const test = fetch('https://api.sleeper.app/v1/league/1046222222567784448/matchups/1')
    .then((response) => response.json())
    .then((json) => console.log(json));

return;
}
