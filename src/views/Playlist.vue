<template>
  <div class="playlist-detail-container">
    <Toolbar
      :menuItems="menuItems"
      :hasDeleteRights="hasModifyRights"
      :hasEditRights="hasModifyRights"
      :bookmarked="playlist.userBookmarked"
      :doShowBookmark="true"         
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
                    lazy-src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBmRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAExAAIAAAAQAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQubmV0IDQuMS40AP/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAFAAUAMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAAABQYEBwMB/8QAPBAAAQMBAgkICAYDAAAAAAAAAQACAwQFEQYSExYhMVSS0RVBUVNxkZPhFCIyNYKhssIjM0JhYtJDscH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A5UhCEC3COR8Ni1L4nFrrgLxr0uAU3g5bcdBHNHVmV7HEFmKL7td/P2Kiwn9w1fY362rnqDodJbln1Lg1k4Y86g8Yvkma5SqnBO1n5UUNQ4uaR+E48x6EFahCEAhCEAhCECrCj3DVdjfqCiaGz6mubIaWPKZO7GF4Gu/p7FbYUe4qr4fqCU4C6q34PuQS0jHRvcyRpa9puIIuIX2KR0UrJIzc9hDgeghWmFFk+lw+k07b6iMaQP1t4hRCDptBWR1dFHUtIDXNvdp9k84X2mq4Kxr/AEWZr8U3Et5iue0ENXVuNNSGQtfpc0OIb2lXVjWbHZlLk2HGkdpe/pPBBMVtuWpS1c0Dp2kxuLb8m3T++peGcdp9c3w28FrrrAtGqrJpy2IZRxddj6l4ZsWh0Rb6C6QsNp2nTWdGDUOOMfZY3S4pBLha/G/CpGhv8n3lA3wp9xVPw/UEqwF1Vvwfcs9pYQsr7Lmp3wOjldi3EOvGggrRgLqrfg+5BtzgjhtWelrGhkbXYrZG3/NbJLPsyudljFDITpxmO192tTlsWLaFRadRLDTl0b3Xg47dPzWLkC09lO+3igrai0LNsmEsYY2kf44gCT2+aQyYWVZe7JwU4ZfoDgSe+8LByBaeynfbxRyBaeynfbxQbc667qabdd/ZGddd1NNuu/ssXINp7K7ebxRyDaeyu3m8UGW0ql9ZXTTSEkucbh0DmCypzhFZUlFVSTMaTTPdjBw/TfzFJkAqzAX2a3tZ9yloo3yyNZExz3u0BrReSr3B6zzZlAcr+c847wNN3QEGG0MJjSVs0ApQ/JuxcbKXX/JZs7nbGPE8knraSuqauac0VSMo8uuyTtF57F48m12x1PhO4IH2dztjb4nkjO5+xt8TySHk2u2Op8J3BHJtdsdT4TuCB9nc/Y2+J5IzufsbfE8kh5NrtjqfCdwRybXbHU+E7gg6UQHAggEHWCsEtjWdI7GdSR3/AMfV/wBJghAtc+zLIafyYCRqA9Y/9KXOwrpQ4hsExHMdGn5pRhZG91syFrHEYrdIH7JPkZerfulBXZ2U2zzfJGdlNs83eFI5GXq37pRkZerfulBXZ2U2zzd4RnZTbPN3hSORl6t+6UZGXq37pQV2dlNs83eEZ2U2zzd4UjkZerfulGRl6t+6UH//2Q=="                    
                  ></v-img>
                  <img id="playlistImage" :src="playlist.mediumThumbnail.url" style="display:none;" />
                </v-flex>
                <v-flex xs9 class="title">
                  <v-layout row wrap>
                    <v-flex xs4 class="mt-2" xs8 lg4>
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
                <v-card-text v-html="playlist.description">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>                  
                </v-card-text>
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
                        <a v-bind:href="name" rel="noopener noreferrer" target="_blank">{{ name }}</a>
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
              :rows-per-page-items="this.$store.getters.rowsPerPageItems"
              :hide-actions="trackPagination.totalItems < trackPagination.rowsPerPage"
              :total-items="trackPagination.totalItems"
              :pagination.sync="trackPagination"
              content-tag="v-layout"
              :loading="true"
              row
              wrap
            >
              <v-flex slot="item" slot-scope="props" d-flex xs12 md6>
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
    this.trackPagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;    
    EventBus.$on("pl:AddToQue", this.addToQue);
    EventBus.$on("pl:PlayNow", this.playNow);
    EventBus.$on("pl:Delete", this.delete);
    EventBus.$on("pl:Edit", this.edit);  
    EventBus.$on("pl:EditTracks", this.editTracks);  
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("bookmarkToogle", this.toggleBookmark);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("pl:Delete", this.delete);
    EventBus.$off("pl:AddToQue", this.addToQue);
    EventBus.$off("pl:PlayNow", this.playNow);
    EventBus.$off("pl:Edit", this.edit);  
    EventBus.$off("pl:EditTracks", this.editTracks);      
    EventBus.$off("bookmarkToogle", this.toggleBookmark);    
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
    toggleBookmark: async function() {
      this.$axios
        .post(
          process.env.VUE_APP_API_URL +
            "/users/setPlaylistBookmark/" +
            this.playlist.id +
            "/" +
            !this.playlist.userBookmarked
        )
        .then(response => {
          if (!this.playlist.userBookmarked) {
            EventBus.$emit("showSnackbar", { text: "Successfully bookmarked" });
          } else if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", {
              text: "Successfully removed bookmark"
            });
          }
          this.playlist.userBookmarked = !this.playlist.userBookmarked;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },      
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
