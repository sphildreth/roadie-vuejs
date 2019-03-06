<template>
  <div class="playlist-detail-container">
    <Toolbar
      :menuItems="menuItems"
      :hasDeleteRights="hasModifyRights"
      :hasEditRights="hasModifyRights"
      :toolbarIcon="'playlist_play'"
    ></Toolbar>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="profile darken-1">
                <v-card-text class="title">
                  {{ playlist.name }}
                  <v-icon
                    v-if="playlist.isLocked"
                    style="float: right;"
                    title="Playlist is locked!"
                    color="warning"
                  >lock</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-img
                    :src="playlist.mediumThumbnail.url"
                    :alt="playlist.name"
                    class="ma-1"
                    aspect-ratio="1"
                  ></v-img>
                  <img id="playlistImage" :src="playlist.mediumThumbnail.url" style="display:none;" />
                </v-flex>
                <v-flex xs9 class="title">
                  <v-layout row wrap>
                    <v-flex xs4 class="mt-2" xs8 md3>
                      <UserCard :user="playlist.maintainer"></UserCard>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm5 md5>
          <v-tabs right color="primary" slider-color="accent">
            <v-tab>Description</v-tab>
            <v-tab v-if="playlist.tagsList.length > 0">Tags</v-tab>
            <v-tab v-if="playlist.urLsList.length">Urls</v-tab>
            <v-tab-item>
              <v-card flat class="description darken-3">
                <v-card-text v-html="playlist.description">Loading...</v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="playlist.tagsList.length > 0">
              <v-list>
                <template v-for="(name, index) in playlist.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider v-if="index + 1 < playlist.tagsList.length" :key="`tdivider-${index}`"></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="playlist.urLsList.length">
              <v-list>
                <template v-for="(name, index) in playlist.urLsList">
                  <v-list-tile :key="`u-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a v-bind:href="name" target="_blank">{{ name }}</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < playlist.urLsList.length"
                    :key="`uaadivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex d-flex xs12>
          <div class="stats-container hidden-sm-and-down">
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>library_music</v-icon>
                </v-avatar>
                {{ playlist.statistics.releaseCount | padNumber4 }}
              </v-chip>
              <span>Playlist Release Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>audiotrack</v-icon>
                </v-avatar>
                {{ playlist.statistics.trackCount | padNumber4 }}
              </v-chip>
              <span>Playlist Track Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ playlist.statistics.trackSize }}
              </v-chip>
              <span>Playlist Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ playlist.statistics.fileSize }}
              </v-chip>
              <span>Playlist Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ playlist.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Playlist Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ playlist.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Playlist Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-card v-if="trackItems.length > 0">
          <v-card-text>
            <v-data-iterator
              :items="trackItems"
              :rows-per-page-items="rowsPerPageItems"
              :hide-actions="trackPagination.totalItems < trackPagination.rowsPerPage"
              :total-items="trackPagination.totalItems"
              :pagination.sync="trackPagination"
              content-tag="v-layout"
              :loading="true"
              row
              wrap
            >
              <v-flex slot="item" slot-scope="props" xs12 sm6>
                <TrackCard :track="props.item" :release="props.item.release"></TrackCard>
              </v-flex>
            </v-data-iterator>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-container>
    <confirm ref="confirm"></confirm>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import UserCard from "@/components/UserCard";
import TrackCard from "@/components/TrackCard";
import Confirm from "@/views/Confirm";

import { EventBus } from "@/event-bus.js";
export default {
  components: { Toolbar, UserCard, TrackCard, Confirm },
  props: {
    id: String
  },
  created() {
    EventBus.$on("pl:AddToQue", this.addToQue);
    EventBus.$on("pl:PlayNow", this.playNow);
    EventBus.$on("pl:Delete", this.delete);
    EventBus.$on("pl:Edit", this.edit);  
    EventBus.$on("pl:EditTracks", this.editTracks);  
    EventBus.$on("toolbarRefresh", this.updateData);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("pl:Delete", this.delete);
    EventBus.$off("pl:AddToQue", this.addToQue);
    EventBus.$off("pl:PlayNow", this.playNow);
    EventBus.$off("pl:Edit", this.edit);  
    EventBus.$off("pl:EditTracks", this.editTracks);      
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    hasModifyRights() {
      return this.$store.getters.isUserAdmin || this.playlist.userCanEdit;
    }
  },
  methods: {
    playNow: function() {
      this.$playQue.deleteAll()
      .then(() => {
        this.addToQue();
      });
    },
    edit: function() {
      this.$router.push("/playlist/edit/" + this.playlist.id);
    },    
    editTracks: function() {
      this.$router.push("/playlist/edittracks/" + this.playlist.id);
    }, 
    delete: function() {
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                process.env.VUE_APP_API_URL +
                  "/playlists/delete/" +
                  this.playlist.id
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },
    addToQue: function() {
      EventBus.$emit("loadingStarted");
      let queTracks = [];      
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/tracks?page=1&limit=${this.playlist.statistics.trackCount}&filterToPlaylistId=${this.playlist.id}`
        )
        .then(response => {
          response.data.rows.forEach(tr => {
            let artist = tr.trackArtist || tr.artist;
            let queTrack = {
              id: tr.id,
              played: 0,
              mediaNumber: tr.mediaNumber,
              trackNumber: tr.trackNumber,
              title: tr.title,
              duration: tr.duration,
              durationTime: tr.durationTime,
              rating: tr.rating,
              playedCount: tr.playedCount,
              trackPlayUrl: tr.trackPlayUrl,
              release: {
                text: tr.release.release.text,
                value: tr.release.release.value,
                releaseDate: tr.release.releaseDate
              },
              artist: artist,
              releaseArtist: tr.artist,
              releaseImageUrl: tr.release.thumbnail.url,
              artistImageUrl: artist.thumbnail.url,
              userRating: tr.userRating || { rating: 0 }
            };
            queTracks.push(queTrack);
          });
          return this.$playQue.add(queTracks);
        })
        .then(function(result) {
          const message = result.message || "Added [" + queTracks.length + "] to Que";
          EventBus.$emit("showSnackbar", { text: message });
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        }); 
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/playlists/${this.id}`)
        .then(response => {
          this.playlist = response.data.data;
          this.playlist.tagsList = this.playlist.tagsList || [];
          this.playlist.urLsList = this.playlist.urLsList || [];
          this.$axios
            .get(
              process.env.VUE_APP_API_URL +
                `/tracks?page=${this.trackPagination.page}&limit=${
                  this.trackPagination.rowsPerPage
                }&filterToPlaylistId=${this.playlist.id}`
            )
            .then(response => {
              this.trackItems = response.data.rows;
              this.trackPagination.totalItems = response.data.totalCount;
            })
            .finally(() => {
              EventBus.$emit("loadingComplete");
              this.$nextTick(() => {
                var image=document.getElementById('playlistImage')
                if(image) {
                  window.favIcon.image(image);             
                }
                document.title = this.playlist.name;
              });              
            });
        });
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    trackPagination: {
      async handler() {
        this.updateData();
      }
    }
  },
  data: () => ({
    rowsPerPageItems: [6, 12, 24, 36, 60, 120,500],
    playlist: {
      maintainer: {
        thumbnail: {},
        user: {}
      },
      mediumThumbnail: {},
      statistics: {},
      tagsList: [],
      urLsList: []
    },
    trackPagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0
    },
    menuItems: [
      { title: "Add To Que", class: "hidden-xs-only", click: "pl:AddToQue" },
      {
        title: "Play",
        tooltip: "Remove anything in Que and start Playing",
        class: "hidden-xs-only",
        click: "pl:PlayNow"
      },
      {
        title: "Delete",
        class: "hidden-xs-only",
        permission: "delete",
        click: "pl:Delete"
      },
      {
        title: "Edit",
        class: "hidden-xs-only",
        permission: "edit",
        click: "pl:Edit"
      },
      {
        title: "Edit Tracks",
        class: "hidden-xs-only",
        permission: "edit",
        click: "pl:EditTracks"
      }      
    ],
    trackItems: []
  })
};
</script>


<style>
</style>
