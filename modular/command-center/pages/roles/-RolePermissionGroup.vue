<template>
  <div style="user-select: none;">
    <div
      :style="{ borderBottom: '1px solid #E9E9E9', paddingBottom: '3px' }"
      class="mb-2"
    >
      <a-checkbox
        :checked="checkAll"
        :indeterminate="indeterminate"
        @change="onCheckAllChange"
      >
        <span class="capitalize text-2xl">{{ category }}</span>
      </a-checkbox>
    </div>

    <a-checkbox-group
      :options="plainOptions"
      @change="onChange"
      v-model="checkedList"
    />
    <br>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  props: ["permissions", "category", "selectedPermissions"],
  data() {
    return {
      checkedList: [],
      indeterminate: true,
      checkAll: false
    };
  },
  mounted() {
    this.checkedList = this.permissions
      .filter(permission => this.selectedPermissions.includes(permission._id))
      .map(permission => permission.name);
  },
  watch: {
    checkedList(newValues, oldValues) {
      this.$emit("removePermissions", oldValues);
      this.$emit("mergePermissions", newValues);
    }
  },
  computed: {
    plainOptions() {
      return this.permissions
        .filter(permission => permission.category === this.category)
        .map(permission => permission.name);
    }
  },
  methods: {
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.plainOptions.length;
      this.checkAll = checkedList.length === this.plainOptions.length;
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    }
  }
};
</script>
