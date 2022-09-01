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
})

const emits = defineEmits(['close', 'submit'])

const initialForm = { shift_id: null, start: null, end: null, name: null }

const formData = reactive({...initialForm})

function handleClose () {
	Object.assign(formData, {...initialForm})
	emits('close')
}

function handleSubmit () {
	const endpoint = isEmpty(props.activeData) ? 'shift/add' : 'shift/edit'
	const message = isEmpty(props.activeData) ? 'Ditambahkan!' : 'Diubah!'

	request.post(endpoint, qs.stringify(formData)).then(() => {
		Object.assign(formData, initialForm)
		useToast().success('Data Berhasil ' + message)
		emits('submit')
		emits('close')
	})
}

watch(
	() => props.activeData,
	activeData => !isEmpty(activeData) && Object.assign(formData, { start: activeData.start, end: activeData.end, name: activeData.name, shift_id: activeData.id }),
	{ deep: true }
)
</script>

<template>
	<Modal
		:title="props.mode"
		:show="props.mode"
		:breadcrumb="Array('Absensi', 'waktu Absensi', props.mode)"
		@closeModal="handleClose"
		@confirm="handleSubmit"
		@dismiss="handleClose">
		<div class="row gy-6">
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Nama Shift</div>
			<div class="col-8">
				<input
					v-model="formData.name"
					type="text"
					class="form-control" />
			</div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Jam Masuk</div>
			<div class="col-8">
				<el-time-picker
					v-model="formData.start"
					arrow-control
					format="HH:mm"
					value-format="HH:mm"
					placeholder="Jam Masuk"
				/>
			</div>
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Jam Pulang</div>
			<div class="col-8">
				<el-time-picker
					v-model="formData.end"
					arrow-control
					value-format="HH:mm"
					format="HH:mm"
					placeholder="Jam Pulang"
				/>
			</div>
		</div>
	</Modal>
</template>