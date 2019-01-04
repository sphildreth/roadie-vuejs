<template>
  <div v-if="loaded">
    <v-card class="track-playing-card ma-1 ml-2 pa-1" height="100px" hover>
      <v-progress-linear
        :value="trackProgress"
        color="info"
        class="mb-1 ma-0 primary"
        height="5"
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
                <router-link v-if="currentTrack.artist.artist.value != currentTrack.releaseArtist.id" :to="'/artist/' + currentTrack.releaseArtist.artist.value">
                  <img
                    class="ma-1"
                    style="float:left;height:14px;"
                    :src="currentTrack.releaseArtist.thumbnail.url"
                    :alt="currentTrack.releaseArtist.artist.text"
                  >
                  <span
                    class="artist-name text-no-wrap text-truncate pointer"
                  >{{ currentTrack.releaseArtist.artist.text }} </span>
                </router-link>
                <span v-if="currentTrack.artist.artist.value != currentTrack.releaseArtist.id" class="mx-1">::</span>
                <router-link :to="'/artist/' + currentTrack.artist.artist.value">
                  <img
                    class="ma-1"
                    style="height:14px;"
                    :src="currentTrack.artist.thumbnail.url"
                    :alt="currentTrack.artist.artist.text"
                  >
                  <span
                    class="artist-name text-no-wrap text-truncate pointer"
                  >{{ currentTrack.artist.artist.text }}</span>
                </router-link>                
              </div>
              <div title="View Release Details">
                <router-link :to="'/release/' + currentTrack.release.value">
                  <span
                    class="release-date bsubheading mr-2"
                  >{{ currentTrack.release.releaseDate | formattedYear }}</span>
                  <span
                    class="release-title text-no-wrap text-truncate pointer subheading"
                  >{{ track.release.text }}</span>
                </router-link>
              </div>
              <div title="View Track Details">
                <router-link :to="'/track/' + currentTrack.id">
                  <span class="release-date title mr-2">{{ currentTrack.trackNumber | padNumber3 }}</span>
                  <span
                    class="release-title text-no-wrap text-truncate pointer title"
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
            <v-btn icon @click="bookmarkToogle">
              <v-icon
                v-if="currentTrack.userBookmarked"
                medium
                color="info"
                title="Click to remove from bookmarks"
              >bookmark</v-icon>
              <v-icon v-if="!currentTrack.userBookmarked" medium title="Add to bookmarks">bookmark_border</v-icon>
            </v-btn>
            <v-btn icon @click="favoriteToggle">
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
              <span class="headline track-time">{{ totalTime }}</span>
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

          <v-layout  d-flex row-wrap>
            <v-btn icon>
              <v-icon title="Skip Previous" @click="skip('prev')">skip_previous</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon >replay_30</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>fast_rewind</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon large @click="play">{{ playing ? 'pause' : 'play_arrow'}}</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon @click="stop">stop</v-icon>
            </v-btn>            
            <v-btn icon>
              <v-icon>fast_forward</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon >forward_30</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon title="Skip Next" @click="skip('next')">skip_next</v-icon>
            </v-btn>
            <v-btn flat icon @click="toggleLoop">
              <v-icon :color="loop ? 'light-blue' : 'white'">repeat</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" :top="true">
      {{ snackbarText }}
      <v-btn color="black" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>     
  </div>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import {Howl, Howler} from 'howler';

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
  beforeDestroy() {
    this.howl.unload();
  },
  async mounted() {
    this.originalWindowTitle = document.title;
    Howler.volume(this.volume)    
    let that=this;    
    var trackInQue = this.$_.find(this.$store.getters.playQue, function(t) { return t.track.id === that.track.id;});
    this.$nextTick(() => {
      this.playingIndex = trackInQue.listNumber -1;
    });    
    this.howl = new Howl({
      volume: this.volume,
      loop: this.loop,
      src: this.currentTrack.trackPlayUrl,
      autoplay: true,
      onplay: () => {
        this.playing = true;
        this.$store.dispatch("playIndexChange", {
          index: this.playingIndex,
          trackId: this.currentTrack.id,
          releaseId: this.currentTrack.release.value,
          artistId: this.currentTrack.artist.id
        });          
      },
      onend: () => {
        this.skip('next');
      }  
    });
    this.loaded = true;    
  },
  methods: {
    play: function() {
      if(!this.playing) {
        this.howl.play();
        this.playing = true;
      } else {
        this.howl.pause();
        this.playing = false;
      }       
    },
    stop: function() {
      this.howl.stop();
      this.playing = false;
    },
    skip: function(direction) {
      if(direction === "next") {
        let isPlayingLastTrack = this.playingIndex === this.$store.getters.playQue.length;
        if(isPlayingLastTrack && this.loop) {
          this.playingIndex = 0;
        } 
        if(isPlayingLastTrack && !this.loop) {
          this.stop();          
          return;
        }
        this.playingIndex++;
      } else {
        let isPlayingFirstTrack = this.playingIndex === 0;
        if(isPlayingFirstTrack && this.loop) {
          this.playingIndex = this.$store.getters.playQue.length - 1;
        }
        if(isPlayingFirstTrack && !this.loop) {
          this.stop();
          return;
        }        
         this.playingIndex--;
      }      
      this.$nextTick(() => {
        this.play();
      });

    },
    bookmarkToogle: function() {},
    favoriteToggle: function() {},
    hateToogle: function() {},
    setRating: function() {},
    toggleLoop() {
      this.$emit("toggleloop", !this.loop);
    },
    updateVolume: function(volume) {
      Howler.volume(volume);
    },
    toggleMute () {
      Howler.mute(!this.muted)
      this.muted = !this.muted
    }    
  },
  watch: {
    playingIndex(newIndex) {
      this.stop();
      this.howl.unload();
      this.howl = new Howl({
        volume: this.volume,
        loop: this.loop,
        src: this.currentTrack.trackPlayUrl,
        autoplay: true,
        onplay: () => {
          this.playing = true;
          this.$store.dispatch("playIndexChange", {
            index: this.playingIndex,
            trackId: this.currentTrack.id,
            releaseId: this.currentTrack.release.value,
            artistId: this.currentTrack.artist.id
          });           
        },
        onend: () => {
          this.skip('next');
        }        
      });    
    },
    playing(playing) {
      this.seek = this.howl.seek();
      let updateSeek
      if (playing) {
        updateSeek = setInterval(() => {
          try {
            this.seek = this.howl.seek();
          } catch(e) {
            console.log(e);
            clearInterval(updateSeek)
          }
        }, 250)
      } else {
        clearInterval(updateSeek)
      }
      this.$store.dispatch("nowPlaying", playing);
    }   
  },  
  computed: {
    currentTrack() {
      return this.$store.getters.playQue[this.playingIndex].track;
    },
    progress () {
      if (!this.howl || this.howl.duration() === 0) return 0
      return this.seek / this.howl.duration()
    },    
    trackProgress () {
      return this.progress * 100
    }    
  },
  data: () => ({
    howl: { 
      playing: false 
    },
    playing: false,
    muted: false,
    volume: 0.5,
    snackbar: false,
    snackbarText: "",        
    snackbarColor: "success",
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
</style>