import { 
    setLinkSource,
    removeSpinner,
    setLeagueName,
    setDarkMode
} from '../util/helper.js';


loadContents();

//This loads the page contents dynamically
async function loadContents() {
    setDarkMode();
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