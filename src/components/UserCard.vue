<template>
    <v-card  class="mb-3" hover :data-id="user.id" >
        <v-layout>
            <v-flex xs4 >
                <router-link :to="'/user/' + user.user.value">
                <v-img
                    :src="user.thumbnail.url"
                    :alt="user.id"
                    max-width="80"
                    class="ma-1"
                ></v-img>                  
                </router-link>
            </v-flex>
            <v-flex xs8>
                <v-card-title primary-title class="pa-0 ma-0">
                <div>
                    <router-link :to="'/user/' + user.user.value"><div :title="user.user.text" class="user-username subheading font-weight-medium pointer">{{ user.user.text }}</div></router-link>
                </div>
                </v-card-title>
            </v-flex>
        </v-layout>
    </v-card>   
</template>

<script>

export default {
    name: 'UserCard',
    props: {
        user: Object
    },
    methods: {
    },
    computed: {
    }
}
</script>

<style>
  
</style>