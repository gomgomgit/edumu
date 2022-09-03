<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { request } from '@/util';
import moment from 'moment';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import ServerSideTable from '@/components/ServerSideTable.vue';
import { useStore } from 'vuex';
  import queryString from "qs";

onMounted(() => {
  getData()
  setCurrentPageBreadcrumbs('Detail', ['Sekolah', 'Informasi', 'Pengumuman'])
})

const store = useStore()
const currentUser = store.getters.currentUser
const storageUrl = process.env.VUE_APP_STORAGE_URL;

const route = useRoute()

const contentId = route.params.id
const detailData = ref([])

const classes = ref([])
const selectedClass = ref([])

function getData() {
  request.get('pengumuman/' + contentId)
  .then(res => {
    detailData.value = res.data.data
    selectedClass.value = res.data.data.kelas_id.split(",").map( Number )
  })
  request.post('kelas')
  .then(res => {
    classes.value = res.data.data
  })
}

function formatingDate(date) {
  return {
    date: moment(date).format('DD/MM/Y'),
    time: moment(date).format('LT')
  }
}
</script>
<template>
<div>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <div class="d-flex justify-content-between">
            <h2 class="fs-1 fw-bold py-4">Detail Pengumuman</h2>
            <div>
              <router-link :to="'/sekolah/informasi/pengumuman'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-arrow-left-circle fs-1"></i>
                <span>
                  Kembali
                </span>
              </router-link>
            </div>
          </div>
        </div>
        <div class="separator border-black-50 border-2 mb-6"></div>
        <div>
          <div class="fs-1 fw-bold text-center">{{detailData.content_name}}</div>
          <div class="fs-6 font-gray-700 text-center">{{detailData.content_create_date}}</div>
          <div class="my-4 text-center">
            <div class="p-2 bg-secondary d-inline-block mw-100">
              <img class="mw-100"  :src="`${storageUrl}/${currentUser.sekolah_kode}/apischool/public` + '/images/konten/' + detailData.content_image" alt="">
            </div>
          </div>
          <div class="row">
            <div class="col-3 d-flex align-items-center">
              <p class="m-0 fs-3 fw-bold">Kelas :</p>
            </div>
            <div class="col-9 align-items-center d-flex">
              <el-select
                v-model="selectedClass"
                multiple
                placeholder="Pilih Kelas"
                style="width: 100%"
                disabled
              > 
                <el-option
                  v-for="clas in classes"
                  :key="clas.kelas_id"
                  :label="clas.kelas_nama"
                  :value="clas.kelas_id"
                />
              </el-select>
            </div>
          </div>
          <div class="mt-6">
            <div class="fs-3 fw-bold mb-3">
              Deskripsi
            </div>
            <div class="fs-4" v-html="detailData.content_desc"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <div class="d-flex justify-content-between">
            <h2 class="fs-1 fw-bold py-4">File Lampiran</h2>
          </div>
        </div>
        <div class="separator border-black-50 border-2 mb-6"></div>
        <div>
          <template v-for="file in detailData.file_content" :key="file.content_file_id">
            <a :href="file.content_file_url" target="_blank"><i class="bi bi-file-earmark-text-fill me-3 fs-3 text-primary"></i>{{file.content_file_nama}}</a>
          </template>
        </div>
      </div>
    </div>
  </div>
</div>
</template>