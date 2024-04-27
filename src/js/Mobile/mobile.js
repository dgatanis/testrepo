//Custom mobile navigation 
function toggleMobileMenu() {
    var x = document.getElementById("mobileLinks");
    if (x.style.visibility === "visible") {
        x.setAttribute('style', 'visibility: hidden;');
    } else {
        x.setAttribute('style', 'visibility: visible;background: rgb(97, 97, 97);');
    }
}