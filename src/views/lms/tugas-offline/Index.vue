<script setup>
  import { ref, reactive, onMounted } from "vue";
  import { request } from '@/util'
  import FormModal from "./FormModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import FilterSelect from '@/components/filter-select'
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import QueryString from "qs";
  import { Search } from '@element-plus/icons-vue'
  import { useToast } from "vue-toast-notification"
  import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
import moment from "moment";
  
  onMounted(() => {
    setCurrentPageBreadcrumbs("Tugas Offline", ['LMS']);
    getData()
  })

  function getTugasData (payload) {
    request.post('tugas/all', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC',
        sortName: payload?.sort?.type == 'none' ? '' : payload?.sort?.field,
        sortOrder: payload?.sort?.type == 'none' ? ''  : payload?.sort?.type,
        mapel: mapelFilter.value,
        kelas: kelasFilter.value,
        user: guruFilter.value,
        judul_tugas: searchTugas.value
      }
    }).then(res => {
      tugasData.rows = res.data.data.tugas.data 
      tugasData.totalRows = res.data.data.tugas.total
    }).catch(err => {
      tugasData.rows = []
    })
  }
  function getData () {
    request.post('user', null, {
      params: {
        level: 'guru'
      }
    }).then(res => {
      guruOption.value = res.data.data
    })
    request.post('kelas', null)
    .then(res => {
      kelasOption.value = res.data.data
    })
    request.post('mapel', null)
    .then(res => {
      mapelOption.value = res.data.data
    })
  }

  const formMode = ref()
  const activeData = ref()

  const guruFilter = ref()
  const kelasFilter = ref()
  const mapelFilter = ref()
  const searchTugas = ref()

  const guruOption = ref([])
  const kelasOption = ref([])
  const mapelOption = ref([])

  const tugasData = reactive({
    columns: [
      { label: 'Kelas', field: 'kelas_nama', sortable: false },
      { label: 'Mapel', field: 'mapel_nama', sortable: false },
      { label: 'Guru', field: 'user_nama', sortable: false },
      { label: 'Judul', field: 'tugas_judul', sortable: false },
      { label: 'Tgl Pembuatan', field: 'tugas_create_date' },
      { label: 'Status', field: 'tugas_status' },
      { label: 'Action', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  function dateFormating(date) {
    return moment(date).format('DD/MM/Y')
  }

  function deleteData(id) {
    deleteConfirmation(function() {
      request.post('tugas/delete', QueryString.stringify({tugas_id: id}))
      .then(res => {
        useToast().success('Data Berhasil Dihapus!')
        getTugasData()
      })
    })
  }
  
  function handleClose() {
    formMode.value = null
    activeData.value = null
  }
  function handleSubmit() {
    formMode.value = null
    activeData.value = null
    getTugasData()
  }
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body pt-5 pb-5">
        <div class="page-content">
          <div class="d-flex flex-wrap justify-content-between align-items-center">
            <div class="d-flex gap-4">
              <h2 class="fs-1 fw-bold py-6">Data Tugas Siswa</h2>
            </div>

            <div class="position-relative d-flex ">
              <a @click="formMode = 'Tambah Data'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Tugas
                </span>
              </a>
              <!-- <router-link to="/lms/tugas-offline/tambah" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                <i class="bi bi-plus fs-1"></i>
                <span>
                  Tambah Tugas
                </span>
              </router-link> -->
            </div>
          </div>
          <div class="separator border-black-50 border-2 my-6"></div>
          <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <div class="d-flex gap-4">
              <div>
                <FilterSelect searchable v-model:filterValue="guruFilter" placeholder="Pilih Guru" @changeFilter="getTugasData()">
                  <el-option
                    v-for="guru in guruOption"
                    :key="guru.user_id"
                    :label="guru.user_nama"
                    :value="guru.user_id"
                  />
                </FilterSelect>
              </div>
              <div>
                <FilterSelect v-model:filterValue="kelasFilter" placeholder="Pilih Kelas" @changeFilter="getTugasData()">
                  <el-option
                    v-for="kelas, index in kelasOption"
                    :key="kelas.kelas_id"
                    :label="kelas.kelas_nama"
                    :value="kelas.kelas_id"
                  />
                </FilterSelect>
              </div>
              <div>
                <FilterSelect v-model:filterValue="mapelFilter" placeholder="Pilih Mapel" @changeFilter="getTugasData()">
                  <el-option
                    v-for="mapel, index in mapelOption"
                    :key="mapel.mapel_id"
                    :label="mapel.mapel_nama"
                    :value="mapel.mapel_id"
                  />
                </FilterSelect>
              </div>
            </div>
            
            <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
                <el-input
                  v-model="searchTugas"
                  clearable
                  class="m-2"
                  placeholder="Cari Judul"
                  @input="getTugasData"
                >
                  <template #append>
                    <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                  </template>
                </el-input>
            </div>
          </div>
          <div class="mb-5 mb-xxl-8">
            <ServerSideTable
              :totalRows="tugasData.totalRows || 0"
              :columns="tugasData.columns"
              :rows="tugasData.rows"
              @loadItems="getTugasData"
            >
              <template #table-row="{column, row}">
                <div v-if="column.field == 'tugas_status'">
                  <span :class="'badge badge-light-' + (row.tugas_status == 1 ? 'success' : 'danger')">{{row.tugas_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
                </div>
                <div v-if="column.field == 'materi_create_date'">
                  {{dateFormating(row.materi_create_date)}}
                </div>
                <div v-if="column.field == 'action'">
                  <router-link :to="`/lms/tugas-offline/detail/${row.tugas_id}`" class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-2">
                    <span class="svg-icon svg-icon-3">
                      <inline-svg src="media/icons/duotune/files/fil001.svg" />
                    </span>
                  </router-link>
                  <router-link :to="`/lms/tugas-offline/edit/${row.tugas_id}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                    <span class="svg-icon svg-icon-3">
                      <inline-svg src="media/icons/duotune/art/art005.svg" />
                    </span>
                  </router-link>
                  <button @click="deleteData(row.tugas_id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                    <span class="svg-icon svg-icon-3">
                      <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                    </span>
                  </button>
                </div>
              </template>
            </ServerSideTable>
          </div>
        </div>
      </div>
    </div>
  
    <FormModal 
      :mode="formMode"
      :activeData="activeData"
      :dataOption="{guruOption: guruOption, kelasOption: kelasOption, mapelOption: mapelOption}"
      @close="handleClose"
      @submit="handleSubmit" />
  </div>
</template>