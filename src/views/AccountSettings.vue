<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :doShowRefresh=false :toolbarIcon="'settings'"></Toolbar>    
    <v-container fluid grid-list-md class="account-settings-container">
        <v-layout row wrap>
          <v-flex xs2>
            <v-list>
                <v-list-tile @click="selectedListItem = 0" ripple>              
                  <v-list-tile-content>
                    <v-list-tile-title>General</v-list-tile-title>
                  </v-list-tile-content>                  
                  <v-list-tile-action>
                    <v-icon v-if="selectedListItem == 0" color="pink">arrow_right_alt</v-icon>
                  </v-list-tile-action>                     
                </v-list-tile>
                <v-list-tile @click="selectedListItem = 1" ripple>              
                  <v-list-tile-content>
                    <v-list-tile-title>Change Password</v-list-tile-title>
                  </v-list-tile-content>                  
                  <v-list-tile-action>
                    <v-icon v-if="selectedListItem == 1" color="pink">arrow_right_alt</v-icon>
                  </v-list-tile-action>                     
                </v-list-tile>                
                <v-divider></v-divider>
                <v-list-tile @click="selectedListItem = 2" ripple>
                  <v-list-tile-content>
                    <v-list-tile-title>FTP</v-list-tile-title>
                  </v-list-tile-content>   
                  <v-list-tile-action>
                    <v-icon v-if="selectedListItem == 2" color="pink">arrow_right_alt</v-icon>
                  </v-list-tile-action>                                  
                </v-list-tile>                 
                <v-divider></v-divider>
                <v-list-tile @click="selectedListItem = 3" ripple>
                  <v-list-tile-content>
                    <v-list-tile-title>Profile</v-list-tile-title>
                  </v-list-tile-content>      
                  <v-list-tile-action>
                    <v-icon v-if="selectedListItem == 3" color="pink">arrow_right_alt</v-icon>
                  </v-list-tile-action>                               
                </v-list-tile>                
            </v-list>
          </v-flex>
          <v-flex xs10>
            <v-card v-if="selectedListItem == 0">
              <v-card-title class="primary">General</v-card-title>
              <v-card-text>
                  <v-layout row class="ma-1 mb-3">
                    <v-flex xs1>
                      <img
                        v-if="loaded"
                        :src="imageUrl"
                        :alt="profile.userName"
                        class="profile-image"
                      ><img>          
                      <input type="file" style="display: none" ref="image" accept="image/*" @change="onFilePicked">            
                    </v-flex>
                    <v-flex xs11>
                      <v-btn @click="changeAvatar" color="info">Upload new photo</v-btn>     
                      <v-btn @click="resetImage" color="">Reset</v-btn>     
                      <div class="caption ml-2">Allowed JPG, GIF or PNG. Image will be converted to PNG and resized to 80x80 pixels.</div>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs4>
                      <v-switch
                        color="success"
                        label="Keep Your Activity Private"
                        v-model="profile.isPrivate"
                        data-vv-name="profile.isPrivate" 
                      ></v-switch>
                    </v-flex>
                    <v-flex xs4>
                      <v-switch
                        color="success"
                        label="Use HTML Player"
                        v-model="profile.doUseHtmlPlayer"
                        data-vv-name="profile.doUseHtmlPlayer" 
                      ></v-switch> 
                    </v-flex>
                    <v-flex xs4>
                      <v-switch
                        color="success"
                        label="Remove Track From Que After Played"
                        v-model="profile.removeTrackFromQueAfterPlayed"
                        data-vv-name="profile.removeTrackFromQueAfterPlayed" 
                      ></v-switch> 
                    </v-flex>                    
                  </v-layout>                  
                  <v-text-field
                    v-model="profile.userName"
                    label="Username"
                    v-validate="'required|max:20'" 
                    :counter="20" 
                    data-vv-name="profile.userName" 
                    name="userName"
                    :error-messages="errors.collect('profile.userName')" 
                    required                    
                  ></v-text-field>
                  <v-text-field
                    v-model="profile.apiToken"
                    label="Third Party API Token"
                    v-validate="'max:100'" 
                    :counter="20" 
                    data-vv-name="profile.apiToken" 
                    name="apiToken"
                    :error-messages="errors.collect('profile.apiToken')" 
                  ></v-text-field>         
                  <v-text-field
                    v-model="profile.email"
                    label="Email Address"
                    v-validate="'required|email|max:100'" 
                    :counter="100" 
                    data-vv-name="profile.email" 
                    name="email"
                    :error-messages="errors.collect('profile.email')"                     
                  ></v-text-field>     
                  <v-autocomplete
                    :items="this.$moment.tz.names()"
                    v-model="profile.timezone"
                    v-validate="'required'" 
                    data-vv-name="profile.timezone" 
                    label="Standard"
                  ></v-autocomplete>                      
                  <v-text-field
                    v-model="profile.timeformat"
                    label="Time Format"
                    v-validate="'required:max:50'" 
                    :counter="50" 
                    data-vv-name="profile.timeformat" 
                    name="timeformat"
                    :error-messages="errors.collect('profile.timeformat')"   
                    required                  
                  ></v-text-field>         
                  <v-text-field
                    v-model="profile.playerTrackLimit"
                    type="number"
                    label="Player Track Limit"
                    data-vv-name="profile.playertracklimit" 
                    name="playertracklimit"
                  ></v-text-field>   
                  <v-text-field
                    v-model="profile.randomReleaseLimit"
                    type="number"
                    label="Rdnom Release Limit"
                    data-vv-name="profile.randomReleaseLimit" 
                    name="randomReleaseLimit"
                  ></v-text-field> 
                  <v-text-field
                    v-model="profile.recentlyPlayedLimit"
                    type="number"
                    label="Recently Played Limit"
                    data-vv-name="profile.recentlyPlayedLimit" 
                    name="recentlyPlayedLimit"
                  ></v-text-field>                                                                            

              </v-card-text>
            </v-card>
              <v-card v-if="selectedListItem == 1">
                <v-card-title class="primary">Change Password</v-card-title>
                <v-card-text>
                  <v-text-field 
                    v-model="password" 
                    v-validate="'min:6|verify_password'" 
                    label="New Password" 
                    ref="password" 
                    data-vv-name="password" 
                    type="password" 
                    name="password"
                    :error-messages="errors.collect('password')" 
                    ></v-text-field>
                  <v-text-field 
                    v-model="passwordConfirmation" 
                    v-validate="'confirmed:password'"
                    data-vv-as="password"
                    data-vv-name="passwordConfirmation" 
                    label="Repeat New Password" 
                    type="password" 
                    name="passwordConfirmation"
                    :error-messages="errors.collect('passwordConfirmation')" 
                    ></v-text-field>
                        
                </v-card-text>
              </v-card>            
              <v-card v-if="selectedListItem == 2">
                <v-card-title class="primary">FTP</v-card-title>
                <v-card-text>
                    <v-text-field
                      v-model="profile.ftpUrl"
                      label="FTP Url"
                      v-validate="'max:250'" 
                      :counter="20" 
                      data-vv-name="profile.ftpUrl" 
                      name="ftpUrl"
                      :error-messages="errors.collect('profile.ftpUrl')" 
                    ></v-text-field>   
                    <v-text-field
                      v-model="profile.ftpDirectory"
                      label="FTP Directory"
                      v-validate="'max:500'" 
                      :counter="20" 
                      data-vv-name="profile.ftpDirectory" 
                      name="ftpDirectory"
                      :error-messages="errors.collect('profile.ftpDirectory')" 
                    ></v-text-field>           
                    <v-text-field
                      v-model="profile.ftpUsername"
                      label="FTP Username"
                      v-validate="'max:50'" 
                      :counter="20" 
                      data-vv-name="profile.ftpUsername" 
                      name="ftpUsername"
                      :error-messages="errors.collect('profile.ftpUsername')" 
                    ></v-text-field>   
                    <v-text-field
                      v-model="profile.ftpUsername"
                      label="FTP Password"
                      v-validate="'max:500'" 
                      :counter="20" 
                      data-vv-name="profile.ftpPassword" 
                      name="ftpPassword"
                      :error-messages="errors.collect('profile.ftpPassword')" 
                    ></v-text-field>                                            
                </v-card-text>
              </v-card>
            <v-card v-if="selectedListItem == 3">
              <v-card-title class="primary">Profile</v-card-title>
              <v-card-text>
                <markdown-editor v-model="profile.profile" ref="markdownEditor"></markdown-editor>
              </v-card-text>
            </v-card>                        
          </v-flex>
        </v-layout>
        <v-layout row wrap>
        <v-spacer></v-spacer>
        <v-btn @click="save" color="info">Save</v-btn>
        </v-layout>
    </v-container> 
    <v-alert
        v-model="alert"
        dismissible
        type="success"
        @input="v => v || signOut()"
      >
        You have changed either your email or username, you will be signed out.
      </v-alert>       
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import { EventBus } from '@/event-bus.js';
  import markdownEditor  from 'vue-simplemde/src/markdown-editor'

  import Vue from 'vue';
  import VeeValidate from 'vee-validate';

  Vue.use(VeeValidate);

  VeeValidate.Validator.extend('verify_password', {
      // eslint-disable-next-line
      getMessage: field => `The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
      validate: value => {
          // eslint-disable-next-line
          var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
          return strongRegex.test(value);
      }
  }); 

  export default {
    components: { Toolbar, markdownEditor  }, 
    $_veeValidate: {
      validator: 'new'
    },        
    created() {
    },    
    beforeDestroy() {
    },    
    async mounted() {
      this.$validator.localize('en', this.dictionary);
      this.updateData();      
    },  
    computed: {
    },    
    methods: {          
      signOut: function() {
        this.$store.dispatch('signout')
        this.$router.go('/'); 
      },
      updateData: async function() {
        EventBus.$emit("loadingStarted");   
        this.$axios
          .get(
            process.env.VUE_APP_API_URL + `/users/${this.$store.getters.userId}`
          )
          .then(rr => {
            this.profile = rr.data.data;
            this.imageUrl = rr.data.data.avatar.url + '?ts=' + new Date().getTime();
            this.profile.avatarUrl = rr.data.data.avatar.url;
            this.originalEmail = this.profile.email;
            this.originalUsername = this.profile.username;
            this.loaded = true;
            EventBus.$emit("loadingComplete");
          });      
      },
      resetImage() {
        this.imageUrl = this.profile.avatarUrl;
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
      save () {
        let that = this;
        this.$validator.validateAll().then(result => {
          if(result) {
            var data = {
              userId: this.$store.getters.userId,
              concurrencyStamp: that.profile.concurrencyStamp,              
              isPrivate: that.profile.isPrivate,
              doUseHtmlPlayer: that.profile.doUseHtmlPlayer,
              removeTrackFromQueAfterPlayed: that.profile.removeTrackFromQueAfterPlayed,
              userName: that.profile.userName,
              apiToken: that.profile.apiToken,
              email: that.profile.email,
              timeformat: that.profile.timeformat,
              playerTrackLimit: that.profile.playerTrackLimit,
              randomReleaseLimit: that.profile.randomReleaseLimit,
              recentlyPlayedLimit: that.profile.recentlyPlayedLimit,
              ftpUrl: that.profile.ftpUrl,
              ftpDirectory: that.profile.ftpDirectory,
              ftpUsername: that.profile.ftpUsername,
              profile: that.profile.profile,
              timezone: this.profile.timezone,
              password: this.password,
              passwordConfirmation: this.passwordConfirmation
            }
            if(that.imageUrl != that.profile.avatarUrl) {
              data.avatardata = that.imageUrl;
            }           
            this.$axios
              .post('/users/profile/edit',data)
              .then(response => {
                if(!response.data.isSuccess) {
                  EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" }); 
                  return false;
                }
                if(that.originalEmail != that.profile.email || that.originalUsername != that.profile.username) {
                  that.alert = true;
                } else {
                  EventBus.$emit("showSnackbar", { text: "Successfully Edit Account settings"});
                  localStorage.setItem("user", JSON.stringify(response.data));
                  this.$store.commit("signinSuccess", response.data);         
                  this.updateData();      
                }
            });
          }
        });
      }      
    },  
    watch: {
      pagination: { 
        async handler() {
            this.updateData();
        }
      }
    },
    data: () => ({
      loaded: false,
      alert: false,
      valid: false,
      dialog: false,
      imageName: '',
      imageUrl: '',
      imageFile: '',      
      password: '',
      passwordConfirmation: '',
      selectedListItem: 0,   
      dictionary: {
        custom: {
          passwordConfirmation: {
            required: () => 'Passwords must match',
          }
        }
      },        
      originalEmail: '',
      originalUsername: '',
      menuItems: [],
      profile: {
        concurrencyStamp: null,
        userName: null,
        isPrivate: null,
        doUseHtmlPlayer: false,
        apiToken: null,
        email: null,
        timezone: null,
        timeformat: null,
        playerTrackLimit: 50,
        randomReleaseLimit: 20,
        recentlyPlayedLimit: 20,
        ftpUrl: null,
        ftpDirectory: null,
        ftpUsername: null,
        ftpPassword: null,
        profile: null,
        avatarUrl: null
      }
    })
  }
</script>

<style>
  @import '~simplemde/dist/simplemde.min.css';
  .account-settings-container .markdown-editor {
    background-color: white;
  }
  .account-settings-container .error--text {
    color: yellow !important;
  }
  .account-settings-container img.profile-image {
    height: 80px;
    width: 80px;
  }
</style>
