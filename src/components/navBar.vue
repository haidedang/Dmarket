<template>
  <div class="navBar">
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">Dappz</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Marketplace</b-nav-item>
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
        </b-navbar-nav>

        <!-- Right aligned nav items -->

        <b-navbar-nav v-if="$store.state.user.isLoggedIn" class="ml-auto">
          <b-nav-item-dropdown text="+" right>
            <b-dropdown-item href="#">New API</b-dropdown-item>
            <b-dropdown-item href="#">New App</b-dropdown-item>
            <b-dropdown-item ><router-link id="newOrganization" to="/newOrganization">New Organization</router-link> </b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown text="User" v-if="$store.state.user.isLoggedIn" right>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">My Apps</b-dropdown-item>
       <!--      <b-dropdown-item @click="signout">Sign Out</b-dropdown-item> -->
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav v-else class="ml-auto">
          <b-nav-item @click="login">Login</b-nav-item>
          <!-- <b-nav-item>
            <router-link class="link" to="/register">Register</router-link>
          </b-nav-item> -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MetaMask from '@/util/metamask' 

export default {
  name: "navBar",
  data() {
    return {
      msg: "it works"
    };
  },
  methods: {
    signout: async function() {
      await this.$store.dispatch('resetState');
      this.$router.push('/')
    },
    login: async function() {
      let web3 = await MetaMask.getWeb3(); 
      let result = await web3.eth.getAccounts(); 
      
     /*  if (web3) {
        await this.$store.dispatch('fetchUser', result); 
        this.$router.push('/'); 
      } */

      
      /* await this.$store.dispatch('fetchUser');
      this.$router.push('/') */
    }
  }
};
</script>

<style scoped>
/* TODO: make this global style for links  */
.link {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
}

#newOrganization {
  color: black;
  text-decoration: none;
}
</style>