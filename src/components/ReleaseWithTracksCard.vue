<template>
    <v-card  class="mt-2 ma-1 release-with-tracks mb-2" hover :data-id="release.id" >
        <v-layout>
            <v-flex xs3 >
               <v-img
                    :src="release.thumbnail.url"
                    :alt="release.release.text"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
            </v-flex>
            <v-flex xs9 >
                <v-card-title primary-title class="pa-0 ma-0">
                    <div :class="this.$store.getters.playingIndex.releaseId == release.id ? 'playing-release' : ''">
                        <v-rating v-model="release.rating" background-color="orange lighten-3" color="orange" readonly small dense></v-rating>                    
                        <router-link :to="'/release/' + release.id">
                          <div :title="release.release.text" class="release-title subheading font-weight-medium pointer">{{ release.release.text }}</div>
                          </router-link>
                        <div class="caption accent--text"><span title="Release Date">{{ release.releaseYear }}</span> | <span title="Track Count">{{ release.trackCount | padNumber3 }}</span> | <span title="Release Play Time">{{ release.durationTime }}</span></div>
                        <v-icon v-if="release.libraryStatus != 1" :class="release.libraryStatus" color="warning">warning</v-icon>                                            
                    </div>
                </v-card-title>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12>
                <v-card class="release-card" height="300px">
                    <v-card-text>
                        <div v-for="media in release.media" :key="media.id">
                            <div v-if="release.media.length > 1" class="media-number accent--text">{{ media.mediaNumber | padNumber2 }}</div>
                            <table>
                                <tbody>
                                    <tr v-for="track in media.tracks" :disabled="track.cssClass != 'Ok'" :key="track.id"  :class="track.cssClass == 'Missing' ? 'warning black--text' : 'dark'">
                                        <td class="track-number">{{ track.trackNumber | padNumber3 }}</td>
                                        <td class="track-title">{{ track.title}}</td>
                                        <td class="track-time right">{{ track.durationTime}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>                        
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'ReleaseWithTracksCard',
    props: {
        release: Object
    },
    methods: {
    },
    computed: {
    },
  data () {
    return {
      selected: []  
    }
  }    
}
</script>

<style>
    .release-with-tracks .v-card--hover {
        cursor:default !important;
    }
    .release-with-tracks .v-rating.release-rating {
        width: 115px;
    }
    .release-with-tracks i.favorite {
        float:left;
        margin-top:2px;        
    }
    .release-with-tracks .numberCircle {
        width: 12px;
        line-height: 12px;
        border-radius: 50%;
        text-align: center;
        font-size: 32px;
        border: 2px solid #666;
    }        
    .release-with-tracks ul {
        max-height: 280px;
        overflow: auto;
        list-style: none;
        padding: 0;
    }
    .release-with-tracks ul li {
        margin-right: 6px;
    }
    .release-with-tracks .track-number {
        width: 30px;
    }
    /* .release-with-tracks .track-title {
        -ms-text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: left;
    }
    .release-with-tracks .track-time {
        float: right;
    }
     */

    .release-with-tracks .release-card .v-card__text {
        margin: 0;
        padding: 5px 7px;
        height: 100%;
        overflow: auto;
    }
    .release-with-tracks table {
        width: 100%;
    }
    .release-with-tracks td.track-number {
        width: 30px;
    }    
    .release-with-tracks td.right {
        text-align: right;
    }
    tr.Missing td {
        border: 1px solid red;
    }
    .release-with-tracks .media-number {
        float:right;
    }

    /* .trackRating1 {
        background-image: linear-gradient(left, mediumseagreen, mediumseagreen 20%, transparent 20%, transparent 100%);
        background-image: -webkit-linear-gradient(left, mediumseagreen, mediumseagreen 20%, transparent 20%, transparent 100%)
    }

    .trackRating2 {
        background-image: linear-gradient(left, mediumseagreen, mediumseagreen 40%, transparent 40%, transparent 100%);
        background-image: -webkit-linear-gradient(left, mediumseagreen, mediumseagreen 40%, transparent 40%, transparent 100%)
    }

    .trackRating3 {
        background-image: linear-gradient(left, mediumseagreen, mediumseagreen 60%, transparent 60%, transparent 100%);
        background-image: -webkit-linear-gradient(left, mediumseagreen, mediumseagreen 60%, transparent 60%, transparent 100%)
    }

    .trackRating4 {
        background-image: linear-gradient(left, mediumseagreen, mediumseagreen 80%, transparent 80%, transparent 100%);
        background-image: -webkit-linear-gradient(left, mediumseagreen, mediumseagreen 80%, transparent 80%, transparent 100%)
    }

    .trackRating5 {
        background-image: linear-gradient(left, mediumseagreen, mediumseagreen 100%, transparent 100%, transparent 100%);
        background-image: -webkit-linear-gradient(left, mediumseagreen, mediumseagreen 100%, transparent 100%, transparent 100%)
    }     */
</style>