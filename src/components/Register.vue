<template>
  <div class="register">
    <b-container class="mt-5 d-flex justify-content-center">
      <b-col cols="5">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-form-group id="input-group-2" label="Your Name:" label-for="input-2">
            <b-form-input id="input-2" v-model="form.name" required placeholder="Enter name"></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
          <b-button @click="createEntity"  variant="secondary">Create Entity</b-button>
          <b-button @click="createApp"  variant="secondary">Create App</b-button>
          <b-button @click="registerApp"  variant="secondary">REGISTER App</b-button>
        </b-form>
      </b-col>
    </b-container>
  </div>
</template>

<script>

/* import userService from '@/services/userService';
 */
import EthereumClient from '@/js/EthereumClient';
/* import getWeb3 from '@/util/getWeb3'
 */

export default {
  name: "register",
  data() {
    return {
      form: {
        name: "",
      },
      show: true
    };
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();
      if (typeof this.form.name !== 'undefined' && this.form.name !== '') {
           await this.$store.dispatch('createUser', this.form.name);
           this.$router.push('/');
      }
    },
    async onReset(evt) {
      await this.$store.dispatch('verifyApp'); 
      //await this.$store.dispatch('signMessage')
      evt.preventDefault();
      this.form.name = "";
    },
    async createEntity(evt) {
      console.log('reached')
      EthereumClient.getInstance(web3).then(client => {
        client.registerApp();
      }) 
      // Client needs to store these keys locally somewhere 
    } ,
    async createApp(evt) {
      EthereumClient.getInstance(web3).then(client => {
        client.createApp()
      })
    },
    async registerApp(evt) {
      let web3 = await getWeb3; 
      EthereumClient.getInstance(web3).then(client => {
        
        client.registerApp({
          author: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
          appname: 'whatsapp',
          description: 'A cool app',
          downloadLink: 'YOLOSWAG',
          supportedApp: ['0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1']
        })
      }) 
    }
  },
  
};
</script>