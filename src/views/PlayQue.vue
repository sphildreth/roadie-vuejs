<template>
  <div class="playque-container">
    <Toolbar :menuItems="menuItems" :toolbarIcon="'headset'"></Toolbar>
    <v-layout row wrap>
      <v-spacer></v-spacer>
      <v-flex d-flex xs2 class="ma-2">
        <div class="stats-container">
          <v-tooltip bottom>
            <v-chip slot="activator" color="secondary" text-color="white">
              <v-avatar>
                <v-icon>play_circle_outline</v-icon>
              </v-avatar>
              {{ queTrackCount | padNumber3 }}
            </v-chip>
            <span>Que Track Count</span>
          </v-tooltip>
          <v-tooltip bottom>
            <v-chip slot="activator" color="secondary" text-color="white">
              <v-avatar>
                <v-icon>speaker</v-icon>
              </v-avatar>
              {{ quePlaytime | timeFromMilliseconds }}
            </v-chip>
            <span>Que Playtime</span>
          </v-tooltip>
        </div>
      </v-flex>
    </v-layout>
    <v-container fluid grid-list-md>
      <v-data-table :headers="headers" :items="items" class="elevation-1" hide-actions>
        <template slot="items" slot-scope="props">
          <td class="handle">
            <input type="checkbox" name="selected" @click="toggleSelectedTrack($event, props.item)" class="mr-2 track-selector" />
            {{ props.item.listNumber | padNumber3 }}            
            <v-icon title="Click to play track" @click="playTrack(props.item.track.id)" :color="nowPlaying && (playingTrackId === props.item.track.id) ? 'info' : 'accent'">play_circle_outline</v-icon>  
            <span title="Click and drag to change order" style="max-width: 10px;font-size:18px;">&#128075;</span>            
          </td>
          <td>
            <v-progress-linear
              height="12"
              background-color="secondary"
              color="orange lighten-3"
              :value="props.item.track.rating * 20"
            ></v-progress-linear>           
          </td>          
          <td class="">{{ props.item.track.mediaNumber | padNumber2 }}</td>
          <td class="">{{ props.item.track.trackNumber | padNumber4 }}</td>
          <td class="">{{ props.item.track.title }}</td>
          <td class="box">
            <router-link :to="'/release/' + props.item.track.release.value">
              <img class="thumbnail" :src="props.item.track.releaseImageUrl" :alt="props.item.track.release.text">                
              <span class="thumbnail-text release-title pointer">
                {{ props.item.track.release.text }}
              </span>
            </router-link>
          </td>
          <td class="">{{ props.item.track.release.releaseDate | formattedYear }}</td>
          <td class="box">
            <router-link :to="'/artist/' + props.item.track.artist.artist.value">            
              <img
                class="thumbnail"
                :src="props.item.track.artistImageUrl"
                :alt="props.item.track.artist.artist.text"
              />
              <span class="thumbnail-text artist-name pointer">
              {{ props.item.track.artist.artist.text }}
              </span>
            </router-link>            
          </td>
          <td class="">
            <span class="mr-2">{{ props.item.track.durationTime }}</span>
            <v-icon
              color="red"
              title="Remove from Que"
              class="pointer"
              @click="removeTrackFromQue(props.item)"
              small
            >delete</v-icon>            
            <span v-if="nowPlaying && (playingTrackId === props.item.track.id)">
              <img style="height:15px;" src="@/assets/img/bars.gif" alt="Playing" />
            </span>            
          </td>
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="showSaveAsPlaylist" persistent max-width="400px">
      <v-card class="playque-edit-container" >
        <v-card-title>
          <span class="headline">Creating a new Playlist</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
             <v-form ref="form" v-model="valid" lazy-validation>
                <v-layout wrap>
                  <v-switch
                    color="success"
                    label="Visible to others?"
                    v-model="newPlaylistnameIsPublic"
                  ></v-switch>              
                </v-layout>            
                <v-layout wrap>
                  <v-text-field
                    v-model="newPlaylistname"
                    label="Name"
                    counter
                    maxlength="100"
                    name="newPlaylistname"
                    required                 
                    :rules="[v => !!v || 'Item is required']"  
                  ></v-text-field>  
                </v-layout>
                <v-layout wrap>
                  <v-textarea
                    v-model="newPlaylistDescription"
                    label="Description"
                    maxlength="1000"
                    name="newPlaylistDescription"
                  ></v-textarea>  
                </v-layout>                
              </v-form>                        
          </v-container>
        </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="showSaveAsPlaylist = false">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click="doSaveAsPlaylist">Save</v-btn>
          </v-card-actions>        
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" :top="true">
      {{ snackbarText }}
      <v-btn color="black" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>    
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import Sortable from "sortablejs";

export default {
  components: { Toolbar },
  created() {
    EventBus.$on("pl:ClearQue", this.clearQue);
    EventBus.$on("pl:RemoveSelected", this.removeSelected);
    EventBus.$on("pl:SaveAsPlaylist", this.saveAsPlaylist);
    EventBus.$on("pl:Shuffle", this.shuffleQue);
    EventBus.$on("toolbarRefresh", this.updateData);    
  },
  beforeDestroy() {
    EventBus.$off("pl:ClearQue", this.clearQue);
    EventBus.$off("pl:RemoveSelected", this.removeSelected);
    EventBus.$off("pl:SaveAsPlaylist", this.saveAsPlaylist);   
    EventBus.$off("pl:Shuffle", this.shuffleQue); 
    EventBus.$off("toolbarRefresh", this.updateData);
  },
  async mounted() {
    let table = document.querySelector(".v-datatable tbody");
    const _self = this;
    Sortable.create(table, {
      handle: ".handle", // Use handle so user can select text
      onEnd({ newIndex, oldIndex }) {
        const rowSelected = _self.items.splice(oldIndex, 1)[0]; // Get the selected row and remove it
        _self.items.splice(newIndex, 0, rowSelected); // Move it to the new index
      }
    });    
    this.updateData();
  },
  computed: {     
    quePlaytime() {
      let duration = 0;
      this.items.forEach(t => {
        duration += t.track.duration;
      });
      return duration;
    },
    queTrackCount() {
      return this.items.length;
    },
    playingTrackId() {
      return this.$store.getters.playingIndex.trackId;
    },
    nowPlaying() {
      return this.$store.getters.nowPlaying;
    }
  },
  methods: {
    playTrack: function(id) {
      alert('play track ' + id)
    },
    shuffleQue: function() {
      this.$store.dispatch("shuffleQue");
      this.updateData();
    },
    doSaveAsPlaylist: function() {
      let that=this;
      if (this.$refs.form.validate()) {
        this.showSaveAsPlaylist = false;      
        let playlistData = {
          isPublic: this.newPlaylistnameIsPublic,
          description: this.newPlaylistDescription,
          name: this.newPlaylistname,
          tracks: this.items
        };
        this.$axios
          .post('/playlists/add',playlistData)
          .then(response => {
            if(!response.data.isSuccess) {
              that.snackbarText = "An error has occured";
              that.snackbar = true;   
              that.snackbarColor = "error";   
              return false;
            }
            this.$router.push("/playlist/" + response.data.data.id);
        });        
      }
    },
    saveAsPlaylist: function() {
      if (this.items.length === 0) {
        this.snackbarText = "Add some Tracks to save to a Playlist";
        this.snackbar = true; 
        this.snackbarColor = "error";         
        return false;
      }      
      this.newPlaylistname = "";
      this.showSaveAsPlaylist = true;
    },
    removeSelected: function() {
      this.selectedTracks.forEach(track => {
        this.removeTrackFromQue(track);
      });
      this.snackbarText = "Removed [" + this.selectedTracks.length + "] from Que";
      this.snackbar = true; 
      this.snackbarColor = "success";       
    },
    removeTrackFromQue: function(track) {
      this.$store.dispatch("removeFromQue", track);
      this.updateData();
    },
    toggleSelectedTrack: function(e, track) {
      var isTrackSelected = e.target.checked;
      if(isTrackSelected) {
        if(!this.$_.find(this.selectedTracks, function(t) { return t.track.id === track.track.id; })) {
          this.selectedTracks.push(track);
        }        
      } else { 
        this.$_.remove(this.selectedTracks, function(t) { return t.track.id === track.track.id; });        
      }
    },
    clearQue: function() {
      this.$store.dispatch("clearQue");
      this.updateData();
      this.snackbarText = "Cleared Que";
      this.snackbar = true; 
      this.snackbarColor = "success";         
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.loading = true;
      this.items = [];
      this.$nextTick(() => {
        this.items = this.$store.getters.playQue;
        EventBus.$emit("loadingComplete");
        this.loading = false;
      });
    }
  },
  watch: {
    $route() {
      this.updateData();
    }
  },
  data: () => ({
    snackbar: false,
    snackbarText: "",        
    snackbarColor: "success",
    loading: true,
    valid: true,
    showSaveAsPlaylist: false,
    newPlaylistnameIsPublic: true,
    newPlaylistname: "",
    newPlaylistDescription: "",
    selectedTracks: [],
    headers: [
      { text: "Index", value: "listNumber", width: "145" },
      { text: "Rating", value: "track.rating", width: "55" },
      { text: "Media", value: "track.mediaNumber", width: "50" },
      { text: "Number", value: "track.trackNumber", width: "100" },
      { text: "Track", value: "track.track.text" },
      { text: "Release", value: "track.release.text" },
      { text: "Year", value: "track.release.releaseDate", width: "50" },
      { text: "Artist", value: "track.artist.artist.text" },
      { text: "Time", value: "track.durationTime", width: "50" }
    ],
    menuItems: [
      { title: "Clear Que", class: "hidden-sm-and-down", click: "pl:ClearQue" },
      { title: "Remove Selected", class: "hidden-sm-and-down", click: "pl:RemoveSelected" },
      {
        title: "Save As Playlist",
        tooltip: "Save as a new Playlist",
        class: "hidden-sm-and-down",
        click: "pl:SaveAsPlaylist"
      },
      {
        title: "Save To Playlist",
        tooltip: "Add to existing Playlist",
        class: "hidden-sm-and-down",
        click: "pl:SaveToPlaylist"
      },
      { title: "Shuffle", class: "hidden-sm-and-down", click: "pl:Shuffle" }
    ],
    items: []
  })
};
</script>

<style>
  .playque-edit-container .error--text {
    color: yellow !important;
  }
  .playque-container img.thumbnail {
    width: 50px;
    padding-right: 6px;
  }
  .box {
    display: flex;
    align-items:center;
  }
  .handle {
    cursor: move !important;
    cursor: -webkit-grabbing !important;
  }  
  .sortable-ghost {
    opacity: .75;
    background: #F5F500;
  }
</style>
