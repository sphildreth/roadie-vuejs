<template>
  <v-card class="pa-1 genre-card" hover :data-id="genre.id">
    <v-layout>
      <v-flex xs4 md3>
        <router-link :to="'/genre/' + genre.genre.value">
          <v-img
            :src="genre.thumbnail.url"
            :alt="genre.genre.text"
            class="ma-1"
            max-height="80px"
            contain
            lazy-src="data:image/jpg;base64,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"
          ></v-img>
        </router-link>
      </v-flex>
      <v-flex xs8 md9>
        <v-card-text primary-title class="pa-0 ma-0">
          <div>
            <router-link :to="'/genre/' + genre.genre.value">
              <div
                :title="genre.genre.text"
                class="secondary--text text--lighten-1 genre-name text-no-wrap text-truncate subheading font-weight-medium pointer"
              >{{ genre.genre.text }}</div>
            </router-link>
          </div>
          <div class="caption accent--text">
            <span title="Artists Count">{{ genre.artistCount | padNumber4 }}</span> |
            <span title="Releases Count">{{ genre.releaseCount | padNumber4 }}</span>
          </div>
        </v-card-text>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  name: "GenreCard",
  props: {
    genre: Object
  },
  methods: {},
  computed: {},
  data: () => ({
    //isFavorite: false
  })
};
</script>

<style>
.genre-card .v-progress-linear {
  border-radius: 5px;
}
</style>