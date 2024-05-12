async function initRosterData() {
    const rosterDataStorage = localStorage.getItem("RosterData");

    if(!rosterDataStorage)
    {       
        try {
            const localRosterData = await waitForLocalStorageItem("RosterData");

            var rosterData = JSON.parse(localRosterData);

            return rosterData;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(rosterDataStorage);
    }
}

async function initLeagueData() {
    const leagueDataStorage = localStorage.getItem("LeagueData");

    if(!leagueDataStorage)
    {   
        try {
            const localLeagueData = await waitForLocalStorageItem("LeagueData");

            var leagueData = JSON.parse(localLeagueData);

            return leagueData;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(leagueDataStorage);
    }
}

async function initUserData() {
    const userDataStorage = localStorage.getItem("UserData");

    if(!userDataStorage)
    {   
        try {
            const localUserData = await waitForLocalStorageItem("UserData");

            var userData = JSON.parse(localUserData);

            return userData;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(userDataStorage);
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

const rosterDatas = await initRosterData();
const leagueDatas = await initLeagueData();
const userDatas = await initUserData();

export { 
    rosterDatas, 
    leagueDatas,
    userDatas
};