import { 
    setLinkSource,
    leagueDisplayName,
    removeSpinner,
    setLeagueName
} from '../util/helper.js';


loadContents();

//This loads the page contents dynamically
async function loadContents() {

    setLeagueName("footerName");
    setLinkSource("keep-trade-cut");
    try{
        removeSpinner();
        return;
    }
    catch (error){
        console.error(`Error: ${error.message}`);
    }

}