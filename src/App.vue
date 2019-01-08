<template>
  <v-app>
    <template>
      <v-app :dark="$vuetify.dark">
        <v-content>
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
            :style="{ marginBottom: (showPlayer ? 105 : 0) + 'px'  }"
          >
            <v-icon color="pink" class="mr-1" small>fas fa-archive</v-icon>
            <span class="caption mr-1">Last System Scan: {{ this.$store.getters.lastScanDate }}</span>
            <v-spacer></v-spacer>
            <span class="caption mr-1">Roadie v0.1 beta</span>
            <v-icon color="pink" small>fa fa-flask</v-icon>
          </v-footer>
          <v-bottom-sheet persistent full-width hide-overlay v-model="showPlayer">
            <TrackPlayingCard
              v-if="!hide && showPlayer"
              :track="currentTrack.track"
              :totalTime="totalQueTime"
              :listNumber="currentTrack.listNumber"
            ></TrackPlayingCard>
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
    currentTrack() {
      return this.$store && this.$store.getters.playQue[0];
    },
    totalQueTime() {
      return "00:00:00";
    },
    showPlayer() {
      return this.$store && this.$store.getters.playQue.length > 0;
    },
    hide() {
      return this.$route.path === "/signin" || this.$route.path === "/register"  || this.$route.path === '/resetpassword';
    }
  },
  data: () => ({
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
</style>