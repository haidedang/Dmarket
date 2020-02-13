/**
 *  dMarketService exposes an interface to the Dmarket Smart Contracts. 
 */

import DMarketResolver from '../../resolver/dmarket-resolver';
import EthereumClient from '../../src/js/EthereumClient';
import DmarketResolver from '../../resolver/dmarket-resolver';
const HttpProvider = require('ethjs-provider-http')
let provider = new HttpProvider('http://localhost:8545')
const Web3 = require('web3'); 
let web3 = new Web3(provider);

class DMarketService {

    async init(){
          let instance = await EthereumClient.getInstance(web3);
          this.instance = instance; 
          this.dmarket = new DmarketResolver(web3, instance.registry); 
          this.entities = await this.getAllEntities(); 
    }
    
    /* async createDummyData(){
       // let instance = await EthereumClient.getInstance(web3); 
        let success = await this.instance.createDummyData(); 

        if(success){
            console.log('Dummy Data has been created')
        } else {
            console.log('oops, something went wrong')
        }
    }
 */
    async getAllEntities(){
        // save all the entities in the DB 
        // let instance = await EthereumClient.getInstance(web3)
        let result = await this.instance.getAllEntities(); 
        // for each entity, depending on what type it is- > store it as the respective type in mongoDB. 
        let entities = []; 
        for(let i = 0; i< result; i++) {
            let result = await this.dmarket.resolve('did:ethr:' + await this.instance.getUserAccount()); 
            entities.push(result); 
        }
        return entities; 
    }

    async getAllApps() {
        let newArray = await this.entities.forEach(entity => {
            return entity.type == 'app' ; 
        }) 
        console.log(newArray)
    }

    async listenforEvents(){ 
        // save newly created Entities in the mongoDB right away. 
    }

    async getEntity(did){
        return did; 
    }

}

export default DMarketService