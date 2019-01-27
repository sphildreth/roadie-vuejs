<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected="true" :toolbarIcon="'category'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-table
        :headers="headers"
        :items="items"
        class="elevation-1"
        :pagination.sync="pagination"
        :loading="loading"
        :rows-per-page-items="rowsPerPageItems"
        :total-items="pagination.totalItems"
      >
        <template slot="items" slot-scope="props">
          <td><router-link :to="'/search/:genre ' + encodeURIComponent(props.item.genre.text)"><span class="secondary--text text--lighten-1 artist-name text-no-wrap text-truncate subheading font-weight-medium pointer">{{ props.item.genre.text }}</span></router-link></td>
          <td>{{ props.item.artistCount }}</td>
          <td>{{ props.item.releaseCount }}</td>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";

export default {
  components: { Toolbar },
  created() {
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
    rowsPerPageItems: [10, 25, 50, 100],
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
