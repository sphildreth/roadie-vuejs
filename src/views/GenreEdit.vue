<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'fas fa-edit'"></Toolbar>
  
    <v-container v-if="loaded" fluid grid-list-md class="genre-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img :src="imageUrl" :alt="genre.name" class="genre-image">
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
          >Allowed JPG, GIF or PNG. Image will be converted to JPG and genre thumbnail will be resized to 320x320 pixels.</div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-switch
            color="red"
            label="Locked"
            v-model="genre.isLocked"
            data-vv-name="genre.isLocked"
          ></v-switch>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-text-field
          v-model="genre.name"
          label="Name"
          v-validate="'required|max:100'"
          :counter="100"
          data-vv-name="genre.name"
          name="name"
          :error-messages="errors.collect('genre.name')"
          required
        ></v-text-field>
      </v-layout>

      <v-layout row>
        <v-text-field
          v-model="genre.sortName"
          label="Sort Name"
          v-validate="'max:100'"
          :counter="100"
          data-vv-name="genre.sortName"
          name="sortName"
          :error-messages="errors.collect('genre.sortName')"
          required
        ></v-text-field>
      </v-layout>

      <v-layout row>
        <v-combobox
          v-model="genre.alternateNamesList"
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
          v-model="genre.tagsList"
          label="Tags"
          name="tags"
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
              <markdown-editor v-model="genre.description" ref="descriptionEditor"></markdown-editor>
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
    EventBus.$on("aa:Save", this.save);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("aa:Save", this.save);
  },
  async mounted() {
    this.$validator.localize("en", this.dictionary);
    this.updateData();
  },
  methods: {
    resetImage() {
      this.imageUrl =
        this.genre.mediumThumbnail.url + "?ts=" + new Date().getTime();
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
        .get(getEnv('ROADIE_API_URL') + `/genres/${this.id}`)
        .then(rr => {
          this.genre = rr.data.data;
          // ▜ Setup values to work with the autocompletes
          // ▟
          this.imageUrl =
            this.genre.mediumThumbnail.url + "?ts=" + new Date().getTime();
          this.genre.alternateNames = this.genre.alternateNames || [];
          this.loaded = true;
          EventBus.$emit("loadingComplete");                    
        });
    },
    save() {
      let that = this;
      this.$validator.validateAll().then(result => {
        if(!result) {
          // eslint-disable-next-line
          console.log("form invalid");
        } else  {
          if (that.imageUrl != that.genre.mediumThumbnail.url) {
            that.genre.newThumbnailData = this.imageUrl;
            that.genre.mediumThumbnail = null;
            that.genre.thumbnail = null;
          }
          that.$axios.post("/genres/edit", that.genre).then(response => {
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
    modifiedGenres: false,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    genre: {},
    lookupData: {
    },
    menuItems: [{ title: "Save", class: "hidden-xs-only", click: "aa:Save" }]
  })
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.genre-edit-container .markdown-editor {
  background-color: white;
}
.genre-edit-container .error--text {
  color: yellow !important;
}
.genre-edit-container img.genre-image {
  max-height: 320px;
  max-width: 320px;
}
</style>
