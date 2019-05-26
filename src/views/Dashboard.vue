<template>
  <div class="dashboard-detail-container">
    <Toolbar :menuItems="menuItems" :toolbarIcon="'dashboard'"></Toolbar>  
    <v-layout class="hidden-xs-only" row wrap>
      <v-flex d-flex md12 class="ma-3">
        <v-tooltip bottom class="hidden-md-and-down">
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>supervisor_account</v-icon>
            </v-avatar>
            {{ statistics.userCount | formatNumber }}
          </v-chip>
          <span>Total Users in the system</span>
        </v-tooltip>
        <v-tooltip bottom class="hidden-md-and-down">
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>collections</v-icon>
            </v-avatar>
            <a href="/collections/">{{ statistics.collectionCount | formatNumber }}</a>
          </v-chip>
          <span>Total Collections in the system</span>
        </v-tooltip>
        <v-tooltip bottom class="hidden-md-and-down">
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>playlist_play</v-icon>
            </v-avatar>
            <a href="/playlists/">{{ statistics.playlistCount | formatNumber }}</a>
          </v-chip>
          <span>Total Playlists in the system</span>
        </v-tooltip>
        <v-tooltip bottom class="hidden-md-and-down">
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>label</v-icon>
            </v-avatar>
            <a href="/labels/">{{ statistics.labelCount | formatNumber }}</a>
          </v-chip>
          <span>Total Labels in the system</span>
        </v-tooltip>
        <v-tooltip bottom class="hidden-md-and-down">
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>fas fa-users</v-icon>
            </v-avatar>
            <a href="/artists/">{{ statistics.artistCount | formatNumber }}</a>
          </v-chip>
          <span>Total Artists in the system</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>library_music</v-icon>
            </v-avatar>
            <a href="/releases/">{{ statistics.releaseCount | formatNumber }}</a>
          </v-chip>
          <span>Total Releases in the Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>album</v-icon>
            </v-avatar>
            {{ statistics.releaseMediaCount | formatNumber }}
          </v-chip>
          <span>Total Release Medias in the Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>audiotrack</v-icon>
            </v-avatar>
            <a href="/tracks/">{{ statistics.trackCount | formatNumber }}</a>
          </v-chip>
          <span>Total Tracks in Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>play_circle_outline</v-icon>
            </v-avatar>
            {{ statistics.playedCount | formatNumber }}
          </v-chip>
          <span>Total number of times Tracks have been played</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>speaker</v-icon>
            </v-avatar>
            {{ statistics.formattedTotalTrackDuration }}
          </v-chip>
          <span>Total Playtime of Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>folder_open</v-icon>
            </v-avatar>
            {{ statistics.formattedTotalTrackSize }}
          </v-chip>
          <span>Total Filesize of Library</span>
        </v-tooltip>
      </v-flex>
    </v-layout>
    <v-row row v-if="dashboardMessage">
      <v-card xs12 flat class="ma-3">
        <v-card-text v-html="dashboardMessage"></v-card-text>
      </v-card>
    </v-row>    
    <v-layout row wrap>
      <v-card xs12 class="ma-3 recent-card">
        <v-card-title class="title accent--text">
          <a href="/releases/recentlyadded">
            <v-icon class="mr-1">library_music</v-icon>Recently Added Releases
          </a>
        </v-card-title>
        <v-container fluid grid-list-md class="my-0 py-0">
          <v-data-iterator
            v-if="!loadingReleases"
            :items="latestReleases"
            :total-items="latestReleases.length"
            :hide-actions="true"
            content-tag="v-layout"
            :loading="true"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
              <ReleaseCard :release="props.item"></ReleaseCard>
            </v-flex>
          </v-data-iterator>
          <v-progress-linear v-if="loadingReleases" height="2" color="accent" class indeterminate></v-progress-linear>
        </v-container>
      </v-card>
    </v-layout>
    <v-layout row wrap>
      <v-card xs12 class="ma-3 recent-card">
        <v-card-title class="title accent--text">
          <a href="/artists/recentlyadded">
            <v-icon class="mr-1">fas fa-users</v-icon>Recently Added Artists
          </a>
        </v-card-title>
        <v-container fluid grid-list-md class="my-0 py-0">
          <v-data-iterator
            v-if="!loadingArtists"
            :items="latestArtists"
            :total-items="latestArtists.length"
            :hide-actions="true"
            content-tag="v-layout"
            :loading="true"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
              <ArtistCard :artist="props.item"></ArtistCard>
            </v-flex>
          </v-data-iterator>
          <v-progress-linear v-if="loadingArtists" height="2" color="accent" class indeterminate></v-progress-linear>
        </v-container>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ReleaseCard from "@/components/ReleaseCard";
import ArtistCard from "@/components/ArtistCard";
import { EventBus } from "@/event-bus.js";
import store from "@/store";
import trackMixin from "@/mixins/track.js";

export default {
  store,
  mixins: [trackMixin],
  components: { Toolbar, ReleaseCard, ArtistCard },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("db:PlayRandomTracks", this.playRandomTracks);
    EventBus.$on("db:PlayRandomRatedTracks", this.playRandomRatedTracks);
    EventBus.$on("db:PlayRandomFavoriteTracks", this.playRandomFavoriteTracks);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("db:PlayRandomTracks", this.playRandomTracks);
    EventBus.$off("db:PlayRandomRatedTracks", this.playRandomRatedTracks);
    EventBus.$off("db:PlayRandomFavoriteTracks", this.playRandomFavoriteTracks);
  },
  async mounted() {    
    this.updateData();
    let that = this;
    this.$axios
      .get(
        window.location.protocol + "//" + window.location.host + "/messages/dashboard_message.html"
      )
      .then(response => {
        that.dashboardMessage = response.data;  
      })
      .catch(function () {
        that.dashboardMessage = null;
    });       
  },
  computed: {
    recentLimit() {
      return this.$store.getters.user.recentLimit || 24;
    }
  },
  methods: {
    playRandomTracks: function() {
      EventBus.$emit("loadingStarted");
      this.$playQue
        .deleteAll()
        .then(() => {
          return this.$axios.get(
            process.env.VUE_APP_API_URL + `/tracks?doRandomize=true`
          );
        })
        .then(response => {
          this.addTracksToQue(response.data.rows);
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    playRandomRatedTracks: function() {
      EventBus.$emit("loadingStarted");
      this.$playQue
        .deleteAll()
        .then(() => {
          return this.$axios.get(
            process.env.VUE_APP_API_URL +
              `/tracks?doRandomize=true&FilterRatedOnly=true`
          );
        })
        .then(response => {
          this.addTracksToQue(response.data.rows);
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    playRandomFavoriteTracks: function() {
      EventBus.$emit("loadingStarted");
      this.$playQue
        .deleteAll()
        .then(() => {
          return this.$axios.get(
            process.env.VUE_APP_API_URL +
              `/tracks?doRandomize=true&FilterFavoriteOnly=true`
          );
        })
        .then(response => {
          this.addTracksToQue(response.data.rows);
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      const that = this;
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/stats/library`)
        .then(rr => {
          that.statistics = rr.data.data;
          that.$store.commit("updateLastScan", rr.data.data.lastScan);
          that.$axios
            .get(
              process.env.VUE_APP_API_URL +
                `/releases?page=1&limit=${
                  this.recentLimit
                }&sort=CreatedDate&order=DESC`
            )
            .then(rr => {
              that.latestReleases = rr.data.rows;
              that.loadingReleases = false;
            });
          that.$axios
            .get(
              process.env.VUE_APP_API_URL +
                `/artists?page=1&limit=${
                  this.recentLimit
                }&sort=CreatedDate&order=DESC`
            )
            .then(rr => {
              that.latestArtists = rr.data.rows;
              that.loadingArtists = false;
            });
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    }
  },
  watch: {},
  data: () => ({
    dashboardMessage: null,
    loadingReleases: true,
    loadingArtists: true,
    statistics: {},
    latestReleases: [],
    latestArtists: [],
    menuItems: [
      {
        title: "Play Random Favorite Tracks",
        class: "hidden-sm-and-down",
        click: "db:PlayRandomFavoriteTracks"
      },
      {
        title: "Play Random Tracks",
        class: "",
        click: "db:PlayRandomTracks"
      },
      {
        title: "Play Random Rated Tracks",
        class: "hidden-sm-and-down",
        click: "db:PlayRandomRatedTracks"
      }
    ]
  })
};
</script>


<style>
.dashboard-detail-container .v-chip {
  padding: 4px;
}
.dashboard-detail-container a {
  text-decoration: none;
  color: inherit;
}
.dashboard-detail-container .recent-card {
  width: 100%;
}
</style>
