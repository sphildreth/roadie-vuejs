<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :toolbarIcon="'supervised_user_circle'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator :items="items" :rows-per-page-items="this.$store.getters.rowsPerPageItems" :total-items="pagination.totalItems"  :pagination.sync="pagination" content-tag="v-layout" :loading="true" row wrap>
          <v-flex slot="item" slot-scope="props" xs12 sm6 lg2>
            <UserCard :user="props.item" :showStats="true"></UserCard>            
          </v-flex>
      </v-data-iterator>      
    </v-container> 
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import UserCard from "@/components/UserCard";
  import { EventBus } from '@/event-bus.js';
  import getEnv from '@/utils/env.js';

  export default {
    components: { UserCard, Toolbar }, 
    created() {
      this.pagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;      
      EventBus.$on("toolbarRefresh", this.updateData);
    },    
    beforeDestroy() {
      EventBus.$off("toolbarRefresh", this.updateData);     
    },    
    async mounted() {
      this.updateData();
    },  
    methods: {          
      updateData: async function() {
        EventBus.$emit("loadingStarted"); 
          await this.$axios.get(getEnv('ROADIE_API_URL') + `/users?page=${ this.pagination.page }&limit=${ this.pagination.rowsPerPage }&order=${ this.pagination.sortOrder  }&sort=${ this.pagination.sortBy }`)
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
      pagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'user.text',
        sortOrder: "ASC"
      },
      selected: [],
      menuItems: [],
      items: []
    })
  }
</script>

<style>
</style>
