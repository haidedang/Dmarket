/**
 *  dMarketService exposes an interface to the Dmarket Smart Contracts. 
 */

import EthereumClient from '../../src/js/EthereumClient';
import * as AppController from '../controllers/app.controller'; 
import App from '../models/App';

 
const Web3 = require('web3');
var provider = new Web3.providers.HttpProvider("http://localhost:8545");
let web3 = new Web3(provider);

class DMarketService {

    async init(){
          let instance = await EthereumClient.getInstance(web3);
          this.instance = instance; 
          this.entities = await this.loadAllEntities(); 
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
    async loadAllEntities(){
        
        /**
         * result = [ 'EntityAddresses']
         */
        let result = await this.instance.getAllEntitiesByLogs(); 
        
        for(let i = 0; i< result.length; i++) {
            await this.saveEntityToDB(result[i]); 
        }
        
    }

    // this should listen for new DMARKET events and save them accordingly on the blockchain so it gets easy to query! 
    // No costs to use AT ALL! NICEEEEE 
    async syncEntities(){

    }

    async saveEntityToDB(entityAddress){
        
            // resolve the entity 
            let entity = await this.instance.resolveDID(entityAddress);

            const type = entity.dMarket.primaryType; 
            switch(type) {
                case 'App': 
                    //save entity to DB 
                    AppController.addApp(entity.dMarket.message);
                case 'Api':
                    ApiController.addApi(entity.dMarket.message); 
                case 'AppRelease':
                case 'ApiRelease':
            }
        
        // return entities; 
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