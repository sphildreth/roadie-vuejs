<template>
  <div>
    <Toolbar 
      :menuItems="menuItems" 
      :doMenuSelected="false" 
      :toolbarIcon="'bookmarks'"
    ></Toolbar>

    <v-container v-if="artists.length" fluid grid-list-md>
      <span class="accent--text title">Arists</span>
      <v-data-iterator
        :items="artists"
        :total-items="artists.length"
        :hide-actions="true"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3 class="mt-1">
          <ArtistCard :artist="props.item.artist"></ArtistCard>
        </v-flex>
      </v-data-iterator>
    </v-container>

    <v-container v-if="releases.length" fluid grid-list-md class>
      <span class="accent--text title">Releases</span>
      <v-data-iterator
        :items="releases"
        :total-items="releases.length"
        :hide-actions="true"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs12 sm6 lg4 xl3 class="mt-1">
          <ReleaseCard :release="props.item.release"></ReleaseCard>
        </v-flex>
      </v-data-iterator>
    </v-container>

    <v-container v-if="tracks.length" fluid grid-list-md class>
      <span class="accent--text title">Tracks</span>
      <v-data-iterator
        :items="tracks"
        :total-items="tracks.length"
        :hide-actions="true"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" xs12 md6 class="mt-1">
          <TrackCard :track="props.item.track"></TrackCard>
        </v-flex>
      </v-data-iterator>
    </v-container>

    <v-container v-if="labels.length" fluid grid-list-md class="">
      <span class="accent--text title">Labels</span>
      <v-data-iterator
        :items="labels"
        :total-items="labels.length"
        :hide-actions="true"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" class="mt-1" xs12 md6>
          <LabelCard v-if="props.item.label" :label="props.item.label"></LabelCard>
        </v-flex>
      </v-data-iterator>
    </v-container>

    <v-container v-if="playlists.length" fluid grid-list-md class="">
      <span class="accent--text title">Playlists</span>
      <v-data-iterator
        :items="playlists"
        :total-items="playlists.length"
        :hide-actions="true"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" class="mt-1" xs12 sm6 md4 xl3>
          <PlaylistCard v-if="props.item.playlist" :playlist="props.item.playlist"></PlaylistCard>
        </v-flex>
      </v-data-iterator>
    </v-container>

    <v-container v-if="collections.length" fluid grid-list-md class="">
      <span class="accent--text title">Collections</span>
      <v-data-iterator
        :items="collections"
        :total-items="collections.length"
        :hide-actions="true"
        content-tag="v-layout"
        :loading="true"
        row
        wrap
      >
        <v-flex slot="item" slot-scope="props" class="mt-1" xs12 sm6 lg4>
          <CollectionCard v-if="props.item.collection" :collection="props.item.collection"></CollectionCard>
        </v-flex>
      </v-data-iterator>
    </v-container>
    <confirm ref="confirm"></confirm>
  </div>
</template>

<script>
import Toolbar from "@/components/Toolbar";
import ReleaseCard from "@/components/ReleaseCard";
import ArtistCard from "@/components/ArtistCard";
import TrackCard from "@/components/TrackCard";
import LabelCard from "@/components/LabelCard";
import PlaylistCard from "@/components/PlaylistCard";
import CollectionCard from "@/components/CollectionCard";
import Confirm from "@/views/Confirm";

import { EventBus } from "@/event-bus.js";
import getEnv from '@/utils/env.js';

export default {
  components: {
    Toolbar,
    ReleaseCard,
    ArtistCard,
    TrackCard,
    LabelCard,
    PlaylistCard,
    CollectionCard,
    Confirm
  },
  created() {
    this.pagination.rowsPerPage = this.$store.getters.defaultRowsPerPage;
    EventBus.$on("toolbarRefresh", this.updateData);
    EventBus.$on("b:deleteAll", this.deleteAll);
  },
  beforeDestroy() {
    EventBus.$off("toolbarRefresh", this.updateData);
    EventBus.$off("b:deleteAll", this.deleteAll);
  },
  computed: {
    artists() {
      let artists = [];
      this.items.forEach(function(x) {
        if (x.artist) {
          artists.push(x);
        }
      });
      return artists;
    },
    releases() {
      let releases = [];
      this.items.forEach(function(x) {
        if (x.release) {
          releases.push(x);
        }
      });
      return releases;
    },
    tracks() {
      let tracks = [];
      this.items.forEach(function(x) {
        if (x.track) {
          tracks.push(x);
        }
      });
      return tracks;
    },
    labels() {
      let labels = [];
      this.items.forEach(function(x) {
        if (x.label) {
          labels.push(x);
        }
      });
      return labels;
    },
    playlists() {
      let playlists = [];
      this.items.forEach(function(x) {
        if (x.playlist) {
          playlists.push(x);
        }
      });
      return playlists;
    },
    collections() {
      let collections = [];
      this.items.forEach(function(x) {
        if (x.collection) {
          collections.push(x);
        }
      });
      return collections;
    }
  },
  async mounted() {
    this.updateData();
  },
  methods: {
    deleteAll: function() {
      this.$refs.confirm
        .open("Delete All", "Are you sure?", { color: "red" })
        .then(confirm => {
          if (confirm) {
            this.$axios
              .post(
                getEnv('ROADIE_API_URL') +"/users/deleteAllBookmarks/"
              )
              .then(() => {
                this.updateData();
              });
          }
        });
    },
    updateData: async function() {
      EventBus.$emit("loadingStarted");
      await this.$axios
        .get(
          getEnv('ROADIE_API_URL') +
            `/bookmarks?page=${this.pagination.page}&limit=${this.pagination.rowsPerPage}&order=${this.pagination.sortOrder}&sort=${this.pagination.sortBy}`
        )
        .then(response => {
          this.items = response.data.rows;
          this.pagination.totalItems = response.data.totalCount;
          EventBus.$emit("loadingComplete");
          document.title = "Bookmarks";
          this.loading = false;
        });
    }
  },
  watch: {
    pagination: {
      async handler() {
        this.updateData();
      }
    }
  },
  data: () => ({
    loading: true,
    pagination: {
      page: 1,
      rowsPerPage: 36,
      totalItems: 0,
      sortBy: "CreatedDate",
      sortOrder: "DESC"
    },
    selected: [],
      menuItems: [
        { title: "Delete All", click: "b:deleteAll" }
      ],
    items: []
  })
};
</script>

<style>
</style>
