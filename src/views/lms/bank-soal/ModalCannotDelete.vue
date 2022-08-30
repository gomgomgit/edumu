<script setup>
import { reactive, ref, watch } from "vue"
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import CKEditor from '@/components/ckeditor/Index.vue'
import ImageCropper from '@/components/image-cropper/Index.vue'

const props = defineProps({
	show: { type: Boolean, required: true },
	datas: { type: Object, required: true },
})

const emits = defineEmits(['close'])

function handleClose () {
	emits('close')
}

function handleSubmit () {
  emits('close')
}
</script>

<template>
	<Modal
		title="Verifikasi Hapus Soal"
		:show="props.show"
		:width="'950px'"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
    <div class="">
      <div class="mb-4">
        <span class="fs-5">List Soal di bawah ini tidak bisa dihapus karena sudah digunakan untuk ujian ..!</span> 
      </div>
      <div>
        <table class="table">
          <thead>
            <tr class="fw-bold fs-6 text-gray-800">
              <th>No</th>
              <th>Soal</th>
              <th>Tipe</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="data, index in props.datas" :key="index">
              <tr>
                <td>{{index + 1}}</td>
                <td><div v-html="data.question_text"></div></td>
                <td>{{data.question_type}}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
	</Modal>
</template>