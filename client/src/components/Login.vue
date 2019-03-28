<!--
* Author: Nico Berchtold
* File name: Login.Vue
* Version: 1.0
* Description: Login for the
-->

<template>
  <div id="Login">
    <!-- If the user is not Logged in, show the Login-Form -->
    <v-container v-if="!isLoggedIn && !firstTime" fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs4>
          <v-card class="elevation-12">
            <v-toolbar color="#3E4955">
              <v-toolbar-title class="white--text">Welcome Back</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-text-field
                prepend-icon="person"
                name="login"
                label="Username"
                type="text"
                v-model="user.username"
                @keyup.enter="login()"
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                v-model="user.password"
                @keyup.enter="login()"
              ></v-text-field>
            </v-card-text>
            <v-flex xs12 offset-xs9>
              <v-btn class="white--text" color="#E7590C" @click="login()">Login</v-btn>
            </v-flex>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- If the user is Logged-in, say Hello -->
    <v-container v-else>
      <v-layout>
        <v-flex xs4 offset-xs4>
          <h1 class="text-md-center">Welcome Back</h1>
          <p class="text-md-center">Select a Chat</p>
        </v-flex>
      </v-layout>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :top="true"
      :multi-line="mode === 'multi-line'"
      :timeout="timeout"
      :vertical="mode === 'vertical'"
    >
      <v-icon class="error">error_outline</v-icon>
      {{ error }}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
// Import the API
import api from "../services/api.js";
import store from "@/store/store";

export default {
  name: "Login",
  data() {
    return {
      // Properties for the Snackbar
      snackbar: false,
      color: "red",
      mode: "",
      timeout: 6000,
      error: "",

      firstTime: false,

      user: {},
      isLoggedIn: store.state.token
    };
  },
  // All Functions
  methods: {
    // If the Username and Password field is filled out,
    // send the user to the backend
    login: async function() {
      if (this.user.username && this.user.password) {
        try {
          const response = await api().post("api/user/login", this.user);

          this.$store.dispatch("setUser", response.data.username);
          this.$store.dispatch("setUserID", response.data.userID);
          this.$store.dispatch("setToken", response.data.token);

          if (response.data.firstTime) {
            this.firstTime = true;
            this.$router.push({ path: "/new" });
          }
          this.$router.go({ path: "/" });
        } catch (error) {
          this.error = error.response.data.message;
          this.snackbar = true;
        }
      } else {
        this.error = "Bitte alle Felder ausfüllen";
        this.snackbar = true;
      }
    }
  }
};
</script>

<style scoped>
/* Styling for the Component */
.scroll {
  height: 100%;
  overflow-y: scroll;
}
.error {
  margin-right: 20px;
}
</style>
