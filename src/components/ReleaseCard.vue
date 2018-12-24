<template>
  <v-card
    class="mb-3"
    height="92"
    :color="!release.isValid ? 'warning' : ''"
    hover
    :data-id="release.id"
    :disabled="!release.isValid"
  >
    <v-layout>
      <v-flex xs4 :class="'release-status-' + release.status">
        <!-- <div v-if="listNumber" class="caption list-number info--text">{{ this.$filters.padNumber4(listNumber) }}</div>                                                                                                  -->
        <router-link :to="'/release/' + release.id">
          <v-img
            :src="release.thumbnail.url"
            :alt="release.release.text"
            max-width="80"
            class="ma-1"
          ></v-img>
        </router-link>
      </v-flex>
      <v-flex xs8>
        <v-card-title primary-title class="pa-0 ma-0">
          <div v-if="release.isValid">
            <div class="release-rating-container">
              <v-icon
                small
                class="favorite pointer"
                @click="isFavorite = !isFavorite"                
                :color="isFavorite ? 'red' : 'accent'"
              >favorite</v-icon>
              <v-rating
                v-model="release.rating"
                class
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
            <router-link :to="'/release/' + release.id">
              <div
                :title="release.release.text"
                class="secondary--text text--lighten-1 release-title text-no-wrap text-truncate subheading font-weight-medium pointer"
              >{{ release.release.text }}</div>
            </router-link>
            <router-link :to="'/artist/' + release.artist.value">
              <div
                :title="release.artist.text"
                class="secondary--text text--lighten-2 release-artist text-no-wrap text-truncate body-1 pointer"
              >{{ release.artist.text }}</div>
            </router-link>
            <div class="caption accent--text">
              <span
                v-if="listNumber"
                class="body-2 info--text"
                title="Collection Position"
              >{{ this.$filters.padNumber4(listNumber) + ' | ' }}</span>
              <span title="Release Date">{{ release.releaseYear }}</span> |
              <span title="Track Count">{{ release.trackCount | padNumber3 }}</span> |
              <span title="Release Play Time">{{ release.durationTime }}</span>
            </div>
          </div>
          <div v-if="!release.isValid" class="black--text">
            <div
              :title="release.release.text"
              class="release-title text-no-wrap text-truncate subheading font-weight-medium pointer"
            >{{ release.release.text }}</div>
            <div
              :title="release.artist.text"
              class="release-artist text-no-wrap text-truncate body-1 pointer"
            >{{ release.artist.text }}</div>
            <div class="missing-release-spacer"></div>
            <div class="body-2 info--text">
              <span v-if="listNumber" title="Collection Position">{{ listNumber | padNumber4 }}</span>
            </div>
          </div>
        </v-card-title>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import { EventBus } from "@/event-bus.js";

export default {
  name: "ReleaseCard",
  props: {
    release: Object,
    listNumber: Number
  },
  data: () => ({
    loaded: false,
    userRating: {
      isFavorite: false,
      isDisliked: false
    }
  }),
  computed: {
    isFavorite: {
      get: function() {
        return this.userRating.isFavorite;
      },
      set: function(val) {
        this.userRating.isFavorite = val;
        EventBus.$emit("r:favoriteToggle", {
          releaseId: this.$el.dataset.id,
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
        EventBus.$emit("r:dislikeToggle", {
          releaseId: this.$el.dataset.id,
          isDisliked: val
        });              
      }
    }    
  },
  mounted () {    
    if(this.release && this.release.userRating) {
      this.userRating.isFavorite = this.release.userRating.isFavorite;
      this.userRating.isDisliked = this.release.userRating.isDisliked;
    }
  }
};
</script>

<style>
.v-card--hover {
  cursor: default !important;
}
.release-rating-container .v-rating {
  width: 96px;
  float: left;
}
i.favorite {
  float: left;
  margin-top: 2px;
}
.list-number {
  float: left;
}
.missing-release-spacer {
  height: 21px;
}
</style>