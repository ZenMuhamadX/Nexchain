"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockChains = void 0;
var createGenesisBlock_1 = require("./lib/createGenesisBlock");
var generateHash_1 = require("./lib/generateHash");
var generateTimestampz_1 = require("./lib/generateTimestampz");
var Block_1 = require("./model/Block");
var BlockChains = /** @class */ (function () {
    function BlockChains() {
        this._chains = [(0, createGenesisBlock_1.createGenesisBlock)()];
    }
    BlockChains.prototype.addTxToBlock = function (tx) {
        var newBlock = this.createBlock(tx);
        this._chains.push(newBlock);
        tx.clear();
    };
    BlockChains.prototype.getChains = function () {
        return this._chains;
    };
    BlockChains.prototype.getLatestBlock = function () {
        return this._chains[this._chains.length - 1];
    };
    BlockChains.prototype.isChainValid = function () {
        for (var i = 1; i < this._chains.length; i++) {
            var currentBlock = this._chains[i];
            var previousBlock = this._chains[i - 1];
            if (!this.isHashValid(currentBlock) ||
                !this.isPreviousHashValid(currentBlock, previousBlock) ||
                !this.isIndexValid(currentBlock, previousBlock)) {
                return false;
            }
        }
        return true;
    };
    BlockChains.prototype.createBlock = function (tx) {
        var latestBlock = this.getLatestBlock();
        return new Block_1.Block(this._chains.length, (0, generateTimestampz_1.generateTimestampz)(), tx.getPendingTx(), latestBlock.hash);
    };
    BlockChains.prototype.isHashValid = function (currentBlock) {
        var calculatedHash = (0, generateHash_1.generateBlockHash)(currentBlock.index, currentBlock.timestamp, currentBlock.getTransactions(), currentBlock.previousHash);
        if (currentBlock.hash !== calculatedHash) {
            return false;
        }
        return true;
    };
    BlockChains.prototype.isPreviousHashValid = function (currentBlock, previousBlock) {
        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
        return true;
    };
    BlockChains.prototype.isIndexValid = function (currentBlock, previousBlock) {
        if (currentBlock.index !== previousBlock.index + 1) {
            return false;
        }
        return true;
    };
    return BlockChains;
}());
exports.BlockChains = BlockChains;
