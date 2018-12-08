<template>
  <v-app class="grey lighten-1"> 
    <template>
      <v-app>
        <v-content>
          <Navbar />   
          <div class="page-wrapper">
            <router-view></router-view>
          </div>                   
           <!-- App Footer -->
          <v-footer height="auto" class="white pa-3 app--footer">
            <v-spacer></v-spacer>
            <span class="caption mr-1"> Roadie v1.0 alpha</span><v-icon color="pink" small>fa fa-flask</v-icon>
          </v-footer>
        </v-content>    
      </v-app>
    </template>    

  </v-app>
</template>

<style>
  @import './assets/css/site.css';
</style>

<script>
import Navbar from './components/Navbar';

export default {
  components: { Navbar },
  name: 'App',
  methods: {

  },  
  data: () => ({
  })
}
</script>

<style lang="stylus" scoped>
  .setting-fab 
    top:50%!important; 
    right:0;
    border-radius:0  
  .page-wrapper
    min-height:calc(100vh - 64px - 50px - 81px );  

</style>