<template>
    <v-card color="secondary darken-1" class="white--text mb-3" hover :data-id="label.id" >
        <v-layout>
            <v-flex xs2 >
                <router-link :to="'/label/' + label.label.value">
                <v-img
                    :src="label.thumbnail.url"
                    :alt="label.label.text"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs10>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/label/' + label.label.value"><div :title="label.label.text" class="label-title subheading font-weight-medium info--text pointer">{{ label.label.text }}</div></router-link>
                    <div class="caption accent--text"><span title="Artist Count">{{ label.artistCount }}</span> |<span title="Release Count">{{ label.releaseCount }}</span> | <span title="Track Count">{{ label.trackCount | padNumber5 }}</span></div>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'LabelCard',
    props: {
        label: Object
    },
    methods: {
    },
    computed: {
        imageHeight () {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs': 
                case 'sm':
                case 'md':
                    return '60px';
            }
            return '80px';
        }
    }
}
</script>

<style>
  
</style>