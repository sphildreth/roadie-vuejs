<template>
  <div class="track-detail-container">
    <Toolbar
      v-if="loaded"
      :menuItems="menuItems"
      :adminItems="adminMenuItems"
      :searchItems="seachMenuItems"
      :toolbarIcon="'audiotrack'"
      :doShowBookmark="true"
      :bookmarked="track.userBookmarked"
      :doShowFavorite="true"
      :favorited="track.userRating && track.userRating.isFavorite"
      :doShowHated="true"
      :hated="track.userRating && track.userRating.isDisliked"
    ></Toolbar>
    <v-container v-if="loaded" fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="profile darken-1">
                <v-card-text
                  :class="{ 'playing-track': this.$store.getters.playingIndex.trackId == track.id }"
                  class="title"
                >
                  {{ track.title }}
                  <v-icon
                    v-if="track.isLocked"
                    style="float: right;"
                    title="Track is locked!"
                    color="warning"
                  >lock</v-icon>
                  <v-icon
                    v-if="track.status > 2"
                    style="float: right;"
                    title="Track has issues!"
                    color="warning"
                  >warning</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img :src="trackImageUrl" :alt="track.title" class="ma-1" aspect-ratio="1"></v-img>
                </v-flex>
                <v-flex xs9>
                  <v-layout row wrap>
                    <v-flex xs4 class="mt-2">
                      <ArtistCard :artist="track.artist"></ArtistCard>
                    </v-flex>
                    <v-flex v-if="track.trackArtist" xs4 class="mt-2">
                      <ArtistCard :artist="track.trackArtist"></ArtistCard>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs8 class="mt-2">
                      <ReleaseCard :release="track.release"></ReleaseCard>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm5 md5>
          <v-tabs right color="primary" v-model="tab" slider-color="accent">
            <v-tab v-if="track.partTitlesList && track.partTitlesList.length">Part Titles</v-tab>
            <v-tab>Metadata Sources</v-tab>
            <v-tab-item v-if="track.partTitlesList && track.partTitlesList.length">
              <v-list>
                <template v-for="(parTitle, index) in track.partTitlesList">
                  <v-list-tile :key="`t-${parTitle}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ parTitle }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < track.partTitlesList.length"
                    :key="`tdivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item>
              <v-data-table
                :headers="metaDataHeaders"
                :items="metaDataSources()"
                class="elevation-1"
                hide-actions
              >
                <template slot="items" slot-scope="props">
                  <td v-if="props.item.sourceId">{{ props.item.source }}</td>
                  <td v-if="props.item.sourceId">
                    <a
                      v-bind:href="props.item.url + props.item.sourceId"
                      target="_blank"
                    >{{ props.item.sourceId }}</a>
                  </td>
                </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="stats-container">
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-rating
                  @click.native="setRating"
                  @change.native="setRating"
                  v-model="track.userRating.rating"
                  class="pointer track-rating"
                  background-color="orange lighten-3"
                  color="orange"
                  medium
                  dense
                  hover
                  clearable
                ></v-rating>
              </v-chip>
              <span>Rate Track</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>stars</v-icon>
                </v-avatar>
                <v-rating
                  v-model="track.rating"
                  background-color="orange lighten-3"
                  color="orange"
                  readonly
                  small
                  dense
                ></v-rating>
              </v-chip>
              <span>Track Average Rating</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">favorite</v-icon>
                </v-avatar>
                {{ track.statistics.favoriteCount | padNumber3 }}
              </v-chip>
              <span>Track Favorite Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">fas fa-thumbs-down</v-icon>
                </v-avatar>
                {{ track.statistics.dislikedCount | padNumber3 }}
              </v-chip>
              <span>Track Disliked Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>play_circle_outline</v-icon>
                </v-avatar>
                {{ track.statistics.playedCount | padNumber5 }}
              </v-chip>
              <span>Track Played Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ track.statistics.time }}
              </v-chip>
              <span>Track Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ track.statistics.fileSizeFormatted }}
              </v-chip>
              <span>Track File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ track.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Track Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ track.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Track Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import trackMixin from "@/mixins/track.js";
export default {
  mixins: [trackMixin],
  components: { Toolbar, ArtistCard, ReleaseCard },
  props: {
    id: String
  },
  created() {
    EventBus.$on("tt:AddToQue", this.addTrackToQue);
    EventBus.$on("tt:Play", this.playNow);
    EventBus.$on("tt:Comment", this.comment);
    EventBus.$on("favoriteToogle", this.toggleFavorite);
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("bookmarkToogle", this.toggleBookmark);
    EventBus.$on("hateToogle", this.hateToogle);
  },
  beforeDestroy() {
    EventBus.$off("tt:AddToQue", this.addTrackToQue);
    EventBus.$off("tt:Play", this.playNow);
    EventBus.$off("tt:Comment", this.comment);
    EventBus.$off("favoriteToogle", this.toggleFavorite);
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("bookmarkToogle", this.toggleBookmark);
    EventBus.$off("hateToogle", this.hateToogle);
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    rating() {
      return this.track.rating;
    },
    trackImageUrl() {
      return this.track.mediumThumbnail.url;
    },
    adminMenuItems() {
      return !this.$store.getters.isUserAdmin
        ? []
        : [
            { title: "Delete", class: "warning--text", click: "aa:Delete" },
            { title: "Edit", click: "aa:Edit" }
          ];
    },
    searchQuery() {
      return this.track.title;
    },
    currentPlayingTrack() {
      return this.$store.getters.playingIndex;
    }
  },
  methods: {
    playNow: function() {
      this.$store.dispatch("clearQue");
      this.addToQue(this.track);
    },
    addTrackToQue: function() {
      this.addToQue(this.track);
    },
    comment: function() {},
    toggleBookmark: function() {
      this.bookmarkToggle({
        trackId: this.track.id,
        userBookmarked: !this.track.userBookmarked
        // eslint-disable-next-line
      }).then(r => {
        this.track.userBookmarked = !this.track.userBookmarked;
      });
    },
    toggleFavorite: function() {
      this.favoriteToggle({
        trackId: this.track.id,
        isFavorite: !this.track.userRating.isFavorite
        // eslint-disable-next-line
      }).then(r => {
        this.updateData();
      });
    },
    hateToogle: function() {
      this.dislikeToggle({
        trackId: this.track.id,
        isDisliked: !this.track.userRating.isDisliked
        // eslint-disable-next-line
      }).then(r => {
        this.updateData();
      });
    },
    setRating: async function() {
      this.$nextTick(() => {
        this.ratingChange({
          trackId: this.track.id,
          newVal: this.track.userRating.rating
        })
          // eslint-disable-next-line
          .then(r => {
            this.updateData();
          });
      });
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/tracks/${this.id}`)
        .then(response => {
          this.track = response.data.data;
          this.track.userRating = this.track.userRating || {
            rating: 0,
            isFavorite: false,
            isDisliked: false
          };
        })
        .finally(() => {
          this.loaded = true;
          this.$nextTick(() => {
            EventBus.$emit("loadingComplete");
          });
        });
    },
    metaDataSources: function() {
      return [
        {
          source: "All Music",
          sourceId: this.track.amgId,
          url: "http://www.allmusic.com/track/"
        },
        {
          source: "Last FM",
          sourceId: this.track.lastFMId,
          url: "https://www.lastfm.com/track/"
        },
        {
          source: "MusicBrainz",
          sourceId: this.track.musicBrainzId,
          url: "https://musicbrainz.org/track/"
        },
        {
          source: "Spotify",
          sourceId: this.track.spotifyId,
          url: "https://open.spotify.com/track/"
        }
      ];
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.loaded = false;
      this.updateData();
    },
    currentPlayingTrack(newValue) {
      this.updateData();
    }
  },
  data: () => ({
    track: [],
    tab: 0,
    loaded: false,
    menuItems: [
      {
        title: "Add To Que",
        class: "hidden-xs-only",
        click: "tt:AddToQue"
      },
      { title: "Play", class: "hidden-xs-only", click: "tt:Play" },
      { title: "Comment", class: "hidden-xs-only", click: "tt:Comment" }
    ],
    seachMenuItems: [
      { title: "Search for Title", click: "tt:searchForTitle" },
      { title: "Internet Artist", click: "tt:searchInternetArtist" },
      { title: "Internet Release", click: "tt:searchInternetRelease" },
      { title: "Internet Title", click: "tt:searchInternetTitle" },
      {
        title: "Internet Artist, Release and Title",
        click: "tt:searchInternetArtistReleaseAndTitle"
      }
    ],
    metaDataHeaders: [
      {
        text: "Source",
        align: "left",
        sortable: false,
        value: "source"
      },
      {
        text: "Source Id",
        align: "left",
        sortable: false,
        value: "sourceId"
      }
    ]
  })
};
</script>


<style>
</style>
