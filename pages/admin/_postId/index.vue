<template>
    <PostForm @submit="updatePost($event)" :is-update="true" :post="fetchedPost"/>
</template>
<script>
import axios from "axios"
import PostForm from "@/components/admin/PostForm"

export default {
    components: {
      PostForm
    },
    asyncData(context){
        return axios.get("https://kose-yazilari-8d072-default-rtdb.firebaseio.com/posts/" + context.params.postId + ".json")
        .then(response => {
            return {
                fetchedPost: response.data
            }
        })
    },
    methods: {
      updatePost(editedPost){
        this.$store.dispatch("updatePost", {...editedPost, id: this.$route.params.postId})
        .then(response => {
          this.$router.push("/admin")
        })
      }
    }
  }
</script>