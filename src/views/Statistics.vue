<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'assessment'"></Toolbar>
    <v-container fluid grid-list-md>
        <div class="col-12">
            <ReleasesByDateChart v-if="loaded" :chartdata="releasesByDate" :options="options"></ReleasesByDateChart>
        </div>
    </v-container>
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import { EventBus } from '@/event-bus.js';
  import ReleasesByDateChart from '@/components/ReleasesByDateChart';

  export default {
    components: { Toolbar, ReleasesByDateChart }, 
    created() {
      EventBus.$on('toolbarRefresh', this.updateData);
    },    
    beforeDestroy() {
      EventBus.$off('toolbarRefresh', this.updateData);  
    },     
    async mounted() {
      this.updateData();
    },  
    methods: {          
      updateData: async function() {
         EventBus.$emit("loadingStarted"); 
          this.$axios.get(process.env.VUE_APP_API_URL + `/stats/releasesByDate`)
          .then(response => {
            let labels = [];
            let data = [];
            response.data.data.forEach((v) => {
               labels.push(v.date);
               data.push(v.count);
            });            
            this.releasesByDate = {
              labels: labels,
              datasets: [{
                label: 'Release Count',
                backgroundColor: 'secondary',
                data: data
              }]
            } 
            this.loaded = true;
            EventBus.$emit("loadingComplete");    
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
      loaded: false,      
      options: {
        responsive: true, 
        maintainAspectRatio: false
      },
      releasesByDate: null,
      menuItems: []
    })
  }
</script>

<style>
</style>
