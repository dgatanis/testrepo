async function getPlayers() {
    let playersInfo = null;

    if(typeof window !== 'undefined') {
        playersInfo = JSON.parse(localStorage.getItem("playersInfo"));
    }
    
    if(!playersInfo) {
    
        const res  = await fetch(`https://api.sleeper.app/v1/players/nfl`, {compress: true}); 
        const data = await res.json();
        if(typeof window !== 'undefined') {
            localStorage.setItem("playersInfo", JSON.stringify(data))
        }
    
    }
}