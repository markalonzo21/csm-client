<template>
  <div class="panel">
    <div
      class="panel-body flex items-center justify-center"
      v-if="loading"
    >
      <a-icon
        spin
        style="font-size: 32px;"
        type="loading"
      />
    </div>
    <div
      class="panel-body relative"
      v-else
    >
      <h2
        class="title__white--large mt-4 ml-2"
        style="font-size: 42px;"
        v-text="labelValue"
      ></h2>
      <span class="title__white--mid uppercase pin-b absolute mb-3">{{ label }}</span>
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
  height: 14rem;
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
