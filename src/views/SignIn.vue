<template>
  <v-container class="sign-in-container">
    <v-layout row wrap class="text-xs-center">
      <v-flex xs12 sm5 md4 lg3>
        <v-img :src="logoUrl" class=""></v-img>
      </v-flex>
      <v-flex xs12 sm7 md8 lg9 class="grey darken-2">
        <v-container class="text-xs-center">
          <v-card flat>
            <v-card-title primary-title>
              <h4>Sign In</h4>
            </v-card-title>
            <v-form ref="form" class="ma-1" v-model="valid" lazy-validation>
              <v-text-field
                prepend-icon="person"
                v-model="username"
                :rules="usernameRules"
                :counter="20"
                label="Username"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                required
                @keyup.enter.native="submit"
              ></v-text-field>
              <v-card-actions>
                <v-btn v-if="!isRegistrationClosed" to="/register" small round>Register</v-btn>
                <v-btn @click="resetPassword" small round>Forgot Password</v-btn>
                <v-spacer></v-spacer>
                <v-btn :disabled="!valid" @click="submit" color="success" round medium>Sign In</v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-container>
        <v-container v-if="signInMessage">
          <v-card flat>
            <v-card-text v-html="signInMessage"></v-card-text>
          </v-card>
        </v-container>        
      </v-flex>
    </v-layout>
    <confirm ref="confirm"></confirm>
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">Reset Password Email Sent</v-card-title>
        <v-card-text>Reset password has been sent. There will be a link to click in the email, click it and then enter your username and new password.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="dialog = false">Got it!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Confirm from "@/views/Confirm";
import { EventBus } from "@/event-bus.js";
import getEnv from '@/utils/env.js';
export default {
  components: {
    Confirm
  },
  async mounted() {
    let that = this;
    this.$axios
      .get(
        window.location.protocol + "//" + window.location.host + "/messages/signin_message.html"
      )
      .then(response => {
        that.signInMessage = response.data;  
      })
      .catch(function () {
        that.signInMessage = null;
    });       
    this.$axios.get("/auth/registeroptions")
        .then(response => {
            this.isRegistrationClosed = response.data.isRegistrationClosed
        });      
  },
  data: () => ({
    valid: false,
    dialog: false,
    signInMessage: null,
    isRegistrationClosed: true,
    username: "",
    usernameRules: [v => !!v || "Username is required"],
    password: "",
    passwordRules: [v => !!v || "Password is required"]
  }),
  computed: {
    logoUrl() {
      return require("@/assets/img/logo.png");
    }
  },
  methods: {
    resetPassword() {
      let that = this;
      this.$refs.confirm
        .open("Reset Password?", "Want to get a reset password email?", {
          color: "orange"
        })
        .then(confirm => {
          if (confirm) {
            let callbackUrl =
              window.location.protocol +
              "//" +
              window.location.host +
              "/resetpassword";
            this.$axios
              .get(
                getEnv('ROADIE_API_URL') +
                  "/auth/sendpasswordresetemail?username=" +
                  encodeURIComponent(that.username) +
                  "&callbackurl=" +
                  encodeURIComponent(callbackUrl)
              )
              .then(() => {
                that.dialog = true;
              });
          }
        });
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$axios
          .post("/auth/token", {
            username: this.username,
            password: this.password
          })
          .then(response => {
            localStorage.setItem("user", JSON.stringify(response.data));
            this.$store.commit("signinSuccess", response.data);
            this.$emit("signedIn");
            if (this.$route.params.nextUrl != null) {
              this.$router.push(this.$route.params.nextUrl);
            } else {
              this.$router.push("/");
            }
          })
          .catch(() => {
            EventBus.$emit("showSnackbar", {
              text: "Proabably used the wrong password!",
              color: "red"
            });
          });
      }
    }
  }
};
</script>




<style>
</style>
