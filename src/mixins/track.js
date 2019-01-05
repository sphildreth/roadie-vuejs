export default {
  data: () => ({
    snackbar: false,
    snackbarText: "",
  }),
  methods: {
    bookmarkToggle(bookmarkInfo) {
      return new Promise(resolve => {
        var that = this;
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackBookmark/' + bookmarkInfo.trackId + '/' + bookmarkInfo.userBookmarked)
          .then(response => {
            if (response.data.isSuccess && bookmarkInfo.userBookmarked) {
              that.snackbarText = "Successfully bookmarked";
              that.snackbar = true;
            } else if (response.data.isSuccess) {
              that.snackbarText = "Successfully removed bookmark";
              that.snackbar = true;
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
        var that = this;
        if (changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackRating/' + changeInfo.trackId + '/' + changeInfo.newVal)
            .then(response => {
              if (response.data.isSuccess && changeInfo.newVal > 0) {
                that.snackbarText = "Successfully set rating";
                that.snackbar = true;
              } else if (response.data.isSuccess) {
                that.snackbarText = "Successfully removed rating";
                that.snackbar = true;
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
        var that = this;
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackFavorite/' + toggleInfo.trackId + '/' + toggleInfo.isFavorite)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isFavorite > 0) {
              that.snackbarText = "Track is now a favorite";
              that.snackbar = true;
            } else if (response.data.isSuccess) {
              that.snackbarText = "Track is no longer a favorite";
              that.snackbar = true;
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
        var that = this;
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setTrackDisliked/' + toggleInfo.trackId + '/' + toggleInfo.isDisliked)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isDisliked) {
              that.snackbarText = "You now hate this Track";
              that.snackbar = true;
            } else if (response.data.isSuccess) {
              that.snackbarText = "You no longer hate this Track";
              that.snackbar = true;
            }
            resolve({
              isSuccess: response.data.isSuccess,
              isFavorite: toggleInfo.isFavorite
            });
          });
      });
    }
  }
}