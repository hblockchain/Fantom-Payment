// import { bufferToHex, privateToAddress } from 'ethereumjs-util'
const Web3 = require('web3');
const Common = require('ethereumjs-common')
const EthereumTx = require('ethereumjs-tx').Transaction;
const Util = require('ethereumjs-util')
const txDecoder = require('ethereum-tx-decoder')
// const bufferToHex = require('bufferToHex')


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
            nonce: 0,             // Replace by nonce for your account on geth node
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
                '206f93b244cc707d21bfc64eb574aff75e2e41a22de7c06dc8ab8ab33dd1ec92',
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
        ////////////////////////////////////////////////////////////////////

        // const tx = new EthereumTx(
        //     {
        //         nonce: 0,
        //         gasPrice: 100,
        //         gasLimit: 1000000000,
        //         value: 100000,
        //     },
        //     { common: customCommon },
        // )

        // // Once we created the transaction using the custom Common object, we can use it as a normal tx.

        // // Here we sign it and validate its signature
        // // const privateKey = new Buffer(
        // //     'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
        // //     'hex',
        // // )

        // const privateKey = Buffer.from(
        //     '206f93b244cc707d21bfc64eb574aff75e2e41a22de7c06dc8ab8ab33dd1ec92',
        //     'hex',
        // );

        // tx.sign(privateKey)

        // if (
        //     tx.validate() &&
        //     Util.bufferToHex(tx.getSenderAddress()) === Util.bufferToHex(Util.privateToAddress(privateKey))
        // ) {
        //     console.log('Valid signature')
        // } else {
        //     console.log('Invalid signature')
        // }

        // console.log("The transaction's chain id is", tx.getChainId())

        // const txData = {
        //     nonce: '0x00',
        //     gasPrice: '0x09184e72a000',
        //     gasLimit: '0x2710',
        //     to: '0x23A027E18EDb3Be53f882b7EAF0F984489619908',
        //     value: 10000,
        //     data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
        //     v: '0x1c',
        //     r: '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
        //     s: '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
        // }

        // tx.Transaction(txData)

    }
    catch (e) {
        console.log("Connection Error!", e);
    }


}

asyncCall();