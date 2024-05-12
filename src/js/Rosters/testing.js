import { rosterDatas, leagueDatas, userDatas } from '../util/helper.js';

var userData;
userDatas.then((value) => {
    userData = value;
  }).catch((error) => {
    console.error('Error:', error);
  });
//var x = createOwnerAvatarImage('861092508472578048');
console.log(userData);
let user = userData.find(x => x.user_id === '861092508472578048');
console.log(user.display_name);