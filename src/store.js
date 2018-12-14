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
    isUserAdmin: (state, getters) => {
      let jwt = JSON.parse(atob(getters.authToken.split('.')[1]))
      return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "Admin";
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
    }
  },
  actions: {
    signout({ commit }) {
      localStorage.removeItem("user");
      commit("signout");      
    }    
  }
})
