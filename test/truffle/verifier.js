var MarketCore = artifacts.require("./MarketPlaceCore.sol");
const  EIP712Domain = require('eth-typed-data').default;
const SimpleSigner = require('did-jwt').SimpleSigner;
const utils = require('ethereumjs-util');

const abi = require('ethereumjs-abi');
var sha3 = require("js-sha3").keccak_256;
var BN = require("bn.js");

const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");

const resolve = require('did-resolver')
const registerEthrDidToResolver = require('ethr-did-resolver').default;

var Web3 = require('web3')
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
let web3 = new Web3(provider); 

// Fixed Ganache Accounts, these will stay static. Account [0]
const privateKey = Buffer.from("569e863fdfd0aa3b93298ff0f34c787f3a80c19adedee3cf56a6d28aa77aca9a", "hex")
const address = '0xd7a360fda97109dae2d94eaf93c7150824ebe3b2';

function getBlock(blockNumber) {
    return new Promise((resolve, reject) => {
      web3.eth.getBlock(blockNumber, (error, block) => {
        if (error) return reject(error);
        resolve(block);
      });
    });
  }

function getLogs(filter) {
    return new Promise((resolve, reject) => {
      filter.get((error, events) => {
        if (error) return reject(error);
        resolve(events);
      });
    });
  }

function stripHexPrefix(str) {
    if (str.startsWith("0x")) {
      return str.slice(2);
    }
    return str;
}
function bytes32ToString(bytes) {
    return Buffer.from(bytes.slice(2).split("00")[0], "hex").toString();
}
function stringToBytes32 (str) {
    const buffstr =
      '0x' +
      Buffer.from(str)
        .slice(0, 32)
        .toString('hex')
    return buffstr + '0'.repeat(66 - buffstr.length)
}
function attributeToHex (key, value) {
    if (Buffer.isBuffer(value)) {
      return `0x${value.toString('hex')}`
    }
    const match = key.match(/^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/)
    if (match) {
      const encoding = match[6]
      // TODO add support for base58
      if (encoding === 'base64') {
        return `0x${Buffer.from(value, 'base64').toString('hex')}`
      }
    }
    if (value.match(/^0x[0-9a-fA-F]*$/)) {
      return value
    }
    return `0x${Buffer.from(value).toString('hex')}`
}

function leftPad(data, size = 64) {
    if (data.length === size) return data;
    return "0".repeat(size - data.length) + data;
}

contract('MarketCore', function (accounts) {
  let account = accounts[0]
  let marketCore;
  let registry; 
  async function signData(identity, signer, key, data) {
        //call nonce of ERC1056 out of marketCore Contract somehow. 
       // TODO: [Issue - #5 Verifiers.js/Nonce]  const nonce = await registry.nonce(signer);
       const nonce = 0; 
        const paddedNonce = leftPad(Buffer.from([nonce], 64).toString("hex"));
        const dataToSign =
          "1900" +
          stripHexPrefix(registry) +
          paddedNonce +
          stripHexPrefix(identity) +
          data;
        const hash = Buffer.from(sha3.buffer(Buffer.from(dataToSign, "hex")));
        const signature = utils.ecsign(hash, key);
        const publicKey = utils.ecrecover(
          hash,
          signature.v,
          signature.r,
          signature.s
        );
        return {
          r: "0x" + signature.r.toString("hex"),
          s: "0x" + signature.s.toString("hex"),
          v: signature.v
        };
  }

  before(async() => {
    marketCore = await MarketCore.deployed();
    // Get ERC1056 address 
    registry = await marketCore.registry();
  });

  describe("register APP", () => {
    let client = this;  
    let sig;

    let sigObj; 
    let appAccount; 
    let doc; 
    let cid; 
    const myDomain = new EIP712Domain({
        name: "Marketplace Registry",               // Name of the domain
        version: "1",                     // Version identifier for this domain
        chainId: 1574864255528,                       // EIP-155 Chain id associated with this domain (1 for mainnet)
        verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',  // Address of smart contract associated with this domain
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
    const app = new App({
        owner: address,
        author: address,
        appName: 'Instagram',
        description: 'A cool app',
        issuer: address,
        downloadLink: 'YOLOSWAG'
        })

    client.app = app; 

    before(async () => {
      appAccount = web3.eth.accounts.create(); 
      sigObj = await signData(
          appAccount.address,
          appAccount.address,
          Buffer.from(
              stripHexPrefix(appAccount.privateKey.toLowerCase()),
              "hex"
            ),
          Buffer.from("changeOwner").toString("hex") +
          stripHexPrefix(marketCore.address)
      );
    });
    
    //Create the App Client Side , THIS IS NOT SMART CONTRACT TEST ... 
    describe("should createApp", () => {
      describe("as owner", () => {
        it("should create Ethereum Account for app", async () => {
          let value = await marketCore.changeOwnerSigned(appAccount.address, sigObj.v,  sigObj.r, sigObj.s, marketCore.address,
          { from: account })
          // const sig = utils.ecsign(app.signHash(), appAccount.privateKey);
        })
        it("should have mapped owner to Registry", async() => {
          let value = await marketCore.showOwner.call(appAccount.address,  {from:account})
          assert.equal(value, marketCore.address);
        })
        it("should generateIPFSHash()", async () => {
          // MTrust=  {app, signature}
            doc = JSON.stringify(client.app)
            cid = await ipfs.add(doc) 
          })
        
        it("should register created App at Registry", async () => {
          let value2 = await marketCore.registerEntity(appAccount.address, stringToBytes32('Dmarket'), '0x'+ Buffer.from(cid).toString("hex"), 22000, account, {from: account})
          // console.log(value2)
          // assert.equal(value2, marketCore.address)
        })
        it("should update the owner in Registry", async() => {
          const length = await marketCore.getAllEntities.call(); 
          for( let i = 0 ; i < length; i ++){
            console.log('entity');
          }
  
          // Fetch all entities, look up the data in the event log
        })
        it("should update entity", async() => {
          let value = await marketCore._updateEntity2(appAccount.address, stringToBytes32('Dmarket'), '0x'+ Buffer.from('changed').toString("hex"),22000, {from: account}); 
          //console.log(value)
        })
      })
      describe("as member of an organization", () => {
        let organizationAccount;
        let sigObj;
        before(async() => {
          organizationAccount = web3.eth.accounts.create(); 
          sigObj = await signData(
            organizationAccount.address,
            organizationAccount.address,
            Buffer.from(
              stripHexPrefix(organizationAccount.privateKey.toLowerCase()),
              "hex"
            ),
            Buffer.from("changeOwner").toString("hex")+
            stripHexPrefix(marketCore.address)
          )
        })
        
        it("should create Organization Account for user (Account)", async() => {
          await marketCore.changeOwnerSigned(organizationAccount.address, sigObj.v, sigObj.r, sigObj.s, marketCore.address, {from: account})

        })

      })
    })

    describe("should deleteApp", () => {})
                
    describe("verifyApp()", () => {
      let app = client.app;

      it('should show web3 version', () => {
      })

      it("should return true", async() => {
        // Ethereum Signature Function 
        sig = utils.ecsign(app.signHash(), privateKey);
        
        const r =  utils.bufferToHex(sig.r); 
        const s = utils.bufferToHex(sig.s); 
        const v = utils.bufferToHex(sig.v); 

        /* 
        const r = sig.r;
        const s = sig.s;
        const v= sig.v; */
        
        /* console.log(app)
        console.log(web3.currentProvider) */

        const value = await marketCore.verifyApp(app.owner, app.author, app.appName, app.description, app.issuer, app.downloadLink, r, s, v); 
        
        /* console.log(marketCore.methods)
        console.log(utils.bufferToHex(privateKey))
        console.log(r,s,v)
        console.log(utils.bufferToHex(sig.r), utils.bufferToHex(sig.s),utils.bufferToHex(sig.v)) */

        // signature composed of all parameters 
        // console.log('Whole Signature',utils.bufferToHex(utils.keccak256(Buffer.concat([sig.r,sig.s, Buffer.from(utils.bufferToHex(v))]))))
        // store the whole string in a variable  
        sig = utils.bufferToHex(utils.keccak256(Buffer.concat([sig.r,sig.s, Buffer.from(utils.bufferToHex(v))])));

        client.app.signature = sig; 
        /* let signature = utils.keccak256(sig); 
        console.log(utils.bufferToHex(signature)) */

        assert.equal(value, true)
      })
    }) 

    /* describe("_updateEntity()", () => {
        let key;

        before(async () => {
              key = utils.keccak256('app/version', 'utf8');
        })

        it("should generateIPFSHash()", async () => {
            // MTrust=  {app, signature}
            const doc = JSON.stringify(client.app)
            const cid = await ipfs.add(doc);
              
            // console.log("IPFS cid:", cid);       
            // console.log(await ipfs.cat(cid));
        })

        it("should write app to registry ERC780", async () => {
            // Defining what goes in, Define the path 
            // console.log(key)

            // key : IPFS Hash.  
            await marketCore._updateEntity(address, address, key, sig);
            let value =  await marketCore.Test.call(address, key, {from:address}); 
            // console.log(value)
            assert.equal(sig, value); 
        })
    }) */
  })

  describe("delete App", () => {
  })

  describe("rate App", () => {
  })

  describe("register AppVersion()", () => {
  })

});
