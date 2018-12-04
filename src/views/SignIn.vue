<template>
    <v-container>
        <v-layout row class="text-xs-center">
            <v-flex xs3>
                <v-card height="500px"></v-card>
            </v-flex>
            <v-flex xs4 class="grey lighten-4">
                <v-container style="position: relative;top: 13%;" class="text-xs-center">
                <v-card flat>
                    <v-card-title primary-title>
                    <h4>Sign In</h4>
                    </v-card-title>
                    <v-form ref="form" v-model="valid" lazy-validation>
                        <v-text-field prepend-icon="person" v-model="username" :rules="usernameRules" :counter="20" label="Username" required></v-text-field>
                        <v-text-field prepend-icon="lock" v-model="password" :rules="passwordRules" label="Password" type="password" required></v-text-field>
                        <v-card-actions>
                            <v-btn :disabled="!valid" @click="submit" primary large block>Login</v-btn>
                        </v-card-actions>                
                    </v-form>            
                </v-card>
                </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    data: () => ({
      valid: false,
      username: '',
      usernameRules: [
        v => !!v || 'Username is required'
      ],
      password: '',
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }),
    methods : {
      submit () {
        if (this.$refs.form.validate()) {
            this.$axios.post('/auth/token', {
                username: this.username,
                password: this.password
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
      }
    }     
  }
</script>


<style>

</style>
