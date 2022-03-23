const Web3 = require('web3');

class CheckTransaction {
    web3;
    account;

    constructor(bed45669148c46ebb911331c0e36c602, account) {
        // //Kết nốt infura, điền id inkeby project https://rinkeby.infura.io/v3/bed45669148c46ebb911331c0e36c602
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + bed45669148c46ebb911331c0e36c602));
        this.account = account.toLowerCase();
    }

    async checkBlock() {
        let block = await this.web3.eth.getBlock('latest');
        let number = block.number;
        console.log('Searching block ' + number);

        if (block != null && block.transactions != null) {
            for (let txHash of block.transactions) {
                let tx = await this.web3.eth.getTransaction(txHash);
                if (this.account == tx.to.toLowerCase()) {
                    console.log('Transaction found on block: ' + number);
                    console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                }
            }
        }
    }
    
}
let txChecker = new CheckTransaction(process.env.INFURA_ID, '0x4B74F14d61D02fA9fc8D545945B9e6cC20fEBAeC'); 
setInterval(() => {
    txChecker.checkBlock();
}, 15 * 1000);

//lệnh gọi check node CheckTs.js
