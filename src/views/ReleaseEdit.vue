<template>
  <div>
    <Toolbar :menuItems="menuItems" :doShowRefresh=false :toolbarIcon="'fas fa-edit'"></Toolbar>
    <v-container v-if="loaded" fluid grid-list-md class="release-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img :src="imageUrl" :alt="release.title" class="release-image">
          <img>
          <input
            type="file"
            style="display: none"
            ref="image"
            accept="image/*"
            @change="onFilePicked"
          >
        </v-flex>
        <v-flex xs11>
          <v-btn @click="changeAvatar" color="info">Upload new thumbnail</v-btn>
          <v-btn @click="resetImage" color>Reset</v-btn>
          <div
            class="caption ml-2"
          >Allowed JPG, GIF or PNG. Image will be converted to JPG and Release thumbnail will be resized to 320x320 pixels.</div>
          <vue-dropzone            
            ref="myVueDropzone"
            id="dropzone"
            :options="dropzoneOptions"
          ></vue-dropzone>              
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-switch
            color="red"
            label="Locked"
            v-model="release.isLocked"
            data-vv-name="release.isLocked"
          ></v-switch>
        </v-flex>
        <v-flex xs4>
          <v-switch
            color="warning"
            label="Is Virtual"
            v-model="release.isVirtual"
            data-vv-name="release.isVirtual"
          ></v-switch>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-select
          :items="lookupData.libraryStatusItems"
          v-model="release.libraryStatus"
          label="Library Status"
          v-validate="'required'"
          data-vv-name="release.libraryStatus"
        ></v-select>
      </v-layout>
      <v-layout row>
        <v-autocomplete
          :items="lookupData.artistItems"
          v-model="release.artist"
          :search-input.sync="searchForArtist"
          :loading="searchArtistsLoading"
          v-validate="'required'"
          data-vv-name="release.artist.value"
          label="Artist"
          append-icon="fas fa-database"
          return-object
        ></v-autocomplete>
      </v-layout>
      <v-layout row>
        <v-select
          :items="lookupData.releaseTypeItems"
          v-model="release.releaseType"
          label="Release Type"
          v-validate="'required'"
          data-vv-name="release.releaseType"
        ></v-select>
      </v-layout>
      <v-layout row>
        <v-text-field
          v-model="release.title"
          label="Title"
          v-validate="'required|max:250'"
          :counter="250"
          data-vv-name="release.title"
          name="title"
          :error-messages="errors.collect('release.title')"
          required
        ></v-text-field>
      </v-layout>
      <v-layout row>
        <v-text-field
          v-model="release.sortTitle"
          label="Sort Title"
          v-validate="'max:250'"
          :counter="250"
          data-vv-name="release.sortTitle"
          name="sortTitle"
          :error-messages="errors.collect('release.sortTitle')"
          required
        ></v-text-field>
      </v-layout>      
      <v-layout row>
        <v-flex xs4>
          <v-menu
            ref="releaseDate"
            :close-on-content-click="false"
            v-model="showReleaseDatePicker"
            :nudge-right="40"
            :return-value.sync="release.releaseDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="release.releaseDate"
              label="Release Date"
              :error-messages="errors.collect('release.releaseDate')"
              v-validate="'required|date_format:yyyy-MM-dd'"
              data-vv-name="release.releaseDate"
              name="releaseDate"
            ></v-text-field>
            <v-date-picker no-title scrollable v-model="release.releaseDate">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="showReleaseDatePicker = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.releaseDate.save(release.releaseDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            v-model="release.mediaCount"
            type="number"
            label="Media Count"
            v-validate="'required|numeric|min_value:1'"
            data-vv-name="release.mediaCount"
            name="mediaCount"
            :error-messages="errors.collect('release.mediaCount')"
            required
          ></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            v-model="release.trackCount"
            type="number"
            label="Track Count"
            v-validate="'required|numeric|min_value:1'"
            data-vv-name="release.trackCount"
            name="trackCount"
            :error-messages="errors.collect('release.trackCount')"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="release.alternateNamesList"
          label="Alternate Names"
          name="alternateNamesList"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-autocomplete
          :items="lookupData.genreItems"
          v-model="release.genres"
          :search-input.sync="searchForGenre"
          @change="modifiedGenres = true"
          :loading="searchGenreLoading"
          label="Genres"
          return-object
          multiple
          deletable-chips
          clearable
          chips
          append-icon="fas fa-database"
        ></v-autocomplete>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="release.tagsList"
          label="Tags"
          name="tags"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="release.urLsList"
          label="Urls"
          name="urls"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-flex xs3>
          <v-text-field
            v-model="release.amgId"
            label="All Music Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="release.amgId"
            name="amgId"
            :error-messages="errors.collect('release.amgId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="release.discogsId"
            label="Discogs Id"
            v-validate="'max:50'"
            :counter="50"
            data-vv-name="release.discogsId"
            name="discogsId"
            :error-messages="errors.collect('release.discogsId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="release.iTunesId"
            label="iTunes Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="release.iTunesId"
            name="iTunesId"
            :error-messages="errors.collect('release.iTunesId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="release.lastFMId"
            label="Last FM Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="release.lastFMId"
            name="lastFMId"
            :error-messages="errors.collect('release.lastFMId')"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs3>
          <v-text-field
            v-model="release.musicBrainzId"
            label="Musicbrainz Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="release.musicBrainzId"
            name="musicBrainzId"
            :error-messages="errors.collect('release.musicBrainzId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="release.spotifyId"
            label="SpotifyId Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="release.spotifyId"
            name="spotifyId"
            :error-messages="errors.collect('release.spotifyId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model="release.lastFMSummary"
            label="Last FM Summary"
            :counter="1000"
            data-vv-name="release.lastFMSummary"
            name="lastFMSummary"
            :error-messages="errors.collect('release.lastFMSummary')"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-card class="mt-3 mb-3">
            <v-card-title>Profile</v-card-title>
            <v-card-text>
              <markdown-editor v-model="release.profile" ref="profileEditor"></markdown-editor>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";

import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import markdownEditor from "vue-simplemde/src/markdown-editor";

import Vue from "vue";
import VeeValidate from "vee-validate";

Vue.use(VeeValidate);

export default {
  components: { Toolbar, markdownEditor, vueDropzone: vue2Dropzone },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("rr:Save", this.save);
    EventBus.$on("rr:Cancel", this.cancel);
    this.debouncedArtistSearch = this.$_.debounce(this.doArtistSearch, 500);
    this.debouncedGenreSearch = this.$_.debounce(this.doGenreSearch, 500);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("rr:Save", this.save);
    EventBus.$off("rr:Cancel", this.cancel);
  },
  async mounted() {
    this.$validator.localize("en", this.dictionary);
    this.updateData();
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    resetImage() {
      this.imageUrl =
        this.release.mediumThumbnail.url + "?ts=" + new Date().getTime();
    },
    changeAvatar() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          this.imageUrl = fr.result;
          this.imageFile = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/releases/${this.id}`)
        .then(rr => {
          this.release = rr.data.data;
          this.dropzoneOptions.url = process.env.VUE_APP_API_URL + "/releases/uploadImage/" + this.release.id;
          this.dropzoneOptions.headers = {
            Authorization: "Bearer " + this.$store.getters.authToken
          };              
          this.loaded = true;
          // ▜ Setup values to work with the autocompletes
          this.release.artist = {
            text: this.release.artist.artist.text,
            value: this.release.artist.artist.value
          };
          this.release.genres = this.release.genres || [];
          this.release.genres.forEach(g => {
            this.lookupData.genreItems.push({
              text: g.text,
              value: g.value
            });
          });
          // ▟
          this.release.releaseDate = new Date(this.release.releaseDate)
            .toISOString()
            .substr(0, 10);
          this.imageUrl =
            this.release.mediumThumbnail.url + "?ts=" + new Date().getTime();
          this.release.alternateNames = this.release.alternateNames || [];
          this.$axios
            .get(process.env.VUE_APP_API_URL + "/lookups/libraryStatus")
            .then(rt => {
              this.lookupData.libraryStatusItems = [];
              rt.data.data.forEach(ls => {
                this.lookupData.libraryStatusItems.push({
                  text: ls.text,
                  value: ls.text
                });
              });
            })
            .finally(() => {
              this.$axios
                .get(process.env.VUE_APP_API_URL + "/lookups/releaseTypes")
                .then(rt => {
                  this.lookupData.releaseTypeItems = [];
                  rt.data.data.forEach(rt => {
                    this.lookupData.releaseTypeItems.push({
                      text: rt.text,
                      value: rt.text
                    });
                  });
                })
                .finally(() => {
                  this.lookupData.artistItems = [];
                  this.lookupData.artistItems.push({
                    text: this.release.artist.text,
                    value: this.release.artist.value
                  });             
                  EventBus.$emit("loadingComplete");
                });
            });
        });
    },
    save() {
      let that = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          that.release.newSecondaryImagesData = [];
          this.$refs.myVueDropzone.getAcceptedFiles().forEach(f => {
            that.release.newSecondaryImagesData.push(f.dataURL);
          });            
          if (this.imageUrl != that.release.mediumThumbnail.url) {
            that.release.newThumbnailData = this.imageUrl;
            that.release.mediumThumbnail = null;
            that.release.thumbnail = null;
          }
          this.$axios.post("/releases/edit", that.release).then(response => {
            if (!response.data.isSuccess) {
              EventBus.$emit("showSnackbar", {
                text: "An error has occured",
                color: "red"
              });
              return false;
            }
            this.$router.go(-1);
          })
          .catch(err => {
            EventBus.$emit("showSnackbar", { text: err.data[0], color: "red" });
          })           
        } else {
          alert("Form is invalid!");
        }
      });
    },
    doArtistSearch: function(val) {
      if (this.searchArtistsLoading) {
        return;
      }
      this.searchArtistsLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL + "/artists?filter=" + encodeURIComponent(val) + "&limit=10"
        )
        .then(res => {
          this.lookupData.artistItems = [];
          res.data.rows.forEach(a => {
            this.lookupData.artistItems.push({
              text: a.artist.text,
              value: a.artist.value
            });
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
    doGenreSearch: function(val) {
      if (this.searchGenreLoading) {
        return;
      }
      this.searchGenreLoading = true;
      this.$axios
        .get(
          process.env.VUE_APP_API_URL + "/genres?filter=" + encodeURIComponent(val) + "&limit=10"
        )
        .then(res => {
          res.data.rows.forEach(gr => {
            var g = {
              text: gr.genre.text,
              value: gr.genre.value
            };
            if (!this.lookupData.genreItems.includes(g)) {
              this.lookupData.genreItems.push(g);
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
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    searchForArtist(val) {
      if (!val) {
        return;
      }
      this.debouncedArtistSearch(val);
    },
    searchForGenre(val) {
      if (!val) {
        return;
      }
      this.debouncedGenreSearch(val);
    }
  },
  data: () => ({
    loaded: false,
    modifiedGenres: false,
    showReleaseDatePicker: false,
    searchArtistsLoading: false,
    searchGenreLoading: false,
    searchForArtist: null,
    searchForGenre: null,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    release: {},
    lookupData: {
      libraryStatusItems: [],
      releaseTypeItems: [],
      artistItems: [],
      genreItems: []
    },
    dropzoneOptions: {
      thumbnailWidth: 200,
      autoProcessQueue: false,
      maxFilesize: 5,
      maxFiles: 10,
      dictDefaultMessage:
        "<i class='fa fa-cloud-upload'></i> Add images to upload to Release"      
    },        
    menuItems: [
      { title: "Save", class: "hidden-xs-only", click: "rr:Save" },
      { title: "Cancel", class: "hidden-xs-only", click: "rr:Cancel" }
    ]
  })
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.release-edit-container .markdown-editor {
  background-color: white;
}
.release-edit-container .error--text {
  color: yellow !important;
}
.release-edit-container img.release-image {
  max-height: 320px;
  max-width: 320px;
}
</style>
