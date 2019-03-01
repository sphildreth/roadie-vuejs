<template>
  <div class="playlist-track-edit-container">
    <Toolbar :menuItems="menuItems" :doShowRefresh="false" :toolbarIcon="'fas fa-edit'"></Toolbar>
    <v-layout align-center row wrap>
      <span class="mt-2">
        <v-btn @click="selectAllTracks" flat small>Select All</v-btn>
        <v-btn @click="selectNoTracks" flat small>Select None</v-btn>
      </span>
      <v-spacer></v-spacer>
    </v-layout>
    <v-container fluid grid-list-md>
      <v-data-table
        no-data-text="No Tracks In Playlist"
        :headers="headers"
        :items="items"
        class="elevation-1"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td class="handle">
              <input
                type="checkbox"
                name="selectedTrack[]"
                :value="props.item.trackNumber"
                class="mr-2 track-selector"
              >
              {{ props.item.trackNumber | padNumber3 }}
              <span
                title="Click and drag to change order"
                style="max-width: 10px;font-size:18px;"
              >&#128075;</span>
            </td>
            <td class>
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/track/' + props.item.track.value"
              >{{ props.item.track.text }}</router-link>
            </td>
            <td class="box">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/release/' + props.item.release.release.value"
              >
                <img
                  class="thumbnail"
                  :src="props.item.thumbnail.url"
                  :alt="props.item.release.release.text"
                >
                <span
                  class="thumbnail-text release-title pointer"
                >{{ props.item.release.release.text }}</span>
              </router-link>
            </td>
            <td class>{{ props.item.release.release.releaseDate | formattedYear }}</td>
            <td class="box">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/artist/' + props.item.artist.artist.value"
              >
                <img
                  class="thumbnail"
                  :src="props.item.artist.thumbnail.url"
                  :alt="props.item.artist.artist.text"
                >
                <span class="thumbnail-text artist-name pointer">{{ props.item.artist.artist.text }}</span>
              </router-link>
            </td>
            <td class>
              <span class="mr-2">{{ props.item.durationTime }}</span>
              <v-icon
                color="red"
                title="Remove Track from Playlist"
                class="pointer"
                @click="removeTrack(props.item)"
                small
              >delete</v-icon>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import Sortable from "sortablejs";

export default {
  components: { Toolbar },
  props: {
    id: String
  },
  created() {
    EventBus.$on("pl:RemoveSelected", this.removeSelected);
    EventBus.$on("pl:Save", this.save);
    EventBus.$on("pl:Cancel", this.cancel);
  },
  beforeDestroy() {
    EventBus.$off("pl:RemoveSelected", this.removeSelected);
    EventBus.$on("pl:Save", this.save);
    EventBus.$on("pl:Cancel", this.cancel);
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
  computed: {},
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    toggleSelected: function(checked) {
      var checkboxes = document.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = checked;
      }
    },
    selectAllTracks: function() {
      this.selectedTracks = this.items;
      this.toggleSelected(true);
    },
    selectNoTracks: function() {
      this.selectedTracks = [];
      this.toggleSelected(false);
    },
    removeSelected: function() {
      this.selectedTracks = [].filter.call(document.getElementsByName('selectedTrack[]'), (c) => c.checked).map(c => c.value);
      this.removeTracksFromPlaylist(this.selectedTracks);
    },
    removeTrack: function(track) {
      this.removeTracksFromPlaylist([track.trackNumber]);
    },
    removeTracksFromPlaylist: function(tracks) {
      if(tracks) {
        let newList = this.items;
        tracks.forEach(tr => {
          newList = this.$_.filter(newList, function(t) {
            return t.trackNumber != tr;
          })
        });
        this.items = newList;
      }
      var checks = document.getElementsByName('selectedTrack[]');
      for(var i =0; i< checks.length;i++){
          var check = checks[i];
          if(!check.disabled){
              check.checked = false;
          }
      }      
      this.selectedTracks = [];
    },
    updateData: async function(doShuffle) {
      EventBus.$emit("loadingStarted");
      this.loading = true;
      this.items = [];
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/tracks?page=1&limit=1000&filterToPlaylistId=${this.id}`
        )
        .then(response => {
          this.items = response.data.rows;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.loading = false;
        });
    },
    save() {
      let that = this;
      var tracks = this.$_.map(this.items, function(track, index) {
            return {                             
              listNumber: index + 1,
              oldListNumber: track.trackNumber,
              track: {
                id: track.id
              }
            };
      });
      that.$axios.post("/playlists/edittracks", { id: this.id, tracks: tracks}).then(response => {
        if (!response.data.isSuccess) {
          EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" });
          return false;
        }
        that.$router.go(-1);
      });
    }
  },
  watch: {
    $route() {
      this.updateData();
    }
  },
  data: () => ({
    loading: true,
    selectedTracks: [],
    headers: [
      { text: "Index", value: "trackNumber", width: "120" },
      { text: "Track", value: "track.text" },
      { text: "Release", value: "release.release.text" },
      { text: "Year", value: "release.releaseDate", width: "50" },
      { text: "Artist", value: "artist.artist.text" },
      { text: "Time", value: "durationTime", width: "50" }
    ],
    menuItems: [
      {
        title: "Remove Selected",
        class: "hidden-sm-and-down",
        click: "pl:RemoveSelected"
      },
      { title: "Save", class: "hidden-xs-only", click: "pl:Save" },
      { title: "Cancel", class: "hidden-xs-only", click: "pl:Cancel" }
    ],
    items: []
  })
};
</script>

<style>
.playlist-track-edit-container .container {
  padding: 0px 20px;
}
.playque-edit-container .error--text {
  color: yellow !important;
}
.playlist-track-edit-container img.thumbnail {
  width: 50px;
  padding-right: 6px;
  vertical-align: middle;
}
.playlist-track-edit-container tr.playing-paused-track .playing-icon {
  color: green !important;
}
.playlist-track-edit-container table.v-table thead td:not(:nth-child(1)),
.playlist-track-edit-container table.v-table tbody td:not(:nth-child(1)),
.playlist-track-edit-container table.v-table thead th:not(:nth-child(1)),
.playlist-track-edit-container table.v-table tbody th:not(:nth-child(1)),
.playlist-track-edit-container table.v-table thead td:first-child,
.playlist-track-edit-container table.v-table tbody td:first-child,
.playlist-track-edit-container table.v-table thead th:first-child,
.playlist-track-edit-container table.v-table tbody th:first-child {
  padding: 0 8px;
}
.box {
  display: flex;
  align-items: center;
}
.handle {
  cursor: move !important;
  cursor: -webkit-grabbing !important;
}
.sortable-ghost {
  opacity: 0.75;
  background: #f5f500;
}
</style>
