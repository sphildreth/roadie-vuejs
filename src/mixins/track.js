import { EventBus } from "@/event-bus.js";
export default {
  data: () => ({
  }),
  methods: {
    bookmarkToggle(bookmarkInfo) {
      return new Promise(resolve => {
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackBookmark/' + bookmarkInfo.trackId + '/' + bookmarkInfo.userBookmarked)
          .then(response => {
            if (response.data.isSuccess && bookmarkInfo.userBookmarked) {
              EventBus.$emit("showSnackbar", { text: "Successfully bookmarked" });
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", { text: "Successfully removed bookmark" });
            }
            resolve({
              isSuccess: response.data.isSuccess,
              userBookmarked: bookmarkInfo.userBookmarked
            });
          });
      });
    },
    ratingChange(changeInfo) {
      return new Promise(resolve => {
        if (changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackRating/' + changeInfo.trackId + '/' + changeInfo.newVal)
            .then(response => {
              if (response.data.isSuccess && changeInfo.newVal > 0) {
                EventBus.$emit("showSnackbar", { text: "Successfully set rating" });
              } else if (response.data.isSuccess) {
                EventBus.$emit("showSnackbar", { text: "Successfully removed rating" });
              }
              resolve({
                isSuccess: response.data.isSuccess,
                rating: changeInfo.newVal
              });
            });
        }
      });
    },
    favoriteToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackFavorite/' + toggleInfo.trackId + '/' + toggleInfo.isFavorite)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isFavorite > 0) {
              EventBus.$emit("showSnackbar", { text: "Track is now a favorite" });
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", { text: "Track is no longer a favorite" });              
            }
            resolve({
              isSuccess: response.data.isSuccess,
              isFavorite: toggleInfo.isFavorite
            });
          });
      });
    },
    dislikeToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackDisliked/' + toggleInfo.trackId + '/' + toggleInfo.isDisliked)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isDisliked) {
              EventBus.$emit("showSnackbar", { text: "You now hate this Track" });              
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", { text: "You no longer hate this Track" });              
            }
            resolve({
              isSuccess: response.data.isSuccess,
              isFavorite: toggleInfo.isFavorite
            });
          });
      });
    },
    addTracksToQue(tracks) {
      tracks.forEach((track) => {
        this.addToQueAction(track);
      });
      EventBus.$emit("showSnackbar", { text: "Added [" + tracks.length + "] to Que" });      
    },
    addToQue(track) {
      this.addToQueAction(track);
      EventBus.$emit("showSnackbar", { text: "Added to Que" }); 
    },
    addToQueAction(track) {
      let artist = track.trackArtist || track.artist;
      let queTrack = {
        id: track.id,
        mediaNumber: track.mediaNumber,
        trackNumber: track.trackNumber,
        title: track.title,
        duration: track.duration,
        durationTime: track.durationTime,
        rating: track.rating,
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
        userRating: track.userRating || { rating: 0 }
      };
      this.$store.dispatch("addToQue", [queTrack]);
    }         
  }
}