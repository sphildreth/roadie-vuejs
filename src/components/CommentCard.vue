<template>
  <div fluid class="comment-container">
    <v-layout>
      <v-flex d-flex xs4 lg1 class="my-3 pl-4">      
        <router-link :to="'/user/' + (isNew ? currentUserId : comment.user.id)">
          <v-img
              :src="isNew ? currentUserAvatarUrl : comment.user.thumbnail.url"
              :alt="isNew ? currentUserUsername : comment.user.user.text"
              max-width="80"
              class="ma-1"
          ></v-img>                  
          <span class="username">{{ isNew ? currentUserUsername : comment.user.user.text }}</span>
        </router-link>
      </v-flex>
      <v-flex d-flex xs8 lg11>      
          <markdown-editor v-if="!isReadOnly" v-model="addCommentText" ref="markdownEditor"></markdown-editor>        
          <v-card v-if="!isNew" class="darken-3">
            <v-card-title primary-title>
              <h5 class="subheading">{{ comment.createdDate | formatTimeStamp(this.$store.getters.user) }}</h5>
              <v-spacer></v-spacer>
              <span>
              <v-icon
                color="info"
                title="Reply To Comment"
                class="pointer mr-4"
                @click="replyToComment"
                small
              >reply</v-icon>                 
              <v-icon
                :color="comment.isLiked ? 'info' : 'accent'"
                title="Like Comment"
                class="pointer mr-1"
                @click="setReaction(comment.isLiked ? 0 : 2)"
                small
              >thumb_up</v-icon>   
              <v-tooltip bottom>
                <v-chip small slot="activator" color="secondary" text-color="white">
                  {{ comment.likedCount }}
                </v-chip>
                <span>Liked Count</span>
              </v-tooltip>                            
              <v-icon
                :color="comment.isDisliked ? 'yellow' : 'accent'"
                title="Dislike Comment"
                class="pointer mr-1 ml-1"
                @click="setReaction(comment.isDisliked ? 0 : 1)"
                small
              >thumb_down</v-icon>    
              <v-tooltip bottom>
                <v-chip small slot="activator" color="secondary" text-color="white">
                  {{ comment.dislikedCount }}
                </v-chip>
                <span>Disliked Count</span>
              </v-tooltip>                          
              <v-icon
                v-if="canDelete"
                color="red"
                title="Delete Comment"
                class="pointer ml-3"
                @click="deleteComment"
                small
              >delete</v-icon>
              </span>
            </v-card-title>
            <v-card-text class="body-1">
              <vue-markdown v-if="isReadOnly" :source="comment.cmt"></vue-markdown>
            </v-card-text>
          </v-card>          
      </v-flex>          
      <v-btn v-if="!isReadOnly" @click="saveComment" color="info" style="float:right;">{{ "Add" }}</v-btn>         
    </v-layout>
    <confirm ref="confirm"></confirm>    
  </div>
</template>

<script>
import { EventBus } from "@/event-bus.js";
import markdownEditor from "vue-simplemde/src/markdown-editor";
import VueMarkdown from "vue-markdown";
import Confirm from "@/views/Confirm";

export default {
  components: { markdownEditor, 'vue-markdown': VueMarkdown, Confirm },  
  name: 'CommentCard',
  props: {
    isNew: Boolean,
    addUrl: String,
    isReadOnly: Boolean,
    commentType: String,    
    comment: {
      type: Object,
      default: function() {
        return {
          id: -1, 
          cmt: "",
          user: { 
            id: '', 
            value: '', 
            thumbnail:'' 
          }
        }
      }
    }
  },
  async mounted() {
    EventBus.$on('loadingComplete', () =>{ this.loading = false; });   
    EventBus.$on('replyToComment', (cmt) =>{ this.addCommentText = cmt; })
  },
  methods: {
    replyToComment() {
      EventBus.$emit("replyToComment", 
        "> _@" + this.comment.user.user.text + " said on " + this.$options.filters.formatTimeStamp(this.comment.createdDate,this.$store.getters.user) + "_\n" +  
        "> " + this.comment.cmt + 
        "\n\n");        
    },
    setReaction(reaction) {          
      this.$axios.post(process.env.VUE_APP_API_URL + "/comments/setreaction/" + this.comment.id + "/" + reaction ).then(response => {
        if (!response.data.isSuccess) {
          EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" });
          return false;
        }                
        this.comment.likedCount = response.data.additionalClientData.likedCount;
        this.comment.dislikedCount = response.data.additionalClientData.dislikedCount;
        this.comment.isDisliked = false;
        this.comment.isLiked = false;
        switch (reaction) {
          case 1:
            this.comment.isDisliked = true;
            break;      
          case 2:
            this.comment.isLiked = true;
            break;      
        }        
      })
    },
    deleteComment() {
      this.$refs.confirm
        .open("Delete Comment", "Proceed to delete comment?", {
          color: "warning"
        })
        .then(confirm => {
          if (confirm) {
            this.$axios.post(process.env.VUE_APP_API_URL + "/comments/delete/" + this.comment.id).then(response => {
              if (!response.data.isSuccess) {
                EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" });
                return false;
              }
              EventBus.$emit("deletedComment", { addUrl: this.addUrl, comment: this.comment});   
            })
          }
        });      
    },
    saveComment() {
      if(!this.addCommentText) {
        alert("Can't save an empty comment!");
        return false;
      }
      if(this.isNew) {
        this.$axios.post(this.addUrl, {
          cmt: this.addCommentText
        }).then(response => {
          if (!response.data.isSuccess) {
            EventBus.$emit("showSnackbar", { text: "An error has occured", color: "red" });
            return false;
          }
          EventBus.$emit("addedComment", { addUrl: this.addUrl, comment: this.comment});   
          this.addCommentText = "";       
      });
      } else {
        alert('do edit');
      }
    }
  },
  computed: {
    canDelete() {
      return this.comment.user.id === this.$store.getters.userId || this.$store.getters.isUserAdmin;
    },
    currentUserId() {
      return this.$store.getters.userId;
    },
    currentUserUsername() {
      return this.$store.state.isLoggedIn
        ? this.$store.getters.user.username
        : "";
    },
    currentUserAvatarUrl() {
      return this.$store.getters.usersAvatarUrl;
    },    
  },
  data: () => ({
    addCommentText: "",
    loading: true
  })  
}
</script>

<style>
@import "~simplemde/dist/simplemde.min.css";
.comment-container .markdown-editor {
  background-color: white;  
}
.comment-container .CodeMirror, .CodeMirror-scroll {
	min-height: 100px;
}
.comment-container .CodeMirror {
	height: 100px;
}
</style>