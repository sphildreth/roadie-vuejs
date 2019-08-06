<template>
  <v-card
    class="mb-3"
    :color="!release.isValid ? 'warning' : ''"
    hover
    :data-id="release.id"
    :disabled="!release.isValid"
  >
    <v-layout>
      <v-flex xs4 md3 :class="'release-status-' + release.statusVerbose.toLowerCase()">
        <router-link style="display:block;clear:both;" :to="'/release/' + release.id">
          <v-img
            :src="release.thumbnail.url"
            :alt="release.release.text"
            class="ma-1 release-image"
            max-height="80px"
            contain
            lazy-src="data:image/jpeg;base64,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"
          ></v-img>
        </router-link>
      </v-flex>
      <v-flex xs8 md9>
        <v-card-text primary-title class="pa-0 ma-0">
          <div v-if="release.isValid">
            <v-layout>
              <div class="release-rating-container">
                <v-icon
                  small
                  class="favorite pointer"
                  @click="isFavorite = !isFavorite"
                  :color="isFavorite ? 'red' : ''"
                >favorite</v-icon>
                <v-rating
                  v-model="release.rating"
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
                  :color="isDisliked ? 'green' : ''"
                >fas fa-thumbs-down</v-icon>
                <span
                  v-if="release.rank"
                  class="hidden-md-and-down ml-1 release-rank accent--text"
                  title="Rank"
                >{{ release.rank }}</span>
              </div>
            </v-layout>
            <router-link :to="'/release/' + release.id">
              <div
                :title="release.release.text"
                class="secondary--text release-title text-no-wrap text-truncate subheading font-weight-medium pointer"
                :class="this.$store.getters.playingIndex.releaseId == release.id ? 'playing-release' : ''"
              >{{ release.release.text }}</div>
            </router-link>
            <router-link :to="'/artist/' + release.artist.value">
              <div
                :title="release.artist.text"
                class="secondary--text text--lighten-1 release-artist text-no-wrap text-truncate body-1 pointer"
              >{{ release.artist.text }}</div>
            </router-link>
            <div class="caption accent--text">
              <span
                v-if="listNumber"
                class="body-2 info--text"
                title="Collection Position"
              >{{ this.$filters.padNumber4(listNumber) + ' | ' }}</span>
              <span class="info--text" title="Release Date">{{ release.releaseYear }}</span> |
              <span title="Track Count">{{ release.trackCount | padNumber3 }}</span> |
              <span title="Release Play Time">{{ release.durationTime }}</span>
            </div>
          </div>
          <div v-if="!release.isValid" class="black--text">
            <div class="mb-2">
              <v-icon
                small
                class="pointer mr-1"
                style="float:left;"
                @click="copyReleaseText"
              >fas fa-copy</v-icon>            
              <div
                :title="release.release.text"
                class="release-title text-no-wrap text-truncate subheading font-weight-medium pointer"
              >{{ release.release.text }}</div>
            </div>
            <v-icon
              small
              class="pointer mr-1"
              style="float:left;"
              @click="copyArtistText"
            >fas fa-copy</v-icon>                
            <div
              :title="release.artist.text"
              class="release-artist text-no-wrap text-truncate body-1 pointer"
            >{{ release.artist.text }}</div>
            <div class="missing-release-spacer"></div>
            <div class="body-2 info--text">
              <span v-if="listNumber" title="Collection Position">{{ listNumber | padNumber4 }}</span>
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
  name: "ReleaseCard",
  props: {
    release: Object,
    listNumber: Number
  },
  data: () => ({
    userRating: {
      isFavorite: false,
      isDisliked: false
    }
  }),
  methods: {
    copyToClipBoard: function(text) {
      navigator.clipboard.writeText(text)
      .then(() => {
        EventBus.$emit("showSnackbar", {
            text: "Copied To Clipboard!"
        });        
      })
      .catch(err => {
        // eslint-disable-next-line
        console.log('Something went wrong', err);
      })
    },
    copyArtistText: function() {
      this.copyToClipBoard(this.release.artist.text);
    },    
    copyReleaseText: function() {
      this.copyToClipBoard(this.release.release.text);
    }
  },
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
  mounted() {
    if (this.release && this.release.userRating) {
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
  height: 18px;
}

</style>