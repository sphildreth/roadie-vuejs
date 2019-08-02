<template>
  <v-card class="mb-3" hover :data-id="user.id">
    <v-layout>
      <v-flex xs4>
        <router-link :to="'/user/' + user.user.value">
          <v-img
            :src="user.thumbnail.url"
            :alt="user.id"
            max-width="80"
            class="ma-1"
            lazy-src="data:image/jpg;base64,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"
          ></v-img>
        </router-link>
      </v-flex>
      <v-flex xs8>
        <v-card-title primary-title class="pa-0 ma-0">
          <div>
            <router-link :to="'/user/' + user.user.value">
              <div
                :title="user.user.text"
                class="user-username subheading font-weight-medium pointer"
              >{{ user.user.text }}
              <v-icon
                small
                v-if="user.isPrivate"
                class="mt-1 mr-1"
                style="float: right;"
                title="This user&#39;s profile is not public!"
                color="#FEEFB3"
              >visibility_off</v-icon>               
              <v-icon
                v-if="user.isAdmin"
                style="float: right;"
                class="mr-1 mt-1"
                small
                title="This user is an Admin!"
                color="#FFD700"
              >supervised_user_circle</v-icon>
              <v-icon
                v-if="user.isEditor"                    
                small
                style="float: right;"
                class="mr-1 mt-1"                     
                title="This user is an Editor!"
                color="success"
              >account_circle</v-icon>
              </div>
            </router-link>
            <div v-if="showStats">
              <div class="mt-1 caption accent--text">
                <span title="User Favorite Artists">
                  <v-icon :color="user.statistics.favoriteArtists > 0 ? 'red' : 'secondary'" class="hidden-xs-only" small>fas fa-users</v-icon>
                  {{ user.statistics.favoriteArtists | padNumber4 }}
                  </span> |
                <span title="User Favorite Releases">
                  <v-icon :color="user.statistics.favoritedReleases > 0 ? 'red' : 'secondary'" class="hidden-xs-only" small>library_music</v-icon>
                  {{ user.statistics.favoritedReleases | padNumber4 }}
                </span> |
                <span title="User Favorite Tracks">
                  <v-icon :color="user.statistics.favoritedTracks > 0 ? 'red' : 'secondary'" class="hidden-xs-only" small>audiotrack</v-icon>
                  {{ user.statistics.favoritedTracks | padNumber4 }}
                  </span>
              </div>  
              <div class="caption accent--text">
                <span title="User Disliked Artists">
                  <v-icon :color="user.statistics.dislikedArtists > 0 ? 'lime' : 'secondary'" class="hidden-xs-only" small>fas fa-users</v-icon>
                  {{ user.statistics.dislikedArtists | padNumber4 }}
                  </span> |
                <span title="User Disliked Releases">
                  <v-icon :color="user.statistics.dislikedReleases > 0 ? 'lime' : 'secondary'" class="hidden-xs-only" small>library_music</v-icon>
                  {{ user.statistics.dislikedReleases | padNumber4 }}
                </span> |
                <span title="User Disliked Tracks">
                  <v-icon :color="user.statistics.dislikedTracks > 0 ? 'lime' : 'secondary'" class="hidden-xs-only" small>audiotrack</v-icon>
                  {{ user.statistics.dislikedTracks | padNumber4 }}
                  </span>
              </div>              
              <div class="mt-1 caption accent--text">
                <span title="User Played Tracks">
                  <v-icon :color="user.statistics.playedTracks > 0 ? 'info' : 'secondary'" class="hidden-xs-only" small>play_circle_outline</v-icon>
                  {{ user.statistics.playedTracks | padNumber6 }}
                </span>
              </div>                
            </div>       
          </div>
        </v-card-title>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    showStats: Boolean,
    user: {
      type: Object,
      default: function() {
        return {
          statistics: {            
            playedTracks: 0,
            favoriteArtists: 0,
            favoritedReleases: 0,
            favoritedTracks: 0            
          }
        };
      }
    },
  },
  methods: {},
  computed: {}
};
</script>

<style>
</style>