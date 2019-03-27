<template>
  <v-app>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3 mt-5>
        <v-card>
          <v-card-title>
            <h3>Create new Group / Chat</h3>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-flex xs8 sm8 md8>
              <v-text-field label="Room Name" v-model="room.room_name"></v-text-field>
              <v-text-field label="Add a Room description!" v-model="room.room_description"></v-text-field>

              <v-autocomplete
                v-model="room.room_Users"
                :items="users"
                item-text="username"
                item-value="_id"
                label="Who do you want to chat with?"
                clearable
                multiple
                class="mt-4"
                chips
              >
                <template slot="selection" slot-scope="data">
                  <v-chip :selected="data.selected" close @input="remove(data.item)">
                    <strong>{{ data.item.username }}</strong>&nbsp;
                    <span>(in16)</span>
                  </v-chip>
                </template>
              </v-autocomplete>
              <v-btn @click="add()" dark color="orange">Create!</v-btn>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
import api from "../services/api.js";

export default {
  data() {
    return {
      e1: 0,
      users: [],
      user: {},
      room: {},

      snackbar: false,
      color: "",
      mode: "",
      timeout: 6000,
      error: ""
    };
  },
  async created() {
    var response = await api().get("api/user");
    this.users = response.data;
  },
  methods: {
    remove: function(item) {
      this.room.room_Users.splice(this.room.room_Users.indexOf(item), 1);
    },
    add: function() {
      if (this.room.room_name && this.room.room_description) {
        if (this.room.room_Users.length >= 2) {
          this.room.is_groupchat = true;
        } else {
          this.room.is_groupchat = false;
        }
        this.error = `${this.room.room_name} has succ created!`;
        this.color = "green";
        this.snackbar = true;
        setTimeout(() => {
          api().post("/api/room", this.room);
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
  }
};
</script>

<style>
</style>
