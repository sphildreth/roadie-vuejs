<template>
  <div class="release-detail-container">
    <Toolbar
      :menuItems="menuItems"
      :adminItems="adminMenuItems"
      :searchItems="seachMenuItems"
      :toolbarIcon="'music_video'"
      :doShowBookmark="true"
      :bookmarked="release.userBookmarked"
      :doShowFavorite="true"
      :favorited="release.userRating && release.userRating.isFavorite"
      :doShowHated="true"
      :hated="release.userRating && release.userRating.isDisliked"
    ></Toolbar>
    <v-container v-if="coverSearchItems.length === 0" fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="profile darken-1">
                <v-card-text class="title">
                  {{ release.title }}
                  <v-icon
                    v-if="release.isLocked"
                    style="float: right;"
                    title="Release is locked!"
                    color="warning"
                  >lock</v-icon>
                  <v-icon
                    v-if="release.status > 2"
                    style="float: right;"
                    title="Release has issues!"
                    color="warning"
                  >warning</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img :src="releaseCoverUrl" :alt="release.title" class="ma-1" aspect-ratio="1"></v-img>
                </v-flex>
                <v-flex xs9 class="title">
                  <v-layout row wrap>
                    <v-flex xs4 class="mt-2">
                      <ArtistCard :artist="release.artist"></ArtistCard>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-text-field
                        v-bind:value="release.releaseDate | shortDate"
                        label="Release Date"
                        readonly
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field v-bind:value="release.mediaCount" label="Media Count" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field v-bind:value="release.trackCount" label="Track Count" readonly></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-text-field
                        v-bind:value="release.releaseType"
                        label="Release Type"
                        readonly
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field
                        v-bind:value="release.statusVerbose"
                        label="Release Status"
                        readonly
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm5 md5>
          <v-tabs right color="primary" v-model="tab" slider-color="accent">
            <v-tab v-if="release.images.length">Images</v-tab>
            <v-tab v-if="release.profile">Profile</v-tab>
            <v-tab>Metadata Sources</v-tab>
            <v-tab-item v-if="release.images.length">
              <v-card flat class="images darken-3">
                <v-container class="images-container" fluid grid-list-xs>
                  <v-layout row wrap>
                    <v-flex v-for="(image, index) in release.images" :key="image.url" xs2>
                      <v-img
                        :src="image.thumbnailUrl"
                        :lazy-src="`@/assets/img/loading.gif`"
                        class="grey lighten-2"
                        @click="showImageModal(release.images[index])"
                      ></v-img>
                    </v-flex>
                  </v-layout>
                  <v-dialog v-model="showModal">
                    <v-card @click="showModal = !showModal">
                      <v-card-title class="headline">{{ modalImage.caption}}</v-card-title>
                      <v-card-text class="grey" max-height="820px">
                        <img
                          class="modal-image"
                          v-bind:src="modalImage.url"
                          v-bind:title="modalImage.caption"
                          v-bind:alt="modalImage.caption"
                        >
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                </v-container>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="release.profile">
              <v-card flat class="profile darken-3 pa-2">
                <vue-markdown>{{ release.profile }}</vue-markdown>
              </v-card>
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
                  v-model="release.userRating.rating"
                  class="pointer release-rating"
                  background-color="orange lighten-3"
                  color="orange"
                  medium
                  dense
                  hover
                  clearable
                ></v-rating>
              </v-chip>
              <span>Rate Release</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>stars</v-icon>
                </v-avatar>
                <v-rating
                  v-model="release.rating"
                  background-color="orange lighten-3"
                  color="orange"
                  readonly
                  small
                  dense
                ></v-rating>
              </v-chip>
              <span>Release Average Rating</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>album</v-icon>
                </v-avatar>
                {{ release.statistics.mediaCount | padNumber4 }}
              </v-chip>
              <span>Release Medias</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>audiotrack</v-icon>
                </v-avatar>
                {{ release.statistics.trackCount | padNumber4 }}
              </v-chip>
              <span>Release Tracks</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>play_circle_outline</v-icon>
                </v-avatar>
                {{ release.statistics.trackPlayedCount | padNumber5 }}
              </v-chip>
              <span>Release Played Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip
                v-if="release.statistics.missingTrackCount"
                slot="activator"
                color="warning"
                text-color="black"
              >
                <v-avatar>
                  <v-icon>error</v-icon>
                </v-avatar>
                {{ release.statistics.missingTrackCount }}
              </v-chip>
              <span>Release Tracks Missing</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ release.statistics.trackTime }}
              </v-chip>
              <span>Release Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ release.statistics.trackSize }}
              </v-chip>
              <span>Release Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ release.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Release Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ release.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Release Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs5>
          <v-tabs class="release-lists" color="primary" v-model="releaseTab" slider-color="accent">
            <v-tab>Tracks</v-tab>
            <v-tab-item>
              <v-card flat class="tracks">
                <v-data-iterator
                  :items="release.medias"
                  :total-items="release.medias ? release.medias.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs12>
                    <MediaCard :media="props.item" :release="release" :mediaCount="release.mediaCount"></MediaCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
        <v-flex d-flex xs7>
          <v-tabs class="release-lists" color="primary" slider-color="accent">
            <v-tab v-if="release.playlists.length > 0">Playlists</v-tab>
            <v-tab v-if="release.tagsList.length > 0">Tags</v-tab>
            <v-tab v-if="release.collections.length > 0">Collections</v-tab>
            <v-tab v-if="release.alternateNamesList.length">Alternate Names</v-tab>
            <v-tab v-if="release.genres.length">Genres</v-tab>
            <v-tab v-if="release.labels.length > 0">Labels</v-tab>
            <v-tab v-if="release.urLsList.length">Urls</v-tab>
            <v-tab-item v-if="release.playlists.length > 0">
              <v-card flat class="playlists">
                <v-data-iterator
                  :items="release.playlists"
                  :total-items="release.playlists ? release.playlists.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs4>
                    <PlaylistCard :playlist="props.item"></PlaylistCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="release.tagsList.length > 0">
              <v-list>
                <template v-for="(name, index) in release.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < release.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="release.collections.length > 0">
              <v-card flat class="collections">
                <v-data-iterator
                  :items="release.collections"
                  :total-items="release.collections ? release.collections.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs4>
                    <CollectionCard
                      :collection="props.item.collection"
                      :listNumber="props.item.listNumber"
                    ></CollectionCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="release.alternateNamesList.length">
              <v-list>
                <template v-for="(name, index) in release.alternateNamesList">
                  <v-list-tile :key="`al-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < release.alternateNamesList.length"
                    :key="`adivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="release.genres.length">
              <v-list>
                <template v-for="(name, index) in release.genres">
                  <v-list-tile :key="`g-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name.text }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < release.genres.length" :key="`gdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="release.labels.length > 0">
              <v-card flat class="labels">
                <v-data-iterator
                  :items="release.labels"
                  :total-items="release.labels ? release.labels.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs4>
                    <LabelCard
                      :label="props.item.label"
                      :catalogNumber="props.item.catalogNumber"
                      :beginDate="props.item.beginDate"
                      :endDate="props.item.endDate"
                    ></LabelCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="release.urLsList.length">
              <v-list>
                <template v-for="(name, index) in release.urLsList">
                  <v-list-tile :key="`u-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a v-bind:href="name" target="_blank">{{ name }}</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < release.urLsList.length"
                    :key="`uaadivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
    <confirm ref="confirm"></confirm>
    <v-container v-if="coverSearchItems.length > 0" fluid grid-list-md>
      <v-flex xs1 offset-xs11>
        <v-btn color="warning" @click="coverSearchItems = []">Cancel</v-btn>
      </v-flex>
      <v-text-field v-model="coverSearchQuery" label="Search Query"></v-text-field>
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        v-on:vdropzone-complete="coverDragUploadComplete"
        :options="dropzoneOptions"
      ></vue-dropzone>
      <v-data-iterator
        v-if="coverSearchItems"
        :items="coverSearchItems"
        :total-items="coverSearchItems ? coverSearchItems.length : 0"
        content-tag="v-layout"
        hide-actions
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs1>
          <div>
            <v-img
              :src="props.item.mediaUrl"
              :alt="props.item.title"
              weight="80"
              class="ma-1 pointer"
              @click="selectedCoverImage(props.item.mediaUrl)"
            ></v-img>
          </div>
        </v-flex>
      </v-data-iterator>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import LabelCard from "@/components/LabelCard";
import ArtistCard from "@/components/ArtistCard";
import CollectionCard from "@/components/CollectionCard";
import PlaylistCard from "@/components/PlaylistCard";
import MediaCard from "@/components/MediaCard";
import Confirm from "@/views/Confirm";
import { EventBus } from "@/event-bus.js";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import VueMarkdown from "vue-markdown";

export default {
  components: {
    Toolbar,
    LabelCard,
    ArtistCard,
    CollectionCard,
    PlaylistCard,
    MediaCard,
    Confirm,
    vueDropzone: vue2Dropzone,
    VueMarkdown
  },
  props: {
    id: String
  },
  created() {
    EventBus.$on("rr:AddToQue", this.addToQue);
    EventBus.$on("rr:PlayNow", this.playNow);
    EventBus.$on("rr:Comment", this.comment);
    EventBus.$on("rr:searchInternetTitle", this.internetTitleSearch);
    EventBus.$on("rr:searchInternetArtist", this.internetArtistSearch);
    EventBus.$on("rr:searchInternetreleaseandTitle", this.searchInternetreleaseandTitle);
    EventBus.$on("rr:searchForTitle", this.searchForTitle);
    EventBus.$on("rr:searchForArtist", this.searchForArtist);    
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("bookmarkToogle", this.toggleBookmark);    
    EventBus.$on("favoriteToogle", this.toggleFavorite);
    EventBus.$on("hateToogle", this.toggleHated);
    EventBus.$on("rr:Rescan", this.rescan);
    EventBus.$on("rr:Delete", this.delete);
    EventBus.$on("rr:FindCover", this.findCover);
    EventBus.$on("rr:Edit", this.edit);
    this.debouncedFindCover = this.$_.debounce(this.findCover, 800);
    EventBus.$on("t:selected", track => this.addSelectedTrack(track));
    EventBus.$on("t:unselected", track => this.removeSelectedTrack(track));
  },
  beforeDestroy() {
    EventBus.$off("rr:AddToQue", this.addToQue);
    EventBus.$off("rr:PlayNow", this.playNow);
    EventBus.$off("rr:Comment", this.comment);
    EventBus.$off("rr:searchInternetTitle");
    EventBus.$off("rr:searchInternetArtist");    
    EventBus.$off("rr:searchInternetreleaseandTitle");
    EventBus.$off("rr:searchForArtist");        
    EventBus.$off("rr:searchForTitle");
    EventBus.$off("toolbarRefresh");
    EventBus.$off("bookmarkToogle", this.toggleBookmark);    
    EventBus.$off("favoriteToogle", this.toggleFavorite);
    EventBus.$off("hateToogle", this.toggleHated);
    EventBus.$off("rr:Rescan", this.rescan);
    EventBus.$off("rr:Delete", this.delete);
    EventBus.$off("rr:FindCover", this.findCover);
    EventBus.$off("rr:Edit", this.edit);
    EventBus.$off("t:selected");
    EventBus.$off("t:unselected");    
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    searchQuery() {
      return this.release.title;
    },
    releaseCoverUrl() {
      return this.release.mediumThumbnail.url;
    },
    adminMenuItems() {
      return !this.$store.getters.isUserAdmin
        ? []
        : [
            { title: "Delete", class: "warning--text", click: "rr:Delete" },
            { title: "Edit", click: "rr:Edit" },
            { title: "Find Cover", click: "rr:FindCover" },
            { title: "Rescan", click: "rr:Rescan" }
          ];
    },
    fileUploadUrl() {
      return process.env.VUE_APP_API_URL + "/uploadImage/" + this.release.id;
    }
  },
  methods: {
    playNow: function() {
      this.$store.dispatch("clearQue");
      this.addToQue();
    },
    addSelectedTrack: function(track) {
      if(!this.$_.find(this.selectedTracks, function(t) { return t.id === track.id; })) {
        this.selectedTracks.push(track);
      }        
    },
    removeSelectedTrack: function(track) {
      this.$_.remove(this.selectedTracks, function(t) { return t.id === track.id; });
    },
    coverDragUploadComplete: function() {
      this.coverSearchItems = [];
    },
    edit: function() {
      this.$router.push("/release/edit/" + this.release.id);
    },
    internetTitleSearch: function() {
      return this.internetSearch(this.searchQuery + " album");
    },
    internetArtistSearch: function() {
      return this.internetSearch(this.release.artist.artist.text + ' Band');
    },    
    searchInternetreleaseandTitle: function() {
      return this.internetSearch(this.searchQuery + ' ' + this.release.artist.artist.text);
    },
    internetSearch: function(q) {
      var url = "https://www.google.com/search?q=" + encodeURIComponent(q);
      window.open(url, "_blank");
    },
    searchForTitle: function() {
      this.$router.push({ name: 'search', params: { q: this.searchQuery}});
    },
    searchForArtist: function() {
      this.$router.push({ name: 'search', params: { q: this.release.artist.artist.text}});
    },    
    toggleFavorite: async function() {
      this.release.userRating = this.release.userRating || {};
      this.release.userRating.isFavorite = this.release.userRating
        ? !this.release.userRating.isFavorite
        : true;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/users/setReleaseFavorite/" +
            this.release.id +
            "/" +
            this.release.userRating.isFavorite
        )
        .then(response => {
          if (response.data.isSuccess && this.release.userRating.isFavorite) {
            EventBus.$emit("showSnackbar", { text: "Release is now a favorite" });            
          } else if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", { text: "Release is no longer a favorite" });                        
          }
        });
    },
    toggleHated: async function() {
      this.release.userRating = this.release.userRating || {};
      this.release.userRating.isDisliked = this.release.userRating
        ? !this.release.userRating.isDisliked
        : true;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/users/setReleaseDisliked/" +
            this.release.id +
            "/" +
            this.release.userRating.isDisliked
        )
        .then(response => {
          if (response.data.isSuccess && this.release.userRating.isDisliked) {
            EventBus.$emit("showSnackbar", { text: "You now hate this Release"});            
          } else if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", { text: "You no longer hate this Release"});
          }
        });
    },
    addToQue: function() {
      let queTracks = [];      
      let t = null;
      if(this.selectedTracks.length > 0) {
        t = this.selectedTracks;
      } else {
        t = this.$_.flatMap(this.release.medias, function(media) {
            return media.tracks;
        });
      }
      t.forEach(tr => {
        let artist = tr.trackArtist || this.release.artist;        
        let queTrack = {
          id: tr.id,
          mediaNumber: tr.mediaNumber,
          trackNumber: tr.trackNumber,
          title: tr.title,
          duration: tr.duration,
          durationTime: tr.durationTime,
          rating: tr.rating,
          trackPlayUrl: tr.trackPlayUrl,
          release: { 
            text: this.release.title,
            value: this.release.id,
            releaseDate: this.release.releaseDate
          },
          artist: artist,
          releaseArtist: this.release.artist,          
          releaseImageUrl:  this.release.thumbnail.url,
          artistImageUrl: artist.thumbnail.url,
          userRating: tr.userRating || { rating : 0 }
        }; 
        queTracks.push(queTrack);        
      })
      EventBus.$emit("showSnackbar", { text: "Added [" + queTracks.length + "] tracks to Que" });
    },
    comment: function() {},
    showImageModal: function(e) {
      this.modalImage = e;
      this.showModal = true;
    },
    selectedCoverImage: function(coverUrl) {
      this.coverSearchItems = [];
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/releases/setImageByUrl/" +
            this.release.id +
            "/" +
            encodeURIComponent(coverUrl)
        )
        .then(response => {
          if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", { text: "Successfully updated Release cover." });            
            this.$nextTick(()=> {
              this.release.mediumThumbnail.url = response.data.data.url;              
            });            
          }
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    findCover: async function() {
      EventBus.$emit("loadingStarted");
      this.coverSearchQuery =
        this.coverSearchQuery ||
        this.release.artist.artist.text + " " + this.release.title;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/images/search/release/" +
            encodeURIComponent(this.coverSearchQuery) +
            "/25"
        )
        .then(response => {
          this.coverSearchItems = response.data.data;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    rescan: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          process.env.VUE_APP_API_URL + "/admin/scan/release/" + this.release.id
        )
        .then(() => {
          this.updateData();
        });
    },
    delete: async function() {
      let releaseId = this.release.id;
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                process.env.VUE_APP_API_URL +
                  "/admin/delete/release/" +
                  releaseId
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },
    toggleBookmark: async function() {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/users/setReleaseBookmark/" +
            this.release.id +
            "/" +
            !this.release.userBookmarked
        )
        .then(response => {
          if (!this.release.userBookmarked) {
            EventBus.$emit("showSnackbar", { text: "Successfully bookmarked" });            
          } else if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", { text: "Successfully removed bookmark" });            
          }
          this.release.userBookmarked = !this.release.userBookmarked;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/releases/${this.id}`)
        .then(response => {
          this.release = response.data.data;
          this.release.artist = this.release.artist || {};
          this.release.images = this.release.images || [];
          this.release.medias = this.release.medias || [];
          this.release.alternateNamesList =
            this.release.alternateNamesList || [];
          (this.release.genres = this.release.genres || []),
            (this.release.collections = this.release.collections || []),
            (this.release.playlists = this.release.playlists || []),
            (this.release.labels = this.release.labels || []);
          this.release.tagsList = this.release.tagsList || [];
          this.release.urLsList = this.release.urLsList || [];
          this.release.userRating = this.release.userRating || {
            rating: 0,
            isFavorite: false,
            isDisliked: false
          };
        })
        .finally(() => {
          this.dropzoneOptions.url =
            process.env.VUE_APP_API_URL +
            "/releases/uploadImage/" +
            this.release.id;
          this.dropzoneOptions.headers = {
            Authorization: "Bearer " + this.$store.getters.authToken
          };
          EventBus.$emit("loadingComplete");
        });
    },
    metaDataSources: function() {
      return [
        {
          source: "All Music",
          sourceId: this.release.amgId,
          url: `'https://www.allmusic.com/artist/-'`
        },
        {
          source: "Discogs",
          sourceId: this.release.discogsId,
          url: "https://www.discogs.com/artist/"
        },
        {
          source: "iTunes",
          sourceId: this.release.iTunesId,
          url: "https://itunes.apple.com/us/Release/"
        },
        {
          source: "MusicBrainz",
          sourceId: this.release.musicBrainzId,
          url: "https://musicbrainz.org/release/"
        },
        {
          source: "Spotify",
          sourceId: this.release.spotifyId,
          url: "https://play.spotify.com/Release/"
        }
      ];
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    coverSearchQuery: function() {
      this.debouncedFindCover();
    }
  },
  data: () => ({
    tab: 0,
    releaseTab: 2,
    selectedTracks: [],
    coverSearchQuery: "",
    showModal: false,
    modalImage: {},
    coverSearchItems: [],
    release: {
      status: 0,
      artist: {
        thumbnail: {},
        artist: {}
      },
      mediumThumbnail: {},
      userRating: {},
      statistics: {},
      images: [],
      medias: [],
      alternateNamesList: [],
      genres: [],
      collections: [],
      playlists: [],
      labels: [],
      tagsList: [],
      urLsList: []
    },
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
    ],
    menuItems: [
      { title: "Add To Que", tooltip:"Added checked tracks to Que, if none selected adds all to Que.", class: "hidden-xs-only", click: "rr:AddToQue" },
      { title: "Play", tooltip:"Remove anything in Que and start Playing", class: "hidden-xs-only", click: "rr:PlayNow" },      
      { title: "Comment", class: "hidden-xs-only", click: "rr:Comment" }
    ],
    seachMenuItems: [
      { title: "Search for Artist", click: "rr:searchForArtist" },
      { title: "Search for Title", click: "rr:searchForTitle" },      
      { title: "Internet Artist", click: "rr:searchInternetArtist" },
      { title: "Internet Title", click: "rr:searchInternetTitle" },
      {
        title: "Internet Artist and Title",
        click: "rr:searchInternetreleaseandTitle"
      }
    ],
    dropzoneOptions: {
      thumbnailWidth: 100,
      maxFilesize: 0.5,
      dictDefaultMessage: "<i class='fa fa-cloud-upload'></i>Upload new Cover"
    }
  })
};
</script>


<style>
.release-detail-container .v-rating.release-rating {
  width: 100%;
}
.release-detail-container .bio,
.release-detail-container .profile {
  max-height: 350px;
  overflow: auto;
}
.release-detail-container .v-card__title {
  padding-top: 9px;
  padding-bottom: 9px;
}
.release-detail-container .images-container {
  max-height: 313px;
  overflow: hidden;
  overflow-y: auto;
}
.release-detail-container .release-lists .v-list {
  max-height: 300px;
  overflow: auto;
}
</style>
