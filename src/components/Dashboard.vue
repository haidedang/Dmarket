<template>
  <div class="dashboard">
    <h1>{{ msg }}</h1>
    <div v-if="userExists">
      Welcome {{ pseudo }}. Destroy your account by clicking
      <a href="#" @click="destroyAccount">here</a>.
    </div>
    <div v-else>
      Sign up
      <router-link to="/signup">here</router-link>.
    </div>
    <b-container class="bv-example-row">
      <b-row>
        <b-col>1 of 3</b-col>
        <b-col>2 of 3</b-col>
        <b-col>3 of 3</b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Users from "@/js/users";

export default {
  name: "dashboard",
  data() {
    return {
      msg: "Welcome to your truffle-vue dApp",
      pseudo: undefined
    };
  },
  computed: {
    userExists: function() {
      return typeof this.pseudo !== "undefined";
    }
  },
  beforeCreate: function() {
    Users.init()
      .then(() => {
        Users.exists(Users.account).then(exists => {
          if (exists) {
            Users.authenticate().then(pseudo => {
              this.pseudo = pseudo;
            });
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    destroyAccount: function(e) {
      e.preventDefault();
      Users.destroy()
        .then(() => {
          this.pseudo = undefined;
        })
        .catch(err => {
          console.log(err);
        });
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
