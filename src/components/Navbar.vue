<template>
  <nav v-if="!hide">
    <v-toolbar flat app dense>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <router-link to="/" tag="div">
        <v-toolbar-title class="text-uppercase pointer funky">{{ appName }}
          <span v-if="$isDebugEnv" class="yellow--text title">
            <span class="hidden-sm-and-up"> XSmall</span>          
            <span class="hidden-md-and-up hidden-xs-only"> Small</span>
            <span class="hidden-lg-and-up hidden-sm-and-down"> Medium</span>          
            <span class="hidden-xl-and-up hidden-xl-only hidden-md-and-down"> Large</span>          
            <span class="hidden-lg-and-down"> XLarge</span>          
          </span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-text-field 
        v-if="displaySearch"
        class="search-input"
        name="searchInput"
        append-icon="search"
        single-line
        solo
        @keyup.native="search"
        v-model="searchQuery"
      >
          <template v-slot:label>
            {{ searchLabel }}
          </template>      
      </v-text-field>
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
              <router-link :to="'/user/' + currentUserId">
                <v-list-tile-title class="accent--text">{{ currentUserUsername }}</v-list-tile-title>
              </router-link>
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
          :class="link.class + ' ' + ($route.path.indexOf(link.highlightRoute) > -1 ? 'secondary--text v-list__tile--active' : '')"
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
        <v-list-tile tabindex="0" @click="openThemeSettings">
          <v-list-tile-action>
            <v-icon>color_lens</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Change Theme</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile tabindex="0" @click="signout">
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
import getEnv from '@/utils/env.js';
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
      e.preventDefault();      
      if (e.key === "Enter") {
        router.push({ name: "search", params: { q: this.searchQuery } });
        this.searchQuery = "";
      }
    },
    openThemeSettings() {
      this.rightDrawer = !this.rightDrawer;
    }
  },
  watch: {
    $route(to) {
      var r = to.name;
      this.searchLabel = "Search All";
      switch(r) {
        case "artists":
        case "collections":
        case "genres":
        case "labels":
        case "playlists":
        case "releases":
        case "tracks":
          this.searchLabel = "Search " + r.charAt(0).toUpperCase() + r.slice(1);
          break;
      }      
    },
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
    displaySearch() {
      return true;
    },
    currentUserUsername() {
      return this.$store.state.isLoggedIn
        ? this.$store.getters.user.username
        : "";
    },
    currentUserId() {
      return this.$store.state.isLoggedIn
        ? this.$store.getters.userId
        : "";
    },
    appName() {
      return this.$store.state.isLoggedIn
        ? this.$store.getters.appName
        : getEnv('ROADIE_VUE_APP_NAME');      
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
      searchLabel: "Search All",
      drawer: false,
      searchQuery: "",
      rightDrawer: false,
      links: [
        { 
          icon: "dashboard", 
          text: "Dashboard", 
          route: "/",
          class: ""
        },
        { icon: "fas fa-users", 
          text: "Artists",       
          highlightRoute: "/artist/",   
          route: "/artists",
          class: ""          
        },
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
          highlightRoute: "/collection/",   
          route: "/collections"
        },
        {
          icon: "category",
          text: "Genres",
          class: "hidden-xs-and-down",
          highlightRoute: "/genre/",   
          route: "/genres"
        },
        {
          icon: "label",
          text: "Labels",
          class: "hidden-sm-and-down",
          highlightRoute: "/label/",   
          route: "/labels"
        },
        {
          icon: "playlist_play",
          text: "Playlists",
          class: "hidden-xs-and-down",
          highlightRoute: "/playlist/",
          route: "/playlists"
        },
        { 
          icon: "headset", 
          text: "Playing/Que", 
          route: "/playque",
          class: ""          
        },
        { 
          icon: "library_music", 
          text: "Releases", 
          highlightRoute: "/release/",            
          route: "/releases",
          class: ""          
        },
        {
          icon: "assessment",
          text: "Statistics",
          class: "hidden-md-and-down",
          route: "/statistics"
        },
        { 
          icon: "audiotrack", 
          text: "Tracks", 
          highlightRoute: "/track/",          
          route: "/tracks",
          class: ""          
        },
        { 
          icon: "supervised_user_circle", 
          text: "Users", 
          highlightRoute: "/user/",          
          route: "/users",
          class: "hidden-md-and-down"          
        }        
      ]
    };
  }
};
</script>

<style>
</style>