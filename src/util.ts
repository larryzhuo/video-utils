import crypto from 'crypto';

class Util {

  md5(param:any) {
    let m = crypto.createHash('md5');
    m.update(param);
    let str = m.digest('hex');
    return str.toUpperCase();
  }

}

let util = new Util();
export default util;