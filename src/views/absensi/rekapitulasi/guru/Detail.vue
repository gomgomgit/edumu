<script setup>
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb';
import { request } from '@/util';
import moment from 'moment';
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import FilterSelect from '@/components/filter-select/index.vue';
import { Search } from '@element-plus/icons-vue'
import ServerSideTable from '@/components/ServerSideTable.vue';
import FormModal from './FormModal.vue'

onMounted(() => {
  getData()
  setCurrentPageBreadcrumbs('Detail Absensi', ['Absensi', 'Rekapitulasi', 'Guru'])
})

const route = useRoute()
const guruId = route.params.id
const startDate = route.params.start
const endDate = route.params.end

const guruData = ref([])

const formMode = ref()
const activeData = ref()

const absenData = reactive({
  columns: [
    { label: 'Foto', field: 'presensi_foto', sortable: false },
    { label: 'Nama', field: 'user_nama', sortable: false },
    { label: 'Tanggal', field: 'tanggal', sortable: false },
    { label: 'Kehadiran', field: 'presensi_status', sortable: false },
    { label: 'Type', field: 'presensi_tipe', sortable: false },
    { label: 'Action', field: 'action', sortable: false },
  ],
  rows: [],
  totalRows: 0,
})

function getData() {
  request.post(`reportgurudetail`, null, {
    params: {
      status: 'all',
      user_id: guruId,
      start: startDate,
      end: endDate,
    }
  }).then(res => {
    guruData.value = res.data.data.guru

    absenData.rows = res.data.data.presensis.data
    absenData.total = res.data.data.presensis.total
  })
}
function dateFormating(date) {
  return moment(date).format('DD/MM/YYYY')
}

function editData(data) {
  formMode.value = 'Edit Data'
  activeData.value = data
}
function handleFormClose() {
  formMode.value = ''
  activeData.value = []
}
function handleSubmit() {
  getData()
}
</script>
<template>
<div>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <h2 class="fs-1 fw-bold py-6">Detail Absensi Guru</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-8 py-4">
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Guru</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{guruData.user ? guruData.user.user_nama : ''}}</h4></div>
          </div>
          <div class="row">
            <div class="col-2"><h4 class="text-black-50">Periode</h4></div>
            <div class="col-10"><h4 class="fw-bold">: {{startDate}} sampai {{endDate}}</h4></div>
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
            <h2 class="fs-1 fw-bold py-6">Data Presensi</h2>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <ServerSideTable
          :totalRows="absenData.totalRows || 0"
          :columns="absenData.columns"
          :rows="absenData.rows"
          @loadItems="getData"
          :pagination-options="{
            enabled: false,
          }"
        >
          <template #table-row="{column, row}">
            <div v-if="column.field == 'presensi_foto'">
              <p class="bg-secondary p-2 d-inline-block">
                <img :src="'https://hilobox01.oss-ap-southeast-5.aliyuncs.com/master/demo/apischool/public/images/presensi/'+row.presensi_foto" alt="" style="max-width: 150px">
              </p>
            </div>
            <div v-if="column.field == 'tanggal'">
              {{dateFormating(row.pg_create_date)}}-{{row.presensi_create_time}}
            </div>
            <div v-if="column.field == 'action'">
              <button @click="editData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                <span class="svg-icon svg-icon-3">
                  <inline-svg src="media/icons/duotune/art/art005.svg" />
                </span>
              </button>
            </div>
          </template>
        </ServerSideTable>
      </div>
    </div>
  </div>
  
  <FormModal 
    :mode="formMode"
    :activeData="activeData"
    @close="handleFormClose"
    @submit="handleSubmit()" />
</div>
</template>