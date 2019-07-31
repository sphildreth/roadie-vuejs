<template>
  <div class="user-detail-container">
    <Toolbar
      :menuItems="menuItems"
      :adminItems="adminMenuItems"
      :toolbarIcon="'account_circle'"
    ></Toolbar>    
    <div class="ma-5" v-if="loaded && isPrivate">
      <v-icon>fas fa-user-shield</v-icon>
      User has elected to be private, mysterious and elusive.
    </div>
    <div v-if="loaded && !isPrivate">
      <v-container v-if="loaded" fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm7 md7>
            <v-layout row wrap>
              <v-flex xs12>
                <v-card color="primary" class="profile darken-1">
                  <v-card-text class="title">
                    {{ user.userName }}
                    <v-icon
                      v-if="isViewingSelf"
                      style="float: right;"
                      title="This is your public profile!"
                      color="accent"
                    >fas fa-user</v-icon>           
                    <v-icon
                      v-if="user.isPrivate"
                      style="float: right;"
                      title="This user&#39;s profile is not public!"
                      color="#FEEFB3"
                    >fas fa-eye-slash</v-icon>                              
                    <v-icon
                      v-if="user.isAdmin"
                      style="float: right;"
                      title="This user is an Admin!"
                      color="#FFD700"
                    >fas fa-edit</v-icon>
                    <v-icon
                      v-if="user.isEditor"                    
                      style="float: right;"
                      class="mr-1"                     
                      title="This user is an Editor!"
                      color="accent"
                    >fas fa-edit</v-icon>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs3>
                <v-img
                  :src="user.mediumThumbnail.url"
                  :alt="user.userName"
                  class="ma-1"
                  aspect-ratio="1"
                  lazy-src="data:image/jpg;base64,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"                  
                ></v-img>
              </v-flex>
              <v-flex xs9>                    
              </v-flex>                
            </v-layout>            
          </v-flex>
          <v-flex d-flex xs12 sm5 md5>
            <v-tabs right color="primary" slider-color="accent">
              <v-tab>Profile</v-tab>
              <v-tab-item>
                <v-card flat class="profile darken-3">
                  <vue-markdown>{{user.profile}}</vue-markdown>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-flex>
        </v-layout>

        <v-layout row wrap>

            <v-flex xs12 sm6 lg4 v-if="user.statistics.mostPlayedArtist">
              <span>Most Played Artist</span>
              <ArtistCard  :artist="user.statistics.mostPlayedArtist"></ArtistCard>
            </v-flex>

            <v-flex xs12 sm6 lg4 v-if="user.statistics.mostPlayedRelease">
              <span>Most Played Release</span>
              <ReleaseCard  :release="user.statistics.mostPlayedRelease"></ReleaseCard>
            </v-flex>

            <v-flex xs12 sm6 lg4 v-if="user.statistics.mostPlayedTrack">
              <span class="ml-2">Most Played Track</span>
              <TrackCard  :track="user.statistics.mostPlayedTrack"></TrackCard>
            </v-flex> 

        </v-layout>

      </v-container>
      <v-layout align-center justify-space-between row wrap>
        <v-flex d-flex xs12>
          <div class="stats-container">
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="orange">fas fa-users</v-icon>
                </v-avatar>
                {{ user.statistics.ratedArtists | padNumber4 }}
              </v-chip>
              <span>User Rated Artists</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="orange">library_music</v-icon>
                </v-avatar>
                {{ user.statistics.ratedReleases | padNumber4 }}
              </v-chip>
              <span>User Rated Releases</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="orange">audiotrack</v-icon>
                </v-avatar>
                {{ user.statistics.ratedTracks | padNumber4 }}
              </v-chip>
              <span>User Rated Tracks</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">fas fa-users</v-icon>
                </v-avatar>
                {{ user.statistics.favoritedArtists | padNumber4 }}
              </v-chip>
              <span>User Favorite Artists</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">library_music</v-icon>
                </v-avatar>
                {{ user.statistics.favoritedReleases | padNumber4 }}
              </v-chip>
              <span>User Favorite Releases</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="red">audiotrack</v-icon>
                </v-avatar>
                {{ user.statistics.favoritedTracks | padNumber4 }}
              </v-chip>
              <span>User Favorite Tracks</span>
            </v-tooltip>

            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">fas fa-users</v-icon>
                </v-avatar>
                {{ user.statistics.dislikedArtists | padNumber4 }}
              </v-chip>
              <span>User Hated Artists</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">library_music</v-icon>
                </v-avatar>
                {{ user.statistics.dislikedReleases | padNumber4 }}
              </v-chip>
              <span>User Hated Releases</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon color="lime">audiotrack</v-icon>
                </v-avatar>
                {{ user.statistics.dislikedTracks | padNumber4 }}
              </v-chip>
              <span>User Hated Tracks</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>play_circle_outline</v-icon>
                </v-avatar>
                {{ user.statistics.playedTracks | padNumber6 }}
              </v-chip>
              <span>User Tracks Played</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>    
      <v-layout row wrap v-scroll="onScroll">
        <v-flex d-flex xs12 class="ma-5">          
          <v-timeline v-if="groupedRatedTrackHistory">
            <v-timeline-item 
              v-for="a in groupedRatedTrackHistory"
              :key="a.artistUrl"            
              large>
              <template v-slot:icon>
                <v-avatar>
                  <img :src="a.artistThumbnail" :alt="a.artistTooltip" :title="a.artistTooltip">
                </v-avatar>
              </template>
              <template v-slot:opposite>
                <span>{{ a.playedDay }}</span>
              </template>
              <v-card>                
                <v-card-text>
                  <TrackCard v-for="t in a.tracks"
                    :key="t.track.id"
                    :track="t.track"
                    :mediaNumber="t.track.mediaNumber"
                    :release="t.track.release"
                    :mediaCount="t.track.release.mediaCount"
                  ></TrackCard>
                </v-card-text>                         
              </v-card>
            </v-timeline-item>
          </v-timeline>  
        </v-flex>              
      </v-layout>
      <v-layout v-if="loadingMoreRatedTracks" row wrap>
        <v-flex d-flex xs12>
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>    
        </v-flex>
      </v-layout>       
    </div>
    <confirm ref="confirm"></confirm>    
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import VueMarkdown from "vue-markdown";
import ArtistCard from "@/components/ArtistCard";
import ReleaseCard from "@/components/ReleaseCard";
import TrackCard from "@/components/TrackCard";
import Confirm from "@/views/Confirm";

import { EventBus } from "@/event-bus.js";
export default {
  components: { 
    Toolbar, 
    'vue-markdown': VueMarkdown, 
    ArtistCard, 
    ReleaseCard, 
    TrackCard,
    Confirm    
  },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("uu:Delete", this.delete);    
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("uu:Delete", this.delete);    
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    isViewingSelf() {
      return this.user.userId == this.$store.getters.userId;
    },
    isPrivate() {
      if(this.isViewingSelf) {
        return false;
      }
      if(this.$store.getters.isUserAdmin) {
        return false;
      }
      return this.user.isPrivate;
    },
    adminMenuItems() {
      let items = [];
      if(this.$store.getters.isUserAdmin) {
        items.push({ title: "Delete", icon: "delete", class: "warning--text", click: "uu:Delete" });
      }      
      items.sort(function(a,b){
        const aTitle = a.title.toUpperCase();
        const bTitle = b.title.toUpperCase();
        return aTitle > bTitle ? 1 : -1;
      });      
      return items;
    },
    groupedRatedTrackHistory() {
      if(!this.ratedTrackHistory || this.ratedTrackHistory.length === 0) {
        return null;
      }
      let that = this;
      let byArtistsAndDay = [];
      this.$_.forEach(this.ratedTrackHistory, function(d) {
        let dayEntry = {
          artistThumbnail : d.artistThumbnail.url,
          artistTooltip: d.artist.text,
          playedDay: d.playedDay,
          tracks: []
        };
        if(!that.$_.find(byArtistsAndDay, function(x) { return x.artistThumbnail === d.artistThumbnail.url && x.playedDay === d.playedDay;}))
        {
          that.$_.forEach(that.ratedTrackHistory, function(dd) {
            if(dd.artistThumbnail.url === dayEntry.artistThumbnail && dd.playedDay === dayEntry.playedDay) {
              dayEntry.tracks.push(dd);
            }
          });
          byArtistsAndDay.push(dayEntry);
        }
      });
      return byArtistsAndDay;
    }
  },
  methods: {
    onScroll () {
      let height = document.documentElement.offsetHeight,
          offset = document.documentElement.scrollTop + window.innerHeight;
      let getMore = offset === height;
      if (getMore && !this.loadingMoreRatedTracks) { 
        EventBus.$emit("loadingStarted");
        this.loadingMoreRatedTracks = true;
        this.ratedTrackPagination.page = this.ratedTrackPagination.page + 1;
        this.$axios
        .get(
          process.env.VUE_APP_API_URL + 
          `/playactivities/${ this.id }?page=${this.ratedTrackPagination.page}&limit=${this.ratedTrackPagination.rowsPerPage}&filterRatedOnly=true`)
        .then(response => {
          this.$nextTick(() => {
            this.ratedTrackHistory = this.ratedTrackHistory.concat(response.data.rows);
          });            
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.loadingMoreRatedTracks = false;
        });        
      }
    },    
    delete: async function() {
      let userId = this.user.userId;
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                process.env.VUE_APP_API_URL +
                  "/admin/delete/user/" +
                  userId
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },        
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/users/${this.id}`)
        .then(response => {
          this.user = response.data.data;
        })
        .then(() => {
          this.$axios
          .get(
            process.env.VUE_APP_API_URL + 
            `/playactivities/${ this.id }?page=${this.ratedTrackPagination.page}&limit=${this.ratedTrackPagination.rowsPerPage}&filterRatedOnly=true`)
          .then(response => {
            this.ratedTrackHistory = [];
            this.$nextTick(() => {
              this.ratedTrackHistory = response.data.rows;
              this.ratedTrackPagination.totalItems = response.data.totalCount;
              this.loadingMoreRatedTracks = false;
            });            
          })              
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
          this.loaded = true;
        });
      EventBus.$emit("loadingComplete");
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    }
  },
  data: () => ({
    loaded: false,
    loadingMoreRatedTracks: true,
    menuItems: [],    
    user: {},
    ratedTrackPagination: {
      page: 1,
      rowsPerPage: 50,
      totalItems: 0
    },    
    ratedTrackHistory: []
  })
};
</script>

<style>
.user-detail-container .profile {
  max-height: 350px;
  overflow: auto;
}
</style>
