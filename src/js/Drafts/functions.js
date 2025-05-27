function getTeamPicks(user_id) {
    var selected_element_list = document.querySelectorAll(`[data-picked-by-user="${user_id}"]`);
    var element_list = document.querySelectorAll(`[data-picked-by-user]`);
    
    for(let element of element_list) {
        var grid_element = element.parentNode;

        if(grid_element.classList.contains("custom-highlighted-item" || grid_element.classList.contains("custom-unhighlighted-item"))){
            grid_element.classList.remove("custom-highlighted-item");
            grid_element.classList.remove("custom-unhighlighted-item");
            grid_element.classList.add("custom-revert-item");
        }
        else {
            grid_element.classList.add("custom-unhighlighted-item");
        }
    }

    for(let element of selected_element_list) {
        var grid_element = element.parentNode;

        if(grid_element.classList.contains("custom-unhighlighted-item")) {
            grid_element.classList.add("custom-highlighted-item");
            grid_element.classList.add("custom-revert-item");
            grid_element.classList.remove("custom-unhighlighted-item");
        }
        else {
            grid_element.classList.remove("custom-highlighted-item");
            grid_element.classList.remove("custom-unhighlighted-item");
            grid_element.classList.add("custom-revert-item");
        }
    }
}