<template>
  <div>Comment Here</div>
</template>

<script>
export default {
  props: ['type'],
  mounted() {
    this.getComments()
  },
  methods: {
    getComments() {}
  }
}
</script>
