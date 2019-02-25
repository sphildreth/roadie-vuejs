import {
  EventBus
} from "@/event-bus.js";
export default {
  data: () => ({}),
  methods: {
    trackBookmarkToggle(bookmarkInfo) {
      return new Promise(resolve => {
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackBookmark/' + bookmarkInfo.trackId + '/' + bookmarkInfo.userBookmarked)
          .then(response => {
            if (response.data.isSuccess && bookmarkInfo.userBookmarked) {
              EventBus.$emit("showSnackbar", {
                text: "Successfully bookmarked"
              });
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", {
                text: "Successfully removed bookmark"
              });
            }
            EventBus.$emit("userTrackBookmarkChange", {
              trackId: bookmarkInfo.trackId,
              isBookmarked: bookmarkInfo.userBookmarked
            });               
            resolve({
              isSuccess: response.data.isSuccess,
              userBookmarked: bookmarkInfo.userBookmarked
            });
          });
      });
    },
    trackRatingChange(changeInfo) {
      return new Promise(resolve => {
        if (changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackRating/' + changeInfo.trackId + '/' + changeInfo.newVal)
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
              EventBus.$emit("userTrackRatingChange", {
                trackId: changeInfo.trackId,
                isFavorite: changeInfo.newVal
              });               
              resolve({
                isSuccess: response.data.isSuccess,
                rating: changeInfo.newVal
              });
            });
        }
      });
    },
    trackFavoriteToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackFavorite/' + toggleInfo.trackId + '/' + toggleInfo.isFavorite)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isFavorite > 0) {
              EventBus.$emit("showSnackbar", {
                text: "Track is now a favorite"
              });
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", {
                text: "Track is no longer a favorite"
              });
            }
            EventBus.$emit("userTrackFavoriteChange", {
              trackId: toggleInfo.trackId,
              isFavorite:toggleInfo.isFavorite
            });            
            resolve({
              isSuccess: response.data.isSuccess,
              isFavorite: toggleInfo.isFavorite
            });
          });
      });
    },
    trackDislikeToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackDisliked/' + toggleInfo.trackId + '/' + toggleInfo.isDisliked)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isDisliked) {
              EventBus.$emit("showSnackbar", {
                text: "You now hate this Track"
              });
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", {
                text: "You no longer hate this Track"
              });              
            }            
            EventBus.$emit("userTrackLikeChange", {
              trackId: toggleInfo.trackId,
              liked:toggleInfo.isDisliked
            });
            resolve({
              isSuccess: response.data.isSuccess,
              isDisliked: toggleInfo.isDisliked
            });
          });
      });
    },
    addTracksToQue(tracks) {
      var queTracks = []
      tracks.forEach((track) => {
        queTracks.push(this.createQueTrack(track));
      });
      this.$playQue.add(queTracks)
      .then(function(result) {
        const message = result.message || "Added [" + queTracks.length + "] to Que";
        EventBus.$emit("showSnackbar", { text: message });
      });      
    },
    getTrackDetail(trackId) {
      return new Promise(resolve => {
        this.$axios
        .get(process.env.VUE_APP_API_URL + `/tracks/${trackId}`)
        .then(response => {
          resolve(response);
        })
      })
    },
    addTrackToQue(track) {
      this.$playQue.add([ this.createQueTrack(track) ])
      .then(function(result) {
        const message = result.message || "Added to Que";
        EventBus.$emit("showSnackbar", { text: message });
      });         
    },
    createQueTrack(track) {
      let artist = track.trackArtist || track.artist;
      return {
        id: track.id,
        mediaNumber: track.mediaNumber,
        trackNumber: track.trackNumber,
        title: track.title,
        duration: track.duration,
        durationTime: track.durationTime,
        rating: track.rating,
        playedCount: track.playedCount, 
        trackPlayUrl: track.trackPlayUrl,
        release: {
          text: track.release.release.text,
          value: track.release.id,
          releaseDate: track.release.releaseDate
        },
        artist: artist,
        releaseArtist: track.artist,
        releaseImageUrl: track.thumbnail.url,
        artistImageUrl: artist.thumbnail.url,
        userRating: track.userRating || {
          rating: 0
        }
      };
    }
  }
}