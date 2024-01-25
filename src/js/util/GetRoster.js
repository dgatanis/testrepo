//import getPlayers from '../util/GetPlayers.js';
import { browser } from '$app/environment';


let playersInfo = null;

if(browser) {
    playersInfo = JSON.parse(localStorage.getItem("playersInfo"));
}

if(!playersInfo) {

    const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`, {compress: true}); 
    const data = await res.json();
    if(browser) {
        localStorage.setItem("playersInfo", JSON.stringify(data))
    }

}

//console.log(JSON.parse(localStorage.getItem("playersData")));