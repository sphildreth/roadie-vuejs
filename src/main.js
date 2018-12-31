import Vue from 'vue';
import './plugins/vuetify.js';
import App from './App.vue';
import router from './router';
import Axios from 'axios';
import store from './store';

import moment from 'moment-timezone';

var numeral = require("numeral");

Vue.config.productionTip = false;

var myApi = Axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 60000
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

myApi.interceptors.response.use((response) => { return response }, function (error) {
  if (error.response.status === 401) {
    store.dispatch('signout')
    return;
  }
  return Promise.reject(error)
});

Vue.prototype.$axios = myApi;

Vue.filter("formatNumber", function (value) {
  return numeral(value).format("0,0"); 
});

Vue.filter("padNumber2", function (value) {
  return numeral(value).format("00"); 
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

Vue.filter("padNumber6", function (value) {
  return numeral(value).format("000000"); 
});

Vue.filter("padNumber7", function (value) {
  return numeral(value).format("0000000"); 
});

Vue.filter("shortDate", function (date) {
  return moment(date).format("MM-DD-YYYY");
});

Vue.filter("formattedYear", function (date) {
  return moment(date).format("YYYY");
});

Vue.filter("timeFromMilliseconds", function(duration) {
  var seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
});

Vue.filter("formatTimeStamp", function (timestamp, user) {
  return moment
    .utc(timestamp)
    .tz(user.timezone)
    .format(user.timeformat);
});

Vue.filter("hoursFromDate", function (fromDate, toDate) {
  fromDate = fromDate ? moment.utc(fromDate) : moment.utc();
  toDate = toDate ?  moment.utc(toDate) : moment.utc();
  let diff = moment(fromDate).diff(toDate, "hours");
  return diff < 0 ? 0 : diff ;
});

Vue.filter("yearsFromDate", function (fromDate, toDate) {
  fromDate = fromDate || new Date();
  toDate = toDate || new Date();
  return moment(fromDate).diff(toDate, "years");
});

Vue.prototype.$filters = Vue.options.filters;
Vue.prototype.$moment = moment;
Vue.prototype.$_ = require('lodash');

new Vue({
  el: '#app',
  router,
  store,
  mounted: function(){
    this.$vuetify.dark = this.$store.getters.theme.dark;   
    this.$vuetify.theme.primary = this.$store.getters.theme.colors.primary;
    this.$vuetify.theme.secondary = this.$store.getters.theme.colors.secondary;
    this.$vuetify.theme.accent = this.$store.getters.theme.colors.accent;
    this.$vuetify.theme.error = this.$store.getters.theme.colors.error;
    this.$vuetify.theme.warning = this.$store.getters.theme.colors.warning;
    this.$vuetify.theme.info = this.$store.getters.theme.colors.info;
    this.$vuetify.theme.success = this.$store.getters.theme.colors.success;    
  },  
  render: h => h(App)
})
