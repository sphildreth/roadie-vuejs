<template>
  <v-app class="grey lighten-1">
    <Navbar />
    <v-content>
      <router-view></router-view>
    </v-content>    
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
  data () {
    return {      
    }
  }
}
</script>