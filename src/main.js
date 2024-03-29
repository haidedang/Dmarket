// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Web3 from 'web3'
import router from './router'
import store from "@/store/store";
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'babel-polyfill'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

window.ethereum.on('accountsChanged', function (accounts) {
  console.log(accounts)
  if(accounts.length != 0){
    store.dispatch('fetchUser', accounts); 
    router.push('/'); 
  } else { 
    store.dispatch('resetState'); 
    router.push('/');
  }
})

window.addEventListener('load', (ev) => {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  })
})










