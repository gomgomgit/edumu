<script setup>
import { isEmpty } from 'validate.js';
import { computed, reactive, ref, watch } from 'vue'
import qs from 'qs';
import { useToast } from 'vue-toast-notification';

import Modal from '@/components/modals/CustomModal.vue';
import { request } from '@/util';
import Spinner from '@/components/Spinner.vue';

const emit = defineEmits(['closeModal', 'submitData'])

const props = defineProps({
	activeData: { type: Object, default: () => ({}) }
})

const initialForm = {
	start: null,
	end: null
}

const formData = reactive({ ...initialForm })
const isLoading = ref(false)

const isShow = computed(() => !isEmpty(props.activeData))

function prepareForm () {
	Object.assign(formData, {
		start: props.activeData.exam_start_date.replace(' ', 'T').slice(0, props.activeData.exam_start_date.length - 3),
		end: props.activeData.exam_end_date.replace(' ', 'T').slice(0, props.activeData.exam_end_date.length - 3)
	})
}

function handleSubmit () {
	isLoading.value = true
	request.post('setTimePlus', qs.stringify({
		exam_id: props.activeData.exam_id,
		user_id: props.activeData.user_id,
		start: formData.start.replace('T', ' ') + ':00',
		end: formData.end.replace('T', ' ') + ':00',
	})).then(() => {
		useToast().info('Berhasil mengubah jadwal ujian!')
		emit('closeModal')
		emit('submitData')
	}).finally(() => {
		isLoading.value = false
	})
}

function closeModal () {
	emit('closeModal')
}

watch(
	isShow,
	val => val && prepareForm(),
	{ immediate: true }
)
</script>

<template>
	<Modal
		title="Ubah Waktu Ujian"
		:show="isShow"
		@closeModal="closeModal"
		@confirm="handleSubmit"
		@dismiss="closeModal">
		<div v-if="isLoading" class="d-flex justify-content-center py-5">
			<Spinner />
		</div>

		<div v-else class="row gy-6">
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Jadwal Mulai</div>
			<div class="col-8">
				<input
					v-model="formData.start"
					type="datetime-local"
					class="form-control" />
			</div>

			<div class="col-4 d-flex align-items-center fw-bold fs-4">Jadwal Selesai</div>
			<div class="col-8">
				<input
					v-model="formData.end"
					type="datetime-local"
					class="form-control" />
			</div>
		</div>
	</Modal>
</template>