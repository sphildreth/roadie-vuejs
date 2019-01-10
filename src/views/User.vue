<template>
  <div class="user-detail-container">
    <div class="ma-5" v-if="loaded && user.isPrivate">
      <v-icon>fas fa-user-shield</v-icon>
      User has elected to be private, mysterious and elusive.
    </div>
    <div v-if="loaded && !user.isPrivate">
      <v-container v-if="loaded" fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm7 md7>
            <v-layout row wrap>
              <v-flex xs12>
                <v-card color="primary" class="profile darken-1">
                  <v-card-text class="title">
                    {{ user.userName }}
                    <v-icon
                      v-if="user.isAdmin"
                      style="float: right;"
                      title="Is an Admin!"
                      color="yellow"
                    >supervised_user_circle</v-icon>
                    <v-icon
                      v-if="user.isEditor"
                      style="float: right;"
                      title="Is an Editor!"
                      color="yellow"
                    >user-edit</v-icon>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs3>
                <v-img
                  :src="user.avatar.url"
                  :alt="user.userName"
                  class="ma-1"
                  aspect-ratio="1"
                ></v-img>
              </v-flex>
              <v-flex xs9>                    
              </v-flex>                
            </v-layout>            
          </v-flex>
          <v-flex d-flex xs12 sm5 md5>
            <v-tabs right color="primary" slider-color="accent">
              <v-tab>Profile</v-tab>
              <v-tab-item>
                <v-card flat class="profile darken-3">
                  <vue-markdown>{{user.profile}}</vue-markdown>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-flex>
        </v-layout>

        <v-layout row wrap>

            <v-flex xs5 md4 lg3>
              <span>Most Played Artist</span>
              <ArtistCard v-if="user.statistics.mostPlayedArtist" :artist="user.statistics.mostPlayedArtist"></ArtistCard>
            </v-flex>

            <v-flex xs5 md4 lg3>
              <span>Most Played Release</span>
              <ReleaseCard v-if="user.statistics.mostPlayedRelease" :release="user.statistics.mostPlayedRelease"></ReleaseCard>
            </v-flex>

            <v-flex xs9 md6 lg5>
              <span class="ml-2">Most Played Track</span>
              <TrackCard v-if="user.statistics.mostPlayedTrack" :track="user.statistics.mostPlayedTrack"></TrackCard>
            </v-flex> 

        </v-layout>

      </v-container>
      <v-layout align-center justify-space-between row wrap>
        <v-flex d-flex xs12>
          <div class="stats-container">
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="orange">fas fa-users</v-icon>
                </v-avatar>
                {{ user.statistics.ratedArtists | padNumber4 }}
              </v-chip>
              <span>User Rated Artists</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="orange">library_music</v-icon>
                </v-avatar>
                {{ user.statistics.ratedReleases | padNumber4 }}
              </v-chip>
              <span>User Rated Releases</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="orange">audiotrack</v-icon>
                </v-avatar>
                {{ user.statistics.ratedTracks | padNumber4 }}
              </v-chip>
              <span>User Rated Tracks</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">fas fa-users</v-icon>
                </v-avatar>
                {{ user.statistics.favoritedArtists | padNumber4 }}
              </v-chip>
              <span>User Favorite Artists</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">library_music</v-icon>
                </v-avatar>
                {{ user.statistics.favoritedReleases | padNumber4 }}
              </v-chip>
              <span>User Favorite Releases</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">audiotrack</v-icon>
                </v-avatar>
                {{ user.statistics.favoritedTracks | padNumber4 }}
              </v-chip>
              <span>User Favorite Tracks</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">fas fa-users</v-icon>
                </v-avatar>
                {{ user.statistics.dislikedArtists | padNumber4 }}
              </v-chip>
              <span>User Hated Artists</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">library_music</v-icon>
                </v-avatar>
                {{ user.statistics.dislikedReleases | padNumber4 }}
              </v-chip>
              <span>User Hated Releases</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">audiotrack</v-icon>
                </v-avatar>
                {{ user.statistics.dislikedTracks | padNumber4 }}
              </v-chip>
              <span>User Hated Tracks</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>play_circle_outline</v-icon>
                </v-avatar>
                {{ user.statistics.playedTracks | padNumber6 }}
              </v-chip>
              <span>User Tracks Played</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import TrackCard from "@/components/TrackCard";

import { EventBus } from "@/event-bus.js";
export default {
  components: { VueMarkdown, ArtistCard, ReleaseCard, TrackCard },
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
    addToQue: function() {},
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/users/${this.id}`)
        .then(response => {
          this.user = response.data.data;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.loaded = true;
        });
      EventBus.$emit("loadingComplete");
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    }
  },
  data: () => ({
    loaded: false,
    user: {}
  })
};
</script>


<style>
.user-detail-container .profile {
  max-height: 350px;
  overflow: auto;
}
</style>
