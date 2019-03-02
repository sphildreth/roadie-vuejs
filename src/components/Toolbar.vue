<template>
    <nav>
    <v-toolbar class="" dense>
      <v-icon v-html="toolbarIcon"></v-icon>
      <v-toolbar-items>
        <v-btn :title="item.tooltip || item.title" flat v-for="item in allowedMenuItems" :class="item.class" :key="item.title" :data-eventmessage="item.click" @click="clicked">
          {{ item.title }}
        </v-btn>        
      </v-toolbar-items>
      <v-spacer></v-spacer>                                                                                     
      <v-toolbar-items>
        <v-btn icon v-if="loading">
          <img src="@/assets/img/loading.gif" alt="Loading..." class="loading">
        </v-btn>  
        <div v-if="searchItems"  class="hidden-xs-only">
          <v-menu bottom left>
            <v-btn slot="activator" icon>
              <v-icon title="Search Options">fas fa-search-plus</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile v-for="(item, i) in searchItems" :key="i" :data-eventmessage="item.click" @click="searchMenuClicked">
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>        
        </div>            
        <v-btn v-if="doShowBookmark" icon data-eventmessage="bookmarkToogle" @click="bookmarkToogle">
          <v-icon v-if="bookmarked" color="info" title="Click to remove from bookmarks">bookmark</v-icon>
          <v-icon v-if="!bookmarked" title="Add to bookmarks">bookmark_border</v-icon>
        </v-btn>    
        <v-btn v-if="doShowFavorite" icon data-eventmessage="favoriteToogle" @click="favoriteToogle">
          <v-icon v-if="favorited" color="red" title="Click to remove from favorites">fas fa-heart</v-icon>
          <v-icon v-if="!favorited" title="Add to favorites">far fa-heart</v-icon>
        </v-btn>          
        <v-btn v-if="doShowHated" icon data-eventmessage="hateToogle" @click="hateToogle">
          <v-icon v-if="hated" color="lime" title="Click to remove hate">fas fa-thumbs-down</v-icon>
          <v-icon v-if="!hated" title="Click to hate">far fa-thumbs-down</v-icon>
        </v-btn>                       
        <v-btn class="hidden-xs-only" v-if="doShowRefresh" icon data-eventmessage="toolbarRefresh" @click="refreshClicked">
          <v-icon title="Refresh">refresh</v-icon>
        </v-btn>        
        <v-menu bottom left class="hidden-lg-and-up">
          <v-btn slot="activator" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-for="(item, index) in menuItems" :data-eventmessage="item.click" @click="clicked" :key="index">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>      
        <v-menu v-if="adminItems.length > 0" bottom left class="warning">
          <v-btn slot="activator" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile :class="item.class" @click="clicked" :data-eventmessage="item.click" v-for="(item, index) in adminItems" :key="index">
              <v-list-tile-title >{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>            
      </v-toolbar-items>      
    </v-toolbar>
    </nav>
</template>

<script>

import { EventBus } from '@/event-bus.js';

export default {
    name: 'Toolbar',
    props:  {
      menuItems: Array,
      searchItems: Array,
      toolbarIcon: String,
      doMenuSelected: Boolean,
      doShowBookmark: Boolean,
      doShowFavorite: Boolean,
      doShowHated: Boolean,
      doShowRefresh: {
        type: Boolean,
        default: true
      },
      bookmarked: Boolean,
      favorited: Boolean,
      hated: Boolean,
      adminItems: {
        type: Array,
        default: () => []
      },
      hasDeleteRights: Boolean,
      hasEditRights: Boolean
    },
    computed: {
      allowedMenuItems() {
        var items = [];
        this.menuItems.forEach(mi => {
          if(mi.permission === "delete" && !this.hasDeleteRights) {
            return;
          }
          if(mi.permission === "edit" && !this.hasEditRights) {
            return;
          }
          items.push(mi);
        });
        return items;
      }
    },
    async mounted() {  
      EventBus.$on('loadingStarted', () =>{ this.loading = true; }); 
      EventBus.$on('loadingComplete', () =>{ this.loading = false; });      
    },      
    methods: {
      refreshClicked: function(e) {
        EventBus.$emit(e.currentTarget.dataset.eventmessage);
      },
      bookmarkToogle: function(e) {
        EventBus.$emit(e.currentTarget.dataset.eventmessage);
      },      
      favoriteToogle: function(e) {
        EventBus.$emit(e.currentTarget.dataset.eventmessage);
      },     
      hateToogle: function(e) {
        EventBus.$emit(e.currentTarget.dataset.eventmessage);
      },          
      clicked: function(e) {
        if(this.doMenuSelected) {
          var elements = document.getElementsByClassName('selected-toolbar-item');
          while(elements.length > 0){
            elements[0].classList.remove('selected-toolbar-item');
          }
          e.currentTarget.classList.add("selected-toolbar-item");
        }
        EventBus.$emit(e.currentTarget.dataset.eventmessage);
      },
      searchMenuClicked: function(e) {
        EventBus.$emit(e.currentTarget.dataset.eventmessage);
      }
    },
    data: () => ({
      loading: true
    })
}
</script>

<style>
  img.loading {
    height: 30px;
  }
</style>