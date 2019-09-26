import App from "@/js/users";
import store from "@/store/store";

export default {

    async createUser(username) {
         await App.init();
         await App.create(username); 
         store.dispatch('getProfile', App)
    },
    async fetchUser() {
        await App.init()
        let exists = await App.exists(App.account)
        try {
            if (exists) {
                store.dispatch('getProfile', App);
            } else {
                store.dispatch('resetState');
            }
        } catch (e) {
            console.log(e);
        }
    },
    async destroyUser() {
       await App.init();
       await App.destroy();
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
        await App.init();
        await App.createOrganization(address, name);
        store.dispatch('getOrganization', App)
    }
}