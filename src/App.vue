<template>
  <v-app> 
    <template>
      <v-app :dark="$vuetify.dark" >
        <v-content>
          <Navbar />   
          <div class="page-wrapper">
            <router-view></router-view>
          </div>                   
           <!-- App Footer -->
          <v-footer v-if="!hide" :dark="$vuetify.dark" height="auto" class="pa-3 app--footer">
            <v-icon color="pink" class="mr-1" small>fas fa-archive</v-icon><span class="caption mr-1"> Last System Scan: {{ this.$store.getters.lastScanDate }}</span>            
            <v-spacer></v-spacer>
            <span class="caption mr-1"> Roadie v.01 alpha</span><v-icon color="pink" small>fa fa-flask</v-icon>
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
import store from '@/store';

export default {
  store,
  components: { Navbar },
  name: 'App',
  computed: {
    hide () {
      return this.$route.path === '/signin' || this.$route.path === '/register'; 
    }    
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