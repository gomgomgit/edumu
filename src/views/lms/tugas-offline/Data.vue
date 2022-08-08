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
  setCurrentPageBreadcrumbs(`${pageType == 'edit' && tugasid ? 'Edit' : 'Tambah'}  Data Tugas`, ['LMS', 'Tugas Offline']);
  getData()
})

const router = useRouter()
const route = useRoute()

const tugasid = route.params.id ?? null
const pageType = route.params.type

const guruOption = ref([])
const kelasOption = ref([])
const mapelOption = ref([])

const fileDatas = ref([])

const oldFiles = ref()

const form = reactive({
  materi_id: '',
  kelas_id: '',
  mapel_id: '',
  user_id: '',
  tugas_judul: '',
  tugas_status: '',
  materi_file: null,
})

function getData () {
  if (pageType == 'edit' && tugasid) {
    request.post(`tugas/detail`, null, {
      params: {
        tugas_id: tugasid
      }
    })
    .then(res => {
      const result = res.data.data.tugas[0]

      form.materi_id = result.materi_id
      form.kelas_id = result.kelas_id.split(",").map( Number )
      form.mapel_id = result.mapel_id
      form.user_id = result.user_id
      form.tugas_judul = result.tugas_judul
      form.tugas_desc = result.tugas_desc
      form.tugas_due_date = result.tugas_due_date
      form.tugas_status = result.tugas_status
      // form.materi_file = result.materi_file
      oldFiles.value = result.tugas_file
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
  
  const formFile = new FormData()
  Array.from(fileDatas.value).forEach((file, indexFile) => {
    formFile.append('file' + indexFile, file)
  });
  request.post('file', formFile, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
      useToast().success('File Berhasil DiUpload')

      const formData = new FormData()
      formData.append('materi_id', form.materi_id)
      formData.append('kelas_id', selectedClass)
      formData.append('mapel_id', form.mapel_id)
      formData.append('user_id', form.user_id)
      formData.append('tugas_judul', form.tugas_judul)
      formData.append('tugas_desc', form.tugas_desc)
      formData.append('tugas_due_date', form.tugas_due_date)
      formData.append('tugas_status', form.tugas_status)
      formData.append('materi_file', form.materi_file)

      const endpoint = pageType == 'edit' && tugasid ? 'tugas/update' : 'tugas/create'
      const message = pageType == 'edit' && tugasid ? 'Data Berhasil Diedit!' : 'Data Berhasil Ditambahkan!'
      request.post(endpoint, formData, {
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      }).then(res => {
          useToast().success(message)
          router.push('/lms/tugas-offline')
      })
  })
  
}

</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">{{pageType == 'edit' && tugasid ? 'Edit' : 'Tambah'}} Data Tugas</h2>
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
              <p class="m-0 fs-4 fw-bold">Judul Tugas</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.tugas_judul" placeholder="Judul Tugas" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Deskripsi Tugas</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input type="textarea" v-model="form.tugas_desc" placeholder="Deskripsi Tugas" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Batas Pengumpulan</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-date-picker
                v-model="form.tugas_due_date"
                type="datetime"
                placeholder="Pilih Tanggal dan Jam"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Status Tugas</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select class="w-100" v-model="form.tugas_status" placeholder="Pilih Status">
                <el-option label="Aktif" value="1" />
                <el-option label="Non Aktif" value="0" />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">File Tugas</p>
              <div class="mt-3">
                <p class="m-0 fs-4 fw-bold text-black-50">Note :</p>
                <p class="m-0 fs-4 fw-medium text-black-50">*Format yang di dukung : .doc .docx .xls .xlsx .ppt .pptx .pdf .jpg .jpeg .png</p>
              </div>
            </div>
            <div class="col-9 align-items-center">
              <ul>
                <template v-for="file in oldFiles">
                  <li><a class="fs-4" target="_blank" :href="storagePublic + '/files/' + file.tugas_file_nama">{{file.tugas_file_nama}}</a></li>
                </template>
              </ul>
              <FileDrop :multiple="true" v-model:fileInputData="fileDatas"></FileDrop>
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