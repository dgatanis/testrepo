function getTeamPicks(user_id, year) {
    var grid = document.querySelectorAll(`[data-grid-year="${year}"]`)[0];
    var user_image = grid.querySelectorAll(`[data-userid="${user_id}"]`)[0];
    var user_container = user_image.parentNode;
    var selected_element_list = grid.querySelectorAll(`[data-picked-by-user="${user_id}"]`);
    var element_list = grid.querySelectorAll(`[data-picked-by-user]`);
    var user_image_list = grid.querySelectorAll(`[data-userid]`);

    for(let team_image of user_image_list){
        var parent = team_image.parentNode
        if(parent.classList.contains("custom-highlighted-team")) {
            parent.classList.remove("custom-highlighted-team");
            parent.classList.add("custom-revert-item");
        }
    }
    
    for(let element of element_list) {
        var grid_element = element.parentNode;

        if(grid_element.classList.contains("custom-highlighted-item") || grid_element.classList.contains("custom-unhighlighted-item")){
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

            if(!user_container.classList.contains("custom-highlighted-team")){
                user_container.classList.add("custom-highlighted-team");
            }
        }
        else {
            grid_element.classList.remove("custom-highlighted-item");
            grid_element.classList.remove("custom-unhighlighted-item");
            grid_element.classList.add("custom-revert-item");

            if(user_container.classList.contains("custom-highlighted-team")){
                user_container.classList.remove("custom-highlighted-team");
            }
        }
    }
}