import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    playingIndex: (state) => {
      if (!state.isLoggedIn) {
        return [];
      }
      return state.playingIndex;
    },
    playRequestTrackInfo: (state) => {
      return state.playRequestTrackInfo;
    },
    nowPlaying: (state) => {
      return state.nowPlaying;
    },
    lastScanDate: (state) => {
      if (!state.lastScanDate) {
        state.lastScanDate = localStorage.getItem("lastScanDate");
      }
      if (!state.lastScanDate || state.lastScanDate === "undefined") {
        return "Never";
      }
      if (state.user && state.user.timezone && state.user.timeformat) {
        return Vue.options.filters.formatTimeStamp(state.lastScanDate, state.user) + ' [ ' + Vue.options.filters.hoursFromDate(null, state.lastScanDate) + ' hours ago ]';
      }
      return state.lastScanDate;
    },
    user: (state) => {
      if (!state.isLoggedIn) {
        return {};
      }
      if (!state.user || !state.user.username) {
        var data = localStorage.getItem("user");
        if (!data) {
          return {};
        }
        state.user = JSON.parse(data);
      }
      return state.user;
    },
    theme: (state) => {
      if (!state.theme) {
        let data = localStorage.getItem("theme");
        if (!data) {
          data = {
            id: 6,
            colors: {
              primary: "#212121",
              secondary: "#757575",
              accent: "#BDBDBD",
              error: "#D50000",
              warning: "#F57C00",
              info: "#2196f3",
              success: "#4caf50"
            },
            dark: true
          };
          localStorage.setItem("theme", JSON.stringify(data));
          state.theme = data;
        } else {
          state.theme = JSON.parse(data);
        }
      }
      return state.theme;
    },
    authToken: (state) => {
      if (!state.isLoggedIn) {
        return null;
      }
      try {
        if (!state.authToken) {
          if (!state.user || !state.user.username) {
            var data = localStorage.getItem("user");
            if (!data) {
              return null;
            }
            state.user = JSON.parse(data);
          }
          state.authToken = state.user.token;
        }
        return state.authToken;
      } catch (error) {
        return null;
      }
    },
    userId: (state, getters) => {
      let at = getters.authToken;
      if (!at) {
        return 0;
      }
      let jwt = JSON.parse(atob(at.split('.')[1]));
      return jwt.roadie_id;
    },
    isUserAdmin: (state, getters) => {
      let at = getters.authToken;
      if (!at) {
        return false;
      }
      try {
        let jwt = JSON.parse(atob(at.split('.')[1]));
        return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin";
      } catch (e) {
        return false;
      }
    },
    isUserEditor: (state, getters) => {
      let at = getters.authToken;
      if (!at) {
        return false;
      }
      try {
        let jwt = JSON.parse(atob(at.split('.')[1]));
        return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin" || jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Editor";
      } catch (e) {
        return false;
      }
    },
    usersAvatarUrl: (state) => {
      return (state.user && state.user.avatarUrl) ? state.user.avatarUrl + '?ts=' + new Date().getTime() : '';
    },
    defaultRowsPerPage: (state) => {
      return (state.user && state.user.defaultRowsPerPage) ? state.user.defaultRowsPerPage : state.defaultRowsPerPage;
    },
    isFullscreen: (state) => {
      return state.isFullscreen;
    }
  },
  computed: {},
  state: {
    isLoggedIn: !!localStorage.getItem("user"),
    queSize: 0,
    defaultRowsPerPage: 12,
    isFullscreen: false,
    lastScanDate: null,
    authToken: null,
    playingIndex: [],
    playRequestTrackInfo: [],
    nowPlaying: false,
    user: {
      id: null,
      username: null,
      token: null,
      avatarUrl: null,
      isAdmin: false,
      timezone: null,
      timeformat: null,
      defaultRowsPerPage: null
    }
  },
  mutations: {
    signin(state) {
      state.pending = true;
    },
    updateLastScan(state, lastScanDate) {
      state.lastScanDate = lastScanDate;
      localStorage.setItem("lastScanDate", lastScanDate);
    },
    signinSuccess(state, user) {
      state.isLoggedIn = true;
      state.pending = false;
      state.user = user;
      state.authToken = user.token;
    },
    signout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    saveTheme(state, data) {
      localStorage.setItem("theme", JSON.stringify(data));
      state.theme = data;
    },
    saveThemeDark(state, dark) {
      let data = localStorage.getItem("theme");
      let theme = null;
      if (!data) {
        data = {
          id: 0,
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107'
          },
          dark: true
        };
        theme = data;
      } else {
        theme = JSON.parse(data);
      }
      theme.dark = dark;
      localStorage.setItem("theme", JSON.stringify(theme));
      state.dark = dark;
    },
    playIndexChange(state, trackInfo) {
      state.playingIndex = trackInfo;
    },
    playRequest(state, trackInfo) {
      state.playRequestTrackInfo = trackInfo;
    },
    nowPlaying(state, nowPlaying) {
      state.nowPlaying = nowPlaying;
    },
    isFullscreen(state, isFullscreen) {
      state.isFullscreen = isFullscreen;
    }
  },
  actions: {
    toggleFullscreen({
      commit
    }, isFullscreen) {
      commit("isFullscreen", isFullscreen);
    },
    signout({
      commit
    }) {
      localStorage.removeItem("user");
      commit("signout");
    },
    playIndexChange({
      commit
    }, trackInfo) {
      commit("playIndexChange", trackInfo);
    },
    playRequest({
      commit
    }, trackInfo) {
      commit("playRequest", trackInfo);
    },
    nowPlaying({
      commit
    }, nowPlaying) {
      commit("nowPlaying", nowPlaying);
    }
  }
})