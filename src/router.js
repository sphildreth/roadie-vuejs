import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

Vue.use(VueRouter);

var router = new VueRouter({
  store,
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue'),
      meta: {
        guest: false
      }
    },    
    {
      path: '/releases',
      name: 'releases',
      component: () => import(/* webpackChunkName: "releases" */ './views/Releases.vue'),
      meta: {
        guest: false
      }
    },
    {
      path: '/accountsettings',
      name: 'accountsettings',
      component: () => import(/* webpackChunkName: "accountsettings" */ './views/AccountSettings.vue'),
      meta: {
        guest: false
      }      
    },        
    {
      path: '/admin',
      name: 'admin',
      component: () => import(/* webpackChunkName: "admin" */ './views/Admin.vue'),
      meta: {
        guest: false,
        is_admin: true
      }      
    },        
    {
      path: '/artists',
      name: 'artists',
      component: () => import(/* webpackChunkName: "artists" */ './views/Artists.vue'),
      meta: {
        guest: false
      }      
    },    
    {
      path: '/artist/:id',
      name: 'artist',
      props: true,
      component: () => import(/* webpackChunkName: "artist" */ './views/Artist.vue'),
      meta: {
        guest: false
      }
    },      
    {
      path: '/artist/edit/:id',
      name: 'artistEdit',
      props: true,
      component: () => import(/* webpackChunkName: "artistEdit" */ './views/ArtistEdit.vue'),
      meta: {
        guest: false,
        is_admin: true
      }
    },        
    {
      path: '/bookmarks',
      name: 'bookmarks',
      component: () => import(/* webpackChunkName: "bookmarks" */ './views/Bookmarks.vue'),
      meta: {
        guest: false
      }      
    },      
    {
      path: '/collections',
      name: 'collections',
      component: () => import(/* webpackChunkName: "collections" */ './views/Collections.vue'),
      meta: {
        guest: false
      }      
    },     
    {
      path: '/collection/:id',
      name: 'collection',
      props: true,
      component: () => import(/* webpackChunkName: "collection" */ './views/Collection.vue'),
      meta: {
        guest: false
      }      
    },    
    {
      path: '/collection/edit/:id',
      name: 'collectionEdit',
      props: true,
      component: () => import(/* webpackChunkName: "collectionEdit" */ './views/CollectionEdit.vue'),
      meta: {
        guest: false,
        is_admin: true
      }
    },      
    {
      path: '/genres',
      name: 'genres',
      component: () => import(/* webpackChunkName: "genres" */ './views/Genres.vue'),
      meta: {
        guest: false
      }
    },    
    {
      path: '/help',
      name: 'help',
      component: () => import(/* webpackChunkName: "help" */ './views/Help.vue'),
      meta: {
        guest: false
      }
    },             
    {
      path: '/labels',
      name: 'labels',
      component: () => import(/* webpackChunkName: "labels" */ './views/Labels.vue'),
      meta: {
        guest: false
      }
    },     
    {
      path: '/label/:id',
      name: 'label',
      props: true,
      component: () => import(/* webpackChunkName: "label" */ './views/Label.vue'),
      meta: {
        guest: false
      }
    }, 
    {
      path: '/label/edit/:id',
      name: 'labelEdit',
      props: true,
      component: () => import(/* webpackChunkName: "labelEdit" */ './views/LabelEdit.vue'),
      meta: {
        guest: false,
        is_admin: true
      }
    },        
    {
      path: '/playlists',
      name: 'playlists',
      component: () => import(/* webpackChunkName: "playlists" */ './views/Playlists.vue'),
      meta: {
        guest: false
      }
    },     
    {
      path: '/playque',
      name: 'playque',
      component: () => import(/* webpackChunkName: "playque" */ './views/PlayQue.vue'),
      meta: {
        guest: false
      }
    },     
    {
      path: '/playlist/:id',
      name: 'playlist',
      props: true,
      component: () => import(/* webpackChunkName: "playlist" */ './views/Playlist.vue'),
      meta: {
        guest: false
      }
    },         
    {
      path: '/register',
      name: 'register',
      component: () => import(/* webpackChunkName: "register" */ './views/Register.vue'),
      meta: {
        guest: true
      }
    },      
    {
      path: '/release/:id',
      name: 'release',
      props: true,
      component: () => import(/* webpackChunkName: "release" */ './views/Release.vue'),
      meta: {
        guest: false
      }
    },       
    {
      path: '/resetpassword',
      name: 'resetpassword',
      component: () => import(/* webpackChunkName: "resetpassword" */ './views/ResetPassword.vue'),
      meta: { 
          guest: true
      }
    },      
    {
      path: '/release/edit/:id',
      name: 'releaseEdit',
      props: true,
      component: () => import(/* webpackChunkName: "releaseEdit" */ './views/ReleaseEdit.vue'),
      meta: {
        guest: false,
        is_admin: true
      }
    },      
    {
      path: '/search/:q',
      name: 'search',
      props: true,
      component: () => import(/* webpackChunkName: "search" */ './views/Search.vue'),
      meta: {
        guest: false
      }
    },           
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import(/* webpackChunkName: "statistics" */ './views/Statistics.vue'),
      meta: {
        guest: false
      }      
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import(/* webpackChunkName: "signin" */ './views/SignIn.vue'),
      meta: { 
          guest: true
      }
    },    
    {
      path: '/tracks',
      name: 'tracks',
      component: () => import(/* webpackChunkName: "tracks" */ './views/Tracks.vue'),
      meta: {
        guest: false
      }      
    },     
    {
      path: '/track/:id',
      name: 'track',
      props: true,
      component: () => import(/* webpackChunkName: "track" */ './views/Track.vue'),
      meta: {
        guest: false
      }      
    },
    {
      path: '/user/:id',
      name: 'user',
      props: true,
      component: () => import(/* webpackChunkName: "user" */ './views/User.vue'),
      meta: {
        guest: false
      }      
    }       
  ]
});

router.beforeEach((to, from, next) => {
  window.favIcon.reset();
  document.title = process.env.VUE_APP_APP_NAME;
  if(to.matched.some(record => !record.meta.guest)) {
    if (!store.state.isLoggedIn) {
        next({
            path: '/signin',
            params: { nextUrl: to.fullPath }
        })
    } else {
        if(to.matched.some(record => record.meta.is_admin)) {
            if(store.getters.isUserAdmin){
                next()
            }
            else{
                next('/');
            }
        }else {
            next();
        }
    }
  }else {
    next();
  }           
});

export default router;
