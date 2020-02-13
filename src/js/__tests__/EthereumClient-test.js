
import EthereumClient from '../EthereumClient'

//const HttpProvider = require('ethjs-provider-http')
const Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
let web3 = new Web3(provider);


let Resolver;

jest.setTimeout(60000);

describe('EthereumClient', () => {
    let instance;

    beforeAll(async () => {
        instance = await EthereumClient.getInstance(web3);
    })

    /* it("should create Dummy Data", async () => {
        await instance.createDummyData();
    }) */

    /* describe('register App', () => {
        let app;
        let history;
        let doc = {}
        beforeAll(async () => {
            app = await instance.registerApp({
                author: await instance.getUserAccount()[0],
                appname: 'whatsapp',
                description: 'A cool app',
                downloadLink: 'YOLOSWAG',
                supportedApp: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1']
            })
        })

        it("should change owner to marketplace", async () => {
            let owner = await instance.registry.identityOwner.call(app.address);
            expect(owner).toEqual(instance.marketCore.address)
        })

        it("should set the correct DIDAttributeCHanged Event", async () => {
            history = await instance.registry.getPastEvents('DIDAttributeChanged', {
                filter: { identity: app.address },
                fromBlock: 0,
                toBlock: 'latest'
            })

            let result = history.slice(-1)[0];

            expect(bytes32toString(result.returnValues.name)).toEqual('did/dMarket/app');
            expect(bytesToString(result.returnValues.value)).toEqual(app.ipfsHash);
        })

        it("should resolve the app correctly", async () => {
            let doc = await instance.resolveDID(app.address)
            if (doc.dMarket.type = "app") {
                let result = await ipfs.cat(doc.dMarket.data)
                doc.dMarket = JSON.parse(result)
            }
            expect(typeof (doc.dMarket)).toEqual('object')
            console.log(doc)
        })
    }) */

    describe("getAllMarketplaceEntities",  () => {
        let apps = []
        it("write attribute to the marketplace", async() => {
             
            let result =  await instance.getAllEntities(); 
            for (let i = 0; i< result; i++){
              let result =  await instance.marketCore.getEntity(i); 
               apps.push(result)
            }
            console.log(apps)
        })

        it("resolves all attributes correctly", async() => {
            let appObjects = []
            for(let i = 0; i< apps.length; i++){
                let doc = await instance.resolveDID(apps[i]);
                /* if (doc.dMarket.type = "app") {
                    let result = await ipfs.cat(doc.dMarket.data)
                    doc.dMarket = JSON.parse(result)
                } */
                appObjects.push(doc);
            }
            console.log(appObjects)
        })
    })

})

