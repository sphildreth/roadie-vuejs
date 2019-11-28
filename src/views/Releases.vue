<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected="true" :toolbarIcon="'library_music'"></Toolbar>
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
          <ReleaseCard :release="props.item"></ReleaseCard>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ReleaseCard from "@/components/ReleaseCard";
import { EventBus } from "@/event-bus.js";
import releaseMixin from "@/mixins/release.js";
export default {
  mixins: [releaseMixin],
  components: { ReleaseCard, Toolbar },
  props: {
    view: String
  },  
  created() {
    this.pagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;    
    EventBus.$on("r:viewRandom", this.viewRandom);
    EventBus.$on("r:viewRecentlyAdded", this.viewRecentlyAdded);history
    EventBus.$on("r:viewStarred", this.viewStarred);
    EventBus.$on("r:viewTopRated", this.viewTopRated);
    EventBus.$on("r:viewTopRanked", this.viewTopRanked);
    EventBus.$on("r:viewMostPlayed", this.viewMostPlayed);
    EventBus.$on("r:viewRecentlyPlayed", this.viewRecentlyPlayed);
    EventBus.$on("r:viewRecentlyReleased", this.viewRecentlyReleased);
    EventBus.$on("r:viewAll", this.viewAll);
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("r:favoriteToggle", info => this.toggleFavorite(info));
    EventBus.$on("r:dislikeToggle", info => this.hateToggle(info));

  },
  beforeDestroy() {
    EventBus.$off("r:viewRandom", this.viewRandom);
    EventBus.$off("r:viewRecentlyAdded", this.viewRecentlyAdded);
    EventBus.$off("r:viewStarred", this.viewStarred);
    EventBus.$off("r:viewTopRated", this.viewTopRated);
    EventBus.$off("r:viewTopRanked", this.viewTopRanked);
    EventBus.$off("r:viewMostPlayed", this.viewMostPlayed);
    EventBus.$off("r:viewRecentlyPlayed", this.viewRecentlyPlayed);
    EventBus.$off("r:viewRecentlyReleased", this.viewRecentlyReleased);
    EventBus.$off("r:viewAll", this.viewAll);
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("r:favoriteToggle");
    EventBus.$off("r:dislikeToggle");
  },
  mounted() {
    if(this.view) {
      switch (this.view) {
        case "recentlyadded":
          document.querySelectorAll('[data-eventmessage="r:viewRecentlyAdded"]')[0].click();          
          break;      
        default:
          document.querySelectorAll('[data-eventmessage="r:viewRandom"]')[0].click();   
          break;
      }
    }
  },
  methods: {
    resetView: function() {
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
      this.pagination.sortBy = "TrackPlayedCount";
      this.updateData();
    },
    viewRecentlyPlayed: function() {
      this.resetView();
      this.pagination.sortBy = "LastPlayed";
      this.updateData();
    },
    viewRecentlyReleased: function() {
      this.resetView();
      this.pagination.sortBy = "ReleaseDate";
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
      await this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/releases?page=${this.pagination.page}&limit=${
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
      this.releaseFavoriteToggle(toggleInfo).then(this.updateData);
    },
    hateToggle: async function(toggleInfo) {
      this.releaseDislikeToggle(toggleInfo).then(this.updateData);
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
            document.querySelectorAll('[data-eventmessage="r:viewRecentlyAdded"]')[0].click();          
            break;      
          default:
            document.querySelectorAll('[data-eventmessage="r:viewRandom"]')[0].click();   
            break;
        }
      } else {
        document.querySelectorAll('[data-eventmessage="r:viewRandom"]')[0].click();   
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
      sortBy: "ReleaseDate",
      sortOrder: "DESC"
    },
    selected: [],
    menuItems: [
      { title: "Favorite", class: "hidden-xs-only", click: "r:viewStarred" },
      {
        title: "Most Played",
        class: "hidden-sm-and-down",
        click: "r:viewMostPlayed"
      },
      {
        title: "Random",
        class: "selected-toolbar-item",
        click: "r:viewRandom"
      },
      {
        title: "Recently Added",
        class: "hidden-xs-only",
        click: "r:viewRecentlyAdded"
      },
      {
        title: "Recently Played",
        class: "hidden-md-and-down",
        click: "r:viewRecentlyPlayed"
      },
      {
        title: "Recently Released",
        class: "hidden-md-and-down",
        click: "r:viewRecentlyReleased"
      },
      {
        title: "Top Rated",
        class: "hidden-sm-and-down",
        click: "r:viewTopRated"
      },
      {
        title: "Top Ranked",
        class: "hidden-sm-and-down",
        click: "r:viewTopRanked"
      },      
      { title: "All", class: "", click: "r:viewAll" }
    ],
    items: []
  })
};
</script>

<style>
</style>
