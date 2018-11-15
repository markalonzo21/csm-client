<template>
  <div>
    <nav class="flex items-center justify-between flex-wrap bg-grey p-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-between flex-no-shrink text-white mr-6">
          <span class="font-semibold text-xl tracking-tight">LOGO</span>
          <router-link to="/report"
                       class="no-underline text-white">
            Report
          </router-link>
        </div>
      </div>
    </nav>
    <nuxt />
  </div>
</template>
