<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected="true" :toolbarIcon="'category'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator
        :items="items"
        :rows-per-page-items="rowsPerPageItems"
        :hide-actions="pagination.totalItems < pagination.rowsPerPage"
        :total-items="pagination.totalItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs12 sm6 lg3>
        <GenreCard :genre="props.item"></GenreCard>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import GenreCard from "@/components/GenreCard";
import { EventBus } from "@/event-bus.js";

export default {
  components: { Toolbar, GenreCard },
  created() {
    this.pagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;    
    EventBus.$on("g:viewMostArtists", this.viewMostArtists);
    EventBus.$on("g:viewMostReleases", this.viewMostReleases);
    EventBus.$on("g:viewAll", this.viewAll);
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  beforeDestroy() {
    EventBus.$off("g:viewMostArtists", this.viewMostArtists);
    EventBus.$off("g:viewMostReleases", this.viewMostReleases);
    EventBus.$off("g:viewAll", this.viewAll);
    EventBus.$off("toolbarRefresh", this.updateData);
  },
  async mounted() {
  },
  methods: {
    resetView: function() {
      this.currentView = null;
      this.filterFavoriteOnly = false;
      this.pagination.sortOrder = "DESC";
      this.pagination.page = 1;
      this.pagination.descending = false;
    },
    viewMostArtists: function() {
      this.resetView();
      this.pagination.sortBy = "artistCount";
      this.pagination.sortOrder = "DESC";
      this.pagination.descending = true;
      this.updateData();
    },
    viewMostReleases: function() {
      this.resetView();
      this.pagination.sortBy = "releaseCount";
      this.pagination.sortOrder = "DESC";
      this.pagination.descending = true;
      this.updateData();
    },
    viewAll: function() {
      this.resetView();
      this.pagination.sortBy = "genre.Text";
      this.pagination.sortOrder = "ASC";
      this.updateData();
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.loading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/genres?page=${this.pagination.page}&limit=${
              this.pagination.rowsPerPage
            }&order=${this.pagination.descending ? 'DESC' : 'ASC'}&sort=${this.pagination.sortBy}`
        )
        .then(response => {
          this.items = [];
          this.$nextTick(() => {
            this.items = response.data.rows;
            this.pagination.totalItems = response.data.totalCount;
            EventBus.$emit("loadingComplete");
            this.loading = false;
          });
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
    rowsPerPageItems: [6,12,36,60,120,500],
    loading: true,
    currentView: "",
    pagination: {
      page: 1,
      rowsPerPage: 10,
      totalItems: 0,
      sortBy: "genre.Text",
      descending: false
    },
    headers: [
      { text: "Genre", value: "genre.Text" },
      { text: "Artists", value: "artistCount" },
      { text: "Releases", value: "releaseCount" }
    ],
    selected: [],
    menuItems: [
      {
        title: "Most Artists",
        class: "hidden-sm-and-down",
        click: "g:viewMostArtists"
      },
      {
        title: "Most Releases",
        class: "hidden-sm-and-down",
        click: "g:viewMostReleases"
      },
      { title: "All", class:"selected-toolbar-item", click: "g:viewAll" }
    ],
    items: []
  })
};
</script>

<style>
</style>
