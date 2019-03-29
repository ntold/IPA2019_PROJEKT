<!--
* Author: Nico Berchtold
* File name: AllRooms.Vue
* Version: 1.0
* Description: Shows a Roomlist for all the Users Rooms
-->

<template>
  <v-layout id="ChatRooms">
    <v-flex xs12 colored>
      <div class="grey">
        <v-navigation-drawer permanent>
          <!-- Serachbox and Groupadd Function -->
          <v-toolbar color="#3e4955" flat mb-4>
            <v-flex xs10>
              <div class="searchContainer">
                <input type="text" class="searchBox" v-model="search" placeholder="Search">
                <v-icon class="searchIcon" color="#03841">search</v-icon>
              </div>
            </v-flex>
            <v-flex xs1>
              <v-btn icon ripple>
                <v-icon color="#A4B5C0" size="35" @click="addGroup()">group_add</v-icon>
              </v-btn>
            </v-flex>
          </v-toolbar>

          <v-divider color="#303841"></v-divider>

          <!-- List of all Rooms -->
          <v-list two-line dense class="pt-1">
            <!-- If the loadingStatus is true, show loading animation -->
            <div
              v-if="this.$store.state.loadingStatus == 'loading'"
              class="text-xs-center"
              style="margin-top:100px"
            >
              <!-- Loading Animation -->
              <v-progress-circular :size="50" :width="4" color="orange" indeterminate></v-progress-circular>
            </div>

            <!-- Creates a list for all Rooms -->
  <v-list-tile
    :class="{'activeRoom': item._id == $route.params.id,
    'new-Message': !newMessage.indexOf(item._id)}"
    class="hover"
    v-for="item in filteredRooms"
    v-bind:key="item.id"
  >
    <!-- If  the Chat is a Groupchat, show a Groupicon, else show a Usericon -->
    <v-list-tile-action v-if="item.isGroupchat === true">
      <v-icon color="white">group</v-icon>
    </v-list-tile-action>
    <v-list-tile-action v-else>
      <v-icon color="white">person</v-icon>
    </v-list-tile-action>

    <!-- Show a single Room with Name and Description-->
    <v-list-tile-content style="cursor: pointer" @click="goToRoom(item)">
      <v-list-tile-title class="white--text">
        <strong>{{ item.roomName }}</strong>
      </v-list-tile-title>
      <v-list-tile-sub-title class="white--text">{{ item.roomDescription }}</v-list-tile-sub-title>
    </v-list-tile-content>
  </v-list-tile>
          </v-list>
        </v-navigation-drawer>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
// Import mapState from Vuex to get all the States from the Store
import { mapState } from "vuex";

export default {
  name: "AllRooms",
  data() {
    return {
      // Value of the searchbar
      search: ""
    };
  },
  // All functions
  methods: {
    // Sends the room to the Store, where its going to the serve
    sendRoom: function() {
      this.$store.dispatch("addRoom", this.room);
    },
    // Navigates the user to a new room, with the RoomID and the RoomName
    goToRoom: function(item) {
      this.$router.push({
        path: `/chat/${item._id}/${item.roomName}`
      });
    },
    // Navigates the user to the CreateNewChat-Site
    addGroup: function() {
      this.$router.push({
        path: "/add"
      });
    },
    // Logout-Function, set all the presistend state values to null
    logout: function() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setUserID", null);
      this.$store.dispatch("setUrl", null);
      // Redirect to the login-page
      this.$router.go({
        path: "/login"
      });
    }
  },
  // Created() gets called when the site mounts
  // Runs the fetchRooms function in the Store
  created() {
    this.$store.dispatch("fetchRooms");
  },
  // Maps trough all the States in the Store and returns them
  computed: {
    ...mapState({
      newMessage: state => state.newMessage,
      rooms: state => state.rooms
    }),
    // Function to Search a Room
filteredRooms: function() {
  return this.rooms.filter(room => {
    // "i" means, it doenst matter if its upper or lower case
    var pattern = new RegExp(this.search, "i");
    return (
      // Searches for a RoomName or a RoomDescription
      room.roomName.match(pattern) || room.roomDescription.match(pattern)
    );
  });
}
  }
};
</script>


<style scoped>
/* Styling for the component */

#ChatRooms {
  min-height: 100%;
}

.v-navigation-drawer .v-list {
  background-color: #3e4955;
}

.flex.xs12.colored {
  background-color: #3e4955;
}

.searchContainer {
  margin-left: -10px;
  display: inline-flex;
  border: 1px solid #707070cc;
  border-radius: 25px;
  color: black;
  background-color: white;
  max-width: 12vw;
}

.searchBox {
  border: 0;
  padding: 0.5rem 0.5rem 0.5rem 0;
  margin-left: 10px;
  outline: none;
  max-width: 8vw;
}

.searchIcon {
  padding: 0.5rem;
  cursor: pointer;
}

.searchBox::placeholder {
  margin-left: 30px;
}
.activeRoom {
  border-left: 5px solid #22ffaa;
  background-color: #4e5864;
}

.new-Message {
  border-right: 5px solid #2196f3;
}

.hover:hover {
  background-color: #4e5864;
}
</style>
