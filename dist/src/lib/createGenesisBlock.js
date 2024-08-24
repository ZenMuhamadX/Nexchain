"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGenesisBlock = void 0;
var Block_1 = require("../model/Block");
var createGenesisBlock = function () {
    return new Block_1.Block(0, '2024-01-01T00:00:00Z', [{ amount: 0, recipient: '', sender: '', id: 0, message: 'Genesis Block' }], '');
};
exports.createGenesisBlock = createGenesisBlock;
