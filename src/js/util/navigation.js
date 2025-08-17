function toggleDarkMode() {
    var darkModeImages = document.getElementsByClassName("custom-dark-mode-image");
    if(localStorage.getItem("DarkMode")) {
        var isDarkMode = localStorage.getItem("DarkMode");
        if(isDarkMode == 'N') {
            localStorage.setItem("DarkMode", "Y");
            document.body.classList.add('custom-dark-mode');
            for(var image of darkModeImages){
                image.classList.add("custom-dark-mode-background");
                image.classList.remove("custom-light-mode-background");
            }
        }
        else {
            localStorage.setItem("DarkMode", "N");
            document.body.classList.remove('custom-dark-mode');
            for(var image of darkModeImages){
                image.classList.remove("custom-dark-mode-background");
                image.classList.add("custom-light-mode-background");
            }
        }
    }
    else {
        localStorage.setItem("DarkMode", "Y");
        document.body.classList.add('custom-dark-mode');
        for(var image of darkModeImages){
            image.classList.remove("custom-dark-mode-background");
            image.classList.add("custom-light-mode-background");
        }
    }
    
}