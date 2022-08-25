<script setup>
import { reactive, ref, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import FileDrop from '@/components/file-dropzone/Index.vue';
import { useStore } from "vuex"

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
  tugas_id: '',
  kelas_id: '',
  mapel_id: '',
  user_id: '',
  tugas_judul: '',
  tugas_status: '',
  materi_file: null,
}

const fileDatas = ref([])

const files = ref([])

const form = reactive({...initialForm})

function handleClose () {
	Object.assign(form, {...initialForm})
	emits('close')
  files.value = []
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

  const formData = new FormData()
  formData.append('tugas_id', form.tugas_id)
  formData.append('kelas_id', selectedClass)
  formData.append('mapel_id', form.mapel_id)
  formData.append('user_id', form.user_id)
  formData.append('tugas_judul', form.tugas_judul)
  formData.append('tugas_desc', form.tugas_desc)
  formData.append('tugas_due_date', form.tugas_due_date)
  formData.append('tugas_status', form.tugas_status)
  formData.append('tugas_file', files.value.toString())

  const endpoint = props.activeData ? 'tugas/update' : 'tugas/create'
  const message = props.activeData ? 'Data Berhasil Diedit!' : 'Data Berhasil Ditambahkan!'
  request.post(endpoint, formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
      useToast().success(message)
      Object.assign(form, initialForm)
      files.value = []
      emits('submit')
      emits('close')
  })
}

function getData () {
  request.post(`tugas/detail`, null, {
    params: {
      tugas_id: props.activeData.tugas_id
    }
  })
  .then(res => {
    const result = res.data.data.tugas[0]

    form.tugas_id = result.tugas_id
    form.kelas_id = result.kelas_id.split(",").map( Number )
    form.mapel_id = result.mapel_id
    form.user_id = result.user_id
    form.tugas_judul = result.tugas_judul
    form.tugas_desc = result.tugas_desc
    form.tugas_due_date = result.tugas_due_date
    form.tugas_status = result.tugas_status

    result.tugas_file.forEach((file) => {
      files.value.push(file.tugas_file_nama) 
    })
  })
}

function uploadFile(dropfile) {
  console.log(dropfile)
  
  const formFile = new FormData()
  Array.from(dropfile).forEach((file, indexFile) => {
    formFile.append('file' + indexFile, file)
  });
  formFile.append('fitur', 'tugas')
  formFile.append('jumFile', Array.from(dropfile).length)

  request.post('file', formFile, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
    var result = res.data.data
    result.forEach((file) => {
      files.value.push(file.filename) 
    })
  })
}
function deleteFile(index) {
  files.value.splice(index, 1)
}

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && getData(),
	// activeData => !isEmpty(activeData) && Object.assign(form, { ...activeData, kelas_id: activeData.multikelas.split(",").map( Number ) }),
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
          <FileDrop :multiple="true" v-model:fileInputData="fileDatas" :customUpload="true" @customUpload="uploadFile"></FileDrop>
          <div>
              <template v-for="file, fileindex in files" :key="fileindex">
                  <div>
                    <span class="me-3">{{file}}</span>
                    <button @click="deleteFile(fileindex)" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm">
                      <span class="svg-icon svg-icon-3">
                        <inline-svg src="media/icons/duotune/general/gen027.svg"/>
                      </span>
                    </button>
                  </div>
              </template>
          </div>
        </div>
      </div>
    </div>
	</Modal>
</template>