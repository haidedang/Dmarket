var MarketCore = artifacts.require("./MarketPlaceCore.sol");
var Registry = artifacts.require("./ERC1056.sol");

/* var Web3 = require('web3')
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
let web3 = new Web3(provider);  */

const dMarket = require('../../config/dMarket/dMarket'); 

const Web3 = require('web3'); 
const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('http://localhost:8545')

let web3 = new Web3(provider);


import {App, Entity} from '../../src/js/entity'


function stringToBytes32 (str) {
    const buffstr =
      '0x' +
      Buffer.from(str)
        .slice(0, 32)
        .toString('hex')
    return buffstr + '0'.repeat(66 - buffstr.length)
}

function getBlock(blockNumber) {
    return new Promise((resolve, reject) => {
        web3.eth.getBlock(blockNumber, (error, block) => {
        if (error) return reject(error);
        resolve(block);
        });
    });
}

contract('MarketCore',  function (accounts) {
    let account = accounts[0]
    let marketCore;
    let registry; 
    let sigObj; 
    let entity; 

    before(async() => {
        marketCore = await MarketCore.deployed(); 
        registry = await Registry.deployed(); 
    })

    describe("should register Entity", () => {

        it("addresses should be the same", async() => {
            assert.equal(await marketCore.registry(), registry.address)
        })

        it("should create signed Entity", async() => {
            entity = new Entity(web3); 
            sigObj = await entity.setOwnerToMarketplace(registry, marketCore.address);
        })

        it("should show owner", async () => {
            let result = await marketCore.showOwner.call(account); 
        })

        describe ("_updateEntity()", () => {
            let tx; 
            let block; 

            before(async () => {
                tx = await marketCore.registerEntity(entity.address, sigObj.v,  sigObj.r, sigObj.s, account,
                    { from: account })
                
                block = await getBlock(tx.receipt.blockNumber)
            })

            it("should change owner to marketplace", async () => {
                let owner = await registry.identityOwner.call(entity.address); 
                assert.equal(owner, marketCore.address)
            })

            it("should write meta DATA to the Marketplace", async () => {
                let cid= "bafkreieo6ylu6mzz6ky62tfij4g5ktowlnp3xbk5nps6perr7rebrot2c4"
                await marketCore.setData(entity.address, stringToBytes32('Dmarket'), '0x'+ Buffer.from(cid).toString("hex"), 22000)
            } ) 

            it("should create an ERC1056 DIDAttributeChanged event", async () => {
                console.log(registry)
                let history = await registry.getPastEvents('DIDAttributeChanged', {
                    fromBlock:0,
                    toBlock:'latest'
                })
                console.log(history)
                
            }) 
            
        }) 

         
    }) 

    /* describe("verifyApp()", () => {
        let sig;
    
        it('should create App', () => {

        })
    
        it("should return true", async() => {
          // Ethereum Signature Function 
          sig = utils.ecsign(app.signHash(), privateKey);
          
          const r =  utils.bufferToHex(sig.r); 
          const s = utils.bufferToHex(sig.s); 
          const v = utils.bufferToHex(sig.v); 
    
          const value = await marketCore.verifyApp(app.owner, app.author, app.appName, app.description, app.issuer, app.downloadLink, app.supportedApp, r, s, v); 
          
          // console.log(marketCore.methods)
          // console.log(utils.bufferToHex(privateKey))
          // console.log(r,s,v)
          // console.log(utils.bufferToHex(sig.r), utils.bufferToHex(sig.s),utils.bufferToHex(sig.v))
    
          // signature composed of all parameters 
          // console.log('Whole Signature',utils.bufferToHex(utils.keccak256(Buffer.concat([sig.r,sig.s, Buffer.from(utils.bufferToHex(v))]))))
          // store the whole string in a variable  
          sig = utils.bufferToHex(utils.keccak256(Buffer.concat([sig.r,sig.s, Buffer.from(utils.bufferToHex(v))])));
    
          app.signature = sig; 
          // let signature = utils.keccak256(sig); 
          // console.log(utils.bufferToHex(signature))
    
          assert.equal(value, true)
        })
    })  */

  });