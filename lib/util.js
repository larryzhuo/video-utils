"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class Util {
    md5(param) {
        const m = crypto_1.default.createHash('md5');
        m.update(param);
        const str = m.digest('hex');
        return str.toUpperCase();
    }
}
const util = new Util();
exports.default = util;
//# sourceMappingURL=util.js.map