<template>
  <nav v-if="!hide">
    <v-toolbar flat app  dense>
      <v-toolbar-side-icon @click="drawer = !drawer" ></v-toolbar-side-icon>
      <router-link to="/" tag="div">
        <v-toolbar-title class="text-uppercase pointer funky">          
          {{ appName }}
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
      <v-text-field
            label="Search"
            append-icon="search"
            single-line
            solo
            
            @keyup.native="search"
            v-model="searchQuery"
          ></v-text-field>
    </v-toolbar>
    <v-navigation-drawer class="app-side-drawer" app v-model="drawer"  disable-resize-watcher>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-img
                  :src="currentUserAvatarUrl"
                  :alt="currentUserUsername"
              ></v-img>                
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title class="accent--text">{{ currentUserUsername }}</v-list-tile-title>   
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar> 
      <v-divider></v-divider>     
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
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
        <v-list-tile @click="openThemeSettings" >
          <v-list-tile-action>
            <v-icon>color_lens</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Change Theme</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>        
        <v-list-tile @click="signout" >
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

import store from '@/store';
import router from '@/router';
import ThemeSettings from '@/components/ThemeSettings';
export default {
  store,
  router,
  components: { ThemeSettings }, 
  methods: {
    signout() {
      this.$store.dispatch('signout')
      this.$router.go('/');  
    },
    search(e) {
      if(e.key === "Enter") {
        router.push({ name: 'search', params: { q: this.searchQuery}});
        this.searchQuery = "";
      }
    },
    openThemeSettings () {
      this.rightDrawer = (!this.rightDrawer);
    }    
  },
  computed: {
    hide () {
      return this.$route.path === '/signin' || this.$route.path === '/register'; 
    },
    currentUserUsername () {
      return this.$store.state.isLoggedIn ? this.$store.getters.user.username : "";
    },
    currentUserAvatarUrl () {
      return this.$store.state.isLoggedIn ? this.$store.getters.user.avatarUrl : "";
    }
  },    
  data() {
    return {
      drawer: false,  
      searchQuery: "",
      rightDrawer: false,
      appName: process.env.VUE_APP_APP_NAME,
      links: [        
        { icon: 'dashboard', text: 'Dashboard', route: '/' },
        { icon: 'library_music', text: 'Releases', route: '/releases' },
        { icon: 'fas fa-users', text: 'Artists', route: '/artists' },
        { icon: 'bookmarks', text: 'Bookmarks', route: '/bookmarks' },
        { icon: 'collections', text: 'Collections', route: '/collections' },
        { icon: 'label', text: 'Labels', route: '/labels' },
        { icon: 'playlist_play', text: 'Playlists', route: '/playlists' },
        { icon: 'headset', text: 'Playing', route: '/playing' },
        { icon: 'assessment', text: 'Statistics', route: '/statistics' },        
        { icon: 'audiotrack', text: 'Tracks', route: '/tracks' }
      ]
    }
  }
}
</script>

<style>

</style>