<template>
  <div class="admin-container">
    <Toolbar :menuItems="menuItems" :doShowRefresh="false" :toolbarIcon="'settings'"></Toolbar>
    <v-container fluid grid-list-md>
      <div class="col-12">
        <v-card v-show="isScanning">
          <v-card-text>Scanning</v-card-text>
          <v-card-text :style="{ background: 'black' }">
            <ul id="messagesList"></ul>
          </v-card-text>
        </v-card>
      </div>
    </v-container>

    <v-container fluid grid-list-md>
      <v-data-table
        :headers="userHeaders"
        :items="userItems"
        class="elevation-1"
        :pagination.sync="userPagination"
        :loading="userLoading"
        :rows-per-page-items="this.$store.getters.rowsPerPageItems"
        :total-items="userPagination.totalItems"
      >
        <template slot="items" slot-scope="props">
          <td class="avatar-container">
            <router-link :to="'/user/' + props.item.id">
              <v-img :src="props.item.thumbnail.url" max-width="50" :alt="props.item.user.text"></v-img>
              <span class="subheading secondary--text text--lighten-1">{{ props.item.user.text }}</span>
            </router-link>
          </td>
          <td>{{ formatTimeStamp(props.item.lastActivity) }}</td>
          <td>{{ formatTimeStamp(props.item.lastLoginDate) }}</td>
          <td>{{ formatTimeStamp(props.item.lastApiAccessDate) }}</td>
          <td class="hidden-md-and-down">{{ props.item.isPrivate }}</td>
          <td title="Played Tracks">{{ props.item.statistics.playedTracks }}</td>
          <td
            class="hidden-md-and-down"
            title="Rated Artists"
          >{{ props.item.statistics.ratedArtists }}</td>
          <td
            class="hidden-md-and-down"
            title="Rated Releases"
          >{{ props.item.statistics.ratedReleases }}</td>
          <td
            class="hidden-md-and-down"
            title="Rated Tracks"
          >{{ props.item.statistics.ratedTracks }}</td>
          <td
            class="hidden-md-and-down"
            title="Favorite Artists"
          >{{ props.item.statistics.favoritedArtists }}</td>
          <td
            class="hidden-md-and-down"
            title="Favorite Releases"
          >{{ props.item.statistics.favoritedReleases }}</td>
          <td
            class="hidden-md-and-down"
            title="Favorite Tracks"
          >{{ props.item.statistics.favoritedTracks }}</td>
        </template>
      </v-data-table>
    </v-container>

    <confirm ref="confirm"></confirm>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import Confirm from "@/views/Confirm";
import getEnv from '@/utils/env.js';

const signalR = require("@aspnet/signalr");

export default {
  components: { Toolbar, Confirm },
  created() {
    EventBus.$on("s:ClearCache", this.clearCache);
    EventBus.$on("s:ScanInbound", this.scanInbound);
    EventBus.$on("s:ScanLibrary", this.scanLibrary);
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  beforeDestroy() {
    EventBus.$off("s:ClearCache", this.clearCache);
    EventBus.$off("s:ScanInbound", this.scanInbound);
    EventBus.$off("s:ScanLibrary", this.scanLibrary);
    EventBus.$off("toolbarRefresh", this.updateData);
  },
  async mounted() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(getEnv('ROADIE_API_URL') + "/scanActivityHub")
      .build();

    this.connection.start().catch(function(err) {
      /* eslint-disable no-console */
      return console.error(err.toString());
    });

    this.connection.on("SendSystemActivityAsync", message => {
      const li = document.createElement("li");
      li.textContent = message;
      document.getElementById("messagesList").appendChild(li);
    });
    this.updateData();
  },
  methods: {
    formatTimeStamp: function(ts) {
      var formatted = this.$options.filters.formatTimeStamp(
        ts,
        this.$store.getters.user,
        true
      );
      if (formatted) {
        return (
          formatted + " (" + this.$options.filters.daysFromDate(null, ts) + ")"
        );
      }
      return null;
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.userLoading = true;
      this.$axios
        .get(
          getEnv('ROADIE_API_URL') +
            `/users?page=${this.userPagination.page}&limit=${
              this.userPagination.rowsPerPage
            }&order=${this.userPagination.descending ? "DESC" : "ASC"}&sort=${
              this.userPagination.sortBy
            }`
        )
        .then(response => {
          this.userItems = [];
          this.$nextTick(() => {
            this.userItems = response.data.rows;
            this.userPagination.totalItems = response.data.totalCount;
            EventBus.$emit("loadingComplete");
            this.userLoading = false;
          });
        });
    },
    clearCache: async function() {
      this.$axios
        .get(getEnv('ROADIE_API_URL') + `/admin/clearcache`)
        .then(() => {
          EventBus.$emit("showSnackbar", { text: "Cleared Cache" });
        });
    },
    scanInbound: async function() {
      this.$axios
        .get(getEnv('ROADIE_API_URL') + `/admin/scan/inbound`)
        .then(() => {
          this.isScanning = true;
        });
    },
    scanLibrary: async function() {
      this.$refs.confirm
        .open("Rescan Library", "Proceed to scan entire library?", {
          color: "warning"
        })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .get(getEnv('ROADIE_API_URL') + `/admin/scan/library`)
              .then(() => {
                this.isScanning = true;
              });
          }
        });
    }
  },
  watch: {
    userPagination: {
      async handler() {
        this.updateData();
      }
    }
  },
  data: () => ({
    connection: null,
    isScanning: false,
    menuItems: [
      { title: "Clear Cache", class: "hidden-xs-only", click: "s:ClearCache" },
      {
        title: "Scan Inbound",
        class: "hidden-xs-only",
        click: "s:ScanInbound"
      },
      { title: "Scan Library", class: "hidden-xs-only", click: "s:ScanLibrary" }
    ],
    userItems: [],
    userLoading: true,
    userPagination: {
      page: 1,
      rowsPerPage: 25,
      totalItems: 0,
      sortBy: "lastActivity",
      descending: true
    },
    userHeaders: [
      {
        text: "Username",
        align: "left",
        class: "avatar-container",
        sortable: true,
        value: "user.text"
      },
      { text: "Last Activity", sortable: true, value: "lastActivity" },
      { text: "Last Login", sortable: true, value: "lastLoginDate" },
      { text: "Last Api Access", sortable: true, value: "lastApiAccessDate" },
      {
        text: "Priv",
        sortable: true,
        value: "isPrivate",
        width: "75px",
        class: "hidden-md-and-down"
      },
      {
        text: "Played",
        sortable: true,
        value: "statistics.playedTracks",
        width: "75px"
      },
      {
        text: "R A",
        sortable: true,
        value: "statistics.ratedArtists",
        width: "75px",
        class: "hidden-md-and-down"
      },
      {
        text: "R R",
        sortable: true,
        value: "statistics.ratedReleases",
        width: "75px",
        class: "hidden-md-and-down"
      },
      {
        text: "R T",
        sortable: true,
        value: "statistics.ratedTracks",
        width: "75px",
        class: "hidden-md-and-down"
      },
      {
        text: "F A",
        sortable: true,
        value: "statistics.favoritedArtists",
        width: "75px",
        class: "hidden-md-and-down"
      },
      {
        text: "F R",
        sortable: true,
        value: "statistics.favoritedReleases",
        width: "75px",
        class: "hidden-md-and-down"
      },
      {
        text: "F T",
        sortable: true,
        value: "statistics.favoritedTracks",
        width: "75px",
        class: "hidden-md-and-down"
      }
    ]
  })
};
</script>

<style>
#messagesList {
  max-height: 600px;
  overflow: auto;
}
</style>
