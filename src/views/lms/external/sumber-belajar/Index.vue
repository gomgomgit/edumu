<script setup>
import PageTabs from '@/components/page-tabs/index.vue'
import { ref } from 'vue'

const tabs = [
  {
    to: '/lms/external/sumber-belajar/paud',
    title: 'PAUD'
  },
  {
    to: '/lms/external/sumber-belajar/sd',
    title: 'SD'
  },
  {
    to: '/lms/external/sumber-belajar/smp',
    title: 'SMP'
  },
  {
    to: '/lms/external/sumber-belajar/sma',
    title: 'SMA'
  },
  {
    to: '/lms/external/sumber-belajar/smk',
    title: 'SMK'
  },
  {
    to: '/lms/external/sumber-belajar/umum',
    title: 'UMUM'
  },
  {
    to: '/lms/external/sumber-belajar/slb',
    title: 'SLB'
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