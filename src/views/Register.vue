<template>
    <v-container>
        <v-layout row class="register-container text-xs-center">
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
                    <h4>Register</h4>
                    </v-card-title>
                    <form class="ma-2">
                        <v-text-field prepend-icon="person" v-model="username" v-validate="'required|max:20'" :counter="20" label="Username" data-vv-name="username" :error-messages="errors.collect('username')" required></v-text-field>
                        <v-text-field prepend-icon="email" v-model="email" v-validate="'required|email|max:100'" :counter="100" label="Email" data-vv-name="email" :error-messages="errors.collect('email')" required></v-text-field>                        
                        <v-text-field prepend-icon="lock" v-model="password" v-validate="'required|min:6|verify_password'" label="Password" ref="password" data-vv-name="password" type="password" :error-messages="errors.collect('password')" required></v-text-field>
                        <v-text-field prepend-icon="lock" v-model="passwordConfirmation" v-validate="'required|confirmed:password'" data-vv-as="password" data-vv-name="passwordConfirmation" label="Confirm Password" type="password" :error-messages="errors.collect('passwordConfirmation')" required></v-text-field>
                        <v-card-actions>
                            <v-btn @click="submit" primary large block>Register</v-btn>
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
      email: '',
      password: '',
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
    },    
    methods : {
      submit () {
        let that = this;
        this.$validator.validateAll().then(result => {
          if(result) {
            this.$axios.post('/auth/register', {
              username: that.username,
              password: that.password,
              passwordconfirmation: that.passwordConfirmation,
              email: that.email
            }).then(response => {
              localStorage.setItem('user',JSON.stringify(response.data));                
              that.$store.commit("signinSuccess", response.data);
              that.$emit('signedIn');
              if(that.$route.params.nextUrl != null){
                  that.$router.push(that.$route.params.nextUrl);
              }
              else {
                  that.$router.push('/');
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
