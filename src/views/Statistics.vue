<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'assessment'"></Toolbar>
      <v-container fluid grid-list-md>
          <div class="col-12">

          </div>
      </v-container>
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import { EventBus } from '@/event-bus.js';
  
  export default {
    components: { Toolbar }, 
    created() {
      EventBus.$on('toolbarRefresh', this.updateData);
    },    
    async mounted() {
      this.updateData();
    },  
    methods: {          
      updateData: async function() {
         EventBus.$emit("loadingStarted"); 
          this.$axios.get(process.env.VUE_APP_API_URL + `/stats/releasesByDate`)
          .then(response => {
            this.releasesByDate = response.data;
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
      releasesByDate: [],
      // areaChartData: {
      //   chartType: "areaChart",
      //   selector: "areaChart",
      //   title: "Releases By Release Year",
      //   width: 600,
      //   height: 500,
      //   metric: ["total"],
      //   dim: "month",
      //   data: this.releasesByDate,
      //   legends: {
      //     enabled: true,
      //     height: 25,
      //     width: 50
      //   }
      // },
      menuItems: []
    })
  }
</script>

<style>
</style>
