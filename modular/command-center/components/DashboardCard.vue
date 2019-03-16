<template>
  <div class="panel">
    <div
      class="panel-body flex items-center justify-center"
      style=" height: 119px;"
      v-if="loading"
    >
      <a-icon
        spin
        style="font-size: 32px;"
        type="loading"
      />
    </div>
    <div
      class="panel-body"
      v-else
    >
      <h2
        class="title__white--large"
        v-text="labelValue"
      ></h2>
      <span class="title__white--mid uppercase">{{ label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    labelValue: {
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.panel-body {
  background-image: linear-gradient(to right, #354fa3, #34c3e5);
  color: white;
  border-radius: 0.5rem;
}
.invert-gradient {
  background-image: linear-gradient(to right, #34c3e5, #354fa3) !important;
}
.panel-footer {
  border: none;
  background-image: inherit;
  font-weight: bold;
}
</style>
