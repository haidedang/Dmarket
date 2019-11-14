import Users from "@/js/users";
import Organizations from "@/js/organizations"
import store from "@/store/store";
import MarketplaceRegistry from "@/js/marketplaceRegistry"
import Organization from "../js/organizations";



export default {

    async createUser(username) {
         await Users.init();
         await Users.create(username); 
         store.dispatch('getProfile', Users)
    },
    async fetchUser() {
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
    async destroyUser() {
       await Users.init();
       await Users.destroy();
       await this.signOut();
    },
    async signOut() {
        await store.dispatch('resetState');
      },
    async createOrganization(address, name) {
        // fetch user Object from IFPS  
        // append Organization IFPS Hash to the User Object 
        // upload new object to IFPS 
        // upload User profile on Blockchain 
        // create Organization Object from IFPS 
        await Organizations.init();
        await Organizations.createOrganization(address, name);
        store.dispatch('getOrganization', Organizations)
    },
    async convertToBuffer(reader) {
        return Buffer.from(reader);
      },
    async createOrganizationUpdate({commit}, payload) {
        await MarketplaceRegistry.init(); 
        try {
            let data = await this.convertToBuffer(payload)
            let string = await MarketplaceRegistry.createOrganization(data); 
             console.log(string)
        } catch (e) {
            console.log(e)
        }
       
    },
    async signMessage({commit}, payload) {
        await Organization.init(); 
        await Organizations.signMessage();
    }
    
}