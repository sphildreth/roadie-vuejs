<template>
  <div class="collection-detail-container">
    <Toolbar
      :menuItems="menuItems" 
      :adminItems="adminMenuItems" 
      :toolbarIcon="'collections'"
    ></Toolbar>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm7 md7>
          <v-layout row wrap>
            <v-flex xs12>
              <v-card color="primary" class="profile darken-1">
                <v-card-text class="title">
                  {{ collection.name }}
                  <v-icon
                    v-if="collection.isLocked"
                    style="float: right;"
                    title="Collection is locked!"
                    color="warning"
                  >lock</v-icon>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs6 md3>
                  <v-img  
                    :src="collection.mediumThumbnail.url"
                    :alt="collection.name"
                    class="ma-1"
                    aspect-ratio="1"
                    lazy-src="data:image/jpg;base64,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"                    
                  ></v-img>
                </v-flex>
                <v-flex xs6 md9 class="title">
                  <v-text-field
                    v-if="collection.edition"
                    v-bind:value="collection.edition"
                    label="Edition"
                    readonly
                  ></v-text-field>
                  <v-text-field
                    v-if="collection.statusVerbose"
                    v-bind:value="collection.statusVerbose"
                    label="Status"
                    readonly
                  ></v-text-field>      

                </v-flex>       
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex d-flex xs12 sm5 md5>
          <v-tabs right color="primary" slider-color="accent">
            <v-tab>Description</v-tab>
            <v-tab v-if="collection.tagsList.length > 0">Tags</v-tab>
            <v-tab v-if="collection.urLsList.length">Urls</v-tab>
            <v-tab-item>
              <v-card flat class="description darken-3">
                <v-card-text v-html="collection.description">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>                      
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="collection.tagsList.length > 0">
              <v-list>
                <template v-for="(name, index) in collection.tagsList">
                  <v-list-tile :key="`t-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ name }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < collection.tagsList.length"
                    :key="`tdivider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-tab-item>
            <v-tab-item v-if="collection.urLsList.length">
              <v-list>
                <template v-for="(name, index) in collection.urLsList">
                  <v-list-tile :key="`u-${name}-${index}`">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a v-bind:href="name" target="_blank">{{ name }}</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider
                    v-if="index + 1 < collection.urLsList.length"
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
          <div class="stats-container hidden-xs-only">
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>fas fa-users</v-icon>
                </v-avatar>
                {{ collection.statistics.artistCount | padNumber4 }}
              </v-chip>
              <span>Collection Artist Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>library_music</v-icon>
                </v-avatar>
                {{ collection.statistics.releaseCount | padNumber4 }}
              </v-chip>
              <span>Collection Release Count</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-md-and-down" v-if="collection.missingReleaseCount">
              <v-chip slot="activator" color="warning" text-color="black" @click="showMissing">
                <v-avatar>
                  <v-icon>error</v-icon>
                </v-avatar>
                {{ collection.missingReleaseCount | padNumber3 }}
              </v-chip>
              <span>Collection Missing Release Count (Click to toggle displaying only missing)</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>audiotrack</v-icon>
                </v-avatar>
                {{ collection.statistics.trackCount | padNumber5 }}
              </v-chip>
              <span>Collection Track Count</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>speaker</v-icon>
                </v-avatar>
                {{ collection.statistics.durationTime }}
              </v-chip>
              <span>Collection Track Playtime</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-md-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ collection.statistics.fileSize }}
              </v-chip>
              <span>Collection Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom class="hidden-sm-and-down">
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>date_range</v-icon>
                </v-avatar>
                {{ collection.createdDate | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Collection Created Date</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>update</v-icon>
                </v-avatar>
                {{ collection.lastUpdated | formatTimeStamp(this.$store.getters.user) }}
              </v-chip>
              <span>Collection Updated Date</span>
            </v-tooltip>
          </div>
        </v-flex>
      </v-layout>
      <v-container fluid grid-list-md>
        <v-card flat class="releases mt-2">
          <v-data-iterator
            :items="releaseItems"
            :rows-per-page-items="this.$store.getters.rowsPerPageItems"
            :hide-actions="pagination.totalItems < pagination.rowsPerPage"
            :total-items="pagination.totalItems"
            :pagination.sync="pagination"
            content-tag="v-layout"
            :loading="true"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3>
              <ReleaseCard :release="props.item" :listNumber="props.item.listNumber"></ReleaseCard>
            </v-flex>
          </v-data-iterator>
        </v-card>
      </v-container>
    </v-container>
    <confirm ref="confirm"></confirm>    
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ReleaseCard from "@/components/ReleaseCard";
import { EventBus } from "@/event-bus.js";
import Confirm from "@/views/Confirm";
export default {
  components: { Toolbar, ReleaseCard, Confirm },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("c:AddAllToQue", this.addToQue);
    EventBus.$on("c:PlayAll", this.playAll);
    EventBus.$on("c:Rescan", this.rescan);  
    EventBus.$on("c:Delete", this.delete);   
    EventBus.$on("c:Edit", this.edit);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("c:PlayAll", this.playAll);
    EventBus.$off("c:Rescan", this.rescan);   
    EventBus.$off("c:Delete", this.delete);     
    EventBus.$off("c:Edit", this.edit);
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    adminMenuItems() {
      return !this.$store.getters.isUserAdmin
        ? []
        : [
            { title: "Delete", icon: "delete", class: "warning--text", click: "c:Delete" },
            { title: "Edit", icon: "create", click: "c:Edit" },
            { title: "Rescan", icon: "refresh", click: "c:Rescan" }
          ];
    }
  },
  methods: {
    showMissing: function() {
      this.showingMissing = !this.showingMissing;
      this.updateData();
    },
    edit: function() {
      this.$router.push("/collection/edit/" + this.collection.id);
    },
    rescan: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .post(
          process.env.VUE_APP_API_URL + "/admin/scan/collection/" + this.collection.id
        )
        .then(() => {
          this.updateData();
        });
    },
    delete: async function() {
      let collectionId = this.collection.id;
      this.$refs.confirm
        .open("Delete", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                process.env.VUE_APP_API_URL +
                  "/collections/delete/" +
                  collectionId
              )
              .then(() => {
                EventBus.$emit("loadingComplete");
                this.$router.go(-1);
              });
          }
        });
    },    
    playAll: function() {
      this.$playQue.deleteAll()
      .then(() => {
        this.addToQue();
      });
    },
    addToQue: function() {
      EventBus.$emit("loadingStarted");
      let queTracks = [];
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/tracks?filterToCollectionId=${this.id}`
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
          const message = result.message ||  "Added [" + queTracks.length + "] tracks to Que";
          EventBus.$emit("showSnackbar", { text: message });
        })         
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(process.env.VUE_APP_API_URL + `/collections/${this.id}`)
        .then(response => {
          this.collection = response.data.data;
          this.collection.tagsList = this.collection.tagsList || [];
          this.collection.urLsList = this.collection.urLsList || [];
        })
        .then(() => {
          this.updateReleaseData();
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    },
    updateReleaseData: async function() {
      EventBus.$emit("loadingStarted");
      this.$axios
        .get(
          process.env.VUE_APP_API_URL +
            `/releases?page=${this.pagination.page}&limit=${
              this.pagination.rowsPerPage
            }&filterToCollectionId=${this.id}&filterToStatus=${this.showingMissing ? 4 : 0 }`
        )
        .then(response => {
          this.releaseItems = response.data.rows;
          this.pagination.totalItems = response.data.totalCount;
        })
        .finally(() => {
          EventBus.$emit("loadingComplete");
        });
    }
  },
  watch: {
    $route(to) {
      this.id = to.params.id;
      this.updateData();
    },
    pagination: {
      async handler() {
        this.updateReleaseData();
      }
    }
  },
  data: () => ({
    collection: {
      mediumThumbnail: {},
      statistics: {},
      tagsList: [],
      urLsList: []
    },
    showingMissing: false,
    pagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0
    },
    releaseItems: [],
    menuItems: [
      {
        title: "Add All To Que",
        class: "hidden-xs-only",
        click: "c:AddAllToQue"
      },
      { title: "Play All", class: "hidden-xs-only", click: "c:PlayAll" }
    ]
  })
};
</script>


<style>
</style>
