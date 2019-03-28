/*
 * Author:      Nico Berchtold
 * File name:   router.js
 * Version:     1.0
 * Description: Every Route from the Frontend is defined here
 *              
 *        
 */

// Import all Views
import Vue from "vue";
import Router from "vue-router";
import Chat from "./components/Chat.vue";
import AllRooms from "./components/AllRooms.vue";
import Login from "./components/Login.vue";
import store from "./store/store"
import CreateNewChat from './components/CreateNewChat'
import NewPassword from './components/NewPassword'


Vue.use(Router);

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/allrooms",
      name: "allrooms",
      component: AllRooms,
    },
    {
      path: "/add",
      name: "add",
      component: CreateNewChat,
    },
    {
      path: "/new",
      name: "newpassword",
      component: NewPassword,
    },
    {
      path: "/chat/:id/:roomname",
      name: "chat",
      component: Chat
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
});

// Routguard
// Checks befor every route, if the user is allowed
// to get there
router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path);

  const loggedIn = store.state.token

  if (authRequired && !loggedIn) {
    return next('/login')
  }
  next();
})