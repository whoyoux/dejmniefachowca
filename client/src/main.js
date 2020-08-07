import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios';

const base = axios.create({
  baseURL: "http:localhost:3000"
});

Vue.config.productionTip = false
Vue.prototype.$http = base;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
