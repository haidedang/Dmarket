<template>
  <div class="dashboard">
    <h1>{{ msg }}</h1>
    <div v-if="$store.state.user.isLoggedIn">
      Welcome {{ $store.state.user.name}}. Destroy your account by clicking
      <a
        href="#"
        @click="destroyAccount"
      >here</a>.
    </div>
    <div v-else>
      Sign up
      <router-link to="/signup">here</router-link>.
    </div>
  </div>
</template>

<script>
/* import Users from "@/js/users"; */
import store from "@/store/store";
import { mapState } from "vuex";
import userService from "@/services/userService";

export default {
  name: "dashboard",
  data() {
    return {
      msg: "Welcome to the Dapp Store"
    };
  },
  beforeCreate: async function() {
    // fetch UserProfile 
    // fetch Organizations 
    // fetch Apis 
    // fetch Apps 
  },
  /* created: async function() {
    userService.fetchUser();
    this.$router.push('/');
  }, */
  methods: {
    destroyAccount: function(e) {
      e.preventDefault();
      userService.destroyUser();
      this.$router.push('/');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
  display: block;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
