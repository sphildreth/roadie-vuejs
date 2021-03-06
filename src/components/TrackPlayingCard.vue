<template>
  <div v-if="!hide && loaded">
    <v-card v-if="!smallPlayer" class="track-playing-card" hover>
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
        <v-layout row wrap class="hidden-md-and-up">
          <v-btn
            color="primary lighten-1"
            title="Play Previous Track"
            icon
            @click="skip('prev')"
          >
            <v-icon>skip_previous</v-icon>
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
          <v-btn color="primary lighten-1" title="Play Next Track" icon @click="skip('next')">
            <v-icon>skip_next</v-icon>
          </v-btn>
          <v-btn title="Enable Que Repeat" flat icon @click="toggleLoop">
            <v-icon :color="loop ? 'light-blue' : 'white'">repeat</v-icon>
          </v-btn>
          <v-spacer></v-spacer>       
          <v-btn class="hidden-xs-only" icon @click="toggleBookmark">
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
          <v-btn class="hidden-xs-only" icon @click="toggleFavorite">
            <v-icon
              medium
              class="favorite pointer"
              :color="currentTrack.userRating.isFavorite ? 'red' : ''"
            >favorite</v-icon>
          </v-btn>          
          <v-btn class="hidden-xs-only" icon @click="hateToogle">
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
          <v-btn title="Display Playing/Que" flat icon to="/playque">
            <v-icon>headset</v-icon>
          </v-btn>
        </v-layout>        
        <v-layout wrap row>
          <v-flex d-flex xs12 md6>
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
                      class="release-date badge mr-2 hidden-xs-only"
                      :class="this.$vuetify.breakpoint.name === 'xs' ? 'subheading' : 'title'"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.trackNumber | padNumber3 }}</span>
                    <span
                      class="release-title badge text-no-wrap text-truncate pointer"
                      :class="this.$vuetify.breakpoint.name === 'xs' ? 'subheading' : 'title'"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.title }}</span>
                  </router-link>
                </div>
                <div>
                  <v-rating
                    v-model="currentTrack.rating"
                    class="track-rating hidden-sm-and-down"
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
          <v-flex md3 class="hidden-sm-and-down">
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
              <span class="pointer" :title="queDisplayTimeTooltip" @click="toggleQuePlayTime">
                <v-icon medium>headset</v-icon>
                <span class="headline track-time">{{ queDisplayTime | timeFromMilliseconds }}</span>
              </span>
            </v-layout>
          </v-flex>
          <v-flex md3 class="hidden-sm-and-down">
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
              <v-btn title="Show Small Player" flat icon @click="smallPlayer = !smallPlayer">
                <v-icon>compress</v-icon>
              </v-btn>
              <v-btn title="Display Playing/Que" flat icon to="/playque">
                <v-icon>headset</v-icon>
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </v-card>
    <v-card v-if="smallPlayer" class="track-playing-card small-player" height="30px">
      <v-progress-linear
        v-if="trackDownloading"
        height="1"
        color="accent"
        class="ma-0 pa-0"
        indeterminate
      ></v-progress-linear>
      <div>
        <v-progress-linear
          id="trackProgressBar"
          height="3"
          class="ma-0 pa-0 pointer"
          color="info"
          :value="trackProgress"
          @click="updateSeek($event)"
        ></v-progress-linear>
        <v-layout style="padding-top:2px;">
          <v-flex d-flex xs6>
            <v-layout row wrap>
              <v-flex xs12>
                <span title="Artist" class="mr-2">
                  <router-link :to="'/artist/' + currentTrack.releaseArtist.artist.value">       
                    <img
                      class="artist-image"
                      :src="currentTrack.artist.thumbnail.url"
                      :alt="currentTrack.artist.artist.text"
                    >                             
                    <span
                      class="artist-name badge text-no-wrap text-truncate pointer"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.releaseArtist.artist.text }}</span>
                  </router-link>
                </span>
                <span title="Release" class="mr-2">                 
                  <router-link :to="'/release/' + currentTrack.release.value">
                    <img
                      class="release-image"
                      :src="currentTrack.releaseImageUrl"
                      :alt="currentTrack.release.text"
                    >                   
                    <span
                      class="release-title badge text-no-wrap text-truncate pointer caption"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.release.text }}</span>
                  </router-link>
                </span>
                <span title="Track">🎼
                  <router-link :to="'/track/' + currentTrack.id">
                    <span
                      class="release-title badge text-no-wrap text-truncate pointer caption"
                      :style="{ backgroundColor: this.$vuetify.theme.primary }"
                    >{{ currentTrack.title }}</span>
                  </router-link>
                </span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs3>
            <v-layout d-flex row wrap>
              <span title="Current Playing Time of Track">
                <v-icon small>play_arrow</v-icon>
                <span class="caption track-current-time mr-1">{{ seek | minutes }}</span>
              </span>
              <span title="Total Time of Track">
                <v-icon small>audiotrack</v-icon>
                <span class="caption track-time mr-1">{{ currentTrack.durationTime }}</span>
              </span>
              <span class="pointer" :title="queDisplayTimeTooltip" @click="toggleQuePlayTime">
                <v-icon small>headset</v-icon>
                <span class="caption track-time">{{ queDisplayTime | timeFromMilliseconds }}</span>
              </span>
            </v-layout>
          </v-flex>
          <v-flex xs3>
            <v-layout d-flex row-wrap>
              <v-btn
                color="primary lighten-1"
                title="Play Previous Track"
                icon
                @click="skip('prev')"
                small                
              >
                <v-icon small>skip_previous</v-icon>
              </v-btn>
              <v-btn small title="Replay last 30 seconds" icon @click="seekByAmount(-30)">
                <v-icon small>replay_30</v-icon>
              </v-btn>
              <v-btn small title="Rewind 1 second" icon @click="seekByAmount(-1)">
                <v-icon small>fast_rewind</v-icon>
              </v-btn>
              <v-btn
                color="green darken-2"
                :title="playing ? 'Pause Playing' : 'Start Playing'"
                icon
                @click="play"
                small              
              >
                <v-icon small>{{ playing ? 'pause' : 'play_arrow'}}</v-icon>
              </v-btn>
              <v-btn small color="red darken-2" title="Stop Playing" icon @click="stop">
                <v-icon small>stop</v-icon>
              </v-btn>
              <v-btn small title="Forward 1 second" icon @click="seekByAmount(1)">
                <v-icon small>fast_forward</v-icon>
              </v-btn>
              <v-btn small title="Forward 30 seconds" icon @click="seekByAmount(30)">
                <v-icon small>forward_30</v-icon>
              </v-btn>
              <v-btn
                small
                color="primary lighten-1"
                title="Play Next Track"
                icon
                @click="skip('next')"
              >
                <v-icon small>skip_next</v-icon>
              </v-btn>
              <v-btn small title="Enable Que Repeat" flat icon @click="toggleLoop">
                <v-icon small :color="loop ? 'light-blue' : 'white'">repeat</v-icon>
              </v-btn>
              <v-btn small title="Toggle Fullscreen Mode" flat icon @click="toggleFullScreen">
                <v-icon small>fullscreen</v-icon>
              </v-btn>
              <v-btn small title="Show Large Player" flat icon @click="smallPlayer = !smallPlayer">
                <v-icon small>expand</v-icon>
              </v-btn>
              <v-btn small title="Display Playing/Que" flat icon to="/playque">
                <v-icon small>headset</v-icon>
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
import getEnv from '@/utils/env.js';

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
    window.removeEventListener('keyup', this.keyPressHandler, false);
    if (this.howl) {
      this.howl.unload();
    }
  },
  async mounted() {
    this.originalWindowTitle = document.title;
    this.loadFirstTrackInQue();
    window.addEventListener('keyup', this.keyPressHandler, false);
  },
  methods: {
    keyPressHandler(event) {
      if(!this.loaded) {
        return false;
      }
      // likely an input event from the search box
      if(event.target.name) { 
        return;
      }
      if (event.keyCode === 37) {        
        this.skip('prev');
      }
      if(event.keyCode === 39) {
        this.skip('next');
      }
      if(event.keyCode === 32) {
        if(this.playing) {
          this.stop();
        } else {
          this.play();
        }
      }    
      if(event.keyCode === 46) {
        if(event.shiftKey) {
          this.$playQue.deleteAll();
        } else {
          this.$playQue.removePlayed();
        }        
      }
    },
    loadFirstTrackInQue() {
      const that = this;
      if (that.hide) {
        return false;
      }
      this.$playQue
        .firstTrack()
        .then(response => {
          if (response.isSuccess) {
            that.queIndex = response.track.index;
            that.firstTrackIndex = response.firstTrackIndex;
            that.lastTrackIndex = response.lastTrackIndex;
            that.trackDownloading = true;
            Howler.volume(that.volume);
            that.currentTrack = response.track;
            that.loaded = true;
            return this.$playQue.totalTime();
          } else {
            // No tracks in Que
            that.loaded = false;
            return false;
          }
        })
        .then(function(ttResponse) {
          if (ttResponse) {
            that.quePlayTotalTime = ttResponse.totalTime;
            that.calculateQueTimeToIndex();
          }
        });
    },
    queModified: function(info) {
      this.doAutoPlay = true;      
      if (this.hide || (info && info.totalCount === 0)) {
        this.stop();
        this.loaded = false;
        this.doAutoPlay = false;
        return;
      }
      this.$nextTick(() => {
        this.$playQue.totalTime().then(response => {
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
          this.quePlayTotalTime = response.totalTime;
        });
      });
    },
    calculateQueTimeToIndex() {
      this.$playQue.trackTimeToIndex(this.queIndex).then(response => {
        this.quePlayTimeToBeforeIndex = response.time;
      });
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
        this.$playQue.trackByIndex(this.queIndex).then(response => {
          if (response.isSuccess) {
            that.queIndex = response.track.index;
            that.trackDownloading = true;
            that.currentTrack = response.track;
            that.loaded = true;
            that.calculateQueTimeToIndex();
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
    removeTrack: function(track) {      
      if(this.$store.getters.user.removeTrackFromQueAfterPlayed) {
        this.$playQue.delete([track.id]);
      } else {
        this.$playQue.setTrackAsPlayed(track.id);        
      }
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
      this.trackBookmarkToggle({
        trackId: this.currentTrack.id,
        userBookmarked: !this.currentTrack.userBookmarked
      }).then(() => {
        this.currentTrack.userBookmarked = !this.currentTrack.userBookmarked;
      });
    },
    toggleFavorite: function() {
      this.trackFavoriteToggle({
        trackId: this.currentTrack.id,
        isFavorite: !this.currentTrack.userRating.isFavorite
      }).then(() => {
        this.currentTrack.userRating.isFavorite = !this.currentTrack.userRating
          .isFavorite;
      });
    },
    hateToogle: function() {
      this.trackDislikeToggle({
        trackId: this.currentTrack.id,
        isDisliked: !this.currentTrack.userRating.isDisliked
      }).then(() => {
        this.currentTrack.userRating.isDisliked = !this.currentTrack.userRating
          .isDisliked;
      });
    },
    setRating: async function() {
      this.$nextTick(() => {
        this.trackRatingChange({
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
    toggleQuePlayTime() {
      this.quePlayTimeDisplay++;
      if (this.quePlayTimeDisplay > 2) {
        this.quePlayTimeDisplay = 0;
      }
    },
    sendScrobble() {
      this.$axios.post(getEnv('ROADIE_API_URL') + `/play/track/scrobble/${this.currentTrack.id}/${this.startedPlayingCurrentTrack}/${this.isRandomized}`)
    },    
    updatePlaying() {
      document.title = this.currentTrack.title;
      this.trackDownloading = false;
      this.playingTrackId = this.currentTrack.id;
      this.playing = true;
      var image = document.getElementById("trackCover");
      if(!this.smallPlayer) {
        window.favIcon.image(image);
      }
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
        html5: true,
        loop: this.loop,
        src: this.currentTrack.trackPlayUrl,
        autoplay: this.doAutoPlay,
        format: ['mp3'],
        onplay: () => {
          this.startedPlayingCurrentTrack = this.$moment().format();
          this.updatePlaying();
        },
        onplayerror : () => {
          EventBus.$emit("showSnackbar", {
              text: "Error Playing Track.",
              color: "red"
          });
          this.skip("next");
        },
        onloaderror: () => {
          EventBus.$emit("showSnackbar", {
              text: "Error Loading Track",
              color: "red"
          });          
          this.skip("next");
        },
        onend: () => {
          this.skip("next");
          this.sendScrobble();
          this.removeTrack(trackInfo);
        }
      });
    },
    playing(playing) {
      this.seek = this.howl ? this.howl.seek() : 0;
      if (this.seek > 0) {
        this.quePlayTimeToBeforeIndex += 1000;
      }
      if (playing) {
        this.updateSeekInterval = setInterval(() => {
          try {
            this.seek = this.howl ? parseInt(this.howl.seek()) : 0;
            if (this.seek > 0) {
              this.quePlayTimeToBeforeIndex += 500;
            }
          } catch (e) {
            clearInterval(this.updateSeekInterval);
          }
        }, 500);
      } else {
        clearInterval(this.updateSeekInterval);
        this.calculateQueTimeToIndex();
      }
      this.$store.dispatch("nowPlaying", playing);
    },
    playRequestTrackInfo(trackInfo) {
      if (this.queIndex != trackInfo.index) {
        this.queIndex = trackInfo.index;
        this.$nextTick(() => {
          this.stop();
          this.play();
          return;
        });
      }
      if (!this.playing) {
        this.play();
      }
    },
    hide(hidden) {
      if (hidden) {
        this.stop();
        this.loaded = false;
      }
    }
  },
  computed: {
    hide() {
      return !this.$store.state.isLoggedIn;
    },
    progress() {
      if (!this.howl || this.howl.duration() === 0) return 0;
      return this.seek / this.howl.duration();
    },
    trackProgress() {
      return this.progress * 100;
    },
    playRequestTrackInfo() {
      return this.$store.getters.playRequestTrackInfo;
    },
    queDisplayTime() {
      switch (this.quePlayTimeDisplay) {
        case 1:
          return this.quePlayTimeToBeforeIndex; // Total Time of Que Played
        case 2:
          return this.quePlayTotalTime - this.quePlayTimeToBeforeIndex; // Total Remaining Que Time
        default:
          return this.quePlayTotalTime; // Total Que Time
      }
    },
    queDisplayTimeTooltip() {
      switch (this.quePlayTimeDisplay) {
        case 1:
          return "Total Time of Que Played (Click to cycle)";
        case 2:
          return "Total Remaining Que Time (Click to cycle)";
        default:
          return "Total Time of Que (Click to cycle)";
      }
    }
  },
  data: () => ({
    doAutoPlay: false,
    isRandomized: false,
    startedPlayingCurrentTrack: null,
    smallPlayer: false,
    updateSeekInterval: null,
    quePlayTimeDisplay: 0,
    quePlayTimeToBeforeIndex: 0,
    quePlayTotalTime: 0,
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
.track-playing-card .badge {
  padding: 1px 4px;
  border-radius: 5px;
  color: white !important;
}
.track-playing-card img.artist-image {
  height: 20px;
  vertical-align: middle;
}
.track-playing-card.small-player button, .track-playing-card.small-player a.v-btn {
    height: 22px;
    margin-top: 1px;  
}
.track-playing-card.small-player img {
  max-height: 20px;
  vertical-align: middle;
}
</style>