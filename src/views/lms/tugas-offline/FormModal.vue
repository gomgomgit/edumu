<script setup>
import { reactive, ref, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import FileDrop from '@/components/file-dropzone/Index.vue';

const props = defineProps({
	mode: { type: String, required: true },
	activeData: { type: Object, required: true },
	dataOption: Object
})

const emits = defineEmits(['close', 'submit'])

const store = useStore()
const currentUser = store.getters.currentUser
const storageUrl = `${process.env.VUE_APP_STORAGE_URL}/${currentUser.sekolah_kode}/apischool/public`;

const initialForm = { 
  materi_id: '',
  kelas_id: '',
  mapel_id: '',
  user_id: '',
  tugas_judul: '',
  tugas_status: '',
  materi_file: null,
}

const fileDatas = ref([])

const oldFiles = ref()

const form = reactive({...initialForm})

function handleClose () {
	Object.assign(form, {...initialForm})
	emits('close')
}

function handleSubmit () {
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

      const endpoint = props.activeData ? 'tugas/update' : 'tugas/create'
      const message = props.activeData ? 'Data Berhasil Diedit!' : 'Data Berhasil Ditambahkan!'
      request.post(endpoint, formData, {
        headers: {
          'Content-Type' : 'multipart/form-data'
        }
      }).then(res => {
          useToast().success(message)
          Object.assign(form, initialForm)
          emits('submit')
          emits('close')
      })
  })
}

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign(form, { ...activeData, kelas_id: activeData.multikelas.split(",").map( Number ) }),
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('LMS', 'Materi Belajar', 'Tugas Offline', props.mode)"
    width="900px"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
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
              v-for="kelas in props.dataOption.kelasOption"
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
              v-for="mapel in props.dataOption.mapelOption"
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
              v-for="guru in props.dataOption.guruOption"
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
          
          <ul v-if="activeData?.tugas_file_nama">
            <li><a class="fs-4" target="_blank" :href="storageUrl + '/files/' + file.tugas_file_nama">{{file.tugas_file_nama}}</a></li>
          </ul>
          <FileDrop :multiple="true" v-model:fileInputData="fileDatas"></FileDrop>
        </div>
      </div>
    </div>
	</Modal>
</template>