<script setup>
import { onMounted, reactive, ref, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";
import { useStore } from "vuex"

const props = defineProps({
	show: { type: Boolean, required: true },
	data: { type: Object, required: true },
})

const store = useStore()

const userId = store.getters.currentUser.user_id 
const grupIuran = ref([])

const emits = defineEmits(['close', 'submit'])

const initialForm = { pesan: ''}

const form = reactive({...initialForm})

function handleClose () {
	Object.assign(form, {...initialForm})
	emits('close')
}

function handleSubmit () {
	const endpoint = 'pesan/add'
	const message = 'Pesan Ditambahkan!'

	request.post(endpoint, qs.stringify({
    user_id :	userId,
    pesanId :	props.data.id,
    data_id :	props.data.data_id,
    pesan :	form.pesan,
    menu :	props.data.menu,
    type :	props.data.type,
    icon :	props.data.icon,
  })).then(() => {
		Object.assign(form, initialForm)
		useToast().success(message)
		emits('submit')
		emits('close')
	})
}

watch(
	() => props.show,
	show => show && Object.assign(form, { pesan: props.data.text }),
	{ deep: true }
)
</script>

<template>
	<Modal
		title="Pesan Blokir"
		:show="props.show"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
		<div class="">
			<div class="d-flex align-items-center fw-bold fs-4">Pesan Pemblokiran Ujian</div>
			<div class="my-3">
        <el-input v-model="form.pesan" type="textarea" rows="4"/>
			</div>
      <div class="fs-6 text-end text-danger">
        *Pesan ini akan ditampilkan di ujian siswa yg di blokir akses ujiannya.
      </div>
		</div>
	</Modal>
</template>