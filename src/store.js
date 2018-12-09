import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  getters: {
    lastScanDate: (state) => {
      return state.lastScanDate ? state.lastScanDate : "Never";
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
    isUserAdmin() {
      // var jwtData = this.jwtData();
      // return false;
      return false;
    },
    isUserEditor() {
      return false;
    }
  },
  computed: {  
  },  
  state: {
    isLoggedIn: !!localStorage.getItem("user"),
    lastScanDate: null,
    authToken: null,
    user: {
      id: null,
      username: null,
      token: null,
      avatarUrl: null,
      isAdmin: false
    }
  },
  mutations: {
    signin (state) {
      state.pending = true;
    },
    updateLastScan (state, lastScanDate) {
      state.lastScanDate = lastScanDate;
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
    }
  },
  actions: {
    signout({ commit }) {
      localStorage.removeItem("user");
      commit("signout");      
    }    
  }
})
