<template>
  <div class="search-results-container">
    <v-container fluid>     
      <div class="heading mb-2">
        Included in search:
        <v-chip
          v-if="searchFor.artists"
          close
          medium
          class="pointer"
          color="secondary"
          text-color="white"
          @click="searchFor.artists = false"
        >
          <v-icon class="mr-2">fas fa-users</v-icon>Artists
        </v-chip>
        <v-chip
          v-if="searchFor.collections"
          close
          medium
          color="secondary"
          text-color="white"
          @click="searchFor.collections=false"
        >
          <v-icon class="mr-2">collections</v-icon>Collections
        </v-chip>   
        <v-chip
          v-if="searchFor.genres"
          close
          medium
          color="secondary"
          text-color="white"
          @click="searchFor.genres=false"
        >
          <v-icon class="mr-2">category</v-icon>Genres
        </v-chip>  
        <v-chip
          v-if="searchFor.labels"
          close
          medium
          color="secondary"
          text-color="white"
          @click="searchFor.labels=false"
        >
          <v-icon class="mr-2">label</v-icon>Labels
        </v-chip>                      
        <v-chip
          v-if="searchFor.playlists"
          close
          medium
          color="secondary"
          text-color="white"
          @click="searchFor.playlists=false"
        >
          <v-icon class="mr-2">playlist_play</v-icon>Playlists
        </v-chip>
        <v-chip
          v-if="searchFor.releases"
          close
          medium
          color="secondary"
          text-color="white"
          @click="searchFor.releases=false"
        >
          <v-icon class="mr-2">library_music</v-icon>Releases
        </v-chip>
        <v-chip
          v-if="searchFor.tracks"
          close
          medium
          color="secondary"
          text-color="white"
          @click="searchFor.tracks=false"
        >
          <v-icon class="mr-2">audiotrack</v-icon>Tracks
        </v-chip>
      </div>
      <div class="heading mb-2">
        Search Results for:
        <v-chip
          disabled
          color="primary"
          style="font-size:18px;"
          text-color="white"
        >{{ this.queryDisplay }}</v-chip>
      </div>     
      <div v-if="filterDisplay" class="heading mb-2">
        Filter(s) applied:
        <v-chip
          @input="removeFilter"
          medium
          color="secondary"
          text-color="white"
          close
        >{{ this.filterDisplay }}</v-chip>
      </div>
      <div v-if="isLoading">
        <v-progress-linear height="2" color="accent" class="ma-0 pa-0" indeterminate></v-progress-linear>
      </div>
      <v-divider></v-divider>
    </v-container>
    <v-container fluid class="pa-0 pr-3 pl-3 ma-0">
      <div v-if="isLoading" class="mx-3 mb-4 text-xs-center">
        <img
          class="mr-3"
          height="60px;"
          style="vertical-align:middle;"
          src="@/assets/img/odyssey.gif"
        /> Seeking answers from the oracle 🧙 🦄 ...
      </div>
      <div v-if="!isLoading && noResults" class="text-xs-center">
        <v-icon class="mr-3">far fa-frown</v-icon>Sorry, nothing was found.
        <span class="ml-3">ε(´סּ︵סּ`)з</span>
      </div>
    </v-container>
    <v-container class="mt-0 pt-0" fluid grid-list-md>
      <v-card v-if="artistItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text">
          <router-link style="text-decoration:none;" class="info--text" :to="'/artists/'">
            <v-icon class="mr-2">fas fa-users</v-icon>Artists
          </router-link>
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="artistItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
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
      <v-card v-if="collectionItems.length > 0">
        <v-card-title class="pa-0 ma-0 mt-1 pt-2 pl-3 subheading accent--text">
          <router-link style="text-decoration:none;" class="info--text" :to="'/collections/'">
            <v-icon class="mr-2">collections</v-icon>Collections
          </router-link>
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="collectionItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
            :hide-actions="collectionPagination.totalItems < collectionPagination.rowsPerPage"
            :total-items="collectionPagination.totalItems"
            :pagination.sync="collectionPagination"
            content-tag="v-layout"
            row
            wrap
          >
          <v-flex slot="item" slot-scope="props" xs12 sm6 lg4>
            <CollectionCard :collection="props.item"></CollectionCard>
          </v-flex>
          </v-data-iterator>
        </v-card-text>      
      </v-card>      
      <v-card v-if="genreItems.length > 0">
        <v-card-title class="pa-0 ma-0 mt-1 pt-2 pl-3 subheading accent--text">
          <router-link style="text-decoration:none;" class="info--text" :to="'/genres/'">
            <v-icon class="mr-2">category</v-icon>Genres
          </router-link>
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="genreItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
            :hide-actions="genrePagination.totalItems < genrePagination.rowsPerPage"
            :total-items="genrePagination.totalItems"
            :pagination.sync="genrePagination"
            content-tag="v-layout"
            row
            wrap
          >
          <v-flex slot="item" slot-scope="props" xs3>
            <GenreCard :genre="props.item"></GenreCard>
          </v-flex>
          </v-data-iterator>
        </v-card-text>      
      </v-card>       
      <v-card v-if="labelItems.length > 0">
        <v-card-title class="pa-0 ma-0 mt-1 pt-2 pl-3 subheading accent--text">
          <router-link style="text-decoration:none;" class="info--text" :to="'/labels/'">
            <v-icon class="mr-2">label</v-icon>Labels
          </router-link>
        </v-card-title>
                <v-card-text>
          <v-data-iterator
            :items="labelItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
            :hide-actions="labelPagination.totalItems < labelPagination.rowsPerPage"
            :total-items="labelPagination.totalItems"
            :pagination.sync="labelPagination"
            content-tag="v-layout"
            row
            wrap
          >
          <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
            <LabelCard :label="props.item"></LabelCard>
          </v-flex>
          </v-data-iterator>
        </v-card-text> 
      </v-card>       
      <v-card v-if="playlistItems.length > 0">
        <v-card-title class="pa-0 ma-0 mt-1 pt-2 pl-3 subheading accent--text">
          <router-link style="text-decoration:none;" class="info--text" :to="'/playlists/'">
            <v-icon class="mr-2">playlist_play</v-icon>Playlists
          </router-link>
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="playlistItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
            :hide-actions="playlistPagination.totalItems < playlistPagination.rowsPerPage"
            :total-items="playlistPagination.totalItems"
            :pagination.sync="playlistPagination"
            content-tag="v-layout"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs6 sm3 lg4>
              <PlaylistCard :playlist="props.item"></PlaylistCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>      
      <v-card v-if="releaseItems.length > 0">
        <v-card-title class="pa-0 ma-0 mt-1 pt-2 pl-3 subheading accent--text">
          <router-link style="text-decoration:none;" class="info--text" :to="'/releases/'">
            <v-icon class="mr-2">library_music</v-icon>Releases
          </router-link>
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="releaseItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
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
        <v-card-title class="pa-0 ma-0 mt-1 pt-2 pl-3 subheading">
          <router-link style="text-decoration:none;" class="info--text" :to="'/tracks/'">
            <v-icon class="mr-2">audiotrack</v-icon>Tracks            
          </router-link>
          <span @click="playTracks()">
            <i
              class="fas fa-play mx-2 pointer"
              title="Play All (only visible tracks - will not load multiple pages)"
            ></i>
          </span>
          <span @click="queTracks()">
            <i
              class="fas fa-headphones pointer"
              title="Add All To Que (only visible tracks - will not load multiple pages)"
            ></i>
          </span>
        </v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="trackItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
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
    </v-container>
  </div>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import ArtistCard from "@/components/ArtistCard";
import CollectionCard from "@/components/CollectionCard";
import GenreCard from "@/components/GenreCard";
import LabelCard from "@/components/LabelCard";
import ReleaseCard from "@/components/ReleaseCard";
import TrackCard from "@/components/TrackCard";
import PlaylistCard from "@/components/PlaylistCard";
import trackMixin from "@/mixins/track.js";

export default {
  mixins: [trackMixin],
  components: { ArtistCard, CollectionCard, GenreCard, LabelCard, ReleaseCard, TrackCard, PlaylistCard },
  props: {
    q: String
  },
  created() {
    this.searchQuery = this.q;
    this.artistPagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
    this.collectionPagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
    this.genrePagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
    this.labelPagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
    this.releasePagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
    this.trackPagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
    this.playlistPagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
  },
  computed: {
    noResults() {
      return (
        !this.loading &&
        this.artistItems.length === 0 &&
        this.collectionItems.length === 0 &&
        this.genreItems.length === 0 &&
        this.labelItems.length === 0 &&
        this.releaseItems.length === 0 &&
        this.trackItems.length === 0 &&
        this.playlistItems.length === 0
      );
    },
    filterDisplay() {
      if (this.filterToRated) {
        return "Rated: " + this.filterToRated;
      }
      return null;
    },
    queryDisplay() {
      return this.query;
    },
    query() {
      const ratingRegex = /(\s?)(:?)(rating)(:?)(\s?)[0-9]/g;
      const s = decodeURIComponent(this.searchQuery);
      return s
        .replace("a: ", "")
        .replace("c: ", "")
        .replace("g: ", "")
        .replace("l: ", "")
        .replace("r: ", "")
        .replace("t: ", "")
        .replace("p: ", "")
        .replace(ratingRegex, "");
    },
    filterToRated() {
      const ratingRegex = /(\s?)(:?)(rating)(:?)(\s?)[0-9]/g;
      const s = decodeURIComponent(this.searchQuery);
      if (!ratingRegex.test(s)) {
        return "";
      }
      const p = s.indexOf("rating");
      const l = s.length;
      const r = parseInt(
        s
          .substring(p, l)
          .replace("rating", "")
          .replace(":", "")
          .trim()
      );
      return r;
    },
    isLoading() {
      return (
        this.artistsLoading ||
        this.collectionsLoading ||
        this.labelsLoading ||
        this.releasesLoading ||
        this.tracksLoading ||
        this.playlistsLoading
      );
    }
  },
  async mounted() {
    this.determineSearchParameters();    
    this.updateData();
  },
  methods: {
    determineSearchParameters() {
      let searchType = window.prevRoute.name;
      const s = decodeURIComponent(this.searchQuery);
      let givenFilter = s.substring(0, 2); // "r:", "t:", "p:"
      switch (givenFilter) {
        case "a:":
          searchType = "artists";
          break;
        case "c:":
          searchType = "collections";
          break;       
        case "g:":
          searchType = "genres";
          break;             
        case "l:":
          searchType = "labels";
          break;             
        case "p:":
          searchType = "playlists";
          break;          
        case "r:":
          searchType = "releases";
          break;
        case "t:":
          searchType = "tracks";
          break;
      }
      this.searchFor.allOff();
      switch (searchType) {
        case "artists":
          this.searchFor.artists = true;
          break;
        case "collections":
          this.searchFor.collections = true;
          break;       
        case "genres":
          this.searchFor.genres = true;
          break;    
        case "labels":
          this.searchFor.labels = true;
          break;                     
        case "playlists":
          this.searchFor.playlists = true;
          break;          
        case "releases":
          this.searchFor.releases = true;
          break;
        case "tracks":
          this.searchFor.tracks = true;
          break;
        default:
          this.searchFor.allOn();
      }
    },
    removeFilter() {
      const ratingRegex = /(\s?)(:?)(rating)(:?)(\s?)[0-9]/g;
      this.searchQuery = this.searchQuery.replace(ratingRegex, "");
      this.updateData();
    },
    playTracks() {
      this.$playQue.deleteAll().then(() => {
        this.queTracks();
      });
    },
    queTracks() {
      this.addTracksToQue(this.trackItems);
    },
    updateData: async function() {
      this.artistItems = [];
      this.collectionItems = [];
      this.genreItems = [];
      this.labelItems = [];
      this.releaseItems = [];
      this.trackItems = [];
      this.playlistItems = [];
      if (!this.searchQuery) {
        this.artistsLoading = false;
        this.collectionsLoading = true;
        this.releasesLoading = false;
        this.tracksLoading = false;
        this.playlistsLoading = false;
        EventBus.$emit("showSnackbar", {
          text: "You won't find anything if you don't search for something.",
          color: "red"
        });
        return;
      }      
      if(this.searchFor.searchForCount() === 0) {
        this.searchFor.toggleAll(true);
      }      
      if (this.searchFor.artists) {
        this.updateArtistData();
      } else {
        this.artistsLoading = false;
      }
      if (this.searchFor.collections) {
        this.updateCollectionData();
      } else {
        this.collectionsLoading = false;
      }  
      if (this.searchFor.genres) {
        this.updateGenreData();
      } else {
        this.genresLoading = false;
      }        
      if (this.searchFor.labels) {
        this.updateLabelData();
      } else {
        this.labelsLoading = false;
      }           
      if (this.searchFor.releases) {
        this.updateReleaseData();
      } else {
        this.releasesLoading = false;
      }
      if (this.searchFor.tracks) {
        this.updateTracksData();
      } else {
        this.tracksLoading = false;
      }
      if (this.searchFor.playlists) {
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
            `/artists?page=${this.artistPagination.page}&limit=${this.artistPagination.rowsPerPage}&order=${this.artistPagination.sortOrder}&sort=${this.artistPagination.sortBy}&filter=${this.query}&FilterMinimumRating=${this.filterToRated}`
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
            `/releases?page=${this.releasePagination.page}&limit=${this.releasePagination.rowsPerPage}&order=${this.releasePagination.sortOrder}&sort=${this.releasePagination.sortBy}&filter=${this.query}&FilterMinimumRating=${this.filterToRated}`
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
            `/tracks?page=${this.trackPagination.page}&limit=${this.trackPagination.rowsPerPage}&order=${this.trackPagination.sortOrder}&sort=${this.trackPagination.sortBy}&filter=${this.query}&FilterMinimumRating=${this.filterToRated}`
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
    updateCollectionData: async function() {
      EventBus.$emit("loadingStarted");
      this.collectionsLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/collections?page=${this.collectionPagination.page}&limit=${this.collectionPagination.rowsPerPage}&order=${this.collectionPagination.sortOrder}&sort=${this.collectionPagination.sortBy}&filter=${this.query}`
        )
        .then(response => {
          this.collectionItems = response.data.rows;
          this.collectionPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.collectionsLoading = false;
        });
    },    
    updateGenreData: async function() {
      EventBus.$emit("loadingStarted");
      this.genresLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/genres?page=${this.genrePagination.page}&limit=${this.genrePagination.rowsPerPage}&order=${this.genrePagination.sortOrder}&sort=${this.genrePagination.sortBy}&filter=${this.query}`
        )
        .then(response => {
          this.genreItems = response.data.rows;
          this.genrePagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.genresLoading = false;
        });
    },     
    updateLabelData: async function() {
      EventBus.$emit("loadingStarted");
      this.labelsLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/labels?page=${this.labelPagination.page}&limit=${this.labelPagination.rowsPerPage}&order=${this.labelPagination.sortOrder}&sort=${this.labelPagination.sortBy}&filter=${this.query}`
        )
        .then(response => {
          this.labelItems = response.data.rows;
          this.labelPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.labelsLoading = false;
        });
    },       
    updatePlaylistData: async function() {
      EventBus.$emit("loadingStarted");
      this.playlistsLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/playlists?page=${this.playlistPagination.page}&limit=${this.playlistPagination.rowsPerPage}&order=${this.playlistPagination.sortOrder}&sort=${this.playlistPagination.sortBy}&filter=${this.query}`
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
      this.determineSearchParameters();
      this.updateData();
    },
    searchFor: {
      async handler() {
        this.updateData();
      },
      deep: true
    },
    artistPagination: {
      async handler() {
        this.updateArtistData();
      }
    },
    collectionPagination: {
      async handler() {
        this.updateCollectionData();
      }
    },    
    genrePagination: {
      async handler() {
        this.updateGenreData();
      }
    },      
    labelPagination: {
      async handler() {
        this.updateLabelData();
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
    searchFor: {
      artists: true,
      collections: true,
      genres: true,
      labels: true,
      playlists: true,      
      releases: true,
      tracks: true,
      searchForCount: function() {
        let result = 0;
        if(this.artists) { result++;}
        if(this.collections) { result++;}
        if(this.genres) { result++;}
        if(this.labels) { result++;}
        if(this.releases) { result++;}
        if(this.tracks) { result++;}
        if(this.playlists) { result++;}
        return result;
      },
      allOff: function() {
        this.toggleAll(false);
      },
      allOn: function() {
        this.toggleAll(true);
      },
      toggleAll: function(toggle) {
        this.artists = toggle;
        this.collections = toggle;
        this.genres = toggle;
        this.labels = toggle;
        this.releases = toggle;
        this.tracks = toggle;
        this.playlists = toggle;
      }
    },
    searchQuery: null,
    artistsLoading: true,
    collectionsLoading: true,
    genresLoading: true,
    labelsLoading: true,
    releasesLoading: true,
    tracksLoading: true,
    playlistsLoading: true,
    currentView: "",
    artistPagination: {
      page: 1,
      rowsPerPage: 12,
      totalItems: 0,
      sortBy: "Artist.Text",
      sortOrder: "ASC"
    },
    collectionPagination: {
      page: 1,
      rowsPerPage: 12,
      totalItems: 0,
      sortBy: "Collection.Text",
      sortOrder: "ASC"
    },    
    genrePagination: {
      page: 1,
      rowsPerPage: 12,
      totalItems: 0,
      sortBy: "Genre.Text",
      sortOrder: "ASC"
    },    
    labelPagination: {
      page: 1,
      rowsPerPage: 12,
      totalItems: 0,
      sortBy: "Label.Text",
      sortOrder: "ASC"
    },     
    releasePagination: {
      page: 1,
      rowsPerPage: 12,
      totalItems: 0,
      sortBy: "Release.Text",
      sortOrder: "ASC"
    },
    trackPagination: {
      page: 1,
      rowsPerPage: 6,
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
    collectionItems: [],
    genreItems: [],
    labelItems: [],
    releaseItems: [],
    trackItems: [],
    playlistItems: []
  })
};
</script>


<style>
</style>
