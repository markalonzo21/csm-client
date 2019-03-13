<template>
  <div>
    <div :style="{ borderBottom: '1px solid #E9E9E9' }">
      <a-checkbox
        :checked="checkAll"
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
      >Check all</a-checkbox>
    </div>
    <a-checkbox-group
      :options="options"
      @change="onChange"
      v-model="checkedList"
    />
  </div>
</template>
<script>
export default {
  props: {
    areas: {
      type: Array,
      required: true
    },
    selectedAreas: {
      type: Array
    }
  },
  mounted() {
    this.checkedList = this.areas
      .filter(area => this.selectedAreas.includes(area._id))
      .map(area => area.name);

    if (this.checkedList.length === this.areas.length) {
      this.checkAll = true;
      this.indeterminate = false;
    }
  },
  data() {
    return {
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      options: this.areas.map(area => area.name)
    };
  },
  watch: {
    checkedList(newValues, oldValues) {
      const newAreaIds = newValues.map(value => {
        return this.areas.find(area => area.name === value)._id;
      });
      this.$emit("mergeAreas", newAreaIds);
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

