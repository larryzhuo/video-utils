"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoUtil = void 0;
const cmd_1 = __importDefault(require("./cmd"));
const log_1 = __importDefault(require("./log/log"));
const util_1 = __importDefault(require("./util"));
const fs_1 = __importDefault(require("fs"));
/**
 * 依赖于 ffmpeg，ffprobe 处理视频
 */
class VideoUtil {
    /**
     * 通过 ffprobe 获得视频信息
     * @param videoUrl
     */
    async getVideoInfo(videoUrl) {
        if (!videoUrl) {
            throw new Error(`videoUrl 空`);
        }
        try {
            const ret = await cmd_1.default.run('ffprobe', [
                '-show_format',
                '-print_format',
                'json',
                '-i',
                videoUrl,
            ]);
            log_1.default.info(`output:`, ret.out);
            // 解析 ret output，读取信息
            const retJson = JSON.parse(ret.out);
            return retJson;
        }
        catch (e) {
            log_1.default.error(e);
            throw e;
        }
    }
    /**
     * 通过 ffmpeg 获得视频截帧
     * 返回值： 文件路径 或者 Buffer
     */
    async getVideoFrame(opts) {
        const { videoUrl, retType, outdir } = opts;
        let { time } = opts;
        if (!videoUrl) {
            throw new Error(`videoUrl 空`);
        }
        time = time || '00:00:01';
        const outFile = `${outdir + util_1.default.md5(videoUrl)}.png`;
        try {
            const ret = await cmd_1.default.run('ffmpeg', [
                '-i',
                videoUrl,
                '-ss',
                time,
                '-frames:v',
                '1',
                outFile,
            ]);
            log_1.default.info(`output:`, ret.out);
            if (retType == 'path') {
                return outFile;
            }
            if (retType == 'buffer') {
                return fs_1.default.promises.readFile(outFile);
            }
        }
        catch (e) {
            log_1.default.error(e);
            throw e;
        }
    }
}
exports.VideoUtil = VideoUtil;
//# sourceMappingURL=video_util.js.map