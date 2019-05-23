<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'fas fa-edit'"></Toolbar>

    <v-container v-if="loaded" fluid grid-list-md class="collection-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img :src="imageUrl" :alt="collection.name" class="collection-image">
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
          >Allowed JPG, GIF or PNG. Image will be converted to JPG and Collection thumbnail will be resized to 320x320 pixels.</div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs4>
          <v-switch
            color="red"
            label="Locked"
            v-model="collection.isLocked"
            data-vv-name="collection.isLocked"
          ></v-switch>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-select
          :items="lookupData.collectionTypes"
          v-model="collection.collectionType"
          label="Collection Type"
          v-validate="'required'"
          data-vv-name="collection.collectionType"
          name="collectionType"
          :error-messages="errors.collect('collection.collectionType')"
          required
        ></v-select>
      </v-layout>

      <v-layout row>
        <v-autocomplete
          :items="lookupData.userItems"
          v-model="collection.maintainer"       
          :search-input.sync="searchForUser"
          :loading="searchUsersLoading"
          v-validate="'required'" 
          data-vv-name="collection.maintainer.value" 
          label="Maintainer"
          append-icon="fas fa-database"
          return-object
        ></v-autocomplete>  
      </v-layout>  

      <v-layout row>
        <v-text-field
          v-model="collection.name"
          label="Name"
          v-validate="'required|max:100'"
          :counter="100"
          data-vv-name="collection.name"
          name="name"
          :error-messages="errors.collect('collection.name')"
          required
        ></v-text-field>
      </v-layout>

      <v-layout row>
          <v-text-field
            v-model="collection.collectionCount"
            type="number"
            label="Collection Count"
            v-validate="'required|numeric|min_value:1'" 
            data-vv-name="collection.collectionCount" 
            name="collectionCount"
            :error-messages="errors.collect('collection.collectionCount')" 
            required                    
          ></v-text-field> 
      </v-layout>      

      <v-layout row>
        <v-text-field
          v-model="collection.sortName"
          label="Sort Name"
          v-validate="'max:100'"
          :counter="100"
          data-vv-name="collection.sortName"
          name="sortName"
          :error-messages="errors.collect('collection.sortName')"
          required
        ></v-text-field>
      </v-layout>
      <v-layout row>
        <v-text-field
          v-model="collection.edition"
          label="Edition"
          v-validate="'max:200'"
          :counter="200"
          data-vv-name="collection.edition"
          name="edition"
          :error-messages="errors.collect('collection.edition')"
          required
        ></v-text-field>
      </v-layout>      
      <v-layout row>
        <v-text-field
          v-model="collection.listInCSVFormat"
          label="List In CSV Format"
          v-validate="'max:200'"
          :counter="200"
          data-vv-name="collection.listInCSVFormat"
          name="listInCSVFormat"
          :error-messages="errors.collect('collection.listInCSVFormat')"
          required
        ></v-text-field>
      </v-layout>            
      <v-layout row>
      </v-layout>
      <v-layout row>
        <v-combobox
          v-model="collection.alternateNamesList"
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
          v-model="collection.tagsList"
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
          v-model="collection.urLsList"
          label="Urls"
          name="urls"
          multiple
          deletable-chips
          clearable
          chips
        ></v-combobox>
      </v-layout>
      <v-layout row>
        <v-textarea
          v-model="collection.listInCSV"
          label="List In CSV Format"
          v-validate="'required'"
          data-vv-name="collection.listInCSV"
          name="listInCSV"
          :error-messages="errors.collect('collection.listInCSV')"
          required
          clearable
          rows="10"
        ></v-textarea>                
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-card class="mt-3 mb-3">
            <v-card-title>Description</v-card-title>
            <v-card-text>
              <markdown-editor v-model="collection.description" ref="description"></markdown-editor>
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
    this.debouncedUserSearch = this.$_.debounce(this.doUserSearch, 500);
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
        this.collection.mediumThumbnail.url + "?ts=" + new Date().getTime();
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
    doUserSearch: function (val) {
      if (this.searchUsersLoading) { 
        return;
      }
      this.searchUsersLoading = true;
      this.$axios.get(process.env.VUE_APP_API_URL + '/users?filter=' + val + "&limit=10")
      .then(res => {
        this.lookupData.userItems = [];
        res.data.rows.forEach((u) => {
          this.lookupData.userItems.push({
            text: u.user.text,
            value: u.user.value
          })
        });
      })
      .catch(err => {
        EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red", error: err });
      })
      .finally(() => (this.searchUsersLoading = false))    
    },    
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      var url = this.id == "__new__" ? '/collections/add' : `/collections/${this.id}`;
      this.$axios
        .get(process.env.VUE_APP_API_URL + url)
        .then(rr => {
          this.collection = rr.data.data;          
          // ▜ Setup values to work with the autocompletes
            this.lookupData.userItems.push(this.collection.maintainer);
          // ▟

          this.imageUrl =
            this.collection.mediumThumbnail.url + "?ts=" + new Date().getTime();
          this.collection.alternateNames = this.collection.alternateNames || [];
          this.collection.tags = this.collection.tags || [];
          this.$axios
            .get(process.env.VUE_APP_API_URL + "/lookups/collectionTypes")
            .then(rt => {
              this.lookupData.collectionTypes = [];
              rt.data.data.forEach(ct => {
                this.lookupData.collectionTypes.push({
                  text: ct.text,
                  value: ct.text
                });
              });
            })
            .finally(() => {
              EventBus.$emit("loadingComplete");
              this.loaded = true;
            });
        });
    },
    save() {
      const that = this;
      this.$validator.validateAll().then(result => {
        if (!result) {
          // eslint-disable-next-line
          console.log("form invalid");
        } else {
          if (that.imageUrl != that.collection.mediumThumbnail.url) {
            that.collection.newThumbnailData = this.imageUrl;
            that.collection.mediumThumbnail = null;
            that.collection.thumbnail = null;
          }
          that.$axios
            .post("/collections/edit", that.collection)
            .then(response => {
              if (!response.data.isSuccess) {
                EventBus.$emit("showSnackbar", {
                  text: "An error has occured",
                  color: "red"
                });
                return false;
              }
              that.$router.go(-1);
            });
        }
      });
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    searchForUser(val) {
      if(!val) {
        return;
      }
      this.debouncedUserSearch(val);
    },    
  },
  data: () => ({
    loaded: false,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    collection: {},
    searchUsersLoading: false,
    searchForUser: null,
    lookupData: {
      collectionTypes: [],
      userItems: []
    },
    menuItems: [{ title: "Save", class: "hidden-xs-only", click: "aa:Save" }]
  })
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.collection-edit-container .markdown-editor {
  background-color: white;
}
.collection-edit-container .error--text {
  color: yellow !important;
}
.collection-edit-container img.collection-image {
  max-height: 320px;
  max-width: 320px;
}
</style>
