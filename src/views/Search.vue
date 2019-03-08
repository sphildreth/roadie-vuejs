<template>
  <div class="search-results-container">
    <v-container fluid>
      <div class="heading mb-2">Search Results for:
        <span class="accent--text title ml-2">{{ decodeURIComponent(this.searchQuery) }}</span>
      </div>
      <div v-if="loading">
        <v-progress-linear
          v-if="loading"
          height="2"
          color="accent"
          class="ma-0 pa-0"
          indeterminate
        ></v-progress-linear>
      </div>      
      <v-divider></v-divider>
    </v-container>
    <v-container fluid class="pa-0 pr-3 pl-3 ma-0" >
      <div v-if="loading" class="mx-3 mb-4 text-xs-center">
        <img class="mr-3" height="60px;" style="vertical-align:middle;"  src="@/assets/img/odyssey.gif" /> Seeking answers from the oracle 🧙 ✌ ✨ 🙌 🔮 🦄 ...
      </div>
      <div v-if="!loading && noResults" class="text-xs-center">
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
            :loading="releasesLoading"
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
            :loading="tracksLoading"
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
            :loading="playlistsLoading"
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
    }
  },
  async mounted() {
    this.updateData();
  },
  methods: {
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
      this.loading = true;
      if(!this.searchQuery) {
        this.loading = false;
        EventBus.$emit("showSnackbar", {
          text: "You won't find anything if you don't search for something.",
          color: "red"
        });        
        return;
      }
      this.artistItems = [];
      this.releaseItems = [];
      this.trackItems = [];
      this.playlistItems= [];
      if(this.doArtistSearch) {
        this.updateArtistData();
      }
      if(this.doReleaseSearch) {
        this.updateReleaseData();
      }
      if(this.doTrackSearch) {
        this.updateTracksData();
      }
      if(this.doPlaylistSearch) {
        this.updatePlaylistData();
      }
      this.loading = false;
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
            }&filter=${this.query}&FilterMinimumRating=${this.filterToRated}`
        )
        .then(response => {
          this.artistItems = response.data.rows;
          this.artistPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateReleaseData: async function() {
      EventBus.$emit("loadingStarted");
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
        });
    },
    updateTracksData: async function() {
      EventBus.$emit("loadingStarted");
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
        });
    },
    updatePlaylistData: async function() {
      EventBus.$emit("loadingStarted");
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
    loading: true,
    artistsLoading: false,
    releasesLoading: false,
    tracksLoading: false,
    playlistsLoading: false,
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
