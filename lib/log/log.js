"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js = require('log4js');
log4js.configure({
    appenders: { video: { type: 'file', filename: 'video.log' } },
    categories: { default: { appenders: ['video'], level: 'info' } },
});
const logger = log4js.getLogger('video');
exports.default = logger;
//# sourceMappingURL=log.js.map