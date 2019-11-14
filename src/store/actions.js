import Users from "@/js/users";
import Organizations from "@/js/organizations"
import MarketplaceRegistry from "@/js/marketplaceRegistry"
import store from "@/store/store";

import Web3 from 'web3';

if (window.ethereum) {
  window.web3 = new Web3(ethereum);
  try {
    // Request account access if needed
    ethereum.enable();
  } catch (error) {
    // User denied account access...
  }
} else if (window.web3) { // Legacy dapp browsers...
  window.web3 = new Web3(web3.currentProvider);
} else { // Non-dapp browsers...
  console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}
console.log(web3);



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
        console.log('hey');
        console.log(web3.eth.accounts.sign('hey', "0x8A87DDC9D4F26D495636BD8C8E0B325D6E81095F8E97CFD09C646890D1D4E6FF".toLowerCase()))
    },
    
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