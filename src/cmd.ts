import {spawn, SpawnOptionsWithoutStdio} from 'child_process';
import logger from './log/log';
import { Buffer } from 'buffer';

export interface ICmdRun {
  out:string;
  err:string;
}

class Cmd {
  constructor() {

  }

  run(cmd:string, args?: ReadonlyArray<string>, opts?: SpawnOptionsWithoutStdio | undefined):Promise<ICmdRun> {
    let ps = spawn(cmd, args, opts);

    return new Promise((resolve:any, reject:any) => {
      let out:Buffer;
      let errBuf:Buffer;

      ps.stdout.on('data', (data) => {
        // logger.info('out:', data.toString());
        if(!out) {
          out = data;
        } else {
          out = Buffer.concat([out, data], out.length+data.length)
        }
      });

      ps.stderr.on('data', (data) => {
        // logger.info('err:', data.toString());
        if(!errBuf) {
          errBuf = data;
        } else {
          errBuf = Buffer.concat([errBuf, data], errBuf.length+data.length);
        }
      });

      ps.on('exit', (code) => {
        logger.info('exit:', code?.toString());
        let ret:ICmdRun = {
          out: out && out.toString(),
          err: errBuf && errBuf.toString()
        }
        if(code == 0) {   //成功退出
          resolve(ret);
        } else {        //失败退出
          reject(ret.err);
        }
      });
    });

  }
}

let cmdIns = new Cmd();
export default cmdIns;