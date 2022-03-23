const Web3 = require('web3');

class CheckTransaction {
    web3;
    web3ws;
    account;
    subscription;

    constructor(projectId, account) {
        // https://rinkeby.infura.io/v3/bed45669148c46ebb911331c0e36c602
        this.web3ws = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/v3/bed45669148c46ebb911331c0e36c602' + projectId));
        this.web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/bed45669148c46ebb911331c0e36c602' + projectId));
        this.account = account.toLowerCase();
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    watchTs() {
        console.log('All pending transactions');
        this.subscription.on('data', (txHash) => {
            setTimeout(async () => {
                try {
                    let tx = await this.web3.eth.getTransaction(txHash);
                    if (tx != null) {
                        if (this.account == tx.to.toLowerCase()) {
                            console.log({address: tx.from, value: this.web3.utils.fromWei(tx.value, 'ether'), timestamp: new Date()});
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }, 60000)
        });
    }
}

let txChecker = new CheckTransaction(process.env.INFURA_ID, '0x4B74F14d61D02fA9fc8D545945B9e6cC20fEBAeC');
txChecker.subscribe('pendingTransactions');
txChecker.watchTs();

//lệnh gọi check node CheckTs2.js