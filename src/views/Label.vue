<template>
  <div class="label-detail-container">
    <Toolbar 
      :menuItems="menuItems" 
      :searchItems="seachMenuItems"
      :bookmarked="label.userBookmarked"
      :doShowBookmark="true"      
      :adminItems="adminMenuItems" 
      :toolbarIcon="'label'">
    </Toolbar>
    <v-container v-if="!showMergingLabel && labelImageSearchItems.length === 0" fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="darken-1">
                <v-card-text class="title">
                  {{ label.name }}
                  <v-icon
                    v-if="label.isLocked"
                    style="float: right;"
                    title="Label is locked!"
                    color="warning"
                  >lock</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img :src="labelThumbnailUrl" :alt="label.name" class="ma-1" aspect-ratio="1"></v-img>
                  <img id="labelImage" :src="labelThumbnailUrl" style="display:none;">                  
                </v-flex>
                <v-flex xs9 class="title">
                  <v-text-field
                    v-if="label.sortName"
                    v-bind:value="label.sortName"
                    label="Sort Name"
                    readonly
                  ></v-text-field>
                  <v-layout row wrap>
                    <v-flex xs2>
                      <v-text-field v-bind:value="label.statusVerbose" label="Label Status" readonly></v-text-field>
                    </v-flex>                    
                    <v-flex xs4 v-if="label.beginDate">
                      <v-text-field
                        v-bind:value="shortDateWithAge(label.beginDate)"
                        label="Begin Date"
                        readonly
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs4 v-if="label.endDate">
                      <v-text-field
                        v-bind:value="shortDateWithAge(label.endDate)"
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
          <v-tabs right color="primary" slider-color="accent">
            <v-tab v-if="label.profile">Profile</v-tab>
            <v-tab v-if="label.alternateNamesList.length">Alternate Names</v-tab>            
            <v-tab v-if="label.tagsList.length > 0">Tags</v-tab>
            <v-tab v-if="label.urLsList.length">Urls</v-tab>
            <v-tab>Metadata Sources</v-tab>
            <v-tab-item v-if="label.profile">
              <v-card flat class="profile darken-3">
                <vue-markdown>{{label.profile}}</vue-markdown>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="label.alternateNamesList.length">
              <v-list>
                <template v-for="(name, index) in label.alternateNamesList">
                  <v-list-tile :key="`al-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < label.alternateNamesList.length"
                    :key="`adivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>            
            <v-tab-item v-if="label.tagsList.length > 0">
              <v-list>
                <template v-for="(name, index) in label.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < label.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="label.urLsList.length">
              <v-list>
                <template v-for="(name, index) in label.urLsList">
                  <v-list-tile :key="`u-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a v-bind:href="name" rel="noopener noreferrer" target="_blank">{{ name }}</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < label.urLsList.length" :key="`uaadivider-${index}`"></v-divider>
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
                <v-avatar>
                  <v-icon>fas fa-users</v-icon>
                </v-avatar>
                {{ label.statistics.artistCount | padNumber4 }}
              </v-chip>
              <span>Label Artist Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>library_music</v-icon>
                </v-avatar>
                {{ label.statistics.releaseCount | padNumber4 }}
              </v-chip>
              <span>Label Release Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>audiotrack</v-icon>
                </v-avatar>
                {{ label.statistics.trackCount | padNumber5 }}
              </v-chip>
              <span>Label Track Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ label.statistics.trackSize }}
              </v-chip>
              <span>Label Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ label.statistics.fileSize }}
              </v-chip>
              <span>Label Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ label.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Label Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ label.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Label Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-container fluid grid-list-md>
        <v-card flat class="artists mt-2">
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
        </v-card>
      </v-container>
    </v-container>
    <confirm ref="confirm"></confirm>    
    <v-container v-if="!loading && labelImageSearchItems.length > 0" fluid grid-list-md>
      <v-flex xs1 offset-xs11>
        <v-btn color="warning" @click="labelImageSearchItems = []">Cancel</v-btn>
      </v-flex>
      <v-text-field v-model="labelImageSearchQuery" label="Search Query"></v-text-field>
      <vue-dropzone
        ref="myVueDropzone"
        id="dropzone"
        v-on:vdropzone-complete="coverDragUploadComplete"
        :options="dropzoneOptions"
      ></vue-dropzone>
      <v-data-iterator
        v-if="labelImageSearchItems"
        :items="labelImageSearchItems"
        :total-items="labelImageSearchItems ? labelImageSearchItems.length : 0"
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
              @click="selectedLabelImage(props.item.mediaUrl)"
            ></v-img>
          </div>
        </v-flex>
      </v-data-iterator>
    </v-container>   
    <v-container v-if="!loading && showMergingLabel">
      <div>Select Label To Merge "{{ this.label.name }}" Label into</div>
      <v-layout row>
        <v-autocomplete
          :items="lookupData.labelsItems"
          v-model="selectedMergeLabel"
          :search-input.sync="searchForMergeLabel"
          :loading="searchLabelLoading"
          label="Label"
          append-icon="fas fa-database"
          return-object
        ></v-autocomplete>
      </v-layout>
      <v-flex xs3>
        <v-btn color="warning" @click="showMergingLabel=false">Cancel</v-btn>
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
import ArtistCard from "@/components/ArtistCard";
import Confirm from "@/views/Confirm";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import VueMarkdown from "vue-markdown";

import { EventBus } from "@/event-bus.js";
import getEnv from '@/utils/env.js';

export default {
  components: { Toolbar, ArtistCard, Confirm,     vueDropzone: vue2Dropzone, 'vue-markdown': VueMarkdown },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("l:Delete", this.delete);
    EventBus.$on("l:FindLabelImage", this.findLabelImage);
    EventBus.$on("l:Edit", this.edit);    
    EventBus.$on("l:MergeLabel", this.mergeLabel);
    EventBus.$on("l:searchForLabel", this.searchForLabel);    
    EventBus.$on("l:searchInternetName", this.internetNameSearch);    
    EventBus.$on("bookmarkToogle", this.toggleBookmark);
    this.debouncedFindLabelImage = this.$_.debounce(this.findLabelImage, 800);
    this.debouncedMergeLabelSearch = this.$_.debounce(
      this.doMergeLabelSearch,
      500
    );    
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("l:Delete", this.delete);
    EventBus.$off("l:FindLabelImage", this.findLabelImage);
    EventBus.$off("l:Edit", this.edit);        
    EventBus.$off("l:MergeLabel", this.mergeLabel);
    EventBus.$off("l:searchForLabel", this.searchForLabel);    
    EventBus.$off("l:searchInternetName", this.internetNameSearch);    
    EventBus.$off("bookmarkToogle", this.toggleBookmark);
  },
  async mounted() {
    this.updateData();
  },
  methods: {
    toggleBookmark: async function() {
      this.$axios
        .post(
          getEnv('ROADIE_API_URL') +
            "/users/setLabelBookmark/" +
            this.label.id +
            "/" +
            !this.label.userBookmarked
        )
        .then(response => {
          if (!this.label.userBookmarked) {
            EventBus.$emit("showSnackbar", { text: "Successfully bookmarked" });
          } else if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "Successfully removed bookmark"
            });
          }
          this.label.userBookmarked = !this.label.userBookmarked;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },       
    addToQue: function() {},
    mergeLabel: function() {
      this.showMergingLabel = true;
    },     
    internetNameSearch: function() {
      return this.internetSearch(this.searchQuery + " record label");
    },    
    internetSearch: function(q) {
      var url = "https://www.google.com/search?q=" + encodeURIComponent(q);
      window.open(url, "_blank");
    },    
    searchForLabel: function() {
      this.$router.push({
        name: "search",
        params: { q: 'l: ' + this.label.name }
      });
    },    
    doMerge() {
      this.$axios
        .post(
          getEnv('ROADIE_API_URL') +
            "/labels/mergeLabels/" +
            this.label.id +
            "/" +
            this.selectedMergeLabel.value
        )
        .then(response => {
          if (!response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "An error has occured",
              color: "red"
            });
            return false;
          }
          this.showMergingLabel = false; 
          this.$router.push("/label/" + this.selectedMergeLabel.value);
        });
    },    
    doMergeLabelSearch: function(val) {
      if (this.searchLabelLoading) {
        return;
      }
      this.searchLabelLoading = true;
      this.$axios
        .get(
          getEnv('ROADIE_API_URL') + "/labels?filter=" + encodeURIComponent(val) + "&limit=10"
        )
        .then(res => {
          this.lookupData.labelsItems = [];
          res.data.rows.forEach(l => {
            if (l.label.value != this.id) {
              this.lookupData.labelsItems.push({
                text: l.label.text,
                value: l.label.value
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
        .finally(() => (this.searchLabelLoading = false));
    },    
    shortDateWithAge: function(date, toDate) {
      return (
        this.$options.filters.shortDate(date) +
        " (" +
        this.$options.filters.yearsFromDate(toDate, date) +
        ")"
      );
    },    
    coverDragUploadComplete: function() {
      this.labelImageSearchItems = [];
    },    
    edit: function() {
      this.$router.push("/label/edit/" + this.label.id);
    },    
    delete: async function() {
      let labelId = this.label.id;
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                getEnv('ROADIE_API_URL') + "/admin/delete/label/" + labelId
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },    
    selectedLabelImage: function(imageUrl) {
      this.labelImageSearchItems = [];
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          getEnv('ROADIE_API_URL') +
            "/labels/setImageByUrl/" +
            this.label.id +
            "/" +
            encodeURIComponent(imageUrl)
        )
        .then(response => {
          if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "Successfully updated Label image."
            });
            this.$nextTick(() => {
              this.label.mediumThumbnail.url = response.data.data.url;
              setTimeout(function() {
                var image = document.getElementById("labelImage");
                window.favIcon.image(image);
              }, 500);               
            });
          }
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },    
    findLabelImage: async function() {
      EventBus.$emit("loadingStarted");
      this.labelImageSearchQuery =
        this.labelImageSearchQuery || this.label.name;
      this.$axios
        .post(
          getEnv('ROADIE_API_URL') +
            "/images/search/label/" +
            encodeURIComponent(this.labelImageSearchQuery) +
            "/25"
        )
        .then(response => {
          this.labelImageSearchItems = response.data.data;
          if(this.labelImageSearchItems.length == 0) {
            this.labelImageSearchItems = [ "No Results "];
          }                     
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },    
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(getEnv('ROADIE_API_URL') + `/labels/${this.id}`)
        .then(response => {
          this.label = response.data.data;
          this.label.alternateNamesList = this.label.alternateNamesList || [];
          this.label.tagsList = this.label.tagsList || [];
          this.label.urLsList = this.label.urLsList || [];
          this.loading = false;
        })
        .finally(() => {
          this.dropzoneOptions.url =
            getEnv('ROADIE_API_URL') +
            "/labels/uploadImage/" +
            this.label.id;
          this.dropzoneOptions.headers = {
            Authorization: "Bearer " + this.$store.getters.authToken
          };          
          this.$nextTick(() => {
            document.title = this.label.name;
            setTimeout(function() {
              var image = document.getElementById("labelImage");
              window.favIcon.image(image);
            }, 500);
          });
        });
    },
    updateArtistData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(
          getEnv('ROADIE_API_URL') +
            `/artists?page=${this.artistPagination.page}&limit=${
              this.artistPagination.rowsPerPage
            }&order=${this.artistPagination.sortOrder}&sort=${
              this.artistPagination.sortBy
            }&filterToLabelId=${this.id}`
        )
        .then(response => {
          this.artistItems = response.data.rows;
          this.artistPagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    metaDataSources: function() {
      return [
        {
          source: "Discogs",
          sourceId: this.label.discogsId,
          url: "https://discogs.com/label/"
        },        
        {
          source: "MusicBrainz",
          sourceId: this.label.musicBrainzId,
          url: "https://musicbrainz.org/label/"
        }
      ];
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    labelImageSearchQuery: function() {
      this.debouncedFindLabelImage();
    },    
    artistPagination: {
      async handler() {
        this.updateArtistData();
      }
    },
    searchForMergeLabel(val) {
      if (!val) {
        return;
      }
      this.debouncedMergeLabelSearch(val);
    }    
  },
  computed: {
    searchQuery() {
      return this.label.name;
    },       
    labelThumbnailUrl() {
      return this.label.mediumThumbnail.url; // + "?ts=" + new Date().getTime();
    },    
    adminMenuItems() {
      return !this.$store.getters.isUserAdmin
        ? []
        : [
            { title: "Delete", icon: "delete", class: "warning--text", click: "l:Delete" },                      
            { title: "Edit",icon: "create", click: "l:Edit" },
            { title: "Find Label Thumbnail", icon: "photo_library", click: "l:FindLabelImage" },
            { title: "Merge with another Label", icon: "call_merge", click: "l:MergeLabel" },            
        ];
    },    
  },
  data: () => ({
    loading: true,
    labelImageSearchQuery: "",
    labelImageSearchItems: [],    
    showMergingLabel: false,
    searchLabelLoading: false,
    selectedMergeLabel: null,
    searchForMergeLabel: null,    
    lookupData: {
      labelsItems: []
    },    
    label: {
      maintainer: {
        thumbnail: {},
        user: {}
      },
      mediumThumbnail: {},
      statistics: {},
      alternateNamesList: [],
      tagsList: [],
      urLsList: []
    },
    artistPagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "Artist.Text",
      sortOrder: "ASC"
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
    menuItems: [],
    artistItems: [],
    seachMenuItems: [
      { title: "Search for Label",  click: "l:searchForLabel" },
      { title: "Internet Name", click: "l:searchInternetName" }
    ],    
    dropzoneOptions: {
      thumbnailWidth: 100,    
      maxFilesize: 5,
      dictDefaultMessage:
        "<i class='fa fa-cloud-upload'></i>Upload new Label image"
    }    
  })
};
</script>


<style>
</style>
