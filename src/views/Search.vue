<template>
    <div class="search-results-container">
        <v-container fluid grid-list-md>
            <v-card dark  v-if="artistItems.length > 0">
                <v-card-title class="subheading accent--text">Artists</v-card-title>
                <v-card-text>
                    <v-data-iterator :items="artistItems" :rows-per-page-items="rowsPerPageItems" :total-items="artistPagination.totalItems"  :pagination.sync="artistPagination" content-tag="v-layout" :loading="true" row wrap>
                        <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
                            <ArtistCard :artist="props.item"></ArtistCard>
                        </v-flex>
                    </v-data-iterator>               
                </v-card-text>
            </v-card>      
            <v-card dark v-if="releaseItems.length > 0">
                <v-card-title class="subheading accent--text">Releases</v-card-title>
                <v-card-text>
                    <v-data-iterator :items="releaseItems" :rows-per-page-items="rowsPerPageItems" :total-items="releasePagination.totalItems"  :pagination.sync="releasePagination" content-tag="v-layout" :loading="true" row wrap>
                        <v-flex slot="item" slot-scope="props" xs12 sm6 lg2 xl2>
                            <ReleaseCard :release="props.item"></ReleaseCard>
                        </v-flex>
                    </v-data-iterator>         
                </v-card-text>
            </v-card>    
            <v-card dark v-if="trackItems.length > 0">
                <v-card-title class="subheading accent--text">Tracks</v-card-title>
                <v-card-text>
                    <v-data-iterator :items="trackItems" :rows-per-page-items="rowsPerPageItems" :total-items="trackPagination.totalItems"  :pagination.sync="trackPagination" content-tag="v-layout" :loading="true" row wrap>
                        <v-flex slot="item" slot-scope="props" xs12 sm6>
                            <TrackCard :track="props.item"></TrackCard>
                        </v-flex>
                    </v-data-iterator>        
                </v-card-text>
            </v-card>                              
               
        </v-container> 
    </div>
</template>

<script>
    import { EventBus } from '@/event-bus.js';    
    import ArtistCard from '@/components/ArtistCard';
    import ReleaseCard from '@/components/ReleaseCard';
    import TrackCard from '@/components/TrackCard';

    export default {
    components: { ArtistCard, ReleaseCard, TrackCard }, 
    props: {
        q: String
    },
    created() {
    },    
    async mounted() {   
        this.updateData();
    },  
    methods: {
      updateData: async function() {
        EventBus.$emit("loadingStarted"); 
        this.$axios.get(process.env.VUE_APP_API_URL + `/artists?page=${ this.artistPagination.page }&limit=${ this.artistPagination.rowsPerPage }&order=${ this.artistPagination.sortOrder  }&sort=${ this.artistPagination.sortBy }&filter=${ this.q }`)
        .then(response => {
            this.artistItems = response.data.rows;
            this.artistPagination.totalItems = response.data.totalCount;    
        });   
        this.$axios.get(process.env.VUE_APP_API_URL + `/releases?page=${ this.releasePagination.page }&limit=${ this.releasePagination.rowsPerPage }&order=${ this.releasePagination.sortOrder  }&sort=${ this.releasePagination.sortBy }&filter=${ this.q }`)
        .then(response => {
            this.releaseItems = response.data.rows;
            this.releasePagination.totalItems = response.data.totalCount;    
        });    
        this.$axios.get(process.env.VUE_APP_API_URL + `/tracks?page=${ this.trackPagination.page }&limit=${ this.trackPagination.rowsPerPage }&order=${ this.trackPagination.sortOrder  }&sort=${ this.trackPagination.sortBy }&filter=${ this.q }`)
        .then(response => {
            this.trackItems = response.data.rows;
            this.trackPagination.totalItems = response.data.totalCount;    
            EventBus.$emit("loadingComplete");    
        });                       
      },
    },
    watch: {
        $route(to) {
            this.q = to.params.q;
            this.updateData();
        }
    },
    data: () => ({
      rowsPerPageItems: [12, 36, 60, 120],
      currentView: "",
      artistPagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'Artist.Text',
        sortOrder: "ASC"
      },   
      releasePagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'Release.Text',
        sortOrder: "ASC"
      },   
      trackPagination: {
        page: 1,
        rowsPerPage: 36,
        totalItems: 0,
        sortBy: 'Track.Text',
        sortOrder: "ASC"
      },                      
      artistItems: [],
      releaseItems: [],
      trackItems: []
    })
    }

</script>


<style>

</style>
