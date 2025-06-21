import sha256 from 'crypto-js/sha256.js';

class Block {
    constructor(index, timestamp, transactions, prevHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.nonce = 0;
        this.hash = this.calcHash();
    }

    calcHash() {
        return sha256(
            this.index + this.timestamp + this.prevHash +
            JSON.stringify(this.transactions) + this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            this.nonce++;
            this.hash = this.calcHash();
        }
    }
}

export default Block;
