import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    playingIndex: (state) => {
      if(!state.isLoggedIn) {
        return [];
      }
      return state.playingIndex;
    },
    playRequestTrackInfo: (state) => {
      return state.playRequestTrackInfo;
    },
    quePlaytime: (state) => {
      let duration = 0;
      state.playQue.forEach(t => {
        duration += t.track.duration;
      });
      return duration;
    },      
    nowPlaying: (state) => {
      return state.nowPlaying;
    },
    playQue: (state) => {
      let data = localStorage.getItem("playQue");
      state.playQue = [];
      if(data) {
        state.playQue = JSON.parse(data);
      }
      state.queSize = state.playQue.length;
      return state.playQue;
    },
    lastScanDate: (state) => {
      if(!state.lastScanDate) {
        state.lastScanDate = localStorage.getItem("lastScanDate");
      }
      if(!state.lastScanDate || state.lastScanDate === "undefined") {
        return "Never";        
      }
      if(state.user && state.user.timezone && state.user.timeformat) {        
        return Vue.options.filters.formatTimeStamp( state.lastScanDate, state.user) + ' [ ' + Vue.options.filters.hoursFromDate(null, state.lastScanDate) + ' hours ago ]';
      }
      return state.lastScanDate;
    },
    user: (state) => {
      if(!state.isLoggedIn) {
        return {};
      }
      if(!state.user || !state.user.username) {
        var data = localStorage.getItem("user");
        if(!data) {
          return {};
        }
        state.user = JSON.parse(data);
      }
      return state.user;
    },
    theme: (state) => {
      if(!state.theme) {
        let data = localStorage.getItem("theme");
        if(!data) {
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
          localStorage.setItem("theme", JSON.stringify(data));
          state.theme = data;
        } else {
          state.theme = JSON.parse(data);
        }        
      }
      return state.theme;
    },
    authToken:(state) => {
      if(!state.isLoggedIn) {
        return null;
      }
      try {
        if(!state.authToken)
        {
          if(!state.user || !state.user.username) {
            var data = localStorage.getItem("user");
            if(!data) {
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
      if(!at) {
        return 0;
      }
      let jwt = JSON.parse(atob(at.split('.')[1]));
     return jwt.roadie_id;
    },
    isUserAdmin: (state, getters) => {
      let at = getters.authToken;
      if(!at) {
        return false;
      }  
      try {
        let jwt = JSON.parse(atob(at.split('.')[1]));
        return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin";
      } catch(e) {
        return false;
      }
    },
    isUserEditor: (state, getters) => {
      let at = getters.authToken;
      if(!at) {
        return false;
      }      
      try {
        let jwt = JSON.parse(atob(at.split('.')[1]));
        return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin" || jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Editor";
      } catch(e) {
        return false;        
      }
    },
    usersAvatarUrl: (state) => {
      return (state.user && state.user.avatarUrl) ? state.user.avatarUrl + '?ts=' + new Date().getTime() : '';
    },
    isFullscreen: (state) => {
      return state.isFullscreen;
    }
  },
  computed: {  
  },  
  state: {
    isLoggedIn: !!localStorage.getItem("user"),
    queSize: 0,
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
      timeformat: null
    },
    playQue: null
  },
  mutations: {
    signin (state) {
      state.pending = true;
    },
    updateLastScan (state, lastScanDate) {
      state.lastScanDate = lastScanDate;
      localStorage.setItem("lastScanDate", lastScanDate);
    },
    signinSuccess (state, user) {
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
      if(!data) {
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
      } else  {
        theme = JSON.parse(data);
      }      
      theme.dark = dark;
      localStorage.setItem("theme", JSON.stringify(theme)); 
      state.dark = dark;
    },
    clearQue(state) {
      state.queSize = 0;
      state.nowPlaying = false;
      state.playingIndex = [];
      state.playQue = [];
      window.favIcon.reset();
    },
    addedToQue(state, playQue, number) {
      state.playQue = playQue;
      state.queSize = number;
    },
    removedFromQue(state, playQue, number) {
      state.playQue = playQue;
      state.queSize = number;
    },
    shuffledQue(state, playQue, number) {
      state.playQue = playQue;
      state.queSize = number;      
      state.playingIndex = [];
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
    toggleFullscreen({ commit }, isFullscreen) {
      commit("isFullscreen", isFullscreen);
    },
    signout({ commit }) {
      localStorage.removeItem("user");
      commit("signout");      
    },
    playIndexChange({ commit }, trackInfo) {
      commit("playIndexChange", trackInfo);
    },
    playRequest({ commit }, trackInfo) {
      commit("playRequest", trackInfo);
    },
    nowPlaying({ commit }, nowPlaying) {
      commit("nowPlaying", nowPlaying);
    },
    addToQue({ commit }, tracks) {
      let data = localStorage.getItem("playQue");
      let pq = [];
      if(data) {
        pq = JSON.parse(data);
      }
      let i = pq.length > 0 ? (_.maxBy(pq, 'listNumber')).listNumber : 0;
      tracks.forEach(t => {
        if(!_.find(pq, function(pt) { return pt.track.id === t.id;})) {
          i++;
          pq.push({
            listNumber: i,
            track:t
          });
        }         
      });
      localStorage.setItem("playQue", JSON.stringify(pq));
      commit("addedToQue", pq, tracks.length);
    },
    shuffleQue({ commit }) {
      let data = localStorage.getItem("playQue");
      let pq = [];
      if(data) {
        pq = JSON.parse(data);
      }
      pq = _.shuffle(pq);
      let i = 0;
      pq.forEach(t => {
        i++;
        t.listNumber = i;
      });
      localStorage.setItem("playQue", JSON.stringify(pq));      
      commit("shuffledQue", pq, pq.length);
    },
    removeFromQue({ commit}, track) {
      let data = localStorage.getItem("playQue");
      let pq = [];
      if(data) {
        pq = JSON.parse(data);
      }
      _.remove(pq, function(t) { return t.track.id === track.track.id; });
      let i = 0;
      pq.forEach(t => {
        i++;
        t.listNumber = i;
      });
      localStorage.setItem("playQue", JSON.stringify(pq));      
      commit("removedFromQue", pq, pq.length);
    },
    clearQue({ commit}) {
      localStorage.removeItem("playQue");
      commit("clearQue");
    }
  }
})
