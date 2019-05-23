<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'audiotrack'"></Toolbar>
  
    <v-container v-if="loaded" fluid grid-list-md class="track-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img :src="imageUrl" :alt="track.title" class="track-image">
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
          >Allowed JPG, GIF or PNG. Image will be converted to JPG and Track thumbnail will be resized to 320x320 pixels.</div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-switch
            color="red"
            label="Locked"
            v-model="track.isLocked"
            data-vv-name="track.isLocked"
          ></v-switch>
        </v-flex>
      </v-layout>


      <v-layout row>
        <v-text-field
          v-model="track.title"
          label="Title"
          v-validate="'required|max:250'"
          :counter="250"
          data-vv-name="track.title"
          name="title"
          :error-messages="errors.collect('track.title')"
          required
        ></v-text-field>
      </v-layout>

      <v-layout row>
        <v-combobox
          v-model="track.alternateNamesList"
          label="Alternate Names"
          name="alternateNamesList"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="track.tagsList"
          label="Tags"
          name="tags"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-autocomplete
          :items="lookupData.artistItems"
          v-model="track.trackArtistToken"
          :search-input.sync="searchForArtist"
          @change="modifiedTrackArtist = true"
          :loading="searchArtistsLoading"
          label="Track Artist"
          return-object
          deletable-chips
          clearable
          chips
          append-icon="fas fa-database"
        ></v-autocomplete>
      </v-layout>      
      <v-layout row>
        <v-flex xs2>
          <v-text-field
            v-model="track.amgId"
            label="All Music Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="track.amgId"
            name="amgId"
            :error-messages="errors.collect('track.amgId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="track.musicBrainzId"
            label="Musicbrainz Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="track.musicBrainzId"
            name="musicBrainzId"
            :error-messages="errors.collect('track.musicBrainzId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="track.spotifyId"
            label="SpotifyId Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="track.spotifyId"
            name="spotifyId"
            :error-messages="errors.collect('track.spotifyId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="track.lastFMId"
            label="LastFMId Id"
            v-validate="'max:50'"
            :counter="100"
            data-vv-name="track.lastFMId"
            name="lastFMId"
            :error-messages="errors.collect('track.lastFMId')"
          ></v-text-field>
        </v-flex>        
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-card class="mt-3 mb-3">
            <v-card-title>Part Titles</v-card-title>
            <v-card-text>
              <markdown-editor v-model="track.partTitlesList" ref="partTitlesList"></markdown-editor>
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
    EventBus.$on("aa:Save", this.save);
    EventBus.$on("aa:Cancel", this.cancel);
    this.debouncedArtistSearch = this.$_.debounce(this.doArtistSearch, 500);    
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("aa:Save", this.save);
    EventBus.$off("aa:Cancel", this.cancel);
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
        this.track.mediumThumbnail.url + "?ts=" + new Date().getTime();
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
        .get(process.env.VUE_APP_API_URL + `/tracks/${this.id}`)
        .then(rr => {
          this.track = rr.data.data;
          // ▜ Setup values to work with the autocompletes
          if(this.track.trackArtist) {
            this.lookupData.artistItems.push({
              text: this.track.trackArtist.artist.text,
              value: this.track.trackArtist.artist.value
            });
          }
          // ▟          
          this.imageUrl =
            this.track.mediumThumbnail.url + "?ts=" + new Date().getTime();
          this.track.alternateNames = this.track.alternateNames || [];
          this.track.partTitlesList = this.track.partTitlesList || [];
          this.track.partTitlesList = this.track.partTitlesList.join('\n');
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.loaded = true;
        });
    },
    save() {
      let that = this;
      this.$validator.validateAll().then(result => {
        if(!result) {
          // eslint-disable-next-line
          console.log("form invalid");
        } else  {
          if (that.imageUrl != that.track.mediumThumbnail.url) {
            that.track.newThumbnailData = this.imageUrl;
            that.track.mediumThumbnail = null;
            that.track.thumbnail = null;
          }
          that.track.partTitlesList = that.track.partTitlesList.split('\n');
          that.$axios.post("/tracks/edit", that.track).then(response => {
            if (!response.data.isSuccess) {
              EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" });
              return false;
            }
            that.$router.go(-1);
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
          EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red", error: err });
        })
        .finally(() => (this.searchArtistsLoading = false));
    },    
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
  },
  data: () => ({
    loaded: false,
    modifiedTrackArtist: false,
    searchForArtist: null,
    searchArtistsLoading: false,
    lookupData: {
      artistItems: []
    },    
    imageName: "",
    imageUrl: "",
    imageFile: "",
    track: {},
    menuItems: [
      { title: "Save", class: "hidden-xs-only", click: "aa:Save" },
      { title: "Cancel", class: "hidden-xs-only", click: "aa:Cancel" }
    ]
  })
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.track-edit-container .markdown-editor {
  background-color: white;
}
.track-edit-container .error--text {
  color: yellow !important;
}
.track-edit-container img.track-image {
  max-height: 320px;
  max-width: 320px;
}
</style>
