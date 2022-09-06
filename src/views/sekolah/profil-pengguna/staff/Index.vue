<script setup>
import { ref, onMounted, reactive } from "vue";
import { request } from '@/util'
import Modal from "@/components/modals/CustomModal.vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import ServerSideTable from '@/components/ServerSideTable.vue'
import FilterSelect from '@/components/filter-select'
import { Search } from '@element-plus/icons-vue'
import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
import QueryString from "qs";
import { useToast } from "vue-toast-notification";
import FormModal from "./formModal"
import ChangePassword from '@/components/change-password/Index.vue'

onMounted(() => {
  setCurrentPageBreadcrumbs("Staff", ['Sekolah', 'Profil Pengguna']);
})

function getPenguna(payload) {
  request.post('user', null, {
    params: {
      level: 'umum',
      cari: searchPengguna.value,
      page: payload?.page ?? 1,
      sortby: payload?.sort?.type ?? 'ASC'
    }
  }).then(res => {
    wali.rows = res.data.data.data
    wali.totalRows = res.data.data.total
  })
}

const formMode = ref('')
const activeData = ref()

const passwordModal = ref(false)
const passwordData = ref([])

const tableRef = ref()

const wali = reactive({
  columns: [
    { label: 'Nama Lengkap', field: 'user_nama' },
    { label: 'Username', field: 'user_username' },
    { label: 'Level', field: 'user_level' },
    { label: 'Status', field: 'user_status' },
    { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
  ],
  rows: [],
  totalRows: 0,
})

const searchPengguna = ref('')

const modalData = ref(false)

const statusOption = [
  {
    value: 1,
    label: 'Aktif',
  },
  {
    value: 0,
    label: 'Non Aktif',
  },
]

function handleFormClose() {
  activeData.value = null
  formMode.value = false
}

function editData(row) {
  activeData.value = row
  formMode.value = 'Edit Pengguna'
}

function deleteData (userId) {
  deleteConfirmation(function() {
      request.post('user/delete/' + userId, QueryString.stringify({
        user_id: userId
      }))
      .then(res => {
        useToast().success('Data Berhasil Dihapus!')
        getPenguna()
      })
  })
}
function handlePasswordOpen(data) {
  console.log('buka')
  passwordModal.value = true
  passwordData.value = data
}
function handlePasswordClose() {
  passwordModal.value = false
  passwordData.value = []
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Data Staff</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div>
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-4">
            <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
              <el-input v-model="searchPengguna" clearable class="m-2" placeholder="Cari Pengguna">
                <template #append>
                  <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                </template>
              </el-input>
            </div>

            <div class="position-relative d-flex w-100 w-lg-auto gap-4 justify-content-end">
              <div class="d-flex align-items-center">
                <button @click="formMode = 'Tambah Pengguna'" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <i class="bi bi-plus fs-1"></i>
                  <span>
                    Tambah Staff
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="my-5 mb-xxl-8">
          <ServerSideTable
            ref="tableRef"
            :key="searchPengguna"
            :totalRows="wali.totalRows || 0"
            :columns="wali.columns"
            :rows="wali.rows"
            @loadItems="getPenguna"
          >
            <template #table-row="{ column, row }">
              <div v-if="column.field == 'user_status'">
                <span
                  :class="'badge badge-light-' + (row.user_status == '1' ? 'success' : 'danger')"
                >
                  {{row.user_status == '1' ? 'Aktif' : 'Non Aktif'}}
                </span>
              </div>
              <div v-if="column.field == 'action'">
                <button @click="editData(row)" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </button>
                <button @click="handlePasswordOpen(row)" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <i class="bi bi-key-fill fs-2"></i>
                  </span>
                </button>
                <button @click="deleteData(row.user_id)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/general/gen027.svg" />
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
			@submit="tableRef.loadItems()" />
    <ChangePassword 
			:passwordModal="passwordModal"
			:passwordData="passwordData"
			@close="handlePasswordClose"
			@submit="handlePasswordClose" />
  </div>
</template>