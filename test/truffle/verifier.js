var MarketCore = artifacts.require("./MarketPlaceCore.sol");
const  EIP712Domain = require('eth-typed-data').default;
const SimpleSigner = require('did-jwt').SimpleSigner;
const utils = require('ethereumjs-util');

const abi = require('ethereumjs-abi')
var sha3 = require("js-sha3").keccak_256;
var BN = require("bn.js");


const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");

const EthrDID = require('ethr-did')

const resolve = require('did-resolver')
const registerEthrDidToResolver = require('ethr-did-resolver').default;

var Web3 = require('web3')
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
let web3 = new Web3(provider);

let config = {}; 
config.registryAddress = "0x8f308D0A904aFa19167baAe61058BDFE69F711ad".toLowerCase(); 

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

/*   function stringToBytes32(str) {
    const buffstr = Buffer.from(str).toString("hex");
    return buffstr + "0".repeat(64 - buffstr.length);
  }
   */
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
    
    describe("register APP", () => {
        let client = this;  
        let sig;
        
        before(async() => {
            marketCore = await MarketCore.deployed();
            registry = await marketCore.registry();
        });

        //Create the App Client Side 
        describe("createApp", () => {
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
            
            let app = new App({
                owner: address,
                author: address,
                appName: 'Instagram',
                description: 'A cool app',
                issuer: address,
                downloadLink: 'YOLOSWAG'
                })

            client.app = app; 

            let tx;
            let sigObj
            let appAccount; 

            before(async () => {
            appAccount = web3.eth.accounts.create(); 
            console.log('appAccount',appAccount)
            sigObj = await signData(
                appAccount.address,
                appAccount.address,
                Buffer.from(
                    stripHexPrefix(appAccount.privateKey.toLowerCase()),
                    "hex"
                  ),
                Buffer.from("changeOwner").toString("hex") +
                stripHexPrefix(registry)
            );
            console.log('sigObj',sigObj)
            });

            it("should create Ethereum Account for app", async () => {
                console.log('xD', appAccount.address, sigObj)
                let value = await marketCore.registerEntity(appAccount.address, sigObj.v,  sigObj.r, sigObj.s, registry,
                { from: account })
                  
                  console.log(value)
                // const sig = utils.ecsign(app.signHash(), appAccount.privateKey);
            })
            /* it("should change owner mapping", async () => {
                const owner2 = await didReg.owners();
                assert.equal(owner2, appAccount);
              }); */
        })
                
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

        describe("_updateEntity()", () => {
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

            /* it("should register app to registry ERC1056", async() => {
                var hash = "0x" + abi.soliditySHA3(
                    ["uint8","uint8","address","address"],
                    [0x19,0,"0x8c1ed7e19abaa9f23c476da86dc1577f1ef401f5", recipient]
                  ).toString("hex");
                
                const sig = utils.ecsign(hash, privateKey);
                console.log(sig); 


                // Create a new Ethereum DID conform account on specified network 
                // Account 1 - Ganache 
                const keypair = {
                    address: '0xd7a360fda97109dae2d94eaf93c7150824ebe3b2',
                    privateKey: '569e863fdfd0aa3b93298ff0f34c787f3a80c19adedee3cf56a6d28aa77aca9a' 
                };
                
                const registryAddress='0xFE5ca4BD7918d2828305d904325df42c5b60a143';
                
                const ethrDid = new EthrDID({address : keypair.address, provider:provider, registry:registryAddress});
                
                ethrDid.setAttribute('did/svc/HubService', 'https://hubs.uport.me', 10000)
                .then(res => console.log('Ethr DID\n\n', res))
                .catch(e => console.log(e))
                    
                let did = 'did:ethr:' + keypair.address; 
                
                registerEthrDidToResolver({provider: provider, registry:registryAddress})
                resolve.default(did).then(doc => console.log(doc)).catch(e => console.log(e))
                  
            }) */
        })
    })

    describe("delete App", () => {

    })

    describe("rate App", () => {

    })

    describe("register AppVersion()", () => {

    })


});
