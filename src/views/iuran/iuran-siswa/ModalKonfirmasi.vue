<script setup>
import { reactive, watch } from "vue"
import qs from 'qs'
import { useToast } from "vue-toast-notification"
import { isEmpty } from "validate.js"

import Modal from "@/components/modals/CustomModal.vue"
import { request } from "@/util";

const props = defineProps({
	imageLink: {type: String, required: true},
	formMode: { type: String, required: true },
	activeData: { type: Object },
})

const emits = defineEmits(['close'])

const initialForm = { payId: props.activeData.payment_id, nominal: '', ptcId: props.activeData.ptc_id}

const formData = reactive({...initialForm})

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign({payId: activeData.payment_id, nominal: '', ptcId: activeData.ptc_id}),
	{ deep: true }
)

function handleClose () {
	Object.assign(formData, {...initialForm})
	emits('close')
}

function handleSubmit () {
  // return console.log(formData)
	const endpoint = 'iuran/validasi/' + props.activeData.payment_id
	request.post(endpoint, qs.stringify(formData)).then(() => {
		Object.assign(formData, initialForm)
		useToast().success('Berhasil Konfirmasi!')
		emits('close')
	})
}
</script>

<template>
	<Modal
		title="Pembayaran"
		:show="props.formMode"
		:breadcrumb="Array('Iuran', 'Iuran Siswa', 'Detail Transaksi', 'Konfirmasi')"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
		<div class="row gy-6">
			<div class="col-12 fw-bold fs-4 text-center">Bukti Pembayaran</div>
			<div class="col-12 text-center">
				<img :src="props.imageLink + '/images/payment/' + activeData.ptc_image" alt="bukti" style="max-width: 70%"> 
			</div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Nominal di Struk</div>
			<div class="col-8">
				<input
					v-model="formData.nominal"
					type="number"
					class="form-control" />
			</div>
		</div>
	</Modal>
</template>