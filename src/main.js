import Vue from 'vue';
import './plugins/vuetify.js';
import App from './App.vue';
import router from './router';
import Axios from 'axios';
import store from './store';

// import moment from "moment";

import moment from 'moment-timezone'

var numeral = require("numeral");

Vue.config.productionTip = false;

var myApi = Axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 10000
});

// This sets the bearer token on each axios request
myApi.interceptors.request.use (
  function (config) {
    const token = store.getters.authToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  function (error) {
    return Promise.reject (error);
  }
)

Vue.prototype.$axios = myApi;

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0"); 
});

Vue.filter("padNumber3", function (value) {
  return numeral(value).format("000"); 
});

Vue.filter("padNumber4", function (value) {
  return numeral(value).format("0000"); 
});

Vue.filter("padNumber5", function (value) {
  return numeral(value).format("00000"); 
});

Vue.filter("shortDate", function (date) {
  return moment(date).format("MM-DD-YYYY");
});

Vue.filter("formatTimeStamp", function (timestamp, user) {
  return moment
    .utc(timestamp)
    .tz(user.timezone)
    .format(user.timeformat);
});

Vue.filter("yearsFromDate", function (fromDate, toDate) {
  fromDate = fromDate || new Date();
  toDate = toDate || new Date();
  return moment(fromDate).diff(toDate, "years");
});

// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)
// })


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

