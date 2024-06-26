import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie"

const createStore = () => {
    return new Vuex.Store({
        state: {
            authKey : null,
            fetchedPosts: []
        },
        mutations: {
            setAuthKey(state, authKey){
                state.authKey = authKey
            },
            clearAuthKey(state) {
                Cookie.remove("authKey")
                
                state.authKey = null
            },
            setPosts(state, posts) {
                state.fetchedPosts = posts
            },
            addPost(state, post) {
                state.fetchedPosts.push(post)
            },
            updatePost(state, editedPost) {
                let post_index = state.fetchedPosts.findIndex(post => post.id == editedPost.id)
                state.fetchedPosts[post_index] = editedPost
            }
        },
        actions: {
            nuxtServerInit(vuexContext, context) {
                return context.app.$axios.get(process.env.baseURL + "posts.json")
                    .then(response => {
                        let data = response.data;
                        let postArray = []
                        for (let key in data) {
                            postArray.push({ id: key, ...data[key] })
                        }
                        vuexContext.commit("setPosts", postArray)
                    })
            },
            initAuth(vuexContext, authKey) {
                let token
                if(req){
                    // Working on server
                    if(!req.headers.cookie){
                        return
                    }

                    // Token from cookie
                    token = req.headers.cookie.split(";").find(c => c.trim().startsWith("authKey="))
                    if(token){
                        token = cookie.split("=")[1]
                    }
                }else{
                    // Working on client
                    token = localStorage.getItem("authKey")
                    if(!token){
                        return
                    }
                }
                vuexContext.commit("setAuthKey", token)
            },
            login(vuexContext, authKey){
                Cookie.set("authKey", authKey)
                localStorage.setItem("authKey", authKey)
                vuexContext.commit("setAuthKey", authKey)
            },
            setPosts(vuexContext, posts) {
                vuexContext.commit("setPosts", posts)
            },
            addPost(vuexContext, post) {
                return this.$axios.post(process.env.baseURL + "posts.json", post)
                    .then(response => {
                        vuexContext.commit("addPost", { ...post, id: response.data.name })
                    })
            },
            updatePost(vuexContext, editedPost) {
                return this.$axios.put(process.env.baseURL + "posts/" + editedPost.id + ".json", editedPost)
                    .then(response => {
                        vuexContext.commit("updatePost", editedPost)
                    })
                    .catch(e => console.log(e))
            }
        },
        getters: {
            isAuthenticated(state) {
                return state.authKey != null
            },
            getAuthKey(state) {
                return state.authKey
            },
            getPosts(state) {
                return state.fetchedPosts
            }
        }
    })
}

export default createStore