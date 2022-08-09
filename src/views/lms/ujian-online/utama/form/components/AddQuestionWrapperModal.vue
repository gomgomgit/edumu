<script setup>
import { reactive } from 'vue'
import Modal from '@/components/modals/CustomModal.vue'
import useQuestionsData from '../composables/useQuestionsData.js'
import { isEmpty } from 'validate.js';
import { useToast } from 'vue-toast-notification';

const { availableTypes, addQuestionType } = useQuestionsData()

const emit = defineEmits(['closeModal'])

defineProps({
	show: Boolean
})

const initialForm = {
	questionType: null,
	optionCount: null,
}
const formData = reactive({...initialForm})

function handleSubmit () {
	if (Object.values(formData).some(val => isEmpty(val))) {
		return useToast().error('Lengkapi form yang tersedia!')
	}
	addQuestionType(formData)
	Object.assign(formData, initialForm)
	emit('closeModal')
}
</script>

<template>
	<Modal
		title="Tambah Bentuk Soal"
		:show="show"
		@close-modal="emit('closeModal')"
		@dismiss="emit('closeModal')"
		@confirm="handleSubmit">
		<div class="row gy-6">
			<div class="col-4 d-flex align-items-center fw-bold fs-4">Bentuk Soal</div>
			<div class="col-8">
				<el-select v-model="formData.questionType" class="w-100">
					<el-option
						v-for="typeLabel in availableTypes"
						:key="typeLabel.key"
						:label="typeLabel.title"
						:value="typeLabel.key" />
				</el-select>
			</div>

			<template v-if="formData.questionType !== 'essay'">
				<div class="col-4 d-flex align-items-center fw-bold fs-4">Jumlah Opsi Jawaban</div>
				<div class="col-8">
					<input
						v-model="formData.optionCount"
						type="number"
						min="1"
						max="20"
						class="form-control" />
				</div>
			</template>

			<div class="col-4 d-flex align-items-center fw-bold fs-4">Label Soal</div>
			<div class="col-8">
				<input
					type="text"
					class="form-control"
					placeholder="(optional)" />
			</div>
		</div>
	</Modal>
</template>