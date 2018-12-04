<template>
    <div class="release-detail-container">
        <Toolbar :menuItems="menuItems" :toolbarIcon="'music_video'"></Toolbar>        
        <h5>Load Release {{ id }}</h5>
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
      EventBus.$on('rr:Shuffle', this.shuffle);
      EventBus.$on('rr:AddToQue', this.addToQue);
      EventBus.$on('rr:Download', this.download);
      EventBus.$on('rr:Comment', this.comment);
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
        { title: "Add To Que", class: "hidden-xs-only", click: "rr:AddToQue" },       
        { title: "Comment", class: "hidden-xs-only", click:"rr:Comment" },
        { title: "Download", class:"hidden-sm-and-down", click: "rr:Download" },
        { title: "Shuffle", class: "hidden-sm-and-down", click: "rr:Shuffle" }
      ],
    })
  }

</script>


<style>

</style>
