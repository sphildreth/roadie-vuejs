<template>
  <v-app>
    <template>
      <v-app :dark="$vuetify.dark">
        <v-content>
          <v-container v-if="indexMessage">
            <v-card flat>
              <v-card-text v-html="indexMessage"></v-card-text>
            </v-card>
          </v-container>           
          <Navbar/>
          <div class="page-wrapper">
            <router-view></router-view>
          </div>
          <!-- App Footer -->
          <v-footer
            v-if="!hide"
            :dark="$vuetify.dark"
            height="auto"
            class="pa-3 app--footer"
          >
            <v-icon color="pink" class="mr-1 hidden-xs-only" small>fas fa-archive</v-icon>
            <span class="caption mr-1 hidden-xs-only">Last System Scan: {{ this.$store.getters.lastScanDate }}</span>
            <v-spacer></v-spacer>
            <a href="https://github.com/sphildreth/roadie-vuejs" style="color:white;" rel="noopener noreferrer" target="_blank"><span class="caption mr-1">v1.1.0</span></a>
          </v-footer>
          <v-bottom-sheet v-model="showPlayer" persistent full-width hide-overlay>
            <TrackPlayingCard></TrackPlayingCard>
          </v-bottom-sheet>
          <v-snackbar v-model="snackbarVisible" :color="snackbarColor" :timeout="3000" :top="true">
            {{ snackbarText }}
            <v-btn color="black" flat @click="snackbarVisible = false">Close</v-btn>
          </v-snackbar>          
        </v-content>
      </v-app>
    </template>
  </v-app>
</template>

<style>
@import "./assets/css/site.css";
</style>

<script>

import Navbar from "./components/Navbar";
import store from "@/store";
import TrackPlayingCard from "@/components/TrackPlayingCard.vue";
import { EventBus } from "@/event-bus.js";

export default {
  store,
  components: { Navbar, TrackPlayingCard },
  name: "App",
  beforeDestroy() {
    EventBus.$off("showSnackbar", info => this.showSnackbar(info));
  },  
  async mounted() {
    let that = this;
    this.$axios
      .get(
        window.location.protocol + "//" + window.location.host + "/messages/site_message.html"
      )
      .then(response => {
        that.indexMessage = response.data;  
      })
      .catch(function () {
        that.indexMessage = null;
    });       
  },  
  created() {
    EventBus.$on("showSnackbar", info => this.showSnackbar(info));
  },
  methods: {
    showSnackbar(info) {
      this.snackbarVisible = true;
      this.snackbarText = info.text;
      this.snackbarColor = info.color || "success";
    }
  },
  computed: {
    hide() {
      return this.$route.path === "/signin" || this.$route.path === "/register"  || this.$route.path === '/resetpassword';
    }
  },
  data: () => ({
    showPlayer: true,
    indexMessage: null,
    snackbarVisible: false,
    snackbarText: "",
    snackbarColor: "success"
  })
};
</script>

<style lang="stylus" scoped>
.setting-fab {
  top: 50% !important;
  right: 0;
  border-radius: 0;
}

.page-wrapper {
  min-height: calc(100vh - 64px - 50px - 81px);
}
footer { 
  margin-bottom: 105px;
}
</style>