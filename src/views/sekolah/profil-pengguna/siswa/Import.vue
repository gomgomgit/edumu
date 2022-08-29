<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import QueryString from 'qs';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';
import FileDrop from '@/components/file-dropzone/Index.vue';
import { useStore } from 'vuex';

import * as XLSX from 'xlsx';

onMounted(() => {
  setCurrentPageBreadcrumbs("Import Data Siswa", ['Sekolah', 'Profil Pengguna', 'Siswa']);
  getData()
})

const store = useStore()
const userId = store.getters.currentUser.user_id 

const router = useRouter()

const kelasOption = ref()

const form = reactive({
  status_import: '',
  kelas_id: '',
  file: null,
})

function getData() {
  request.post('kelas', null).then(res => {
    kelasOption.value = res.data.data
  })
}

function postData() {
  const formData = new FormData()
  formData.append('status_import', form.status_import)
  formData.append('kelas_id', form.kelas_id)
  formData.append('user_id', userId)
  formData.append('file', form.file)

  request.post('data/import', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
    useToast().success('Data berhasil Di import!')
    router.push('/sekolah/profil-pengguna/siswa')
  })
}

function generate() {
    if (form.status_import == 'import_rfid') {
      generateRfid()
    }
    if (form.status_import == 'import_data') {
      generateData()
    }
    // var namaKelas = kelasOption.value.find(kls => kls.kelas_id == form.kelas_id).kelas_nama
    // var dataItems = [
    //     ["NO","NIS","NISN","TAHUN ANGKATAN","NAMA SISWA","JK SISWA L/P","TEMPAT LAHIR","TANGGAL LAHIR","ALAMAT SISWA","WALI","JK WALI L/P","ALAMAT WALI","TELEPON","CARD","USER WALI","PASS WALI","USER SISWA","PASS SISWA","KELAS"],
    //     ["no","siswa_nis","siswa_nisn","siswa_tahun","siswa_nama","siswa_gender","siswa_tempat_lahir","siswa_tanggal_lahir","siswa_alamat","wali_nama","wali_gender","wali_alamat","wali_nohp","siswa_rfid","wali_username","wali_password","siswa_username","siswa_password","kelas"],
    //     ["","","","","","","","","","","","","","","","","","",namaKelas]
    //   ]
    // var rfidItems = [
    //     ['No',	'siswa_id',	'user_nama', 'siswa_nisn',	'kelas_nama',	'user_status',	'siswa_rfid'],
    //     ['1',	'143', 'Adi', '7661234', namaKelas,	'Aktif', '407']
    //   ]

    // if (form.status_import == 'import_rfid') var items = rfidItems; var name = 'Format Import RFID Siswa.xlsx'
    // if (form.status_import == 'import_data') var items = dataItems; var name = 'Format Import Data Siswa.xlsx'

    // const data = XLSX.utils.aoa_to_sheet(items)
    // const wb = XLSX.utils.book_new()
    // XLSX.utils.book_append_sheet(wb, data, 'kelas')
    // XLSX.writeFile(wb, name)
}
function generateRfid() {
    var namaKelas = kelasOption.value.find(kls => kls.kelas_id == form.kelas_id).kelas_nama
    
    var rfidItems = [
        ['No',	'siswa_id',	'user_nama', 'siswa_nisn',	'kelas_nama',	'user_status',	'siswa_rfid'],
      ]

    request.post("/getdataimportrfid", null, {params: {kelas: form.kelas_id}})
    .then((res) => {
      var result = res.data.data

      result.map((item,i) => {
          rfidItems.push([
              i+1,
              item.siswa_id,
              item.user_nama,
              item.siswa_nisn,
              item.kelas_nama,
              item.user_status === "1" ? "Aktif" : "Non Aktif",
              item.siswa_rfid
          ])
      })
      var items = rfidItems; 
      var name = 'Format Import RFID Siswa.xlsx'

      const data = XLSX.utils.aoa_to_sheet(items)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, data, 'kelas')
      XLSX.writeFile(wb, name)
    })
}
function generateData() {
    var namaKelas = kelasOption.value.find(kls => kls.kelas_id == form.kelas_id).kelas_nama
    var dataItems = [
        [],
        [],
        ["NO","NIS","NISN","TAHUN ANGKATAN","NAMA SISWA","JK SISWA L/P","TEMPAT LAHIR","TANGGAL LAHIR","ALAMAT SISWA","WALI","JK WALI L/P","ALAMAT WALI","TELEPON","CARD","USER WALI","PASS WALI","USER SISWA","PASS SISWA","KELAS"],
        ["no","siswa_nis","siswa_nisn","siswa_tahun","siswa_nama","siswa_gender","siswa_tempat_lahir","siswa_tanggal_lahir","siswa_alamat","wali_nama","wali_gender","wali_alamat","wali_nohp","siswa_rfid","wali_username","wali_password","siswa_username","siswa_password","kelas"],
        ["","","","","","","","","","","","","","","","","","",namaKelas]
      ]

    var items = dataItems; 
    var name = 'Format Import Data Siswa.xlsx'

    const data = XLSX.utils.aoa_to_sheet(items)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, data, 'kelas')
    XLSX.writeFile(wb, name)
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6 m-0">Import Data</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Import</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.status_import" placeholder="Jenis Import">
                <el-option label="Import Data Siswa" value="import_data" />
                <el-option label="Import RFID Siswa" value="import_rfid" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Pilih Kelas</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.kelas_id" filterable clearable placeholder="Select">
                <el-option v-for="kelas in kelasOption" :key="kelas.kelas_id" :label="kelas.kelas_nama"
                  :value="kelas.kelas_id" />
              </el-select>
            </div>
          </div>
        </div>
        <div v-if="!form.kelas_id || !form.status_import" class="mt-4">
          <div>
            <h4 class="text-center text-danger my-5">Harap Pilih Kelas dan Jenis Import!</h4>
          </div>
        </div>
        <div v-if="form.kelas_id && form.status_import" class="d-flex justify-content-end mt-4">
          <div>
            <a @click="generate" class="btn btn-primary d-flex gap-3 align-items-center w-auto">
              <span>
                Generate Excel Format
              </span>
            </a>
          </div>
        </div>
        
        <div class="mt-4" v-if="form.kelas_id && form.status_import">

          <div class="mt-4" v-if="form.status_import">
            <p class="mb-2 fs-4 fw-bold">File Import</p>
            <div v-if="form.status_import == 'import_data'">
              <p class="mb-2">*Tentukan data kelas apa yg anda ingin import, Lalu generate excel format</p>
            </div>
            <div v-if="form.status_import == 'import_rfid'">
              <p class="mb-2">*Generate excel format untuk import RFID</p>
              <p class="mb-2">*Isi Data RFID siswa di kolom RFID</p>
            </div>
            <p class="mb-2">*Pastikan file sesuai formatnya seperti yg anda generate</p>
            <FileDrop v-model:fileInputData="form.file"></FileDrop>
          </div>
          <div class="d-flex justify-content-end gap-4">
            <a @click.prevent="router.push('/sekolah/profil-pengguna/siswa')" href="#" class="btn btn-light">Batal</a>
            <a @click.prevent="postData" class="btn btn-primary">Import</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>