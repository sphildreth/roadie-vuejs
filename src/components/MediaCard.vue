<template>
    <v-card  color="darken-1" class="media-card mb-3" hover :data-id="media.id">
        <v-layout row wrap>
            <v-data-iterator
                :items="media.tracks"
                :total-items="media.tracks ? media.tracks.length : 0"
                content-tag="v-layout"
                hide-actions
                row
                wrap
            >
                <v-flex slot="item" slot-scope="props" xs12>
                    <TrackCard :track="props.item" :doShowSelector="true" :mediaNumber="media.mediaNumber" :mediaCount="mediaCount"></TrackCard>
                </v-flex>
            </v-data-iterator>
        </v-layout>
    </v-card>   
</template>

<script>

import TrackCard from '@/components/TrackCard.vue';

export default {
    name: 'mediaCard',
    components: { TrackCard },
    props: {
        media: Object,
        release: Object,
        mediaCount: Number
    },
    methods: {
    },
    computed: {
    },
    data: () => ({
    })    
}
</script>

<style>
</style>