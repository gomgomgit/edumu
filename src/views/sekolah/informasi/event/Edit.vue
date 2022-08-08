<script setup>
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import { request } from "@/util";
import { computed, onMounted, reactive, ref } from "vue";
import ImageInput from '@/components/image-input/Index.vue'
import ImageCropper from '@/components/image-cropper/Index.vue'
import CKEditor from '@/components/ckeditor/Index.vue'
import { useToast } from "vue-toast-notification";
import { useRoute, useRouter } from "vue-router";

onMounted(() => {
  setCurrentPageBreadcrumbs('Edit Event', ['Informasi', 'Event'])
  getEvent()
})

const router = useRouter()
const route = useRoute()

const eventId = route.params.id

const categories = ref()
const form = reactive({
  'event_id': '',
  'event_type': '',
  'event_judul': '',
  'event_shortdesc': '',
  'event_desc': '',
  'event_foto': null,
  'event_status': '',
  'event_mulai': '',
  'event_selesai': '',
})

const oldImage = ref('')

function getEvent() {
  request.get('event/' + eventId)
    .then(res => {
      const result = res.data.data

      form.event_id = result.event_id
      form.event_type = result.event_type
      form.event_judul = result.event_judul
      form.event_shortdesc = result.event_shortdesc
      form.event_desc = result.event_desc
      form.event_foto = result.event_foto
      form.event_status = result.event_status
      form.event_mulai = result.event_mulai
      form.event_selesai = result.event_selesai
      
      oldImage.value = result.event_foto
    })
}

function cropImage({ coordinates, canvas }) {
  console.log(coordinates, canvas)
}

function postBerita() {
  const formData = new FormData()
  formData.append('event_id', form.event_id)
  formData.append('event_type', form.event_type)
  formData.append('event_judul', form.event_judul)
  formData.append('event_shortdesc', form.event_shortdesc)
  formData.append('event_desc', form.event_desc)
  formData.append('event_foto', form.event_foto)
  formData.append('event_status', form.event_status)
  formData.append('event_mulai', form.event_mulai)
  formData.append('event_selesai', form.event_selesai)

  request.post('event/edit', formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
      useToast().success('Data Berhasil Diedit!')
      router.push('/sekolah/informasi/event')
  })
}
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">Edit Data Event</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4">
          <div class="row">
            <div class="col-3 d-flex">
              <p class="m-0 fs-4 fw-bold">Tipe</p>
            </div>
            <div class="col-9 align-items-center d-flex">
              <select v-model="form.event_type" class="form-select form-select-solid">
                <option value="event">Event</option>
                <option value="akademik">Akademik</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Judul Event</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.event_judul" placeholder="Judul Event" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Gambar</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <ImageCropper  v-model:fileInputData="form.event_foto" :oldImage="storagePublic + '/images/event/' + oldImage"/>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Deskripsi Singkat</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-input v-model="form.event_shortdesc" type="textarea" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Deskripsi Lengkap</p>
            </div>
            <div class="col-9 align-items-center">
              <CKEditor width="100%" v-model:editorValue="form.event_desc" />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Tanggal Mulai</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-date-picker
                v-model="form.event_mulai"
                type="datetime"
                placeholder="Pilih Tanggal dan Jam"
                value-format="YYYY-MM-DD h:mm:ss"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-3 align-items-center d-flex">
              <p class="m-0 fs-4 fw-bold">Tanggal Selesai</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-date-picker
                v-model="form.event_selesai"
                type="datetime"
                placeholder="Pilih Tanggal dan Jam"
                value-format="YYYY-MM-DD h:mm:ss"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Status Aktif</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <div class="form-check form-check-inline">
                <input
                  v-model="form.event_status"
                  class="form-check-input"
                  type="radio"
                  id="mapel-status-1"
                  :value="1">
                <label class="form-check-label" for="mapel-status-1">Aktif</label>
              </div>
              <div class="form-check form-check-inline">
                <input
                  v-model="form.event_status"
                  class="form-check-input"
                  type="radio"
                  id="mapel-status-0"
                  :value="0">
                <label class="form-check-label" for="mapel-status-0">Non Aktif</label>
              </div>
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