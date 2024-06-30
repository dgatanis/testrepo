import { users } from '../initData.js';

var userData = users;

export function createOwnerAvatarImage(userId, page = null) { 

    let user = userData.find(x => x.user_id === userId);
    const avatarURL = user.metadata.avatar;
    
    if(avatarURL)
    {
        var img = document.createElement("img");
        img.setAttribute('src', avatarURL);
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);
    }
    else
    {
        var img = document.createElement("img");
        img.setAttribute('class', "custom-medium-avatar");
        img.setAttribute('data-userid', user.user_id);

        if(page && page.toString().toLowerCase() == "home")
        {
            img.setAttribute('src', './src/static/images/trashcan.png');
        }
        else
        {
            img.setAttribute('src', '../src/static/images/trashcan.png');
        }
        
    }
    return img;
}

export function getTeamName(userid) {

    let user = userData.find(x => x.user_id === userid.toString());
    let userName = "";

    if(user.metadata.team_name != undefined)
    {
        userName = user.metadata.team_name;
    }
    else
    {
        userName = user.display_name;
    }

    return userName.toString();
}