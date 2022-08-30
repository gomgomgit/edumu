<script setup>
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from "@/util";
import { onMounted, reactive, ref } from "vue";
import ImageCropper from '@/components/image-cropper/Index.vue'
import CKEditor from '@/components/ckeditor/Index.vue'
import { useToast } from "vue-toast-notification";
import { useRoute, useRouter } from "vue-router";

onMounted(() => {
  setCurrentPageBreadcrumbs(`${pageType == 'edit' && questionId ? 'Edit' : 'Tambah'} Soal`, ['LMS', 'Bank Soal'])
  getData()
})

const router = useRouter()
const route = useRoute()

const questionId = route.params.id
const pageType = route.params.type

const guruOption = ref()
const mapelOption = ref()

const guruFilter = ref()
const mapelFilter = ref()
const tipeFilter = ref()
const searchSoal = ref()

const tagInput = ref()
const oldImage = ref()

const form = reactive({
  'question_id': '',
  'user_id': '',
  'mapel_id': '',
  'question_type': '',
  'question_text': '',
  'image': null,
  'keterangan': [],
})

function getData() {
  request.post("user", null, {
    params: {
      level: 'guru'
    }
  }).then(res => {
    guruOption.value = res.data.data
  })
  request.post("mapel")
  .then(res => {
    mapelOption.value = res.data.data
  })

  if (questionId) {
    request.post("soal/edit", null, {
      params: {
        question_id: questionId
      }
    })
    .then(res => {
      const result = res.data.data

      form.question_id = result.question_id
      form.user_id = result.create_by
      form.mapel_id = result.mapel_id
      form.question_type = result.question_type
      form.question_text = result.question_text

      form.keterangan = result.keterangan.split("#")

      form.image = result.question_pict
      oldImage.value = 'data:image/jpeg;base64,' + result.question_pict
    })  
  }
}

function addTag() {
  var tag = tagInput.value
  form.keterangan.push(tag)

  tagInput.value = null
}
function deleteTag(index) {
  form.keterangan.splice(index, 1)
}

function postSoal() {
  const formData = new FormData()
  formData.append('question_id', form.question_id)
  formData.append('user_id', form.user_id)
  formData.append('mapel_id', form.mapel_id)
  formData.append('question_type', form.question_type)
  formData.append('question_text', form.question_text)
  formData.append('event_foto', form.image)
  formData.append('keterangan', form.keterangan.join('#'))

  request.post(pageType == 'edit' && questionId ? 'soal/edit/post' : 'soal/add', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
      useToast().success(`Data Berhasil ${pageType == 'edit' && questionId ? 'Diedit!' : 'Ditambahkan!'}`)
      router.push('/lms/bank-soal')
  })
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">{{pageType == 'edit' && questionId ? 'Edit' : 'Tambah'}} Pertanyaan</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4"> 
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Nama Guru</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select filterable v-model="form.user_id" class="w-100" placeholder="Pilih Guru">
                <template v-for="guru in guruOption">
                  <el-option :value="guru.user_id" :label="guru.user_nama"></el-option>
                </template>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Tipe Soal</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select filterable v-model="form.question_type" class="w-100" placeholder="Pilih Tipe">
                <el-option value="single" label="Single Option"></el-option>
                <el-option value="essay" label="Essay"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Mata Pelajaran</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select filterable v-model="form.mapel_id" class="w-100" placeholder="Pilih Mata Pelajaran">
                <template v-for="mapel in mapelOption">
                  <el-option :value="mapel.mapel_id" :label="mapel.mapel_nama"></el-option>
                </template>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Pertanyaan</p>
            </div>
            <div class="col-9 align-items-center">
              <CKEditor width="100%" v-model:editorValue="form.question_text" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Gambar</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <ImageCropper  v-model:fileInputData="form.image" :oldImage="oldImage"/>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Tags</p>
            </div>
            <div class="col-9">
              <div class="align-items-center d-flex gap-4">
                <div class="flex-grow-1">
                  <input
                    v-on:keyup.enter="addTag"
                    v-model="tagInput"
                    type="text"
                    placeholder="Ketikkan tag kemudian tekan enter/klik tambahkan tag di samping"
                    class="form-control" />
                </div>
                <div>
                  <a @click.prevent="addTag" class="btn btn-primary">Tambahkan Tag</a>
                </div>
              </div>
              <div v-if="form.keterangan" class="py-2">
                <template v-for="tag, tagindex in form.keterangan">
                  <div class="d-flex gap-4 py-2">
                    <span class="badge badge-success">{{tag}}</span>
                    
                    <button @click="deleteTag(tagindex)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                      <span class="svg-icon svg-icon-3">
                        <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                      </span>
                    </button>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-4 mt-6">
            <a @click.prevent="router.go(-1)" class="btn btn-light">Batal</a>
            <a @click.prevent="postSoal" class="btn btn-primary">Simpan</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>