<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'fas fa-edit'"></Toolbar>
  
    <v-container v-if="loaded" fluid grid-list-md class="label-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img :src="imageUrl" :alt="label.name" class="label-image">
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
          >Allowed JPG, GIF or PNG. Image will be converted to JPG and Label thumbnail will be resized to 320x320 pixels.</div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-switch
            color="red"
            label="Locked"
            v-model="label.isLocked"
            data-vv-name="label.isLocked"
          ></v-switch>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-text-field
          v-model="label.name"
          label="Name"
          v-validate="'required|max:250'"
          :counter="250"
          data-vv-name="label.name"
          name="name"
          :error-messages="errors.collect('label.name')"
          required
        ></v-text-field>
      </v-layout>

      <v-layout row>
        <v-text-field
          v-model="label.sortName"
          label="Sort Name"
          v-validate="'max:250'"
          :counter="250"
          data-vv-name="label.sortName"
          name="sortName"
          :error-messages="errors.collect('label.sortName')"
          required
        ></v-text-field>
      </v-layout>

      <v-layout row>
        <v-flex xs4>
          <v-menu
            ref="beginDate"
            :close-on-content-click="false"
            v-model="showLabelBeginDatePicker"
            :nudge-right="40"
            :return-value.sync="label.beginDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="label.beginDate"
              label="Begin Date"
              :error-messages="errors.collect('label.beginDate')"
              v-validate="'date_format:yyyy-MM-dd'"
              data-vv-name="label.beginDate"
              name="beginDate"
            ></v-text-field>
            <v-date-picker no-title scrollable v-model="label.beginDate">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="showLabelBeginDatePicker = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.beginDate.save(label.beginDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
        <v-flex xs4>
          <v-menu
            ref="endDate"
            :close-on-content-click="false"
            v-model="showLabelEndDateDatePicker"
            :nudge-right="40"
            :return-value.sync="label.endDate"
            lazy
            transition="scale-transition"
            offset-y
            full-width
          >
            <v-text-field
              slot="activator"
              v-model="label.endDate"
              label="End Date"
              :error-messages="errors.collect('label.endDate')"
              v-validate="'date_format:yyyy-MM-dd'"
              data-vv-name="label.endDate"
              name="endDate"
            ></v-text-field>
            <v-date-picker no-title scrollable v-model="label.endDate">
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="showLabelEndDateDatePicker = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.endDate.save(label.endDate)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="label.alternateNamesList"
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
          v-model="label.tagsList"
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
          v-model="label.urLsList"
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
            v-model="label.discogsId"
            label="Discogs Id"
            v-validate="'max:50'"
            :counter="50"
            data-vv-name="label.discogsId"
            name="discogsId"
            :error-messages="errors.collect('label.discogsId')"
          ></v-text-field>
        </v-flex>
        <v-flex xs3>
          <v-text-field
            v-model="label.musicBrainzId"
            label="Musicbrainz Id"
            v-validate="'max:100'"
            :counter="100"
            data-vv-name="label.musicBrainzId"
            name="musicBrainzId"
            :error-messages="errors.collect('label.musicBrainzId')"
          ></v-text-field>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12>
          <v-card class="mt-3 mb-3">
            <v-card-title>Profile</v-card-title>
            <v-card-text>
              <markdown-editor v-model="label.profile" ref="profileEditor"></markdown-editor>
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
        this.label.mediumThumbnail.url + "?ts=" + new Date().getTime();
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
        .get(getEnv('ROADIE_API_URL') + `/labels/${this.id}`)
        .then(rr => {
          this.label = rr.data.data;
          // ▜ Setup values to work with the autocompletes
          // ▟
          this.label.beginDate = this.label.beginDate
            ? new Date(this.label.beginDate).toISOString().substr(0, 10)
            : null;
          this.label.endDate = this.label.endDate
            ? new Date(this.label.endDate).toISOString().substr(0, 10)
            : null;
          this.imageUrl =
            this.label.mediumThumbnail.url + "?ts=" + new Date().getTime();
          this.label.alternateNames = this.label.alternateNames || [];
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
          if (that.imageUrl != that.label.mediumThumbnail.url) {
            that.label.newThumbnailData = this.imageUrl;
            that.label.mediumThumbnail = null;
            that.label.thumbnail = null;
          }
          that.$axios.post("/labels/edit", that.label).then(response => {
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
    showLabelBeginDatePicker: false,
    showLabelEndDateDatePicker: false,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    label: {},
    lookupData: {
    },
    menuItems: [{ title: "Save", class: "hidden-xs-only", click: "aa:Save" }]
  })
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.label-edit-container .markdown-editor {
  background-color: white;
}
.label-edit-container .error--text {
  color: yellow !important;
}
.label-edit-container img.label-image {
  max-height: 320px;
  max-width: 320px;
}
</style>
