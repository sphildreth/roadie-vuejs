<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'fas fa-edit'"></Toolbar>
    <v-container v-if="loaded" fluid grid-list-md class="artist-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img :src="imageUrl" :alt="artist.name" class="artist-image">
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
          <v-btn @click="changeAvatar" color="info">Upload new photo</v-btn>
          <v-btn @click="resetImage" color>Reset</v-btn>
          <div
            class="caption ml-2"
          >Allowed JPG, GIF or PNG. Image will be converted to JPG and Artist thumbnail will be resized to 320x320 pixels.</div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-switch
            color="red"
            label="Locked"
            v-model="artist.isLocked"
            data-vv-name="artist.isLocked"
          ></v-switch>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-select
          :items="lookupData.artistTypes"
          v-model="artist.artistType"
          label="Artist Type"
          v-validate="'required'"
          data-vv-name="artist.artistType"
        ></v-select>
      </v-layout>

      <v-layout row>
        <v-select
          :items="lookupData.bandStatus"
          v-model="artist.bandStatus"
          label="Band Status"
          v-validate="'required'"
          data-vv-name="artist.bandStatus"
        ></v-select>
      </v-layout>

      <v-layout row>
        <v-text-field
          v-model="artist.name"
          label="Name"
          v-validate="'required|max:250'"
          :counter="250"
          data-vv-name="artist.name"
          name="name"
          :error-messages="errors.collect('artist.name')"
          required
        ></v-text-field>
      </v-layout>
      <v-layout row>
        <v-text-field
          v-model="artist.realName"
          label="Real Name"
          v-validate="'max:500'"
          :counter="500"
          data-vv-name="artist.realName"
          name="realName"
          :error-messages="errors.collect('artist.realName')"
          required
        ></v-text-field>
      </v-layout>
      <v-layout row>
        <v-text-field
          v-model="artist.sortName"
          label="Sort Name"
          v-validate="'max:250'"
          :counter="250"
          data-vv-name="artist.sortName"
          name="sortName"
          :error-messages="errors.collect('artist.sortName')"
          required
        ></v-text-field>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-menu
            ref="birthDate"
            :close-on-content-click="false"
            v-model="showArtistBirthdateDatePicker"
            :nudge-right="40"
            :return-value.sync="artist.birthDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="artist.birthDate"
              label="Date of Birth"
              :error-messages="errors.collect('artist.birthDate')"
              v-validate="'date_format:YYYY-MM-DD'"
              data-vv-name="artist.birthDate"
              name="birthDate"
            ></v-text-field>
            <v-date-picker no-title scrollable v-model="artist.birthDate">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="showArtistBirthdateDatePicker = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.birthDate.save(artist.birthDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs4>
          <v-menu
            ref="beginDate"
            :close-on-content-click="false"
            v-model="showArtistBeginDatePicker"
            :nudge-right="40"
            :return-value.sync="artist.beginDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="artist.beginDate"
              label="Begin Date"
              :error-messages="errors.collect('artist.beginDate')"
              v-validate="'date_format:YYYY-MM-DD'"
              data-vv-name="artist.beginDate"
              name="beginDate"
            ></v-text-field>
            <v-date-picker no-title scrollable v-model="artist.beginDate">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="showArtistBeginDatePicker = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.beginDate.save(artist.beginDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs4>
          <v-menu
            ref="endDate"
            :close-on-content-click="false"
            v-model="showArtistEndDateDatePicker"
            :nudge-right="40"
            :return-value.sync="artist.endDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="artist.endDate"
              label="End Date"
              :error-messages="errors.collect('artist.endDate')"
              v-validate="'date_format:YYYY-MM-DD'"
              data-vv-name="artist.endDate"
              name="endDate"
            ></v-text-field>
            <v-date-picker no-title scrollable v-model="artist.endDate">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="showArtistEndDateDatePicker = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.endDate.save(artist.endDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="artist.alternateNamesList"
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
          :items="lookupData.artistItems"
          v-model="artist.associatedArtistsTokens"
          :search-input.sync="searchForArtist"
          @change="modifiedAssociatedArtists = true"
          :loading="searchArtistsLoading"
          label="Associated Artists"
          return-object
          multiple
          deletable-chips
          clearable
          chips
          append-icon="fas fa-database"
        ></v-autocomplete>
      </v-layout>
      <v-layout row>
        <v-autocomplete
          :items="lookupData.genreItems"
          v-model="artist.genres"
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
          v-model="artist.tagsList"
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
          v-model="artist.isniList"
          label="ISNI"
          name="isni"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="artist.urLsList"
          label="Urls"
          name="urls"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-flex xs2>
          <v-text-field
            v-model="artist.amgId"
            label="All Music Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="artist.amgId"
            name="amgId"
            :error-messages="errors.collect('artist.amgId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field
            v-model="artist.discogsId"
            label="Discogs Id"
            v-validate="'max:50'"
            :counter="50"
            data-vv-name="artist.discogsId"
            name="discogsId"
            :error-messages="errors.collect('artist.discogsId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs2>
          <v-text-field
            v-model="artist.iTunesId"
            label="iTunes Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="artist.iTunesId"
            name="iTunesId"
            :error-messages="errors.collect('artist.iTunesId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="artist.musicBrainzId"
            label="Musicbrainz Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="artist.musicBrainzId"
            name="musicBrainzId"
            :error-messages="errors.collect('artist.musicBrainzId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="artist.spotifyId"
            label="SpotifyId Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="artist.spotifyId"
            name="spotifyId"
            :error-messages="errors.collect('artist.spotifyId')"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-card class="mt-3 mb-3">
            <v-card-title>Biography</v-card-title>
            <v-card-text>
              <markdown-editor v-model="artist.bioContext" ref="bioEditor"></markdown-editor>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-card class="mt-3 mb-3">
            <v-card-title>Profile</v-card-title>
            <v-card-text>
              <markdown-editor v-model="artist.profile" ref="profileEditor"></markdown-editor>
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

import markdownEditor from "vue-simplemde/src/markdown-editor";

import Vue from "vue";
import VeeValidate from "vee-validate";

Vue.use(VeeValidate);

export default {
  components: { Toolbar, markdownEditor },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("rr:Save", this.save);
    this.debouncedArtistSearch = this.$_.debounce(this.doArtistSearch, 500);
    this.debouncedGenreSearch = this.$_.debounce(this.doGenreSearch, 500);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("rr:Save", this.save);
  },
  async mounted() {
    this.$validator.localize("en", this.dictionary);
    this.updateData();
  },
  methods: {
    resetImage() {
      this.imageUrl =
        this.artist.mediumThumbnail.url + "?ts=" + new Date().getTime();
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
        .get(process.env.VUE_APP_API_URL + `/artists/${this.id}`)
        .then(rr => {
          this.artist = rr.data.data;
          // ▜ Setup values to work with the autocompletes
          this.artist.genres = this.artist.genres || [];
          this.artist.genres.forEach(g => {
            this.lookupData.genreItems.push({
              text: g.text,
              value: g.value
            });
          });
          this.artist.associatedArtists = this.artist.associatedArtists || [];
          this.artist.associatedArtists.forEach(a => {
            this.lookupData.artistItems.push({
              text: a.artist.text,
              value: a.artist.value
            });
          });
          // ▟
          this.artist.birthDate = this.artist.birthDate
            ? new Date(this.artist.birthDate).toISOString().substr(0, 10)
            : null;
          this.artist.beginDate = this.artist.beginDate
            ? new Date(this.artist.beginDate).toISOString().substr(0, 10)
            : null;
          this.artist.endDate = this.artist.endDate
            ? new Date(this.artist.endDate).toISOString().substr(0, 10)
            : null;
          this.imageUrl =
            this.artist.mediumThumbnail.url + "?ts=" + new Date().getTime();
          this.artist.alternateNames = this.artist.alternateNames || [];
          this.$axios
            .get(process.env.VUE_APP_API_URL + "/lookups/artistTypes")
            .then(rt => {
              this.lookupData.artistTypes = [];
              rt.data.data.forEach(at => {
                this.lookupData.artistTypes.push({
                  text: at.text,
                  value: at.text
                });
              });
            })
            .finally(() => {
              this.lookupData.bandStatus = [];
              this.$axios
                .get(process.env.VUE_APP_API_URL + "/lookups/bandStatus")
                .then(rt => {
                  this.lookupData.bandStatus = [];
                  rt.data.data.forEach(at => {
                    this.lookupData.bandStatus.push({
                      text: at.text,
                      value: at.text
                    });
                  });
                })
                .finally(() => {
                  EventBus.$emit("loadingComplete");
                  this.loaded = true;
                });
            });
        });
    },
    save() {
      let that = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          if (this.imageUrl != that.artist.mediumThumbnail.url) {
            that.artist.newThumbnailData = this.imageUrl;
            that.artist.mediumThumbnail = null;
            that.artist.thumbnail = null;
          }
          this.$axios.post("/artists/edit", that.artist).then(response => {
            if (!response.data.isSuccess) {
              EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" });
              return false;
            }
            this.$router.go(-1);
          });
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
          process.env.VUE_APP_API_URL + "/artists?filter=" + val + "&limit=10"
        )
        .then(res => {
          res.data.rows.forEach(a => {
            let artist = {
              text: a.artist.text,
              value: a.artist.value
            };
            if (
              !this.$_.find(this.lookupData.artistItems, function(l) {
                return l.value === artist.value;
              })
            ) {
              this.lookupData.artistItems.push(artist);
            }
          });
        })
        .catch(err => {
          // eslint-disable-next-line
          console.log(err);
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
          process.env.VUE_APP_API_URL + "/genres?filter=" + val + "&limit=10"
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
          // eslint-disable-next-line
          console.log(err);
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
    modifiedAssociatedArtists: false,
    showArtistBirthdateDatePicker: false,
    showArtistBeginDatePicker: false,
    showArtistEndDateDatePicker: false,
    searchArtistsLoading: false,
    searchGenreLoading: false,
    searchForArtist: null,
    searchForGenre: null,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    artist: {},
    lookupData: {
      artistItems: [],
      bandStatus: [],
      genreItems: []
    },
    menuItems: [{ title: "Save", class: "hidden-xs-only", click: "rr:Save" }]
  })
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.artist-edit-container .markdown-editor {
  background-color: white;
}
.artist-edit-container .error--text {
  color: yellow !important;
}
.artist-edit-container img.artist-image {
  max-height: 320px;
  max-width: 320px;
}
</style>
