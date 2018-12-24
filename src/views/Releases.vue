<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :toolbarIcon="'library_music'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator :items="items" :rows-per-page-items="rowsPerPageItems" :total-items="pagination.totalItems"  :pagination.sync="pagination" content-tag="v-layout" :loading="true" row wrap>
          <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
            <ReleaseCard :release="props.item"></ReleaseCard>
          </v-flex>
      </v-data-iterator>      
    </v-container> 
    <v-snackbar v-model="snackbar" color="success" :right=true :timeout=3000 :top=true>
      {{ snackbarText }}
      <v-btn color="black" flat @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import ReleaseCard from '@/components/ReleaseCard';
  import { EventBus } from '@/event-bus.js';

  export default {
    components: { ReleaseCard, Toolbar }, 
    created() {
      EventBus.$on('r:viewRandom', this.viewRandom);
      EventBus.$on('r:viewRecentlyAdded', this.viewRecentlyAdded);
      EventBus.$on('r:viewStarred', this.viewStarred);
      EventBus.$on('r:viewTopRated', this.viewTopRated);
      EventBus.$on('r:viewMostPlayed', this.viewMostPlayed);
      EventBus.$on('r:viewRecentlyPlayed', this.viewRecentlyPlayed);
      EventBus.$on('r:viewAll', this.viewAll);
      EventBus.$on('toolbarRefresh', this.updateData);
      EventBus.$on('r:favoriteToggle', (info) => this.favoriteToggle(info));    
      EventBus.$on('r:dislikeToggle', (info) => this.dislikeToggle(info)); 
    },    
    beforeDestroy() {
      EventBus.$off('r:viewRandom', this.viewRandom);
      EventBus.$off('r:viewRecentlyAdded', this.viewRecentlyAdded);
      EventBus.$off('r:viewStarred', this.viewStarred);
      EventBus.$off('r:viewTopRated', this.viewTopRated);
      EventBus.$off('r:viewMostPlayed', this.viewMostPlayed);
      EventBus.$off('r:viewRecentlyPlayed', this.viewRecentlyPlayed);
      EventBus.$off('r:viewAll', this.viewAll);
      EventBus.$off('toolbarRefresh', this.updateData);
      EventBus.$off('r:favoriteToggle');    
      EventBus.$off('r:dislikeToggle'); 

    },    
    async mounted() {
    },  
    methods: {
      resetView: function(){
          this.doRandomize = false;
          this.currentView = null;
          this.filterFavoriteOnly = false;
          this.pagination.sortOrder = "DESC";
          this.pagination.page = 1;
      },
      viewTopRated: function() {
          this.resetView();
          this.pagination.sortBy = "Rating";
          this.updateData();
      },      
      viewRandom: function() {
          this.resetView();        
          this.doRandomize = true;
          this.updateData();
      },      
      viewRecentlyAdded: function() {
          this.resetView();                
          this.pagination.sortBy = "CreatedDate";
          this.updateData();
      },
      viewMostPlayed: function() {
          this.resetView();                
          this.pagination.sortBy = "TrackPlayedCount";
          this.updateData();
      },      
      viewRecentlyPlayed: function() {
          this.resetView();                
          this.pagination.sortBy = "LastPlayed";
          this.updateData();
      },
      viewStarred: function() {
          this.resetView();                
          this.currentView = "favorite";          
          this.filterFavoriteOnly = true;          
          this.updateData();
      },        
      viewAll: function() {
          this.resetView();                
          this.pagination.sortBy = "Release.Text";
          this.pagination.sortOrder = "ASC";
          this.updateData();
      },      
      updateData: async function() {
        EventBus.$emit("loadingStarted"); 
          this.$axios.get(process.env.VUE_APP_API_URL + `/releases?page=${ this.pagination.page }&limit=${ this.pagination.rowsPerPage }&order=${ this.pagination.sortOrder  }&sort=${ this.pagination.sortBy }&doRandomize=${ this.doRandomize}&filterFavoriteOnly=${ this.filterFavoriteOnly}`)
          .then(response => {
            this.items = [];
            this.$nextTick(() => {
              this.items = response.data.rows;
              this.pagination.totalItems = response.data.totalCount;    
              EventBus.$emit("loadingComplete");    
            })
          });        
      },
      favoriteToggle: async function(toggleInfo) {
        var that = this;
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setReleaseFavorite/' + toggleInfo.releaseId + '/' + toggleInfo.isFavorite)
        .then(response => {
          if(response.data.isSuccess && toggleInfo.isFavorite) {
            that.snackbarText = "Release is now a favorite";
            that.snackbar = true;
          } else if (response.data.isSuccess) {
            that.snackbarText = "Release is no longer a favorite";
            that.snackbar = true;
          }
          if(that.currentView == "favorite") {
            this.$nextTick(() => {
              that.updateData();
            });
          }            
        });
      },
      dislikeToggle: async function(toggleInfo) {
        var that = this;
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setReleaseDisliked/' + toggleInfo.releaseId + '/' + toggleInfo.isDisliked)
        .then(response => {
          if(response.data.isSuccess && toggleInfo.isDisliked) {
              this.snackbarText = "You now hate this Release";
              this.snackbar = true;
          } else if (response.data.isSuccess) {
              this.snackbarText = "You no longer hate this Release";
              this.snackbar = true;
          }          
        });
      }          
    },
    watch: {
      pagination: { 
        async handler() {
            this.updateData();
        }
      }
    },
    data: () => ({
      rowsPerPageItems: [12, 36, 60, 120],
      doRandomize: true,
      filterFavoriteOnly: false,
      snackbar: false,
      snackbarText: "",
      currentView: "",
      pagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'ReleaseDate',
        sortOrder: "DESC"
      },
      selected: [],
      menuItems: [
        { title: "Favorite", class: "hidden-xs-only", click: "r:viewStarred" },
        { title: "Most Played", class: "hidden-sm-and-down", click: "r:viewMostPlayed" },       
        { title: "Random", class:"selected-toolbar-item", click: "r:viewRandom" },
        { title: "Recently Added", class: "hidden-xs-only", click:"r:viewRecentlyAdded" },
        { title: "Recently Played", class: "hidden-md-and-down", click: "r:viewRecentlyPlayed" },
        { title: "Top Rated", class: "hidden-sm-and-down", click: "r:viewTopRated" },
        { title: "All", class:"", click: "r:viewAll" }
      ],
      items: []
    })
  }
</script>

<style>
</style>
