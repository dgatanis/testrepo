//Custom mobile navigation 
function toggleMobileMenu() {
    var mobileLinks = document.getElementById("mobileLinks");
    var leagueLogo = document.getElementById("league-logo-mobile");

    if (mobileLinks.classList.value === "custom-mobile-show") {
        mobileLinks.setAttribute('class', 'custom-mobile-hide');


    } else {
        mobileLinks.setAttribute('class', 'custom-mobile-show');
    }

    if(leagueLogo.classList.contains("custom-fade-in"))
    {
        leagueLogo.classList.remove('custom-fade-in');
    }
    else
    {
        leagueLogo.classList.add('custom-fade-in');
    }
}