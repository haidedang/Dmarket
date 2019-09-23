import Vue from "vue";
import CircularJSON from "circular-json";
/* import { setCurrentConversation, clearContacts } from './actions'; */

export default {
  setProfile(state, response) {
    console.log('setting the state')
    state.user.name = response
    Vue.set(state.user, 'isLoggedIn', true)
    /* state.user.isLoggedIn = true */
  },
  resetState(state) {
    let initialState = {
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
