<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util'  
import ImageInput from '@/components/image-input/Index.vue'
import QueryString from 'qs';
import { useToast } from 'vue-toast-notification';
import { useRoute, useRouter } from 'vue-router';
import FormKelas from './FormKelas'


onMounted(() => {
  setCurrentPageBreadcrumbs("Edit Siswa", ['Sekolah', "Profil Pengguna", "Siswa"]);
  getDataKelas()
  getDataWali()
  getDataSiswa()
})

const router = useRouter()
const route = useRoute()

const siswaId = route.params.id
const oldFoto = ref('')

const formKelasMode = ref('')
const formData = reactive({
  'kelas_id': '',
  'wali_id': '',
  'user_id': '',
  'siswa_id': '',
  'siswa_nama': '',
  'siswa_nisn': '',
  'siswa_nis': '',
  'siswa_tahun': '',
  'siswa_alamat': '',
  'siswa_provinsi': '',
  'siswa_kota': '',
  'siswa_nohp': '',
  'siswa_gender': '',
  'siswa_tempat_lahir': '',
  'siswa_tanggal_lahir': '',
  'siswa_rfid': '',
  'siswa_username': '',
  'siswa_password': '',
  'siswa_status': '',
  'siswa_foto': '',
})


const kelasData = ref([])
const waliData = ref([])

const fileInput = ref([])

function getDataSiswa() {
  request.post('get_siswa', null, {
    params: {
      level: 'siswa',
      user: siswaId
    }
  }).then(res => {
    const result = res.data.data
    formData.kelas_id = result.kelas_id ?? ''
    formData.wali_id = result.wali_id ?? ''
    formData.user_id = result.user_id ?? ''
    formData.siswa_id = result.siswa_id ?? ''
    formData.siswa_nama = result.user_nama ?? ''
    formData.siswa_nama = result.user_nama ?? ''
    formData.siswa_nisn = result.siswa_nisn ?? ''
    formData.siswa_nis = result.siswa_nis ?? ''
    formData.siswa_tahun = result.siswa_tahun ?? ''
    formData.siswa_alamat = result.siswa_alamat ?? ''
    formData.siswa_provinsi = result.siswa_provinsi ?? ''
    formData.siswa_kota = result.siswa_kota ?? ''
    formData.siswa_nohp = result.siswa_nohp ?? ''
    formData.siswa_gender = result.siswa_gender ?? ''
    formData.siswa_tempat_lahir = result.siswa_tempat_lahir ?? ''
    formData.siswa_tanggal_lahir = result.siswa_tanggal_lahir ?? ''
    formData.siswa_rfid = result.siswa_rfid ?? ''
    formData.siswa_username = result.user_username ?? ''
    formData.siswa_status = result.user_status ?? ''
    
    oldFoto.value = result.user_foto 
  })
}

function getDataKelas() {
  request.post('kelas', null).then(res => {
    kelasData.value = res.data.data
  })
}
function getDataWali() {
  request.post('get_wali', null).then(res => {
    waliData.value = res.data.data
  })
}

function post() {
  const data = new FormData()
  data.append('kelas_id', formData.kelas_id)
  data.append('wali_id', formData.wali_id)
  data.append('user_id', formData.user_id)
  data.append('siswa_id', formData.siswa_id)
  data.append('siswa_nama', formData.siswa_nama)
  data.append('siswa_nisn', formData.siswa_nisn)
  data.append('siswa_nis', formData.siswa_nis)
  data.append('siswa_tahun', formData.siswa_tahun)
  data.append('siswa_alamat', formData.siswa_alamat)
  data.append('siswa_provinsi', formData.siswa_provinsi)
  data.append('siswa_kota', formData.siswa_kota)
  data.append('siswa_nohp', formData.siswa_nohp)
  data.append('siswa_gender', formData.siswa_gender)
  data.append('siswa_tempat_lahir', formData.siswa_tempat_lahir)
  data.append('siswa_tanggal_lahir', formData.siswa_tanggal_lahir)
  data.append('siswa_rfid', formData.siswa_rfid)
  data.append('siswa_username', formData.siswa_username)
  data.append('siswa_password', formData.siswa_password)
  data.append('siswa_status', formData.siswa_status)
  data.append('siswa_foto', formData.siswa_foto)
  
  // request.post('siswa/add', QueryString.stringify(formData), {
  request.post('siswa/edit', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  }).then(res => {
      useToast().success('Data Berhasil Diedit!')
      router.push('/sekolah/profil-pengguna/siswa')
    })
}

function checkTest() {
  console.log(fileInput.value)
}
function handleKelasClose() {
  formKelasMode.value = false
}
function submitAddKelas() {
  useToast().success('Data Kelas Berhasil Ditambahkan!')
  getDataKelas()
}

</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Edit Data Siswa</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row align-items-center">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Kelas</p>
            </div>
            <div class="col-9 align-items-center">
              <div class="row g-4">
                <div class="col-9">
                  <el-select class="w-100" v-model="formData.kelas_id" filterable placeholder="Select">
                    <el-option v-for="kls in kelasData" :key="kls.kelas_id" :label="kls.kelas_nama"
                      :value="kls.kelas_id" />
                  </el-select>
                </div>
                <div class="col-3">
                  <button @click="formKelasMode = true"
                    class="btn btn-primary d-flex gap-3 align-items-center w-auto w-lg-100">
                    <i class="bi bi-plus fs-1 p-0"></i>
                    <span class="d-none d-lg-inline">
                      Tambah Kelas
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="row align-items-center">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Wali</p>
            </div>
            <div class="col-9 align-items-center">
              <div class="row g-4">
                <div class="col-9">
                  <el-select class="w-100" v-model="formData.wali_id" filterable placeholder="Select">
                    <el-option v-for="wali in waliData" :key="wali.wali_id" :label="wali.user_nama"
                      :value="wali.wali_id" />
                  </el-select>
                </div>
                <div class="col-3">
                  <router-link to="/sekolah/profil-pengguna/wali/tambah-data"
                    class="btn btn-primary d-flex gap-3 align-items-center w-auto w-lg-100">
                    <i class="bi bi-plus fs-1 p-0"></i>
                    <span class="d-none d-lg-inline">
                      Tambah Wali
                    </span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Nama Lengkap</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_nama" placeholder="Nama Lengkap" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">NISN</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_nisn" placeholder="NISN" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">No.Induk Siswa</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_nis" placeholder="Nomor Induk Siswa" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Tahun Angkatan</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_tahun" placeholder="Tahun Angkatan" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Alamat</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input
                v-model="formData.siswa_alamat"
                :rows="3"
                type="textarea"
                placeholder="Please input"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Provinsi</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_provinsi" placeholder="Provinsi" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Kota</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_kota" placeholder="Kota" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">No Handphone</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_nohp" placeholder="No Handphone" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Jenis Kelamin</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="formData.siswa_gender" placeholder="Pilih Jenis Kelamin">
                <el-option label="Laki-laki" value="l" />
                <el-option label="Perempuan" value="p" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Tempat Lahir</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_tempat_lahir" placeholder="Tempat Lahir" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Tanggal Lahir</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-date-picker
                v-model="formData.siswa_tanggal_lahir"
                class=""
                type="date"
                placeholder="Pilih Tanggal Lahir"
                size=""
              />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">REF ID KARTU</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_rfid" placeholder="Masukkan REF ID KARTU valid" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Username</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="formData.siswa_username" placeholder="Username" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Password</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input type="password" show-password v-model="formData.siswa_password" placeholder="Password (Biarkan kosong jika tidak ingin mengganti)" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Status Aktif</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="formData.siswa_status" placeholder="Pilih Status Aktif">
                <el-option label="Aktif" value="1" />
                <el-option label="Non Aktif" value="0" />
              </el-select>
            </div>
          </div>
          <div class="d-flex gap-6">
            <div v-if="oldFoto">
              <p class="m-0 fs-4 fw-bold mb-6">Foto Siswa</p>
              <img height="200" width="200"  :src="storagePublic + '/images/siswa/' + oldFoto" alt="">
            </div>
            <div>
              <p class="m-0 fs-4 fw-bold mb-6">Ganti Foto Siswa</p>
              <ImageInput v-model:fileInputData="formData.siswa_foto"></ImageInput>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-4">
            <a href="#" @click.prevent="router.go(-1)" class="btn btn-light">Batal</a>
            <a href="#" @click.prevent="post" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
    
		<FormKelas
			:mode="formKelasMode"
			:activeData="activeData"
			@close="handleKelasClose"
			@submit="submitAddKelas()" />
  </div>
</template>