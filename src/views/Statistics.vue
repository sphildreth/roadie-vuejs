<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'assessment'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-card class="mb-3" >
        <v-card-title>Artists Added By Date</v-card-title>
        <v-card-text>
            <ArtistsByDateChart 
              v-if="loaded" 
              :chartdata="artistsByDate" 
              :options="options">
            </ArtistsByDateChart>
          
        </v-card-text>
      </v-card>       
      <v-card class="mb-3" >
        <v-card-title>Releases Added By Date</v-card-title>
        <v-card-text>
            <ReleasesByDateChart 
              v-if="loaded" 
              :chartdata="releasesByDate" 
              :options="options">
            </ReleasesByDateChart>
          
        </v-card-text>
      </v-card>    
      <v-card class="mb-3" >
        <v-card-title>Releases By Decade</v-card-title>
        <v-card-text>
            <ReleasesByDecadeChart 
              v-if="loaded" 
              :chartdata="releasesByDecade" 
              :options="options">
            </ReleasesByDecadeChart>            
        </v-card-text>
      </v-card>   
      <v-layout row wrap>
        <v-flex md3>
          <v-card class="mb-3" >        
            <v-card-title>Songs Played By User</v-card-title>
            <v-card-text>
                <UserStatisticChart 
                  v-if="loaded" 
                  :chartdata="songsPlayedByUser" 
                  :options="options">
                </UserStatisticChart>            
            </v-card-text>
          </v-card>           
        </v-flex>
        <v-flex md3>        
          <v-card class="mb-3" >        
            <v-card-title>Artists Rated By User</v-card-title>
            <v-card-text>
                <UserStatisticChart 
                  v-if="loaded" 
                  :chartdata="ratedArtistsByUser" 
                  :options="options">
                </UserStatisticChart>            
            </v-card-text>
          </v-card>         
        </v-flex>    
        <v-flex md3>        
          <v-card class="mb-3" >        
            <v-card-title>Releases Rated By User</v-card-title>
            <v-card-text>
                <UserStatisticChart 
                  v-if="loaded" 
                  :chartdata="ratedReleasesByUser" 
                  :options="options">
                </UserStatisticChart>            
            </v-card-text>
          </v-card>         
        </v-flex>     
        <v-flex md3>        
          <v-card class="mb-3" >        
            <v-card-title>Tracks Rated By User</v-card-title>
            <v-card-text>
                <UserStatisticChart 
                  v-if="loaded" 
                  :chartdata="ratedTracksByUser" 
                  :options="options">
                </UserStatisticChart>            
            </v-card-text>
          </v-card>         
        </v-flex>               
      </v-layout>      
      <v-card class="mb-3" >
        <v-card-title>Songs Played By Date</v-card-title>
        <v-card-text>
            <SongsPlayedByDateChart 
              v-if="loaded" 
              :chartdata="songsPlayedByDate" 
              :options="options">
            </SongsPlayedByDateChart>            
        </v-card-text>
      </v-card>             
    </v-container>
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import { EventBus } from '@/event-bus.js';
  import getEnv from '@/utils/env.js';
  import ArtistsByDateChart from '@/components/ArtistsByDateChart';
  import ReleasesByDateChart from '@/components/ReleasesByDateChart';
  import ReleasesByDecadeChart from '@/components/ReleasesByDecadeChart';
  import SongsPlayedByDateChart from '@/components/SongsPlayedByDateChart';
  import UserStatisticChart from '@/components/UserStatisticChart';

  export default {
    components: { Toolbar, ArtistsByDateChart, ReleasesByDateChart, ReleasesByDecadeChart, UserStatisticChart, SongsPlayedByDateChart }, 
    created() {
      EventBus.$on("toolbarRefresh", this.updateData);
    },    
    beforeDestroy() {
      EventBus.$off("toolbarRefresh", this.updateData);  
    },     
    async mounted() {
      await this.updateData();
    },  
    methods: {          
      randomColor: function(numOfSteps, step) {
        var r, g, b;
        var h = step / numOfSteps;
        var i = ~~(h * 6);
        var f = h * 6 - i;
        var q = 1 - f;
        switch(i % 6){
            case 0: r = 1; g = f; b = 0; break;
            case 1: r = q; g = 1; b = 0; break;
            case 2: r = 0; g = 1; b = f; break;
            case 3: r = 0; g = q; b = 1; break;
            case 4: r = f; g = 0; b = 1; break;
            case 5: r = 1; g = 0; b = q; break;
        }
        var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
        return (c);
      },
      updateArtistByDate: async function() {
        await this.$axios.get(getEnv('ROADIE_API_URL') + `/stats/artistsByDate`)
        .then(response => {
          let labels = [];
          let data = [];
          let bgColors = [];
          response.data.data.forEach((v) => {
              labels.push(v.date);
              data.push(v.count);
              bgColors.push(this.randomColor(response.data.data.length, bgColors.length));
          });            
          this.artistsByDate = {
            labels: labels,
            datasets: [{
              label:  'Artist Count',
              backgroundColor: bgColors,
              data: data
            }]
          }
        });
      },
      updateReleasesByDate: async function() {
        await this.$axios.get(getEnv('ROADIE_API_URL') + `/stats/releasesByDate`)
        .then(response => {
          let labels = [];
          let data = [];
          let bgColors = [];
          response.data.data.forEach((v) => {
              labels.push(v.date);
              data.push(v.count);
              bgColors.push(this.randomColor(response.data.data.length, bgColors.length));
          });            
          this.releasesByDate = {
            labels: labels,
            datasets: [{
              label: 'Release Count',
              backgroundColor: bgColors,
              data: data
            }]
          }
        });        
      },
      updateReleasesByDecade: async function() {
        await this.$axios.get(getEnv('ROADIE_API_URL') + `/stats/releasesByDecade`)
        .then(response => {
          let labels = [];
          let data = [];
          let bgColors = [];          
          response.data.data.forEach((v) => {
            labels.push(v.date);
            data.push(v.count);
            bgColors.push(this.randomColor(response.data.data.length, bgColors.length));            
          });            
          this.releasesByDecade = {
            labels: labels,
            datasets: [{
              label: 'Release Count',
              backgroundColor: bgColors,
              data: data
            }]
          }          
        });
      },
      updateSongsPlayedByDate: async function() {
        await this.$axios.get(getEnv('ROADIE_API_URL') + `/stats/songsPlayedByDate`)
        .then(response => {
          let labels = [];
          let data = [];
          let bgColors = [];          
          response.data.data.forEach((v) => {
            labels.push(v.date);
            data.push(v.count);
            bgColors.push(this.randomColor(response.data.data.length, bgColors.length));
          });            
          this.songsPlayedByDate = {
            labels: labels,
            datasets: [{
              label: 'Played Count',
              backgroundColor: bgColors,
              data: data
            }]
          }          
        });
      },    
      updateUserStats: async function() {
        await this.$axios.get(getEnv('ROADIE_API_URL') + '/users?page=1&limit=50')
        .then(response => {
          let labels = [];
          let spData = [];
          let raData = [];
          let rrData = [];
          let rtData = [];
          let bgColors = [];
          response.data.rows.forEach((v) => {
            labels.push(v.user.text);
            spData.push(v.statistics.playedTracks);
            raData.push(v.statistics.ratedArtists);
            rrData.push(v.statistics.ratedReleases);
            rtData.push(v.statistics.ratedTracks);
            bgColors.push(this.randomColor(response.data.rows.length, bgColors.length));
          });            
          this.songsPlayedByUser = {
            labels: labels,
            datasets: [{
              label: 'Played Count',
              backgroundColor: bgColors,
              data: spData
            }]
          }            
          this.ratedArtistsByUser = {
            labels: labels,
            datasets: [{
              label: 'Rated Artists',
              backgroundColor: bgColors,
              data: raData
            }]
          };
          this.ratedReleasesByUser = {
            labels: labels,
            datasets: [{
              label: 'Rated Releases',
              backgroundColor: bgColors,
              data: rrData
            }]
          };
          this.ratedTracksByUser = {
            labels: labels,
            datasets: [{
              label: 'Rated Tracks',
              backgroundColor: bgColors,
              data: rtData
            }]
          }                                     
        });
      },
      updateData: async function() {
         EventBus.$emit("loadingStarted"); 
         await this.updateArtistByDate();
         await this.updateReleasesByDate();
         await this.updateReleasesByDecade();
         await this.updateSongsPlayedByDate();
         await this.updateUserStats();
         EventBus.$emit("loadingComplete");       
         this.loaded = true;      
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
      options: {
        responsive: true, 
        maintainAspectRatio: false
      },
      artistsByDate: null,
      releasesByDate: null,
      releasesByDecade: null,
      songsPlayedByDate: null,
      songsPlayedByUser: null,
      ratedArtistsByUser: null,
      ratedReleasesByUser: null,
      ratedTracksByUser: null,
      menuItems: []
    })
  }
</script>

<style>
</style>
