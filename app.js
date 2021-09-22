const Web3 = require('web3');
const Common = require('ethereumjs-common');
const EthereumTx = require('ethereumjs-tx').Transaction;
const privateKey = Buffer.from(
  '206f93b244cc707d21bfc64eb574aff75e2e41a22de7c06dc8ab8ab33dd1ec92',
  'hex',
);

// const ethNetwork = 'https://rinkeby.infura.io/v3/YOUR_PROJECT_ID';
// const ethNetwork = 'https://kovan.infura.io/v3/001dbb057e974772bcbf35c7c275fca4';
const ftmNetwork = 'https://rpc.testnet.fantom.network/';

try {
        const web3 = new Web3(new Web3.providers.HttpProvider(ftmNetwork));
        console.log("Connection Successfull!");
        console.log("Latest Block Number: ");
        web3.eth.getBlockNumber().then(console.log);

        const txParams = {
            nonce: '0x00',
            gasPrice: '0x09184e72a000',
            gasLimit: '0x2710',
            to: '0x23A027E18EDb3Be53f882b7EAF0F984489619908',
            value: 100000,
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
          }

        const tx = new EthereumTx(txParams, { chain: '4002' , hardfork: 'petersburg' });
        tx.sign(privateKey);
        const serializedTx = tx.serialize();


}
catch(e) {
        console.log("Connection Error!", e);
}