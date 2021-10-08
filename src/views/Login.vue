<template>
  <div class="login m-auto">
    <div class="card">
      <h1 class="card-title" v-if="mode === 'login'">Login</h1>
      <h1 class="card-title" v-else>Register</h1>
      <p class="card-subtitle" v-if="mode === 'login'">Not registered yet ? <span class="link-success" @click="registerForm()">Create an account!</span></p>
      <p class="card-subtitle" v-else>Already registered ? <span class="link-success" @click="loginForm()">Login!</span></p>
      <div class="px-5 mt-3">
        <input type="text" class="form-control mb-3" placeholder="Nickname (min 3)" v-if="mode === 'register'" v-model="nickname"/>
        <input type="email" class="form-control mb-3" placeholder="Email" v-model="email"/>
        <input type="password" class="form-control mb-3" placeholder="Password (min 8)" v-model="password"/>
        <input type="password" class="form-control mb-3" placeholder="Confirm Password" v-if="mode === 'register'" v-model="confirmPassword"/>
        <div class="btn btn-success mb-3" v-if="mode === 'login'" :class="{'disabled': !validFields}" @click="login">Login</div>
        <div class="btn btn-success mb-3" v-else :class="{'disabled': !validFields}" @click="register">Register</div>
        <div class="alert alert-warning" v-if="clicked && success === 0">Waiting for server response...</div>
        <div class="alert alert-danger" v-if="clicked && success === 2">{{ getMessage }}</div>
        <div class="alert alert-success" v-if="clicked && success === 1">{{ getMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      mode: 'login',
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      clicked: false,
      success: 0,
      message: ''
    }
  },
  computed: {
    validFields () {
      if (this.mode === 'register') {
        if (this.nickname === '' || this.nickname.length < 3 || this.password !== this.confirmPassword) {
          return false
        }
      }
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return !(!re.test(this.email) || this.password === '' || this.password.length < 8)
    },
    getMessage () {
      return this.message
    }
  },
  methods: {
    registerForm () {
      this.mode = 'register'
      this.clicked = false
      this.success = 0
    },
    loginForm () {
      this.mode = 'login'
      this.clicked = false
      this.success = 0
    },
    register () {
      this.clicked = true
      this.success = 0
      const self = this
      this.$store.dispatch('register', {
        name: this.nickname,
        email: this.email,
        password: this.password,
        password_confirmation: this.confirmPassword
      })
        .then(function (response) {
          self.success = response.data.statusCode === 200 ? 1 : 2
          self.message = response.data.message
        }).catch(function (error) {
          self.success = 2
          self.message = error.data.message
        })
    },
    login () {
      this.clicked = true
      this.success = 0
      const self = this
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
        .then(function (response) {
          self.success = response.data.statusCode === 200 ? 1 : 2
          self.message = response.data.message
        }).catch(function (error) {
          self.success = 2
          self.message = error.data.message
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  background-color : #454545;
}
@media (orientation: landscape) {
  .login {
    max-width: 50%;
  }
}
</style>
