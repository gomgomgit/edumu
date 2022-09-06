<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import { Plus } from '@element-plus/icons-vue'
import QueryString from 'qs';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';

onMounted(() => {
  setCurrentPageBreadcrumbs("Tambah Guru", ['Sekolah', "Profil Pengguna", "Guru"]);
})

const router = useRouter()

const form = reactive({
  guru_nama: '',
  guru_nip: '',
  guru_rfid: '',
  guru_username: '',
  guru_password: '',
  guru_status: '',
})

function post() {
  request.post('guru/add', QueryString.stringify(form))
  .then(res => {
    useToast().success('Data berhasil ditambahkan!')
    router.push('/sekolah/profil-pengguna/guru')
  })
}

</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Tambah Data Guru</h2>
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
              <el-input type="password" show-password v-model="form.guru_password" placeholder="Masukkan Password" />
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