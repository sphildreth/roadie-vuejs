<template>
  <div class="playlist-detail-container">
    <Toolbar :menuItems="menuItems" :toolbarIcon="'dashboard'"></Toolbar>
    <v-layout row wrap>
      <v-flex d-flex xs12 class="ma-3">
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>supervisor_account</v-icon>
            </v-avatar>
            {{ statistics.userCount | padNumber2 }}
          </v-chip>
          <span>Total Users in the system</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>collections</v-icon>
            </v-avatar>
            {{ statistics.collectionCount | padNumber3 }}
          </v-chip>
          <span>Total Collections in the system</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>playlist_play</v-icon>
            </v-avatar>
            {{ statistics.playlistCount | padNumber3 }}
          </v-chip>
          <span>Total Playlists in the system</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>label</v-icon>
            </v-avatar>
            {{ statistics.labelCount | padNumber5 }}
          </v-chip>
          <span>Total Labels in the system</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>fas fa-users</v-icon>
            </v-avatar>
            {{ statistics.artistCount | padNumber6 }}
          </v-chip>
          <span>Total Artists in the system</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>library_music</v-icon>
            </v-avatar>
            {{ statistics.releaseCount | padNumber6 }}
          </v-chip>
          <span>Total Releases in the Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>album</v-icon>
            </v-avatar>
            {{ statistics.releaseMediaCount | padNumber6 }}
          </v-chip>
          <span>Total Release Medias in the Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>audiotrack</v-icon>
            </v-avatar>
            {{ statistics.trackCount | padNumber7 }}
          </v-chip>
          <span>Total Tracks in Library</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>play_circle_outline</v-icon>
            </v-avatar>
            {{ statistics.playedCount | padNumber6 }}
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
    <v-layout row wrap>
      <v-card :dark="$vuetify.dark" xs12 class="ma-3">
        <v-card-title class="primary--text">Recently Added Releases</v-card-title>
        <v-container fluid grid-list-md>
          <v-data-iterator :items="latestReleases" :total-items="6"  :hide-actions="true" content-tag="v-layout" :loading="true" row wrap>
              <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
                <ReleaseCard :release="props.item"></ReleaseCard>
              </v-flex>
          </v-data-iterator>      
        </v-container> 
      </v-card>
    </v-layout>
    <v-layout row wrap>
      <v-card :dark="$vuetify.dark" xs12 class="ma-3">
        <v-card-title class="primary--text">Recently Added Artists</v-card-title>
        <v-container fluid grid-list-md>
          <v-data-iterator :items="latestArtists" :total-items="6"  :hide-actions="true" content-tag="v-layout" :loading="true" row wrap>
              <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
                <ArtistCard :artist="props.item"></ArtistCard>
              </v-flex>
          </v-data-iterator>      
        </v-container> 
      </v-card>
    </v-layout>    
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar';
import ReleaseCard from '@/components/ReleaseCard';
import ArtistCard from '@/components/ArtistCard';
import { EventBus } from "@/event-bus.js";
export default {
  components: { Toolbar, ReleaseCard, ArtistCard },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  async mounted() {
    this.updateData();
  },
  methods: {
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/stats/library`)
        .then(rr => {
          this.statistics = rr.data.data;
            this.$axios
              this.$axios.get(process.env.VUE_APP_API_URL + `/releases?page=1&limit=8&sort=CreatedDate&order=DESC`)
              .then(rr => {
                this.latestReleases = rr.data.rows;
                this.$axios
                  this.$axios.get(process.env.VUE_APP_API_URL + `/artists?page=1&limit=8&sort=CreatedDate&order=DESC`)
                  .then(rr => {
                    this.latestArtists = rr.data.rows;
                    EventBus.$emit("loadingComplete");
                  });    
              });          
        });
    }
  },
  watch: {},
  data: () => ({
    statistics: {},
    latestReleases: [],
    latestArtists: [],
    menuItems: []
  })
};
</script>


<style>
</style>
