import { createStore } from 'vuex'

const axios = require('axios')
const instance = axios.create({ baseURL: 'http://localhost/api/' })

export default createStore({
  state: {
    user: {
      id: -1,
      access_token: ''
    },
    nbPlayed: 0,
    credits: 100
  },
  getters: {
  },
  mutations: {
    logUser (state, user) {
      state.user = user
    },
    logout (state) {
      instance.post('/logout', {}, { headers: { Authorization: `Bearer ${state.user.access_token}` } })
        .then(function () {
          state.user.id = -1
          state.user.access_token = ''
          state.credits = 100
          state.nbPlayed = 0
        })
    },
    incrementNbPlayed (state) {
      state.nbPlayed++
    },
    addCredits (state, nb) {
      state.credits += nb
    }
  },
  actions: {
    register: ({ commit }, userInfos) => {
      return new Promise((resolve, reject) => {
        instance.post('/register', userInfos)
          .then(function (response) {
            resolve(response)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    login: ({ commit, state }, userInfos) => {
      return new Promise((resolve, reject) => {
        instance.post('/login', userInfos)
          .then(function (response) {
            if (response.data.statusCode === 200) {
              commit('logUser', response.data)
              state.credits = response.data.credits
              state.nbPlayed = response.data.rolled
            }
            resolve(response)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    roll: ({ commit, state }) => {
      // if user logged
      if (state.user.access_token.length > 0) {
        return new Promise((resolve, reject) => {
          instance.post('/roll', {}, { headers: { Authorization: `Bearer ${state.user.access_token}` } })
            .then(function (response) {
              resolve(response)
            })
            .catch(function (error) {
              reject(error)
            })
        })
      } else {
        return new Promise((resolve, reject) => {
          instance.post('/freeroll')
            .then(function (response) {
              resolve(response)
            })
            .catch(function (error) {
              reject(error)
            })
        })
      }
    }
  },
  modules: {
  }
})
