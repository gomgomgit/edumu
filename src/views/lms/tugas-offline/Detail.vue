<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { request } from '@/util';
import moment from 'moment';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import FilterSelect from '@/components/filter-select/index.vue';
import { Search } from '@element-plus/icons-vue'
import ServerSideTable from '@/components/ServerSideTable.vue';
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';

onMounted(() => {
  getData()
  getHasil()
  setCurrentPageBreadcrumbs('Detail Tugas', ['LMS', 'Tugas Offline'])
})

const store = useStore()
const currentUser = store.getters.currentUser

const storageUrl = `${process.env.VUE_APP_STORAGE_URL}/${currentUser.sekolah_kode}/apischool`
const route = useRoute()
const tugasId = route.params.id
const kelasOption = ref([])
const detailData = ref([])

const dataFile = reactive({
  columns: [
    { label: 'Nama Item', field: 'tugas_file_nama', sortable: false },
    { label: 'Format', field: 'tugas_file_ext', sortable: false },
    { label: 'Download', field: 'download', sortable: false },
  ],
  rows: [],
})

const dataHasil = reactive({
  columns: [
    { label: 'Nama', field: 'user_nama', sortable: false },
    { label: 'Nilai', field: 'ta_nilai', sortable: false },
    { label: 'Di Jawab', field: 'ta_create_date', sortable: false },
    { label: 'Status', field: 'ta_status', sortable: false },
    { label: 'Detail', field: 'detail', sortable: false },
  ],
  rows: [],
})

function getData() {
  request.post(`tugas/detail`, null, {
    params: {
      tugas_id: tugasId,
    }
  }).then(res => {
    detailData.value = res.data.data.tugas[0]

    dataFile.rows = res.data.data.tugas[0].tugas_file
    kelasSelected.value = res.data.data.tugas[0].kelas_id.split(",").map( Number )
  })
  
  request.post('kelas', null)
  .then(res => {
    kelasOption.value = res.data.data
  })
}
function getHasil(payload) {
  request.post(`tugas/hasil-list`, null, {
    params: {
      tugas_id: tugasId,
      sortName: payload?.sort?.type == 'none' ? '' : payload?.sort?.field,
      sortOrder: payload?.sort?.type == 'none' ? ''  : payload?.sort?.type,
      locale: 'id',
      platform: 'web'
    }
  }).then(res => {
    dataHasil.rows = res.data.data.tugas_answer
  })
}

const kelasSelected = ref()

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
          <h2 class="fs-1 fw-bold py-6">Detail Tugas</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-8 py-4">
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Judul Tugas</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.tugas_judul}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Tanggal Pembuatan</h4></div>
            <div class="col-10"><h4 class="fw-bold">: 
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_create_date).date}} <i class="ms-3 bi bi-calendar2 text-white"></i></span>
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_create_date).time}} <i class="ms-3 bi bi-clock text-white"></i></span>
            </h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Batas Pengumpulan</h4></div>
            <div class="col-10"><h4 class="fw-bold">: 
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_due_date).date}} <i class="ms-3 bi bi-calendar2 text-white"></i></span>
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.tugas_due_date).time}} <i class="ms-3 bi bi-clock text-white"></i></span>
            </h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Kelas</h4></div>
            <div class="col-10 d-flex gap-1 align-items-center">
              <div>
                <h4 class="fw-bold">:</h4>
              </div>
              <div class="flex-fill">
                <el-select
                  class="w-100"
                  v-model="kelasSelected"
                  multiple
                  placeholder="Pilih Kelas"
                  style="width: 100%"
                  filterable
                  disabled
                >
                  <el-option label="Pilih Semua" value="all"
                  />
                  <el-option
                    v-for="kelas in kelasOption"
                    :key="kelas.kelas_id"
                    :label="kelas.kelas_nama"
                    :value="kelas.kelas_id"
                  />
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Mata Pelajaran</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.mapel_nama}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Guru</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.user_nama}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Progress</h4></div>
            <div class="col-10 d-flex align-items-center gap-3">
              <h4 class="fw-bold">: </h4>
              <span :class="`badge badge-${detailData.tugas_progress == 'finish' ? 'success' : 'danger'} fs-4 p-2`">{{detailData.tugas_progress == 'finish' ? 'Selesai' : 'Belum Selesai'}}</span>
            </div>
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
            <h2 class="fs-1 fw-bold py-6">List File</h2>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div>
          <ServerSideTable
            :totalRows="dataFile.totalRows || 0"
            :columns="dataFile.columns"
            :rows="dataFile.rows"
            :pagination-options="{
              enabled: false
            }"
            @loadItems="getData"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'download'">
                <a target="_blank" :href="row.tugas_file_url" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <i class="bi bi-cloud-arrow-down-fill fs-3"></i>
                  </span>
                </a>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>

  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <div class="d-flex justify-content-between">
            <h2 class="fs-1 fw-bold py-6">Hasil Siswa</h2>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div>
          <ServerSideTable
            :totalRows="dataHasil.totalRows || 0"
            :columns="dataHasil.columns"
            :rows="dataHasil.rows"
            @loadItems="getHasil"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'detail'">
                <router-link :to="`/lms/tugas-offline/detail/answer/${row.tugas_answer_id}`" class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/files/fil001.svg" />
                  </span>
                </router-link>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
</div>
</template>