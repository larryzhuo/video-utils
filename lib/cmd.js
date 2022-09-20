"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const log_1 = __importDefault(require("./log/log"));
class Cmd {
    run(cmd, args, opts) {
        const ps = (0, child_process_1.spawn)(cmd, args, opts);
        return new Promise((resolve, reject) => {
            let out;
            let errBuf;
            ps.stdout.on('data', (data) => {
                // logger.info('out:', data.toString());
                if (!out) {
                    out = data;
                }
                else {
                    out = Buffer.concat([out, data], out.length + data.length);
                }
            });
            ps.stderr.on('data', (data) => {
                // logger.info('err:', data.toString());
                if (!errBuf) {
                    errBuf = data;
                }
                else {
                    errBuf = Buffer.concat([errBuf, data], errBuf.length + data.length);
                }
            });
            ps.on('exit', (code) => {
                log_1.default.info('exit:', code === null || code === void 0 ? void 0 : code.toString());
                const ret = {
                    out: out && out.toString(),
                    err: errBuf && errBuf.toString(),
                };
                if (code == 0) {
                    // 成功退出
                    resolve(ret);
                }
                else {
                    // 失败退出
                    reject(ret.err);
                }
            });
        });
    }
}
const cmdIns = new Cmd();
exports.default = cmdIns;
//# sourceMappingURL=cmd.js.map