const Web3 = require('web3');




const ftmNetwork = 'https://xapi.testnet.fantom.network/lachesis';
const myaccount = '0x543CC4A7049262167fD7128E9B954197B7B5ceDa';




async function getTransactionsByAccount(myaccount, startBlockNumber,
    endBlockNumber) {



    try {
        const startDate = new Date();

        const web3 = new Web3(new Web3.providers.HttpProvider(ftmNetwork));
        const eth = web3.eth;
        console.log("Connection Successfull!");
        console.log("Latest Block Number: ");
        await web3.eth.getBlockNumber().then(console.log);

        let viewData = {
            blockdata: []
        };

        let blockNumberList = [3071683, 3072802];
        if (endBlockNumber == null) {
            endBlockNumber = web3.eth.blockNumber;
            console.log("Using endBlockNumber: " + endBlockNumber);
        } if (
            startBlockNumber == null) {
            startBlockNumber = endBlockNumber - 1000;
            console.log("Using startBlockNumber: " + startBlockNumber);
        }

        console.log("Searching for transactions to/from account \"" +
            myaccount +
            "\" within blocks " + startBlockNumber + " and " + endBlockNumber);

        console.log('total block to scan : '+ (endBlockNumber - startBlockNumber));
        for (i = startBlockNumber; i <= endBlockNumber; i++) {
            let jsonData = {};
            const block = await eth.getBlock(i, true);
           
            if (block != null && block.transactions != null) {
                block.transactions.forEach(function (e) {
                    if (myaccount == "*" || myaccount == e.from || myaccount == e.to) {
                        
                        jsonData['tx hash'] = e.hash;
                        jsonData['nonce'] = e.nonce;
                        jsonData['blockHash'] = e.blockHash;
                        jsonData['transactionIndex'] = e.transactionIndex;
                        jsonData['from'] = e.from;
                        jsonData['to'] = e.to;
                        jsonData['value'] = e.value;
                        jsonData['gasPrice'] = e.gasPrice;
                        jsonData['gas'] = e.gas;
                        jsonData['input'] = e.input;
                        jsonData['time'] = new Date(block.timestamp * 1000).toGMTString();
                        viewData.blockdata.push(jsonData);
                    }
                })

            }
        }
        console.log(viewData);
        const endDate = new Date();
        const duration = (endDate - startDate)/1000;
        console.log('Scan done in : ' + duration + ' s');
    } catch (e) {
        console.log("Connection Error!", e);
    }
}

getTransactionsByAccount(myaccount, 3038247, 3038821); // three transactions of 0.1 FTM
 
// getTransactionsByAccount(myaccount, 3299308, 3299308); // transfer of 200 TST - No amount showing



