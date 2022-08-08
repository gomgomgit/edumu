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
import Swal from "sweetalert2";

  onMounted(() => {
    setCurrentPageBreadcrumbs("Siswa", ['Sekolah', "Profil Pengguna"]);
    getKelas()
  })
  
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
  const kelasFilter = ref('')

  const kelasOption = ref([])

  const passwordModal = ref(false)
  const passwordData = ref([])

  
  function getDataExportSiswa (payload) {
    request.post('exportsiswa', null, {
      params: {
        level: 'siswa',
        cari: searchSiswa.value,
        kelas: kelasFilter.value,
      }
    }).then(res => {
      dataExport.value = res.data.data
      exportSiswa()
    }).catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Tidak Ada Data!'
      })
    })
  }
  
  function getSiswa (payload) {
    request.post('user', null, {
      params: {
        level: 'siswa',
        cari: searchSiswa.value,
        kelas: kelasFilter.value,
        page: payload?.page ?? 1,
        sortby: payload?.sort?.type ?? 'ASC'
      }
    }).then(res => {
      siswa.rows = res.data.data.data
      siswa.totalRows = res.data.data.total
    })
  }

  function getKelas () {
    request.post('kelas')
    .then(res => {
      kelasOption.value = res.data.data
    })
  }

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
    let row = [["No","NIS","NISN", "Tahun Angkatan", "Nama Siswa", "JK Siswa L/P", "Tempat Lahir", "Tanggal Lahir", "Alamat Siswa", "Wali", "JK Wali L/K", "Alamat Wali", "Telepon", "Card", "User Wali", "Pass Wali", "User Siswa", "Pass Siswa", "Kelas"]]

    dataExport.value.map((item,i) => {
      row.push([
          i+1,
          item.siswa_nis,
          item.siswa_nisn,
          item.siswa_tahun,
          item.nama_siswa,
          item.siswa_gender,
          item.siswa_tempat_lahir,
          item.siswa_tanggal_lahir,
          item.siswa_alamat,
          item.nama_wali,
          item.wali_gender,
          item.wali_alamat,
          item.wali_nohp,
          "",
          item.user_name_wali,
          item.pass_wali,
          item.user_name_siswa,
          item.pass_siswa,
          item.kelas_nama,
      ])
		})

    const data = XLSX.utils.aoa_to_sheet(row)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, data, 'Data Siswa Aktif')

    var fileName = kelasFilter.value ? 'Rekap Data Siswa Aktif-per Kelas-' : 'Rekap Data Siswa Aktif-' 
    XLSX.writeFile(wb, fileName + moment().format("DD-MMMM-YYYY") +".xlsx")
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
            <div class="d-flex w-100 w-lg-50 w-xl-auto gap-4 align-items-center">
                  <el-input
                    v-model="searchSiswa"
                    clearable
                    class="me-n6"
                    placeholder="Cari Siswa"
                    @input="getSiswa()"
                  >
                    <template #append>
                      <el-button aria-disabled="true" class="pe-none" :icon="Search" />
                    </template>
                  </el-input>
                  <FilterSelect v-model:filterValue="kelasFilter" placeholder="Pilih Kelas" @changeFilter="getSiswa()" class="ms-6">
                    <el-option
                      v-for="kelas in kelasOption"
                      :key="kelas.kelas_id"
                      :label="kelas.kelas_nama"
                      :value="kelas.kelas_id"
                    />
                  </FilterSelect>
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
                <a @click="getDataExportSiswa()" class="btn btn-primary d-flex gap-1 align-items-center w-auto">
                  <span>
                    Export Data
                  </span>
                  <i class="bi bi-cloud-arrow-up fs-1"></i>
                </a>
              </div>
              <div class="d-flex align-items-center">
                <router-link to="/sekolah/profil-pengguna/siswa/import-data" class="btn btn-primary d-flex gap-1 align-items-center w-auto">
                  <span>
                    Import Data
                  </span>
                  <i class="bi bi-cloud-arrow-down fs-1"></i>
                </router-link>
              </div>
              <div class="d-flex align-items-center">
                <router-link to="/sekolah/profil-pengguna/siswa/tambah-data" class="btn btn-primary d-flex gap-1 align-items-center w-auto">
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