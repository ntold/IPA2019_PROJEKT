<!--
* Author: Nico Berchtold
* File name: App.Vue
* Version: 1.0
* Description: Main View
-->

<template>
  <v-app>
    <v-layout row>
      <v-flex xs1 v-if="isLoggedIn">
        <Sidebar class="Sidebar"></Sidebar>
      </v-flex>
      <v-flex xs2 v-if="isLoggedIn">
        <AllRooms class="AllRooms"></AllRooms>
      </v-flex>
      <v-flex xs12>
        <router-view class="RouterView" :key="$route.fullPath"></router-view>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
// Import the other Components
import AllRooms from "./components/AllRooms";
import Sidebar from "./components/Sidebar";
import store from "@/store/store";

export default {
  name: "App",
  components: {
    AllRooms,
    Sidebar
  },
  data() {
    return {
      isLoggedIn: store.state.token
    };
  }
};
</script>

<style>
#app {
  overflow: hidden;
}
.ChatRooms {
  height: 100%;
}
.Sidebar {
  height: 100%;
}
.RouterView {
  height: 100%;
}
</style>

