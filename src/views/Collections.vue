<template>
  <div>
    <Toolbar
      :menuItems="menuItems"
      :adminItems="adminMenuItems"
      :doMenuSelected="true"
      :toolbarIcon="'collections'"
    ></Toolbar>
    <v-container v-if="!missingData" fluid grid-list-md>
      <v-data-iterator
        :items="items"
        :rows-per-page-items="rowsPerPageItems"
        :total-items="pagination.totalItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs12 sm6 lg4>
          <CollectionCard :collection="props.item"></CollectionCard>
        </v-flex>
      </v-data-iterator>
    </v-container>
    <v-container v-if="missingData">
      {{ missingData }}
    </v-container>
    <confirm ref="confirm"></confirm>    
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import CollectionCard from "@/components/CollectionCard";
import { EventBus } from "@/event-bus.js";
import Confirm from "@/views/Confirm";

export default {
  components: { CollectionCard, Toolbar, Confirm },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("c:RescanAll", this.rescanAll);
    EventBus.$on("c:AddNew", this.addNew);
    EventBus.$on("c:viewComplete", this.viewComplete);
    EventBus.$on("c:viewIncomplete", this.viewIncomplete);
    EventBus.$on("c:viewAll", this.viewAll);    
    EventBus.$on("c:MissingCollectionReleases", this.missingCollectionReleases);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("c:RescanAll", this.rescanAll);
    EventBus.$off("c:viewComplete", this.viewComplete);
    EventBus.$off("c:viewIncomplete", this.viewIncomplete);
    EventBus.$off("c:viewAll", this.viewAll);    
    EventBus.$off("c:AddNew", this.addNew);
    EventBus.$off("c:MissingCollectionReleases", this.missingCollectionReleases);
  },
  mounted() {
    this.viewAll();
  },
  computed: {
    adminMenuItems() {
      return !this.$store.getters.isUserAdmin
        ? []
        : [
          { title: "Add", click: "c:AddNew" },
          { title: "View Missing Artists/Releases For All", click: "c:MissingCollectionReleases" },
          { title: "Rescan All", click: "c:RescanAll" }
        ];
    }
  },
  methods: {
    resetView: function() {
      this.currentView = null;
      this.pagination.page = 1;
    },    
    viewComplete: function() {
      this.resetView();
      this.filterToStatus = 2;
      this.currentView = "complete";
      this.updateData();
    },    
    viewIncomplete: function() {
      this.resetView();
      this.filterToStatus = 3;
      this.currentView = "incomplete";
      this.updateData();
    },    
    viewAll: function() {
      this.resetView();
      this.filterToStatus = 0;
      this.currentView = "all";
      this.updateData();
    },      
    addNew() {
      this.$router.push("/collection/edit/__new__");
    },
    missingCollectionReleases: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          process.env.VUE_APP_API_URL + "/admin/missingcollectionreleases"
        )
        .then(rr => {
          this.missingData = rr.data.data;
          EventBus.$emit("loadingComplete");
        });
    },
    rescanAll: async function() {
      this.$refs.confirm
        .open("Rescan All", "Are you sure?", { color: "orange" })
        .then(confirm => {
          if (confirm) {
            EventBus.$emit("loadingStarted");
            this.$axios
              .post(
                process.env.VUE_APP_API_URL + "/admin/scan/collection/rescanall"
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.updateData();
              });
          }
        });
    },    
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/collections?page=${this.pagination.page}&limit=${this.pagination.rowsPerPage}&filterToStatus=${this.filterToStatus}&order=${this.pagination.sortOrder}&sort=${this.pagination.sortBy}`
        )
        .then(response => {
          this.items = response.data.rows;
          this.pagination.totalItems = response.data.totalCount;
          EventBus.$emit("loadingComplete");
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
    missingData: null,
    currentView: "",    
    rowsPerPageItems: [12, 36, 60, 120, 500],
    pagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "CreatedDate",
      sortOrder: "DESC"
    },
    selected: [],
    filterToStatus: 0,
    menuItems: [
      {
        title: "Complete",
        class: "hidden-sm-and-down",
        click: "c:viewComplete"
      },       
      {
        title: "Incomplete",
        class: "hidden-sm-and-down",
        click: "c:viewIncomplete"
      },      
      { title: "All", class: "selected-toolbar-item", click: "c:viewAll" }
    ],
    items: []
  })
};
</script>

<style>
</style>
