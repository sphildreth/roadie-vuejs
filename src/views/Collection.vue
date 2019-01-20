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
                <v-flex xs3>
                  <v-img
                    :src="collection.mediumThumbnail.url"
                    :alt="collection.name"
                    class="ma-1"
                    aspect-ratio="1"
                  ></v-img>
                </v-flex>

                <v-flex xs9 class="title">
                  <v-text-field
                    v-if="collection.edition"
                    v-bind:value="collection.edition"
                    label="Edition"
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
                <v-card-text v-html="collection.description">Loading...</v-card-text>
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
          <div class="stats-container">
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
            <v-tooltip bottom v-if="collection.missingReleaseCount ">
              <v-chip slot="activator" color="warning" text-color="black">
                <v-avatar>
                  <v-icon>error</v-icon>
                </v-avatar>
                {{ collection.missingReleaseCount | padNumber3 }}
              </v-chip>
              <span>Collection Missing Release Count</span>
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
            <v-tooltip bottom>
              <v-chip slot="activator" color="secondary" text-color="white">
                <v-avatar>
                  <v-icon>folder_open</v-icon>
                </v-avatar>
                {{ collection.statistics.fileSize }}
              </v-chip>
              <span>Collection Media File Size</span>
            </v-tooltip>
            <v-tooltip bottom>
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
            :rows-per-page-items="rowsPerPageItems"
            :hide-actions="pagination.totalItems < pagination.rowsPerPage"
            :total-items="pagination.totalItems"
            :pagination.sync="pagination"
            content-tag="v-layout"
            :loading="true"
            row
            wrap
          >
            <v-flex slot="item" slot-scope="props" xs12 sm6 lg2>
              <ReleaseCard :release="props.item" :listNumber="props.item.listNumber"></ReleaseCard>
            </v-flex>
          </v-data-iterator>
        </v-card>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ReleaseCard from "@/components/ReleaseCard";
import { EventBus } from "@/event-bus.js";
export default {
  components: { Toolbar, ReleaseCard },
  props: {
    id: String
  },
  created() {
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("c:AddAllToQue", this.addToQue);
    EventBus.$on("c:PlayAll", this.playAll);
    EventBus.$on("c:Rescan", this.rescan);  
    EventBus.$on("c:Delete", this.delete);    
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("c:PlayAll", this.playAll);
    EventBus.$off("c:Rescan", this.rescan);   
    EventBus.$off("c:Delete", this.delete);     
  },
  async mounted() {
    this.updateData();
  },
  computed: {
    adminMenuItems() {
      return !this.$store.getters.isUserAdmin
        ? []
        : [
            { title: "Delete", class: "warning--text", click: "c:Delete" },
            { title: "Edit", click: "c:Edit" },
            { title: "Find Cover", click: "c:FindCover" },
            { title: "Rescan", click: "c:Rescan" }
          ];
    }
  },
  methods: {
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
                  "/admin/delete/collection/" +
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
            }&filterToCollectionId=${this.id}`
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
    rowsPerPageItems: [6, 12, 24, 36, 60, 120],
    collection: {
      mediumThumbnail: {},
      statistics: {},
      tagsList: [],
      urLsList: []
    },
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
