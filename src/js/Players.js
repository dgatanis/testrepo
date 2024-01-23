export default async function getPlayers() {
    const playersResponse = await fetch(`https://api.sleeper.app/v1/players/nfl`); 
    const playersData = await playersResponse.json(); 
    /*
    Need to create a new js file to export the players data to and store it. 
    Use something like:
        export const playerData = writable({});
    And then to import the file into this js file use:
        import { playerData } from './path/to/file.js';
    
    */
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(playersData);
    return jsonString;
    
}