import getPlayers from '../util/GetPlayers.js';
if(localStorage.getItem("playersData"))
{
    console.log("already here")}
else
{
    localStorage.setItem("playersData", getPlayers());
}

console.log(JSON.parse(localStorage.getItem("playersData")));