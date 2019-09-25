import Users from "@/js/users";
import store from "@/store/store";

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
    async createOrganization(organizationName) {
        // fetch user Object from IFPS  
        // append Organization IFPS Hash to the User Object 
        // upload new object to IFPS 
        // upload User profile on Blockchain 
        // create Organization Object from IFPS 
        await Users.init();
        await Users.createOrganization(organizationName);
        store.dispatch('getOrganization', Users)
    }
}