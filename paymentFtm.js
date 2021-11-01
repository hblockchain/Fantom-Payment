const Web3 = require('web3');
const Common = require('ethereumjs-common')
const EthereumTx = require('ethereumjs-tx').Transaction;
const txDecoder = require('ethereum-tx-decoder')



async function asyncCall() {

    const ftmNetwork = 'https://xapi.testnet.fantom.network/lachesis';

    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(ftmNetwork));
        console.log("Connection Successfull!");
        console.log("Latest Block Number: ");
        await web3.eth.getBlockNumber().then(console.log);



        const customCommon = Common.default.forCustomChain(
            1,
            {
                name: 'testnet',
                networkId: 4002,
                chainId: 4002,
            },
            'petersburg',
        )

        // We pass our custom Common object whenever we create a transaction

        ////////////////////////////////////////////////////////////////////
        web3.eth.getGasPrice().then(async (result) => {
            console.log('gasPrice is : ' + Number(result));
            const gasPriceCoefficient = 1; // 100 % by default
            const gasPrice = gasPriceCoefficient * Number(result);
            const amount = Number(web3.utils.toWei('0.7', 'ether')); // FTM in our case
            //const gasPriceValue = gasPrice_multi; // 20000000000 is working 
            const from = 'FROM_ADDRESS';
            const to = 'TO_ADDRESS';


            const nonce = await web3.eth.getTransactionCount(
                from,
                'pending'
            );

            // to estimate gasPriceLimit
            const t = {
                nonce: web3.utils.toHex(nonce),             // Replace by nonce for your account on geth node
                gasPrice: gasPrice, // 1504405500*2,// Number(result), // 10000000000,   // maximum price of gas you are willing to pay for this transaction
                to: to,
                value: amount,
            };

            // automate gasPriceLimit
            const gasPriceLimit = await web3.eth.estimateGas(t);

            console.log('gasPriceLimit estimation: ' + gasPriceLimit);

            const txParams = {
                nonce: web3.utils.toHex(nonce),             // Replace by nonce for your account on geth node
                gasPrice: gasPrice, // 1504405500*2,// Number(result), // 10000000000,   // maximum price of gas you are willing to pay for this transaction
                gasLimit: gasPriceLimit,      // maximum gas you are willing to pay for this transaction
                to: to,
                value: amount,
            };


            // Transaction is created
            const tx = new EthereumTx(
                txParams
                ,
                { common: customCommon }
            );
            const privKey = Buffer.from(
                'PRIVATE_KEY_OF_FROM_ADDRESS',
                'hex',
            );

            // Transaction is signed
            tx.sign(privKey);
            const serializedTx = tx.serialize();
            const rawTx = '0x' + serializedTx.toString('hex');
            console.log(txDecoder.decodeTx(rawTx));


            web3.eth.sendSignedTransaction(rawTx, function (err, hash) {
                if (!err) {

                    console.log(hash); 

                } else {
                    console.log(err)
                }
            });

        })

    }
    catch (e) {
        console.log("Connection Error!", e);
    }



}

asyncCall();