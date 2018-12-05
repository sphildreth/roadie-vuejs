<template>
    <div class="label-detail-container">
        <Toolbar :menuItems="menuItems" :toolbarIcon="'label'"></Toolbar>        
        <h5>Load Label {{ id }}</h5>
    </div>
</template>

<script>
    import Toolbar from '@/components/Toolbar';
    import { EventBus } from '@/event-bus.js';    
  export default {
    components: { Toolbar }, 
    props: {
        id: String
    },
    created() {
      EventBus.$on('toolbarRefresh', this.updateData);
    },    
    async mounted() {   
    },  
    methods: {
        shuffle: function() {

        },
        addToQue: function() {

        },
        download: function() {

        },
        comment: function() {

        },
        updateData: async function() {
            EventBus.$emit("loadingStarted"); 
            EventBus.$emit("loadingComplete"); 
        }
    },
    watch: {
    },
    data: () => ({
      menuItems: [
      ],
    })
  }

</script>


<style>

</style>
