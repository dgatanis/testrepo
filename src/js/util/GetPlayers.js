export default async function getPlayers() {
    const playersResponse = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
    const playersData = await playersResponse.json(); 
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(playersData);
    return playersData;
}