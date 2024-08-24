"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
var generateHash_1 = require("../lib/generateHash");
// models/Block.ts
var Block = /** @class */ (function () {
    function Block(index, timestamp, transactions, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = (0, generateHash_1.generateBlockHash)(index, timestamp, transactions, previousHash);
    }
    Block.prototype.getTransactions = function () {
        return this.transactions;
    };
    return Block;
}());
exports.Block = Block;
