<script setup>
import { reactive, watch } from "vue"
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

const initialForm = { 
  materi_id: '',
  kelas_id: '',
  mapel_id: '',
  user_id: '',
  materi_judul: '',
  materi_status: '',
  materi_file: null,
}

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
  
  const formData = new FormData()
  formData.append('materi_id', form.materi_id)
  formData.append('kelas_id', selectedClass)
  formData.append('mapel_id', form.mapel_id)
  formData.append('user_id', form.user_id)
  formData.append('materi_judul', form.materi_judul)
  formData.append('materi_status', form.materi_status)
  formData.append('materi_file', form.materi_file)
  if (props.activeData) {
    formData.append('materi_tipe', oldFiles.value.split('.').pop())
  }

  const endpoint = props.activeData ? 'materi/edit' : 'materi/add'
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
		:breadcrumb="Array('LMS', 'Materi Belajar', 'Materi File', props.mode)"
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
          
          <ul v-if="activeData?.materi_file">
            <li><a class="fs-4" target="_blank" :href="storagePublic + '/files/' + activeData?.materi_file">{{activeData?.materi_file}}</a></li>
          </ul>
          <FileDrop v-model:fileInputData="form.materi_file"></FileDrop>
        </div>
      </div>
    </div>
	</Modal>
</template>