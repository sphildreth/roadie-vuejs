<template>
    <v-card max-height="100px" color="secondary darken-1" class="white--text mb-3" hover :data-id="playlist.id" >
        <v-layout>
            <v-flex xs4 >
                <router-link :to="'/playlist/' + playlist.id">
                <v-img
                    :src="playlist.thumbnail.url"
                    :alt="playlist.playlist.text"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs8>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/playlist/' + playlist.id"><div :title="playlist.playlist.text" class="artist-name subheading font-weight-medium info--text pointer">{{ playlist.playlist.text }}</div></router-link>
                    <div class="caption accent--text"><span title="Playlist Tracks">{{ playlist.playlistCount | padNumber4 }}</span> | <span title="Playlist Play time">{{ playlist.durationTime }}</span></div>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'PlaylistCard',
    props: {
        playlist: Object
    },
    methods: {
    },
    computed: {
    },
    data: () => ({
        //isFavorite: false
    })
}
</script>

<style>
</style>