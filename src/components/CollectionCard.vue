<template>
    <v-card max-height="100px"  class="mb-3 collection-card" hover :data-id="collection.id" >
        <v-layout>
            <v-flex xs2 >
                <router-link :to="'/collection/' + collection.id">
                <v-img
                    :src="collection.thumbnail.url"
                    :alt="collection.collection.text"                    
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs10>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/collection/' + collection.id">                   
                      <div :title="collection.collection.text" class="secondary--text text--lighten-1 collection-name subheading font-weight-medium pointer">{{ collection.collection.text }}</div>
                    </router-link>
                    <div>                    
                      <v-progress-linear class="ma-0 mt-1 mb-1" :color="collection.percentComplete == 100 ? 'green' : 'secondary'" height="6" :value="collection.percentComplete" ></v-progress-linear>
                      </div>
                    <div class="caption accent--text">
                      <v-icon
                        v-if="collection.isLocked"
                        style="float:left;"
                        title="Collection is locked!"
                        small
                        color="warning"
                      >lock</v-icon>                       
                      <span title="Releases Count">{{ collection.collectionCount | padNumber3 }}</span> | <span title="Releases Found Count">{{ collection.collectionFoundCount | padNumber4 }}</span>
                    </div>
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
    .collection-card .v-progress-linear {
        border-radius: 5px;
    }
</style>