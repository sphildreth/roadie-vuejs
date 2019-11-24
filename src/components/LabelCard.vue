<template>
    <v-card  class="mb-3" hover :data-id="label.id" >
        <v-layout>
            <v-flex xs4 md3 >
                <router-link :to="'/label/' + label.label.value">
                <v-img
                    :src="label.thumbnail.url"
                    :alt="label.label.text"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs8 md9>
                <v-card-text primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/label/' + label.label.value">
                    <div 
                        :title="label.label.text" 
                        class="secondary--text text--lighten-1 label-title text-no-wrap text-truncate subheading font-weight-medium pointer"
                    >{{ label.label.text }}</div></router-link>
                    <div class="caption accent--text"><span title="Artist Count">{{ label.artistCount }}</span> | <span title="Release Count">{{ label.releaseCount }}</span> | <span title="Track Count">{{ label.trackCount | padNumber5 }}</span></div>
                    <div v-if="catalogNumber" class="caption accent--text"><span title="Catalog Number">{{ catalogNumber }}</span><span v-if="beginDate" title="Begin Date"> Begin: {{ beginDate | shortDate }}</span><span v-if="endDate" title="End Date"> End: {{ endDate | shortDate }}</span></div>
                </div>
                </v-card-text>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'LabelCard',
    props: {
        label: Object,
        catalogNumber: String,
        beginDate: String,
        endDate: String
    },
    methods: {
    },
    computed: {
    }
}
</script>

<style>
  
</style>