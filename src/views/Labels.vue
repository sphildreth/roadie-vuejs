<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :toolbarIcon="'label'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator :items="items" :rows-per-page-items="rowsPerPageItems" :total-items="pagination.totalItems"  :pagination.sync="pagination" content-tag="v-layout" :loading="true" row wrap>
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

  export default {
    components: { LabelCard, Toolbar }, 
    created() {
      EventBus.$on('toolbarRefresh', this.updateData);
    },    
    async mounted() {
      this.updateData();
    },  
    methods: {          
      updateData: async function() {
        EventBus.$emit("loadingStarted"); 
          this.$axios.get(process.env.VUE_APP_API_URL + `/labels?page=${ this.pagination.page }&limit=${ this.pagination.rowsPerPage }&order=${ this.pagination.sortOrder  }&sort=${ this.pagination.sortBy }`)
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
      rowsPerPageItems: [12, 36, 60, 120],
      pagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'CreatedDate',
        sortOrder: "DESC"
      },
      selected: [],
      menuItems: [],
      items: []
    })
  }
</script>

<style>
</style>
