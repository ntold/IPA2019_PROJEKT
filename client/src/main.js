/*
 * Author:      Nico Berchtold
 * File name:   main.js
 * Version:     1.0
 * Description: Sets up the Vue Instance     
 *        
 */

import Vue from "vue";
import './plugins/vuetify'
import App from "./App.vue";
import { router } from "./router";
import store from "./store/store";
import VueChatScroll from 'vue-chat-scroll'

Vue.use(VueChatScroll)
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
