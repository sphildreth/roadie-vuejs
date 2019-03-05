<template>
  <nav v-if="!hide">
    <v-toolbar flat app dense>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/" tag="div">
        <v-toolbar-title class="text-uppercase pointer funky">{{ appName }}</v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-text-field 
        class="search-input"
        label="Search"
        append-icon="search"
        single-line
        solo
        @keyup.native="search"
        v-model="searchQuery"
      ></v-text-field>
      <v-icon
        @click="showHelp"
        class="ml-1 pointer"
        title="Frequently Asked Questions and Help"
      >help</v-icon>
    </v-toolbar>
    <v-navigation-drawer class="app-side-drawer" app v-model="drawer" disable-resize-watcher>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-img :src="currentUserAvatarUrl" :alt="currentUserUsername"></v-img>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="accent--text">{{ currentUserUsername }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile to="/admin" v-if="isAdmin">
          <v-list-tile-action>
            <v-icon>fas fa-cogs</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Admin</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          v-for="link in links"
          :class="link.class"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile to="/accountSettings">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Account Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="openThemeSettings">
          <v-list-tile-action>
            <v-icon>color_lens</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Change Theme</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="signout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      class="setting-drawer"
      temporary
      right
      v-model="rightDrawer"
      hide-overlay
      fixed
    >
      <theme-settings></theme-settings>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import store from "@/store";
import router from "@/router";
import ThemeSettings from "@/components/ThemeSettings";
export default {
  store,
  router,
  components: { ThemeSettings },
  methods: {
    showHelp() {
      this.$router.push("/help");
    },
    signout() {
      this.$store.dispatch("signout");
      this.$router.go("/signin");
    },
    search(e) {
      if (e.key === "Enter") {
        router.push({ name: "search", params: { q: this.searchQuery } });
        this.searchQuery = "";
      }
    },
    openThemeSettings() {
      this.rightDrawer = !this.rightDrawer;
    }
  },
  computed: {
    hide() {
      return (
        this.$store.getters.isFullscreen ||
        this.$route.path === "/signin" ||
        this.$route.path === "/register" ||
        this.$route.path === "/resetpassword"
      );
    },
    currentUserUsername() {
      return this.$store.state.isLoggedIn
        ? this.$store.getters.user.username
        : "";
    },
    currentUserAvatarUrl() {
      return this.$store.getters.usersAvatarUrl;
    },
    isAdmin() {
      return this.$store.state.isLoggedIn && this.$store.getters.isUserAdmin;
    }
  },
  data() {
    return {
      drawer: false,
      searchQuery: "",
      rightDrawer: false,
      appName: process.env.VUE_APP_APP_NAME,
      links: [
        { icon: "dashboard", text: "Dashboard", route: "/" },
        { icon: "fas fa-users", text: "Artists", route: "/artists" },
        {
          icon: "bookmarks",
          text: "Bookmarks",
          class: "hidden-xs-and-down",
          route: "/bookmarks"
        },
        {
          icon: "collections",
          text: "Collections",
          class: "hidden-xs-and-down",
          route: "/collections"
        },
        {
          icon: "category",
          text: "Genres",
          class: "hidden-xs-and-down",
          route: "/genres"
        },
        {
          icon: "label",
          text: "Labels",
          class: "hidden-sm-and-down",
          route: "/labels"
        },
        {
          icon: "playlist_play",
          text: "Playlists",
          class: "hidden-xs-and-down",
          route: "/playlists"
        },
        { icon: "headset", text: "Playing/Que", route: "/playque" },
        { icon: "library_music", text: "Releases", route: "/releases" },
        {
          icon: "assessment",
          text: "Statistics",
          class: "hidden-md-and-down",
          route: "/statistics"
        },
        { icon: "audiotrack", text: "Tracks", route: "/tracks" }
      ]
    };
  }
};
</script>

<style>
</style>