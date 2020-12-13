<template>
  <div>
    <Toolbar
      :menuItems="menuItems"
      :doMenuSelected="true"
      :doShowRefresh="false"
      :toolbarIcon="'settings'"
    ></Toolbar>
    <v-container fluid grid-list-md class="account-settings-container">
      <v-tabs class="profile-tabs" color="primary" v-model="profileTab" slider-color="accent">
        <v-tab>General</v-tab>
        <v-tab>Password</v-tab>
        <v-tab>FTP</v-tab>
        <v-tab>Profile</v-tab>
        <v-tab>Integrations</v-tab>
        <v-tab-item>
          <v-layout row class="ma-1 mb-3">
            <v-flex xs4 md1>
              <img v-if="loaded" :src="imageUrl" :alt="profile.userName" class="profile-image">
              <img>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
              >
            </v-flex>
            <v-flex xs8 md11>
              <v-btn @click="changeAvatar" color="info">Upload new thumbnail</v-btn>
              <v-btn @click="resetImage" color>Reset</v-btn>
              <div
                class="caption ml-2"
              >Allowed JPG, GIF or PNG. Image will be converted to GIF.</div>
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
            label="Random Release Limit"
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
        <v-select
          :items="this.$store.getters.rowsPerPageItems"
          v-model="profile.defaultRowsPerPage"
          label="Default Rows Per Page"
          data-vv-name="profile.defaultRowsPerPage"
          name="defaultRowsPerPage"
          :error-messages="errors.collect('profile.defaultRowsPerPage')"     
          required     
        ></v-select>

        </v-tab-item>
        <v-tab-item>
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
        </v-tab-item>
        <v-tab-item>
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
        </v-tab-item>
        <v-tab-item>
          <markdown-editor v-model="profile.profile" ref="markdownEditor"></markdown-editor>
        </v-tab-item>
        <v-tab-item>
          <v-layout row class="ma-1 mb-3" v-if="additionalClientData.lastFMIntegrationUrl">
            <v-flex xs3 xl1>
              <v-btn @click="integrateLastFM" color="info">Enable LastFM</v-btn>
            </v-flex>
            <v-flex xs9 xl10 class="mt-2 ml-2">
              <div>Click to enable 'Scrobbling' and 'Now Playing' integration on LastFM</div>              
            </v-flex>
          </v-layout>
        </v-tab-item>        
      </v-tabs>
    </v-container>
    <v-alert
      v-model="alert"
      dismissible
      type="success"
      @input="v => v || signOut()"
    >You have changed either your email or username, you will be signed out.</v-alert>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import markdownEditor from "vue-simplemde/src/markdown-editor";
import getEnv from '@/utils/env.js';

import Vue from "vue";
import VeeValidate from "vee-validate";

Vue.use(VeeValidate);

VeeValidate.Validator.extend("verify_password", {
  // eslint-disable-next-line
  getMessage: field =>
    `The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
  validate: value => {
    // eslint-disable-next-line
    var strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return strongRegex.test(value);
  }
});

export default {
  components: { Toolbar, markdownEditor },
  $_veeValidate: {
    validator: "new"
  },
  created() {
    EventBus.$on("as:Save", this.save);
    EventBus.$on("as:Cancel", this.cancel);
  },
  beforeDestroy() {
    EventBus.$off("as:Save", this.save);
    EventBus.$off("as:Cancel", this.cancel);
  },
  async mounted() {
    this.$validator.localize("en", this.dictionary);
    this.updateData();
  },
  computed: {},
  methods: {
    cancel() {
      this.$router.push("/");
    },
    signOut: function() {
      this.$store.dispatch("signout");
      this.$router.go("/");
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(
          getEnv('ROADIE_API_URL') + `/users/accountsettings/${this.$store.getters.userId}`
        )
        .then(rr => {
          this.profile = rr.data.data;
          this.imageUrl =
            rr.data.data.avatar.url + "?ts=" + new Date().getTime();
          this.profile.avatarUrl = rr.data.data.avatar.url;
          this.originalEmail = this.profile.email;
          this.originalUsername = this.profile.username;
          this.additionalClientData = rr.data.additionalClientData;
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
    integrateLastFM() {
      window.open(this.additionalClientData.lastFMIntegrationUrl, "_blank");
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
    save() {
      let that = this;
      this.$validator.validateAll().then(result => {
        if (result) {
          var data = {
            userId: this.$store.getters.userId,
            concurrencyStamp: that.profile.concurrencyStamp,
            isPrivate: that.profile.isPrivate,
            doUseHtmlPlayer: that.profile.doUseHtmlPlayer,
            removeTrackFromQueAfterPlayed:
              that.profile.removeTrackFromQueAfterPlayed,
            userName: that.profile.userName,
            apiToken: that.profile.apiToken,
            email: that.profile.email,
            timeformat: that.profile.timeformat,
            playerTrackLimit: that.profile.playerTrackLimit,
            randomReleaseLimit: that.profile.randomReleaseLimit,
            recentlyPlayedLimit: that.profile.recentlyPlayedLimit,
            defaultRowsPerPage: that.profile.defaultRowsPerPage,
            ftpUrl: that.profile.ftpUrl,
            ftpDirectory: that.profile.ftpDirectory,
            ftpUsername: that.profile.ftpUsername,
            profile: that.profile.profile,
            timezone: this.profile.timezone,
            password: this.password,
            passwordConfirmation: this.passwordConfirmation
          };
          if (that.imageUrl != that.profile.avatarUrl) {
            data.avatardata = that.imageUrl;
          }
          this.$axios.post("/users/profile/edit", data).then(response => {
            if (!response.data.isSuccess) {
              EventBus.$emit("showSnackbar", {
                text: "An error has occured",
                color: "red"
              });
              return false;
            }
            if (
              that.originalEmail != that.profile.email ||
              that.originalUsername != that.profile.username
            ) {
              that.alert = true;
            } else {
              EventBus.$emit("showSnackbar", {
                text: "Successfully Edit Account settings"
              });
              localStorage.setItem("user", JSON.stringify(response.data));
              this.$store.commit("signinSuccess", response.data);
              this.updateData();
            }
          })
          .catch(err => {
            EventBus.$emit("showSnackbar", { text: err.data[0], color: "red" });
          })           
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
    profileTab: 0,
    loaded: false,
    alert: false,
    valid: false,
    dialog: false,
    imageName: "",
    imageUrl: "",
    imageFile: "",
    password: "",
    passwordConfirmation: "",
    selectedListItem: 0,
    dictionary: {
      custom: {
        passwordConfirmation: {
          required: () => "Passwords must match"
        }
      }
    },
    originalEmail: "",
    originalUsername: "",
    menuItems: [
      { title: "Save", class: "hidden-xs-only", click: "as:Save" },
      { title: "Cancel", class: "hidden-xs-only", click: "as:Cancel" }
    ],
    additionalClientData: {
      lastFMIntegrationUrl: null
    },    
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
};
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
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
