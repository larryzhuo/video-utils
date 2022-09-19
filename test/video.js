let {VideoUtil} = require('../lib/index.js');

let videoUtilIns = new VideoUtil();

(async function tt() {
  // let ret = await videoUtilIns.getVideoInfo('/Users/apple/Desktop/48c0345c87d6149127dabb7c9b5c3de0-1661482184103.mp4')
  let ret = await videoUtilIns.getVideoFrame({
    retType: 'path',
    videoUrl: '/Users/apple/Desktop/48c0345c87d6149127dabb7c9b5c3de0-1661482184103.mp4'
  });
  console.log(ret);
})();