function getTeamPicks(user_id, year) {
    var grid = document.querySelectorAll(`[data-grid-year="${year}"]`)[0];
    var user_image = grid.querySelectorAll(`[data-userid="${user_id}"]`)[0];
    var user_container = user_image.parentNode.parentNode;
    var selected_element_list = grid.querySelectorAll(`[data-picked-by-user="${user_id}"]`);
    var element_list = grid.querySelectorAll(`[data-picked-by-user]`);
    var user_image_list = grid.querySelectorAll(`[data-userid]`);

    for(let team_image of user_image_list){
        var parent = team_image.parentNode.parentNode;
        if(parent.classList.contains("custom-highlighted-team")) {
            parent.classList.remove("custom-highlighted-team");
            parent.classList.add("custom-revert-item");
            team_image.classList.remove("custom-highlighted-icon");
        }
    }
    
    for(let element of element_list) {
        var grid_element = element.parentNode;

        if(grid_element.classList.contains("custom-highlighted-item") || grid_element.classList.contains("custom-unhighlighted-item")){
            grid_element.classList.remove("custom-highlighted-item");
            grid_element.classList.remove("custom-unhighlighted-item");
            grid_element.classList.add("custom-revert-item");
            user_image.classList.remove("custom-highlighted-icon");
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
                user_image.classList.add("custom-highlighted-icon");
            }
        }
        else {
            grid_element.classList.remove("custom-highlighted-item");
            grid_element.classList.remove("custom-unhighlighted-item");
            grid_element.classList.add("custom-revert-item");

            if(user_container.classList.contains("custom-highlighted-team")){
                user_container.classList.remove("custom-highlighted-team");
                user_image.classList.remove("custom-highlighted-icon");
            }
        }
    }
}

function toggleGraph(year) {
    var graph = document.getElementById(`${year}_scatter`);
    if(graph.classList.contains("custom-none-display"))
        graph.classList.remove("custom-none-display");
    else
        graph.classList.add("custom-none-display");
}