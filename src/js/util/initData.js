async function initRosterData() {
    const dataStorage = localStorage.getItem("RosterData");

    if(!dataStorage)
    {       
        try {
            const dataRes = await waitForLocalStorageItem("RosterData");

            var data = JSON.parse(dataRes);

            return data;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(dataStorage);
    }
}

async function initLeagueData() {
    const dataStorage = localStorage.getItem("LeagueData");

    if(!dataStorage)
    {   
        try {
            const dataRes = await waitForLocalStorageItem("LeagueData");

            var data = JSON.parse(dataRes);

            return data;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(dataStorage);
    }
}

async function initUserData() {
    const dataStorage = localStorage.getItem("UserData");

    if(!dataStorage)
    {   
        try {
            const dataRes = await waitForLocalStorageItem("UserData");

            var data = JSON.parse(dataRes);

            return data;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(dataStorage);
    }
}

async function initPlayerData() {
    const dataStorage = localStorage.getItem("PlayerData");

    if(!dataStorage)
    {   
        try {
            const dataRes = await waitForLocalStorageItem("PlayerData");

            var data = JSON.parse(dataRes);

            return data;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(dataStorage);
    }
}

async function initPlayoffData() {
    const dataStorage = localStorage.getItem("PlayoffData");

    if(!dataStorage)
    {   
        try {
            const dataRes = await waitForLocalStorageItem("PlayoffData");

            var data = JSON.parse(dataRes);

            return data;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(dataStorage);
    }
}

async function initMatchupData() {
    const dataStorage = sessionStorage.getItem("MatchupData");

    if(!dataStorage)
    {   
        try {
            const dataRes = await waitForSessionStorageItem("MatchupData");

            var data = JSON.parse(dataRes);

            return data;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(dataStorage);
    }
}

async function initATLeagueIdData() {

    const dataStorage = localStorage.getItem("ATLeagueIds");

    if(!dataStorage)
    {   
        try {
            const dataRes = await waitForLocalStorageItem("ATLeagueIds");

            var data = JSON.parse(dataRes);

            return data;

        } catch (error) {
            console.error('Error loading or executing script:', error);
        }
    }
    else
    {
        return JSON.parse(dataStorage);
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

function waitForSessionStorageItem(key) {
    return new Promise((resolve) => {
        const checkSessionStorage = () => {
            const item = sessionStorage.getItem(key);
            if (item !== null) {
                resolve(item);
            } else {
                setTimeout(checkSessionStorage, 100); // Check again in 100 milliseconds
            }
        };
        checkSessionStorage();
    });
}

const rosters = await initRosterData();
const league = await initLeagueData();
const users = await initUserData();
const players = await initPlayerData();
const playoffs = await initPlayoffData();
const matchups = await initMatchupData();
const allTimeLeagueIds = await initATLeagueIdData();

export { 
    rosters, 
    league,
    users,
    players,
    playoffs,
    matchups,
    allTimeLeagueIds
};