<script setup>
import { onMounted, reactive, ref } from 'vue'
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from '@/util';
import { Plus } from '@element-plus/icons-vue'
import { UploadProps, UploadUserFile } from 'element-plus'
import QueryString from 'qs';
import FileDrop from '@/components/file-dropzone/Index.vue';
import { useToast } from 'vue-toast-notification';
import { useRoute, useRouter } from 'vue-router';

onMounted(() => {
  setCurrentPageBreadcrumbs(`${pageType == 'edit' && materiId ? 'Edit' : 'Tambah'} Materi File`, ['LMS', 'Materi Belajar', 'Materi File']);
  getData()
})

const baseUrl = process.env.VUE_APP_API_URL
const router = useRouter()
const route = useRoute()

const materiId = route.params.id ?? null
const pageType = route.params.type

const guruOption = ref([])
const kelasOption = ref([])
const mapelOption = ref([])

const oldFiles = ref()

const form = reactive({
  materi_id: '',
  kelas_id: '',
  mapel_id: '',
  user_id: '',
  materi_judul: '',
  materi_status: '',
  materi_file: null,
})

function getData () {
  if (pageType == 'edit' && materiId) {
    request.get(`materi/${materiId}`)
    .then(res => {
      const result = res.data.data

      form.materi_id = result.materi_id
      form.kelas_id = result.kelas_id.split(",").map( Number )
      form.mapel_id = result.mapel_id
      form.user_id = result.user_id
      form.materi_judul = result.materi_judul
      form.materi_status = result.materi_status
      // form.materi_file = result.materi_file
      oldFiles.value = result.materi_file
    })
  }

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
function post() {
  let selectedClass = ''
  if (form.kelas_id.includes('all')) {
    selectedClass = kelasOption.value.map(function (obj) {
      return obj.kelas_id
    })
  } else {
    selectedClass = form.kelas_id
  }
  
  const formData = new FormData()
  formData.append('materi_id', form.materi_id)
  formData.append('kelas_id', selectedClass)
  formData.append('mapel_id', form.mapel_id)
  formData.append('user_id', form.user_id)
  formData.append('materi_judul', form.materi_judul)
  formData.append('materi_status', form.materi_status)
  formData.append('materi_file', form.materi_file)
  if (pageType == 'edit' && materiId) {
    formData.append('materi_tipe', oldFiles.value.split('.').pop())
  }

  const endpoint = pageType == 'edit' && materiId ? 'materi/edit' : 'materi/add'
  const message = pageType == 'edit' && materiId ? 'Data Berhasil Diedit!' : 'Data Berhasil Ditambahkan!'
  request.post(endpoint, formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
      useToast().success(message)
      router.push('/lms/materi-belajar/file')
  })
}

</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">{{pageType == 'edit' && materiId ? 'Edit' : 'Tambah'}} Materi File</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row">
            <div class="col-3 d-flex">
              <p class="m-0 fs-4 fw-bold">Kelas</p>
            </div>
            <div class="col-9 align-items-center d-flex">
              <el-select
                v-model="form.kelas_id"
                multiple
                placeholder="Pilih Kelas"
                style="width: 100%"
                filterable
              >
                <el-option label="Pilih Semua" value="all"
                />
                <el-option
                  v-for="kelas in kelasOption"
                  :key="kelas.kelas_id"
                  :label="kelas.kelas_nama"
                  :value="kelas.kelas_id"
                />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 d-flex">
              <p class="m-0 fs-4 fw-bold">Mata Pelajaran</p>
            </div>
            <div class="col-9 align-items-center d-flex">
              <el-select
                v-model="form.mapel_id"
                placeholder="Pilih Mapel"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="mapel in mapelOption"
                  :key="mapel.mapel_id"
                  :label="mapel.mapel_nama"
                  :value="mapel.mapel_id"
                />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 d-flex">
              <p class="m-0 fs-4 fw-bold">Guru</p>
            </div>
            <div class="col-9 align-items-center d-flex">
              <el-select
                v-model="form.user_id"
                placeholder="Pilih Guru"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="guru in guruOption"
                  :key="guru.user_id"
                  :label="guru.user_nama"
                  :value="guru.user_id"
                />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Judul Materi</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.materi_judul" placeholder="Judul Materi" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Status Materi</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.materi_status" placeholder="Pilih Status">
                <el-option label="Aktif" value="1" />
                <el-option label="Non Aktif" value="0" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">File Materi</p>
              <div class="mt-3">
                <p class="m-0 fs-4 fw-bold text-black-50">Note :</p>
                <p class="m-0 fs-4 fw-medium text-black-50">*Format yang di dukung : .doc .docx .xls .xlsx .ppt .pptx .pdf .jpg .jpeg .png</p>
              </div>
            </div>
            <div class="col-9 align-items-center">
              
              <ul v-if="oldFiles">
                <li><a class="fs-4" target="_blank" :href="storagePublic + '/files/' + oldFiles">{{oldFiles}}</a></li>
              </ul>
              <FileDrop v-model:fileInputData="form.materi_file"></FileDrop>
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