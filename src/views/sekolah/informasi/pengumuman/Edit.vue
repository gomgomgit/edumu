<script setup>
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from "@/util";
import { onMounted, reactive, ref, watch } from "vue";
import ImageInput from '@/components/image-input/Index.vue'
import ImageCropper from '@/components/image-cropper/Index.vue'
import CKEditor from '@/components/ckeditor/Index.vue'
import { useToast } from "vue-toast-notification";
import { useRoute, useRouter } from "vue-router";
import FileDrop from "@/components/file-dropzone/Index.vue"
import { file } from "@babel/types";
import { isEmpty } from "validate.js";

onMounted(() => {
  setCurrentPageBreadcrumbs('Edit Pengumuman', ['Informasi', 'Pengumuman'])
  getKelas()
  getPengumuman()
})

const router = useRouter()
const route = useRoute()
const pengumumanId = route.params.id

const classes = ref()
const form = reactive({
  'kelas_id': '',
  'content_id': '',
  'content_name': '',
  'content_shortdesc': '',
  'content_desc': '',
  'content_image': '',
  'content_status': '',
})

const fileDatas = ref({})

const oldFiles = ref()
const oldImage = ref()

watch(fileDatas, (now, prev) => {
  if (!isEmpty(now)) {
    oldFiles.value = null
  }
}
)
function getKelas() {
  request.post('kelas')
    .then(res => {
      classes.value = res.data.data
    })
}
function getPengumuman() {
  request.get('/pengumuman/' + pengumumanId)
    .then(res=> {
      const result = res.data.data
      form.kelas_id = result.kelas_id.split(",").map( Number )
      form.content_id = result.content_id
      form.content_name = result.content_name
      form.content_shortdesc = result.content_shortdesc
      form.content_desc = result.content_desc
      form.content_image = result.content_image
      form.content_status = result.content_status

      oldImage.value = result.content_image
      oldFiles.value = result.file_content
    })
}

function postBerita() {
  const formData = new FormData()
  formData.append('cat_id', '')
  formData.append('content_id', form.content_id)
  formData.append('kelas_id', form.kelas_id)
  formData.append('content_name', form.content_name)
  formData.append('content_type', 'pengumuman')
  formData.append('content_shortdesc', form.content_shortdesc)
  formData.append('content_desc', form.content_desc)
  formData.append('content_image', form.content_image)
  formData.append('content_status', form.content_status)
  
  formData.append('jumlah_file', fileDatas.value.length)
  Array.from(fileDatas.value).forEach((file, indexFile) => {
    formData.append('file_' + indexFile, file)
  });

  request.post('pengumuman/edit', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
      useToast().success('Data Berhasil Diedit!')
      router.push('/sekolah/informasi/pengumuman')
  })
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Edit Data Pengumuman</h2>
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
              > 
                <el-option
                  v-for="clas in classes"
                  :key="clas.kelas_id"
                  :label="clas.kelas_nama"
                  :value="clas.kelas_id"
                />
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Judul Pengumuman</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.content_name" placeholder="Judul Pengumuman" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Gambar</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <ImageCropper  v-model:fileInputData="form.content_image" :oldImage="storagePublic + '/images/konten/' + oldImage" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Deskripsi Singkat</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.content_shortdesc" type="textarea" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Deskripsi Lengkap</p>
            </div>
            <div class="col-9 align-items-center">
              <!-- <el-input v-model="form.content_desc" type="textarea" /> -->
              <CKEditor width="100%" v-model:editorValue="form.content_desc" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Status Aktif</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <div class="form-check form-check-inline">
                <input
                  v-model="form.content_status"
                  class="form-check-input"
                  type="radio"
                  id="mapel-status-1"
                  :value="1">
                <label class="form-check-label" for="mapel-status-1">Aktif</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  v-model="form.content_status"
                  class="form-check-input"
                  type="radio"
                  id="mapel-status-0"
                  :value="0">
                <label class="form-check-label" for="mapel-status-0">Non Aktif</label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">File Lampiran</p>
            </div>
            <div class="col-9 align-items-center">
              <ul>
                <template v-for="file in oldFiles">
                  <li><a class="fs-4" target="_blank" :href="storagePublic + '/files/' + file.content_file_nama">{{file.content_file_nama}}</a></li>
                </template>
              </ul>
              <FileDrop :multiple="true" v-model:fileInputData="fileDatas"></FileDrop>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-4">
            <a @click.prevent="router.go(-1)" class="btn btn-light">Batal</a>
            <a @click.prevent="postBerita" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>