//Custom mobile navigation 
function toggleMobileMenu() {
    var x = document.getElementById("mobileLinks");
    if (x.style.visibility === "visible") {
        x.setAttribute('class', 'custom-mobile-hide');
    } else {
        x.setAttribute('class', 'custom-mobile-show');
    }
}