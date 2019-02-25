<template>
  <div>
    <div
      :style="{ borderBottom: '1px solid #E9E9E9' }"
      class="mb-2"
    >
      <a-checkbox
        :checked="checkAll"
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
      >Check all</a-checkbox>
    </div>
    <a-checkbox-group
      :options="options"
      @change="onChange"
      class="mb-4"
      v-model="checkedList"
    />
  </div>
</template>
<script>
export default {
  props: {
    canRespondTo: {
      type: Array,
      required: true
    },
    selectedCanRespondTo: {
      type: Array
    }
  },
  data() {
    return {
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      options: this.canRespondTo.map(type => type.name)
    };
  },
  mounted() {
    if (!this.selectedCanRespondTo) {
      this.checkAll = true;
      this.indeterminate = false;
      this.checkedList = this.canRespondTo.map(type => type.name);
      return;
    }
    this.checkedList = this.canRespondTo
      .filter(type => this.selectedCanRespondTo.includes(type._id))
      .map(type => type.name);

    if (this.checkedList.length === this.canRespondTo.length) {
      this.checkAll = true;
      this.indeterminate = false;
    }
  },
  watch: {
    checkedList(newValues, oldValues) {
      const canRespondToIds = newValues.map(value => {
        return this.canRespondTo.find(type => type.name === value)._id;
      });
      this.$emit("mergeCanRespondTo", canRespondToIds);
    }
  },
  methods: {
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.options.length;
      this.checkAll = checkedList.length === this.options.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.options : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    }
  }
};
</script>

