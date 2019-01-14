import {
  EventBus
} from "@/event-bus.js";
export default {
  data: () => ({}),
  methods: {
    releaseRatingChange(changeInfo) {
      return new Promise(resolve => {
        if (changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(process.env.VUE_APP_API_URL + '/users/setReleaseRating/' + changeInfo.releaseId + '/' + changeInfo.newVal)
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
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setReleaseFavorite/' + toggleInfo.releaseId + '/' + toggleInfo.isFavorite)
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
        this.$axios.post(process.env.VUE_APP_API_URL + '/users/setReleaseDisliked/' + toggleInfo.releaseId + '/' + toggleInfo.isDisliked)
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
    }
  }
}