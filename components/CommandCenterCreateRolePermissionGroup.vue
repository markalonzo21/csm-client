<template>
    <div style="user-select: none;">
       <div :style="{ borderBottom: '1px solid #E9E9E9', paddingBottom: '3px' }">
         <a-checkbox
           :indeterminate="indeterminate"
           @change="onCheckAllChange"
           :checked="checkAll"
         >
           <span class="capitalize">{{ category }}</span>
         </a-checkbox>
       </div>
       <a-checkbox-group :options="plainOptions" v-model="checkedList" @change="onChange" />
       <br><br>
    </div>
</template>

<script>
  export default {
    props: ['permissions', 'category', 'selectedPermissions'],
    data () {
      return {
        checkedList: [],
        indeterminate: true,
        checkAll: false
      }
    },
    mounted() {
      this.checkedList = this.permissions.filter(permission => this.selectedPermissions.includes(permission._id)).map(permission => permission.name)
    },
    watch: {
      checkedList(newValues, oldValues) {
        this.$emit('removePermissions', oldValues)
        this.$emit('mergePermissions', newValues)
      },
    },
    computed: {
      plainOptions() {
        return this.permissions.filter(permission => permission.category === this.category).map(permission => permission.name)
      }
    },
    methods: {
      onChange (checkedList) {
        this.indeterminate = !!checkedList.length && (checkedList.length < this.plainOptions.length)
        this.checkAll = checkedList.length === this.plainOptions.length
      },
      onCheckAllChange (e) {
        Object.assign(this, {
          checkedList: e.target.checked ? this.plainOptions : [],
          indeterminate: false,
          checkAll: e.target.checked,
        })
      },
    }
  }
</script>
