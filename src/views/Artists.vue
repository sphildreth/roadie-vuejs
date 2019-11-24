<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected="true" :toolbarIcon="'fas' +' '+ 'fa-users'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator
        :items="items"
        :rows-per-page-items="this.$store.getters.rowsPerPageItems"
        :total-items="pagination.totalItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
          <ArtistCard :artist="props.item"></ArtistCard>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ArtistCard from "@/components/ArtistCard";
import { EventBus } from "@/event-bus.js";

import artistMixin from "@/mixins/artist.js";

export default {
  mixins: [artistMixin],
  components: { ArtistCard, Toolbar },
  props: {
    view: String
  },  
  created() {
    this.pagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;

    EventBus.$on("a:viewRandom", this.viewRandom);
    EventBus.$on("a:viewRecentlyAdded", this.viewRecentlyAdded);
    EventBus.$on("a:viewStarred", this.viewStarred);
    EventBus.$on("a:viewTopRated", this.viewTopRated);
    EventBus.$on("a:viewTopRanked", this.viewTopRanked);
    EventBus.$on("a:viewMostPlayed", this.viewMostPlayed);
    EventBus.$on("a:viewMostReleases", this.viewMostReleases);
    EventBus.$on("a:viewMostTracks", this.viewMostTracks);
    EventBus.$on("a:viewRecentlyPlayed", this.viewRecentlyPlayed);
    EventBus.$on("a:viewAll", this.viewAll);
    EventBus.$on("toolbarRefresh", this.updateData);

    EventBus.$on("a:favoriteToggle", info => this.toggleFavorite(info));
    EventBus.$on("a:dislikeToggle", info => this.toggleDislike(info));
  },
  beforeDestroy() {
    EventBus.$off("a:viewRandom", this.viewRandom);
    EventBus.$off("a:viewRecentlyAdded", this.viewRecentlyAdded);
    EventBus.$off("a:viewStarred", this.viewStarred);
    EventBus.$off("a:viewTopRated", this.viewTopRated);
    EventBus.$off("a:viewTopRanked", this.viewTopRanked);
    EventBus.$off("a:viewMostPlayed", this.viewMostPlayed);
    EventBus.$off("a:viewMostReleases", this.viewMostReleases);
    EventBus.$off("a:viewMostTracks", this.viewMostTracks);    
    EventBus.$off("a:viewRecentlyPlayed", this.viewRecentlyPlayed);
    EventBus.$off("a:viewAll", this.viewAll);
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("a:favoriteToggle");
    EventBus.$off("a:dislikeToggle");
  },
  mounted() {
    if(this.view) {
      switch (this.view) {
        case "recentlyadded":
          document.querySelectorAll('[data-eventmessage="a:viewRecentlyAdded"]')[0].click();          
          break;      
        default:
          document.querySelectorAll('[data-eventmessage="a:viewRandom"]')[0].click();   
          break;
      }
    }
  },
  methods: {
    resetView: function() {
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
    viewTopRanked: function() {
      this.resetView();
      this.pagination.sortBy = "Rank";
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
    viewMostReleases: function() {
      this.resetView();
      this.pagination.sortBy = "ReleaseCount";
      this.updateData();
    },
    viewMostTracks: function() {
      this.resetView();
      this.pagination.sortBy = "TrackCount";
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
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/artists?page=${this.pagination.page}&limit=${
              this.pagination.rowsPerPage
            }&order=${this.pagination.sortOrder}&sort=${
              this.pagination.sortBy
            }&doRandomize=${this.doRandomize}&filterFavoriteOnly=${
              this.filterFavoriteOnly
            }`
        )
        .then(response => {
          this.items = [];
          this.$nextTick(() => {
            this.items = response.data.rows;
            this.pagination.totalItems = response.data.totalCount;
            EventBus.$emit("loadingComplete");
          });
        });
    },
    toggleFavorite: async function(toggleInfo) {
      this.artistFavoriteToggle(toggleInfo).then(() => {
        if (this.currentView == "favorite") {
          this.$nextTick(() => {
            this.updateData();
          });
        }
      });
    },
    toggleDislike: async function(toggleInfo) {
      this.artistDislikeToggle(toggleInfo);
    }
  },
  watch: {
    pagination: {
      async handler() {
        this.updateData();
      }
    },
    $route(to) {
      this.view = to.params.view;
      if(this.view) {
        switch (this.view) {
          case "recentlyadded":
            document.querySelectorAll('[data-eventmessage="a:viewRecentlyAdded"]')[0].click();          
            break;      
          default:
            document.querySelectorAll('[data-eventmessage="a:viewRandom"]')[0].click();   
            break;
        }
      } else {
        document.querySelectorAll('[data-eventmessage="a:viewRandom"]')[0].click();   
      }
    },    
  },
  data: () => ({
    doRandomize: true,
    filterFavoriteOnly: false,
    currentView: "",
    pagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "CreatedDate",
      sortOrder: "DESC"
    },
    selected: [],
    menuItems: [
      { title: "Favorite", class: "hidden-xs-only", click: "a:viewStarred" },
      {
        title: "Most Played",
        class: "hidden-sm-and-down",
        click: "a:viewMostPlayed"
      },
      {
        title: "Most Releases",
        class: "hidden-sm-and-down",
        click: "a:viewMostReleases"
      },
      {
        title: "Most Tracks",
        class: "hidden-sm-and-down",
        click: "a:viewMostTracks"
      },      
      {
        title: "Random",
        class: "selected-toolbar-item",
        click: "a:viewRandom"
      },
      {
        title: "Recently Added",
        class: "hidden-xs-only",
        click: "a:viewRecentlyAdded"
      },
      {
        title: "Recently Played",
        class: "hidden-md-and-down",
        click: "a:viewRecentlyPlayed"
      },
      {
        title: "Top Rated",
        class: "hidden-sm-and-down",
        click: "a:viewTopRated"
      },
      {
        title: "Top Ranked",
        class: "hidden-sm-and-down",
        click: "a:viewTopRanked"
      },        
      { title: "All", class: "", click: "a:viewAll" }
    ],
    items: []
  })
};
</script>
