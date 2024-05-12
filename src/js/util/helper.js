const rosterDataStorage = localStorage.getItem("RosterData");
var rosterData = JSON.parse(rosterDataStorage); 
const userDataStorage = localStorage.getItem("UserData");
var userData = JSON.parse(userDataStorage);
const matchupWeekStorage = sessionStorage.getItem("MatchupData");
var matchupData = JSON.parse(matchupWeekStorage); 
const playerDataStorage = localStorage.getItem("PlayerData");
var playerData = JSON.parse(playerDataStorage);


async function checkBrowserData() {

    if(!rosterData || !userData || !matchupData || !playerData)
    {
        try{
            initRosterData();
        }
        catch (error){
            console.error(`Error: ${error.message}`);
        }
    }
}

async function initRosterData() {
    try {
        const localRosterData = await waitForLocalStorageItem("RosterData");

        rosterData = JSON.parse(localRosterData);

        return rosterData;

    } catch (error) {
        console.error('Error loading or executing script:', error);
    }
}

function waitForLocalStorageItem(key) {
    return new Promise((resolve) => {
        const checkLocalStorage = () => {
            const item = localStorage.getItem(key);
            if (item !== null) {
                resolve(item);
            } else {
                setTimeout(checkLocalStorage, 100); // Check again in 100 milliseconds
            }
        };
        checkLocalStorage();
    });
}

export const rosterDatas = initRosterData();


export async function createOwnerAvatarImage(userId) { 

    if(!userData)
    {
        var localUserData = await waitForLocalStorageItem("UserData");

        userData = JSON.parse(localUserData);
    }

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