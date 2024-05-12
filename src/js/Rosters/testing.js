import { rosterDatas, leagueDatas, userDatas } from '../util/helper.js';

let userData;
userDatas.then((result) => {
    userData = result;
  }).catch((error) => {
    console.error('Error:', error);
  });

console.log(userData);

let user = userData.find(x => x.user_id === '861092508472578048');
console.log(user.display_name);

//var x = createOwnerAvatarImage('861092508472578048');

