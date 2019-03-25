<template>
  <v-layout>
    <v-flex xs12 colored>
      <div class="grey">
        <v-navigation-drawer permanent>
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

          <v-list two-line dense class="pt-1">
            <div
              v-if="this.$store.state.loadingStatus == 'loading'"
              class="text-xs-center"
              style="margin-top:100px"
            >
              <v-progress-circular :size="50" :width="4" color="orange" indeterminate></v-progress-circular>
            </div>
            <v-list-tile
              :class="{'room': item._id == $route.params.id,
              'room-right': !newMessage.indexOf(item._id)}"
              class="hover"
              v-for="item in filteredRooms"
              v-bind:key="item.id"
            >
              <v-list-tile-action v-if="item.is_groupchat === true">
                <v-icon color="white">group</v-icon>
              </v-list-tile-action>
              <v-list-tile-action v-else>
                <v-icon color="white">person</v-icon>
              </v-list-tile-action>

              <v-list-tile-content style="cursor: pointer" @click="goRoom(item)">
                <v-list-tile-title class="white--text">
                  <strong>{{ item.room_name }}</strong>
                </v-list-tile-title>
                <v-list-tile-sub-title class="white--text">{{ item.room_description }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import * as io from "socket.io-client";
import { mapState } from "vuex";

export default {
  name: "AllRooms",
  data() {
    return {
      room: {},
      search: ""
    };
  },
  methods: {
    sendRoom: function() {
      api().post("/api/room", this.room);
    },
    goRoom: function(item) {
      this.$router.push({
        path: `/chat/${item._id}/${item.room_name}`
      });
    },
    addGroup: function() {
      this.$router.push({
        path: "/add"
      });
    },

    logout: function() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setUserID", null);
      this.$store.dispatch("setUrl", null);

      this.$router.go({
        path: "/login"
      });
    }
  },
  created() {
    this.$store.dispatch("fetchGroups");
  },
  computed: {
    ...mapState({
      newMessage: state => state.newMessage,
      rooms: state => state.rooms
    }),
    filteredRooms: function() {
      return this.rooms.filter(room => {
        var pattern = new RegExp(this.search, "i");
        return (
          room.room_name.match(pattern) || room.room_description.match(pattern)
        );
      });
    }
  }
};
</script>

<style scoped>
#ChatRooms {
  height: 100%;
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
.room {
  border-left: 5px solid #22ffaa;
  background-color: #4e5864;
}

.room-right {
  border-right: 5px solid #2196f3;
}

.hover:hover {
  background-color: #4e5864;
}
</style>
