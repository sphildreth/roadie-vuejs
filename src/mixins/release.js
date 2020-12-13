import {
  EventBus
} from "@/event-bus.js";
import getEnv from '@/utils/env.js';
export default {
  data: () => ({}),
  methods: {
    releaseRatingChange(changeInfo) {
      return new Promise(resolve => {
        if (changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(getEnv('ROADIE_API_URL') + '/users/setReleaseRating/' + changeInfo.releaseId + '/' + changeInfo.newVal)
            .then(response => {
              if (response.data.isSuccess && changeInfo.newVal > 0) {
                EventBus.$emit("showSnackbar", {
                  text: "Successfully set rating"
                });
              } else if (response.data.isSuccess) {
                EventBus.$emit("showSnackbar", {
                  text: "Successfully removed rating"
                });
              }
              resolve({
                isSuccess: response.data.isSuccess,
                rating: response.data
              });
            });
        }
      });
    },
    releaseFavoriteToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(getEnv('ROADIE_API_URL') + '/users/setReleaseFavorite/' + toggleInfo.releaseId + '/' + toggleInfo.isFavorite)
        .then(response => {
          if(response.data.isSuccess && toggleInfo.isFavorite) {
            EventBus.$emit("showSnackbar", { text: "Release is now a favorite" });            
          } else if (response.data.isSuccess) {
            EventBus.$emit("showSnackbar", { text: "Release is no longer a favorite" }); 
          }
          resolve({
            isSuccess: response.data.isSuccess,
            isFavorite: toggleInfo.isFavorite
          });          
        });
      });
    },
    releaseDislikeToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(getEnv('ROADIE_API_URL') + '/users/setReleaseDisliked/' + toggleInfo.releaseId + '/' + toggleInfo.isDisliked)
        .then(response => {
          if(response.data.isSuccess && toggleInfo.isDisliked) {
              EventBus.$emit("showSnackbar", { text: "You now hate this Release" });              
          } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", { text: "You no longer hate this Release" });                            
          }    
          resolve({
            isSuccess: response.data.isSuccess,
            isFavorite: toggleInfo.isFavorite
          });                
        });
      });
    },
    releaseById: function(id, doLoadingEvents) {
      return new Promise(resolve => {
        let release = null;
        if(doLoadingEvents) {
          EventBus.$emit("loadingStarted");
        }
        this.$axios
          .get(getEnv('ROADIE_API_URL') + `/releases/${id}`)
          .then(response => {
            release = response.data.data;
            release.artist = release.artist || {};
            release.images = release.images || [];
            release.medias = release.medias || [];
            release.comments = release.comments || [];             
            release.alternateNamesList = release.alternateNamesList || [];
            release.genres = release.genres || [];
            release.collections = release.collections || [];
            release.playlists = release.playlists || [];
            release.labels = release.labels || [];
            release.tagsList = release.tagsList || [];
            release.urLsList = release.urLsList || [];
            resolve({
              isSuccess: response.data.isSuccess,
              release: release
            });             
          })
          .finally(() => {          
            if(doLoadingEvents) {
              EventBus.$emit("loadingComplete");
            }
          });      
      });          
    },
    addReleaseToQue(releaseId) {
      this.releaseById(releaseId, true)
      .then((response) => {
        let release = response.release;
        let queTracks = [];
        let t = this.$_.flatMap(release.medias, function(media) {
          return media.tracks;
        });
        t.forEach(tr => {
          let artist = tr.trackArtist || release.artist;
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
              text: release.title,
              value: release.id,
              releaseDate: release.releaseDate
            },
            artist: artist,
            releaseArtist: release.artist,
            releaseImageUrl: release.thumbnail.url,
            artistImageUrl: artist.thumbnail.url,
            userRating: tr.userRating || { rating: 0 }
          };
          queTracks.push(queTrack); 
        });
        this.$playQue.add(queTracks)
        .then(function(result) {
          const message = result.message ||  "Added [" + result.addedCount + "] tracks to Que";
          EventBus.$emit("showSnackbar", { text: message });
        });
      })
    }
  }
}