<script setup>
import PageTabs from '@/components/page-tabs/index.vue'
import { ref } from 'vue'

const tabs = [
  {
    to: '/sekolah/e-document/rapor',
    title: 'Rapor'
  },
  {
    to: '/sekolah/e-document/dokumen',
    title: 'Dokumen'
  },
  {
    to: '/sekolah/e-document/kategori',
    title: 'Kategori'
  },
]
</script>

<template>
  <div>
    <PageTabs :tabs="tabs"></PageTabs>

    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'slide-fade'">
        <component :is="Component"/>
      </transition>
    </router-view> 
  </div>
</template>