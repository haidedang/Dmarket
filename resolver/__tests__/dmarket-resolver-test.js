import Web3 from 'web3'
import {DmarketResolver} from '../dmarket-resolver'
import EthereumClient from '../../src/js/EthereumClient'
import {stringToBytes, stringToBytes32, bytesToString} from '../dmarket-resolver'; 
const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('http://localhost:8545')


let registry = {}; 
registry.address = '0xCfEB869F69431e42cdB54A4F4f105C19C080A601'
// Registry address is actually fixed. 
let didAccount = 'did:ethr:0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'

let Resolver; 
let identity; 
let instance;
let accounts;
let owner

const str = "bafkreifm6uyhkllgdotqpec4hmfp7h5eqhb2ymiw45g26thiqmtgtqueqi"; 

describe('utility functions', () => { 
    it("turn string to bytes", async  () => {
       let bytes =   stringToBytes(str); 
       console.log(bytes);
       let result =  bytesToString(bytes);
       console.log(result)
    })
})


describe('DmarketResolver', () => {
   
    beforeAll(async() => {
        let web3 = await new Web3(provider);
        instance  = await EthereumClient.getInstance(web3);  
        accounts = await instance.web3.eth.getAccounts(); 
        Resolver = new DmarketResolver(web3, instance.registry); 
        identity = accounts[1].toLowerCase()
        owner = accounts[2].toLowerCase()
    })
    
    describe('resolve a Dmarket profile', () => {
      
        it("should resolve the right document", async () => {
            let result = await Resolver.resolve(didAccount);
        })
    
    })
    
    describe('should fetch the IPFS object and return the DID Object', () => {
        beforeAll(async() => {
            await instance.marketCore.setAttribute(
                owner,
                stringToBytes32('did/dMarket/app'),
                stringToBytes(str),
                20000,
                { from: owner }
            )
        })

        it('resolves document', async () => {
            let doc = await Resolver.resolve('did:ethr:' + '0x3e4102B1788bCCFA6db734e3eADb20Fc306f2Af8'); 
            console.log(doc)
        })

    }) 
})


/* // Result will be a Object in the end. 
result = { 
    'context': 'fdsfds', 
    'dmarketProfile': {

    }
} */