import { rosterDatas, leagueDatas, userDatas } from '../util/helper.js';

//var x = createOwnerAvatarImage('861092508472578048');
var userData = userDatas;
console.log(userData);
let user = userData.find(x => x.user_id === '861092508472578048');
console.log(user.display_name);