<template>
  <div class="search-results-container">
    <v-container fluid>
      <div class="heading mb-2">Search Results for:
        <span class="accent--text title ml-2">{{ q }}</span>
      </div>
      <v-divider></v-divider>
    </v-container>
    <v-container fluid class="pa-0 pr-3 pl-3 ma-0" >
      <div v-if="noResults">
        <v-icon class="mr-3">far fa-frown</v-icon>Sorry, nothing was found.
      </div>
    </v-container>
    <v-container class="mt-0 pt-0" fluid grid-list-md>
      <v-card v-if="artistItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text">Artists</v-card-title>
        <v-card-text>
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
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
              <ArtistCard :artist="props.item"></ArtistCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>
      <v-card v-if="releaseItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text">Releases</v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="releaseItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="releasePagination.totalItems < releasePagination.rowsPerPage"
            :total-items="releasePagination.totalItems"
            :pagination.sync="releasePagination"
            content-tag="v-layout"
            :loading="true"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
              <ReleaseCard :release="props.item"></ReleaseCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>
      <v-card v-if="trackItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text">Tracks</v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="trackItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="trackPagination.totalItems < trackPagination.rowsPerPage"
            :total-items="trackPagination.totalItems"
            :pagination.sync="trackPagination"
            content-tag="v-layout"
            :loading="true"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6>
              <TrackCard :track="props.item" :release="props.item.release"></TrackCard>
            </v-flex>
          </v-data-iterator>
        </v-card-text>
      </v-card>
      <v-card v-if="playlistItems.length > 0">
        <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text">Playlists</v-card-title>
        <v-card-text>
          <v-data-iterator
            :items="playlistItems"
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="playlistPagination.totalItems < playlistPagination.rowsPerPage"
            :total-items="playlistPagination.totalItems"
            :pagination.sync="playlistPagination"
            content-tag="v-layout"
            :loading="true"
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

export default {
  components: { ArtistCard, ReleaseCard, TrackCard, PlaylistCard },
  props: {
    q: String
  },
  created() {},
  computed: {
    noResults() {
      return (
        this.artistItems.length == 0 &&
        this.releaseItems.length == 0 &&
        this.trackItems.length == 0 &&
        this.playlistItems.length == 0
      );
    }
  },
  async mounted() {
    this.updateData();
  },
  methods: {
    updateData: async function() {
      this.updateArtistData();
      this.updateReleaseData();
      this.updateTracksData();
      this.updatePlaylistData();
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
            }&filter=${this.q}`
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
            }&filter=${this.q}`
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
            }&filter=${this.q}`
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
            }&filter=${this.q}`
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
      this.q = to.params.q;
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
    rowsPerPageItems: [12, 36, 60, 120],
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
