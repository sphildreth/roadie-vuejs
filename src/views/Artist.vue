<template>
  <div class="artist-detail-container">
    <Toolbar
      :menuItems="menuItems"
      :adminItems="adminMenuItems"
      :searchItems="seachMenuItems"
      :toolbarIcon="'fas' +' '+ 'fa-user'"
      :doShowBookmark="true"
      :bookmarked="artist.userBookmarked"
      :doShowFavorite="true"
      :favorited="artist.userRating && artist.userRating.isFavorite"
      :doShowHated="true"
      :hated="artist.userRating && artist.userRating.isDisliked"
    ></Toolbar>
    <v-container
      v-if="!loading && !showMergingArtist && artistImageSearchItems.length === 0"
      fluid
      grid-list-md
    >
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="profile darken-1">
                <v-card-text
                  class="title"
                  :class="{ 'playing-artist': this.$store.getters.playingIndex.artistId == artist.id }"
                >
                  {{ artist.name }}
                  <v-icon
                    v-if="artist.isLocked"
                    style="float: right;"
                    title="Arist is locked!"
                    color="warning"
                  >lock</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img :src="artistThumbnailUrl" :alt="artist.name" class="ma-1" aspect-ratio="1"></v-img>
                  <img id="artistImage" :src="artistThumbnailUrl" style="display:none;">
                </v-flex>
                <v-flex xs9 class="title">
                  <v-text-field
                    v-if="artist.realName"
                    v-bind:value="artist.realName"
                    label="Real Name"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    v-if="artist.sortName"
                    v-bind:value="artist.sortName"
                    label="Sort Name"
                    readonly
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-text-field v-bind:value="artist.artistType" label="Artist Type" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs2>
                      <v-text-field v-bind:value="artist.statusVerbose" label="Artist Status" readonly></v-text-field>
                    </v-flex>                    
                    <v-flex xs3 v-if="artist.isniList">
                      <v-text-field v-bind:value="artist.isniList.join(', ')" label="ISNI" readonly></v-text-field>
                    </v-flex>
                    <v-flex xs1 v-if="artist.rank">
                      <v-text-field v-bind:value="artist.rank" title="Calculated Rank" label="Rank" readonly></v-text-field>
                    </v-flex>                      
                  </v-layout>
                  <v-layout row wrap>
                    <v-flex xs4 v-if="artist.birthDate">
                      <v-text-field
                        v-bind:value="shortDateWithAge(artist.birthDate)"
                        label="Birth Date"
                        readonly
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs4 v-if="artist.beginDate">
                      <v-text-field
                        v-bind:value="shortDateWithAge(artist.beginDate)"
                        label="Begin Date"
                        readonly
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs4 v-if="artist.endDate">
                      <v-text-field
                        v-bind:value="shortDateWithAge(artist.endDate)"
                        label="End Date"
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
            <v-tab v-if="artist.images.length">Images</v-tab>
            <v-tab v-if="artist.bioContext">Biography</v-tab>
            <v-tab v-if="artist.profile">Profile</v-tab>
            <v-tab>Metadata Sources</v-tab>
            <v-tab-item v-if="artist.images.length">
              <v-card flat class="images darken-3">
                <v-container class="images-container" fluid grid-list-xs>
                  <v-layout row wrap>
                    <v-flex v-for="(image, index) in artist.images" :key="image.url" xs2>
                      <v-img
                        :src="image.thumbnailUrl"
                        class="grey lighten-2"
                        @click="showImageModal(artist.images[index])"
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
            <v-tab-item v-if="artist.bioContext">
              <v-card flat class="pa-2 biography darken-3">
                <vue-markdown>{{artist.bioContext}}</vue-markdown>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="artist.profile">
              <v-card flat class="profile pa-2 darken-3">
                <vue-markdown>{{artist.profile}}</vue-markdown>
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
                  v-model="artist.userRating.rating"
                  class="pointer artist-rating"
                  background-color="orange lighten-3"
                  color="orange"
                  medium
                  dense
                  hover
                  clearable
                ></v-rating>
              </v-chip>
              <span>Rate Artist</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>stars</v-icon>
                </v-avatar>
                <v-rating
                  v-model="rating"
                  background-color="orange lighten-3"
                  color="orange"
                  readonly
                  small
                  dense
                ></v-rating>
              </v-chip>
              <span>Artist Average Rating</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>library_music</v-icon>
                </v-avatar>
                {{ artist.statistics.releaseCount | padNumber3 }}
              </v-chip>
              <span>Artist Releases</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>album</v-icon>
                </v-avatar>
                {{ artist.statistics.releaseMediaCount | padNumber4 }}
              </v-chip>
              <span>Artist Release Medias</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>audiotrack</v-icon>
                </v-avatar>
                {{ artist.statistics.trackCount | padNumber4 }}
              </v-chip>
              <span>Artist Release Tracks</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>play_circle_outline</v-icon>
                </v-avatar>
                {{ artist.statistics.trackPlayedCount | padNumber5 }}
              </v-chip>
              <span>Artist Played Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip v-if="artist.statistics.missingTrackCount" slot="activator" color="warning">
                <v-avatar>
                  <v-icon>error</v-icon>
                </v-avatar>
                {{ artist.statistics.missingTrackCount }}
              </v-chip>
              <span>Artist Tracks Missing</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ artist.statistics.trackTime }}
              </v-chip>
              <span>Artist Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ artist.statistics.fileSize }}
              </v-chip>
              <span>Artist Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ artist.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Artist Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ artist.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Artist Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12 sm6>
          <v-tabs class="artist-lists" color="primary" slider-color="accent">
            <v-tab v-if="artist.alternateNamesList.length">Alternate Names</v-tab>
            <v-tab v-if="artist.genres.length">Genres</v-tab>
            <v-tab v-if="artist.tagsList.length">Tags</v-tab>
            <v-tab v-if="artist.urLsList.length">Urls</v-tab>
            <v-tab-item v-if="artist.alternateNamesList.length">
              <v-list>
                <template v-for="(name, index) in artist.alternateNamesList">
                  <v-list-tile :key="`al-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < artist.alternateNamesList.length"
                    :key="`adivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="artist.genres.length">
              <v-list>
                <template v-for="(name, index) in artist.genres">
                  <v-list-tile :key="`g-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name.text }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < artist.genres.length" :key="`gdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="artist.tagsList.length">
              <v-list>
                <template v-for="(name, index) in artist.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < artist.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="artist.urLsList.length">
              <v-list>
                <template v-for="(name, index) in artist.urLsList">
                  <v-list-tile :key="`u-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a v-bind:href="name" target="_blank">{{ name }}</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < artist.urLsList.length" :key="`uaadivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
          </v-tabs>
        </v-flex>
        <v-flex d-flex xs12 sm6>
          <v-tabs class="artist-lists" color="primary" slider-color="accent">
            <v-tab v-if="artist.associatedArtists.length">Associated Artists</v-tab>
            <v-tab>Labels</v-tab>
            <v-tab-item v-if="artist.associatedArtists.length">
              <v-card flat class="labels">
                <v-data-iterator
                  :items="artist.associatedArtists"
                  :total-items="artist.associatedArtists ? artist.associatedArtists.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs4>
                    <ArtistCard :artist="props.item"></ArtistCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat class="artist-labels">
                <v-data-iterator
                  :items="artist.artistLabels"
                  :total-items="artist.artistLabels ? artist.artistLabels.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs4>
                    <LabelCard :label="props.item"></LabelCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <v-tabs class="artist-lists" color="primary" v-model="releaseTab" slider-color="accent">
            <v-tab v-if="artist.collectionsWithArtistReleases.length > 0">Collections</v-tab>
            <v-tab v-if="artist.artistContributionReleases.length > 0">Contributions</v-tab>
            <v-tab v-if="artist.playlistsWithArtistReleases.length > 0">Playlists</v-tab>
            <v-tab v-if="releases.length > 0">Releases
              <v-btn @click="showReleaseTable=true" icon>
                <v-icon
                  :color="showReleaseTable ? '' : 'accent'"
                  title="Show Release List"
                >view_list</v-icon>
              </v-btn>
              <v-btn @click="showReleaseTable=false" icon>
                <v-icon
                  :color="showReleaseTable ? 'accent' : ''"
                  title="Show Release Cards"
                >view_module</v-icon>
              </v-btn>
            </v-tab>
            <v-tab-item v-if="artist.collectionsWithArtistReleases.length > 0">
              <v-card flat class="collections">
                <v-data-iterator
                  :items="artist.collectionsWithArtistReleases"
                  :total-items="artist.collectionsWithArtistReleases ? artist.collectionsWithArtistReleases.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs4>
                    <CollectionCard :collection="props.item"></CollectionCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="artist.artistContributionReleases.length > 0">
              <v-card flat class="contributions">
                <v-data-iterator
                  :items="artist.artistContributionReleases"
                  :total-items="artist.artistContributionReleases ? artist.artistContributionReleases.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs4>
                    <ReleaseCard :release="props.item"></ReleaseCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="artist.playlistsWithArtistReleases.length > 0">
              <v-card flat class="playlists">
                <v-data-iterator
                  :items="artist.playlistsWithArtistReleases"
                  :total-items="artist.playlistsWithArtistReleases ? artist.playlistsWithArtistReleases.length : 0"
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
            <v-tab-item v-if="releases.length > 0">
              <v-card flat class="releases">
                <v-text-field
                  v-if="showReleaseTable"
                  class="ml-4 mr-4"
                  v-model="releaseTableSearch"
                  append-icon="search"
                  label="Filter"
                  single-line
                  hide-details
                ></v-text-field>
                <v-data-table
                  v-if="showReleaseTable"
                  :headers="releaseHeaders"
                  :items="releaseTableData"
                  hide-actions
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <td>
                      <router-link :to="'/release/' + props.item.id">
                        <v-img
                          :src="props.item.thumbnailUrl"
                          :alt="props.item.title"
                          width="40"
                          height="40"
                          class="mt-1 release-grid-image"
                        ></v-img>
                        <span
                          class="release-grid-title secondary--text text--lighten-1 release-title text-no-wrap text-truncate subheading font-weight-medium pointer"
                        >{{ props.item.title }}</span>
                      </router-link>
                    </td>
                    <td>{{ props.item.year }}</td>
                    <td>{{ props.item.trackCount }}</td>
                    <td>{{ props.item.duration }}</td>
                    <td>{{ props.item.rating }}</td>
                    <td>{{ props.item.rank }}</td>
                    <td>{{ props.item.lastPlayed }}</td>
                    <td>{{ props.item.playedCount }}</td>
                  </template>
                </v-data-table>

                <v-data-iterator
                  v-if="!showReleaseTable"
                  :items="releases"
                  :total-items="releases ? releases.length : 0"
                  content-tag="v-layout"
                  hide-actions
                  row
                  wrap
                >
                  <v-flex slot="item" slot-scope="props" xs3>
                    <ReleaseWithTracksCard :release="props.item"></ReleaseWithTracksCard>
                  </v-flex>
                </v-data-iterator>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
    <confirm ref="confirm"></confirm>
    <v-container v-if="!loading && !showMergingArtist && artistImageSearchItems.length > 0" fluid grid-list-md>
      <v-flex xs1 offset-xs11>
        <v-btn color="warning" @click="artistImageSearchItems = []">Cancel</v-btn>
      </v-flex>
      <v-text-field v-model="artistImageSearchQuery" label="Search Query"></v-text-field>
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        v-on:vdropzone-complete="coverDragUploadComplete"
        :options="dropzoneOptions"
      ></vue-dropzone>
      <v-data-iterator
        v-if="artistImageSearchItems"
        :items="artistImageSearchItems"
        :total-items="artistImageSearchItems ? artistImageSearchItems.length : 0"
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
              @click="selectedArtistImage(props.item.mediaUrl)"
            ></v-img>
          </div>
        </v-flex>
      </v-data-iterator>
    </v-container>
    <v-container v-if="!loading && showMergingArtist">
      <div>Select Artist To Merge "{{ this.artist.name }}" Artist into</div>
      <v-layout row>
        <v-autocomplete
          :items="lookupData.artistItems"
          v-model="selectedMergeArtist"
          :search-input.sync="searchForMergeArtist"
          :loading="searchArtistsLoading"
          label="Artist"
          append-icon="fas fa-database"
          return-object
        ></v-autocomplete>
      </v-layout>
      <v-flex xs3>
        <v-btn color="warning" @click="showMergingArtist=false">Cancel</v-btn>
        <v-btn color="success" @click="doMerge()">Merge</v-btn>
      </v-flex>
    </v-container>
    <v-container v-if="loading">
        <v-progress-linear
          v-if="loading"
          height="2"
          color="accent"
          class="ma-0 pa-0"
          indeterminate
        ></v-progress-linear>
    </v-container>    
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import LabelCard from "@/components/LabelCard";
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import CollectionCard from "@/components/CollectionCard";
import PlaylistCard from "@/components/PlaylistCard";
import ReleaseWithTracksCard from "@/components/ReleaseWithTracksCard";
import { EventBus } from "@/event-bus.js";
import store from "@/store";
import Confirm from "@/views/Confirm";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import VueMarkdown from "vue-markdown";

import artistMixin from "@/mixins/artist.js";

export default {
  store,
  mixins: [artistMixin],
  components: {
    Toolbar,
    LabelCard,
    ArtistCard,
    ReleaseCard,
    CollectionCard,
    PlaylistCard,
    ReleaseWithTracksCard,
    Confirm,
    vueDropzone: vue2Dropzone,
    VueMarkdown
  },
  props: {
    id: String
  },
  created() {
    EventBus.$on("aa:PlayAll", this.playAll);
    EventBus.$on("aa:AddAllToQue", this.addAllToQue);
    EventBus.$on("aa:PlayTopRated", this.playTopRated);
    EventBus.$on("aa:PlayMostPopular", this.playMostPopular);
    EventBus.$on("aa:searchInternetArtist", this.internetArtistSearch);
    EventBus.$on("aa:searchArtistsWithName", this.searchArtistsWithName);
    EventBus.$on("favoriteToogle", this.toggleFavorite);
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("bookmarkToogle", this.toogleBookmark);
    EventBus.$on("hateToogle", this.toggleHated);
    EventBus.$on("aa:MergeArtist", this.mergeArtist);
    EventBus.$on("aa:Rescan", this.rescan);
    EventBus.$on("aa:Delete", this.delete);
    EventBus.$on("aa:DeleteReleases", this.deleteReleases);
    EventBus.$on("aa:FindArtistImage", this.findArtistImage);
    EventBus.$on("aa:Edit", this.edit);
    this.debouncedFindartistImage = this.$_.debounce(this.findArtistImage, 800);
    this.debouncedMergeArtistSearch = this.$_.debounce(
      this.doMergeArtistSearch,
      500
    );
  },
  beforeDestroy() {
    EventBus.$off("aa:PlayAll", this.playAll);
    EventBus.$off("aa:AddAllToQue", this.addAllToQue);
    EventBus.$off("aa:PlayTopRated", this.playTopRated);
    EventBus.$off("aa:PlayMostPopular", this.playMostPopular);
    EventBus.$off("aa:searchInternetArtist", this.internetArtistSearch);
    EventBus.$off("aa:searchArtistsWithName", this.searchArtistsWithName);
    EventBus.$off("favoriteToogle", this.toggleFavorite);
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("bookmarkToogle", this.toogleBookmark);
    EventBus.$off("hateToogle", this.toggleHated);
    EventBus.$off("aa:MergeArtist", this.mergeArtist);
    EventBus.$off("aa:Rescan", this.rescan);
    EventBus.$off("aa:Delete", this.delete);
    EventBus.$off("aa:DeleteReleases", this.deleteReleases);
    EventBus.$off("aa:FindArtistImage", this.findArtistImage);
    EventBus.$off("aa:Edit", this.edit);
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    rating() {
      return this.artist.rating;
    },
    artistThumbnailUrl() {
      return this.artist.mediumThumbnail.url;
    },
    adminMenuItems() {
      let items = [];
      if(this.$store.getters.isUserEditor) {
        items.push({ title: "Edit", click: "aa:Edit" });        
        items.push({ title: "Find Artist Image", click: "aa:FindArtistImage" });
        items.push({ title: "Rescan", click: "aa:Rescan" });
      }
      if(this.$store.getters.isUserAdmin) {
        items.push({ title: "Delete", class: "warning--text", click: "aa:Delete" });
        items.push({ title: "Delete Releases", class: "warning--text", click: "aa:DeleteReleases" });
        items.push({ title: "Merge Artist", click: "aa:MergeArtist" });
      }       
      return items;          
    },
    searchQuery() {
      return this.artist.name;
    },
    playTrackLimit() {
      return 25;
    }
  },
  methods: {
    doMerge() {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/artists/mergeArtists/" +
            this.artist.id +
            "/" +
            this.selectedMergeArtist.value
        )
        .then(response => {
          if (!response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "An error has occured",
              color: "red"
            });
            return false;
          }
          this.showMergingArtist = false;          
          this.$router.push("/artist/" + this.selectedMergeArtist.value);
        });
    },
    doMergeArtistSearch: function(val) {
      if (this.loading || this.searchArtistsLoading) {
        return;
      }
      this.searchArtistsLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL + "/artists?filter=" + val + "&limit=10"
        )
        .then(res => {
          this.lookupData.artistItems = [];
          res.data.rows.forEach(a => {
            if (a.artist.value != this.id) {
              this.lookupData.artistItems.push({
                text: a.artist.text,
                value: a.artist.value
              });
            }
          });
        })
        .catch(err => {
          EventBus.$emit("showSnackbar", {
            text: "An error has occured",
            color: "red",
            error: err
          });
        })
        .finally(() => (this.searchArtistsLoading = false));
    },
    playTopRated: function() {
      EventBus.$emit("loadingStarted");
      let queTracks = [];
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/tracks?page=1&limit=${
              this.playTrackLimit
            }&sort=Rating&order=DESC&FilterToArtistId=${this.artist.id}`
        )
        .then(response => {
          queTracks = this.queTracksForTrackRows(response.data.rows);
          return this.$playQue.add(queTracks);
        })
        .then(function(result) {
          const message = result.message || "Added [" + queTracks.length + "] tracks to Que";
          EventBus.$emit("showSnackbar", { text: message });
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });                
    },
    playMostPopular: function() {
      EventBus.$emit("loadingStarted");
      let queTracks = [];
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/tracks?page=1&limit=${
              this.playTrackLimit
            }&sort=PlayedCount&order=DESC&FilterToArtistId=${this.artist.id}`
        )
        .then(response => {
          queTracks = this.queTracksForTrackRows(response.data.rows);
          return this.$playQue.add(queTracks);
        })
        .then(function(result) {
          const message = result.message || "Added [" + queTracks.length + "] tracks to Que";
          EventBus.$emit("showSnackbar", { text: message });
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });             
    },
    coverDragUploadComplete: function() {
      this.artistImageSearchItems = [];
    },
    edit: function() {
      this.$router.push("/artist/edit/" + this.artist.id);
    },
    mergeArtist: function() {
      this.showMergingArtist = true;
    },
    internetArtistSearch: function() {
      var q = this.searchQuery;
      if (this.artist.artistType === "Person") {
        q += " artist";
      } else {
        q += " band";
      }
      var url = "https://www.google.com/search?q=" + encodeURIComponent(q);
      window.open(url, "_blank");
    },
    searchArtistsWithName: function() {
      this.$router.push({ name: "search", params: { q: 'a: ' + this.artist.name } });
    },
    queTracksForTrackRows(trackRows) {
      let queTracks = [];
      trackRows.forEach(tr => {
        let artist = tr.trackArtist || tr.artist;
        let queTrack = {
          id: tr.id,
          mediaNumber: tr.mediaNumber,
          trackNumber: tr.trackNumber,
          title: tr.title,
          duration: tr.duration,
          durationTime: tr.durationTime,
          rating: tr.rating,
          playedCount: tr.playedCount,
          trackPlayUrl: tr.trackPlayUrl,
          release: {
            text: tr.release.release.text,
            value: tr.release.release.value,
            releaseDate: tr.release.releaseDate
          },
          artist: artist,
          releaseArtist: tr.artist,
          releaseImageUrl: tr.release.thumbnail.url,
          artistImageUrl: artist.thumbnail.url,
          userRating: tr.userRating || { rating: 0 }
        };
        queTracks.push(queTrack);
      });
      return queTracks;
    },
    addAllToQue: function() {
      EventBus.$emit("loadingStarted");
      let queTracks = [];
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            "/tracks?page=1&limit=500&FilterToArtistId=" +
            this.artist.id
        )
        .then(response => {
          queTracks = this.queTracksForTrackRows(response.data.rows);
          return this.$playQue.add(queTracks);
        })
        .then(function(result) {
          const message = result.message || "Added [" + queTracks.length + "] to Que";
          EventBus.$emit("showSnackbar", { text: message });
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });                   
    },
    playAll: function() {
      this.$playQue.deleteAll()
      .then(() => {
        this.addAllToQue();
      });
    },
    rescan: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          process.env.VUE_APP_API_URL + "/admin/scan/artist/" + this.artist.id
        )
        .then(() => {
          this.updateData();
        });
    },
    delete: async function() {
      let artistId = this.artist.id;
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                process.env.VUE_APP_API_URL + "/admin/delete/artist/" + artistId
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },
    deleteReleases: async function() {
      let artistId = this.artist.id;
      this.$refs.confirm
        .open("Delete", "Continue to delete all Releases for Artist?", {
          color: "red"
        })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                process.env.VUE_APP_API_URL +
                  "/admin/delete/artist/releases/" +
                  artistId
              )
              .then(this.updateData);
          }
        });
    },
    setRating: async function() {
      this.$nextTick(() => {
        this.artistRatingChange({
          artistId: this.artist.id,
          newVal: this.artist.userRating.rating
        }).then(this.updateData);
      });
    },
    toggleFavorite: async function() {
      this.artistFavoriteToggle({
        artistId: this.artist.id,
        isFavorite: this.artist.userRating
          ? !this.artist.userRating.isFavorite
          : true
      }).then(this.updateData);
    },
    toggleHated: async function() {
      this.artistDislikeToggle({
        artistId: this.artist.id,
        isDisliked: this.artist.userRating
          ? !this.artist.userRating.isDisliked
          : true
      }).then(this.updateData);
    },
    showImageModal: function(e) {
      this.modalImage = e;
      this.showModal = true;
    },
    toogleBookmark: async function() {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/users/setArtistBookmark/" +
            this.artist.id +
            "/" +
            !this.artist.userBookmarked
        )
        .then(response => {
          if (!this.artist.userBookmarked) {
            EventBus.$emit("showSnackbar", { text: "Successfully bookmarked" });
          } else if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "Successfully removed bookmark"
            });
          }
          this.artist.userBookmarked = !this.artist.userBookmarked;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateData: async function() {
      this.loading = true;
      this.artistImageSearchQuery = null;
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/artists/${this.id}`)
        .then(response => {
          this.artist = response.data.data;
          this.artist.genres = this.artist.genres || [];
          this.artist.alternateNamesList = this.artist.alternateNamesList || [];
          this.artist.images = this.artist.images || [];
          this.artist.associatedArtists = this.artist.associatedArtists || [];
          this.artist.alternateNamesList = this.artist.alternateNamesList || [];
          this.artist.genres = this.artist.genres || [];
          this.artist.collectionsWithArtistReleases =
            this.artist.collectionsWithArtistReleases || [];
          this.artist.playlistsWithArtistReleases =
            this.artist.playlistsWithArtistReleases || [];
          this.artist.artistContributionReleases =
            this.artist.artistContributionReleases || [];
          this.artist.artistLabels = this.artist.artistLabels || [];
          this.artist.tagsList = this.artist.tagsList || [];
          this.artist.urLsList = this.artist.urLsList || [];
          this.artist.userRating = this.artist.userRating || {
            rating: 0,
            isFavorite: false,
            isDisliked: false
          };
          this.$axios
            .get(
              process.env.VUE_APP_API_URL +
                `/releases?filterToArtistId=${this.id}&inc=tracks&limit=500`
            )
            .then(rr => {
              this.releases = rr.data.rows;
              this.releaseTableData = [];
              rr.data.rows.forEach(r => {
                this.releaseTableData.push({
                  id: r.id,
                  thumbnailUrl: r.thumbnail.url,
                  title: r.release.text,
                  year: parseInt(r.releaseYear),
                  trackCount: r.trackCount,
                  duration: r.durationTime,
                  rating: r.rating,
                  rank: r.rank,
                  lastPlayed: this.$options.filters.formatTimeStamp(
                    r.lastPlayed,
                    this.$store.getters.user
                  ),
                  playedCount: r.trackPlayedCount
                });
              });
              let tabIndex = 0;
              if (this.artist.collectionsWithArtistReleases.length > 0) {
                tabIndex++;
              }
              if (this.artist.artistContributionReleases.length > 0) {
                tabIndex++;
              }
              if (this.artist.playlistsWithArtistReleases.length > 0) {
                tabIndex++;
              }
              this.releaseTab = tabIndex;
              this.selectedMergeArtist = this.artist.name;
              EventBus.$emit("loadingComplete");
            });
        })
        .finally(() => {
          this.dropzoneOptions.url =
            process.env.VUE_APP_API_URL +
            "/artists/uploadImage/" +
            this.artist.id;
          this.dropzoneOptions.headers = {
            Authorization: "Bearer " + this.$store.getters.authToken
          };
          this.$nextTick(() => {
            document.title = this.artist.name;
            setTimeout(function() {
              var image = document.getElementById("artistImage");
              window.favIcon.image(image);
            }, 500);
            this.loading = false;            
          });
        });
    },
    shortDateWithAge: function(date, toDate) {
      return (
        this.$options.filters.shortDate(date) +
        " (" +
        this.$options.filters.yearsFromDate(toDate, date) +
        ")"
      );
    },
    metaDataSources: function() {
      return [
        {
          source: "All Music",
          sourceId: this.artist.amgId,
          url: "https://www.allmusic.com/artist/"
        },
        {
          source: "Discogs",
          sourceId: this.artist.discogsId,
          url: "https://www.discogs.com/artist/"
        },
        {
          source: "iTunes",
          sourceId: this.artist.iTunesId,
          url: "https://itunes.apple.com/artist/id"
        },
        {
          source: "MusicBrainz",
          sourceId: this.artist.musicBrainzId,
          url: "https://musicbrainz.org/artist/"
        },
        {
          source: "Spotify",
          sourceId: this.artist.spotifyId,
          url: "https://open.spotify.com/artist/"
        }
      ];
    },
    selectedArtistImage: function(imageUrl) {
      this.artistImageSearchItems = [];
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/artists/setImageByUrl/" +
            this.artist.id +
            "/" +
            encodeURIComponent(imageUrl)
        )
        .then(response => {
          if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "Successfully updated Artist image."
            });
            this.$nextTick(() => {
              this.artist.mediumThumbnail.url = response.data.data.url;
            });
          }
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    findArtistImage: async function() {
      if(this.loading) {
        return;
      }
      EventBus.$emit("loadingStarted");
      this.artistImageSearchQuery = this.artistImageSearchQuery || this.artist.name;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/images/search/artist/" +
            encodeURIComponent(this.artistImageSearchQuery) +
            "/25"
        )
        .then(response => {
          this.artistImageSearchItems = response.data.data;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    artistImageSearchQuery: function() {
      if(!this.loading) {
        this.debouncedFindartistImage();
      }
    },
    searchForMergeArtist(val) {
      if (!val) {
        return;
      }
      this.debouncedMergeArtistSearch(val);
    },
    releaseTableSearch: {
      async handler() {
        this.releaseTableData = [];
        this.releases.forEach(r => {
          if (
            !this.releaseTableSearch ||
            r.release.text
              .toLowerCase()
              .includes(this.releaseTableSearch.toLowerCase()) ||
            r.releaseYear.includes(this.releaseTableSearch)
          ) {
            this.releaseTableData.push({
              id: r.id,
              thumbnailUrl: r.thumbnail.url,
              title: r.release.text,
              year: parseInt(r.releaseYear),
              trackCount: r.trackCount,
              duration: r.durationTime,
              rating: r.rating,
              lastPlayed: this.$options.filters.formatTimeStamp(
                r.lastPlayed,
                this.$store.getters.user
              ),
              playedCount: r.trackPlayedCount
            });
          }
        });
      }
    }
  },
  data: () => ({
    loading: true,
    showReleaseTable: false,
    searchArtistsLoading: false,
    selectedMergeArtist: null,
    searchForMergeArtist: null,
    tab: 0,
    releaseTab: 0,
    showMergingArtist: false,
    showModal: false,
    modalImage: {},
    artistImageSearchQuery: "",
    artistImageSearchItems: [],
    artist: {
      mediumThumbnail: {},
      userRating: {},
      statistics: {},
      images: [],
      associatedArtists: [],
      alternateNamesList: [],
      genres: [],
      collectionsWithArtistReleases: [],
      playlistsWithArtistReleases: [],
      artistContributionReleases: [],
      artistLabels: [],
      tagsList: [],
      urLsList: [],
      profile: null,
      bioContext: null
    },
    lookupData: {
      artistItems: []
    },
    releases: [],
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
      {
        title: "Add All To Que",
        class: "hidden-xs-only",
        click: "aa:AddAllToQue"
      },
      { title: "Play All", class: "hidden-xs-only", click: "aa:PlayAll" },
      {
        title: "Play Top Rated",
        class: "hidden-xs-only",
        click: "aa:PlayTopRated"
      },
      {
        title: "Play Most Popular",
        class: "hidden-xs-only",
        click: "aa:PlayMostPopular"
      }
    ],
    seachMenuItems: [
      { title: "Search Artists with Name", click: "aa:searchArtistsWithName" },
      { title: "Internet Artist Name", click: "aa:searchInternetArtist" }
    ],
    releaseTableSearch: "",
    releaseHeaders: [
      { text: "Title", align: "left", value: "title" },
      { text: "Year", value: "year" },
      { text: "Tracks", value: "trackCount" },
      { text: "Time", value: "duration" },
      { text: "Avg Rating", value: "rating" },
      { text: "Rank", value: "rank" },
      { text: "Last Played", value: "lastPlayed" },
      { text: "Played Count", value: "playedCount" }
    ],
    releaseTableData: [],
    dropzoneOptions: {
      thumbnailWidth: 100,
      maxFilesize: 0.5,
      dictDefaultMessage:
        "<i class='fa fa-cloud-upload'></i>Upload new Artist image"
    }
  })
};
</script>

<style>
.v-rating.artist-rating {
  width: 100%;
}
.artist-detail-container .bio,
.artist-detail-container .profile {
  max-height: 350px;
  overflow: auto;
}
.artist-detail-container .v-card__title {
  padding-top: 9px;
  padding-bottom: 9px;
}
.artist-detail-container .images-container {
  max-height: 313px;
  overflow: hidden;
  overflow-y: auto;
}
.artist-detail-container .biography p {
  max-height: 266px;
}
.artist-detail-container .artist-lists .v-list {
  max-height: 300px;
  overflow: auto;
}
.artist-detail-container .release-grid-image {
  float: left;
  margin-right: 6px;
}
.artist-detail-container .release-grid-title {
  padding-top: 11px;
  display: inline-block;
}
.artist-detail-container .biography,
.artist-detail-container .profile {
  max-height: 290px;
  overflow: auto;
}
ul.metadataSources {
  list-style: none;
  padding: 0;
}
ul.data-tokens li {
  border: 1px solid;
  padding: 2px 5px;
  margin: 3px;
  border-radius: 5px;
  text-overflow: ellipsis;
  overflow: hidden;
}
ul.metadataSources span.key {
  float: right;
}
img.modal-image {
  max-height: 800px;
  overflow: hidden;
  max-width: 100%;
}
</style>
