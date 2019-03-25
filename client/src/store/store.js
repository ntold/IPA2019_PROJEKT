import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import api from "@/services/api.js";
import * as io from "socket.io-client";

let socket = io("http://localhost:4000/");

Vue.use(Vuex);

let store = new Vuex.Store({
  plugins: [
    createPersistedState({
      reducer: state => ({
        user: state.user,
        token: state.token,
        userID: state.userID,
        isLoggedIn: state.isLoggedIn
      })
    })
  ],
  state: {
    user: null,
    token: null,
    userID: null,
    isLoggedIn: false,

    // Define Rooms and Chats
    rooms: [],
    chats: [],

    // Url of current side
    url: "",

    // for Fetching Animation
    loadingStatus: 'notLoading',
    loadingStatusChats: 'notLoading',

    newMessage: []
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setUserID(state, userID) {
      state.userID = userID
    },

    setToken(state, token) {
      state.token = token
      if (token) {
        state.isLoggedIn = true
      } else {
        state.isLoggedIn = false
      }
    },

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

    //Set all Rooms in "Rooms"
    SET_ROOMS(state, rooms) {
      state.rooms = rooms
    },

    //Set all Chatas in "Chats"
    SET_CHATS(state, chats) {
      state.chats = chats
    },

    // Add a new Message Temp for RT
    ADD_CHAT(state, chats) {
      state.chats.push(chats)
    },

    NEW_MESSAGE(state, newMessage) {
      if (newMessage !== "clear") {
        if (state.newMessage.indexOf(newMessage)) {
          state.newMessage.push(newMessage)
        }
      } else {
        console.log("clear")
        const items = state.newMessage
        const valuesToRemove = [state.url]
        const filteredItems = items.filter(item => !valuesToRemove.includes(item))
        state.newMessage = filteredItems
      }

    }
  },
  actions: {
    setUser({ commit }, user) {
      commit('setUser', user)
    },
    setToken({ commit }, token) {
      commit('setToken', token)
    },
    setUserID({ commit }, userID) {
      commit('setUserID', userID)
    },

    setUrl(context, url) {
      context.commit('SET_URL', url)
    },

    addChat(context, chat) {
      context.commit('ADD_CHAT', chat)
    },


    // Fetch Groups
    async fetchGroups(context) {
      context.commit('SET_LOADING_STAUTS', 'loading')
      try {
        const response = await api().get(
          `/api/room/r/${this.state.userID}`
        );

        context.commit('SET_LOADING_STAUTS', 'notLoading')
        context.commit('SET_ROOMS', response.data)

      } catch (error) {

        store.dispatch("setToken", null);
        store.dispatch("setUser", null);
        store.dispatch("setUserID", null);

        // TODO:
        this.$router.go({
          path: "/login"
        });

      }
    },

    // Add Group
    async addGroup(context, room) {

    },

    // Fetch Chats
    async fetchChats(context, url) {
      context.commit('SET_LOADING_STAUTS_CHATS', 'loading')
      try {
        const response = await api().get(`/api/chat/${url}`);
        context.commit('SET_LOADING_STAUTS_CHATS', 'notLoading')
        // Connect to all Rooms
        store.dispatch("connectToRooms");
        context.commit('SET_CHATS', response.data)
      } catch (error) {
        console.log("error", error)
      }
    },

    // Send Message in Chat
    async sendMessage(context, chat) {
      try {
        await api().post("/api/chat", chat);
        socket.emit("save-message", chat);
      } catch (error) {
        console.log(error)
      }
    },

    // Connect to all Rooms
    connectToRooms() {
      // Leave and connect to all Rooms
      for (let i = 0; i < this.state.rooms.length; i++) {
        const id = this.state.rooms[i]._id;
        socket.emit("leave", id);
        socket.emit("create", id);
      }
    },

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
    let titel = `🎯 ${data.username} in ${data.room_name}`;
    new Notification(titel, options);
  }
}

socket.on("new-message", data => {
  if (data.message.room === store.state.url) {
    console.log(data.message)
    store.dispatch("addChat", data.message)
    sendNotification(data.message)
  } else {
    store.dispatch("newMessage", data.message.room)
    sendNotification(data.message)
  }

})

export default store