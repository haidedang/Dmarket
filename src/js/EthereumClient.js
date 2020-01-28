import getWeb3 from '../util/getWeb3'

import EthrDID from 'ethr-did'

const abi = require('ethereumjs-abi')

/* const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('http://localhost:8545') */
import { resolve } from 'did-resolver'
import registerEthrDidToResolver from 'ethr-did-resolver'
//const resolve = require('did-resolver')
//const registerEthrDidToResolver = require('ethr-did-resolver').default;

const contract = require('truffle-contract')
const MarketCore = require('../../build/contracts/MarketPlaceCore.json')
const  EIP712Domain = require('eth-typed-data').default;


let instance; 

const config = {}; 
config.registryAddress = "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070";

const myDomain = new EIP712Domain({
    name: "Marketplace Registry",               // Name of the domain
    version: "1",                     // Version identifier for this domain
    chainId: 1579946562578,                       // EIP-155 Chain id associated with this domain (1 for mainnet)
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
        console.log(web3.version)
        let marketCoreContract = contract(MarketCore)
        marketCoreContract.setProvider(web3.currentProvider)
        let marketCore = await marketCoreContract.deployed()
        console.log(marketCore.methods)

        return new EthereumClient(web3,marketCore)
    }

    async signMessage() {
        console.log(this.web3.version)
        console.log('hey');
        //console.log(this.web3.eth.accounts.sign('hey', "0x8A87DDC9D4F26D495636BD8C8E0B325D6E81095F8E97CFD09C646890D1D4E6FF".toLowerCase()))
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

    async signPayment(recipient, callback) {
      var hash = "0x" + abi.soliditySHA3(
        ["uint8","uint8","address","address"],
        [0x19,0,"0x8c1ed7e19abaa9f23c476da86dc1577f1ef401f5", recipient]
      ).toString("hex");
  
      console.log(typeof(hash))
      console.log(hash.length)
  
      let prefix = "\x19Ethereum Signed Message:\n"
      //this is how the hashing of sign works. 
      let msgHash1 = web3.utils.sha3(prefix+hash)
      console.log(msgHash1.length)
  
      
       //*/
      let hashedmessage = web3.eth.accounts.hashMessage(hash);
  
      let sigObj = await web3.eth.accounts.sign(hash, "0xa0bd243444a526200ef5cf743dea1065f7de709685e6a05b50ad934addfa3c8f")
      console.log(sigObj)
     // console.log("result",hashedmessage)
      //console.log(hashedmessage.length)
      //console.log(sigObj.messageHash)
      //let privateKey = "0xa0bd243444a526200ef5cf743dea1065f7de709685e6a05b50ad934addfa3c8f"
  
      //web3.eth.personal.sign(hash, "0x1f2f7bb9d6c12955988c10db46d30cfdae43df21", callback).then(console.log);
     // let sigObj = await web3.eth.personal.sign(hash, privateKey)
      //let msgHash2 = sigObj.messageHash;
      // console.log(msgHash2)
      //web3.personal.sign(hash, web3.eth.defaultAccount, callback);
    }

    //-----EXPERIMENTAL---------
     verifyApp1() {
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

    verifyApp2(){
      // Create a new Ethereum DID conform account on specified network 
      // Account 1 - Ganache 
      const keypair = {
        address: '0xd7a360fda97109dae2d94eaf93c7150824ebe3b2',
        privateKey: '569e863fdfd0aa3b93298ff0f34c787f3a80c19adedee3cf56a6d28aa77aca9a' 
      };

      const registryAddress='0x57605772a7736C66063126573d996596fbE04110';

      const ethrDid = new EthrDID({address : keypair.address, provider:this.web3.currentProvider, registry:registryAddress});

      ethrDid.setAttribute('did/svc/HubService', 'https://hubs.uport.me', 10000)
      .then(res => console.log('Ethr DID\n\n', res))
      .catch(e => console.log(e))
        
      let did = 'did:ethr:' + keypair.address; 
      console.log(this.web3.currentProvider)
      registerEthrDidToResolver({provider: this.web3.currentProvider, registry:registryAddress})
      resolve(did).then(doc => console.log(doc)).catch(e => console.log(e))
    }

    verifyApp(){
      this.signPayment();
    }

}

export default EthereumClient