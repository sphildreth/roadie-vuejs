<template>
  <div class="search-results-container">
    <v-container fluid>
      <div class="heading mb-2">Search Results for:
        <v-chip disabled medium slot="activator" color="secondary" text-color="white">
          {{ this.queryDisplay }}
        </v-chip>        
      </div>
      <div v-if="filterDisplay" class="heading mb-2">Filter(s) applied:
        <v-chip @input="removeFilter" medium slot="activator" color="secondary" text-color="white" close>
          {{ this.filterDisplay }}
        </v-chip>        
      </div>      
      <div v-if="isLoading">
        <v-progress-linear
          height="2"
          color="accent"
          class="ma-0 pa-0"
          indeterminate
        ></v-progress-linear>
      </div>      
      <v-divider></v-divider>
    </v-container>
    <v-container fluid class="pa-0 pr-3 pl-3 ma-0" >
      <div v-if="isLoading" class="mx-3 mb-4 text-xs-center">
        <img class="mr-3" height="60px;" style="vertical-align:middle;"  src="@/assets/img/odyssey.gif" /> Seeking answers from the oracle 🧙 ✌ ✨ 🙌 🔮 🦄 ...
      </div>
      <div v-if="!isLoading && noResults" class="text-xs-center">
        <v-icon class="mr-3">far fa-frown</v-icon>Sorry, nothing was found.<span class="ml-3">ε(´סּ︵סּ`)з</span>
      </div>
    </v-container>
    <v-container class="mt-0 pt-0" fluid grid-list-md>
      <v-card v-if="artistItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text"><v-icon class="mr-2">fas fa-users</v-icon>Artists</v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="artistItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="artistPagination.totalItems < artistPagination.rowsPerPage"
            :total-items="artistPagination.totalItems"
            :pagination.sync="artistPagination"
            content-tag="v-layout"
            :loading="artistsLoading"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
              <ArtistCard :artist="props.item"></ArtistCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>
      <v-card v-if="releaseItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text"><v-icon class="mr-2">library_music</v-icon>Releases</v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="releaseItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="releasePagination.totalItems < releasePagination.rowsPerPage"
            :total-items="releasePagination.totalItems"
            :pagination.sync="releasePagination"
            content-tag="v-layout"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
              <ReleaseCard :release="props.item"></ReleaseCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>
      <v-card v-if="trackItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading">
          <v-icon class="mr-2">audiotrack</v-icon>
          <span class="accent--text">Tracks</span>
          <span @click="playTracks()"><i class="fas fa-play mx-2 pointer" title="Play All (only visible tracks - will not load multiple pages)"></i></span>
          <span @click="queTracks()"><i class="fas fa-headphones pointer" title="Add All To Que (only visible tracks - will not load multiple pages)"></i></span>          
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="trackItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="trackPagination.totalItems < trackPagination.rowsPerPage"
            :total-items="trackPagination.totalItems"
            :pagination.sync="trackPagination"
            content-tag="v-layout"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 md6>
              <TrackCard :track="props.item" :release="props.item.release"></TrackCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>
      <v-card v-if="playlistItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text"><v-icon class="mr-2">playlist_play</v-icon>Playlists</v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="playlistItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="playlistPagination.totalItems < playlistPagination.rowsPerPage"
            :total-items="playlistPagination.totalItems"
            :pagination.sync="playlistPagination"
            content-tag="v-layout"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg4>
              <PlaylistCard :playlist="props.item"></PlaylistCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>

import { EventBus } from "@/event-bus.js";
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import TrackCard from "@/components/TrackCard";
import PlaylistCard from "@/components/PlaylistCard";
import trackMixin from "@/mixins/track.js";

export default {
  mixins: [trackMixin],
  components: { ArtistCard, ReleaseCard, TrackCard, PlaylistCard },
  props: {
    q: String
  },
  created() {
    this.searchQuery = this.q;    
  },
  computed: {
    noResults() {
      return (
        !this.loading &&
        this.artistItems.length == 0 &&
        this.releaseItems.length == 0 &&
        this.trackItems.length == 0 &&
        this.playlistItems.length == 0
      );
    },
    filterDisplay() {
      if(this.filterToRated) {
        return "Rated: " + this.filterToRated;
      }
      return null;
    },
    queryDisplay() {
      let isOnlyArtistSearch = this.doArtistSearch && !this.doReleaseSearch && !this.doTrackSearch && !this.doPlaylistSearch;
      let isOnlyReleaseSearch = !this.doArtistSearch && this.doReleaseSearch && !this.doTrackSearch && !this.doPlaylistSearch;
      let isOnlyTrackSearch = !this.doArtistSearch && !this.doReleaseSearch && this.doTrackSearch && !this.doPlaylistSearch;
      let isOnlyPlaylistSearch = !this.doArtistSearch && !this.doReleaseSearch && !this.doTrackSearch && this.doPlaylistSearch;
      if(isOnlyArtistSearch) {
        return "Artist: " + this.query;
      }
      if(isOnlyReleaseSearch) {
        return "Release: " + this.query;
      }     
      if(isOnlyTrackSearch) {
        return "Track: " + this.query;
      }           
      if(isOnlyPlaylistSearch) {
        return "Playlist: " + this.query;
      }         
      return this.query;
    },
    query() {
      const ratingRegex = /(\s?)(:?)(rating)(:?)(\s?)[0-9]/g;
      const s = decodeURIComponent(this.searchQuery);
      return s
                 .replace('a: ', '')
                 .replace('r: ', '')
                 .replace('t: ', '')
                 .replace('p: ', '')
                 .replace(ratingRegex,'');
    },
    doArtistSearch() {
      const s = decodeURIComponent(this.searchQuery);
      return !s.startsWith("r:") && !s.startsWith("t:") && !s.startsWith("p:");
    },
    doReleaseSearch() {
      const s = decodeURIComponent(this.searchQuery);
      return !s.startsWith("a:") && !s.startsWith("t:") && !s.startsWith("p:");
    },
    doTrackSearch() {
      const s = decodeURIComponent(this.searchQuery);
      return !s.startsWith("a:") && !s.startsWith("r:") && !s.startsWith("p:");
    },
    doPlaylistSearch() {
      const ratingRegex = /(\s?)(:?)(rating)(:?)(\s?)[0-9]/g;
      const s = decodeURIComponent(this.searchQuery);
      if(ratingRegex.test(s)) {
        return false;
      }
      return !s.startsWith("a:") && !s.startsWith("r:") && !s.startsWith("t:");
    },
    filterToRated() {
      const ratingRegex = /(\s?)(:?)(rating)(:?)(\s?)[0-9]/g;
      const s = decodeURIComponent(this.searchQuery);
      if(!ratingRegex.test(s)) {
        return '';
      }
      const p = s.indexOf("rating");
      const l = s.length;
      const r = parseInt(s.substring(p, l).replace("rating", '').replace(":", '').trim());
      return r;
    },
    isLoading() {
      return this.artistsLoading || this.releasesLoading || this.tracksLoading || this.playlistsLoading;
    }
  },
  async mounted() {
    this.updateData();
  },
  methods: {
    removeFilter() {
      const ratingRegex = /(\s?)(:?)(rating)(:?)(\s?)[0-9]/g;
      this.searchQuery = this.searchQuery.replace(ratingRegex,'');
       this.updateData();
    },
    playTracks() {
      this.$playQue
        .deleteAll()
        .then(() => {
          this.queTracks();
        })
    },
    queTracks() {
      this.addTracksToQue(this.trackItems);
    },
    updateData: async function() {
      this.artistItems = [];
      this.releaseItems = [];
      this.trackItems = [];
      this.playlistItems= [];
      if(!this.searchQuery) {
        this.artistsLoading = false;
        this.releasesLoading = false;
        this.tracksLoading =false;
        this.playlistsLoading = false;
        EventBus.$emit("showSnackbar", {
          text: "You won't find anything if you don't search for something.",
          color: "red"
        });        
        return;
      }
      if(this.doArtistSearch) {
        this.updateArtistData();
      } else {
        this.artistsLoading = false;
      }
      if(this.doReleaseSearch) {
        this.updateReleaseData();
      } else {
        this.releasesLoading = false;
      }
      if(this.doTrackSearch) {
        this.updateTracksData();
      } else {
        this.tracksLoading =false;
      }
      if(this.doPlaylistSearch) {
        this.updatePlaylistData();
      } else {
        this.playlistsLoading = false;
      }
    },
    updateArtistData: async function() {
      EventBus.$emit("loadingStarted");
      this.artistsLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/artists?page=${this.artistPagination.page}&limit=${
              this.artistPagination.rowsPerPage
            }&order=${this.artistPagination.sortOrder}&sort=${
              this.artistPagination.sortBy
            }&filter=${this.query}&FilterMinimumRating=${this.filterToRated}`
        )
        .then(response => {
          this.artistItems = response.data.rows;
          this.artistPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.artistsLoading = false;
        });
    },
    updateReleaseData: async function() {
      EventBus.$emit("loadingStarted");
      this.releasesLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/releases?page=${this.releasePagination.page}&limit=${
              this.releasePagination.rowsPerPage
            }&order=${this.releasePagination.sortOrder}&sort=${
              this.releasePagination.sortBy
            }&filter=${this.query}&FilterMinimumRating=${this.filterToRated}`
        )
        .then(response => {
          this.releaseItems = response.data.rows;
          this.releasePagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.releasesLoading = false;
        });
    },
    updateTracksData: async function() {
      EventBus.$emit("loadingStarted");
      this.tracksLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/tracks?page=${this.trackPagination.page}&limit=${
              this.trackPagination.rowsPerPage
            }&order=${this.trackPagination.sortOrder}&sort=${
              this.trackPagination.sortBy
            }&filter=${this.query}&FilterMinimumRating=${this.filterToRated}`
        )
        .then(response => {
          this.trackItems = response.data.rows;
          this.trackPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.tracksLoading = false;
        });
    },
    updatePlaylistData: async function() {
      EventBus.$emit("loadingStarted");
      this.playlistsLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/playlists?page=${this.playlistPagination.page}&limit=${
              this.playlistPagination.rowsPerPage
            }&order=${this.playlistPagination.sortOrder}&sort=${
              this.playlistPagination.sortBy
            }&filter=${this.query}`
        )
        .then(response => {
          this.playlistItems = response.data.rows;
          this.playlistPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.playlistsLoading = false;
        });
    }
  },
  watch: {
    $route(to) {
      this.searchQuery = encodeURIComponent(to.params.q);
      this.updateData();
    },
    artistPagination: {
      async handler() {
        this.updateArtistData();
      }
    },
    releasePagination: {
      async handler() {
        this.updateReleaseData();
      }
    },
    trackPagination: {
      async handler() {
        this.updateTracksData();
      }
    },
    playlistPagination: {
      async handler() {
        this.updatePlaylistData();
      }
    }
  },
  data: () => ({    
    searchQuery: null,
    artistsLoading: true,
    releasesLoading: true,
    tracksLoading: true,
    playlistsLoading: true,
    rowsPerPageItems: [12, 36, 60, 120,500],
    currentView: "",
    artistPagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "Artist.Text",
      sortOrder: "ASC"
    },
    releasePagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "Release.Text",
      sortOrder: "ASC"
    },
    trackPagination: {
      page: 1,
      rowsPerPage: 12,
      totalItems: 0,
      sortBy: "Track.Text",
      sortOrder: "ASC"
    },
    playlistPagination: {
      page: 1,
      rowsPerPage: 12,
      totalItems: 0,
      sortBy: "Playlist.Text",
      sortOrder: "ASC"
    },
    artistItems: [],
    releaseItems: [],
    trackItems: [],
    playlistItems: []  
  })
};
</script>


<style>
</style>
