const rosterDataStorage = localStorage.getItem("RosterData");
var rosterData = JSON.parse(rosterDataStorage); 
const userDataStorage = localStorage.getItem("UserData");
var userData = JSON.parse(userDataStorage);
const matchupWeekStorage = sessionStorage.getItem("MatchupData");
var matchupData = JSON.parse(matchupWeekStorage); 
const playerDataStorage = localStorage.getItem("PlayerData");
var playerData = JSON.parse(playerDataStorage); 


export function adder(x, y) {
    return x + y;
}

export function subtract(x, y) {
    return x - y;
}

function createOwnerAvatarImage(userId) { 

    let user = userData.find(x => x.user_id === userId);
    const avatarURL = user.metadata.avatar;
    
    if(avatarURL)
    {
        var img = document.createElement("img");
        img.setAttribute('src', avatarURL);
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    else
    {
        var img = document.createElement("img");
        img.setAttribute('src', '../src/static/images/trashcan.png');
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    return img;
}