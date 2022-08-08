<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { request } from '@/util';
import moment from 'moment';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FilterSelect from '@/components/filter-select/index.vue';
import { Search } from '@element-plus/icons-vue'
import ServerSideTable from '@/components/ServerSideTable.vue';
import Swal from 'sweetalert2';

onMounted(() => {
  getData()
  setCurrentPageBreadcrumbs('Detail Nilai', ['LMS', 'Laporan Nilai', 'Ujian Online'])
  getSiswaNilai()
})

const route = useRoute()
const router = useRouter()

const ujianId = route.params.id
const detailData = ref([])
const kelasFilter = ref()
const kelasOption = ref([])
const searchSiswa = ref('')


const nilaiData = reactive({
  columns: [
    { label: 'Nama Siswa', field: 'user_nama', sortable: false },
    { label: 'Total Soal', field: 'en_tot_soal', sortable: false },
    { label: 'Total Jawab', field: 'en_tot_jawab', sortable: false },
    { label: 'Total Nilai', field: 'en_tot_nilai', sortable: false },
    { label: 'Nilai Siswa', field: 'en_nilai', sortable: false },
    { label: 'Status', field: 'en_desc', sortable: false },
  ],
  rows: [],
})

function getData() {
  request.post(`ujian/${ujianId}`, null, {
    params: {
      exam_id: ujianId
    }
  }).then(res => {
    console.log(res)
    detailData.value = res.data.data
    kelasOption.value = res.data.part
  })
}


function getSiswaNilai() {
  request.post('ujian/siswanilai', null, {
    params: {
      exam_id: ujianId,
      participant_id: kelasFilter.value,
      cari: searchSiswa.value
    }
  }).then(res => {
    nilaiData.rows = res.data.data[0].nilai
    console.log(nilaiData)
  })
}
function formatingDate(date) {
  return {
    date: moment(date).format('DD/MM/Y'),
    time: moment(date).format('LT')
  }
}

function exportNilai() {
  if (kelasFilter.value) {
    router.push(`/lms/laporan-nilai/tugas-online/export/${ujianId}/${kelasFilter.value}`)
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Harap Pilih Kelas!'
    })
  }
}
</script>
<template>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <h2 class="fs-1 fw-bold py-6">Detail Laporan Nilai</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-8 py-4">
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Guru</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.user_nama}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Mata Pelajaran</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.mapel_nama}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Tanggal Ujian</h4></div>
            <div class="col-10"><h4 class="fw-bold">: 
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.exam_start_date).date}} <i class="ms-3 bi bi-calendar2 text-white"></i></span>
              <span class="badge badge-primary fs-5 p-3 me-4">{{formatingDate(detailData.exam_start_date).time}} <i class="ms-3 bi bi-clock text-white"></i></span>
            </h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Waktu Ujian</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.exam_time_limit}} menit</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Rata rata nilai</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.exam_time_limit}} menit</h4></div>
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex justify-content-between">
          <div>
            <FilterSelect v-model:filterValue="kelasFilter" placeholder="Pilih Kelas" @changeFilter="getSiswaNilai()">
              <el-option
                v-for="kelas, index in kelasOption"
                :key="kelas.participant_id"
                :label="kelas.kelas_nama"
                :value="kelas.participant_id"
              />
            </FilterSelect>
          </div>
          <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
            <el-input
              v-model="searchSiswa"
              clearable
              class="m-2"
              placeholder="Cari Siswa"
              @input="getSiswaNilai"
            >
              <template #append>
                <el-button aria-disabled="true" class="pe-none" :icon="Search" />
              </template>
            </el-input>
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
            <h2 class="fs-1 fw-bold py-6">Data Siswa Ujian</h2>

            <div class='d-flex gap-4'>
              <div class="d-flex align-items-center">
                <a @click="getSiswaNilai" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <i class="bi bi-arrow-repeat fs-1"></i>
                  <span>
                    Refresh Data
                  </span>
                </a>
              </div>
              <div class="d-flex align-items-center">
                <button @click="exportNilai()" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <i class="bi bi-cloud-arrow-up fs-1"></i>
                  <span>
                    Export Nilai
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div v-if="!kelasFilter">
          <h4 class="text-center text-danger">Harap Pilih Kelas!</h4>
        </div>
        <ServerSideTable
          v-if="kelasFilter"
          :totalRows="nilaiData.totalRows || 0"
          :columns="nilaiData.columns"
          :rows="nilaiData.rows"
          @loadItems="getSiswaNilai"
          :pagination-options="{
            enabled: false,
          }"
        >
          <template #table-row="{column, row}">
            <div v-if="column.field == 'exam_status'">
              <span :class="'badge badge-light-' + (row.exam_status == 1 ? 'success' : 'danger')">{{row.exam_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
            </div>
          </template>
        </ServerSideTable>
      </div>
    </div>
  </div>
</template>