<template>
  <div>
    <v-card class="track-playing-card ma-1 ml-2 pa-1" height="100px" hover>
      <v-progress-linear :value="50" color="info" class="mb-1 ma-0 primary" height="5"></v-progress-linear>
      <v-layout>
        <v-flex d-flex xs6>
          <v-layout row wrap>
            <v-flex xs6>
              <img
                class="ma-1"
                style="float:left;max-width:80px;"
                :src="track.releaseImageUrl"
                :alt="track.release.text"
              >
              <div class="body-2">
                <img
                  class="ma-1"
                  style="float:left;height:13px;"
                  :src="track.artist.thumbnail.url"
                  :alt="track.artist.artist.text"
                >
                <span class="artist-name">{{ track.artist.artist.text }}</span>
              </div>
              <div class="subheading">
                <span
                  class="release-date info--text mr-2"
                >{{ track.release.releaseDate | formattedYear }}</span>
                <span class="release-title">{{ track.release.text }}</span>
              </div>
              <div class="title">
                <span class="release-date accent--text mr-2">{{ track.trackNumber | padNumber3 }}</span>
                <span>{{ track.title }}</span>
              </div>
              <div>
                <v-rating
                  v-model="track.rating"
                  class="track-rating"
                  background-color="orange lighten-3"
                  color="orange"
                  small
                  dense
                  readonly
                ></v-rating>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs3>
          <v-layout d-flex row wrap>
              <v-btn icon @click="bookmarkToogle">
                <v-icon
                  v-if="track.userBookmarked"
                  medium
                  color="info"
                  title="Click to remove from bookmarks"
                >bookmark</v-icon>
                <v-icon v-if="!track.userBookmarked" medium title="Add to bookmarks">bookmark_border</v-icon>
              </v-btn>
              <v-btn icon @click="favoriteToggle">
                <v-icon
                  medium
                  class="favorite pointer"
                  :color="track.userRating.isFavorite ? 'red' : 'accent'"
                >favorite</v-icon>
              </v-btn>
              <v-btn icon @click="hateToogle">
                <v-icon
                  v-if="track.userRating.isDisliked"
                  medium
                  color="lime"
                  title="Click to remove hate"
                >fas fa-thumbs-down</v-icon>
                <v-icon
                  v-if="!track.userRating.isDisliked"
                  medium
                  title="Click to hate"
                >far fa-thumbs-down</v-icon>
              </v-btn>

              <v-rating
                @click.native="setRating"
                @change.native="setRating"
                v-model="track.userRating.rating"
                class="pointer release-rating mt-2"
                background-color="orange lighten-3"
                color="orange"
                medium
                dense
                hover
                clearable
              ></v-rating>
          </v-layout>
          <v-layout d-flex row wrap>
            <span title="Current Playing Time of Track">
              <v-icon medium>playlist_play</v-icon>
              <span class="headline track-current-time mr-1">00:00</span>
            </span>
            <span title="Total Time of Track">
              <v-icon medium>audiotrack</v-icon>
              <span class="headline track-time mr-1">{{ track.durationTime }}</span>
            </span>
            <span title="Total Time of Que">
              <v-icon medium>headset</v-icon>
              <span class="headline track-time">{{ totalTime }}</span>
            </span>
          </v-layout>
        </v-flex>
        <v-flex xs3>
          <v-layout  row-wrap>
            <v-slider class="slider" v-model="volume" append-icon="volume_up" prepend-icon="volume_down"></v-slider>
          </v-layout>  

          <v-layout d-flex row-wrap>

              <v-btn icon>
                <v-icon>skip_previous</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>replay_30</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon >fast_rewind</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon large>play_arrow</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>fast_forward</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>forward_30</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>skip_next</v-icon>
              </v-btn>


          </v-layout>
        
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { EventBus } from "@/event-bus.js";

export default {
  name: "TrackPlayingCard",
  components: {},
  props: {
    track: {
      type: Object,
      default: function() {
        return {
          mediaNumber: 0,
          userBookmarked: false,
          userRating: {
            rating: 0,
            isFavorite: false,
            isDisliked: false
          }
        };
      }
    },
    listNumber: Number,
    totalTime: String
  },
  async mounted() {},
  methods: {
    bookmarkToogle: function(e) {},
    favoriteToggle: function(e) {},
    hateToogle: function(e) {},
    setRating: function(e) {}
  },
  computed: {
    volume: {
      get: function() {
        // get from store
        return 25;
      },
      set: function(val) {
        // store in store
      }
    },    
  },
  data: () => ({})
};
</script>

<style>
.track-playing-card .slider {
  margin: 0;
  padding: 0;
  height: 35px;
}
</style>