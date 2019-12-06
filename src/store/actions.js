
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
    async fetchUser ({commit}) {
        await Users.init()
        let exists = await Users.exists(Users.account)
        try {
            if (exists) {
                store.dispatch('getProfile', Users);
            } else {
                store.dispatch('resetState');
            }
        } catch (e) {
            console.log(e);
        }
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
    async getOrganization ({commit}) {
        await Organizations.init();
        let numberOfOrganizations = await Organizations.getOrganizationsOfUser();
        console.log(numberOfOrganizations);
    },
    async createOrganization({commit}, payload) {
        // fetch user Object from IFPS  
        // append Organization IFPS Hash to the User Object 
        // upload new object to IFPS 
        // upload User profile on Blockchain 
        // create Organization Object from IFPS 
        await Organizations.init();
        await Organizations.createOrganization(payload.address, payload.name);
        store.dispatch('getOrganization', Organizations)
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
        EthereumClient.getInstance().then(client => {
            client.signMessage()
        })  
    },

    async verifyApp({commit}) {
        EthereumClient.getInstance().then(client => {
            client.verifyApp();
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