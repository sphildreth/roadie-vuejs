<template>
  <div>
    <Toolbar :menuItems="menuItems" :doShowRefresh=false :toolbarIcon="'fas fa-edit'"></Toolbar>
  
    <v-container v-if="loaded" fluid grid-list-md class="playlist-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img :src="imageUrl" :alt="playlist.name" class="playlist-image">
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
          >Allowed JPG, GIF or PNG. Image will be converted to JPG and Playlist thumbnail will be resized to 320x320 pixels.</div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-switch
            color="red"
            label="Is Locked (cant modify Tracks)"
            v-model="playlist.isLocked"
            data-vv-name="playlist.isLocked"
          ></v-switch>
        </v-flex>
        <v-flex xs4>
          <v-switch
            color="success"
            label="Is Public"
            v-model="playlist.isPublic"
            data-vv-name="playlist.isPublic"
          ></v-switch>
        </v-flex>        
      </v-layout>

      <v-layout row>
        <v-text-field
          v-model="playlist.name"
          label="Name"
          v-validate="'required|max:100'"
          :counter="250"
          data-vv-name="playlist.name"
          name="name"
          :error-messages="errors.collect('playlist.name')"
          required
        ></v-text-field>
      </v-layout>

     <v-layout row>
        <v-combobox
          v-model="playlist.tagsList"
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
          v-model="playlist.urLsList"
          label="Urls"
          name="urls"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-card class="mt-3 mb-3">
            <v-card-title>Description</v-card-title>
            <v-card-text>
              <markdown-editor v-model="playlist.description" ref="descriptionEditor"></markdown-editor>
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
import getEnv from '@/utils/env.js';

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
    EventBus.$on("pl:Save", this.save);
    EventBus.$on("pl:Cancel", this.cancel);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("pl:Save", this.save);
    EventBus.$off("pl:Cancel", this.cancel);
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
        this.playlist.mediumThumbnail.url + "?ts=" + new Date().getTime();
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
        .get(getEnv('ROADIE_API_URL') + `/playlists/${this.id}`)
        .then(rr => {
          this.playlist = rr.data.data;
          // ▜ Setup values to work with the autocompletes
          // ▟
          this.imageUrl =
            this.playlist.mediumThumbnail.url + "?ts=" + new Date().getTime();
          this.playlist.alternateNames = this.playlist.alternateNames || [];
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
          if (that.imageUrl != that.playlist.mediumThumbnail.url) {
            that.playlist.newThumbnailData = this.imageUrl;
            that.playlist.mediumThumbnail = null;
            that.playlist.thumbnail = null;
          }
          that.$axios.post("/playlists/edit", that.playlist).then(response => {
            if (!response.data.isSuccess) {
              EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" });
              return false;
            }
            that.$router.go(-1);
          })
          .catch(err => {
            EventBus.$emit("showSnackbar", { text: err.data[0], color: "red" });
          })             
        }
      });
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    }
  },
  data: () => ({
    loaded: false,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    playlist: {},
    lookupData: {
    },
    menuItems: [
      { title: "Save", class: "hidden-xs-only", click: "pl:Save" },
      { title: "Cancel", class: "hidden-xs-only", click: "pl:Cancel" }
    ]
  })
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.playlist-edit-container .markdown-editor {
  background-color: white;
}
.playlist-edit-container .error--text {
  color: yellow !important;
}
.playlist-edit-container img.playlist-image {
  max-height: 320px;
  max-width: 320px;
}
</style>
