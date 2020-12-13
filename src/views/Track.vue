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
    <v-container class="mt-0 pt-2" v-if="loaded" fluid grid-list-md>   
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
                  <img id="trackImage" :src="trackImageUrl" style="display:none;" />
                </v-flex>
                <v-flex xs9>
                  <v-layout row wrap>
                    <v-flex xs12 md6 class="mt-2">
                      <span v-if="track.trackArtist">Artist:</span>
                      <ArtistCard class="mt-1" :artist="track.artist"></ArtistCard>
                    </v-flex>
                    <v-flex v-if="track.trackArtist" xs12 md6 class="mt-2">
                      <span>Track Artist:</span>
                      <ArtistCard class="mt-1" :artist="track.trackArtist"></ArtistCard>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex class="mt-2">
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
            <v-tab>Metadata Sources</v-tab>
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
                      rel="noopener noreferrer"
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
            <v-tooltip bottom class="hidden-sm-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">favorite</v-icon>
                </v-avatar>
                {{ track.statistics.favoriteCount | padNumber3 }}
              </v-chip>
              <span>Track Favorite Count</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-sm-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">fas fa-thumbs-down</v-icon>
                </v-avatar>
                {{ track.statistics.dislikedCount | padNumber3 }}
              </v-chip>
              <span>Track Disliked Count</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-sm-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>play_circle_outline</v-icon>
                </v-avatar>
                {{ track.statistics.playedCount | padNumber5 }}
              </v-chip>
              <span>Track Played Count</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-sm-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ track.statistics.time }}
              </v-chip>
              <span>Track Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-sm-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ track.statistics.fileSizeFormatted }}
              </v-chip>
              <span>Track File Size</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-sm-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ track.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Track Created Date</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-sm-and-down">
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
      <v-layout row wrap>
        <v-flex d-flex xs12 md6>
          <v-tabs class="track-lists" color="primary" slider-color="accent">
            <v-tab v-if="track.partTitlesList && track.partTitlesList.length">Part Titles</v-tab>
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
          </v-tabs>
        </v-flex>         
        <v-flex d-flex xs12 md6>
          <v-tabs class="track-lists" color="primary" slider-color="accent">
            <v-tab v-if="track.alternateNamesList.length">Alternate Names</v-tab>
            <v-tab v-if="track.tagsList.length > 0">Tags</v-tab>            
            <v-tab class="hidden-md-and-down">{{'Comments' + ( track.comments.length > 0 ? ' (' + track.comments.length + ')' : '') }}</v-tab>                                              
            <v-tab-item v-if="track.alternateNamesList.length">
              <v-list>
                <template v-for="(name, index) in track.alternateNamesList">
                  <v-list-tile :key="`al-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < track.alternateNamesList.length"
                    :key="`adivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>       
            <v-tab-item v-if="track.tagsList.length > 0">
              <v-list>
                <template v-for="(name, index) in track.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < track.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item class="hidden-md-and-down">
              <v-flex>
                <CommentCard :isNew="true" :addUrl="newCommentUrl"></CommentCard>
                <div v-if="track.comments.length > 0">
                  <hr class="ma-3"/>
                  <v-data-iterator
                    :items="track.comments"
                    :total-items="track.comments ? track.comments.length : 0"
                    content-tag="v-layout"
                    hide-actions
                    row
                    wrap
                  >
                    <v-flex slot="item" slot-scope="props" xs12>
                      <CommentCard :isNew="false" :isReadOnly="true" :comment="props.item"></CommentCard>
                    </v-flex>
                  </v-data-iterator>
                </div>
              </v-flex>              
            </v-tab-item> 
          </v-tabs>
        </v-flex>        
      </v-layout>
    </v-container>
    <confirm ref="confirm"></confirm>    
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import getEnv from '@/utils/env.js';
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import trackMixin from "@/mixins/track.js";
import Confirm from "@/views/Confirm";
import CommentCard from "@/components/CommentCard";

export default {
  mixins: [trackMixin],
  components: { Toolbar, ArtistCard, CommentCard, Confirm, ReleaseCard },
  props: {
    id: String
  },
  created() {
    EventBus.$on("tt:AddToQue", this.addToQue);
    EventBus.$on("tt:Play", this.playNow);
    EventBus.$on("favoriteToogle", this.toggleFavorite);
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("bookmarkToogle", this.toggleBookmark);
    EventBus.$on("hateToogle", this.hateToogle);
    EventBus.$on("tt:searchForTitle", this.searchForTitle);
    EventBus.$on("tt:searchInternetArtist", this.searchInternetArtist);
    EventBus.$on("tt:searchInternetRelease", this.searchInternetRelease);
    EventBus.$on("tt:searchInternetTitle", this.searchInternetTitle);
    EventBus.$on("tt:searchInternetArtistReleaseAndTitle", this.searchInternetArtistReleaseAndTitle);
    EventBus.$on("tt:Delete", () => { this.delete(false); });
    EventBus.$on("tt:DeleteAndFile", () => { this.delete(true); });
    EventBus.$on("tt:Edit", this.edit);
    EventBus.$on("addedComment", this.updateComments);
    EventBus.$on("deletedComment", this.updateComments);      
  },
  beforeDestroy() {
    EventBus.$off("tt:AddToQue", this.addToQue);
    EventBus.$off("tt:Play", this.playNow);
    EventBus.$off("favoriteToogle", this.toggleFavorite);
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("bookmarkToogle", this.toggleBookmark);
    EventBus.$off("hateToogle", this.hateToogle);
    EventBus.$off("tt:searchForTitle", this.searchForTitle);
    EventBus.$off("tt:searchInternetArtist", this.searchInternetArtist);
    EventBus.$off("tt:searchInternetRelease", this.searchInternetRelease);
    EventBus.$off("tt:searchInternetTitle", this.searchInternetTitle);    
    EventBus.$off("tt:searchInternetArtistReleaseAndTitle", this.searchInternetArtistReleaseAndTitle);
    EventBus.$off("tt:Delete");
    EventBus.$off("tt:DeleteAndFile");
    EventBus.$off("tt:Edit", this.edit);
    EventBus.$off("addedComment", this.updateComments);
    EventBus.$off("deletedComment", this.updateComments);      

  },
  async mounted() {
    this.updateData();
  },
  computed: {
    newCommentUrl() {
      return getEnv('ROADIE_API_URL') + "/comments/add/track/" + this.track.id;
    },     
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
            { title: "Delete", icon: "delete", class: "warning--text", click: "tt:Delete" },
            { title: "Delete Track And File", icon: "delete_forever", class: "warning--text", click: "tt:DeleteAndFile" },
            { title: "Edit", click: "tt:Edit" }
          ];
    },
    searchQuery() {
      return this.track.title;
    },
    currentPlayingTrack() {
      return this.$store.getters.playingIndex;
    },
    crumbs() {
      return [
        {
          text: 'Label',
          to: 'breadcrumbs_link_2'
        },
        {
          text: 'Artist',
          to: '/artist/' + this.track.artist.id
        },
        {
          text: 'Release',
          to: '/release/' + this.track.release.id
        }
      ]
    }
  },
  methods: {
    delete(andDeleteFile) {
      let trackId = this.track.id;
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                getEnv('ROADIE_API_URL') +
                  "/admin/delete/track/" + trackId + '?doDeleteFile=' + andDeleteFile
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },
    edit: function() {
      this.$router.push("/track/edit/" + this.track.id);
    },    
    searchForTitle: function() {
      this.$router.push({ name: "search", params: { q: 't: ' + this.track.title } });
    },
    searchInternetArtist: function() {
      var artist = this.track.trackArtist || this.track.artist;
      this.internetSearch(artist.artist.text + ' Band');
    },
    searchInternetRelease: function() {
      this.internetSearch(this.track.release.release.text + ' Release');
    },
    searchInternetTitle: function() {
      this.internetSearch(this.track.title + ' Song');
    },
    searchInternetArtistReleaseAndTitle: function() {
      var artist = this.track.trackArtist || this.track.artist;
      this.internetSearch(artist.artist.text + ' ' + this.track.release.release.text + ' ' + this.track.title);
    },
    internetSearch: function(q) {
      var url = "https://www.google.com/search?q=" + encodeURIComponent(q);
      window.open(url, "_blank");
    },        
    playNow: function() {
      this.$playQue.deleteAll()
      .then(() => {
        this.addTrackToQue(this.track);
      });      
    },
    addToQue: function() {
      this.addTrackToQue(this.track);
    },
    toggleBookmark: function() {
      this.trackBookmarkToggle({
        trackId: this.track.id,
        userBookmarked: !this.track.userBookmarked
      }).then(() => {
        this.track.userBookmarked = !this.track.userBookmarked;
      });
    },
    toggleFavorite: function() {
      this.trackFavoriteToggle({
        trackId: this.track.id,
        isFavorite: !this.track.userRating.isFavorite
      }).then(this.updatePartial);  
    },
    hateToogle: function() {
      this.trackDislikeToggle({
        trackId: this.track.id,
        isDisliked: !this.track.userRating.isDisliked
      }).then(this.updatePartial);  
    },
    setRating: async function() {
      this.$nextTick(() => {
        this.trackRatingChange({
          trackId: this.track.id,
          newVal: this.track.userRating.rating
        }).then(this.updatePartial);
      });
    },
    updatePartial: async function() {
      this.updateData(true)
    },
    updateComments: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(getEnv('ROADIE_API_URL') + `/tracks/${this.id}?inc=comments`)
        .then(response => {
          this.track.comments = response.data.data.comments || [];
        })
        .finally(() => {     
          this.$nextTick(() => {
            EventBus.$emit("loadingComplete");                
          });
        });           
    },       
    updateData: async function(isLoading) {
      this.loaded = isLoading == undefined ? false : isLoading;
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(getEnv('ROADIE_API_URL') + `/tracks/${this.id}`)
        .then(response => {
          this.track = response.data.data;
          this.track.alternateNamesList = this.track.alternateNamesList || [];          
          this.track.tagsList = this.track.tagsList || [];          
          this.track.comments = this.track.comments || [];          
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
            setTimeout(function() {
              var image=document.getElementById('trackImage')
              window.favIcon.image(image);   
            }, 500);                   
            document.title = this.track.title;            
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
    currentPlayingTrack() {
      this.updateData();
    }
  },
  data: () => ({
    track: {
      alternateNamesList: [],
      tagsList: [],    
      comments: []      
    },
    tab: 0,
    loaded: false,
    menuItems: [
      {
        title: "Add To Que",
        class: "hidden-xs-only",
        click: "tt:AddToQue"
      },
      { title: "Play", class: "hidden-xs-only", click: "tt:Play" }
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
.track-detail-container .markdown-editor, .track-detail-container .comments .v-card { 
  max-width: 717px;
  margin-left: 17px;
}
.track-detail-container .comments .v-card { 
  max-width: 806px;
}
</style>
