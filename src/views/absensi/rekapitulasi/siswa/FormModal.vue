<script setup>
import { reactive, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import FileDrop from '@/components/file-dropzone/Index.vue';
import moment from "moment"

const props = defineProps({
	mode: { type: String, required: true },
	activeData: { type: Object, required: true },
})

const emits = defineEmits(['close', 'submit'])

const baseUrl = process.env.VUE_APP_API_URL

const initialForm = { 
  siswa_id: '',
  guru_id: '',
  status: '',
  status_izin: '',
  event_mulai: '',
  type: '',
  izin_file: '',
  keterangan: '',
}

const form = reactive({...initialForm})

function handleClose () {
	Object.assign(form, {...initialForm})
	emits('close')
}

function handleSubmit () {
  const formData = new FormData()
  formData.append('siswa_id', form.siswa_id)
  formData.append('presensi_id', form.presensi_id)
  formData.append('status', form.status)
  formData.append('status_izin', form.status_izin)
  formData.append('event_mulai', form.event_mulai)
  formData.append('keterangan', form.keterangan)

  var endpoint = 'edit_presensi_siswa'
  const message = 'Data Berhasil Diedit!'
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

function dateFormating(date, time) {
  return moment(date + ' ' + time).format('YYYY-MM-DD h:mm:ss')
}

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign(form, { ...activeData, event_mulai: dateFormating(activeData.presensi_create_date, activeData.presensi_create_time)}),
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('Absensi', 'Rekapitulasi', 'Siswa', props.mode)"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
    <div class="d-flex flex-column gap-4">
      <div class="row" v-if="form.kelas_id">
        <div class="col-3 d-flex">
          <p class="m-0 fs-4 fw-bold">Kelas</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-input disabled v-model="form.kelas_nama" placeholder="Nama Kelas" />
        </div>
      </div>
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Nama Siswa</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-input disabled v-model="form.user_nama" placeholder="Nama Siswa" />
        </div>
      </div>
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Tanggal</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-input disabled v-model="form.presensi_create_date" placeholder="Tanggal" />
        </div>
      </div>
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Status</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-select class="w-100" v-model="form.status" placeholder="Pilih Status">
            <el-option label="Izin" value="absent" />
            <el-option label="Alpha" value="not_taken" />
          </el-select>
        </div>
      </div>
      <div class="row" v-if="form.status == 'absent'">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Status Izin</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-select class="w-100" v-model="form.status_izin" placeholder="Pilih Status Izin">
            <el-option label="1/2hari" value="1/2 Hari" />
            <el-option label="acara_keluarga" value="Acara Keluarga" />
            <el-option label="sakit" value="Sakit" />
            <el-option label="acara_sekolah" value="Acara Sekolah" />
            <el-option label="lain_lain" value="Lain-Lain" />
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Keterangan</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-input type="textarea" v-model="form.keterangan" placeholder="" />
        </div>
      </div>
      <!-- <div class="row">
        <div class="col-3 pt-3">
          <p class="m-0 fs-4 fw-bold">File Bukti</p>
          <div class="mt-3">
            <p class="m-0 fs-4 fw-bold text-black-50">Note :</p>
            <p class="m-0 fs-4 fw-medium text-black-50">*Format yang di dukung : .doc .docx .xls .xlsx .ppt .pptx .pdf .jpg .jpeg .png</p>
          </div>
        </div>
        <div class="col-9 align-items-center">
          <FileDrop v-model:fileInputData="form.izin_file"></FileDrop>
        </div>
      </div> -->
    </div>
	</Modal>
</template>