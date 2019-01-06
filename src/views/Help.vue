<template>
  <div>
    <v-container fluid>
      <v-card>
        <v-card-title primary-title>
          <h5 class="headline mb-0">How is music organized?</h5>
        </v-card-title>
        <v-card-text>
          <p>Music is organized into several key elements: Artists, Releases and Tracks.</p>
          <dl>
            <dt>Artist</dt>
            <dd>Someone who either creates a Release or creates/contributes to Tracks on a Release.</dd>
            <dd><a href="https://en.wikipedia.org/wiki/Billy_Joel" target="_blank"><i>Billy Joel</i></a> is an example of an Artist who creates Releases.</dd>
            <dd>'Various Artist' is an example of a meta-Artist who has other Artists on their Releases (think compilations).</dd>
            <dd>An Artist can be a person or a group.</dd>
            <dd>Other terms for Artist: Band, Choir, Duet, Group, Person, Quartet, Solo, Trio.</dd>
            <dt>Release</dt>
            <dd>A collection of Tracks put out by an Artist on various mediums.</dd>
            <dd>These can be physical Releases (vinyl albums, Compact Discs, etc.) or digital Releases.</dd>
            <dd><a href="https://en.wikipedia.org/wiki/52nd_Street_(album)" target="_blank"><i>52nd Street</i></a> is an example of a Release.</dd>
            <dd>Releases can have a single Track or hundreds. Some Releases have multiple Medias (think double album), most Releases have a single Media.</dd>
            <dt>Track</dt>
            <dd>A recording on a Release. Can include: A song, skits, spoken word, sounds, silence, etc.</dd>
            <dd>A Track can have an Artist who is not the Release Artist (think compilations and sound-tracks).</dd>
            <dd>A Track can have multiple Artists who are contributing to the Release Artist (popular amoung Rap/Hip-Hop Releases).</dd>
          </dl>
        </v-card-text>
      </v-card>       
      <v-card>
        <v-card-title primary-title>
          <h5 class="headline mb-0">How do I keep my activity private?</h5>
        </v-card-title>
        <v-card-text>
          <p>Under 'Account Settings' turn the 'Keep Your Activity Private' on. This prevents your play activity from being shown to others. You will still show up in statistics and reports but with no private activity data being made public.</p>
        </v-card-text>
      </v-card>  
      <v-card>
        <v-card-title primary-title>
          <h5 class="headline mb-0">What is the difference between a playlist and a collection?</h5>
        </v-card-title>
        <v-card-text>
          <p>A Playlist is a group of Tracks and a Collection is a group of Releases.</p>
          <p>'Top 100 all time best selling Albums' is an example of a Collection.</p>
          <p>'Best Workout Dance Tunes' is an example of a Playlist.</p>
        </v-card-text>
      </v-card>          
      <v-card>
        <v-card-title primary-title>
          <h5 class="headline mb-0">What is the difference between average rating and my rating?</h5>
        </v-card-title>
        <v-card-text>
          <p>When you provide a rating for something (say for example an Artist). That rating is your rating applied to that Artist. Your rating is then averaged with all the other supplied ratings and the average becomes the Artist rating.</p>
          <p>It is not unusual for you to provide a rating of 5 but the average rating is less than 5 because others don't think so highly of the same thing.</p>
        </v-card-text>
      </v-card>        
      <v-card>
        <v-card-title primary-title>
          <h5 class="headline mb-0">How do I use Subsonic Applications?</h5>
        </v-card-title>
        <v-card-text>
          <p>You can use <a href="http://www.subsonic.org" target="_blank">Subsonic</a> <a href="http://www.subsonic.org/pages/apps.jsp" target="_blank">Applications</a> to connect via the Subsonic API layer built into Roadie. This will allow you to play tracks via the application on your mobile device (or other platforms). This is the recommended way to play tracks on the go to be able to stream via Bluetooth in automobiles to display track information on the automobiles built in stereo.</p>
          <p>Under your 'Account Settings' the setting 'Third Party API Token' allows you to set a 'password' to use in the Subsonic application that should be different than your user password. This way you are never supplying your real password to a third party application</p>
          <p>You would use your username you use to log into this site for the <b>'Username'</b> and the value you put in 'Third Party API Token' for the <b>'Password'</b> in the applications configuration. The <b>'Server address'</b> (sometimes called 'Address') setting is "server-name/subsonic" as an example "https://roadiemusic.org/subsonic"</p>
          <p>Here is a screenshot of the free <a href="https://play.google.com/store/apps/details?id=net.sourceforge.subsonic.androidapp" target="_blank">'Subsonic Music Streamer'</a> Android application server setup: <img style="vertical-align: text-top;" src="@/assets/img/subsonic_app_screenshot_20190105-114204.jpg" alt="Subsonic setup example" /></p>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>

import { EventBus } from "@/event-bus.js";

export default {
  created() {
  },
  beforeDestroy() {
  },
  async mounted() {
  },
  methods: {
  },
  watch: {
  },
  data: () => ({
  })
};
</script>

<style>
dt {
  font-weight: bold;
}
dd {
  margin-left: 10px;

}
</style>
