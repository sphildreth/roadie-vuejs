<template>
    <v-card  class="mb-3" height="92" :color="!release.isValid ? 'warning' : ''" hover :data-id="release.id" :disabled="!release.isValid" >
        <v-layout>
            <v-flex xs4 >
                <!-- <div v-if="listNumber" class="caption list-number info--text">{{ this.$filters.padNumber4(listNumber) }}</div>                                                                                                  -->
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
                  <div v-if="release.isValid">                  
                      <v-icon small class="favorite pointer" @click.native="favoriteToggle" :color="release.isFavorite ? 'red' : 'accent'" @change.native="favoriteToggle">favorite</v-icon>                    
                      <v-rating v-model="release.rating" class="" background-color="orange lighten-3" color="orange" small dense hover readonly></v-rating>
                      <router-link :to="'/release/' + release.id">
                        <div :title="release.release.text" class="release-title text-no-wrap text-truncate subheading font-weight-medium pointer">{{ release.release.text }}</div>
                      </router-link>
                      <router-link :to="'/artist/' + release.artist.value">
                          <div :title="release.artist.text" class="release-artist text-no-wrap text-truncate body-1 pointer" >{{ release.artist.text }}</div>
                      </router-link>
                      <div class="caption accent--text"><span v-if="listNumber" class="body-2 info--text" title="Collection Position">{{ this.$filters.padNumber4(listNumber) + ' | ' }}</span><span title="Release Date">{{ release.releaseYear }}</span> | <span title="Track Count">{{ release.trackCount | padNumber3 }}</span> | <span title="Release Play Time">{{ release.durationTime }}</span></div>
                  </div>
                  <div v-if="!release.isValid" class="black--text">                  
                      <div :title="release.release.text" class="release-title text-no-wrap text-truncate subheading font-weight-medium pointer">{{ release.release.text }}</div>
                      <div :title="release.artist.text" class="release-artist text-no-wrap text-truncate body-1 pointer" >{{ release.artist.text }}</div>
                      <div class="missing-release-spacer"></div>
                      <div class="body-2 info--text"><span v-if="listNumber" title="Collection Position">{{ listNumber | padNumber4 }}</span></div>                      
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
        release: Object,
        listNumber: Number
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
    .list-number {
      float:left;
    }
    .missing-release-spacer {
      height: 21px;
    }
</style>