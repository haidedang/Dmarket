var MarketCore = artifacts.require("./MarketPlaceCore.sol");
const  EIP712Domain = require('eth-typed-data').default;
const SimpleSigner = require('did-jwt').SimpleSigner;
const utils = require('ethereumjs-util');

const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");


var Web3 = require('web3')
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
let web3 = new Web3(provider);

const config = {}; 
config.registryAddress = "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070"; 

const privateKey = Buffer.from("8a87ddc9d4f26d495636bd8c8e0b325d6e81095f8e97cfd09c646890d1d4e6ff", "hex")
const address = utils.bufferToHex(utils.privateToAddress(privateKey));

contract('MarketCore', function (accounts) {
    let account = accounts[0]
    let marketCore;

    describe("register APP", () => {
        let client = this;  
        let sig;
        
        before(async() => {
            marketCore = await MarketCore.deployed();
        });

        //Create the App Client Side 
        describe("createApp", () => {
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
            
            let app = new App({
                owner: address,
                author: address,
                appName: 'Instagram',
                description: 'A cool app',
                issuer: address,
                downloadLink: 'YOLOSWAG'
                })

            client.app = app; 
        })
                
        describe("verifyApp()", () => {
                let app = client.app;

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
                    
                    console.log(app)
                    console.log(web3.currentProvider)

                    const value = await marketCore.verifyApp(app.owner, app.author, app.appName, app.description, app.issuer, app.downloadLink, r, s, v); 
                    console.log(marketCore.methods)

                    console.log(utils.bufferToHex(privateKey))
                    console.log(r,s,v)
                    console.log(utils.bufferToHex(sig.r), utils.bufferToHex(sig.s),utils.bufferToHex(sig.v))

                    // signature composed of all parameters 
                    console.log('Whole Signature',utils.bufferToHex(utils.keccak256(Buffer.concat([sig.r,sig.s, Buffer.from(utils.bufferToHex(v))]))))
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
                  
                console.log("IPFS cid:", cid);       
                console.log(await ipfs.cat(cid));
            })
    
            it("should write app to registry", async () => {
                // Defining what goes in, Define the path 
               console.log(key)

               // key : IPFS Hash.  
               await marketCore._updateEntity(address, address, key, sig);
               let value =  await marketCore.Test.call(address, key, {from:address}); 
               console.log(value)
               assert.equal(sig, value); 
            })
        })
    })

    describe("delete App", () => {

    })

    describe("rate App", () => {

    })

    describe("register AppVersion()", () => {
        
    })


});
