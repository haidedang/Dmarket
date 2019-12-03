import getWeb3 from '../util/getWeb3'

const contract = require('truffle-contract')
const MarketCore = require('../../build/contracts/MarketPlaceCore.json')
const  EIP712Domain = require('eth-typed-data').default;


let instance; 

const config = {}; 
config.registryAddress = "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070";

const myDomain = new EIP712Domain({
    name: "Marketplace Registry",               // Name of the domain
    version: "1",                     // Version identifier for this domain
    chainId: 1574864255528,                       // EIP-155 Chain id associated with this domain (1 for mainnet)
    verifyingContract: config.registryAddress,  // Address of smart contract associated with this domain
    salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"          // Random string to differentiate domain, just in case
  })

  const App = myDomain.createType('App', [
    
    { name: 'owner', type: 'address'},    // fest 
    { name: 'author' , type: 'address'},  //fest
    { name : 'appName', type: 'string'}, // fest 
    { name: 'description', type: 'string'},
    { name: 'issuer', type: 'address'}, // fest 
    { name: 'downloadLink', type: 'string'}
  ])

let self; 

class EthereumClient {

    constructor(web3Instance, marketCore){
        self = this; 
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
        console.log(web3.currentProvider)
        let marketCoreContract = contract(MarketCore)
        marketCoreContract.setProvider(web3.currentProvider)
        let marketCore = await marketCoreContract.deployed()
        console.log(marketCore.methods)

        return new EthereumClient(web3,marketCore)
    }

    async signMessage() {
        console.log('hey');
        console.log(this.web3.eth.accounts.sign('hey', "0x8A87DDC9D4F26D495636BD8C8E0B325D6E81095F8E97CFD09C646890D1D4E6FF".toLowerCase()))
    }

    async getUserAccount() {
        let accounts = await this.web3.eth.getAccounts()
        return accounts[0];
    }

    static parseSignature(signature) {
        var r = signature.substring(0, 64);
        var s = signature.substring(64, 128);
        var v = signature.substring(128, 130);
      
        return {
            r: "0x" + r,
            s: "0x" + s,
            v: parseInt(v, 16)  
        }
    }

    //-----EXPERIMENTAL---------
     verifyApp() {
        let app 
        let appData; 
        let signer ;
        return new Promise((resolve, reject) => {
            this.getUserAccount().then((address) => {
                app = new App({
                    owner: address.toLowerCase(),
                    author: address.toLowerCase() ,
                    appName: 'Instagram',
                    description: 'A cool app',
                    issuer: address.toLowerCase(),
                    downloadLink: 'YOLOSWAG'
                  })
                console.log(app.owner, app.author, app.appName, app.description, app.issuer, app.downloadLink)
                signer = address
                //const signer = this.web3.eth.accounts[0];
                
                appData = [typeof(app.owner), typeof(app.author), typeof(app.appName), typeof(app.description), typeof(app.issuer), typeof(app.downloadLink)]; 
                const data = JSON.stringify(app.toSignatureRequest());
                console.log(data)
                let signature; 
    
                this.web3.currentProvider.sendAsync(
                    {
                        method:"eth_signTypedData_v3",
                        params:[signer, data],
                        from: signer
                    },
                    
                function(err, result) {
                  if (err || result.error) {
                    return console.error(result);
                  }
                signature = EthereumClient.parseSignature(result.result.substring(2));
                
                resolve(signature)
                }
                )
            })
        }).then((signature)=> {
            console.log(signature)
            // DAMN SON, YOU FUCKING DUMBASS MOTHERFUCKER 
            self.marketCore.verifyApp(app.owner, app.author, app.appName, app.description, app.issuer, app.downloadLink, signature.r, signature.s, signature.v).then(console.log)
            //self.marketCore.test('Geht', signer, signature.r, signature.s, signature.v).then(console.log)

            // Post it on the Blockchain. 
        })
    }

}

export default EthereumClient