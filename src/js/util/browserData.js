setBrowserData();
function setBrowserData() {
    const expiration = new Date().getTime() + (3*60*60*1000);
    const now = newDate.getTime();

    if(!localStorage.getItem("expiration"))
    {
        var expirationDate = localStorage.getItem("expiration");
        if(now < expirationDate)
        {
            localStorage.setItem("expiration", expiration);
        }
    }
}