<!--
* Author: Nico Berchtold
* File name: Chat.Vue
* Version: 1.0
* Description: Send and get Messages here
-->

<template>
  <v-app>
    <v-layout row>
      <v-flex xs12>
        <!-- Header -->
        <v-toolbar flat height="100">
          <v-menu right :nudge-width="200">
            <v-btn slot="activator" dark icon>
              <v-icon color="black">more_vert</v-icon>
            </v-btn>

            <v-list>
              <v-list-tile>
                <v-list-tile-title>Room {{compRoomName}}</v-list-tile-title>
              </v-list-tile>

              <v-divider></v-divider>

              <v-list-tile style="cursor:pointer" class="hoverDelete" @click="deleteRoom()">
                <v-list-tile-action>
                  <v-btn icon class="icon">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-title>Delete this Room</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <v-spacer></v-spacer>
          <v-toolbar-title>{{ compRoomName }}</v-toolbar-title>
        </v-toolbar>
        <v-divider></v-divider>
        <!-- Chat -->
        <v-card
          flat
          class="scroll-y chat"
          color="#DADDDD"
          v-chat-scroll="{always: false, smooth: true}"
        >
          <div
            v-if="this.$store.state.loadingStatus == 'loading'"
            class="text-xs-center"
            style="margin-top:100px"
          >
            <v-progress-circular :size="50" :width="4" color="orange" indeterminate></v-progress-circular>
          </div>

          <div
            :class="{'message-right': item.username === username, 'message-left': item.username !== username}"
            v-for="item in chats"
            v-bind:key="item.id"
          >
            <div class="message-body">
              <div class="header">
                <b>{{item.username}}</b>
              </div>
              <div class="content">
                <p>{{item.message}}</p>
                <div class="date">{{ item.createdDate }}</div>
              </div>
            </div>
          </div>
        </v-card>
        <!-- New Message -->
        <div class="messageContainer">
          <div class="sendContainer">
            <input
              type="text"
              class="messageBox"
              v-model="message"
              placeholder="Type to enter a Message..."
              @keyup.enter="sendMessage()"
            >
          </div>
          <v-icon color="orange" class="sendIcon">send</v-icon>
        </div>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
// Import mapState from Vuex to get all the States from the Store
import { mapState } from "vuex";
import { router } from "../router";
var format = require("date-format");

export default {
  name: "chat",
  data() {
    return {
      username: this.$store.state.user,
      message: "",
      typing: "",
      date: format("hh:mm - dd.MM", new Date())
    };
  },
  methods: {
    sendMessage: async function() {
      // Prepare Message
      let chat = {
        roomID: this.$route.params.id,
        roomName: this.compRoomName,
        username: this.username,
        message: this.message,
        createdDate: this.date
      };

      // Send new Message to the Store
      this.$store.dispatch("sendMessage", chat);

      // Clear things up
      this.message = "";
    },
    deleteRoom: function() {
      this.$store.dispatch("deleteRoom", this.$route.params.id);
      router.go({
        path: "/"
      });
    }
  },
  // Created() gets called when the site mounts
  // Runs the fetchChat and setURL function in the Store
  // Sends a "clear-message" if the "unseen room" (unseen message
  // in this room) has been entered
  created() {
    this.$store.dispatch("setUrl", this.$route.params.id);
    this.$store.dispatch("fetchChats", this.$route.params.id);

    if (!this.newMessage.indexOf(this.compRoomID)) {
      this.$store.dispatch("newMessage", "clear");
    }
  },
  computed: {
    // Maps trough all the States in the Store and returns them
    ...mapState({
      newMessage: state => state.newMessage,
      chats: state => state.chats
    }),
    // Get the latest Roomname from the URL
    compRoomName: function() {
      var RoomName = this.$route.params.roomname;
      return RoomName;
    },
    // Get the latest RooID from the URL
    compRoomID: function() {
      var RoomID = this.$route.params.id;
      return RoomID;
    }
  }
};
</script>

<style scoped>
/* Styling for the component */

.message-left {
  background: rgb(0, 130, 180);
  color: white;
  float: left;
  margin: 10px 0px 10px 20px;
  clear: both;
  border-radius: 30px !important;
}

.message-body {
  display: block;
  padding: 20px;
  margin-bottom: 2px;
  font-size: 18px;
}

.message-right {
  background: white;
  float: right;
  color: black;
  margin: 10px 20px 20px 0px;
  clear: both;
  border-radius: 30px !important;
}

.date {
  margin-top: -17px;
  text-align: right;
  font-size: 10px;
  font-style: italic;
  color: lightgrey;
}

.messageContainer {
  position: fixed;
  bottom: 0;
  width: 77vw;
  background-color: #dadddd;
  display: inline-flex;
}

.sendContainer {
  position: relative;
  border: 1px solid #707070cc;
  border-radius: 25px;
  color: black;
  background-color: white;
  padding: 0.5em;
  margin: 25px;
  max-width: 68vw;
  flex-grow: 1;
}

.messageBox {
  border: 0;
  padding: 0.5rem 0.5rem 0.5rem 0;
  min-width: 65vw;
  margin-left: 15px;
  outline: none;
}

.sendIcon {
  font-size: 40px;
}

.hoverDelete:hover {
  background-color: whitesmoke;
}

.chat {
  height: 75vh;
  padding-bottom: 10px;
}

.header {
  font-size: 10px;
}
</style>
