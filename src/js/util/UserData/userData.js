import { users, rosters } from '../initData.js';

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
    else if (user.avatar)
    {
        const altURL = "https://sleepercdn.com/avatars/thumbs/" + user.avatar;
        var img = document.createElement("img");
        img.setAttribute('src', altURL);
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

export function getUserByName(teamName) {
    let userId = "";

    for(let i = 0; i < userData.length; i++)
    {
        if(userData[i].metadata.team_name != undefined)
        {
            if(userData[i].metadata.team_name.toString().trim() == teamName.toString().trim())
            {
                return userData[i].user_id.toString();
            }
        }
        else
        {
            if(userData[i].display_name.toString().trim() == teamName.toString().trim())
            {
                return userData[i].user_id.toString();
            }
        }
    }
}

export function getRosterByUserId(userId) {

    let roster = rosters.find(x => x.owner_id === userId.toString());

    return roster.roster_id;
}