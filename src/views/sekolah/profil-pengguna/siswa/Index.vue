<script setup>
  import { ref, onMounted, reactive } from "vue";
  import { request } from '@/util'
  import Modal from "@/components/modals/CustomModal.vue";
  import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
  import { deleteConfirmation } from "@/core/helpers/deleteconfirmation";
  import ServerSideTable from '@/components/ServerSideTable.vue'
  import FilterSelect from '@/components/filter-select'
  import { Search } from '@element-plus/icons-vue'
  import QueryString from 'qs';
  import { useToast } from 'vue-toast-notification';
  import ChangePassword from "@/components/change-password/Index.vue";
import * as XLSX from 'xlsx';
import moment from "moment";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Siswa", ['Sekolah', "Profil Pengguna"]);
    getDataExportSiswa()
  })

  function getDataExportSiswa (payload) {
    request.post('exportsiswa', null, {
      params: {
        level: 'siswa',
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      dataExport.value = res.data.data
    })
  }
  
  function getSiswa (payload) {
      request.post('user', null, {
        params: {
          level: 'siswa',
          cari: searchSiswa.value,
          page: payload?.page ?? 1,
          sortby: payload?.sort?.type ?? 'ASC'
        }
      }).then(res => {
        siswa.rows = res.data.data.data
        siswa.totalRows = res.data.data.total
      })
    }
  
  const dataExport = ref([])
  const siswa = reactive({
    columns: [
      { label: 'Nama Lengkap', field: 'user_nama' },
      { label: 'Kelas', field: 'kelas_nama', sortable: false },
      { label: 'Username', field: 'user_username', sortable: false },
      { label: 'NISN', field: 'siswa_nisn', sortable: false },
      { label: 'NIS', field: 'siswa_nis', sortable: false },
      { label: 'ACTION', field: 'action', sortable: false, width: '200px' },
    ],
    rows: [],
    totalRows: 0,
  })

  const searchSiswa = ref('')

  const passwordModal = ref(false)
  const passwordData = ref([])

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

  function deleteData (userId) {
    deleteConfirmation(function() {
       request.post('user/delete/' + userId, QueryString.stringify({
          user_id: userId
        }))
        .then(res => {
          useToast().success('Data Berhasil Dihapus!')
          getSiswa()
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

  function exportSiswa() {
    let row = [["No","Nama Siswa","NISN", "RFID", "Kelas", "Level", "Status", "Nama Wali", "User Wali", "Password Wali"]]

    dataExport.value.map((item,i) => {
      row.push([
        i+1, 
        item.nama_siswa,
        item.siswa_nisn,  
        item.siswa_rfid, 
        item.kelas_nama,
        item.user_level, 
        item.user_status === "1" ? "Aktif" : "Non Aktif", 
        item.nama_wali,
        item.user_name_wali,
        item.pass_wali
      ])
		})

    const data = XLSX.utils.json_to_sheet(row)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, data, 'kelas')
    XLSX.writeFile(wb, "Rekap Data Siswa Aktif-"+ moment().format("DD-MMMM-YYYY") +".xlsx")
  }
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Data Siswa</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div>
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-4">
            <div class="d-flex w-100 w-lg-50 w-xl-25 gap-4">
                <el-input
                  v-model="searchSiswa"
                  clearable
                  class="m-2"
                  placeholder="Cari Siswa"
                >
                  <template #append>
                    <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                  </template>
                </el-input>
            </div>

            <div class="position-relative d-flex flex-wrap gap-4 w-100 w-xl-auto justify-content-end">
              <div class="d-flex align-items-center">
                <router-link to="/absensi/skema-absensi/siswa" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Siswa Absen GPS
                  </span>
                </router-link>
              </div>
              <div class="d-flex align-items-center">
                <a @click="exportSiswa" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Export Data
                  </span>
                  <i class="bi bi-cloud-arrow-up fs-1"></i>
                </a>
              </div>
              <div class="d-flex align-items-center">
                <router-link to="/sekolah/profil-pengguna/siswa/import-data" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <span>
                    Import Data
                  </span>
                  <i class="bi bi-cloud-arrow-down fs-1"></i>
                </router-link>
              </div>
              <div class="d-flex align-items-center">
                <router-link to="/sekolah/profil-pengguna/siswa/tambah-data" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
                  <i class="bi bi-plus fs-1"></i>
                  <span>
                    Tambah Siswa
                  </span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <div class="my-5 mb-xxl-8">
          <ServerSideTable 
            :key="searchSiswa"
            :totalRows="siswa.totalRows || 0" 
            :columns="siswa.columns" 
            :rows="siswa.rows"
            @loadItems="getSiswa">
            <template #table-row="{column, row}">
              <div v-if="column.field == 'action'">
                <router-link :to="'/sekolah/profil-pengguna/siswa/edit-data/' + row.user_id" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2">
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="media/icons/duotune/art/art005.svg" />
                  </span>
                </router-link>
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

    <ChangePassword 
			:passwordModal="passwordModal"
			:passwordData="passwordData"
			@close="handlePasswordClose"
			@submit="handlePasswordClose" />
  </div>
</template>