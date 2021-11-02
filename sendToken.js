
const { ERC20Abi } = require('./ERC20Abi.json');
const { tokenAbi } = require('./abi.json');
const Web3 = require('web3');
const Common = require('ethereumjs-common')
const EthereumTx = require('ethereumjs-tx').Transaction;
const txDecoder = require('ethereum-tx-decoder');





async function asyncCall() {

    
    const ftmNetwork = 'https://xapi.testnet.fantom.network/lachesis';


    try {
        const web3 = new Web3(new Web3.providers.HttpProvider(ftmNetwork));
        console.log("Connection Successfull!");
        console.log("Latest Block Number: ");
        await web3.eth.getBlockNumber().then(console.log);
        const tokenAddress = 'CONTRACT_TOKEN_ADDRESS';
        const customCommon = Common.default.forCustomChain(
            1,
            {
                name: 'testnet',
                networkId: 4002,
                chainId: 4002,
            },
            'petersburg',
        )


        const contractAbi = [
            {
                // PUT ABI HERE
            }
        ];

        const from = ''; // address of the provide private key
        const to = ''; // address of the receip


        const token = new web3.eth.Contract(
            contractAbi,
            tokenAddress
          ,
        );

        // await token.methods.balanceOf(from).call().then(console.log);
       



        ///////////////////////////////////////////////////////////////////////////
        web3.eth.getGasPrice().then(async (result) => {
            console.log('gasPrice is : ' + Number(result));
            const gasPriceCoefficient = 1; // 100 % by default
            const gasPrice = gasPriceCoefficient * Number(result);
            const nonce = await web3.eth.getTransactionCount(
                from,
                'pending'
            );

            const tokenDecimal = 1e9;
            const tokenAmount = tokenDecimal * 50; // will send 200 token
            const txParams = {
                from: from,
                nonce: web3.utils.toHex(nonce),
                to: "CONTRACT_ADDRES_TO_PUT_HERE",
                gas: 100000,
                value: "0x0",
                data: token.methods.transfer(to,
                    web3.utils.toHex(tokenAmount)).encodeABI(),
                gasPrice: gasPrice
            }
            console.log(txParams);

            const tx = new EthereumTx(
                txParams
                ,
                { common: customCommon }
            );
            const privKey = Buffer.from(
                '', // private key of the contact address
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





    } catch (e) {
        console.log(e);
    }

}

asyncCall();