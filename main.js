const SHA256 = require('crypto-js/sha256');

class Block {
    /*
    index- optional param tells position of block on the chain
    timestamp - holds the date of creation of the block
    data - details of the transaction
    previousHash - string of the previous block hash
     */
    constructor(index, timestamp, data, previousHash = 0) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /*
    Uses the imported SHA256 func.
     */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        // trick
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();

        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.diffiuclty = 4;
    }

    createGenesisBlock() {
        return new Block(0, "27/02/2017", "Genesis", "-1");
    }

    //returns the last element on the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    //adds new block on the chain
    addBlock(newBlock) {
        //sets the previous hash of the new block to the last block on the chain
        newBlock.previousHash = this.getLatestBlock().hash;
        //recalculate its hash - every time a block property gets changed, we must rehash the block
        //newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.diffiuclty)
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            //is the hash of the current block not equal to current hash
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let smolyCoin = new Blockchain();


console.log('Mining block 1...');
smolyCoin.addBlock(new Block(1, "28/02/2017", {amount: 2}));
console.log('Mining block 2...');
smolyCoin.addBlock(new Block(1, "28/02/2017", {amount: 2}));

