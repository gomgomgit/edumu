<script setup>
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { onMounted } from "@vue/runtime-core";

onMounted(() => {
  setCurrentPageBreadcrumbs('Buku Sekolah Elektronik', ['LMS', 'Materi Belajar External'])
})
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body p-0 overflow-hidden rounded-3">
        <!-- <div>
          <h2 class="fs-1 fw-bold py-6">Dokumentasi</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div> -->
        <div class="vh-100">
          <iframe src="https://bse.belajar.kemdikbud.go.id/#!/Content/List/Sd" frameborder="0" height="100%" width="100%"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>