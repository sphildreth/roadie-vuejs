import Vue from 'vue';
import Vuex from 'vuex';
import * as _ from "lodash";

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
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
      if(!state.lastScanDate) {
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
        return {};
      }
      if(!state.authToken)
      {
        if(!state.user || !state.user.username) {
          var data = localStorage.getItem("user");
          if(!data) {
            return {};
          }
          state.user = JSON.parse(data);
        }
        state.authToken = state.user.token;
      }      
      return state.authToken;
    },
    userId: (state, getters) => {
      let jwt = JSON.parse(atob(getters.authToken.split('.')[1]));
      return jwt["roadie_id"];
    },
    isUserAdmin: (state, getters) => {
      let jwt = JSON.parse(atob(getters.authToken.split('.')[1]));
      return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin";
    },
    isUserEditor: (state, getters) => {
      let jwt = JSON.parse(atob(getters.authToken.split('.')[1]));
      return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin" || jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Editor";
    },
    usersAvatarUrl: (state) => {
      return (state.user && state.user.avatarUrl) ? state.user.avatarUrl + '?ts=' + new Date().getTime() : '';
    }
  },
  computed: {  
  },  
  state: {
    isLoggedIn: !!localStorage.getItem("user"),
    queSize: 0,
    lastScanDate: null,
    authToken: null,
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
      state.playQue = [];
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
    }
  },
  actions: {
    signout({ commit }) {
      localStorage.removeItem("user");
      commit("signout");      
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
