//Custom mobile navigation 
function toggleMobileMenu() {
    var mobileLinks = document.getElementById("mobileLinks");
    var leagueLogo = document.getElementById("league-logo-mobile");
    var darkMode = document.getElementById("custom-dark-mode-image");

    if (mobileLinks.classList.value === "custom-mobile-show") {
        mobileLinks.setAttribute('class', 'custom-mobile-hide');
        darkMode.classList.remove('custom-none-display');
    } else {
        mobileLinks.setAttribute('class', 'custom-mobile-show');
        darkMode.classList.add('custom-none-display');
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