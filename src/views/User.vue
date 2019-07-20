<template>
  <div class="user-detail-container">
    <Toolbar
      :menuItems="menuItems"
      :adminItems="adminMenuItems"
      :toolbarIcon="'account_circle'"
    ></Toolbar>    
    <div class="ma-5" v-if="loaded && user.isPrivate">
      <v-icon>fas fa-user-shield</v-icon>
      User has elected to be private, mysterious and elusive.
    </div>
    <div v-if="loaded && !user.isPrivate">
      <v-container v-if="loaded" fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm7 md7>
            <v-layout row wrap>
              <v-flex xs12>
                <v-card color="primary" class="profile darken-1">
                  <v-card-text class="title">
                    {{ user.userName }}
                    <v-icon
                      v-if="user.isAdmin"
                      style="float: right;"
                      title="Is an Admin!"
                      color="yellow"
                    >supervised_user_circle</v-icon>
                    <v-icon
                      v-if="user.isEditor"
                      style="float: right;"
                      title="Is an Editor!"
                      color="yellow"
                    >user-edit</v-icon>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs12>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs3>
                <v-img
                  :src="user.avatar.url"
                  :alt="user.userName"
                  class="ma-1"
                  aspect-ratio="1"
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

            <v-flex xs12 sm6 lg4 xl3 v-if="user.statistics.mostPlayedArtist">
              <span>Most Played Artist</span>
              <ArtistCard  :artist="user.statistics.mostPlayedArtist"></ArtistCard>
            </v-flex>

            <v-flex xs12 sm6 lg4 xl3 v-if="user.statistics.mostPlayedRelease">
              <span>Most Played Release</span>
              <ReleaseCard  :release="user.statistics.mostPlayedRelease"></ReleaseCard>
            </v-flex>

            <v-flex xs12 sm6 lg4 xl3 v-if="user.statistics.mostPlayedTrack">
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
          if(this.$store.getters.isUserAdmin) {
            this.user.isPrivate = false;
          }

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
