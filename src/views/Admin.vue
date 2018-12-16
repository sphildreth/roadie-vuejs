<template>
  <div>
    <Toolbar :menuItems="menuItems" :toolbarIcon="'settings'"></Toolbar>
    <v-container fluid grid-list-md>
        <div class="col-12">
          <v-card v-show="isScanning">
            <v-card-text>Scanning</v-card-text>
            <v-card-text :style="{ background: 'black' }">
              <ul id="messagesList"></ul>              
            </v-card-text>
          </v-card>
        </div>
    </v-container>
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import { EventBus } from '@/event-bus.js';

  const signalR = require("@aspnet/signalr");  

  export default {
    components: { Toolbar }, 
    created() {
      EventBus.$on("s:Scan", this.scanSystem);
      EventBus.$on("toolbarRefresh", this.updateData);
    },
    beforeDestroy() {
      EventBus.$off("s:Scan", this.scanSystem);
      EventBus.$off("toolbarRefresh", this.updateData);
    },   
    async mounted() {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(process.env.VUE_APP_API_URL + "/scanActivityHub")
        .build();   
        
      this.connection.start().catch(function (err) {
          /* eslint-disable no-console */
          return console.error(err.toString());
      });

      this.connection.on("SendSystemActivity", (message) => { 
          const li = document.createElement("li");
          li.textContent = message;
          document.getElementById("messagesList").appendChild(li);
      });       
      this.updateData();
    },  
    methods: {          
      updateData: async function() {
        EventBus.$emit("loadingComplete");        
      },
      scanSystem: async function() {

        this.$axios
          .get(process.env.VUE_APP_API_URL + `/admin/scan`)
          // eslint-disable-next-line
          .then(response => {   
            this.isScanning = true;            
          });       
      }
    },
    watch: {
    },
    data: () => ({
      connection: null,
      isScanning: false,
      menuItems: [
        {
          title: "Scan",
          class: "hidden-xs-only",
          click: "s:Scan"
        }
      ],      
    })
  }
</script>

<style>
  #messagesList {
    max-height: 600px;
    overflow: auto;
  }
</style>
