<template>
  <div class="container">
    <div class="row  mt-5">
      <div class="col-md-4 offset-4 card card-primary p-3 border"
        :class="{ 'border-primary': isUser, 'border-success': !isUser }">
        <h3 :class="{ 'text-primary': isUser, 'text-success': !isUser }" class="text-center mb-3 mt-3">Nuxt.js | Auth
        </h3>
        <hr>
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label>E-posta Adresiniz</label>
            <input v-model="user.email" type="email" class="form-control" placeholder="E-posta adresinizi giriniz">
          </div>
          <div class="form-group">
            <label>Şifre</label>
            <input v-model="user.password" type="password" class="form-control" placeholder="Şifreniz...">
          </div>
          <div class="button-container d-flex  flex-column align-items-center">
            <button type="submit" :class="{ 'btn-primary': isUser, 'btn-success': !isUser }"
              class="btn btn-block mb-2">
              {{ isUser ? 'Giriş Yap' : 'Kayıt Ol' }}
            </button>
            <a href="#" @click.prevent="isUser = !isUser" class="text-secondary">
              {{ isUser ? 'Üye değilim' : 'Üyeliğim var' }}
            </a>
          </div>
        </form>
      </div>
    </div>
    <nuxt-link to="/" tag="a">Homepage</nuxt-link>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  // middleware: "auth",
  data() {
    return {
      user: {
        email: null,
        password: null
      },
      isUser: false
    }
  },
  methods: {
    onSubmit() {

      let authLink = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key="
      if(this.isUser){
        authLink = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key="
      }

      axios.post(authLink + process.env.firebaseAPIKEY,
      { email : this.user.email, password : this.user.password, returnSecureToken : true})
      .then(response => {
        this.$store.dispatch("login", response.data.idToken)
        this.$router.push("/")
      })
    }
  }
}
</script>
