"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBlockHash = void 0;
var node_crypto_1 = __importDefault(require("node:crypto"));
var generateBlockHash = function (index, timestamp, Tx, previousHash) {
    var hash = node_crypto_1.default.createHash('sha256');
    hash.update("".concat(index, "-").concat(timestamp, "-").concat(Tx, "-").concat(previousHash));
    return hash.digest('hex');
};
exports.generateBlockHash = generateBlockHash;
