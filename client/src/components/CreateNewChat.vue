<!--
* Author: Nico Berchtold
* File name: CreateNewChat.Vue
* Version: 1.0
* Description: Users can create new Rooms here
-->

<template>
  <v-app>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3 mt-5>
        <!-- Create new Room -->
        <v-card>
          <v-card-title>
            <h3>Create new Group / Chat</h3>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex xs8 sm8 md8>
              <!-- Values for the new Room -->
              <v-text-field label="Room Name" v-model="room.roomName"></v-text-field>
              <v-text-field label="Add a Room description!" v-model="room.roomDescription"></v-text-field>

              <!-- Select users for the Room -->
              <v-autocomplete
                v-model="room.roomUsersID"
                :items="users"
                item-text="username"
                item-value="_id"
                label="Users"
                clearable
                multiple
                class="mt-4"
                chips
              >
                <!-- Shows selected users -->
                <template slot="selection" slot-scope="data">
                  <v-chip :selected="data.selected" close @input="removeUser(data.item)">
                    <strong>{{ data.item.username }}</strong>
                  </v-chip>
                </template>
              </v-autocomplete>
              <!-- Add the new Room -->
              <v-btn @click="addRoom()" dark color="orange">Add Room</v-btn>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Popup Message -->
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :top="true"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :vertical="mode === 'vertical'"
    >
      {{ error }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
// Import mapState from Vuex to get all the States from the Store
import { mapState } from "vuex";

export default {
  data() {
    return {
      // Creating Room
      room: {},

      // If "true", Popupmessage will apear for 6 Seconds
      snackbar: false,
      color: "",
      mode: "",
      timeout: 6000,
      error: ""
    };
  },
  // Created() gets called when the site mounts
  // Runs the fetchUsers function in the Store
  created() {
    this.$store.dispatch("fetchUsers");
  },
  // All functions
  methods: {
    // Removes a selected User
    removeUser: function(item) {
      this.room.roomUsers.splice(this.room.roomUsers.indexOf(item), 1);
    },
    // Adds the room, if all fields are fild out
    addRoom: function() {
      if (this.room.roomName && this.room.roomDescription) {
        // If there are more Users in a Room then 2, its a Groupchat
        if (this.room.roomUsersID.length <= 2) {
          this.room.isGroupchat = false;
        } else {
          this.room.isGroupchat = true;
        }
        this.error = `${this.room.roomName} created!`;
        this.color = "green";
        this.snackbar = true;
        // Sends the Room to the Store
        this.$store.dispatch("addRoom", this.room);
        // After 1 Seconde, go to the Home Page
        setTimeout(() => {
          this.$router.go({
            path: "/"
          });
        }, 1000);
      } else {
        this.error = "Bitte alle Felder ausfüllen";
        this.color = "red";
        this.snackbar = true;
      }
    }
  },
  // Maps trough all the States in the Store and returns them
  computed: {
    ...mapState({
      users: state => state.users
    })
  }
};
</script>

<style>
</style>
