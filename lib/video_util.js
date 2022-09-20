"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoUtil = void 0;
const cmd_1 = __importDefault(require("./cmd"));
const log_1 = __importDefault(require("./log/log"));
const util_1 = __importDefault(require("./util"));
const fs_1 = __importDefault(require("fs"));
const os = __importStar(require("os"));
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
        const { videoUrl } = opts;
        let { time, retType, outdir } = opts;
        if (!videoUrl) {
            throw new Error(`videoUrl 空`);
        }
        time = time || '00:00:01';
        retType = retType || 'buffer';
        outdir = outdir || os.homedir();
        const fileName = `${util_1.default.md5(videoUrl)}.png`;
        const outFile = `${outdir}/${fileName}`;
        const frameRet = {
            fileName,
        };
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
                frameRet.path = outFile;
                return frameRet;
            }
            if (retType == 'buffer') {
                frameRet.buf = await fs_1.default.promises.readFile(outFile);
                fs_1.default.promises.rm(outFile);
                return frameRet;
            }
        }
        catch (e) {
            log_1.default.error(e);
            throw e;
        }
        throw new Error('retType not match');
    }
}
exports.VideoUtil = VideoUtil;
//# sourceMappingURL=video_util.js.map