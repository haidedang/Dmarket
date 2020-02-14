// import getWeb3 from '../util/getWeb3'

import { App, Entity, stringToBytes32 } from './entity'
import { Resolver } from 'did-resolver';
import ethr from 'ethr-did-resolver';
import { stringToBytes, bytesToString, bytes32toString } from './entity';
import dummy from './dummy'; 
import Dummy from './dummy';

const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");
const contract = require('truffle-contract')
const MarketCore = require('../../build/contracts/MarketPlaceCore.json')
const ERCRegistryContract = require('../../build/contracts/ERC1056.json')

function fixProvider(contract) {
  if (typeof contract.currentProvider.sendAsync !== "function") {
    contract.currentProvider.sendAsync = function () {
      return contract.currentProvider.send.apply(
        contract.currentProvider, arguments
      );
    };
  }
}

let instance;
let self;

class EthereumClient {

  constructor(web3Instance, marketCore, registry) {
    self = this;
    this.web3 = web3Instance;
    this.marketCore = marketCore;
    this.registry = registry;
  }

  static async getInstance(web3Instance) {
    if (instance == null) {
      instance = await EthereumClient.build(web3Instance)
      instance.getUserAccount();
    }
    return instance
  }

  static async build(web3Instance) {
    //let web3 = await getWeb3

    let marketCoreContract = contract(MarketCore)
    marketCoreContract.setProvider(web3Instance.currentProvider)
    fixProvider(marketCoreContract)
    let marketCore = await marketCoreContract.deployed()

    let ethrRegistryContract = contract(ERCRegistryContract)
    ethrRegistryContract.setProvider(web3Instance.currentProvider)
    fixProvider(ethrRegistryContract)
    let ethrRegistry = await ethrRegistryContract.deployed();

    return new EthereumClient(web3Instance, marketCore, ethrRegistry)
  }

  async getUserAccount() {
    let accounts = await this.web3.eth.getAccounts()
    this.accounts = accounts;
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

  async createDummyData() {
    let dummy = new Dummy(); 
    await dummy.init(); 
  }

  // ------- ENTITY Marketplace Interface Methods ------------ 

  async getAllEntities() {
    
     let result = await this.marketCore.getAllEntities.call();
     return result
  }

  async getAllEntitiesByLogs() {
    /**
      * Query all event logs of ERC1056
      */
    let history = await this.registry.getPastEvents('DIDAttributeChanged', {
      fromBlock: 0,
      toBlock: 'latest'
    })
    // now an identity has multiple attribute changed events. i will need the latest attribute of Apps and api. 
    
    // filter out those with distinct identities 
    // filter out from those identities only did/dmarket. 

    return history
  }

  async setDataToMarketplace(entity) {
    let result = await this.marketCore._updateEntity2(
      entity.address, stringToBytes32('did/dMarket/app'), stringToBytes(entity.ipfsHash), 20000, { from: await self.getUserAccount(), gas: 300000 }
    )
  }

  async setAttribute(address, name, value, validity, sender) {
    await this.marketCore._updateEntity2(address, name, value, validity, { from: sender, gas: 300000 });
  }

  async resolveDID(address) {

    let resolver = ethr.getResolver({ web3: this.web3, registry: this.registry.address });
    let didResolver = new Resolver(resolver);

    let doc = await didResolver.resolve('did:ethr:' + address)

    let history = await this.registry.getPastEvents('DIDAttributeChanged', {
      filter: { identity: address },
      fromBlock: 0,
      toBlock: 'latest'
    })

    for (const event of history) {
      const name = bytes32toString(event.returnValues.name)
      const match = name.match(
        /^did\/(dMarket)\/(\w+)(\/(\w+))?(\/(\w+))?$/
      )
      if (match) {
        const section = match[1];
        const algo = match[2]
        if (section == "dMarket") {
          doc.dMarket = {
            type: algo,
            data: bytesToString(event.returnValues.value)
          }
        }
      }
    }

    return this.wrapDIDDocument(doc);
  }

  async wrapDIDDocument(doc) {
    if (doc.dMarket) {
      if (doc.dMarket.type = "app") {
        let result = await ipfs.cat(doc.dMarket.data)
        doc.dMarket = JSON.parse(result)
        return doc
      }
      return doc
    }
    return doc
  }

  async registerApp({ author, name, description, downloadLink, supportedApp }) {

    let app = new App(this.web3, {
      author: author,
      name: name,
      description: description,
      downloadLink: downloadLink,
      supportedApp: supportedApp
    })

    let sigObj = await app.setOwnerToMarketplace(self.registry, self.marketCore.address)
    await self.marketCore.registerEntity(app.address, sigObj.v, sigObj.r, sigObj.s, this.accounts[0],
      { from: this.accounts[0], gas: 300000 });
    await app.setIpfsHash();
    await this.setDataToMarketplace(app);

    return app;

  }

  async registerEntity(web3) {
    let entity = new Entity(web3);
    let sigObj = await entity.setOwnerToMarketplace(this.registry, this.marketCore.address);
    let value = await this.marketCore.registerEntity(entity.address, sigObj.v, sigObj.r, sigObj.s, this.accounts[0],
      { from: this.accounts[0], gas: 300000 });
    return value;
  }

  //-----EXPERIMENTAL---------
  verifyApp1() {
    let signer;
    let message;
    let signature;
    return new Promise((resolve, reject) => {
      this.getUserAccount().then((address) => {
        signer = address;

        message = {
          author: address.toLowerCase(),
          appName: 'Instagram',
          description: 'A cool app',
          downloadLink: 'YOLOSWAG',
          supportedApp: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1']
        }

        let app = JSON.stringify(new App(message));

        this.web3.currentProvider.sendAsync(
          {
            method: "eth_signTypedData_v4",
            params: [signer, app],
            from: signer
          },
          function (err, result) {
            if (err || result.error) {
              return console.error(result);
            } else {
              signature = EthereumClient.parseSignature(result.result.substring(2));
              resolve(signature)
            }
          }
        )
      })
    }).then((signature) => {
      console.log(signature)
      self.marketCore.verifyApp(message.owner, message.author, message.appName, message.description, message.issuer, message.downloadLink, message.supportedApp, signature.r, signature.s, signature.v).then(result => console.log('result', result))
    })
  }

}

export default EthereumClient