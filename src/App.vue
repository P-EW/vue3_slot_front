<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login" v-if="getUserId === -1">Login</router-link>
    <div class="logout" @click="logOut" v-else>Logout</div>
  </div>
  <router-view/>
</template>

<script>
export default {
  name: 'app',
  created () {
    document.title = 'Simple Slot Machine'
  },
  computed: {
    getUserId () {
      return this.$store.state.user.id
    }
  },
  methods: {
    logOut () {
      this.$store.commit('logout')
    }
  }
}
</script>

<style>
body {
  background: #171717 !important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #DDDDDD;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #DDDDDD;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.logout {
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
  display: inline;
}
</style>
