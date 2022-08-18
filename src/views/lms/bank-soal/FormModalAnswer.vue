<script setup>
import { reactive, watch } from "vue"
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import ImageCropper from '@/components/image-cropper/Index.vue'

const props = defineProps({
	mode: { type: String, required: true },
	activeData: { type: Object, required: true },
	questionId: { type: Number, required: true },
	dataOption: Object
})

const emits = defineEmits(['close', 'submit'])

const initialForm = { 
  option_id: '',
  option_text: '',
  score: '',
  option_pict: null,
}

const form = reactive({...initialForm})

function handleClose () {
	Object.assign(form, {...initialForm})
	emits('close')
}

function handleSubmit () {
  const formData = new FormData()
  formData.append('question_id', props.questionId)
  formData.append('option_id', form.option_id)
  formData.append('option_text', form.option_text)
  formData.append('checkbox', form.score)
  formData.append('event_foto', form.option_pict)

  const endpoint = props.activeData ? 'edit_post_jawaban_soal' : 'tambah_jawaban_soal'
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
	activeData => !isEmpty(activeData) && Object.assign(form, { ...activeData }),
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('LMS', 'Bank Soal', 'Detail Soal', props.mode + ' Jawaban')"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
    <div class="d-flex flex-column gap-4">
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Jawaban</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-input v-model="form.option_text" placeholder="Jawaban" />
        </div>
      </div>
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Jawaban Benar</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <div class="col-8">
            <div class="form-check form-check-inline">
              <input
                v-model="form.score"
                class="form-check-input"
                type="radio"
                id="mapel-status-1"
                :value="true">
              <label class="form-check-label" for="mapel-status-1">Benar</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                v-model="form.score"
                class="form-check-input"
                type="radio"
                id="mapel-status-0"
                :value="false">
              <label class="form-check-label" for="mapel-status-0">Salah</label>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-3 pt-3">
          <p class="m-0 fs-4 fw-bold">Gambar</p>
        </div>
        <div class="col-9 align-items-center">
          <ImageCropper  v-model:fileInputData="form.option_pict" :oldImage="activeData?.option_pict ? 'data:image/jpeg;base64,' + activeData.option_pict : null"/>
        </div>
      </div>
    </div>
	</Modal>
</template>