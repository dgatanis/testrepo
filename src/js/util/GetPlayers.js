export default async function getPlayers() {
    const playersResponse = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
    if(playersResponse.ok)
    {
        const playersData = await playersResponse.json();
        playersData.then((value) => {
            console.log("in then stmt");
            var jsonString = JSON.stringify(playersData);
            return jsonString;
          });
        
    }
    // Convert the JSON object to a string
}