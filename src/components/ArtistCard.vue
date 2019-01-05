<template>
  <v-card class="mb-3" hover :data-id="artist.id">
    <v-layout>
      <v-flex xs4 :class="'artist-status-' + artist.status">
        <router-link :to="'/artist/' + artist.id">
          <v-img :src="artist.thumbnail.url" :alt="artist.artist.text" max-width="80" class="ma-1"></v-img>
        </router-link>
      </v-flex>
      <v-flex xs8>
        <v-card-text primary-title class="pa-0 ma-0">
          <div>
            <div class="artist-rating-container">
              <v-icon
                small
                class="favorite pointer"
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
                class="disliked pointer"
                @click="isDisliked = !isDisliked"
                :color="isDisliked ? 'green' : 'accent'"
              >fas fa-thumbs-down</v-icon>
            </div>
            <router-link :to="'/artist/' + artist.id">
              <div
                :title="artist.artist.text"
                class="secondary--text text--lighten-1 artist-name text-no-wrap text-truncate subheading font-weight-medium pointer"
                :class="this.$store.getters.playingIndex.artistId == artist.id ? 'playing-artist' : ''"
              >{{ artist.artist.text }}</div>
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
    artist: Object
  },
  computed: {
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