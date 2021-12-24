<template>
  <div class="home">
    <flow ref="flow" :editIsSHow="editIsSHow" />
  </div>
</template>

<script>
import flow from '@/components/flow/index.vue'

export default {
  name: 'Home',
  data() {
    return {
      editIsSHow: true//操作
    }
  },
  components: {
    flow
  }
}
</script>
