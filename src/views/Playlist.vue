<template>
  <div class="playlist-detail-container">
    <Toolbar :menuItems="menuItems" :toolbarIcon="'playlist_play'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="profile darken-1">
                <v-card-text class="title">
                  {{ playlist.name }}
                  <v-icon
                    v-if="playlist.isLocked"
                    style="float: right;"
                    title="Playlist is locked!"
                    color="warning"
                  >lock</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img
                    :src="playlist.mediumThumbnail.url"
                    :alt="playlist.name"
                    class="ma-1"
                    aspect-ratio="1"
                  ></v-img>
                </v-flex>
                <v-flex xs9 class="title">
                  <v-layout row wrap>
                    <v-flex xs4 class="mt-2">
                      <UserCard :user="playlist.maintainer"></UserCard>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm5 md5>
          <v-tabs right color="primary"  slider-color="accent">
            <v-tab>Description</v-tab>
            <v-tab v-if="playlist.tagsList.length > 0">Tags</v-tab>
            <v-tab v-if="playlist.urLsList.length">Urls</v-tab>
            <v-tab-item>
              <v-card  flat class="description darken-3">
                <v-card-text v-html="playlist.description">Loading...</v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="playlist.tagsList.length > 0">
              <v-list >
                <template v-for="(name, index) in playlist.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < playlist.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="playlist.urLsList.length">
              <v-list >
                <template v-for="(name, index) in playlist.urLsList">
                  <v-list-tile :key="`u-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a v-bind:href="name" target="_blank">{{ name }}</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < playlist.urLsList.length"
                    :key="`uaadivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
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
                  <v-icon>library_music</v-icon>
                </v-avatar>
                {{ playlist.statistics.releaseCount | padNumber4 }}
              </v-chip>
              <span>Playlist Release Count</span>
            </v-tooltip>            
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>audiotrack</v-icon>
                </v-avatar>
                {{ playlist.statistics.trackCount | padNumber4 }}
              </v-chip>
              <span>Playlist Track Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ playlist.statistics.trackSize }}
              </v-chip>
              <span>Playlist Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ playlist.statistics.fileSize }}
              </v-chip>
              <span>Playlist Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ playlist.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Playlist Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ playlist.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Playlist Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-card  v-if="trackItems.length > 0">
            <v-card-text>
                <v-data-iterator :items="trackItems" :rows-per-page-items="rowsPerPageItems" :hide-actions="trackPagination.totalItems < trackPagination.rowsPerPage"  :total-items="trackPagination.totalItems"  :pagination.sync="trackPagination" content-tag="v-layout" :loading="true" row wrap>
                    <v-flex slot="item" slot-scope="props" xs12 sm6>
                        <TrackCard :track="props.item" :release="props.item.release"></TrackCard>
                    </v-flex>
                </v-data-iterator>        
            </v-card-text>
        </v-card>  
      </v-layout>
    </v-container>
    <v-snackbar v-model="snackbar" color="success" :timeout="1000" :top="true">
      {{ snackbarText }}
      <v-btn color="black" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar';
import UserCard from '@/components/UserCard';
import TrackCard from '@/components/TrackCard';

import { EventBus } from "@/event-bus.js";
export default {
  components: { Toolbar, UserCard, TrackCard },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  beforeDestroy() {
    EventBus.$off('toolbarRefresh', this.updateData);  
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
        .get(process.env.VUE_APP_API_URL + `/playlists/${this.id}`)
        .then(response => {
          this.playlist = response.data.data;
          this.playlist.tagsList = this.playlist.tagsList || [];
          this.playlist.urLsList = this.playlist.urLsList || [];      
          this.$axios.get(process.env.VUE_APP_API_URL + `/tracks?page=${ this.trackPagination.page }&limit=${ this.trackPagination.rowsPerPage }&filterToPlaylistId=${ this.playlist.id }`)
          .then(response => {
              this.trackItems = response.data.rows;
              this.trackPagination.totalItems = response.data.totalCount;    
          });                  
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    trackPagination: { 
        async handler() {
            this.updateData();
        }
    }   
  },
  data: () => ({
    rowsPerPageItems: [6, 12, 24, 36, 60, 120],
    snackbar: false,
    snackbarText: "",    
    playlist: {
      maintainer: {
        thumbnail: {},
        user: {}        
      },
      mediumThumbnail: {},
      statistics: {},
      tagsList: [],
      urLsList: []
    },
      trackPagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0
    },      
    menuItems: [
      { title: "Add To Que", class: "hidden-xs-only", click: "rr:AddToQue" },
      { title: "Comment", class: "hidden-xs-only", click: "rr:Comment" },
      { title: "Shuffle", class: "hidden-sm-and-down", click: "rr:Shuffle" }
    ],
    trackItems: []
  })
};
</script>


<style>
</style>
