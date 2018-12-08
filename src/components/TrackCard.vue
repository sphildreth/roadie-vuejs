<template>
    <v-card color="secondary darken-2" class="track-card white--text ma-1 ml-2 pa-2" height="105px" hover :data-playurl="track.trackPlayUrl" :data-id="track.id" >
        <v-layout>
            <v-flex d-flex xs12>
                <v-layout row wrap>
                    <v-flex xs8>
                        <div class="track-number accent--text display-1">{{ track.trackNumber | padNumber3 }}</div>                                
                        <v-icon dark small class="favorite pointer" @click.native="favoriteToggle" :color="userRating.isFavorite ? 'red' : 'white'" @change.native="favoriteToggle">favorite</v-icon>                    
                        <v-rating @click.native="ratingChanged" @change.native="ratingChanged" v-model="userRating.rating" class="pointer track-rating" background-color="orange lighten-3" color="orange" small dense hover clearable></v-rating>
                        <v-icon dark small class="hated pointer" @click.native="dislikeToggle" :color="userRating.isDisliked ? 'green' : 'white'" @change.native="dislikeToggle">far fa-thumbs-down</v-icon>                                        
                        <div class="track-title white--text">{{ track.title}}</div>
                        <div class="caption accent--text"><span title="Played Count">{{ track.playedCount | padNumber4 }}</span> | <span title="Track Play Time">{{ track.durationTime }}</span></div>
                        <div v-if="mediaCount > 1" class="caption accent-text">{{ 'Media ' + this.$filters.padNumber2(mediaNumber) + ' of ' + this.$filters.padNumber2(mediaCount) }}</div>
                        <div v-if="track.partTitlesList && track.partTitlesList.length > 0" class="caption font-italic text-no-wrap text-truncate">
                            <span class="pr-2" v-for="partTitle in track.partTitlesList" :key="partTitle">{{ partTitle }}</span>
                        </div>
                    </v-flex>
                    <v-flex xs4 v-if="track.trackArtist">
                        <ArtistCard v-if="track.trackArtist" :artist="track.trackArtist"></ArtistCard>                
                    </v-flex>
                    <v-flex xs4 v-if="release && !track.trackArtist">
                        <ReleaseCard v-if="release" :release="release"></ReleaseCard>                
                    </v-flex>                                 
                </v-layout>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>
import ArtistCard from '@/components/ArtistCard';
import ReleaseCard from '@/components/ReleaseCard'
import { EventBus } from '@/event-bus.js';

export default {
    name: 'TrackCard',
    components: { ArtistCard, ReleaseCard },
    props: {
        track: {
            type: Object,
            default: function() {  
                return {             
                    userRating: {
                        rating: 0,
                        isFavorite: false,
                        isDisliked: false
                    }
                }
            }
        },
        release: Object,
        mediaNumber: Number,
        mediaCount: Number
    },
    async mounted() {
     
    },
    methods: {
        favoriteToggle: function() {
            this.$nextTick(() => {
                EventBus.$emit("t:favoriteToggle", { 
                    trackId: this.$el.dataset.id,
                    isFavorite: !this.track.userRating.isFavorite
                });            
                this.track.userRating.isFavorite = !this.track.userRating.isFavorite;
            })
        },  
        dislikeToggle: function() {
            this.$nextTick(() => {
                EventBus.$emit("t:dislikeToggle", { 
                    trackId: this.$el.dataset.id,
                    isDisliked: !this.track.userRating.isDisliked
                });            
                this.track.userRating.isDisliked = !this.track.userRating.isDisliked;
            })
        },       
        ratingChanged: function() {
            this.$nextTick(() => {
                EventBus.$emit("t:ratingChange", { 
                    trackId: this.$el.dataset.id,
                    newVal: this.rating
                });            
            })
        }
    },
    computed: {
        userRating: function() {        
            return this.track && this.track.userRating ? this.track.userRating : 0;
        }
    },
    data: () => ({        
    })    
}
</script>

<style>
    .track-card .v-card--hover {
        cursor:default !important;
    }
    .track-card .v-rating.track-rating {
        width: 97px;
        float:left;
    }
    .track-card i.favorite {
        float:left;
        margin-top:2px;        
    }    
    .track-card .track-number {
        float: left;
        margin: 0px 15px 0px 5px;
        height: 74px;
        padding-top: 15px;
    }
</style>