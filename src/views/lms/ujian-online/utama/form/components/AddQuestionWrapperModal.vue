<script setup>
import { reactive, ref } from 'vue'
import Modal from '@/components/modals/CustomModal.vue'
import useQuestionsData from '../composables/useQuestionsData.js'
import { isEmpty, validate } from 'validate.js';
import { useToast } from 'vue-toast-notification';

const { availableTypes, addQuestionType } = useQuestionsData()

const emit = defineEmits(['closeModal'])

defineProps({
	show: Boolean
})


const tags = ref([])
const tagInput = ref('')

function addTag() {
	tags.value.push(tagInput.value)
	tagInput.value = ''
}

function removeTag(index) {
	tags.value.splice(index, 1)
}


const initialForm = {
	questionType: null,
	optionCount: null,
	keterangan: null,
}

const formData = reactive({...initialForm})

function handleSubmit () {
	const errors = validate(formData, {
		questionType: { presence: { message: 'Bentuk soal tidak boleh kosong!' } },
		optionCount: { presence: formData.questionType === 'essay' ? false : { message: 'Jumlah opsi jawaban tidak boleh kosong!' } },
	}, {
		fullMessages: false,
		format: 'flat'
	})

	if (errors?.length) return useToast().warning(errors[0])

	if (tags.value.length) {
		formData.keterangan = tags.value.join('#')
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
				<el-select v-model="formData.questionType" class="w-100" placeholder="Pilih bentuk soal">
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
					<el-input-number
						v-model="formData.optionCount"
						:min="1"
						:max="10"
						size="large"
						class="w-100" />
				</div>
			</template>

			<div class="col-4 d-flex align-items-center fw-bold fs-4">Label Soal</div>
			<div class="col-8">
				<input
					v-model="tagInput"
					type="text"
					class="form-control"
					placeholder="Tekan enter setelah mengisi label"
					@keyup.enter="addTag" />
			</div>

			<div v-if="tags.length" class="col-8 offset-4">
				<div class="d-flex flex-wrap gap-4">
					<el-tag
						v-for="(tag, index) in tags"
						:key="tag"
						closable
						@close="removeTag(index)">
						{{ tag }}
					</el-tag>
				</div>
			</div>
		</div>
	</Modal>
</template>