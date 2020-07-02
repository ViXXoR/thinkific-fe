/*
 * Copyright (C) 2020, Matthew Livingstone
 * All rights reserved.
 */

import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import routes from './routes';

import axios from 'axios'
import VueAxios from 'vue-axios'

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faUser)
library.add(faLock)
Vue.component('font-awesome-icon', FontAwesomeIcon)


// Bulma
//import './assets/css/custom.css';
import './assets/css/bulma.materia.css'


Vue.config.productionTip = false

// Global data
Vue.prototype.$userData = {
    token: ''
}

Vue.prototype.$checkCredentials = function () {
  if(localStorage.userData != null) {
    var temp = JSON.parse(localStorage.userData);
    if(temp != null) {
      if(temp.token != '') {
        Vue.prototype.$userData = temp;
      }
      return true;
    } else {
      return false;
    }
  }

  return false;
}

const base = axios.create({
  //baseURL: 'http://localhost:3000',
  baseURL: 'https://cloud.mmrlivingstone.com/thinkific-api',
})

Vue.prototype.$http = base

Vue.use(VueRouter, VueAxios, axios)
Vue.use(Buefy)
Vue.use(require('vue-moment'))
const router = new VueRouter({routes});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
