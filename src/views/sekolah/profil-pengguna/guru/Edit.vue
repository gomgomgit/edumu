<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import { Plus } from '@element-plus/icons-vue'
import QueryString from 'qs';
import { useToast } from 'vue-toast-notification';
import { useRoute, useRouter } from 'vue-router';

onMounted(() => {
  setCurrentPageBreadcrumbs("Edit Guru", ['Sekolah', "Profil Pengguna", "Guru"]);
  getDataGuru()
})

const router = useRouter()
const route = useRoute()
const guruId = route.params.id

const form = reactive({
  guru_id: '',
  user_id: '',
  guru_nama: '',
  guru_nip: '',
  guru_rfid: '',
  guru_username: '',
  guru_password: '',
  guru_status: '',
})
function getDataGuru() {
  request.get('guru/' + guruId)
  .then(res => {
    const result = res.data.data
    form.guru_id = result.guru_id
    form.user_id = result.user.user_id
    form.guru_nama = result.user.user_nama
    form.guru_nip = result.guru_nip
    form.guru_rfid = result.guru_rfid
    form.guru_username = result.user.user_username
    form.guru_status = result.user.user_status
  })
}
function post() {
  const formData = new FormData()
  
  formData.append('guru_id', form.guru_id)
  formData.append('user_id', form.user_id)
  formData.append('guru_nama', form.guru_nama)
  formData.append('guru_nip', form.guru_nip)
  formData.append('guru_rfid', form.guru_rfid)
  formData.append('guru_username', form.guru_username)
  formData.append('guru_password', form.guru_password)
  formData.append('guru_status', form.guru_status)
  request.post('guru/edit', formData)
  .then(res => {
    useToast().success('Data berhasil diedit!')
    router.push('/sekolah/profil-pengguna/guru')
  })
}


</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Edit Data Guru</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Nama Guru</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.guru_nama" placeholder="Nama Guru" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">NIP Guru</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.guru_nip" placeholder="NIP Guru" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">REF ID KARTU</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.guru_rfid" placeholder="Masukkan REF ID KARTU valid" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Username</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.guru_username" placeholder="Username" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Password</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input type="password" show-password v-model="form.guru_password" placeholder="Password (Biarkan kosong jika tidak ingin mengganti)" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Status</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.guru_status" placeholder="Pilih Status">
                <el-option label="Aktif" value="1" />
                <el-option label="Non Aktif" value="0" />
              </el-select>
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