<template>
  <div>
    <h1>🍒 Slot Machine 🍒</h1>
    <div class="row m-auto pt-5 pb-1 slot">
      <div class="col-4 d-inline-block border border-5 border-secondary bg-light">{{ fruits[getReelValue(0)] }}</div>
      <div class="col-4 d-inline-block border border-5 border-secondary bg-light">{{ fruits[getReelValue(1)] }}</div>
      <div class="col-4 d-inline-block border border-5 border-secondary bg-light">{{ fruits[getReelValue(2)] }}</div>
    </div>
    <p class="alert alert-warning m-auto" v-if="getUserId === -1">You're not logged in, this won't be saved.</p>
    <button @click="roll" class="btn btn-success fs-1 mb-5 mt-3" :disabled="isRunning">Play</button>
    <p>{{ spinSentence }}</p>
    <p>Number of credits : {{ nbCredits }}</p>
    <p>Number of games played : {{ nbPlayed }}</p>
    <table>
      <tr><td>💎💎💎</td><td class="text-end">500</td></tr>
      <tr><td>❌💎💎</td><td class="text-end">5</td></tr>
      <tr><td>❌❌💎</td><td class="text-end">2</td></tr>
      <tr><td>💲⠀💲⠀💲</td><td class="text-end">1000</td></tr>
      <tr><td>🔔🔔🔔</td><td class="text-end">250</td></tr>
      <tr><td>🍇🍇🍇</td><td class="text-end">100</td></tr>
      <tr><td>🍊🍊🍊</td><td class="text-end">75</td></tr>
      <tr><td>🍒🍒🍒</td><td class="text-end">50</td></tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Casino',
  data () {
    return {
      fruits: ['🍒', '🍊', '🍇', '🔔', '💲', '💎', '❌'],
      reel: [6, 6, 6],
      spinResult: [-1, -1, -1],
      spinSentence: '',
      animationCount: 0,
      isRunning: false,
      cachedSentence: '',
      cachedScore: 0
    }
  },
  computed: {
    nbPlayed () {
      return this.$store.state.nbPlayed
    },
    nbCredits () {
      return this.$store.state.credits
    },
    getUserId () {
      return this.$store.state.user.id
    }
  },
  methods: {
    roll () {
      if (!this.isRunning) {
        this.isRunning = true
        this.$store.commit('incrementNbPlayed')
        // ask server for a roll
        const self = this
        this.$store.dispatch('roll')
          .then(function (response) {
            self.spinResult = response.data.roll
            self.cachedSentence = response.data.sentence
            self.cachedScore = response.data.score
          })

        this.animationCount = 0
        this.playAnimation()
      }
    },
    getReelValue (n) {
      return this.reel[n]
    },
    updateScore () {
      this.$store.commit('addCredits', this.cachedScore)
      this.spinSentence = this.cachedSentence
      this.isRunning = false
    },
    playAnimation () {
      if (this.animationCount < 30) {
        this.animationCount++
        if (this.animationCount < 10) {
          this.reel[0] = (this.reel[0] + 1) % 6
        } else {
          this.reel[0] = this.spinResult[0]
        }

        if (this.animationCount < 20) {
          this.reel[1] = (this.reel[1] + 1) % 6
        } else {
          this.reel[1] = this.spinResult[1]
        }

        if (this.animationCount < 29) {
          this.reel[2] = (this.reel[2] + 1) % 6
        } else {
          this.reel[2] = this.spinResult[2]
        }

        setTimeout(() => {
          this.playAnimation()
        }, 100)
      } else {
        this.updateScore()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slot {
  font-size: 500%;
}
@media (orientation: landscape) {
  .slot {
    max-width: 50%;
  }
  .alert-warning {
    max-width: 50%;
  }
}
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
