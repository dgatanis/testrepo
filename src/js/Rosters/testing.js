import { rosterDatas, leagueDatas, userDatas } from '../util/helper.js';

var x = await userDatas;

x.then((value) => {
    // var userData;
    // userData = value;
    console.log(value);

    // let user = userData.find(x => x.user_id === '861092508472578048');
    // console.log(user.display_name);
  }).catch((error) => {
    console.error('Error:', error);
  });
//var x = createOwnerAvatarImage('861092508472578048');

