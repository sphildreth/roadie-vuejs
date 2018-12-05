import Vue from 'vue';
import VueRouter from 'vue-router';
import home from './views/Home.vue';
import store from './store';
import release from './views/Release.vue';
import artist from './views/Artist.vue';
import label from './views/Label.vue';

Vue.use(VueRouter);

var router = new VueRouter({
  store,
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {
        guest: false
      }
    },
    {
      path: '/release/:id',
      name: 'release',
      props: true,
      component: release,
      meta: {
        guest: false
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
      component: artist,
      meta: {
        guest: false
      }
    },      
    {
      path: '/label/:id',
      name: 'label',
      props: true,
      component: label,
      meta: {
        guest: false
      }
    },       
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import(/* webpackChunkName: "about" */ './views/Statistics.vue'),
      meta: {
        guest: true
      }      
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import(/* webpackChunkName: "about" */ './views/SignIn.vue'),
      meta: { 
          guest: true
      }
    }     
  ]
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => !record.meta.guest)) {
    if (!store.state.isLoggedIn) {
        next({
            path: '/signin',
            params: { nextUrl: to.fullPath }
        })
    } else {
        if(to.matched.some(record => record.meta.is_admin)) {
            if(store.isUserAdmin()){
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
