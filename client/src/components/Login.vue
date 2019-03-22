<template>
  <div id="Login">
    <v-container v-if="!isLoggedIn" fluid fill-height>
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
import api from "../services/api.js";
import store from "@/store/index";

export default {
  name: "Login",
  data() {
    return {
      snackbar: false,
      color: "red",
      mode: "",
      timeout: 6000,
      error: "",

      user: {},
      isLoggedIn: store.state.token
    };
  },
  methods: {
    login: async function() {
      if (this.user.username && this.user.password) {
        try {
          const response = await api().post("api/user/login", this.user);

          this.$store.dispatch("setUser", response.data.username);
          this.$store.dispatch("setUserID", response.data.userID);
          this.$store.dispatch("setToken", response.data.token);

          this.$router.go({ path: "/home" });
        } catch (error) {
          this.error = error.response.data.message;
          this.snackbar = true;
        }
      } else {
        this.error = "Bitte alle Felder ausfüllen";
        this.snackbar = true;
      }
    }
  },
  created() {}
};
</script>

<style>
.scroll {
  height: 100%;
  overflow-y: scroll;
}
.error {
  margin-right: 20px;
}
</style>
