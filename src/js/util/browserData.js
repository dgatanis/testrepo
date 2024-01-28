setBrowserData();
function setBrowserData() {
    const expiration = new Date().getTime() + (3*60*60*1000);
    const now = new Date().getTime();

    if(!localStorage.getItem("expiration"))
    {
        localStorage.setItem("expiration", expiration);
        console.log("setExpiration");
    }
    else
    {
        var expirationDate = localStorage.getItem("expiration");
        if(now < expirationDate)
        {
            localStorage.setItem("expiration", expiration);
            console.log("setExpiration");
        }
    }
}