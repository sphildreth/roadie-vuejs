<template>
  <div class="playque-container">
    <Toolbar v-if="!isFullScreen" :menuItems="menuItems" :toolbarIcon="'headset'"></Toolbar>
    <v-layout v-if="!isFullScreen" align-center row wrap>      
      <span class="mt-2 hidden-md-and-down">
        <v-btn @click="selectAllTracks" flat small>Select All</v-btn>
        <v-btn @click="selectNoTracks" flat small>Select None</v-btn>
      </span>
      <v-switch
        height="2"
        class="mt-4 hidden-md-and-down"
        small          
        color="success"
        label="Scroll to playing Track"
        v-model="doScrollIntoView"
      ></v-switch>      
      <v-spacer></v-spacer>
      <div class="stats-container hidden-md-and-down">
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>fas fa-users</v-icon>
            </v-avatar>
            {{ queArtistCount | padNumber3 }}
          </v-chip>
          <span>Que Artist Count</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>library_music</v-icon>
            </v-avatar>
            {{ queReleaseCount | padNumber3 }}
          </v-chip>
          <span>Que Release Count</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>audiotrack</v-icon>
            </v-avatar>
            {{ queTrackCount | padNumber3 }}
          </v-chip>
          <span>Que Track Count</span>
        </v-tooltip>
        <v-tooltip bottom>
          <v-chip slot="activator" color="secondary" text-color="white">
            <v-avatar>
              <v-icon>play_circle_outline</v-icon>
            </v-avatar>
            {{ quePlayedCount | padNumber5 }}
          </v-chip>
          <span>Que Track Played Count</span>
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
    </v-layout>

    <v-container class="hidden-xs-only" fluid grid-list-md>
      <v-data-table
        no-data-text="No Tracks In Que"
        :headers="headers"
        :items="items"
        class="elevation-1"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr
            :data-trackid="props.item.track.id"          
            :class="nowPlaying && (playingTrackId === props.item.track.id) ? 'playing-track' : (playingTrackId === props.item.track.id) ? 'playing-paused-track' : 'pending-track'"
          >
            <td class="handle">
              <input
                type="checkbox"
                name="selectedTrack"
                :value="props.item.track.id"
                @click="toggleSelectedTrack($event, props.item)"
                class="mr-2 track-selector hidden-md-and-down"
              >
              <span @click="playTrack(props.item.track.id)" class="track-list-number" :class="props.item.track.played ? 'played' : 'pending'">
                {{ props.item.listNumber | padNumber3 }}
              </span>
              <v-icon
                class="no-rainbow playing-icon  hidden-md-and-down"
                title="Click to play track"
                @click="playTrack(props.item.track.id)"
                :color="nowPlaying && (playingTrackId === props.item.track.id) ? 'info' : 'accent'"
              >play_circle_outline</v-icon>
              <span
                class="no-rainbow hidden-md-and-down"
                title="Click and drag to change order"
                style="max-width: 10px;font-size:18px;"
              >&#128075;</span>
            </td>
            <td class="hidden-md-and-down">
              <v-progress-linear
                height="12"
                background-color="secondary"
                color="orange lighten-3 no-rainbow"
                :value="props.item.track.rating * 20"
              ></v-progress-linear>
            </td>
            <td class="hidden-md-and-down">{{ props.item.track.mediaNumber | padNumber2 }}</td>
            <td class="hidden-md-and-down">{{ props.item.track.playedCount | padNumber5 }}</td>
            <td class="hidden-xs-only">{{ props.item.track.trackNumber | padNumber4 }}</td>
            <td class="track-text">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/track/' + props.item.track.id"
              >{{ props.item.track.title }}</router-link>
            </td>
            <td class="box release-text">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/release/' + props.item.track.release.value"
              >
                <img
                  class="thumbnail hidden-md-and-down"
                  :src="props.item.track.releaseImageUrl"
                  :alt="props.item.track.release.text"
                >
                <span
                  class="thumbnail-text release-title pointer"
                >{{ props.item.track.release.text }}</span>
              </router-link>
            </td>
            <td class="hidden-xs-only">{{ props.item.track.release.releaseDate | formattedYear }}</td>
            <td class="box artist-text">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/artist/' + props.item.track.artist.artist.value"
              >
                <img
                  class="thumbnail hidden-md-and-down"
                  :src="props.item.track.artistImageUrl"
                  :alt="props.item.track.artist.artist.text"
                >
                <span
                  class="thumbnail-text artist-name pointer"
                >{{ props.item.track.artist.artist.text }}</span>
              </router-link>
            </td>
            <td class="hidden-md-and-down">
              <span class="mr-2">{{ props.item.track.durationTime }}</span>
              <v-icon
                color="red"
                title="Remove from Que"
                class="pointer no-rainbow"
                @click="removeTrackFromQue(props.item)"
                small
              >delete</v-icon>
              <span
                v-if="nowPlaying && (playingTrackId === props.item.track.id)"
                title="Track is Playing"
              >
                <img style="height:15px;" src="@/assets/img/bars.gif" alt="Playing">
              </span>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>

    <v-container class="hidden-sm-and-up" fluid grid-list-md>
      <v-data-table
        no-data-text="No Tracks In Que"
        :headers="smallHeaders"
        :items="items"
        class="elevation-1"
        hide-actions
      >
        <template slot="items" slot-scope="props">
          <tr
            :class="nowPlaying && (playingTrackId === props.item.track.id) ? 'playing-track' : (playingTrackId === props.item.track.id) ? 'playing-paused-track' : ''"
          >
            <td class="handle">
              <span @click="playTrack(props.item.track.id)">
                {{ props.item.listNumber | padNumber3 }}
              </span>
            </td>
            <td class="track-text">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/track/' + props.item.track.id"
              >{{ props.item.track.title }}</router-link>
            </td>
            <td class="release-text">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/release/' + props.item.track.release.value"
              >
                <span
                  class="thumbnail-text release-title pointer"
                >{{ props.item.track.release.text }}</span>
              </router-link>
            </td>
            <td class="artist-text">
              <router-link
                class="body-1"
                :style="{ color: $vuetify.dark ? 'white' : 'black' }"
                :to="'/artist/' + props.item.track.artist.artist.value"
              >
                <span
                  class="thumbnail-text artist-name pointer"
                >{{ props.item.track.artist.artist.text }}</span>
              </router-link>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>


    <v-dialog v-model="showSaveAsPlaylist" persistent max-width="400px">
      <v-card class="playque-edit-container">
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
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import { EventBus } from "@/event-bus.js";
import Sortable from "sortablejs";
var VueScrollTo = require('vue-scrollto');

export default {
  components: { Toolbar },
  created() {
    EventBus.$on("pl:PlayQue", this.playFirstTrackInQue);
    EventBus.$on("pl:ClearQue", this.clearQue);
    EventBus.$on("pl:RemoveSelected", this.removeSelected);
    EventBus.$on("pl:RemovePlayed", this.removePlayed);
    EventBus.$on("pl:SaveAsPlaylist", this.saveAsPlaylist);
    EventBus.$on("pl:Shuffle", this.shuffleQue);
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("q:addedTracksToQue", this.updateData);
    EventBus.$on("q:deletedTrackFromQue", this.updateData);
    EventBus.$on("q:markTrackAsPlayed",  info => this.markTrackAsPlayed(info));    
  },
  beforeDestroy() {
    EventBus.$off("pl:PlayQue", this.playFirstTrackInQue);
    EventBus.$off("pl:ClearQue", this.clearQue);
    EventBus.$off("pl:RemoveSelected", this.removeSelected);
    EventBus.$off("pl:RemovePlayed", this.removePlayed);
    EventBus.$off("pl:SaveAsPlaylist", this.saveAsPlaylist);
    EventBus.$off("pl:Shuffle", this.shuffleQue);
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("q:addedTracksToQue", this.updateData);
    EventBus.$off("q:deletedTrackFromQue", this.updateData);
    EventBus.$off("q:markTrackAsPlayed",  info => this.markTrackAsPlayed(info));    
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
    quePlayedCount() {
      let playedCount = 0;
      this.items.forEach(t => {
        playedCount += t.track.playedCount || 0;
      });
      return playedCount;
    },
    queTrackCount() {
      return this.items.length;
    },
    queReleaseCount() {
      let releaseIds = this.$_.flatMap(this.items, function(e) {
        return e.track.release.value;
      });
      return this.$_.uniqBy(releaseIds).length;
    },
    queArtistCount() {
      let artistIds = [];
      this.items.forEach(t => {
        artistIds.push(t.track.artist.id);
        if (t.track.releaseArtist) {
          artistIds.push(t.track.releaseArtist.id);
        }
      });
      return this.$_.uniqBy(artistIds).length;
    },
    playingTrackId() {
      return this.$store.getters.playingIndex.trackId;
    },
    nowPlaying() {
      return this.$store.getters.nowPlaying;
    },
    isFullScreen() {
      return this.$store.getters.isFullscreen;
    }
  },
  methods: {
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
    playFirstTrackInQue: function() {
      if (this.items.length === 0) {
        return;
      }
      this.playTrack(this.items[0].track.id);
    },
    playTrack: function(id) {
      this.items.forEach(t => {
        let tr = t.track;
        if (tr.id === id) {
          this.$store.dispatch("playRequest", {
            index: tr.index,
            trackId: tr.id,
            releaseId: tr.release.value,
            artistId: tr.artist.id
          });
          return;
        }
      });
    },
    shuffleQue: function() {
      this.updateData(true);
    },
    doSaveAsPlaylist: function() {
      if (this.$refs.form.validate()) {
        this.showSaveAsPlaylist = false;
        let playlistData = {
          isPublic: this.newPlaylistnameIsPublic,
          description: this.newPlaylistDescription,
          name: this.newPlaylistname,
          tracks: this.items
        };
        this.$axios.post("/playlists/add", playlistData).then(response => {
          if (!response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "An error has occured",
              color: "red"
            });
            return false;
          }
          this.$router.push("/playlist/" + response.data.data.id);
        });
      }
    },
    saveAsPlaylist: function() {
      if (this.items.length === 0) {
        EventBus.$emit("showSnackbar", {
          text: "Add some Tracks to save to a Playlist",
          color: "red"
        });
        return false;
      }
      this.newPlaylistname = "";
      this.showSaveAsPlaylist = true;
    },
    removeSelected: function() {
      this.removeTracksFromQue(this.selectedTracks);
      EventBus.$emit("showSnackbar", {
        text: "Removed [" + this.selectedTracks.length + "] from Que"
      });
      this.selectedTracks = [];
    },
    removePlayed: function() {
      this.$playQue
        .removePlayed()
        .then(() => {
          this.updateData();
        });
    },
    removeTrackFromQue: function(track) {
      this.removeTracksFromQue([track]);
    },
    removeTracksFromQue: function(tracks) {
      this.$playQue
        .delete(
          this.$_.map(tracks, function(track) {
            return track.track.id;
          })
        )
        .then(() => {
          this.updateData();
        });
    },
    toggleSelectedTrack: function(e, track) {
      var isTrackSelected = e.target.checked;
      if (isTrackSelected) {
        if (
          !this.$_.find(this.selectedTracks, function(t) {
            return t.track.id === track.track.id;
          })
        ) {
          this.selectedTracks.push(track);
        }
      } else {
        this.$_.remove(this.selectedTracks, function(t) {
          return t.track.id === track.track.id;
        });
      }
    },
    clearQue: function() {
      this.$playQue
        .deleteAll()
        .then(() => {
          this.updateData();
        })
        .then(() => {
          this.$store.dispatch("playIndexChange", {});
        })
        .then(() => {
          EventBus.$emit("showSnackbar", { text: "Cleared Que" });
        });
    },
    updateData: async function(doShuffle) {
      EventBus.$emit("loadingStarted");
      this.loading = true;
      this.items = [];
      this.$nextTick(() => {
        // TODO pagination; For now load first 1000 items
        this.$playQue.list(0, 1000, doShuffle).then(resolve => {
          this.items = this.$_.orderBy(resolve.tracks, ["listNumber"]);
          EventBus.$emit("loadingComplete");
          this.loading = false;
        });
      });
    },
    markTrackAsPlayed: async function(info) {
      let track = this.$_.find(this.items, function(t) {
        return t.track.id === info.trackId;
      });
      if(track) {
        track.played = true;
        var te = document.querySelectorAll("[data-trackid='" + info.trackId + "']")[0];
        var e = te.querySelector(".track-list-number")
        if(e) {
          e.classList.add('played');
          e.classList.remove('pending');
        }
        if(this.doScrollIntoView) {
          var cancelScroll = VueScrollTo.scrollTo(te)
        }
      }
    }
  },
  watch: {
    $route() {
      this.updateData();
    }
  },
  data: () => ({
    loading: true,
    valid: true,
    doScrollIntoView: true,
    showSaveAsPlaylist: false,
    newPlaylistnameIsPublic: true,
    newPlaylistname: "",
    newPlaylistDescription: "",
    selectedTracks: [],
    headers: [
      { text: "Index", value: "listNumber", width: "120"},
      { text: "Rating", value: "track.rating", class:"hidden-md-and-down", width: "55" },
      { text: "Media", value: "track.mediaNumber", class:"hidden-md-and-down", width: "50" },
      { text: "Played", value: "track.playedCount", class:"hidden-md-and-down", width: "50" },
      { text: "Number", value: "track.trackNumber", width: "50" },
      { text: "Track", value: "track.track.text" },
      { text: "Release", value: "track.release.text" },
      { text: "Year", value: "track.release.releaseDate", width: "50" },
      { text: "Artist", value: "track.artist.artist.text" },
      { text: "Time", value: "track.durationTime", class:"hidden-md-and-down", width: "50" }
    ],
    smallHeaders: [
      { text: "Index", value: "listNumber", width: "10"},
      { text: "Track", value: "track.track.text" },
      { text: "Release", value: "track.release.text" },
      { text: "Artist", value: "track.artist.artist.text" }
    ],    
    menuItems: [
      { title: "Play Que", class: "", click: "pl:PlayQue" },
      { title: "Clear Que", class: "hidden-xs-and-down", click: "pl:ClearQue" },
      {
        title: "Remove Selected",
        class: "hidden-md-and-down",
        click: "pl:RemoveSelected"
      },
      {
        title: "Remove Played",
        class: "hidden-md-and-down",
        click: "pl:RemovePlayed"
      },      
      {
        title: "Save As Playlist",
        tooltip: "Save as a new Playlist",
        class: "hidden-sm-and-down",
        click: "pl:SaveAsPlaylist"
      },
      { title: "Shuffle", class: "hidden-sm-and-down", click: "pl:Shuffle" }
    ],
    items: []
  })
};
</script>

<style>
.playque-container .container {
  padding: 0px 20px;
}
.playque-edit-container .error--text {
  color: yellow !important;
}
.playque-container img.thumbnail {
  width: 50px;
  padding-right: 6px;
  vertical-align: middle;
}
.playque-container tr.playing-paused-track .playing-icon {
  color: green !important;
}
.playque-container table.v-table thead td:not(:nth-child(1)),
.playque-container table.v-table tbody td:not(:nth-child(1)),
.playque-container table.v-table thead th:not(:nth-child(1)),
.playque-container table.v-table tbody th:not(:nth-child(1)),
.playque-container table.v-table thead td:first-child,
.playque-container table.v-table tbody td:first-child,
.playque-container table.v-table thead th:first-child,
.playque-container table.v-table tbody th:first-child {
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
.playque-container .played { 
  color: darkgray !important;
}
</style>
