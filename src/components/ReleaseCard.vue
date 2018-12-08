<template>
    <v-card color="secondary darken-1" class="white--text mb-3" hover :data-id="release.id" >
        <v-layout>
            <v-flex xs4 >
                <router-link :to="'/release/' + release.id">
                <v-img
                    :src="release.thumbnail.url"
                    :alt="release.release.text"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs8>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <v-icon dark small class="favorite pointer" @click.native="favoriteToggle" :color="release.isFavorite ? 'red' : 'white'" @change.native="favoriteToggle">favorite</v-icon>                    
                    <v-rating v-model="release.rating" class="" background-color="orange lighten-3" color="orange" small dense hover readonly></v-rating>
                    <router-link :to="'/release/' + release.id"><div :title="release.release.text" class="release-title text-no-wrap text-truncate subheading font-weight-medium info--text pointer">{{ release.release.text }}</div></router-link>
                    <router-link :to="'/artist/' + release.artist.value"><div :title="release.artist.text" class="release-artist text-no-wrap text-truncate body-1 white--text pointer" >{{ release.artist.text }}</div></router-link>
                    <div class="caption accent--text"><span title="Release Date">{{ release.releaseYear }}</span> | <span title="Track Count">{{ release.trackCount | padNumber3 }}</span> | <span title="Release Play Time">{{ release.durationTime }}</span></div>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

import { EventBus } from '@/event-bus.js';

export default {
    name: 'ReleaseCard',
    props: {
        release: Object
    },
    methods: {
        favoriteToggle: function() {
            this.$nextTick(() => {
                EventBus.$emit("r:favoriteToggle", { 
                    releaseId: this.$el.dataset.id,
                    isFavorite: !this.release.isFavorite
                });            
                this.release.isFavorite = !this.release.isFavorite;
            })
        },        
        ratingChanged: function() {
            this.$nextTick(() => {
                EventBus.$emit("r:ratingChange", { 
                    releaseId: this.$el.dataset.id,
                    newVal: this.rating
                });            
            })
        }
    },
    computed: {
        rating() {
            return this.release.rating;
        }
    }
}
</script>

<style>
    .v-card--hover {
        cursor:default !important;
    }
    .v-rating.release-rating {
        width: 115px;
    }
    i.favorite {
        float:left;
        margin-top:2px;        
    }    
</style>