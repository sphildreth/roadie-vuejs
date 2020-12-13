<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :toolbarIcon="'label'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator :items="items" :rows-per-page-items="this.$store.getters.rowsPerPageItems" :total-items="pagination.totalItems"  :pagination.sync="pagination" content-tag="v-layout" :loading="true" row wrap>
          <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
            <LabelCard :label="props.item"></LabelCard>
          </v-flex>
      </v-data-iterator>      
    </v-container> 
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import LabelCard from '@/components/LabelCard';
  import { EventBus } from '@/event-bus.js';
  import getEnv from '@/utils/env.js';

  export default {
    components: { LabelCard, Toolbar }, 
    created() {
      this.pagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;      
      EventBus.$on('l:viewRandom', this.viewRandom);
      EventBus.$on('l:viewRecentlyAdded', this.viewRecentlyAdded);
      EventBus.$on('l:viewMostArtists', this.viewMostArtists);
      EventBus.$on('l:viewAll', this.viewAll);
      EventBus.$on("toolbarRefresh", this.updateData);   
    },  
    beforeDestroy() {
      EventBus.$off('l:viewRandom', this.viewRandom);
      EventBus.$off('l:viewRecentlyAdded', this.viewRecentlyAdded);
      EventBus.$off('l:viewMostArtists', this.viewMostArtists);
      EventBus.$off('l:viewAll', this.viewAll);
      EventBus.$off("toolbarRefresh", this.updateData);  
    },     
    async mounted() {
      this.viewRandom();            
    },  
    methods: {      
      resetView: function(){
          this.doRandomize = false;
          this.filterFavoriteOnly = false;
          this.pagination.sortOrder = "DESC";
          this.pagination.page = 1;
      },       
      viewRandom: function() {
          this.resetView();        
          this.doRandomize = true;
          this.updateData();
      },
      viewMostArtists: function() {
          this.resetView();                
          this.pagination.sortBy = "ArtistCount";
          this.updateData();
      },          
      viewRecentlyAdded: function() {
          this.resetView();                
          this.pagination.sortBy = "CreatedDate";
          this.updateData();
      },              
      viewAll: function() {
          this.resetView();                
          this.pagination.sortBy = "Label.Text";
          this.pagination.sortOrder = "ASC";
          this.updateData();
      },        
      updateData: async function() {
        EventBus.$emit("loadingStarted"); 
          await this.$axios.get(getEnv('ROADIE_API_URL') + `/labels?page=${ this.pagination.page }&limit=${ this.pagination.rowsPerPage }&order=${ this.pagination.sortOrder  }&sort=${ this.pagination.sortBy }&doRandomize=${ this.doRandomize}`)
          .then(response => {
            this.items = response.data.rows;
            this.pagination.totalItems = response.data.totalCount;    
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
      doRandomize: false,      
      pagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'CreatedDate',
        sortOrder: "DESC"
      },
      selected: [],
      menuItems: [
        { title: "Most Artists", class: "hidden-sm-and-down", click: "l:viewMostArtists" },       
        { title: "Random", class:"selected-toolbar-item", click: "l:viewRandom" },
        { title: "Recently Added", class: "hidden-xs-only", click:"l:viewRecentlyAdded" },        
        { title: "All", class:"", click: "l:viewAll" }        
      ],
      items: []
    })
  }
</script>

<style>
</style>
