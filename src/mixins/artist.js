export default {
    data: () => ({
        snackbar: false,
        snackbarText: "",            
    }),
    methods: {
        ratingChange(changeInfo) {
            return new Promise(resolve => {
                var that = this;
                if(changeInfo.newVal !== changeInfo.oldVal) {
                    this.$axios.post(process.env.VUE_APP_API_URL + '/users/setArtistRating/' + changeInfo.artistId + '/' + changeInfo.newVal)
                    .then(response => {
                        if(response.data.isSuccess && changeInfo.newVal > 0) {
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
                this.$axios.post(process.env.VUE_APP_API_URL + '/users/setArtistFavorite/' + toggleInfo.artistId + '/' + toggleInfo.isFavorite)
                .then(response => {
                    if(response.data.isSuccess && toggleInfo.isFavorite > 0) {
                        that.snackbarText = "Artist is now a favorite";
                        that.snackbar = true;
                    } else if (response.data.isSuccess) {
                        that.snackbarText = "Artist is no longer a favorite";
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
              this.$axios.post(process.env.VUE_APP_API_URL + '/users/setArtistDisliked/' + toggleInfo.artistId + '/' + toggleInfo.isDisliked)
              .then(response => {
                if(response.data.isSuccess && toggleInfo.isDisliked) {
                  that.snackbarText = "You now hate this Artist";
                  that.snackbar = true;
                } else if (response.data.isSuccess) {
                  that.snackbarText = "You no longer hate this Artist";
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
