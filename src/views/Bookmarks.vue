<template>
  <div>
    <Toolbar :menuItems="menuItems" :doMenuSelected=true :toolbarIcon="'bookmarks'"></Toolbar>
    <v-container fluid grid-list-md>
      <v-data-iterator :items="items" :rows-per-page-items="rowsPerPageItems" :total-items="pagination.totalItems"  :pagination.sync="pagination" content-tag="v-layout" :loading="true" row wrap>
          <v-flex slot="item" slot-scope="props" xs12 sm6 lg4>
            <ArtistCard v-if="props.item.artist" :artist="props.item.artist"></ArtistCard>
            <ReleaseCard v-if="props.item.release" :release="props.item.release"></ReleaseCard>
            <TrackCard v-if="props.item.track" :track="props.item.track"></TrackCard>
            <LabelCard v-if="props.item.label" :label="props.item.label"></LabelCard>
            <PlaylistCard v-if="props.item.playlist" :playlist="props.item.playlist"></PlaylistCard>
            <CollectionCard v-if="props.item.collection" :collection="props.item.collection"></CollectionCard>
          </v-flex>
      </v-data-iterator>      
    </v-container> 
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import ReleaseCard from '@/components/ReleaseCard';
  import ArtistCard from '@/components/ArtistCard';
  import TrackCard from '@/components/TrackCard';
  import LabelCard from '@/components/LabelCard';
  import PlaylistCard from '@/components/PlaylistCard';
  import CollectionCard from '@/components/CollectionCard';

  import { EventBus } from '@/event-bus.js';

  export default {
    components: { Toolbar, ReleaseCard, ArtistCard, TrackCard, LabelCard, PlaylistCard, CollectionCard }, 
    created() {
      EventBus.$on('toolbarRefresh', this.updateData);
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
          this.$axios.get(process.env.VUE_APP_API_URL + `/bookmarks?page=${ this.pagination.page }&limit=${ this.pagination.rowsPerPage }&order=${ this.pagination.sortOrder  }&sort=${ this.pagination.sortBy }`)
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
