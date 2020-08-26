<!--
* Author: Nico Berchtold
* File name: Sidebar.Vue
* Version: 1.0
* Description: Sidebar with the menu and the profile picture
-->

<template>
  <div id="Sidebar">
    <v-layout align-center justify-space-around wrap pt-4>
      <div class="text-xs-center">
        <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" offset-x>
          <v-btn slot="activator" fab icon x-large>
            <!-- Profilpic -->
            <v-avatar color="grey" size="50px">
              <span class="white--text headline">{{username.charAt(4)}}</span>
            </v-avatar>
          </v-btn>
          <!-- Menu -->
          <v-card>
            <v-list>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{username}}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    <input type="text" style="outline: none" v-model="status">
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>

            <v-divider></v-divider>

            <v-list>
              <v-list-tile>
                <v-list-tile-action>
                  <v-switch v-model="notifications" color="orange"></v-switch>
                </v-list-tile-action>
                <v-list-tile-title>Enable push notifications</v-list-tile-title>
              </v-list-tile>

              <v-list-tile style="cursor:pointer" class="hover" @click="goToChange()">
                <v-list-tile-action>
                  <v-btn icon class="icon">
                    <v-icon>settings</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-title>Change Password</v-list-tile-title>
              </v-list-tile>

              <v-divider></v-divider>

              <v-list-tile style="cursor:pointer" class="hover" @click="logout()">
                <v-list-tile-action>
                  <v-btn icon class="icon">
                    <v-icon color="red">exit_to_app</v-icon>
                  </v-btn>
                </v-list-tile-action>
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </v-layout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: this.$store.state.user,
      menu: false,
      notifications: false,
      status: "Focused 🎯"
    };
  },
  methods: {
    setNotification: function(permission) {
      this.notifications = permission;
    },
    logout: function() {
      this.$store.dispatch("setToken", null);
      this.$store.dispatch("setUser", null);
      this.$store.dispatch("setUserID", null);

      this.$router.go({
        path: "/login"
      });
    },
    goToChange: function() {
      this.$router.push({
        path: "/new"
      });
    }
  },
  created() {
    if (Notification.permission === "granted") {
      this.notifications = true;
    }
  },
  watch: {
    notifications() {
      if (this.notifications === true) {
        if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
              this.setNotification(false);
            } else {
              this.setNotification(true);
            }
          });
        }
      }
    }
  }
};
</script>

<style scoped>
#Sidebar {
  height: 100%;
  background-color: #303841;
}
.logout {
  position: absolute;
  bottom: 0;
  margin-bottom: 30px;
  margin-left: 35px;
}

.icon {
  margin-left: 2px;
}
.hover:hover {
  background-color: whitesmoke;
}
</style>
