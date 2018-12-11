<template>
  <div class="label-detail-container">
    <Toolbar :menuItems="menuItems" :toolbarIcon="'label'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="profile darken-1">
                <v-card-text class="title">
                  {{ label.name }}
                  <v-icon
                    v-if="label.isLocked"
                    style="float: right;"
                    title="Label is locked!"
                    color="warning"
                  >lock</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img
                    :src="label.mediumThumbnail.url"
                    :alt="label.name"
                    class="ma-1"
                    aspect-ratio="1"
                  ></v-img>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm5 md5>
          <v-tabs right color="primary" :dark="$vuetify.dark" slider-color="accent">
            <v-tab>Profile</v-tab>
            <v-tab v-if="label.tagsList.length > 0">Tags</v-tab>
            <v-tab v-if="label.urLsList.length">Urls</v-tab>
            <v-tab>Metadata Sources</v-tab>
            <v-tab-item>
              <v-card :dark="$vuetify.dark" flat class="profile darken-3">
                <v-card-text v-html="label.profile">Loading...</v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="label.tagsList.length > 0">
              <v-list :dark="$vuetify.dark">
                <template v-for="(name, index) in label.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < label.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="label.urLsList.length">
              <v-list :dark="$vuetify.dark">
                <template v-for="(name, index) in label.urLsList">
                  <v-list-tile :key="`u-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a v-bind:href="name" target="_blank">{{ name }}</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < label.urLsList.length" :key="`uaadivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>

            <v-tab-item>
              <v-data-table
                :dark="$vuetify.dark"
                :headers="metaDataHeaders"
                :items="metaDataSources()"
                class="elevation-1"
                hide-actions
              >
                <template slot="items" slot-scope="props">
                  <td v-if="props.item.sourceId">{{ props.item.source }}</td>
                  <td v-if="props.item.sourceId">
                    <a
                      v-bind:href="props.item.url + props.item.sourceId"
                      target="_blank"
                    >{{ props.item.sourceId }}</a>
                  </td>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="stats-container">
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>fas fa-users</v-icon>
                </v-avatar>
                {{ label.statistics.artistCount | padNumber4 }}
              </v-chip>
              <span>Label Artist Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>library_music</v-icon>
                </v-avatar>
                {{ label.statistics.releaseCount | padNumber4 }}
              </v-chip>
              <span>Label Release Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>audiotrack</v-icon>
                </v-avatar>
                {{ label.statistics.trackCount | padNumber5 }}
              </v-chip>
              <span>Label Track Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ label.statistics.trackSize }}
              </v-chip>
              <span>Label Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ label.statistics.fileSize }}
              </v-chip>
              <span>Label Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ label.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Label Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ label.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Label Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-container fluid grid-list-md>
        <v-card flat class="artists mt-2">
          <v-data-iterator
            :items="artistItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="artistPagination.totalItems < artistPagination.rowsPerPage"
            :total-items="artistPagination.totalItems"
            :pagination.sync="artistPagination"
            content-tag="v-layout"
            :loading="true"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg3>
              <ArtistCard :artist="props.item"></ArtistCard>
            </v-flex>
          </v-data-iterator>
        </v-card>
      </v-container>
    </v-container>
    <v-snackbar v-model="snackbar" color="success" :timeout="1000" :top="true">
      {{ snackbarText }}
      <v-btn color="black" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ArtistCard from "@/components/ArtistCard";

import { EventBus } from "@/event-bus.js";
export default {
  components: { Toolbar, ArtistCard },
  props: {
    id: String
  },
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
    shuffle: function() {},
    addToQue: function() {},
    download: function() {},
    comment: function() {},
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/labels/${this.id}`)
        .then(response => {
          this.label = response.data.data;
          this.label.tagsList = this.label.tagsList || [];
          this.label.urLsList = this.label.urLsList || [];
          this.updateArtistData();
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateArtistData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/artists?page=${this.artistPagination.page}&limit=${
              this.artistPagination.rowsPerPage
            }&order=${this.artistPagination.sortOrder}&sort=${
              this.artistPagination.sortBy
            }&filterToLabelId=${this.id}`
        )
        .then(response => {
          this.artistItems = response.data.rows;
          this.artistPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    metaDataSources: function() {
      return [
        {
          source: "MusicBrainz",
          sourceId: this.label.musicBrainzId,
          url: "https://musicbrainz.org/label/"
        }
      ];
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    artistPagination: {
      async handler() {
        this.updateArtistData();
      }
    }
  },
  data: () => ({
    rowsPerPageItems: [6, 12, 24, 36, 60, 120],
    snackbar: false,
    snackbarText: "",
    label: {
      maintainer: {
        thumbnail: {},
        user: {}
      },
      mediumThumbnail: {},
      statistics: {},
      tagsList: [],
      urLsList: []
    },
    artistPagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "Artist.Text",
      sortOrder: "ASC"
    },
    metaDataHeaders: [
      {
        text: "Source",
        align: "left",
        sortable: false,
        value: "source"
      },
      {
        text: "Source Id",
        align: "left",
        sortable: false,
        value: "sourceId"
      }
    ],
    menuItems: [
      { title: "Comment", class: "hidden-xs-only", click: "rr:Comment" }
    ],
    artistItems: []
  })
};
</script>


<style>
</style>
