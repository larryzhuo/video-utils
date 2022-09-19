import cmdIns, { ICmdRun } from "./cmd";
import logger from './log/log';
import util from "./util";
import fs from 'fs';


export interface IGetFrameOption {
  retType: 'path' | 'buffer';   //返回类型
  videoUrl: string;   //文件路径 
  time?: string;   //截帧时间点  00:00:01
  outdir: string;   //保存路径
}

/**
 * 依赖于 ffmpeg，ffprobe 处理视频
 */
export class VideoUtil {
  constructor() {

  }

  /**
   * 通过 ffprobe 获得视频信息
   * @param videoUrl 
   */
  async getVideoInfo(videoUrl:string) {
    if(!videoUrl) {
      throw new Error(`videoUrl 空`);
    }
    try {
      let ret:ICmdRun = await cmdIns.run('ffprobe', ['-show_format', '-print_format', 'json', '-i', videoUrl]);
      logger.info(`output:`, ret.out);
      //解析 ret output，读取信息
      let retJson = JSON.parse(ret.out);
      return retJson;
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }

  /**
   * 通过 ffmpeg 获得视频截帧
   * 返回值： 文件路径 或者 Buffer
   */
  async getVideoFrame(opts:IGetFrameOption) {
    let {videoUrl, retType, time, outdir} = opts;
    if(!videoUrl) {
      throw new Error(`videoUrl 空`);
    }
    time = time || '00:00:01';

    let outFile = outdir + util.md5(videoUrl) + '.png';
    try {
      let ret:ICmdRun = await cmdIns.run('ffmpeg', ['-i', videoUrl, '-ss', time, '-frames:v', '1', outFile]);
      logger.info(`output:`, ret.out);
      if(retType == 'path') {
        return outFile;
      }

      if(retType == 'buffer') {
        return fs.promises.readFile(outFile);
      }
    } catch(e) {
      logger.error(e);
      throw e;
    }
  }
}