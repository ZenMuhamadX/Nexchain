"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTimestampz = void 0;
var generateTimestampz = function () {
    var timestamp = new Date().toISOString();
    return timestamp;
};
exports.generateTimestampz = generateTimestampz;
