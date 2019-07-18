<template>
  <v-container>
    <v-layout row wrap class="register-container text-xs-center">
      <v-flex xs12 sm5 md4 lg3>
        <v-img v-if="!registering" :src="logoUrl" class></v-img>
        <v-img v-if="registering" :src="registeringUrl" alt="Registering..." class></v-img>
      </v-flex>
      <v-flex xs12 sm7 md8 lg9 class="grey darken-2">
        <v-container v-if="registering">
          <h3 class="pa-2 accent">Contacting the cosmos...</h3>
        </v-container>
        <v-container v-if="!registering" class="text-xs-center">
          <v-card flat>
            <v-card-title primary-title>
              <h4>Register</h4>
            </v-card-title>
            <form class="ma-2">
              <v-text-field
                v-if="requireInviteToken"
                prepend-icon="redeem"
                v-model="inviteToken"
                v-validate="'required|max:50'"
                :counter="20"
                label="Invite Token"
                data-vv-name="inviteToken"
                :error-messages="errors.collect('inviteToken')"
                required
              ></v-text-field>              
              <v-text-field
                prepend-icon="person"
                v-model="username"
                v-validate="'required|max:20'"
                :counter="20"
                label="Username"
                data-vv-name="username"
                :error-messages="errors.collect('username')"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="email"
                v-model="email"
                v-validate="'required|email|max:100'"
                :counter="100"
                label="Email"
                data-vv-name="email"
                :error-messages="errors.collect('email')"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="password"
                v-validate="'required|min:6|verify_password'"
                label="Password"
                ref="password"
                data-vv-name="password"
                type="password"
                :error-messages="errors.collect('password')"
                required
              ></v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="passwordConfirmation"
                v-validate="'required|confirmed:password'"
                data-vv-as="password"
                data-vv-name="passwordConfirmation"
                label="Confirm Password"
                type="password"
                :error-messages="errors.collect('passwordConfirmation')"
                required
              ></v-text-field>
              <v-card-actions>
                <v-btn to="/signin" small round>Sign In</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="submit" primary color="success" large round>Register</v-btn>
              </v-card-actions>
            </form>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
    <v-layout v-if="errorMessage" row wrap class="error-container">
      <h3 class="text-xs-center my-2 error">{{ errorMessage }}</h3>
    </v-layout>
  </v-container>
</template>

<script>
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
  $_veeValidate: {
    validator: "new"
  },
  data: () => ({
    valid: false,
    registering: false,
    requireInviteToken: false,
    inviteToken: null,
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errorMessage: null,
    dictionary: {
      custom: {
        passwordConfirmation: {
          required: () => "Passwords must match"
        }
      }
    }
  }),
  computed: {
    logoUrl() {
      return require("@/assets/img/logo.png");
    },
    registeringUrl() {
      return require("@/assets/img/trippy.gif");
    },

  },
  mounted() {
    this.$validator.localize("en", this.dictionary);
    this.inviteToken = this.$route.query.it;
    this.$axios.get("/auth/registeroptions")
        .then(response => {
            this.requireInviteToken = response.data.useRegistrationTokens
        });      
  },
  methods: {
    submit() {
      let that = this;
      this.errorMessage = null;
      this.$validator.validateAll().then(result => {
        if (result) {
          this.registering = true;                  
          this.$axios
            .post("/auth/register", {
              inviteToken: that.inviteToken,
              username: that.username,
              password: that.password,
              passwordconfirmation: that.passwordConfirmation,
              email: that.email
            })
            .then(response => {
              localStorage.setItem("user", JSON.stringify(response.data));
              that.$store.commit("signinSuccess", response.data);
              that.$emit("signedIn");
              if (that.$route.params.nextUrl != null) {
                that.$router.push(that.$route.params.nextUrl);
              } else {
                that.$router.push("/");
              }
            })
            .catch(error => {
              if(error && error.data) {
                this.errorMessage = error.data.title;
              } else {
                this.errorMessage = "An error has occured.";
              }
              this.registering = false;
            });            
        }
      });
    }
  }
};
</script>


<style>
.register-container .error--text {
  color: yellow !important;
}
</style>
