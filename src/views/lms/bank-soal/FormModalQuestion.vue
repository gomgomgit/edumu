<script setup>
import { reactive, ref, watch } from "vue"
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import CKEditor from '@/components/ckeditor/Index.vue'
import ImageCropper from '@/components/image-cropper/Index.vue'

const props = defineProps({
	mode: { type: String, required: true },
	activeData: { type: Object, required: true },
	guruOption: { type: Array, required: true },
	mapelOption: { type: Array, required: true },
	dataOption: Object
})

const emits = defineEmits(['close', 'submit'])

const initialForm = { 
  'question_id': '',
  'user_id': '',
  'mapel_id': '',
  'question_type': '',
  'question_text': '',
  'image': null,
  'keterangan': [],
}

const form = reactive({...initialForm})

const tagInput = ref()
const oldImage = ref()

function handleClose () {
	Object.assign(form, {...initialForm})
	emits('close')
}

function handleSubmit () {
  const formData = new FormData()
  formData.append('question_id', form.question_id)
  formData.append('user_id', form.user_id)
  formData.append('mapel_id', form.mapel_id)
  formData.append('question_type', form.question_type)
  formData.append('question_text', form.question_text)
  formData.append('event_foto', form.image)
  formData.append('keterangan', form.keterangan.join('#'))

  const endpoint = props.activeData ? 'soal/edit/post' : 'soal/add'
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

function addTag() {
  var tag = tagInput.value
  form.keterangan.push(tag)

  tagInput.value = null
}
function deleteTag(index) {
  form.keterangan.splice(index, 1)
}

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign(form, { ...activeData, image: activeData.question_pict }),
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('LMS', 'Bank Soal', 'Detail Soal', props.mode + ' Soal')"
		:width="'900px'"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
    <div class="d-flex flex-column gap-4">
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Guru</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-select filterable v-model="form.user_id" class="w-100" placeholder="Pilih Guru">
            <template v-for="guru in props.guruOption">
              <el-option :value="guru.user_id" :label="guru.user_nama"></el-option>
            </template>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="col-3 align-items-center d-flex">
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
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Mata Pelajaran</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <el-select filterable v-model="form.mapel_id" class="w-100" placeholder="Pilih Mata Pelajaran">
            <template v-for="mapel in props.mapelOption">
              <el-option :value="mapel.mapel_id" :label="mapel.mapel_nama"></el-option>
            </template>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="col-3 align-items-center d-flex">
          <p class="m-0 fs-4 fw-bold">Pertanyaan</p>
        </div>
        <div class="col-9 align-items-center d-flex gap-4">
          <CKEditor width="100%" v-model:editorValue="form.question_text" />
        </div>
      </div>
      <div class="row">
        <div class="col-3 pt-3">
          <p class="m-0 fs-4 fw-bold">Gambar</p>
        </div>
        <div class="col-9 align-items-center">
          <!-- {{props.activeData?.question_pict ? 'data:image/jpeg;base64,' + activeData.question_pict : null}} -->
          <ImageCropper  v-model:fileInputData="form.image" :oldImage="props.activeData?.question_pict ? 'data:image/jpeg;base64,' + activeData.question_pict : null"/>
        </div>
      </div>
      <div class="row">
        <div class="col-3 pt-3">
          <p class="m-0 fs-4 fw-bold">Tags</p>
        </div>
        <div class="col-9 align-items-center">
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
    </div>
	</Modal>
</template>