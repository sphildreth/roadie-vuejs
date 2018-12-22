<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'fas fa-edit'"></Toolbar>
    <v-container v-if="loaded" fluid grid-list-md class="release-edit-container">
      <v-layout row class="ma-1 mb-3">
        <v-flex xs3>
          <img
            :src="imageUrl"
            :alt="release.title"
            class="release-image"
          ><img>          
          <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked">            
        </v-flex>
        <v-flex xs11>
          <v-btn @click="changeAvatar" color="info">Upload new photo</v-btn>     
          <v-btn @click="resetImage" color="">Reset</v-btn>     
          <div class="caption ml-2">Allowed JPG, GIF or PNG. Image will be converted to JPG and resized to 320x320 pixels.</div>
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
                v-validate="'required|date_format:YYYY-MM-DD'"             
                data-vv-name="release.releaseDate"             
                name="releaseDate"            
            ></v-text-field>        
            <v-date-picker
              no-title
              scrollable
              v-model="release.releaseDate"
            >
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
          name="alternateNames"
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
          :loading="searchGenreLoading"
          label="Genres"
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
    </v-container>
    <v-snackbar v-model="snackbar" color="success" :timeout="1000" :top="true">
      {{ snackbarText }}
      <v-btn color="black" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>     
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import { EventBus } from '@/event-bus.js';

  import markdownEditor  from 'vue-simplemde/src/markdown-editor'

  import Vue from 'vue';
  import VeeValidate from 'vee-validate';

  Vue.use(VeeValidate);  

  export default {
    components: { Toolbar, markdownEditor }, 
    props: {
      id: String
    },    
    created() {
      EventBus.$on('toolbarRefresh', this.updateData);
      EventBus.$on('rr:Save', this.save);
      this.debouncedArtistSearch = this.$_.debounce(this.doArtistSearch, 500);
      this.debouncedGenreSearch = this.$_.debounce(this.doGenreSearch, 500);
    },    
    beforeDestroy() {
      EventBus.$off('toolbarRefresh', this.updateData);  
      EventBus.$off('rr:Save', this.save);
    },     
    async mounted() {
      this.$validator.localize('en', this.dictionary);      
      this.updateData();
    },  
    methods: {      
      resetImage() {
        this.imageUrl = this.release.mediumThumbnail.url + '?ts=' + new Date().getTime();
      },
      changeAvatar() {
          this.$refs.image.click();
      },          
      onFilePicked (e) {
        const files = e.target.files
        if(files[0] !== undefined) {
          this.imageName = files[0].name
          if(this.imageName.lastIndexOf('.') <= 0) {
            return
          }
          const fr = new FileReader ()
          fr.readAsDataURL(files[0])
          fr.addEventListener('load', () => {
            this.imageUrl = fr.result
            this.imageFile = files[0] // this is an image file that can be sent to server...
          })
        } else {
          this.imageName = ''
          this.imageFile = ''
          this.imageUrl = ''
        }
      },            
      updateData: async function() {
        EventBus.$emit("loadingStarted");   
        this.$axios
        .get(process.env.VUE_APP_API_URL + `/releases/${this.id}`)
          .then(rr => {
            this.release = rr.data.data;
            this.loaded = true;
            // Setup values to work with the autocompletes
            this.release.artist = {
              text: this.release.artist.artist.text,
              value: this.release.artist.artist.value
            };
            this.release.releaseDate = new Date(this.release.releaseDate).toISOString().substr(0, 10)
            this.imageUrl = this.release.mediumThumbnail.url + '?ts=' + new Date().getTime();
            this.release.alternateNames = this.release.alternateNames || [];
            this.$axios
            .get(process.env.VUE_APP_API_URL + '/lookups/libraryStatus')
              .then(rt => {
                this.lookupData.libraryStatusItems = [];
                rt.data.data.forEach((ls) => {
                  this.lookupData.libraryStatusItems.push({
                    text: ls.text,
                    value: ls.text
                  });
                });
              })
              .finally(() => {
                this.$axios
                .get(process.env.VUE_APP_API_URL + '/lookups/releaseTypes')
                .then(rt => {
                  this.lookupData.releaseTypeItems = [];
                  rt.data.data.forEach((rt) => {
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
                  })
                  this.lookupData.genreItems = this.release.genres;
                  EventBus.$emit("loadingComplete");                
                });
              });
          });      
      },
      save () {
        let that = this;
        this.$validator.validateAll().then(result => {
          if(result) {
            // var data = {
            //   userId: this.$store.getters.userId,
            //   concurrencyStamp: that.profile.concurrencyStamp,              
            //   isPrivate: that.profile.isPrivate,
            //   doUseHtmlPlayer: that.profile.doUseHtmlPlayer,
            //   userName: that.profile.userName,
            //   apiToken: that.profile.apiToken,
            //   email: that.profile.email,
            //   timeformat: that.profile.timeformat,
            //   playerTrackLimit: that.profile.playerTrackLimit,
            //   randomReleaseLimit: that.profile.randomReleaseLimit,
            //   recentlyPlayedLimit: that.profile.recentlyPlayedLimit,
            //   ftpUrl: that.profile.ftpUrl,
            //   ftpDirectory: that.profile.ftpDirectory,
            //   ftpUsername: that.profile.ftpUsername,
            //   profile: that.profile.profile,
            //   timezone: this.profile.timezone,
            //   password: this.password,
            //   passwordConfirmation: this.passwordConfirmation
            // }
            // if(that.imageUrl != that.profile.avatarUrl) {
            //   data.avatardata = that.imageUrl;
            // }           
            // this.$axios
            //   .post('/users/profile/edit',data)
            //   .then(response => {
            //     if(!response.data.isSuccess) {
            //       that.snackbarText = "An error has occured";
            //       that.snackbar = true;   
            //       return false;
            //     }
            //     if(that.originalEmail != that.profile.email || that.originalUsername != that.profile.username) {
            //       that.alert = true;
            //     } else {
            //       that.snackbarText = "Successfully Edit Account settings";
            //       that.snackbar = true;                
            //       this.$store.commit("signinSuccess", response.data);            
            //       this.updateData();      
            //     }
            // });
          }
        });
      },
      doArtistSearch: function (val) {
        if (this.searchArtistsLoading) { 
          return;
        }
        this.searchArtistsLoading = true;
        this.$axios.get(process.env.VUE_APP_API_URL + '/artists?filter=' + val + "&limit=10")
        .then(res => {
          this.lookupData.artistItems = [];
          res.data.rows.forEach((a) => {
            this.lookupData.artistItems.push({
              text: a.artist.text,
              value: a.artist.value
            })
          });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.searchArtistsLoading = false))    
      },
      doGenreSearch: function (val) {
        if (this.searchGenreLoading) { 
          return;
        }
        this.searchGenreLoading = true;
        this.$axios.get(process.env.VUE_APP_API_URL + '/genres?filter=' + val + "&limit=10")
        .then(res => {
          //this.lookupData.genreItems = this.release.genres;;
          res.data.rows.forEach((g) => {
            this.lookupData.genreItems.push({
              text: g.genre.text,
              value: g.genre.value
            })
          })
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => (this.searchGenreLoading = false))    
      }                      
    },
    watch: {
      $route(to) {
        this.id = to.params.id;
        this.updateData();
      },      
      searchForArtist(val) {
        if(!val) {
          return;
        }
        this.debouncedArtistSearch(val);
      },
      searchForGenre(val) {
        if(!val) {
          return;
        }
        this.debouncedGenreSearch(val);
      }
    },
    data: () => ({
      loaded: false,
      showReleaseDatePicker: false,
      searchArtistsLoading: false,
      searchGenreLoading: false,
      searchForArtist: null,
      searchForGenre: null,
      imageName: '',
      imageUrl: '',
      imageFile: '',       
      snackbar: false,
      snackbarText: "",      
      release: {},
      lookupData: {
        libraryStatusItems: [],
        releaseTypeItems: [],
        artistItems:[],
        genreItems:[]
      },
      menuItems: [
        { title: "Save", class: "hidden-xs-only", click: "rr:Save" }
      ],
    })
  }
</script>

<style>
  @import '~simplemde/dist/simplemde.min.css';
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
