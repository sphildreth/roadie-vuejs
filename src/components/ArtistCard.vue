<template>
    <v-card color="secondary darken-1" class="white--text mb-3" hover :data-id="artist.id" >
        <v-layout>
            <v-flex xs4 >
                <router-link :to="'/artist/' + artist.id">
                <v-img
                    :src="artist.thumbnail.url"
                    :alt="artist.artist.text"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs8>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <v-icon dark small class="favorite pointer" @click.native="favoriteToggle" :color="artist.userRating && artist.userRating.isFavorite ? 'red' : 'white'" @change.native="favoriteToggle">favorite</v-icon>
                    <v-rating @click.native="ratingChanged" @change.native="ratingChanged" v-model="artist.rating" background-color="orange lighten-3" color="orange" small dense hover readonly></v-rating>
                    <router-link :to="'/artist/' + artist.id"><div :title="artist.artist.text" class="artist-name subheading font-weight-medium info--text pointer">{{ artist.artist.text }}</div></router-link>
                    <div class="caption accent--text"><span title="Releases Count">{{ artist.releaseCount | padNumber3 }}</span> | <span title="Track Count">{{ artist.trackCount | padNumber4 }}</span> | <span title="Played Count">{{ artist.playedCount | padNumber5 }}</span></div>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

import { EventBus } from '@/event-bus.js';

export default {
    name: 'ArtistCard',
    props: {
        artist: Object
    },
    methods: {
        favoriteToggle: function() {
            this.$nextTick(() => {
                this.artist.userRating = this.artist.userRating || { isFavorite: false };
                this.artist.userRating.isFavorite = !this.artist.userRating.isFavorite;
                EventBus.$emit("a:favoriteToggle", { 
                    artistId: this.$el.dataset.id,
                    isFavorite: this.artist.userRating.isFavorite
                });                            
            })
        },
        ratingChanged: function() {
            this.$nextTick(() => {
                EventBus.$emit("a:ratingChange", { 
                    artistId: this.$el.dataset.id,
                    newVal: this.rating
                });            
            })
        }
    },
    computed: {
        rating() {
            return this.artist.rating;
        }
    },
    data: () => ({
        //isFavorite: false
    })
}
</script>

<style>
    .v-card--hover {
        cursor:default !important;
    }
    .v-rating {
        width: 115px;
    }
    i.favorite {
        float:left;
        margin-top:2px;        
    }
</style>