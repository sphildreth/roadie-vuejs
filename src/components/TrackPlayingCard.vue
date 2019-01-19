<template>
  <div v-if="loaded">
    <v-card class="track-playing-card" height="100px" hover>
      <v-progress-linear
        v-if="trackDownloading"
        height="2"
        color="accent"
        class="ma-0 pa-0"
        indeterminate
      ></v-progress-linear>
      <div>
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
                    id="trackCover"
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
                    >{{ currentTrack.release.text }}</span>
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
                <span class="headline track-time">{{ quePlayTime | timeFromMilliseconds }}</span>
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
              <v-btn
                color="primary lighten-1"
                title="Play Previous Track"
                icon
                @click="skip('prev')"
              >
                <v-icon>skip_previous</v-icon>
              </v-btn>
              <v-btn title="Replay last 30 seconds" icon @click="seekByAmount(-30)">
                <v-icon>replay_30</v-icon>
              </v-btn>
              <v-btn title="Rewind 1 second" icon @click="seekByAmount(-1)">
                <v-icon>fast_rewind</v-icon>
              </v-btn>
              <v-btn
                color="green darken-2"
                :title="playing ? 'Pause Playing' : 'Start Playing'"
                icon
                @click="play"
              >
                <v-icon large>{{ playing ? 'pause' : 'play_arrow'}}</v-icon>
              </v-btn>
              <v-btn color="red darken-2" title="Stop Playing" icon @click="stop">
                <v-icon>stop</v-icon>
              </v-btn>
              <v-btn title="Forward 1 second" icon @click="seekByAmount(1)">
                <v-icon>fast_forward</v-icon>
              </v-btn>
              <v-btn title="Forward 30 seconds" icon @click="seekByAmount(30)">
                <v-icon>forward_30</v-icon>
              </v-btn>
              <v-btn color="primary lighten-1" title="Play Next Track" icon @click="skip('next')">
                <v-icon>skip_next</v-icon>
              </v-btn>
              <v-btn title="Enable Que Repeat" flat icon @click="toggleLoop">
                <v-icon :color="loop ? 'light-blue' : 'white'">repeat</v-icon>
              </v-btn>
              <v-btn title="Toggle Fullscreen Mode" flat icon @click="toggleFullScreen">
                <v-icon>fullscreen</v-icon>
              </v-btn>
              <v-btn title="Display Playing/Que" flat icon to="/playque">
                <v-icon>headset</v-icon>
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
import { EventBus } from "@/event-bus.js";

export default {
  name: "TrackPlayingCard",
  mixins: [trackMixin],
  components: {},
  created() {
    EventBus.$on("q:addedTracksToQue", this.queModified);
    EventBus.$on("q:deletedTrackFromQue", info => this.queModified(info));
    EventBus.$on("q:deletedAllTrackFromQue", info => this.queModified(info));
  },
  beforeDestroy() {
    EventBus.$off("q:addedTracksToQue", this.queModified);
    EventBus.$off("q:deletedTrackFromQue", info => this.queModified(info));
    EventBus.$off("q:deletedAllTrackFromQue", info => this.queModified(info));
    if(this.howl) {
      this.howl.unload();
    }
  },  
  async mounted() {
    this.originalWindowTitle = document.title;
    this.loadFirstTrackInQue();
  },
  methods: {
    loadFirstTrackInQue() {
      const that = this;
      this.$playQue.firstTrack()
      .then(response => {
        if (response.isSuccess) {
          that.queIndex = response.track.index;
          that.firstTrackIndex = response.firstTrackIndex;
          that.lastTrackIndex = response.lastTrackIndex;
          that.trackDownloading = true;
          Howler.volume(that.volume);
          that.currentTrack = response.track;
          that.loaded = true;
          return this.$playQue.totalTime()
        } else {
          // No tracks in Que
          that.loaded = false;
          return false;
        }
      })
      .then(function(ttResponse) {
        if(ttResponse) {
          that.quePlayTime = ttResponse.totalTime;
        }
      });
    },
    queModified: function(info) {
      if(info && info.totalCount === 0) {
        this.stop();
        this.loaded = false;
        return;
      }
      this.$nextTick(() => {
        this.$playQue.totalTime()
        .then(response => {
          // removed all tracks from que stop playing hide player
          if (!response.isSuccess || response.totalTime === 0) {
            this.stop();
            this.loaded = false;
            return;
          }
          // modified que, que has tracks, not playing, start playing first track
          if (response.isSuccess && response.totalTime > 0 && !this.playing) {
            this.loadFirstTrackInQue();
            return;
          }
          // modified que, playing, just update first and last index
          if (response.isSuccess && this.playing) {
            this.firstTrackIndex = response.firstTrackIndex;
            this.lastTrackIndex = response.lastTrackIndex;
          }
          this.quePlayTime = response.totalTime;
        });
      })
    },
    toggleFullScreen() {
      let docElm = document.documentElement;
      if (this.isFullScreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.isFullScreen = false;
        this.$nextTick(() => {
          EventBus.$emit("loadingComplete");
        });
      } else {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
        this.isFullScreen = true;
      }
      this.$store.dispatch("toggleFullscreen", this.isFullScreen);
    },
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
      if (this.queIndex != this.currentTrack.index) {
        let that = this;
        this.$playQue.trackByIndex(this.queIndex)
        .then(response => {
          if (response.isSuccess) {
            that.queIndex = response.track.index;
            that.trackDownloading = true;
            that.currentTrack = response.track;
            that.loaded = true;
          }
        });
      } else {
        if (!this.playing) {
          this.howl.play();
          this.playing = true;
          this.showPlayingNotification();
        } else {
          this.howl.pause();
          this.playing = false;
        }
      }
    },
    showPlayingNotification() {
      let title = this.currentTrack.title;
      let options = {
        icon: this.currentTrack.releaseImageUrl,
        body:
          this.currentTrack.releaseArtist.artist.text +
          "\r\n" +
          this.$filters.formattedYear(this.currentTrack.release.releaseDate) +
          " " +
          this.currentTrack.title,
        requireInteraction: false,
        tag: "roadie-playing-track-no-require-interaction"
      };
      if (Notification.permission !== "denied") {
        if (Notification.permission !== "granted") {
          Notification.requestPermission();
        }
        if (Notification.permission === "granted") {
          // eslint-disable-next-line
          var notify = new Notification(title, options);
        }
      }
    },
    stop: function() {
      if (this.howl) {
        this.howl.stop();
      }
      document.title = this.originalWindowTitle;
      this.playing = false;
    },
    skip: function(direction) {
      if (direction === "next") {
        let isPlayingLastTrack = this.queIndex === this.lastTrackIndex;
        if (isPlayingLastTrack && !this.loop) {
          this.stop();
          return;
        }
        if (isPlayingLastTrack && this.loop) {
          this.queIndex = this.firstTrackIndex;
        } else {
          this.queIndex++;
        }
      } else {
        let isPlayingFirstTrack = this.queIndex === this.firstTrackIndex;
        if (isPlayingFirstTrack && !this.loop) {
          this.stop();
          return;
        }
        if (isPlayingFirstTrack && this.loop) {
          this.queIndex = this.lastTrackIndex;
        } else {
          this.queIndex--;
        }
      }
      this.$nextTick(() => {
        this.play();
      });
    },
    toggleBookmark: function() {
      this.bookmarkToggle({
        trackId: this.currentTrack.id,
        userBookmarked: !this.currentTrack.userBookmarked
      }).then(() => {
        this.currentTrack.userBookmarked = !this.currentTrack.userBookmarked;
      });
    },
    toggleFavorite: function() {
      this.favoriteToggle({
        trackId: this.currentTrack.id,
        isFavorite: !this.currentTrack.userRating.isFavorite
      }).then(() => {
        this.currentTrack.userRating.isFavorite = !this.currentTrack.userRating
          .isFavorite;
      });
    },
    hateToogle: function() {
      this.dislikeToggle({
        trackId: this.currentTrack.id,
        isDisliked: !this.currentTrack.userRating.isDisliked
      }).then(() => {
        this.currentTrack.userRating.isDisliked = !this.currentTrack.userRating
          .isDisliked;
      });
    },
    setRating: async function() {
      this.$nextTick(() => {
        this.ratingChange({
          trackId: this.currentTrack.id,
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
    },
    updatePlaying() {
      document.title = this.currentTrack.title;
      this.trackDownloading = false;
      this.playingTrackId = this.currentTrack.id;
      this.playing = true;
      var image = document.getElementById("trackCover");
      window.favIcon.image(image);
      this.$store.dispatch("playIndexChange", {
        index: this.queIndex,
        trackId: this.currentTrack.id,
        releaseId: this.currentTrack.release.value,
        artistId: this.currentTrack.artist.id
      });
      EventBus.$emit("loadingComplete");
    }
  },
  watch: {
    currentTrack(trackInfo) {
      this.stop();
      if (this.howl) {
        this.howl.unload();
      }
      if (!trackInfo) {
        return;
      }
      if (trackInfo.id === this.playingTrackId && this.playing) {
        return;
      }
      this.trackDownloading = true;
      EventBus.$emit("loadingStarted");
      this.howl = new Howl({
        volume: this.volume,
        loop: this.loop,
        src: this.currentTrack.trackPlayUrl,
        autoplay: true,
        onplay: () => {
          this.updatePlaying();
        },
        onend: () => {
          this.skip("next");
        }
      });
    },
    playing(playing) {
      this.seek = this.howl ? this.howl.seek() : 0;
      let updateSeek;
      if (playing) {
        updateSeek = setInterval(() => {
          try {
            this.seek = this.howl ? this.howl.seek() : 0;
          } catch (e) {
            clearInterval(updateSeek);
          }
        }, 250);
      } else {
        clearInterval(updateSeek);
      }
      this.$store.dispatch("nowPlaying", playing);
    },
    playRequestTrackInfo(trackInfo) {
      if(this.queIndex != trackInfo.index) {
        this.queIndex = trackInfo.index;
        this.$nextTick(() => {
          this.stop();
          this.play();
          return;
        });
      }
      if(!this.playing) {
        this.play();
      }
    }
  },
  computed: {
    progress() {
      if (!this.howl || this.howl.duration() === 0) return 0;
      return this.seek / this.howl.duration();
    },
    trackProgress() {
      return this.progress * 100;
    },
    playRequestTrackInfo() {
      return this.$store.getters.playRequestTrackInfo;
    }
  },
  data: () => ({
    quePlayTime: 0,
    isFullScreen: false,
    currentTrack: {},
    howl: {
      playing: false,
      duration: function() {
        return 0;
      },
      unload: function() {},
      stop: function() {}
    },
    playingTrackId: null,
    trackDownloading: false,
    playing: false,
    muted: false,
    volume: 0.5,
    loaded: false,
    originalWindowTitle: "",
    queIndex: 0,
    firstTrackIndex: 0,
    lastTrackIndex: 0,
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
  color: white !important;
}
img.artist-image {
  height: 20px;
  vertical-align: middle;
}
</style>