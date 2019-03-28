/*
 * Author:      Nico Berchtold
 * File name:   store.js
 * Version:     1.0
 * Description: Local State Management
 *              Stores all the Data at one Point
 *              Single Point of truth
 */

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import api from "@/services/api.js";
import { router } from '../router';
import * as io from "socket.io-client";

// All WebSocket Requets on port 4000
let socket = io("http://localhost:4000/");

Vue.use(Vuex);

let store = new Vuex.Store({
  plugins: [
    // Presistend States are saved in the localstorage
    createPersistedState({
      reducer: state => ({
        user: state.user,
        token: state.token,
        userID: state.userID,
        isLoggedIn: state.isLoggedIn,
      })
    })
  ],
  state: {
    // Define User Credentials
    user: null,
    token: null,
    userID: null,
    isLoggedIn: false,

    // Define Rooms, Chats and Users
    rooms: [],
    chats: [],
    users: [],

    // Url of current side
    url: "",

    // for Fetching Animation
    loadingStatus: 'notLoading',
    loadingStatusChats: 'notLoading',

    // All RoomIDs where an unseen message is
    newMessage: []
  },
  mutations: {
    //Set the User in the state "User"
    SET_USER(state, user) {
      state.user = user
    },
    //Set the UserID in the state "UserID"
    SET_USERID(state, userID) {
      state.userID = userID
    },

    //Set the Token in the state "Token"
    SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        state.isLoggedIn = true
      } else {
        state.isLoggedIn = false
      }
    },

    //Set the current URL in the state "url"
    SET_URL(state, url) {
      state.url = url
    },

    //Set Loading for Rooms and Chats
    SET_LOADING_STAUTS(state, status) {
      state.loadingStatus = status
    },
    SET_LOADING_STAUTS_CHATS(state, status) {
      state.loadingStatusChats = status
    },

    //Set all Rooms in the state "Rooms"
    SET_ROOMS(state, rooms) {
      state.rooms = rooms
    },

    //Set all Chats in the state "Chats"
    SET_CHATS(state, chats) {
      state.chats = chats
    },

    // Sets all Users in the state "Users"
    SET_USERS(state, users) {
      state.users = users
    },
    // Add a new Message to the state "Chats"
    ADD_CHAT(state, chats) {
      state.chats.push(chats)
    },

    // Add a Room to the state "Room"
    ADD_ROOM(state, room) {
      state.rooms.push(room)
    },

    // Checks if the Message is "clear", if not, push the message to the unread
    // messages --> newMessage
    // If the Message is "clear", remove the seen Room from the Array
    NEW_MESSAGE(state, newMessage) {
      if (newMessage !== "clear") {
        if (state.newMessage.indexOf(newMessage)) {
          state.newMessage.push(newMessage)
        }
      } else {
        const items = state.newMessage
        const valuesToRemove = [state.url]
        const filteredItems = items.filter(item => !valuesToRemove.includes(item))
        state.newMessage = filteredItems
      }

    }
  },
  actions: {
    // Send the User to the SET_USER Mutation
    setUser({ commit }, user) {
      commit('SET_USER', user)
    },

    // Send the Token to the SET_TOKE Mutation
    setToken({ commit }, token) {
      commit('SET_TOKEN', token)
    },

    // Send the UserID to the SET_USERID Mutation
    setUserID({ commit }, userID) {
      commit('SET_USERID', userID)
    },

    // Send the URL to the SET_URL Mutation
    setUrl(context, url) {
      context.commit('SET_URL', url)
    },

    // Send a new Message the ADD_CHAT Mutation
    addChat(context, chat) {
      context.commit('ADD_CHAT', chat)
    },

    // Fetch all Users
    async fetchUsers(context) {
      try {
        const respone = await api().get("/api/user")
        context.commit('SET_USERS', respone.data)
      } catch (error) {

      }
    },

    // Change password
    async changePassword(context, password) {
      try {
        console.log(password)
        const response = await api().post(`/api/user/pw/`, password)
        console.log(response)
      } catch (error) {
        console.log("error:", error)
      }
    },

    // Fetch all Rooms where the current User is in from the Backend
    async fetchRooms(context) {
      // While Fetching, set the LoadingStatus to Loading
      context.commit('SET_LOADING_STAUTS', 'loading')
      try {
        const response = await api().get(
          `/api/room/r/${this.state.userID}`
        );

        // Send the Rooms to the ROOM_Mutation
        context.commit('SET_LOADING_STAUTS', 'notLoading')
        context.commit('SET_ROOMS', response.data)

      } catch (error) {
        console.log(error);
        // If the access is denied, log out the User and redirect to the Login-Page 
        store.dispatch("setToken", null);
        store.dispatch("setUser", null);
        store.dispatch("setUserID", null);

        router.go({
          path: "/login"
        });

      }
    },

    // Send the room to the backend
    async addRoom(context, room) {
      try {
        const response = await api().post("/api/room", room)
        context.commit("ADD_ROOM", response.data)
      } catch (error) {
        console.log("error", error)
      }
    },

    // Delete a Room
    async deleteRoom(context, room) {
      try {
        await api().delete(`api/room/${room}`)

      } catch (error) {
        console.log(error)
      }
    },

    // Fetch all Messages from the current Room
    async fetchChats(context, url) {
      context.commit('SET_LOADING_STAUTS_CHATS', 'loading')
      try {
        const response = await api().get(`/api/message/${url}`);
        context.commit('SET_LOADING_STAUTS_CHATS', 'notLoading')
        // Connect to WebSockets
        store.dispatch("connectToRooms");
        // Send the Messages to the SET_CHATS Mutation
        context.commit('SET_CHATS', response.data)
      } catch (error) {
        console.log(error.message)

        router.go({
          path: "/login"
        });

      }
    },

    // Send Message in Chat and to the WebSocket
    async sendMessage(context, chat) {
      try {
        socket.emit("save-message", chat);
      } catch (error) {
        console.log(error)
      }
    },

    // Connect to all Sockets
    connectToRooms() {
      // Leave and connect to all Sockets
      for (let i = 0; i < this.state.rooms.length; i++) {
        const id = this.state.rooms[i]._id;
        socket.emit("leave", id);
        socket.emit("create", id);
      }
    },

    // Send the unseen RoomIDs to the NEW_MESSAGE Mutation
    newMessage(context, newMessage) {
      context.commit("NEW_MESSAGE", newMessage)
    }

  }
})

// Send Message
function sendNotification(data) {
  // Check if User is on side
  var hidden;
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
  }


  // Prepare Push Notifiaction
  let options = {
    body: data.message
  };

  // send message if a user is not in the side
  if (data.message.username != store.state.user && document[hidden]) {
    let titel = `🎯 ${data.username} in ${data.roomName}`;
    new Notification(titel, options);
  }
}

// Websocket listener
// If the User is currently on the Chat, send it to addChat, else
// send it to newMessage
socket.on("new-message", data => {
  if (data.message.roomID === store.state.url) {
    store.dispatch("addChat", data.message)
    sendNotification(data.message)
  } else {
    store.dispatch("newMessage", data.message.roomID)
    sendNotification(data.message)
  }

})

export default store