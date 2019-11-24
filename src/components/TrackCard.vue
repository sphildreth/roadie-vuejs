<template>
  <v-card
    v-if="loaded"
    :class="'track-status-' + track.statusVerbose.toLowerCase()"
    class="track-card ml-2 pt-1"
    hover
    :data-playurl="track.trackPlayUrl"
    :data-id="track.id"
  >
    <v-layout row wrap>
      <v-flex
        xs12
        :lg8="track.trackArtist || release"
        :lg12="!track.trackArtist && !release"
        :xl8="track.trackArtist || release"
        :xl11="!track.trackArtist && !release"
      >
        <input
          v-if="doShowSelector"
          type="checkbox"
          name="selected"
          @click="selectedTrack"
          class="track-selector"
        >
        <div class="track-number accent--text display-1">{{ track.trackNumber | padNumber3 }}</div>
        <v-layout>
          <v-icon
            small
            class="favorite pointer"
            @click.native="favoriteToggle"
            :color="userRating.isFavorite === true ? 'red' : 'accent'"
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
            :color="userRating.isDisliked === true ? 'green' : 'accent'"
            @change.native="dislikeToggle"
          >far fa-thumbs-down</v-icon>
        </v-layout>      
        <v-layout class="on-show-hover">            
            <!-- Router link does not wrap -->
            <div
              :title="track.title"
              @click="showTrack" 
              class="secondary--text title text--lighten-1 track-title text-no-wrap text-truncate pointer"
              :class="{ 'playing-track': this.$store.getters.playingIndex.trackId == track.id }"
            >{{ track.title}}</div>
          <span class="on-hover">
            <span class="pointer" @click="playTrack(track)">
              <i class="fas fa-play mx-2" title="Play"></i>
            </span>
            <span class="pointer" @click="queTrack(track)">
              <i class="fas fa-headphones" title="Add To Que"></i>
            </span>
          </span>
        </v-layout>
        <v-layout>
          <div
            v-if="track.partTitlesList && track.partTitlesList.length > 0"
            class="my-1 body-1 font-italic text-no-wrap text-truncate"
          >
            <span
              class="pr-2"
              v-for="partTitle in track.partTitlesList"
              :key="partTitle"
            >{{ partTitle }}</span>
          </div>
        </v-layout>        
        <v-layout>
          <div class="caption accent--text">
            <span v-if="mediaCount > 1">
              <span
                class="media-number info--text"
                title="Media Number"
              >{{ this.$filters.padNumber2(mediaNumber) }}</span> |
            </span>
            <span title="Played Count">{{ track.playedCount | padNumber4 }}</span> |
            <span title="Track Play Time">{{ track.durationTime }}</span>
          </div>
        </v-layout>
      </v-flex>
      <v-flex lg4 xl4 d-flex v-if="track.trackArtist">
        <ArtistCard
          class="mt-2 mr-2 hidden-md-and-down"
          v-if="track.trackArtist"
          :artist="track.trackArtist"
          :isInline="true"
        ></ArtistCard>
      </v-flex>
      <v-flex lg4 xl4 d-flex v-if="release && !track.trackArtist" class="">
        <ReleaseCard 
          class="mt-2 mr-2 hidden-md-and-down" 
          v-if="release" 
          :release="release"
          :isInline="true"
        ></ReleaseCard>
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
  methods: {
    showTrack: function() {
        this.$router.push({ name: "track", params: { id: this.track.id } });
    },
    selectedTrack: function(e) {
      var isTrackSelected = e.target.checked;
      EventBus.$emit(
        isTrackSelected ? "t:selected" : "t:unselected",
        this.track
      );
    },
    favoriteToggle: function() {
      this.track.userRating.isFavorite = !this.track.userRating.isFavorite;        
      EventBus.$emit("t:favoriteToggle", {
        trackId: this.track.id,
        isFavorite: this.track.userRating.isFavorite
      });
    },
    dislikeToggle: function() {
      this.track.userRating.isDisliked = !this.track.userRating.isDisliked;        
      EventBus.$emit("t:dislikeToggle", {
        trackId: this.track.id,
        isDisliked: this.track.userRating.isDisliked
      });
    },
    ratingChanged: function() {
      EventBus.$emit("t:ratingChange", {
        trackId: this.track.id,
        newVal: this.rating
      });
    },
    playTrack: async function(track) {
      this.$playQue.deleteAll().then(() => {
        this.queTrack(track);
      });
    },
    queTrack: async function(track) {
      this.getTrackDetail(track.id).then(response => {
        this.addTrackToQue(response.data.data);
      });
    }
  },
  async mounted() {
    this.track = this.track || {};
    if(!this.track.userRating || this.track.userRating === undefined)
    {
      this.track.userRating = {
        rating: 0,
        isFavorite: false,
        isDisliked: false
      };
    }
    if (this.track.userRating.isDisliked === undefined) {
      this.track.userRating.isDisliked = false;
    }
    if (this.track.userRating.isFavorite === undefined) {
      this.track.userRating.isFavorite = false;
    }   
    this.userRating = this.track.userRating;
    this.loaded = true;
  },
  data: () => ({
    userRating: {
      rating: 0,
      isFavorite: false,
      isDisliked: false
    },
    loaded: false
  })
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
  margin-top: 2px;
}
.track-card .track-number {
  float: left;
  margin: 0px 15px 0px 5px;
  height: 90px;
  padding-top: 15px;
}
.track-card .track-selector {
  float: left;
  margin-top: 27px;
}
.track-card .artist-title.short,
.track-card .release-title.short {
  float: left;
}
.track-card .on-hover {
  display: none;
}
.track-card .on-show-hover:hover .on-hover {
  display: inline-block;
}
</style>