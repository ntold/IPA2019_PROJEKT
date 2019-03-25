<template>
  <v-app>
    <v-layout row>
      <v-flex xs12>
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

        <v-card
          flat
          class="scroll-y chat"
          color="#607d8b"
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
                <!-- <strong>{{item.username}}</strong> -->
              </div>
              <div class="content">
                <p>{{item.message}}</p>
                <div class="date">
                  <!-- <v-icon small v-on:click="deleteMessage(item)">cleare</v-icon> -->
                  {{ item.created_date }}
                </div>
              </div>
            </div>
          </div>
        </v-card>
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
import api from "../services/api.js";
import { mapState } from "vuex";
var format = require("date-format");

export default {
  name: "chat",
  data() {
    return {
      // RoomID: this.$route.params.id,
      // RoomName: this.$route.params.roomname,

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
        room: this.$route.params.id,
        room_name: this.compRoomName,
        username: this.username,
        message: this.message,
        created_date: this.date
      };

      // Send new Message to Vuex
      this.$store.dispatch("sendMessage", chat);

      // Clear things up
      this.message = "";
    },
    deleteMessage: async function(item) {
      await api().delete(`/api/chat/${item._id}`);
    },
    deleteRoom: async function(item) {
      await api().delete(`/api/room/${this.$route.params.id}`);
      this.$router.go({
        path: "/"
      });
    }
  },
  created() {
    this.$store.dispatch("setUrl", this.$route.params.id);
    this.$store.dispatch("fetchChats", this.$route.params.id);

    if (!this.newMessage.indexOf(this.compRoomID)) {
      this.$store.dispatch("newMessage", "clear");
    }
  },
  computed: {
    ...mapState({
      newMessage: state => state.newMessage
    }),
    compRoomName: function() {
      var RoomName = this.$route.params.roomname;
      return RoomName;
    },
    compRoomID: function() {
      var RoomID = this.$route.params.id;
      return RoomID;
    },
    chats: function() {
      return this.$store.state.chats;
    }
  }
};
</script>

<style scoped>
.message-left {
  background: rgb(0, 130, 180);
  color: white;
  float: left;
  margin: 10px 0px 10px 20px;
  clear: both;
  border-radius: 30px;
}

.message-body {
  display: block;
  padding: 20px;
  margin-bottom: 2px;
}

.message-right {
  background: white;
  float: right;
  color: black;
  margin: 10px 20px 20px 0px;
  clear: both;
  border-radius: 30px;
}

.date {
  margin-top: -17px;
  text-align: right;
  font-size: 10px;
  font-style: italic;
}

.messageContainer {
  position: fixed;
  bottom: 0;
  width: 77vw;
  background-color: #607d8b;
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
  height: 73.5vh;
  padding-bottom: 10px;
}
</style>
