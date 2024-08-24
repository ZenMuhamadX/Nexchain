"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TxPool = void 0;
var TxPool = /** @class */ (function () {
    function TxPool() {
        this.pendingTx = [];
    }
    TxPool.prototype.addTx = function (tx) {
        this.pendingTx.push(tx);
    };
    TxPool.prototype.getPendingTx = function () {
        return this.pendingTx;
    };
    TxPool.prototype.clear = function () {
        this.pendingTx = [];
    };
    return TxPool;
}());
exports.TxPool = TxPool;
