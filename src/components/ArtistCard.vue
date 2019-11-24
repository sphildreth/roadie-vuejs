<template>
  <v-card 
    class="mb-3 artist-card" 
    :color="!artist.isValid ? 'warning' : ''"
    hover 
    :data-id="artist.id"
    :disabled="!artist.isValid"
    >
    <v-layout>
      <v-flex xs2 sm3 md2 style="min-width:85px;" :class="'artist-status-' + artist.status">
        <router-link style="display:block;clear:both;" :to="'/artist/' + artist.id">
          <v-img 
            :src="artist.thumbnail.url" 
            :alt="artist.artist.text" 
            class="ma-1 artist-image"
            height="80px"
            width="80px"
            contain
            lazy-src="data:image/jpeg;base64,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"            
            ></v-img>
        </router-link>
      </v-flex>
      <v-flex xs10 sm9 md10>
        <v-card-text primary-title class="pa-0 mt-1 ml-1 ma-0">
          <div>
            <v-layout>
              <div class="artist-rating-container">
                <v-icon
                  small
                  class="favorite pointer hidden-lg-and-down"
                  @click="isFavorite = !isFavorite"
                  :color="isFavorite ? 'red' : 'accent'"
                >favorite</v-icon>
                <v-rating
                  v-model="artist.rating"
                  background-color="orange lighten-3"
                  color="orange"
                  small
                  dense
                  hover
                  readonly
                ></v-rating>
                <v-icon
                  small
                  class="disliked pointer hidden-lg-and-down"
                  @click="isDisliked = !isDisliked"
                  :color="isDisliked ? 'green' : 'accent'"
                >fas fa-thumbs-down</v-icon>
                <span
                  v-if="artist.rank"
                  class="ml-1 hidden-lg-and-down artist-rank accent--text"
                  title="Rank"
                >{{ artist.rank }}</span>
              </div>
            </v-layout>
            <router-link style="display:block;clear:both;" :to="'/artist/' + artist.id">
              <div
                :title="artist.artist.text"                
                class="secondary--text artist-name text-no-wrap text-truncate subheading font-weight-medium pointer"
                :class="(this.$store.getters.playingIndex.artistId == artist.id ? 'playing-artist' : '') + (isInline ? '' : 'mr-3')"
              >{{ isInline ? artist.artist.text.substring(0,maxArtistTitleWidth) + (artist.artist.text.length > maxArtistTitleWidth ? "..." : "") : artist.artist.text }}</div>              
            </router-link>
            <div class="caption accent--text">
              <span title="Releases Count">{{ artist.releaseCount | padNumber3 }}</span> |
              <span title="Track Count">{{ artist.trackCount | padNumber4 }}</span> |
              <span title="Played Count">{{ artist.playedCount | padNumber5 }}</span>
            </div>
          </div>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { EventBus } from "@/event-bus.js";

export default {
  name: "ArtistCard",
  props: {
    artist: Object,
    isInline: Boolean,    
  },
  computed: {
    maxArtistTitleWidth() {   
      return this.$vuetify.breakpoint.name == "lg" ? 18 : 32;
    },
    isFavorite: {
      get: function() {
        return this.userRating.isFavorite;
      },
      set: function(val) {
        this.userRating.isFavorite = val;
        EventBus.$emit("a:favoriteToggle", {
          artistId: this.$el.dataset.id,
          isFavorite: val
        });
      }
    },
    isDisliked: {
      get: function() {
        return this.userRating.isDisliked;
      },
      set: function(val) {
        this.userRating.isDisliked = val;
        EventBus.$emit("a:dislikeToggle", {
          artistId: this.$el.dataset.id,
          isDisliked: val
        });
      }
    }
  },
  data: () => ({
    userRating: {
      isFavorite: false,
      isDisliked: false
    }
  }),
  mounted() {
    if (this.artist && this.artist.userRating) {
      this.userRating.isFavorite = this.artist.userRating.isFavorite;
      this.userRating.isDisliked = this.artist.userRating.isDisliked;
    }
  }
};
</script>

<style>
.v-card--hover {
  cursor: default !important;
}
.artist-rating-container .v-rating {
  width: 96px;
  float: left;
}
i.favorite {
  float: left;
  margin-top: 2px;
}
</style>