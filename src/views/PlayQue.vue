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
          <td class="">
            <input type="checkbox" name="selected" @click="toggleSelectedTrack($event, props.item)" class="mr-2 track-selector" />
            <v-icon
              color="red"
              title="Remove from Que"
              class="pointer"
              @click="removeTrackFromQue(props.item)"
              small
            >delete</v-icon>
            {{ props.item.index | padNumber3 }}
          </td>
          <td>
            <v-progress-linear
              height="12"
              background-color="secondary"
              color="orange lighten-3"
              :value="props.item.rating * 20"
            ></v-progress-linear>           
          </td>          
          <td class="">{{ props.item.mediaNumber | padNumber2 }}</td>
          <td class="">{{ props.item.trackNumber | padNumber4 }}</td>
          <td class="">{{ props.item.title }}</td>
          <td class="box">
            <router-link :to="'/release/' + props.item.release.value">
              <img class="thumbnail" :src="props.item.releaseImageUrl" :alt="props.item.release.text">                
              <span class="thumbnail-text white--text artist-name pointer">
                {{ props.item.release.text }}
              </span>
            </router-link>
          </td>
          <td class="">{{ props.item.release.releaseDate | formattedYear }}</td>
          <td class="box">
            <router-link :to="'/artist/' + props.item.artist.artist.value">            
              <img
                class="thumbnail"
                :src="props.item.artistImageUrl"
                :alt="props.item.artist.artist.text"
              />
              <span class="thumbnail-text white--text artist-name pointer">
              {{ props.item.artist.artist.text }}
              </span>
            </router-link>            
          </td>
          <td class="">{{ props.item.durationTime }}</td>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";

export default {
  components: { Toolbar },
  created() {
    EventBus.$on("pl:ClearQue", this.clearQue);
    EventBus.$on("pl:RemoveSelected", this.removeSelected);
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  beforeDestroy() {
    EventBus.$off("pl:ClearQue", this.clearQue);
    EventBus.$off("pl:RemoveSelected", this.removeSelected);
    EventBus.$off("toolbarRefresh", this.updateData);
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    quePlaytime() {
      let duration = 0;
      this.items.forEach(t => {
        duration += t.duration;
      });
      return duration;
    },
    queTrackCount() {
      return this.items.length;
    }
  },
  methods: {
    removeSelected: function() {
      this.selectedTracks.forEach(track => {
        this.removeTrackFromQue(track);
      });
    },
    removeTrackFromQue: function(track) {
      this.$store.dispatch("removeFromQue", track);
      this.updateData();
    },
    toggleSelectedTrack: function(e, track) {
      var isTrackSelected = e.target.checked;
      if(isTrackSelected) {
        if(!this.$_.find(this.selectedTracks, function(t) { return t.id === track.id; })) {
          this.selectedTracks.push(track);
        }        
      } else { 
        this.$_.remove(this.selectedTracks, function(t) { return t.id === track.id; });        
      }
    },
    clearQue: function() {
      this.$store.dispatch("clearQue");
      this.updateData();
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
    $route(to) {
      this.updateData();
    }
  },
  data: () => ({
    loading: true,
    selectedTracks: [],
    headers: [
      { text: "Index", value: "index", width: "115" },
      { text: "Rating", value: "rating", width: "55" },
      { text: "Media", value: "mediaNumber", width: "50" },
      { text: "Number", value: "trackNumber", width: "100" },
      { text: "Track", value: "track.text" },
      { text: "Release", value: "release.text" },
      { text: "Year", value: "release.releaseDate", width: "50" },
      { text: "Artist", value: "artist.artist.text" },
      { text: "Time", value: "durationTime", width: "50" }
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
        click: "pl:SaveAsPlaylist"
      }
    ],
    items: []
  })
};
</script>

<style>
.playque-container img.thumbnail {
  width: 50px;
  padding-right: 6px;
}

.box {
   display: flex;
   align-items:center;
}

</style>
