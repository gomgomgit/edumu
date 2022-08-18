<script setup>
  import { ref, reactive, onMounted } from "vue";
  import { request } from '@/util'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import FilterSelect from '@/components/filter-select'
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import QueryString from "qs";
  import { useToast } from "vue-toast-notification"
  import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
import moment from "moment";
import FormModal from "./FormModal";
  
  onMounted(() => {
    setCurrentPageBreadcrumbs("Materi File", ['LMS', "Materi Belajar"]);
    getData()
  })

  function getMateriData (payload) {
    request.post('materi', null, {
      params: {
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC',
        sortName: payload?.sort?.type == 'none' ? 'materi_id' : payload?.sort?.field,
        sortOrder: payload?.sort?.type == 'none' ? 'desc'  : payload?.sort?.type,
        mapel: mapelFilter.value,
        kelas: kelasFilter.value,
        user: guruFilter.value
      }
    }).then(res => {
      materiData.rows = res.data.data.data 
      materiData.totalRows = res.data.data.total
    }).catch(err => {
      materiData.rows = []
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

  const guruFilter = ref()
  const kelasFilter = ref()
  const mapelFilter = ref()

  const guruOption = ref([])
  const kelasOption = ref([])
  const mapelOption = ref([])
  
  const tableRef = ref()
  const formMode = ref()
  const activeData = ref()

  const materiData = reactive({
    columns: [
      { label: 'Kelas', field: 'kelas_nama' },
      { label: 'Mapel', field: 'mapel_id' },
      { label: 'Guru', field: 'user_nama', sortable: false },
      { label: 'Judul', field: 'materi_judul', sortable: false },
      { label: 'File', field: 'materi_file', sortable: false },
      { label: 'Tgl Upload', field: 'materi_create_date' },
      { label: 'Status', field: 'materi_status' },
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
      request.post('materi/delete', QueryString.stringify({materi_id: id}))
      .then(res => {
        useToast().success('Data Berhasil Dihapus!')
        getMateriData()
      })
    })
  }
  
  function handleEdit (row) {
    activeData.value = row
    formMode.value = 'Edit Data'
  }
  function handleFormClose (row) {
    activeData.value = {}
    formMode.value = ''
  }
</script>

<template>
<div>
  <div class="card mb-5 mb-xxl-8">
    <div class="card-body pt-5 pb-5">
      <div class="page-content">
        <div class="d-flex flex-wrap justify-content-between align-items-center">
          <div class="d-flex gap-4">
            <h2 class="fs-1 fw-bold py-6">File Materi Belajar</h2>
          </div>

          <div class="position-relative d-flex ">
            <button @click="formMode = 'Tambah Data'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <i class="bi bi-plus fs-1"></i>
              <span>
                Tambah File
              </span>
            </button>
            <!-- <router-link to="/lms/materi-belajar/file/tambah" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <i class="bi bi-plus fs-1"></i>
              <span>
                Tambah File
              </span>
            </router-link> -->
          </div>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div class="d-flex gap-4">
            <div>
              <FilterSelect searchable v-model:filterValue="guruFilter" placeholder="Pilih Guru" @changeFilter="getMateriData()">
                <el-option
                  v-for="guru in guruOption"
                  :key="guru.user_id"
                  :label="guru.user_nama"
                  :value="guru.user_id"
                />
              </FilterSelect>
            </div>
            <div>
              <FilterSelect v-model:filterValue="kelasFilter" placeholder="Pilih Kelas" @changeFilter="getMateriData()">
                <el-option
                  v-for="kelas in kelasOption"
                  :key="kelas.kelas_id"
                  :label="kelas.kelas_nama"
                  :value="kelas.kelas_id"
                />
              </FilterSelect>
            </div>
            <div>
              <FilterSelect v-model:filterValue="mapelFilter" placeholder="Pilih Mapel" @changeFilter="getMateriData()">
                <el-option
                  v-for="mapel in mapelOption"
                  :key="mapel.mapel_id"
                  :label="mapel.mapel_nama"
                  :value="mapel.mapel_id"
                />
              </FilterSelect>
            </div>
          </div>
        </div>
        <div class="mb-5 mb-xxl-8">
          <ServerSideTable
            ref="tableRef"
            :totalRows="materiData.totalRows || 0"
            :columns="materiData.columns"
            :rows="materiData.rows"
            :sort-options="{
              enabled: true,
              initialSortBy: {field: 'materi_id', type: 'desc'}
            }"
            @loadItems="getMateriData"
          >
            <template #table-row="{column, row}">
              <div v-if="column.field == 'mapel_id'">
                {{row.mapel_nama}}
              </div>
              <div v-if="column.field == 'materi_status'">
                <span :class="'badge badge-light-' + (row.materi_status == 1 ? 'success' : 'danger')">{{row.materi_status == 1 ? 'Aktif' : 'Non Aktif'}}</span>
              </div>
              <div v-if="column.field == 'materi_create_date'">
                {{dateFormating(row.materi_create_date)}}
              </div>
              <div v-if="column.field == 'action'">
                <button @click="handleEdit(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </button>
                <!-- <router-link :to="`/lms/materi-belajar/file/edit/${row.materi_id}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </router-link> -->
                <button @click="deleteData(row.materi_id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
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
    @close="handleFormClose"
    @submit="tableRef.loadItems()" />
</div>
</template>