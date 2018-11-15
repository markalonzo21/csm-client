<template>
  <section class="container mx-auto">
    <div class="p-4">Reports</div>
    <table>
      <thead>
        <tr>
          <td>Type</td>
          <td>Location</td>
          <td>Created At</td>
          <td>Resolved At</td>
        </tr>
      </thead>
      <tbody>
        <tr class="cursor-pointer" @click.prevent="$router.push('/reports/1')">
          <td>
            <a class="rowlink">Fire Outbreak</a>
          </td>
          <td>14.12414, 121,41241</td>
          <td>Nov. 11, 2018 10:30 PM</td>
          <td>Nov. 12, 2018 12:30 AM</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
table {
  position: relative;
  border-collapse: separate;
  border-spacing: 15px 15px;
}

.rowlink::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5em; /* don't forget to set the height! */
}
</style>
