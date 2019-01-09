<template>
  <div >    
    <v-card class="track-playing-card" height="100px" hover>
      <v-progress-linear v-if="trackDownloading" height="2" color="accent" class="ma-0 pa-0" indeterminate></v-progress-linear>
      <div v-if="loaded">
        <v-progress-linear
          id="trackProgressBar"
          height="5"
          class="ma-0 pa-0 pointer"
          color="info"
          :value="trackProgress"
          @click="updateSeek($event)"
        ></v-progress-linear>
        <v-layout>
          <v-flex d-flex xs6>
            <v-layout row wrap>
              <v-flex xs12>
                <router-link :to="'/release/' + currentTrack.release.value">
                  <img
                    class="ma-1"
                    style="float:left;max-width:80px;"
                    :src="currentTrack.releaseImageUrl"
                    :alt="currentTrack.release.text"
                  >
                </router-link>
                <div class="body-2" title="View Artist Details">
                  <router-link
                    v-if="currentTrack.artist.artist.value != currentTrack.releaseArtist.id"
                    :to="'/artist/' + currentTrack.releaseArtist.artist.value"
                  >
                    <img
                      class="ma-1 artist-image"
                      :src="currentTrack.releaseArtist.thumbnail.url"
                      :alt="currentTrack.releaseArtist.artist.text"
                    >
                    <span
                      class="artist-name badge text-no-wrap text-truncate pointer"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.releaseArtist.artist.text }}</span>
                  </router-link>
                  <span
                    v-if="currentTrack.artist.artist.value != currentTrack.releaseArtist.id"
                    class="mx-1"
                  >::</span>
                  <router-link :to="'/artist/' + currentTrack.artist.artist.value">
                    <img
                      class="ma-1 artist-image"
                      :src="currentTrack.artist.thumbnail.url"
                      :alt="currentTrack.artist.artist.text"
                    >
                    <span
                      class="artist-name badge text-no-wrap text-truncate pointer"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.artist.artist.text }}</span>
                  </router-link>
                </div>
                <div title="View Release Details">
                  <router-link :to="'/release/' + currentTrack.release.value">
                    <span
                      class="release-date badge subheading mr-2"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.release.releaseDate | formattedYear }}</span>
                    <span
                      class="release-title badge text-no-wrap text-truncate pointer subheading"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ track.release.text }}</span>
                  </router-link>
                </div>
                <div title="View Track Details">
                  <router-link :to="'/track/' + currentTrack.id">
                    <span
                      class="release-date badge title mr-2"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.trackNumber | padNumber3 }}</span>
                    <span
                      class="release-title badge text-no-wrap text-truncate pointer title"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.title }}</span>
                  </router-link>
                </div>
                <div>
                  <v-rating
                    v-model="currentTrack.rating"
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
              <v-btn icon @click="toggleBookmark">
                <v-icon
                  v-if="currentTrack.userBookmarked"
                  medium
                  color="info"
                  title="Click to remove from bookmarks"
                >bookmark</v-icon>
                <v-icon
                  v-if="!currentTrack.userBookmarked"
                  medium
                  title="Add to bookmarks"
                >bookmark_border</v-icon>
              </v-btn>
              <v-btn icon @click="toggleFavorite">
                <v-icon
                  medium
                  class="favorite pointer"
                  :color="currentTrack.userRating.isFavorite ? 'red' : ''"
                >favorite</v-icon>
              </v-btn>
              <v-btn icon @click="hateToogle">
                <v-icon
                  v-if="currentTrack.userRating.isDisliked"
                  medium
                  color="lime"
                  title="Click to remove hate"
                >fas fa-thumbs-down</v-icon>
                <v-icon
                  v-if="!currentTrack.userRating.isDisliked"
                  medium
                  title="Click to hate"
                >far fa-thumbs-down</v-icon>
              </v-btn>

              <v-rating
                @click.native="setRating"
                @change.native="setRating"
                v-model="currentTrack.userRating.rating"
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
                <v-icon medium>play_arrow</v-icon>
                <span class="headline track-current-time mr-1">{{ seek | minutes }}</span>
              </span>
              <span title="Total Time of Track">
                <v-icon medium>audiotrack</v-icon>
                <span class="headline track-time mr-1">{{ currentTrack.durationTime }}</span>
              </span>
              <span title="Total Time of Que">
                <v-icon medium>headset</v-icon>
                <span
                  class="headline track-time"
                >{{ this.$store.getters.quePlaytime | timeFromMilliseconds }}</span>
              </span>
            </v-layout>
          </v-flex>
          <v-flex xs3>
            <v-layout row-wrap>
              <v-btn flat icon @click="toggleMute">
                <template v-if="!this.muted">
                  <v-icon v-if="this.volume >= 0.5">volume_up</v-icon>
                  <v-icon v-else-if="this.volume > 0">volume_down</v-icon>
                  <v-icon v-else>volume_mute</v-icon>
                </template>
                <v-icon v-show="this.muted">volume_off</v-icon>
              </v-btn>
              <v-slider
                class="slider"
                @change="updateVolume(volume)"
                max="1"
                step="0.1"
                v-model="volume"
              ></v-slider>
            </v-layout>

            <v-layout d-flex row-wrap>
              <v-btn icon @click="skip('prev')">
                <v-icon title="Skip Previous">skip_previous</v-icon>
              </v-btn>
              <v-btn icon @click="seekByAmount(-30)">
                <v-icon>replay_30</v-icon>
              </v-btn>
              <v-btn icon @click="seekByAmount(-1)">
                <v-icon>fast_rewind</v-icon>
              </v-btn>
              <v-btn icon @click="play">
                <v-icon large>{{ playing ? 'pause' : 'play_arrow'}}</v-icon>
              </v-btn>
              <v-btn icon @click="stop">
                <v-icon>stop</v-icon>
              </v-btn>
              <v-btn icon @click="seekByAmount(1)">
                <v-icon>fast_forward</v-icon>
              </v-btn>
              <v-btn icon @click="seekByAmount(30)">
                <v-icon>forward_30</v-icon>
              </v-btn>
              <v-btn icon @click="skip('next')">
                <v-icon title="Skip Next">skip_next</v-icon>
              </v-btn>
              <v-btn flat icon @click="toggleLoop">
                <v-icon :color="loop ? 'light-blue' : 'white'">repeat</v-icon>
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </v-card>
  </div>
</template>

<script>
import { Howl, Howler } from "howler";
import trackMixin from "@/mixins/track.js";

export default {
  name: "TrackPlayingCard",
  mixins: [trackMixin],
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
    listNumber: Number
  },
  beforeDestroy() {
    this.howl.unload();
  },
  async mounted() {
    this.originalWindowTitle = document.title;
    Howler.volume(this.volume);
    let that = this;
    var trackInQue = this.$_.find(this.$store.getters.playQue, function(t) {
      return t.track.id === that.track.id;
    });
    this.$nextTick(() => {
      this.playingIndex = trackInQue.listNumber - 1;
    });
    this.trackDownloading = true;
    this.howl = new Howl({
      volume: this.volume,
      loop: this.loop,
      src: this.currentTrack.trackPlayUrl,
      autoplay: true,
      onplay: () => {
        this.trackDownloading = false;
        this.playing = true;
        this.playingTrackId = this.currentTrack.id,         
        this.$store.dispatch("playIndexChange", {
          index: this.playingIndex,
          trackId: this.currentTrack.id,
          releaseId: this.currentTrack.release.value,
          artistId: this.currentTrack.artist.id
        });
      },
      onend: () => {
        this.skip("next");
      }
    });
    this.loaded = true;
  },
  methods: {
    updateSeek(event) {
      let el = document.getElementById("trackProgressBar"),
        mousePos = event.offsetX,
        elWidth = el.clientWidth,
        percents = (mousePos / elWidth) * 100;
      let howl = this.howl;
      if (howl.playing()) {
        howl.seek((howl.duration() / 100) * percents);
      }
    },
    seekByAmount(amount) {
      this.howl.seek(this.howl.seek() + amount);
    },
    play: function() {
      if (!this.playing) {
        this.howl.play();
        this.playing = true;
        this.showPlayingNotification();
      } else {
        this.howl.pause();
        this.playing = false;
      }
    },
    showPlayingNotification() {
      let title = this.currentTrack.title;
      let options = {
            icon: this.currentTrack.releaseImageUrl,
            body: this.currentTrack.releaseArtist.artist.text + "\r\n" + this.$filters.formattedYear(this.currentTrack.release.releaseDate) + " " + this.currentTrack.title,
            requireInteraction: false,
            tag: 'roadie-playing-track-no-require-interaction'
      };
      if (Notification.permission !== 'denied') {
          if (Notification.permission !== "granted") {
              Notification.requestPermission();
          }
          if (Notification.permission === "granted") {
              var notify = new Notification(title, options);
          }
      }
    },
    stop: function() {
      this.howl.stop();
      this.playing = false;
    },
    skip: function(direction) {
      if (direction === "next") {
        let isPlayingLastTrack =
          this.playingIndex === this.$store.getters.playQue.length;
        if (isPlayingLastTrack && this.loop) {
          this.playingIndex = 0;
        }
        if (isPlayingLastTrack && !this.loop) {
          this.stop();
          return;
        }
        this.playingIndex++;
      } else {
        let isPlayingFirstTrack = this.playingIndex === 0;
        if (isPlayingFirstTrack && this.loop) {
          this.playingIndex = this.$store.getters.playQue.length - 1;
        }
        if (isPlayingFirstTrack && !this.loop) {
          this.stop();
          return;
        }
        this.playingIndex--;
      }
      this.$nextTick(() => {
        this.play();
      });
    },
    toggleBookmark: function() {
      this.bookmarkToggle({
        trackId: this.track.id,
        userBookmarked: !this.currentTrack.userBookmarked
      }).then(() => {
        this.currentTrack.userBookmarked = !this.currentTrack.userBookmarked;
      });
    },
    toggleFavorite: function() {
      this.favoriteToggle({
        trackId: this.track.id,
        isFavorite: !this.currentTrack.userRating.isFavorite
      }).then(() => {
        this.currentTrack.userRating.isFavorite = !this.currentTrack.userRating
          .isFavorite;
      });
    },
    hateToogle: function() {
      this.dislikeToggle({
        trackId: this.track.id,
        isDisliked: !this.currentTrack.userRating.isDisliked
      }).then(() => {
        this.currentTrack.userRating.isDisliked = !this.currentTrack.userRating
          .isDisliked;
      });
    },
    setRating: async function() {
      this.$nextTick(() => {
        this.ratingChange({
          trackId: this.track.id,
          newVal: this.currentTrack.userRating.rating
        }).then(this.updateData);
      });
    },
    toggleLoop() {
      this.loop = !this.loop;
    },
    updateVolume: function(volume) {
      Howler.volume(volume);
    },
    toggleMute() {
      Howler.mute(!this.muted);
      this.muted = !this.muted;
    }
  },
  watch: {
    currentTrack(trackInfo) {
      if(trackInfo.id === this.playingTrackId && this.playing) {
        return;
      }
      this.stop();
      this.howl.unload();
      this.trackDownloading = true;
      this.howl = new Howl({
        volume: this.volume,
        loop: this.loop,
        src: this.currentTrack.trackPlayUrl,
        autoplay: true,
        onplay: () => {
          this.trackDownloading = false;    
          this.playingTrackId = this.currentTrack.id,   
          this.playing = true;
          this.$store.dispatch("playIndexChange", {
            index: this.playingIndex,
            trackId: this.currentTrack.id,
            releaseId: this.currentTrack.release.value,
            artistId: this.currentTrack.artist.id
          });
        },
        onend: () => {
          this.skip("next");
        }
      });
    },
    playing(playing) {
      this.seek = this.howl.seek();
      let updateSeek;
      if (playing) {
        updateSeek = setInterval(() => {
          try {
            this.seek = this.howl.seek();
          } catch (e) {
            clearInterval(updateSeek);
          }
        }, 250);
      } else {
        clearInterval(updateSeek);
      }
      this.$store.dispatch("nowPlaying", playing);
    },
    storePlayingIndex(newIndex) {
      // if(!newIndex || newIndex.length === 0 || newIndex.index != this.playingIndex) {
      //   this.playingIndex = newIndex.index || 0;
      // }
    }
  },
  computed: {
    storePlayingIndex() {
      return this.$store.getters.playingIndex;
    },
    currentTrack() {
      return this.$store.getters.playQue[this.playingIndex].track;
    },
    progress() {
      if (!this.howl || this.howl.duration() === 0) return 0;
      return this.seek / this.howl.duration();
    },
    trackProgress() {
      return this.progress * 100;
    }
  },
  data: () => ({
    howl: {
      playing: false
    },
    playingTrackId: null,
    trackDownloading: false,
    playing: false,
    muted: false,
    volume: 0.5,
    loaded: false,
    originalWindowTitle: "",
    playingIndex: 0,
    currentTime: 0,
    seek: 0,
    loop: false,
    shuffle: false
  })
};
</script>

<style>
.track-playing-card .slider {
  margin: 0;
  padding: 0;
  height: 35px;
}
.badge {
  padding: 1px 4px;
  border-radius: 5px;
  color:white !important;
}
img.artist-image {
  height:20px;
  vertical-align:middle;
}
</style>