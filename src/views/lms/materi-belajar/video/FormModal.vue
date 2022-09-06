<script setup>
import { reactive, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";

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

function kelasChange() {
  let selectedClass = ''
  if (form.kelas_id.includes('all')) {
    selectedClass = props.dataOption.kelasOption.map(function (obj) {
      return obj.kelas_id
    })
    form.kelas_id = selectedClass
  }
}
function handleSubmit () {
  // let selectedClass = ''
  // if (form.kelas_id.includes('all')) {
  //   selectedClass = props.dataOption.kelasOption.map(function (obj) {
  //     return obj.kelas_id
  //   })
  // } else {
  //   selectedClass = form.kelas_id
  // }
  
  const formData = new FormData()
  formData.append('materi_id', form.materi_id)
  formData.append('kelas_id', form.kelas_id)
  formData.append('mapel_id', form.mapel_id)
  formData.append('user_id', form.user_id)
  formData.append('materi_judul', form.materi_judul)
  formData.append('materi_status', form.materi_status)
  formData.append('materi_file', form.materi_file)
  formData.append('materi_tipe', 'video')

  const endpoint = props.activeData ? 'video/edit' : 'video/add'
  const message = props.activeData ? 'Data Berhasil Diedit!' : 'Data Berhasil Ditambahkan!'
  request.post(endpoint, formData, {
    headers: {
      'Content-Type' : 'multipart/form-data'
    }
  }).then(res => {
      Object.assign(form, initialForm)
      useToast().success(message)
      emits('submit')
      emits('close')
  })
}

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign(form, { ...activeData, materi_file: 'https://www.youtube.com/watch?v=' + activeData.materi_file, kelas_id: activeData.kelas_id.split(",").map( Number ) }),
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('LMS', 'Materi Belajar', 'Materi Video', props.mode)"
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
            @change="kelasChange()"
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
          <p class="m-0 fs-4 fw-bold">URL Youtube</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-input v-model="form.materi_file" placeholder="Link Materi Youtube" />
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
    </div>
	</Modal>
</template>