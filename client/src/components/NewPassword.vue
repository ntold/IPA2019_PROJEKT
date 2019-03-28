<!--
* Author: Nico Berchtold
* File name: NewPassword.Vue
* Version: 1.0
* Description: Users can create new Rooms here
-->

<template>
  <v-app>
    <v-layout>
      <v-flex xs12 sm4 offset-sm3 mt-5>
        <!-- Create new Room -->
        <v-card>
          <v-card-title>
            <h3>Change Password</h3>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex xs8 sm8 md8>
              <!-- Values for the new Room -->
              <v-text-field label="New Password" type="password" v-model="password1"></v-text-field>
              <v-text-field
                label="Confirm Passowrd"
                type="password"
                v-model="password2"
                @keyup.enter="changePassword()"
              ></v-text-field>
              <v-btn @click="changePassword()" dark color="orange">Change Password</v-btn>
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
export default {
  data() {
    return {
      password1: "",
      password2: "",

      // If "true", Popupmessage will apear for 6 Seconds
      snackbar: false,
      color: "",
      mode: "",
      timeout: 6000,
      error: ""
    };
  },

  // All functions
  methods: {
    changePassword: function() {
      if (this.password1 === this.password2) {
        let password = {
          userID: this.$store.state.userID,
          password: this.password2
        };
        this.$store.dispatch("changePassword", password);
        this.$router.go({ path: "/" });
      } else {
        this.error = "Passwörter stimmen nicht überein";
        this.color = "red";
        this.snackbar = true;
      }
    }
  }
};
</script>

<style>
</style>
