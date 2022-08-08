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
import { deleteConfirmation } from '@/core/helpers/deleteconfirmation';
import ResetModal from './ModalReset.vue'

onMounted(() => {
  getData()
  setCurrentPageBreadcrumbs('Detail', ['LMS', 'Tugas Online', 'Pantau Ujian'])
})

const store = useStore()
const currentUser = store.getters.currentUser

const storageUrl = `${process.env.VUE_APP_STORAGE_URL}/${currentUser.sekolah_kode}/apischool`
const route = useRoute()
const examId = route.params.id

const searchSiswa = ref()
const kelasFilter = ref()
const kelasOption = ref([])

const resetMode = ref()
const activeData = ref()

const dataPeserta = reactive({
  columns: [
    { label: 'Nama Siswa', field: 'user_nama', sortable: false },
    { label: 'NISN', field: 'siswa_nisn', sortable: false },
    { label: 'Nilai', field: 'nilai', sortable: false },
    { label: 'Dijawab/Total soal', field: 'question', sortable: false },
    { label: 'Status', field: 'entry_status', sortable: false },
    { label: 'Action', field: 'action', sortable: false },
  ],
  rows: [],
})
const dataPesertaBelum = reactive({
  columns: [
    { label: 'Nama Siswa', field: 'user_nama', sortable: false },
    { label: 'Status', field: 'status', sortable: false },
  ],
  rows: [],
})


function getData() {
  request.post('exam/participant', null, {
    params: {
      exam_id: examId
    }
  }).then(res => {
    kelasOption.value = res.data.data.participant
  })
}

function getDataPeserta() {
  request.post('ujian/siswa', null, {
    params: {
      exam_id: examId,
      participant_id : kelasFilter.value,
      cari : searchSiswa.value
    }
  }).then(res => {
    if(res.data.data[0]) {
      dataPeserta.rows = res.data.data[0].sis
      dataPesertaBelum.rows = res.data.data[0].sisNotE
    }

  })
}
function resetEntry(data) {
  activeData.value = data
  resetMode.value = 'Reset'
}
</script>
<template>
<div>

  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="mb-4">
          <h2 class="fs-1 fw-bold py-6">Pilih Peserta Kelas</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex align-items-center justify-content-between gap-8 py-4">
          <div>
            <FilterSelect searchable v-model:filterValue="kelasFilter" placeholder="Pilih Kelas" @changeFilter="getDataPeserta()">
              <el-option
                v-for="kelas in kelasOption"
                :key="kelas.participant_id"
                :label="kelas.kelas_nama"
                :value="kelas.participant_id"
              />
            </FilterSelect>
          </div>
          <div class="d-flex gap-4">
              <el-input
                v-model="searchSiswa"
                clearable
                class="m-2"
                placeholder="Cari Siswa"
                @input="getDataPeserta()"
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
            <h2 class="fs-1 fw-bold py-6">Data Peserta Ujian</h2>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div>
          <ServerSideTable
            :totalRows="dataPeserta.totalRows || 0"
            :columns="dataPeserta.columns"
            :rows="dataPeserta.rows"
            :pagination-options="{
              enabled: false
            }"
            @loadItems="getDataPeserta"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'entry_status'">
                <span :class="`badge badge-${row.entry_status == 'finish' ? 'success' : 'primary'}`">{{row.entry_status}}</span>
              </div>
              <div v-if="column.field == 'nilai'">
                {{row.nilai}}/{{row.scoreMax}}
              </div>
              <div v-if="column.field == 'question'">
                {{row.totJawab}}/{{row.totSoal}}
              </div>
              <div v-if="column.field == 'action'">
                <button @click="resetEntry(row)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <i class="bi bi-x-circle-fill fs-3 me-1"></i>
                    Reset
                  </span>
                </button>
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
            <h2 class="fs-1 fw-bold py-6">Data Peserta Belum Ujian</h2>
          </div>

        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div>
          <ServerSideTable
            :totalRows="dataPesertaBelum.totalRows || 0"
            :columns="dataPesertaBelum.columns"
            :rows="dataPesertaBelum.rows"
            @loadItems="getDataPeserta"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'status'">
                <span class="badge badge-warning">Belum Ujian</span>
              </div>
            </template>
          </ServerSideTable>
        </div>
      </div>
    </div>
  </div>
  
  <ResetModal
    :mode="resetMode"
    :activeData='activeData'
    @close="resetMode = ''"
    @submit="getDataPeserta()" />
</div>
</template>