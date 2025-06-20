import Block from './Block.js';

class Chain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
    }

    createGenesisBlock() {
        return new Block(0, 1718880000000, [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addTransaction(transaction) {
        if (!transaction) return false;
        this.pendingTransactions.push(transaction);
        return true;
    }

    minePendingTransactions() {
        const newBlock = new Block(
            this.getLatestBlock().index + 1,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        newBlock.mineBlock(this.difficulty);

        this.chain.push(newBlock);
        this.pendingTransactions = [];
        return newBlock;
    }

    isValidChain() {
        const realGenesis = JSON.stringify(this.createGenesisBlock());
        if (JSON.stringify(this.chain[0]) !== realGenesis) return false;

        for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            if (current.hash !== current.calcHash()) return false;
            if (current.prevHash !== previous.hash) return false;
        }

        return true;
    }

    getStats() {
        let totalTransactions = this.chain.reduce((count, block) => {
            if (Array.isArray(block.transactions)) {
                return count + block.transactions.length;
            }
            return count;
        }, 0);

        return {
            chainLength: this.chain.length,
            latestBlockHash: this.getLatestBlock().hash,
            totalTransactions,
            pendingTransactions: this.pendingTransactions.length,
            totalBlocks: this.chain.length
        };
    }
}

export default Chain;
