<template>
  <v-card
    :class="track.cssClass"
    class="track-card ml-2"
    height="105px"
    hover
    :data-playurl="track.trackPlayUrl"
    :data-id="track.id"
  >
    <v-layout>
      <v-flex d-flex xs12>
        <v-layout row wrap>
          <v-flex xs8>
            <input v-if="doShowSelector" type="checkbox" name="selected" @click="selectedTrack" class="track-selector" />
            <div class="track-number accent--text display-1">{{ track.trackNumber | padNumber3 }}</div>
            <v-icon
              small
              class="favorite pointer"
              @click.native="favoriteToggle"
              :color="userRating.isFavorite ? 'red' : 'accent'"
              @change.native="favoriteToggle"
            >favorite</v-icon>
            <v-rating
              v-model="track.rating"
              class="track-rating"
              background-color="orange lighten-3"
              color="orange"
              small
              dense
              readonly
            ></v-rating>
            <v-icon
              small
              class="hated pointer"
              @click.native="dislikeToggle"
              :color="userRating.isDisliked ? 'green' : 'accent'"
              @change.native="dislikeToggle"
            >far fa-thumbs-down</v-icon>
            <v-layout>
              <router-link  v-if="track.artist" :to="'/artist/' + track.artist.id">
                <div class="secondary--text text--lighten-1 artist-title short">{{ track.artist.artist.text}}</div>
              </router-link>
              <router-link v-if="track.release" :to="'/release/' + track.release.id">
                <div class="secondary--text text--lighten-1 release-title short">{{ '&nbsp;&#127932;&nbsp;' + track.release.release.text}}</div>
              </router-link>            
            </v-layout>            
            <v-layout class="on-show-hover">
              <router-link :to="'/track/' + track.id">
                <div 
                class="secondary--text text--lighten-1 track-title" 
                :class="{ 'playing-track': this.$store.getters.playingIndex.trackId == track.id }">{{ track.title}}</div>            
              </router-link>
              <span class="on-hover">
                <span class="pointer" @click="playTrack(track)"><i class="fas fa-play mx-2" title="Play"></i></span>
                <span class="pointer" @click="queTrack(track)"><i class="fas fa-headphones" title="Add To Que"></i></span>
              </span>                 
            </v-layout>
            <v-layout>
              <div class="caption accent--text">
                <span title="Played Count">{{ track.playedCount | padNumber4 }}</span> |
                <span title="Track Play Time">{{ track.durationTime }}</span>
              </div>
              <div
                v-if="mediaCount > 1"
                class="caption accent-text ml-1"
              >{{ 'Media ' + this.$filters.padNumber2(mediaNumber) + ' of ' + this.$filters.padNumber2(mediaCount) }}
              </div>
              <div
                v-if="track.partTitlesList && track.partTitlesList.length > 0"
                class="caption font-italic text-no-wrap text-truncate"
              >
                <span
                  class="pr-2 ml-1"
                  v-for="partTitle in track.partTitlesList"
                  :key="partTitle"
                >{{ partTitle }}</span>
              </div>
            </v-layout>
          </v-flex>
          <v-flex xs4 v-if="track.trackArtist">
            <ArtistCard v-if="track.trackArtist" :artist="track.trackArtist"></ArtistCard>
          </v-flex>
          <v-flex xs4 v-if="release && !track.trackArtist">
            <ReleaseCard v-if="release" :release="release"></ReleaseCard>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import { EventBus } from "@/event-bus.js";
import trackMixin from "@/mixins/track.js";

export default {
  name: "TrackCard",
  mixins: [trackMixin],
  components: { ArtistCard, ReleaseCard },
  props: {
    track: {
      type: Object,
      default: function() {
        return {
          userRating: {
            rating: 0,
            isFavorite: false,
            isDisliked: false
          }
        };
      }
    },
    release: Object,
    mediaNumber: Number,
    mediaCount: Number,
    doShowSelector: Boolean
  },
  async mounted() {
    if(this.userRating.isDisliked === undefined) {
      this.userRating.isDisliked = false;
    }
    if(this.userRating.isFavorite === undefined) {
      this.userRating.isFavorite = false;
    }
  },
  methods: {
    selectedTrack: function(e) {
      var isTrackSelected = e.target.checked;
      this.$nextTick(() => {
        EventBus.$emit(isTrackSelected ? "t:selected" : "t:unselected", this.track);
      });
    },
    favoriteToggle: function() {
      this.$nextTick(() => {
        EventBus.$emit("t:favoriteToggle", {
          trackId: this.track.id,
          isFavorite: !this.userRating.isFavorite
        });
        this.userRating.isFavorite = !this.userRating.isFavorite;
        this.track.userRating = this.userRating;
      });
    },
    dislikeToggle: function() {
      this.$nextTick(() => {
        EventBus.$emit("t:dislikeToggle", {
          trackId: this.track.id,
          isDisliked: !this.userRating.isDisliked
        });
        this.userRating.isDisliked = !this.userRating.isDisliked;
        this.track.userRating = this.userRating;        
      });
    },
    ratingChanged: function() {
      this.$nextTick(() => {
        EventBus.$emit("t:ratingChange", {
          trackId: this.track.id,
          newVal: this.rating
        });
      });
    },
    playTrack: async function(track) {
      this.$playQue.deleteAll()
      .then(() => {
        this.queTrack(track);
      });      
    },
    queTrack: async function(track) {
      this.getTrackDetail(track.id)
      .then(response => {
        this.addTrackToQue(response.data.data);
      })      
    }    
  },
  computed: {
    userRating: function() {
      let userRating = {
        rating: 0,
        isFavorite: false,
        isDisliked: false
      };
      if(this.track && this.track.userRating) {
        return this.track.userRating;
      }
      return userRating;
    }
  },
  data: () => ({})
};
</script>

<style>

.track-card .v-card--hover {
  cursor: default !important;
}
.track-card .v-rating.track-rating {
  width: 97px;
  float: left;
}
.track-card i.favorite {
  float: left;
  margin-top: 2px;
}
.track-card .track-number {
  float: left;
  margin: 0px 15px 0px 5px;
  height: 90px;
  padding-top: 15px;
}
.track-card.Missing {
  border: 1px solid yellow !important;
}
.track-card .track-selector {
  float: left;
  margin-top: 27px;
}
.track-card .artist-title.short, .track-card .release-title.short {
  float: left;
}
.track-card .on-hover {
  display: none;
}

.track-card .on-show-hover:hover .on-hover {
  display: inline-block;
}
</style>