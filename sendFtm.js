const Web3 = require('web3');
const Common = require('ethereumjs-common')
const EthereumTx = require('ethereumjs-tx').Transaction;
const txDecoder = require('ethereum-tx-decoder')



async function asyncCall() {

    const ftmNetwork = 'https://rpc.testnet.fantom.network/';

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
        const txParams = {
            nonce: 1,             // Replace by nonce for your account on geth node
            gasPrice: 10000000000,   // maximum price of gas you are willing to pay for this transaction
            gasLimit: 21000,      // maximum gas you are willing to pay for this transaction
            to: '0x23A027E18EDb3Be53f882b7EAF0F984489619908',
            value: 10000,
        };


        // Transaction is created
        const tx = new EthereumTx(
            txParams
            ,
            { common: customCommon }
            );
        const privKey = Buffer.from(
                'PRIVATE_KEY',
                'hex',
            );

        // Transaction is signed
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        const rawTx = '0x' + serializedTx.toString('hex');
        console.log(rawTx);
        console.log(txDecoder.decodeTx(rawTx));


        web3.eth.sendSignedTransaction(rawTx, function (err, hash) {
            if (!err) {
                console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
            } else {
                console.log(err)
            }
        });
        
    }
    catch (e) {
        console.log("Connection Error!", e);
    }


}

asyncCall();