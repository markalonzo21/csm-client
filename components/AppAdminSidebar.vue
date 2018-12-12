<template>
  <section class="sidebar-section">
    <div id="sidebar-wrapper">
      <ul class="sidebar-nav">
        <li>
          <nuxt-link to="/admin">
            <b>
              <span class="sidebar-text pt-1">Dashboard</span>
            </b>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/admin/reports">
            <b>
              <span class="sidebar-text pt-1">Reports</span>
            </b>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/admin/report-categories">
            <b>
              <span class="sidebar-text pt-1">Report Categories</span>
            </b>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/admin/report-types">
            <b>
              <span class="sidebar-text pt-1">Report Types</span>
            </b>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/admin/response-types">
            <b>
              <span class="sidebar-text pt-1">Response Types</span>
            </b>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/admin/responders">
            <b>
              <span class="sidebar-text pt-1">Responders</span>
            </b>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </section>
</template>
