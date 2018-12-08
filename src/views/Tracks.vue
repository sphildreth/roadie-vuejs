<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :toolbarIcon="'audiotrack'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator :items="items" :rows-per-page-items="rowsPerPageItems" :total-items="pagination.totalItems"  :pagination.sync="pagination" content-tag="v-layout" :loading="true" row wrap>
          <v-flex slot="item" slot-scope="props" xs12 sm6>
            <TrackCard :track="props.item" :mediaNumber="props.item.mediaNumber" :release="props.item.release" :mediaCount="props.item.release.mediaCount"></TrackCard>
          </v-flex>
      </v-data-iterator>      
    </v-container> 
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import TrackCard from '@/components/TrackCard';
  import { EventBus } from '@/event-bus.js';

  export default {
    components: { TrackCard, Toolbar }, 
    created() {
      EventBus.$on('t:viewRandom', this.viewRandom);
      EventBus.$on('t:viewRecentlyAdded', this.viewRecentlyAdded);
      EventBus.$on('t:viewStarred', this.viewStarred);
      EventBus.$on('t:viewTopRated', this.viewTopRated);
      EventBus.$on('t:viewMostPlayed', this.viewMostPlayed);
      EventBus.$on('t:viewRecentlyPlayed', this.viewRecentlyPlayed);
      EventBus.$on('t:viewAll', this.viewAll);
      EventBus.$on('toolbarRefresh', this.updateData);
    },    
    async mounted() {
      this.viewRandom();
      EventBus.$on('t:ratingChange', (info) => this.ratingChange(info));   
      EventBus.$on('t:dislikeToggle', (info) => this.dislikeToggle(info));   
      EventBus.$on('t:favoriteToggle', (info) => this.favoriteToggle(info));    
    },  
    methods: {          
      resetView: function(){
          this.doRandomize = false;
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
          this.currentView = "favorite";
          this.resetView();                
          this.filterFavoriteOnly = true;          
          this.updateData();
      },        
      viewAll: function() {
          this.resetView();                
          this.pagination.sortBy = "CreatedDate";
          this.pagination.sortOrder = "ASC";
          this.updateData();
      },              
      updateData: async function() {
        EventBus.$emit("loadingStarted"); 
          this.$axios.get(process.env.VUE_APP_API_URL + `/tracks?page=${ this.pagination.page }&limit=${ this.pagination.rowsPerPage }&order=${ this.pagination.sortOrder  }&sort=${ this.pagination.sortBy }&doRandomize=${ this.doRandomize}&filterFavoriteOnly=${ this.filterFavoriteOnly}`)
          .then(response => {
            this.items = response.data.rows;
            this.pagination.totalItems = response.data.totalCount;    
            EventBus.$emit("loadingComplete");    
          });        
      },
      ratingChange: async function(changeInfo) {
        var that = this;
        if(changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackRating/' + changeInfo.releaseId + '/' + changeInfo.newVal)
          .then(response => {
              if(response.data.isSuccess && changeInfo.newVal > 0) {
                that.snackbarText = "Successfully set rating";
                that.snackbar = true;
              } else if (response.data.isSuccess) {
                that.snackbarText = "Successfully removed rating";
                that.snackbar = true;
              }
          });
        }
      },
      favoriteToggle: async function(toggleInfo) {
        var that = this;
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackFavorite/' + toggleInfo.releaseId + '/' + toggleInfo.isFavorite)
        .then(response => {
          if(response.data.isSuccess && toggleInfo.isFavorite > 0) {
            that.snackbarText = "Track is now a favorite";
            that.snackbar = true;
          } else if (response.data.isSuccess) {
            that.snackbarText = "Track is no longer a favorite";
            that.snackbar = true;
          }
          if(that.currentView == "favorite") {
            this.$nextTick(() => {
              that.updateData();
            });
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
      doRandomize: false,
      filterFavoriteOnly: false,      
      snackbar: false,
      snackbarText: "",      
      pagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'CreatedDate',
        sortOrder: "ASC"
      },
      currentView: "",      
      selected: [],
      menuItems: [
        { title: "Favorite", class: "hidden-xs-only", click: "t:viewStarred" },
        { title: "Most Played", class: "hidden-sm-and-down", click: "t:viewMostPlayed" },       
        { title: "Random", class:"selected-toolbar-item", click: "t:viewRandom" },
        { title: "Recently Added", class: "hidden-xs-only", click:"t:viewRecentlyAdded" },
        { title: "Recently Played", class: "hidden-md-and-down", click: "t:viewRecentlyPlayed" },
        { title: "Top Rated", class: "hidden-sm-and-down", click: "t:viewTopRated" },
        { title: "All", class:"", click: "t:viewAll" }
      ],
      items: []
    })
  }
</script>

<style>
</style>
