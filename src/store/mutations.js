import Vue from "vue";

/* import { setCurrentConversation, clearContacts } from './actions'; */

export default {
  setWeb3(state, response) {
    //state.web3 = response; 
  },
  setProfile(state, response) {
    state.user.name = response.name
    state.user.Id = response.id
    Vue.set(state.user, 'isLoggedIn', true)
    /* state.user.isLoggedIn = true */
  },
  resetState(state) {
    console.log('reset state')
    let initialState = {
        web3: null,
        user: {},
        organizations: null,
        apps: null,
        apis: null
    };
    Object.keys(initialState).forEach(key => {
      state[key] = initialState[key];
    });
    console.log(state);
  }
}
