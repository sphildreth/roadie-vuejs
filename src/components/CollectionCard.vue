<template>
    <v-card max-height="100px" color="secondary darken-1" class="white--text mb-3" hover :data-id="collection.id" >
        <v-layout>
            <v-flex xs2 >
                <router-link :to="'/collection/' + collection.id">
                <v-img
                    :src="collection.thumbnail.url"
                    :alt="collection.collection.text"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs10>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/collection/' + collection.id"><div :title="collection.collection.text" class="artist-name subheading font-weight-medium info--text pointer">{{ collection.collection.text }}</div></router-link>
                    <div class="caption accent--text"><span title="Releases Count">{{ collection.collectionCount | padNumber3 }}</span> | <span title="Releases Found Count">{{ collection.collectionFoundCount | padNumber4 }}</span> | <span title="Percentage Count">{{ collection.percentComplete | padNumber3 }}</span></div>
                    <div v-if="listNumber" class="caption accent--text"><span title="Rank/Number in Collection">&num;{{ listNumber | padNumber3 }} of {{ collection.collectionCount | padNumber3 }}</span></div>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'CollectionCard',
    props: {
        collection: Object,
        listNumber: Number
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