<template>
  <div class="home">
    <Casino/>
  </div>
</template>

<script>
// @ is an alias to /src
import Casino from '@/components/Casino.vue'

export default {
  name: 'Home',
  components: {
    Casino
  }
}
</script>
