<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { request } from '@/util';
import moment from 'moment';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import FilterSelect from '@/components/filter-select/index.vue';
import { Search } from '@element-plus/icons-vue'
import ServerSideTable from '@/components/ServerSideTable.vue';

onMounted(() => {
  getData()
  setCurrentPageBreadcrumbs('Detail Absensi', ['Absensi', 'Rekapitulasi', 'Mapel'])
})

const route = useRoute()
const pgId = route.params.id

const detailData = ref([])


const absenData = reactive({
  columns: [
    { label: 'Nama', field: 'nama_siswa', sortable: false },
    { label: 'Tanggal', field: 'tanggal', sortable: false },
    { label: 'Kehadiran', field: 'pgd_status', sortable: false },
    { label: 'Deskripsi', field: 'pgd_note', sortable: false },
  ],
  rows: [],
})

function getData() {
  request.post(`reportmapeldetail`, null, {
    params: {
      pg: pgId
    }
  }).then(res => {
    console.log(res)
    detailData.value = res.data.detail
    absenData.rows = res.data.data
  })
}
function dateFormating(date) {
  return moment(date).format('DD/MM/YYYY')
}
</script>
<template>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <h2 class="fs-1 fw-bold py-6">Detail Absensi Mata Pelajaran Per Kelas</h2>
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
            <div class="col-2"><h4 class="text-black-50">Kelas</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{detailData.kelas_nama}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Periode</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{dateFormating(detailData.pg_create_date)}}</h4></div>
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
            <h2 class="fs-1 fw-bold py-6">Data Presensi Mapel</h2>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <ServerSideTable
          :totalRows="absenData.totalRows || 0"
          :columns="absenData.columns"
          :rows="absenData.rows"
          @loadItems="getSiswaNilai"
          :pagination-options="{
            enabled: false,
          }"
        >
          <template #table-row="{column, row}">
            <div v-if="column.field == 'tanggal'">
              {{dateFormating(row.pg_create_date)}}
            </div>
          </template>
        </ServerSideTable>
      </div>
    </div>
  </div>
</template>