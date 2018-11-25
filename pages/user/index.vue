<template>
  <div class="main-content">
    <div class="container">
      <ReportsHistory/>
    </div>
  </div>
</template>

<script>
import ReportsHistory from '~/components/ReportsHistory'
export default {
  middleware: 'isUser',
  layout: 'user',
  components: {
    ReportsHistory
  }
}
</script>

<style scoped>
table {
  position: relative;
  border-collapse: separate;
  border-spacing: 15px 15px;
}

.rowlink::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5em; /* don't forget to set the height! */
}
</style>
