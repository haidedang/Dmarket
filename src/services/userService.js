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
      }
}