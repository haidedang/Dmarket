import getWeb3 from '../util/getWeb3'

const contract = require('truffle-contract')

let instance 

class EthereumClient {

    constructor(web3Instance, marketCore){
        this.web3 = web3Instance
        this.marketCore = marketCore
    }

    static async getInstance() {
        if (instance == null) {
          instance = await EthereumClient.build()
        }
        return instance
      }

    static async build() {
        let web3 = await getWeb3

        /* let marketCoreContract = contract(MarketCore)
        marketCoreContract.setProvider(web3.currentProvider)
        let marketCore = await marketCoreContract.deployed() */

        return new EthereumClient(web3)
    }

    async signMessage() {
        console.log('hey');
        console.log(this.web3.eth.accounts.sign('hey', "0x8A87DDC9D4F26D495636BD8C8E0B325D6E81095F8E97CFD09C646890D1D4E6FF".toLowerCase()))
    }
    
}

export default EthereumClient