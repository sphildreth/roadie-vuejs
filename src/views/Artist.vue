<template>
  <div class="artist-detail-container">
    <Toolbar :menuItems="menuItems" :toolbarIcon="'fas' +' '+ 'fa-user'" :doShowBookmark="true" :bookmarked="artist.userBookmarked"></Toolbar>
    <v-container fluid grid-list-md>
        <v-layout row wrap>            
            <v-flex xs12 sm6 md6>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card color="accent" class="profile white--text darken-2">
                            <v-card-text class="title">{{ artist.name }}<v-icon v-if="artist.isLocked" style="float: right;" title="Arist is locked!" color="warning">lock</v-icon></v-card-text>
                        </v-card>    
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap>
                            <v-flex xs3>
                                <v-img
                                :src="artist.mediumThumbnail.url"
                                :alt="artist.name"
                                class="ma-1"
                                aspect-ratio="1"
                                ></v-img>
                                <v-rating  v-model="rating" background-color="orange lighten-3" color="orange" readonly small dense></v-rating>
                                <v-rating @click.native="ratingChanged" @change.native="ratingChanged" v-model="userRating" class="pointer artist-rating" background-color="orange lighten-3" color="orange" medium dense hover clearable></v-rating>                                
                            </v-flex> 
                            <v-flex xs9 class="title">
                                <v-text-field
                                    v-if="artist.realName"
                                    v-bind:value="artist.realName"
                                    label="Real Name"
                                    readonly
                                ></v-text-field>  
                                <v-text-field
                                    v-if="artist.sortName"
                                    v-bind:value="artist.sortName"
                                    label="Sort Name"
                                    readonly
                                ></v-text-field>                                 
                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-text-field
                                            v-bind:value="artist.artistType"
                                            label="Artist Type"
                                            readonly                            
                                        ></v-text-field>                                         
                                    </v-flex>
                                    <v-flex xs3 v-if="artist.isniList">
                                        <v-text-field
                                            v-bind:value="artist.isniList[0]"
                                            label="ISNI"
                                            readonly                            
                                        ></v-text-field>                                         
                                    </v-flex>                                    
                                </v-layout>
                                <v-layout row wrap>                                    
                                    <v-flex xs4 v-if="artist.birthDate"  >
                                        <v-text-field                                                                                                                          
                                            v-bind:value="shortDateWithAge(artist.birthDate)"
                                            label="Birth Date"
                                            readonly                            
                                        ></v-text-field>                        
                                    </v-flex>
                                    <v-flex xs4 v-if="artist.beginDate"  >
                                        <v-text-field                                                                                  
                                            v-bind:value="shortDateWithAge(artist.beginDate)"
                                            label="Begin Date"
                                            readonly
                                        ></v-text-field>                        
                                    </v-flex>
                                    <v-flex xs4 v-if="artist.endDate">
                                        <v-text-field                                            
                                            v-bind:value="shortDateWithAge(artist.endDate)"
                                            label="End Date"
                                            readonly
                                        ></v-text-field>                        
                                    </v-flex>   
                                </v-layout>                                                                                                              
                            </v-flex>
                        </v-layout>                        

                    </v-flex>                         
                </v-layout>                
            </v-flex>
            <v-flex d-flex xs12 sm6 md6>
                <v-tabs right color="primary" dark v-model="tab" slider-color="accent">
                    <v-tab v-if="artist.images.length">Images</v-tab> 
                    <v-tab-item v-if="artist.images.length">
                        <v-card flat class="images darken-3">
                            <v-container class="images-container" fluid grid-list-xs>
                                <v-layout row wrap>
                                    <v-flex v-for="(image, index) in artist.images" :key="image.url" xs2>
                                        <v-img
                                            :src="image.thumbnailUrl"
                                            :lazy-src="`@/assets/img/loading.gif`"
                                            class="grey lighten-2"
                                            @click="showImageModal(artist.images[index])"
                                        ></v-img>                                                                               
                                    </v-flex>
                                </v-layout>
                                <v-dialog v-model="showModal">
                                    <v-card @click="showModal = !showModal">
                                    <v-card-title class="headline">{{ modalImage.caption}}</v-card-title>
                                    <v-card-text class="grey" max-height="820px">                                        
                                        <img class="modal-image" v-bind:src="modalImage.url" v-bind:title="modalImage.caption" v-bind:alt="modalImage.caption">
                                    </v-card-text>
                                    </v-card>
                                </v-dialog>                                    
                            </v-container>
                        </v-card>   
                    </v-tab-item>                      
                    <v-tab v-if="artist.bioContext">Biography</v-tab>
                    <v-tab-item v-if="artist.bioContext">
                        <v-card flat class="biography darken-3">
                            <v-card-text v-html="artist.bioContext">Loading...</v-card-text>
                        </v-card>   
                    </v-tab-item>      
                    <v-tab v-if="artist.profile">Profile</v-tab>                                  
                    <v-tab-item v-if="artist.profile">
                        <v-card flat class="profile darken-3">
                            <v-card-text v-html="artist.profile">Loading...</v-card-text>
                        </v-card>
                    </v-tab-item>                    
                </v-tabs>          
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex d-flex xs12 sm6 md6>
                <v-layout row wrap>
                    <v-flex xs3>
                        <v-card class="tags" dark>
                            <v-card-title class="info caption white--text">Statistics</v-card-title>
                            <v-card-text>                            
                                <ul class="statistics">
                                    <li><span class="name">Releases</span><span class="stat">{{ artist.statistics.releaseCount }}</span></li>
                                    <li><span class="name">Media</span><span class="stat">{{ artist.statistics.releaseMediaCount }}</span></li>
                                    <li><span class="name">Tracks</span><span class="stat">{{ artist.statistics.trackCount }}</span></li>
                                    <li><span class="name">Played Count</span><span class="stat">{{ artist.statistics.trackPlayedCount }}</span></li>
                                    <li v-if="artist.statistics.missingTrackCount"><span class="name">Missing Tracks</span><span class="red stat">{{ artist.statistics.missingTrackCount }}</span></li>
                                    <li><span class="name">Play Time</span><span class="stat">{{ artist.statistics.trackTime }}</span></li>
                                    <li><span class="name">File Size</span><span class="stat">{{ artist.statistics.fileSize }}</span></li>
                                </ul>
                            </v-card-text>
                        </v-card> 
                    </v-flex>                     
                    <v-flex xs6>
                        <v-card class="alternate-names" dark>
                            <v-card-title class="primary caption white--text">Alternate Names</v-card-title>
                            <v-card-text>                            
                                <ul class="data-tokens">
                                    <li v-for="name in artist.alternateNamesList" :key="name">{{ name }}</li>
                                </ul>
                            </v-card-text>
                        </v-card> 
                    </v-flex>
                    <v-flex xs3>
                        <v-card class="genres" dark>
                            <v-card-title class="primary caption white--text">Genres</v-card-title>
                            <v-card-text>                            
                                <ul class="data-tokens">
                                    <li v-for="genre in artist.genres" :key="genre.value">{{ genre.text }}</li>
                                </ul>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>       
            </v-flex>            
            <v-flex d-flex xs12 sm6 md6>
                    <v-flex xs3>
                        <v-card class="tags" dark>
                            <v-card-title class="primary caption white--text">Tags</v-card-title>
                            <v-card-text>                            
                                <ul class="data-tokens">
                                    <li v-for="tag in artist.tagsList" :key="tag">{{ tag }}</li>
                                </ul>                                
                            </v-card-text>
                        </v-card> 
                    </v-flex>                
                    <v-flex xs4>
                        <v-card class="urls" dark>
                            <v-card-title class="primary caption white--text">Urls</v-card-title>
                            <v-card-text>                            
                                <ul class="data-tokens">
                                    <li v-for="url in artist.urLsList" :key="url"><a class="white--text" v-bind:href="url" target="_blank">{{ url }}</a></li>
                                </ul>                                
                            </v-card-text>
                        </v-card> 
                    </v-flex> 
                    <v-flex xs5>
                        <v-card class="metadataSources" dark>
                            <v-card-title class="primary caption white--text">Metadata Sources</v-card-title>
                            <v-card-text>                            
                                <ul class="metadataSources">
                                    <li v-if="artist.amgId"><span class="name">AllMusic</span><span class="key"><a class="white--text" v-bind:href="'http://www.allmusic.com/artist/' + artist.amgId" target="_blank">{{ artist.amgId }}</a></span></li>
                                    <li v-if="artist.discogsId"><span class="name">Discogs</span><span class="key"><a class="white--text" v-bind:href="'https://www.discogs.com/artist/' + artist.discogsId" target="_blank">{{ artist.discogsId }}</a></span></li>
                                    <li v-if="artist.iTunesId"><span class="name">iTunes</span><span class="key"><a class="white--text" v-bind:href="'https://itunes.apple.com/artist/id' + artist.iTunesId" target="_blank">{{ artist.iTunesId }}</a></span></li>
                                    <li v-if="artist.musicBrainzId"><span class="name">MusicBrainz</span><span class="key"><a class="white--text" v-bind:href="'https://musicbrainz.org/artist/' + artist.musicBrainzId" target="_blank">{{ artist.musicBrainzId }}</a></span></li>
                                    <li v-if="artist.spotifyId"><span class="name">Spotify</span><span class="key"><a class="white--text" v-bind:href="'https://open.spotify.com/artist/' + artist.spotifyId" target="_blank">{{ artist.spotifyId }}</a></span></li>
                                </ul>                               
                            </v-card-text>
                        </v-card> 
                    </v-flex>                     
            </v-flex>
        </v-layout>
        <v-layout row wrap v-if="artist.bioContext">
            <v-flex d-flex xs12>
             
            </v-flex>
        </v-layout>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import moment from "moment";
import store from '@/store';

export default {    
  store,
  components: { Toolbar },
  props: {
    id: String
  },
  created() {
    EventBus.$on("aa:Shuffle", this.shuffle);
    EventBus.$on("aa:PlayAll", this.playAll);
    EventBus.$on("aa:AddAllToQue", this.addAllToQue);
    EventBus.$on("aa:Comment", this.comment);
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  async mounted() {
    this.updateData();
  },
    computed: {
        rating() {
            return this.artist.rating;
        },
        userRating: {
            get: function () {
                return this.artist && this.artist.userRating ? this.artist.userRating.rating : 0;
            },
            set: function (newValue) {
                if(!this.artist.userRating) {
                    this.artist.userRating = {};
                }
                this.artist.userRating.rating = newValue;
            }            
        }
    },
  methods: {
    shuffle: function() {},
    addAllToQue: function() {},
    playAll: function() {},
    comment: function() {},
    showImageModal: function (e) {
        this.modalImage = e;
        this.showModal = true;
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/artists/${this.id}`)
        .then(response => {
          this.artist = response.data.data;
          EventBus.$emit("loadingComplete");
        });
    },
    shortDateWithAge: function(date, toDate) {
        return this.$options.filters.shortDate(date) + ' (' + this.$options.filters.yearsFromDate(toDate,date) + ')';
    },
    ratingChanged: function() {
        this.$nextTick(() => {
            EventBus.$emit("a:ratingChange", { 
                releaseId: this.$el.dataset.id,
                newVal: this.artist.userRating.rating
            });            
        })
    }    
  },
  filters: {
    shortDate: function (date) {        
        return moment(date).format('MM-DD-YYYY');
    },
    formatTimeStamp: function(timestamp) {
        return moment.utc(timestamp).tz(this.$store.getters.user.timezone).format(this.$store.getters.user.timeFormat);
    },
    yearsFromDate: function(fromDate,toDate) {
        fromDate = fromDate || new Date();
        toDate = toDate || new Date();
        return moment(fromDate).diff(toDate, 'years');
    }
  },  
  watch: {},
  data: () => ({
    tab: 0,   
    showModal: false,
    modalImage: {},
    artist: {
      images: {},
      mediumThumbnail: {},
      userRating: {},
      statistics: {},
      profile: null,
      bioContext: null
    },
    menuItems: [
      {
        title: "Add All To Que",
        class: "hidden-xs-only",
        click: "aa:AddAllToQue"
      },
      { title: "Play All", class: "hidden-xs-only", click: "aa:PlayAll" },
      { title: "Comment", class: "hidden-xs-only", click: "aa:Comment" },
      { title: "Shuffle", class: "hidden-sm-and-down", click: "aa:Shuffle" }
    ]
  })
};
</script>

<style>
    .v-rating.artist-rating {
        width: 100%;
    }
    .artist-detail-container .bio, .artist-detail-container .profile {
        max-height: 350px;
        overflow: auto;
    }
    .artist-detail-container .v-card__title {
        padding-top: 9px;
        padding-bottom: 9px;
    }
    .artist-detail-container .images-container {
        max-height: 313px;
        overflow: hidden;
        overflow-y: auto;
    }
    ul.data-tokens, ul.statistics, ul.metadataSources {
        list-style:none;
        padding: 0;
    }
    ul.data-tokens li, ul.statistics li {
        border: 1px solid;
        padding: 2px 5px;
        margin: 3px;
        border-radius: 5px;
        text-overflow: ellipsis;
        overflow: hidden;    
    }
    ul.statistics span.stat, ul.metadataSources span.key {
        float: right;
    }
    img.modal-image {
        max-height: 800px;
        overflow: hidden;
        max-width: 100%;
    }

</style>
