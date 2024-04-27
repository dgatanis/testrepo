//Custom mobile navigation 
function toggleMobileMenu() {
    var x = document.getElementById("mobileLinks");
    if (x.style.display === "block") {
        x.style.display = "none";
        x.setAttribute('style', 'display:none;background: transparent;');
    } else {
        x.setAttribute('style', 'display:block;animation: revealLetter 1s forwards; background: rgb(97, 97, 97);');
    }
}