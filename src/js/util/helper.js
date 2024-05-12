
async function initRosterData() {
    try {
        const localRosterData = await waitForLocalStorageItem("RosterData");

        var rosterData = JSON.parse(localRosterData);

        return rosterData;

    } catch (error) {
        console.error('Error loading or executing script:', error);
    }
}

async function initLeagueData() {
    try {
        const localLeagueData = await waitForLocalStorageItem("LeagueData");

        var leagueData = JSON.parse(localLeagueData);

        return leagueData;

    } catch (error) {
        console.error('Error loading or executing script:', error);
    }
}

async function initUserData() {
    try {
        const localUserData = await waitForLocalStorageItem("UserData");

        var userData = JSON.parse(localUserData);

        return userData;

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
export const leagueDatas = initLeagueData();
export const userDatas = initUserData();