
import EthereumClient from '../EthereumClient'
import {bytes32toString, bytesToString, stringToBytes32, Entity} from '../entity';
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

    it("should create Dummy Data", async () => {
        await instance.createDummyData();
    })

    describe('register App', () => {
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
            expect(typeof (doc.dMarket)).toEqual('object')
            console.log(doc)
        })
    })

    describe("getAllMarketplaceEntities",  () => {
        let apps = []
        it("fetch all entities", async() => {
            let result =  await instance.getAllEntities(); 
            for (let i = 0; i< result; i++){
              let result = await instance.marketCore.getEntity(i); 
               apps.push(result)
            }
           // console.log(apps)
        })

        it("fetch all entities by Logs", async() => {
            let result = await instance.getAllEntitiesByLogs(); 
            console.log(result)
            console.log(result.length)
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
          //  console.log(appObjects)
        })
    })

    describe('createOrganization', () => {
        // Create Ethereum Key pair for organization 
        let organization = new Entity(web3); 
        organization.addDelegate(address); 
        organization.setOwnerToMarketplace()

        // Delegates of the organization with proper rights will be registered here! 
    })

    // Adde User zur Organization 

    // who can set Delegates of the organization . specified in the custom smart contract. 


    organization.addDelegate('address'); 
    

    // dieses Key pair is master key. übertrage die rights of organization to a smart contract. 
    delegate.createApp (); 
    // He would have to change ownership of App to the organization 

    // Now only the holder of organization can set Attributes. 
    
    // organization has to nominate another owner in order to let them write. 

    // creating an organization therefore costs gas. 

    // Creating apps as an organization also costs more gas. 

    // change ownership to marketplace. 

    // set the owner of application there to the ones you need. 

    



})

