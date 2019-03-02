<template>
  <v-card class="mt-2 ma-1 release-with-tracks mb-2" hover :data-id="release.id">
    <v-layout>
      <v-flex xs3>
        <router-link style="display:block;clear:both;" :to="'/release/' + release.id">
        <v-img :src="release.thumbnail.url" :alt="release.release.text" max-width="80" class="ma-1"></v-img>
        </router-link>
      </v-flex>
      <v-flex xs9>
        <v-card-title primary-title class="pa-0 ma-0">
          <div>
            <v-rating
              v-model="release.rating"
              class="pull-left"
              background-color="orange lighten-3"
              color="orange"
              readonly
              small
              dense
            ></v-rating>
            <span
              v-if="release.rank"
              class="ml-1 release-rank accent--text"
              title="Rank"
            >{{ release.rank }}</span>
            <span v-if="!release.rank">&nbsp;</span>
            <div class="on-show-hover">
              <router-link class="inline-block" :to="'/release/' + release.id">
                <div
                  :title="release.release.text"
                  :class="this.$store.getters.playingIndex.releaseId == release.id ? 'playing-release' : ''"
                  class="release-title subheading font-weight-medium pointer"
                >{{ release.release.text }}</div>                     
              </router-link>
              <span class="on-hover pointer">
                <span @click="playRelease()"><i class="fas fa-play mx-2" title="Play"></i></span>
                <span @click="queRelease()"><i class="fas fa-headphones" title="Add To Que"></i></span>
              </span>                 
            </div>
            <div class="caption accent--text">
              <span class="info--text" title="Release Date">{{ release.releaseYear }}</span> |
              <span title="Track Count">{{ release.trackCount | padNumber3 }}</span> |
              <span title="Release Play Time">{{ release.durationTime }}</span>
            </div>
            <v-icon
              v-if="release.libraryStatus != 1"
              :class="release.libraryStatus"
              color="warning"
            >warning</v-icon>
          </div>
        </v-card-title>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <v-card class="release-card" height="300px">
          <v-card-text>
            <div v-for="media in release.media" :key="media.id">
              <div
                v-if="release.media.length > 1"
                class="media-number accent--text"
              >{{ media.mediaNumber | padNumber2 }}</div>
              <table>
                <tbody>
                  <tr
                    v-for="track in media.tracks"
                    :disabled="track.cssClass != 'Ok'"
                    :key="track.id"
                    :class="track.cssClass == 'Missing' ? 'warning black--text' : ''"
                  >
                    <td
                      :class="'trackRating' + track.rating"
                      class="track-number"
                    >{{ track.trackNumber | padNumber3 }}</td>
                    <td :class="isPlayingTrack(track.id)" class="track-title secondary--text body-1 pointer on-show-hover">
                      <router-link :to="'/track/' + track.id">{{ track.title}}</router-link>
                      <span class="on-hover">
                        <span @click="playTrack(track)"><i class="fas fa-play mx-2" title="Play"></i></span>
                        <span @click="queTrack(track)"><i class="fas fa-headphones" title="Add To Que"></i></span>
                      </span>
                    </td>
                    <td class="track-time right">{{ track.durationTime}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import releaseMixin from "@/mixins/release.js";
import trackMixin from "@/mixins/track.js";

export default {
  name: "ReleaseWithTracksCard",
  mixins: [releaseMixin,trackMixin],
  props: {
    release: Object
  },
  methods: {
    isPlayingTrack: function(trackId) {
      return this.$store.getters.playingIndex.trackId == trackId ? 'playing-track' : ''
    },
    playRelease: async function() {
      this.$playQue.deleteAll()
      .then(() => {
        this.addReleaseToQue(this.release.id);
      });
    },
    queRelease: async function() {
      this.addReleaseToQue(this.release.id);
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
  computed: {},
  data() {
    return {
      selected: []
    };
  }
};
</script>

<style>
.release-with-tracks .v-card--hover {
  cursor: default !important;
}
.release-with-tracks .v-rating.release-rating {
  width: 115px;
}
.release-with-tracks i.favorite {
  float: left;
  margin-top: 2px;
}
.release-with-tracks .numberCircle {
  width: 12px;
  line-height: 12px;
  border-radius: 50%;
  text-align: center;
  font-size: 32px;
  border: 2px solid #666;
}
.release-with-tracks ul {
  max-height: 280px;
  overflow: auto;
  list-style: none;
  padding: 0;
}
.release-with-tracks ul li {
  margin-right: 6px;
}
.release-with-tracks .track-number {
  width: 30px;
}
/* .release-with-tracks .track-title {
        -ms-text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
    }
    .release-with-tracks .track-time {
        float: right;
    }
     */

.release-with-tracks .release-card .v-card__text {
  margin: 0;
  padding: 5px 7px;
  height: 100%;
  overflow: auto;
}
.release-with-tracks table {
  width: 100%;
}
.release-with-tracks td.track-number {
  width: 30px;
}
.release-with-tracks td.right {
  text-align: right;
}
tr.Missing td {
  border: 1px solid red;
}
.release-with-tracks .media-number {
  float: right;
}

.release-with-tracks .on-hover {
  display: none;
}

.release-with-tracks .inline-block {
  display: inline-block;
}

.release-with-tracks .on-show-hover:hover .on-hover {
  display: inline-block;
}

.release-with-tracks .trackRating1 {
  background: linear-gradient(
    to right,
    mediumseagreen,
    mediumseagreen 20%,
    transparent 20%,
    transparent 100%
  );
}

.release-with-tracks .trackRating2 {
  background: linear-gradient(
    to right,
    mediumseagreen,
    mediumseagreen 40%,
    transparent 40%,
    transparent 100%
  );
}

.release-with-tracks .trackRating3 {
  background: linear-gradient(
    to right,
    mediumseagreen,
    mediumseagreen 60%,
    transparent 60%,
    transparent 100%
  );
}

.release-with-tracks .trackRating4 {
  background: linear-gradient(
    to right,
    mediumseagreen,
    mediumseagreen 80%,
    transparent 80%,
    transparent 100%
  );
}

.release-with-tracks .trackRating5 {
  background: linear-gradient(
    to right,
    mediumseagreen,
    mediumseagreen 100%,
    transparent 100%,
    transparent 100%
  );
}
</style>