<template>
<div id="themeSetting">
  <v-toolbar :dark="$vuetify.dark" >
    <v-toolbar-title>
      Theme Settings
    </v-toolbar-title>
  </v-toolbar>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-subheader class="px-1 my-2">
          Color Option
        </v-subheader>
        <div class="color-option">
          <v-layout wrap>
            <label class="color-option--label flex xs6 pa-1" v-for="(option,index) in themeColorOptions" :key="index">
              <input type="radio" name="color" v-bind:value="option.key" v-model="themeColor">              
              <span class="color-option--item bg">
                  {{option.name}}
                <span class="overlay">
                  <span class="material-icons">check</span>
                </span>
                <span class="color-option--item--header"  :style="{ color: option.value.primary }"></span>
                <span class="color-option--item--header" :style="{ color: option.value.secondary }"></span>
                <span class="sideMenu" :class="option.value.accent"></span>
              </span>
            </label>
          </v-layout>
        </div>
        <div class="theme-options">
          <v-subheader class="px-1 my-2">
            Sidebar Option
          </v-subheader>
          <v-divider></v-divider>
          <div class="my-3">
            <v-btn-toggle v-model="sideBarOption">
              <v-btn flat value="dark">
                Dark
              </v-btn>
              <v-btn flat value="light">
                Light
              </v-btn>
            </v-btn-toggle>   
          </div>
        </div>        
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import colors from 'vuetify/es5/util/colors';
export default {
  data () {
    return {
      themeColor: 0,
      sideBarOption: 'dark',
      colors: colors
    };
  },
  computed: {
    themeColorOptions () {
      return [
        {
          key: 0,
          name: 'Roadie',
          value: {
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107'            
          }
        },
        {
          key: 1,
          name: "Grey",
          value: {
            primary: "#9E9E9E",
            secondary: "#BDBDBD",
            accent: "#FFAB00",
            error: "#D50000",
            warning: "#ffeb3b",
            info: "#2196f3",
            success: "#4caf50"     
          }
        },
        {
            key: 2,
            name: "Purple",
            value: {
              primary: "#673ab7",
              secondary: "#9c27b0",
              accent: "#b39ddb",
              error: "#FF5252",
              info: "#2196F3",
              success: "#e91e63",
              warning: "#FFC107"            
            }
        },
        {
            key: 3,
            name: "Green",
            value: {
                primary: "#9CCC65",
                secondary: "#558B2F",
                accent: "#B2FF59",
                error: "#D50000",
                warning: "#ffeb3b",
                info: "#2196f3",
                success: "#4caf50"           
            }
        },        
        {
            key: 4,
            name: "Blue",
            value: {
                primary: "#2196f3",
                secondary: "#00bcd4",
                accent: "#a7ffeb",
                error: "#FF5252",
                info: "#2196F3",
                success: "#4CAF50",
                warning: "#FFC107"      
            }
        }, 
      ];
    }
  },  
  watch: {
    themeColor: {
      handler (val) {
        this.$vuetify.theme.primary = this.themeColorOptions[val].value.primary;
        this.$vuetify.theme.secondary = this.themeColorOptions[val].value.secondary;
        this.$vuetify.theme.accent = this.themeColorOptions[val].value.accent;
        this.$vuetify.theme.error = this.themeColorOptions[val].value.error;
        this.$vuetify.theme.warning = this.themeColorOptions[val].value.warning;
        this.$vuetify.theme.info = this.themeColorOptions[val].value.info;
        this.$vuetify.theme.success = this.themeColorOptions[val].value.success;        
      },
      immediate: true
    },
    sideBarOption: {
      handler (val) {
        this.$vuetify.dark = (val === 'dark');
      },
      immediate: true      
    }
  },  

};
</script>
<style lang="stylus" scoped>
.color-option
  &--label
    position: relative
    display: block
    cursor: pointer  
    & input[type="radio"] 
      display:none
      &+span 
        position: relative
        &>.overlay
          display: none;
          position: absolute
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,.3);
          text-align: center;
          line-height: 30px;
          color: #fff;                
      &:checked+span>.overlay
        display:block  
    & .bg        
      background-color: #f1f1f1
  &--item
    overflow: hidden;
    display: block;
    box-shadow: 0 0 2px rgba(0,0,0,.1);
    margin-bottom: 15px;      
    &--header
      height: 10px
    &>span 
      display: block;
      float: left;
      width: 50%;
      height: 20px;          
</style>

