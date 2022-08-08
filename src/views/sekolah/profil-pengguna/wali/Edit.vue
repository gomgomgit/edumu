<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import ImageInput from '@/components/image-input/Index.vue'
import { useToast } from 'vue-toast-notification';
import { useRoute, useRouter } from 'vue-router';
import QueryString from 'qs';


onMounted(() => {
  setCurrentPageBreadcrumbs("Edit Wali", ['Sekolah', "Profil Pengguna", "Wali"]);
  getDataWali()
})

const router = useRouter()
const route = useRoute()

const waliId = route.params.id

const oldFoto = ref('')

const form = reactive({
  wali_id: '',
  user_id: '',
  wali_nama: '',
  wali_nohp: '',
  wali_alamat: '',
  wali_kota: '',
  wali_provinsi: '',
  wali_gender: '',
  wali_tempat_lahir: '',
  wali_tanggal_lahir: '',
  wali_username: '',
  wali_password: '',
  wali_status: '',
  wali_foto: '',
})

function getDataWali() {
  request.get('wali/' + waliId)
    .then(res => {
      const result = res.data.data
      form.wali_id = result.wali_id
      form.user_id = result.user_id
      form.wali_nama = result.user_nama
      form.wali_nohp = result.wali_nohp
      form.wali_alamat = result.wali_alamat
      form.wali_kota = result.wali_kota
      form.wali_provinsi = result.wali_provinsi
      form.wali_gender = result.wali_gender
      form.wali_tempat_lahir = result.wali_tempat_lahir
      form.wali_tanggal_lahir = result.wali_tanggal_lahir
      form.wali_username = result.user_username
      form.wali_status = result.user_status

      oldFoto.value = result.user_foto
    })
}

function post() {
  const formData = new FormData()
  formData.append('wali_id', form.wali_id)
  formData.append('user_id', form.user_id)
  formData.append('wali_nama', form.wali_nama)
  formData.append('wali_nohp', form.wali_nohp)
  formData.append('wali_alamat', form.wali_alamat)
  formData.append('wali_kota', form.wali_kota)
  formData.append('wali_provinsi', form.wali_provinsi)
  formData.append('wali_gender', form.wali_gender)
  formData.append('wali_tempat_lahir', form.wali_tempat_lahir)
  formData.append('wali_tanggal_lahir', form.wali_tanggal_lahir)
  formData.append('wali_username', form.wali_username)
  formData.append('wali_password', form.wali_password)
  formData.append('wali_status', form.wali_status)
  formData.append('wali_foto', form.wali_foto)
  console.log(QueryString.stringify(formData))
  
  // request.post('siswa/add', QueryString.stringify(formData), {
  request.post('wali/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
  }).then(res => {
      useToast().success('Data Berhasil Diedit!')
      router.push('/sekolah/profil-pengguna/wali')
    })
}

</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Edit Data Wali</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Nama Wali</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.wali_nama" placeholder="Nama Wali" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">No Handphone</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.wali_nohp" placeholder="No Handphone" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Alamat</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input
                v-model="form.wali_alamat"
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
              <el-input v-model="form.wali_provinsi" placeholder="Provinsi" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Kota</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.wali_kota" placeholder="Kota" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Jenis Kelamin</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.wali_gender" placeholder="Pilih Jenis Kelamin">
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
              <el-input v-model="form.wali_tempat_lahir" placeholder="Tempat Lahir" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Tanggal Lahir</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-date-picker
                v-model="form.wali_tanggal_lahir"
                class=""
                type="date"
                placeholder="Pilih Tanggal Lahir"
                size=""
              />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Username</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.wali_username" placeholder="Username" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Password</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input type="password" show-password v-model="form.wali_password" placeholder="Password (Biarkan kosong jika tidak ingin mengganti password)" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Status Aktif</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.wali_status" placeholder="Pilih Status Aktif">
                <el-option label="Aktif" value="1" />
                <el-option label="Non Aktif" value="0" />
              </el-select>
            </div>
          </div>

          <div class="d-flex gap-6">
            <div v-if="oldFoto">
              <p class="m-0 fs-4 fw-bold mb-6">Foto</p>
              <img height="200" width="200" :src="storagePublic + '/images/wali/' + oldFoto" alt="">
            </div>
            <div class="">
              <p class="m-0 fs-4 fw-bold mb-6">Ganti Foto</p>
              <ImageInput v-model:fileInputData="form.wali_foto"></ImageInput>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-4">
            <a href="#" @click.prevent="router.go(-1)" class="btn btn-light">Batal</a>
            <a @click.prevent="post" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>