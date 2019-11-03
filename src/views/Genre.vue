<template>
  <div class="genre-detail-container">
    <Toolbar :menuItems="menuItems" :adminItems="adminMenuItems" :toolbarIcon="'category'"></Toolbar>
    <v-container v-if="!loading && !showMergingGenre && genreImageSearchItems.length === 0" fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="darken-1">
                <v-card-text class="title">
                  {{ genre.name }}
                  <v-icon
                    v-if="genre.isLocked"
                    style="float: right;"
                    title="Genre is locked!"
                    color="warning"
                  >lock</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img 
                  :src="genreThumbnailUrl" 
                  :alt="genre.name" 
                  class="ma-1" 
                  aspect-ratio="1"
                  lazy-src="data:image/jpg;base64,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"                  
                  ></v-img>
                  <img id="genreImage" :src="genreThumbnailUrl" style="display:none;" />
                </v-flex>
                <v-flex xs9 class="title">
                  <v-text-field
                    v-if="genre.normalizedName"
                    v-bind:value="genre.normalizedName"
                    label="Normalized Name"
                    readonly
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-text-field
                        v-bind:value="genre.statusVerbose"
                        label="Genre Status"
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
          <v-tabs right color="primary" slider-color="accent">
            <v-tab v-if="genre.description">Description</v-tab>
            <v-tab v-if="genre.alternateNamesList.length">Alternate Names</v-tab>
            <v-tab v-if="genre.tagsList.length > 0">Tags</v-tab>
            <v-tab-item v-if="genre.description">
              <v-card flat class="profile darken-3">
                <vue-markdown>{{genre.description}}</vue-markdown>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="genre.alternateNamesList.length">
              <v-list>
                <template v-for="(name, index) in genre.alternateNamesList">
                  <v-list-tile :key="`al-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < genre.alternateNamesList.length"
                    :key="`adivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="genre.tagsList.length > 0">
              <v-list>
                <template v-for="(name, index) in genre.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < genre.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="stats-container">
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>fas fa-users</v-icon>
                </v-avatar>
                {{ genre.statistics.artistCount | padNumber4 }}
              </v-chip>
              <span>Genre Artist Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>library_music</v-icon>
                </v-avatar>
                {{ genre.statistics.releaseCount | padNumber4 }}
              </v-chip>
              <span>Genre Release Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ genre.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Genre Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ genre.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Genre Updated Date</span>
            </v-tooltip>            
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <v-card v-if="artistItems.length > 0">
            <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text">
              <v-icon class="mr-2">fas fa-users</v-icon>Artists
            </v-card-title>
            <v-card-text>
              <v-data-iterator
                :items="artistItems"
                :rows-per-page-items="this.$store.getters.rowsPerPageItems"
                :hide-actions="artistPagination.totalItems < artistPagination.rowsPerPage"
                :total-items="artistPagination.totalItems"
                :pagination.sync="artistPagination"
                content-tag="v-layout"
                :loading="true"
                row
                wrap
              >
                <v-flex slot="item" slot-scope="props" xs12 sm6 lg3>
                  <ArtistCard :artist="props.item"></ArtistCard>
                </v-flex>
              </v-data-iterator>
            </v-card-text>
          </v-card>         
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <v-card v-if="releaseItems.length > 0">
            <v-card-title class="pa-0 ma-0 pt-2 pl-3 subheading accent--text">
              <v-icon class="mr-2">library_music</v-icon>Releases
            </v-card-title>
            <v-card-text>
              <v-data-iterator
                :items="releaseItems"
                :rows-per-page-items="this.$store.getters.rowsPerPageItems"
                :hide-actions="releasePagination.totalItems < releasePagination.rowsPerPage"
                :total-items="releasePagination.totalItems"
                :pagination.sync="releasePagination"
                content-tag="v-layout"
                :loading="true"
                row
                wrap
              >
                <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
                  <ReleaseCard :release="props.item"></ReleaseCard>
                </v-flex>
              </v-data-iterator>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>      
    </v-container>

    <confirm ref="confirm"></confirm>
    <v-container v-if="!loading && genreImageSearchItems.length > 0" fluid grid-list-md>
      <v-flex xs1 offset-xs11>
        <v-btn color="warning" @click="genreImageSearchItems = []">Cancel</v-btn>
      </v-flex>
      <v-text-field v-model="genreImageSearchQuery" label="Search Query"></v-text-field>
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        v-on:vdropzone-complete="coverDragUploadComplete"
        :options="dropzoneOptions"
      ></vue-dropzone>
      <v-data-iterator
        v-if="genreImageSearchItems"
        :items="genreImageSearchItems"
        :total-items="genreImageSearchItems ? genreImageSearchItems.length : 0"
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
              @click="selectedGenreImage(props.item.mediaUrl)"
            ></v-img>
          </div>
        </v-flex>
      </v-data-iterator>
    </v-container> 


    <v-container v-if="!loading && showMergingGenre">
      <div>Select Genre To Merge "{{ this.genre.name }}" Genre into</div>
      <v-layout row>
        <v-autocomplete
          :items="lookupData.genresItems"
          v-model="selectedMergeGenre"
          :search-input.sync="selectedMergeGenre"
          :loading="selectedMergeGenre"
          label="Genre"
          append-icon="fas fa-database"
          return-object
        ></v-autocomplete>
      </v-layout>
      <v-flex xs3>
        <v-btn color="warning" @click="showMergingGenre=false">Cancel</v-btn>
        <v-btn color="success" @click="doMerge()">Merge</v-btn>
      </v-flex>
    </v-container>
    <v-container v-if="loading">
      <v-progress-linear v-if="loading" height="2" color="accent" class="ma-0 pa-0" indeterminate></v-progress-linear>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import Confirm from "@/views/Confirm";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import VueMarkdown from "vue-markdown";

import { EventBus } from "@/event-bus.js";
export default {
  components: {
    Toolbar,
    ArtistCard,
    Confirm,
    ReleaseCard,
    vueDropzone: vue2Dropzone,
    "vue-markdown": VueMarkdown
  },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("g:Delete", this.delete);
    EventBus.$on("g:Edit", this.edit);
    EventBus.$on("g:MergeGenre", this.mergeGenre);
    EventBus.$on("g:FindGenreImage", this.findGenreImage);  
    this.debouncedFindGenreImage = this.$_.debounce(this.findGenreImage, 800);      
    this.debouncedMergeGenreSearch = this.$_.debounce(
      this.doMergeGenreSearch,
      500
    );    

  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("g:Delete", this.delete);
    EventBus.$off("g:Edit", this.edit);
    EventBus.$off("g:MergeGenre", this.mergeGenre);
    EventBus.$off("g:FindGenreImage", this.findGenreImage);   
    EventBus.$off("g:MergeGenre", this.mergeGenre);    
  },
  async mounted() {
    this.updateData();
  },
  methods: {
    addToQue: function() {},
    mergeGenre: function() {
      this.showMergingGenre = true;
    },
    coverDragUploadComplete: function() {
      this.genreImageSearchItems = [];
    },     
    findGenreImage: async function() {
      EventBus.$emit("loadingStarted");
      this.genreImageSearchQuery = this.genreImageSearchQuery || this.genre.name;
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/images/search/genre/" +
            encodeURIComponent(this.genreImageSearchQuery) +
            "/25"
        )
        .then(response => {
          this.genreImageSearchItems = response.data.data;
          if(this.genreImageSearchItems.length == 0) {
            this.genreImageSearchItems = [ "No Results "];
          }           
          setTimeout(function() {
            var image = document.getElementById("genreImage");
            window.favIcon.image(image);
          }, 500);          
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },     
    selectedGenreImage: function(imageUrl) {
      this.genreImageSearchItems = [];
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/genres/setImageByUrl/" +
            this.genre.id +
            "/" +
            encodeURIComponent(imageUrl)
        )
        .then(response => {
          if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "Successfully updated Genre image."
            });
            this.$nextTick(() => {
              this.genre.mediumThumbnail.url = response.data.data.url;
              setTimeout(function() {
                var image = document.getElementById("genreImage");
                window.favIcon.image(image);
              }, 500);               
            });
          }
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },       
    doMerge() {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/genres/mergeGenres/" +
            this.genre.id +
            "/" +
            this.selectedMergeGenre.value
        )
        .then(response => {
          if (!response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "An error has occured",
              color: "red"
            });
            return false;
          }
          this.showMergingGenre = false;
          this.$router.push("/genre/" + this.selectedMergeGenre.value);
        });
    },
    doMergeGenreSearch: function(val) {
      if (this.searchGenreLoading) {
        return;
      }
      this.searchGenreLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL + "/genres?filter=" + val + "&limit=10"
        )
        .then(res => {
          this.lookupData.genresItems = [];
          res.data.rows.forEach(g => {
            if (g.genre.value != this.id) {
              this.lookupData.genresItems.push({
                text: g.genre.text,
                value: g.genre.value
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
        .finally(() => (this.searchGenreLoading = false));
    },
    shortDateWithAge: function(date, toDate) {
      return (
        this.$options.filters.shortDate(date) +
        " (" +
        this.$options.filters.yearsFromDate(toDate, date) +
        ")"
      );
    },
    edit: function() {
      this.$router.push("/genre/edit/" + this.genre.id);
    },
    delete: async function() {
      let genrelId = this.genre.id;
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                process.env.VUE_APP_API_URL + "/admin/delete/genre/" + genrelId
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },
    updateData: async function() {
      this.loading = true;
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/genres/${this.id}`)
        .then(response => {
          this.genre = response.data.data;
          this.genre.alternateNamesList = this.genre.alternateNamesList || [];
          this.genre.tagsList = this.genre.tagsList || [];
          this.genre.urLsList = this.genre.urLsList || [];
        })
        .then(() => {
          this.updateArtistData();
          this.updateReleaseData();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updateArtistData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/artists?page=${this.artistPagination.page}&limit=${this.artistPagination.rowsPerPage}&order=${this.artistPagination.sortOrder}&sort=${this.artistPagination.sortBy}&filterToGenreId=${this.id}`
        )
        .then(response => {
          this.artistItems = response.data.rows;
          this.artistPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateReleaseData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/releases?page=${this.releasePagination.page}&limit=${this.releasePagination.rowsPerPage}&order=${this.releasePagination.sortOrder}&sort=${this.releasePagination.sortBy}&filterToGenreId=${this.id}`
        )
        .then(response => {
          this.releaseItems = response.data.rows;
          this.releasePagination.totalItems = response.data.totalCount;
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
    genreImageSearchQuery: function() {
      this.debouncedFindGenreImage();
    },      
    artistPagination: {
      async handler() {
        this.updateArtistData();
      }
    },
    releasePagination: {
      async handler() {
        this.updateReleaseData();
      }
    }
  },
  computed: {
    genreThumbnailUrl() {
      return this.genre.mediumThumbnail.url; // + "?ts=" + new Date().getTime();
    },
    adminMenuItems() {
      return !this.$store.getters.isUserAdmin
        ? []
        : [
            {
              title: "Delete",
              icon: "delete",
              class: "warning--text",
              click: "g:Delete"
            },
            { title: "Edit", icon: "create", click: "g:Edit" },
            { title: "Find Genre Thumbnail", icon: "photo_library", click: "g:FindGenreImage" },            
            {
              title: "Merge with another Genre",
              icon: "call_merge",
              click: "g:MergeGenre"
            }
          ];
    }
  },
  data: () => ({
    loading: true,
    showMergingGenre: false,
    genreImageSearchQuery: "",
    genreImageSearchItems: [],    
    searchGenreLoading: false,
    selectedMergeGenre: null,
    searchForMergeGenre: null,     
    genre: {
      mediumThumbnail: {},
      statistics: {},
      alternateNamesList: [],
      tagsList: []
    },
    artistPagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "Artist.Text",
      sortOrder: "ASC"
    },
    releasePagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "Artist.Text",
      sortOrder: "ASC"
    },
    menuItems: [],
    artistItems: [],
    releaseItems: [],
    dropzoneOptions: {
      thumbnailWidth: 100,
      maxFilesize: 5,
      dictDefaultMessage:
        "<i class='fa fa-cloud-upload'></i>Upload new Genre image"
    }     
  })
};
</script>


<style>
</style>
