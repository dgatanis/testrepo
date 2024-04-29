//Custom mobile navigation 
function toggleMobileMenu() {
    var x = document.getElementById("mobileLinks");
    if (x.classList.value === "custom-mobile-show") {
        x.setAttribute('class', 'custom-mobile-hide');
    } else {
        x.setAttribute('class', 'custom-mobile-show');
    }
}