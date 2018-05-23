const SHA256 = require('crypto-js/sha256')
//Start by defining what a block on this blockchain will be like

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        //data can contain any kind of data, in case of a cryptocurrency it will contain the transaction details.
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        //Takes in the properties and creates a string based on them
        //We can use the sha 256 algorithm, but for that we import crypto-js as it isn't built in into JS
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined..Hash: " + this.hash + " at Nonce Value: " + this.nonce);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2018", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()) return false;

            if(currentBlock.previousHash != previousBlock.hash) return false;
        }
        
        return true;
    }
}

// let w7coin = new Blockchain();
// console.log('Mining Block 1...');
// w7coin.addBlock(new Block(1, "18/05/2018", {amount: 4}));
// console.log('Mining Block 2...');
// w7coin.addBlock(new Block(2, "19/05/2018", {amount: 10}));
// console.log('Mining Block 3...');
// w7coin.addBlock(new Block(3, "22/05/2018", {amount: 14}));
// console.log('Mining Block 4...');
// w7coin.addBlock(new Block(4, "23/05/2018", {amount: 43}));


//console.log(JSON.stringify(w7coin, null, 4));

//console.log("Is Blockchain Valid?  " + w7coin.isChainValid());

let w7coin = new Blockchain();
w7coin.createTransaction(new Transaction("addr1", "addr2", 500));
w7coin.createTransaction(new Transaction("addr2", "addr1", 50));
w7coin.createTransaction(new Transaction("addr2", "addr3", 100));
console.log("Mining Block 1\n")
w7coin.minePendingTransactions('madhurw7');

console.log("Madhur's balance is: " + w7coin.getBalanceOfAddress('madhurw7') );
console.log("Mining Block 2\n")
w7coin.minePendingTransactions('madhurw7');
console.log("Madhur's balance is: " + w7coin.getBalanceOfAddress('madhurw7') );