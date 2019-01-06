<template>
  <div>
    <Toolbar :menuItems="menuItems" :doShowRefresh=false :toolbarIcon="'settings'"></Toolbar>
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
    <confirm ref="confirm"></confirm>    
  </div>  
</template>

<script>
  import Toolbar from '@/components/Toolbar';
  import { EventBus } from '@/event-bus.js';
  import Confirm from '@/views/Confirm';

  const signalR = require("@aspnet/signalr");  

  export default {
    components: { Toolbar, Confirm }, 
    created() {
      EventBus.$on("s:ClearCache", this.clearCache);      
      EventBus.$on("s:ScanInbound", this.scanInbound);
      EventBus.$on("s:ScanLibrary", this.scanLibrary);
      EventBus.$on("toolbarRefresh", this.updateData);
    },
    beforeDestroy() {
      EventBus.$off("s:ClearCache", this.clearCache);            
      EventBus.$off("s:ScanInbound", this.scanInbound);
      EventBus.$off("s:ScanLibrary", this.scanLibrary);      
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
      clearCache: async function () {
        this.$axios
          .get(process.env.VUE_APP_API_URL + `/admin/clearcache`)
          .then(() => {   
            EventBus.$emit("showSnackbar", { text: "Cleared Cache" });
          }); 
      },
      scanInbound: async function() {
        this.$axios
          .get(process.env.VUE_APP_API_URL + `/admin/scan/inbound`)
          .then(() => {   
            this.isScanning = true;            
          });       
      },
      scanLibrary: async function() {
        this.$refs.confirm.open('Rescan Library', 'Proceed to scan entire library?', { color: 'warning' }).then((confirm) => {
          if(confirm) {
            this.$axios
              .get(process.env.VUE_APP_API_URL + `/admin/scan/library`)
              .then(() => {   
                this.isScanning = true;            
              });  
          }
        })       
      }
    },
    watch: {
    },
    data: () => ({
      connection: null,
      isScanning: false,
      menuItems: [
        { title: "Clear Cache", class: "hidden-xs-only", click: "s:ClearCache" },        
        { title: "Scan Inbound", class: "hidden-xs-only", click: "s:ScanInbound" },
        { title: "Scan Library", class: "hidden-xs-only", click: "s:ScanLibrary" }        
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
