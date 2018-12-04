<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :toolbarIcon="'fas' +' '+ 'fa-users'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator :items="items" :rows-per-page-items="rowsPerPageItems" :total-items="pagination.totalItems"  :pagination.sync="pagination" content-tag="v-layout" :loading="true" row wrap>
          <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
            <ArtistCard :artist="props.item"></ArtistCard>
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
  import ArtistCard from '@/components/ArtistCard';
  import { EventBus } from '@/event-bus.js';

  export default {
    components: { ArtistCard, Toolbar }, 
    created() {
      EventBus.$on('a:viewRandom', this.viewRandom);
      EventBus.$on('a:viewRecentlyAdded', this.viewRecentlyAdded);
      EventBus.$on('a:viewStarred', this.viewStarred);
      EventBus.$on('a:viewTopRated', this.viewTopRated);
      EventBus.$on('a:viewMostPlayed', this.viewMostPlayed);
      EventBus.$on('a:viewRecentlyPlayed', this.viewRecentlyPlayed);
      EventBus.$on('a:viewAll', this.viewAll);
      EventBus.$on('toolbarRefresh', this.updateData);
    },    
    async mounted() {
      this.viewRandom();
      EventBus.$on('a:ratingChange', (info) => this.ratingChange(info));      
      EventBus.$on('a:favoriteToggle', (info) => this.favoriteToggle(info));      
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
          this.pagination.sortBy = "PlayedCount";
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
          this.pagination.sortBy = "Artist.Text";
          this.pagination.sortOrder = "ASC";
          this.updateData();
      },      
      updateData: async function() {
        EventBus.$emit("loadingStarted"); 
          this.$axios.get(process.env.VUE_APP_API_URL + `/artists?page=${ this.pagination.page }&limit=${ this.pagination.rowsPerPage }&order=${ this.pagination.sortOrder  }&sort=${ this.pagination.sortBy }&doRandomize=${ this.doRandomize}&filterFavoriteOnly=${ this.filterFavoriteOnly}`)
          .then(response => {
            var items = [];
            response.data.rows.forEach(function(row) {
              items.push({
                id:  row.id,
                thumbnail: row.thumbnail.url,
                name: row.artist.text,
                playedCount: row.playedCount,
                trackCount: row.trackCount,
                releaseCount: row.releaseCount,
                rating: row.rating,
                isFavorite: row.userRating ? row.userRating.isFavorite : false
              })
            });
            this.items = items;
            this.pagination.totalItems = response.data.totalCount;    
            EventBus.$emit("loadingComplete");    
          });        
      },
      ratingChange: async function(changeInfo) {
        var that = this;
        if(changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(process.env.VUE_APP_API_URL + '/users/setArtistRating/' + changeInfo.artistId + '/' + changeInfo.newVal)
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
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setArtistFavorite/' + toggleInfo.artistId + '/' + toggleInfo.isFavorite)
        .then(response => {
          if(response.data.isSuccess && toggleInfo.isFavorite > 0) {
            that.snackbarText = "Artist is now a favorite";
            that.snackbar = true;
          } else if (response.data.isSuccess) {
            that.snackbarText = "Artist is no longer a favorite";
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
      currentView: "",
      pagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'CreatedDate',
        sortOrder: "DESC"
      },
      selected: [],
      menuItems: [
        { title: "Favorite", class: "hidden-xs-only", click: "a:viewStarred" },
        { title: "Most Played", class: "hidden-sm-and-down", click: "a:viewMostPlayed" },       
        { title: "Random", class:"selected-toolbar-item", click: "a:viewRandom" },
        { title: "Recently Added", class: "hidden-xs-only", click:"a:viewRecentlyAdded" },
        { title: "Recently Played", class: "hidden-md-and-down", click: "a:viewRecentlyPlayed" },
        { title: "Top Rated", class: "hidden-sm-and-down", click: "a:viewTopRated" },
        { title: "All", class:"", click: "a:viewAll" }
      ],
      items: []
    })
  }
</script>

<style>
  .artist-name { 
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 190px;
  }
</style>
