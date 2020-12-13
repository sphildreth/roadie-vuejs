import {
  EventBus
} from "@/event-bus.js";
import getEnv from '@/utils/env.js';
export default {
  data: () => ({}),
  methods: {
    artistRatingChange(changeInfo) {
      return new Promise(resolve => {
        if (changeInfo.newVal !== changeInfo.oldVal) {
          this.$axios.post(getEnv('ROADIE_API_URL') + '/users/setArtistRating/' + changeInfo.artistId + '/' + changeInfo.newVal)
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
                rating: changeInfo.newVal
              });
            });
        }
      });
    },
    artistFavoriteToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(getEnv('ROADIE_API_URL') + '/users/setArtistFavorite/' + toggleInfo.artistId + '/' + toggleInfo.isFavorite)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isFavorite > 0) {
              EventBus.$emit("showSnackbar", {
                text: "Artist is now a favorite"
              });
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", {
                text: "Artist is no longer a favorite"
              });
            }
            resolve({
              isSuccess: response.data.isSuccess,
              isFavorite: toggleInfo.isFavorite
            });
          });
      });
    },
    artistDislikeToggle(toggleInfo) {
      return new Promise(resolve => {
        this.$axios.post(getEnv('ROADIE_API_URL') + '/users/setArtistDisliked/' + toggleInfo.artistId + '/' + toggleInfo.isDisliked)
          .then(response => {
            if (response.data.isSuccess && toggleInfo.isDisliked) {
              EventBus.$emit("showSnackbar", {
                text: "You now hate this Artist"
              });
            } else if (response.data.isSuccess) {
              EventBus.$emit("showSnackbar", {
                text: "You no longer hate this Artist"
              });
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