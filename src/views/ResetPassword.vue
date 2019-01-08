<template>
    <v-container>
        <v-layout row class="reset-password-container text-xs-center">
            <v-flex xs3>
                <v-card height="500px">
                <v-img
                    :src='logoUrl'
                    class="ma-1"
                ></v-img>                     
                </v-card>
            </v-flex>
            <v-flex xs4 class="grey darken-2">
                <v-container  class="text-xs-center">
                <v-card flat>
                    <v-card-title primary-title>
                    <h4>Reset Password</h4>
                    </v-card-title>
                    <form class="ma-2">
                        <v-text-field prepend-icon="person" v-model="username" :counter="20" label="Username" data-vv-name="username" :error-messages="errors.collect('username')" readonly></v-text-field>
                        <v-text-field prepend-icon="lock" v-model="password" v-validate="'required|min:6|verify_password'" label="Password" ref="password" data-vv-name="password" type="password" :error-messages="errors.collect('password')" required></v-text-field>
                        <v-text-field prepend-icon="lock" v-model="passwordConfirmation" v-validate="'required|confirmed:password'" data-vv-as="password" data-vv-name="passwordConfirmation" label="Confirm Password" type="password" :error-messages="errors.collect('passwordConfirmation')" required></v-text-field>
                        <v-card-actions>
                            <v-btn to="/signin"  block>Sign In</v-btn>
                            <v-btn @click="submit" primary large block>Reset</v-btn>
                        </v-card-actions>                
                    </form>            
                </v-card>
                </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>

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
    $_veeValidate: {
      validator: 'new'
    },    
    data: () => ({
      valid: false,
      username: '',
      password: '',
      token: '',
      passwordConfirmation: '',
      dictionary: {
        custom: {
          passwordConfirmation: {
            required: () => 'Passwords must match',
          }
        }
      }          
    }),
    computed: {
      logoUrl () {
        return require('@/assets/img/logo.png')
      }
    },    
    mounted () {
      this.$validator.localize('en', this.dictionary);
      this.token = this.$route.query.token;
      this.username = this.$route.query.username;
    },    
    methods : {
      submit () {
        let that = this;
        this.$validator.validateAll().then(result => {
          if(result) {
            this.$axios.post('/auth/resetpassword', {
              username: that.username,
              password: that.password,
              passwordconfirmation: that.passwordConfirmation,
              token: that.token,
            }).then(response => {
                localStorage.setItem('user',JSON.stringify(response.data));                
                this.$store.commit("signinSuccess", response.data);
                this.$emit('signedIn');
                if(this.$route.params.nextUrl != null){
                    this.$router.push(this.$route.params.nextUrl);
                }
                else {
                    this.$router.push('/');
                }
            });
          }
        });
      }
    }     
  }
</script>


<style>
  .register-container .error--text {
    color: yellow !important;
  }
</style>
