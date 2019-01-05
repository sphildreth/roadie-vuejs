<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected="true" :toolbarIcon="'history'"></Toolbar>
    <v-container fluid grid-list-md>

    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";

export default {
  components: { Toolbar },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
  },
  async mounted() {
    this.updateData();
  },
  methods: {
    updateData: async function() {
      EventBus.$emit("loadingStarted");
            EventBus.$emit("loadingComplete");
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
      sortOrder: "ASC"
    },
    headers: [
    ],
    selected: [],
    menuItems: [
    ],
    items: []
  })
};
</script>

<style>
</style>
