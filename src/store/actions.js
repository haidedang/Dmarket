
/* import Organizations from "@/js/organizations"
import MarketplaceRegistry from "@/js/marketplaceRegistry" */
import store from "@/store/store";
import EthereumClient from "../js/EthereumClient"
 /**
  * 
  * @param {*} param0 
  * @param {*} userName - String  
  */
 
const actions = {

/**
 * 
 * -----------USER MANAGEMENT-----------------
 * 
 */
    async createUser ({commit}, username) {
        await Users.init();
        await Users.create(username);
        store.dispatch('getProfile', Users);
    },
    async fetchUser ({commit}, address) {
        console.log(address) 

        if (address.length != 0) {
            commit('setProfile', {name: 'MyProfile', id: address}); 
        }
        /* await Users.init()
        let exists = await Users.exists(Users.account)
        try {
            if (exists) {
                store.dispatch('getProfile', Users);
            } else {
                store.dispatch('resetState');
            }
        } catch (e) {
            console.log(e);
        } */
    },
    async destroyUser ({commit}) {
        await Users.init();
       await Users.destroy();
       await store.dispatch('resetState');
    },
    async getProfile ({commit}, users) {
        let userName = await users.authenticate(); 
        console.log('dispatching action',userName)
        // this.userName = userName; 
        if(userName !== ''){
            commit('setProfile', userName)
        } else {
            console.log('please sign up')
        }
    },
    /**
     * 
     * -----------Organization---------------
     * 
     */
    
   /*  async getOrganization ({commit}) {
        await Organizations.init();
        let numberOfOrganizations = await Organizations.getOrganizationsOfUser();
        console.log(numberOfOrganizations);
    }, */

    async createOrganization({commit}, payload) {
        // fetch user Object from IFPS  
        // append Organization IFPS Hash to the User Object 
        // upload new object to IFPS 
        // upload User profile on Blockchain 
        // create Organization Object from IFPS 
        /* await Organizations.init();
        await Organizations.createOrganization(payload.address, payload.name);
        store.dispatch('getOrganization', Organizations) */

        // Create EthereumKeyPair 
    },
    async createEntity({commit}, payload){
        // create Ethereum Key Pair
        let account = web3.eth.accounts.create();
        //create IPFS Hash 
        // create App Object 



    },
    async resetState ({commit}) {
        commit('resetState');
    },
    async convertToBuffer(reader) {
        return Buffer.from(reader);
      },
    async createOrganizationUpdate({commit}, payload) {
        await MarketplaceRegistry.init(); 
        try {
            let data = await actions.convertToBuffer(payload)
            console.log(data)
            let string = await MarketplaceRegistry.createOrganization(data); 
             console.log(string)
        } catch (e) {
            console.log(e)
        }
    },
    async signMessage ({commit}) {
        EthereumClient.getInstance(web3).then(client => {
            client.signMessage()
        })  
    },

    async verifyApp({commit}) {
        EthereumClient.getInstance(web3).then(client => {
            client.registerApp();
        }) 
    }
    
    /* async createOrganizationUpdate({commit}, payload) {
        await MarketplaceRegistry.init(); 
        await MarketplaceRegistry.createOrganization(payload); 
    } */
}

export default actions; 

/* 
export const getProfile = async ({ commit }, users) => {
    console.log('entered action')
        let userName = await users.authenticate(); 
        console.log('dispatching action',userName)
        // this.userName = userName; 
        if(userName !== ''){
            commit('setProfile', userName)
        } else {
            console.log('please sign up')
        }
}

export const getOrganization = async ({ commit}, payload) => {
        let numberOfOrganizations = await payload.getOrganizationsOfUser();
        console.log(numberOfOrganizations);
}

export const resetState = ({commit}) => {
    commit('resetState');
  }
    */