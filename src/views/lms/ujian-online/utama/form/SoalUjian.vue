<script setup>
import { onMounted, ref } from 'vue'

import useQuestionsData from './composables/useQuestionsData.js'
import EditorModal from './components/EditorModal.vue'
import AddQuestionWrapperModal from './components/AddQuestionWrapperModal.vue'
import QuestionSingle from './components/QuestionSingle.vue'
import QuestionMulti from './components/QuestionMulti.vue'
import QuestionEssay from './components/QuestionEssay.vue'
import QuestionMatch from './components/QuestionMatch.vue'

const { questionsData, isNoQuestion, questionTypeLabels, loadQuestionsData, cacheQuestionsData } = useQuestionsData()

const questionComponentMap = {
	single: QuestionSingle,
	multi: QuestionMulti,
	essay: QuestionEssay,
	match: QuestionMatch,
}

const editorData = ref({})
const isShowAddQuestion = ref(false)

function resolveOrderNumber (wrapperIndex, questionIndex) {
	const previousWrapperLastNumber = questionsData.question_types
		.slice(0, wrapperIndex)
		.reduce((acc, curr) => acc + curr.questions.length, 0)

	const previousNumber = wrapperIndex === 0 ? 0 : previousWrapperLastNumber
	const currentNumber = questionIndex + 1

	return previousNumber + currentNumber
}

function getTypeLabel (questionType) {
	return questionTypeLabels.find(type => type.key === questionType)
}

onMounted(() => {
	loadQuestionsData(46)
})
</script>

<template>
	<div id="soal-ujian" class="pt-5">
		<header class="d-flex justify-content-between align-items-start mb-10">
			<div>
				<h2>Buat Soal Manual</h2>
				<div class="text-muted">Buat soal dan jawaban apda editor text</div>
			</div>
			<div class="d-flex gap-4">
				<button class="btn btn-success" onclick="alert('in development')">
					<i class="fas fa-book me-1"></i>
					Ambil Soal
				</button>
				<button
					class="btn btn-primary pulse-white"
					:class="{ pulse: isNoQuestion }"
					@click="isShowAddQuestion = true">
					<span v-if="isNoQuestion" class="pulse-ring"></span>
					<i class="fas fa-plus me-1"></i>
					Tambah Bentuk Soal
				</button>
			</div>
		</header>

		<div
			v-if="isNoQuestion"
			class="d-flex flex-column align-items-center gap-5 py-10">
			<h2>Belum ada soal yang dibuat</h2>
			<img src="figma-icon/no-data.png">
		</div>

		<div class="d-flex flex-column gap-15">
			<section
				v-for="(questionsWrapper, wrapperIndex) in questionsData.question_types"
				:key="wrapperIndex"
				class="border border-2 rounded-3 px-5 pb-6 questions-wrapper">
				<header class="d-flex justify-content-between align-items-center bg-white py-8 questions-wrapper-header">
					<div class="d-flex align-items-center">
						<div class="fw-bold fs-5 me-20">
							Tipe Soal
						</div>
						<div class="d-flex align-items-center gap-10">
							<div class="border border-2 border-secondary py-3 px-4 rounded-3 fw-bolder">
								{{ getTypeLabel(questionsWrapper.question_type).title }}
								<span class="bg-dark p-1 rounded-2 ms-10">
									<i
										:class="getTypeLabel(questionsWrapper.question_type).icon"
										class="fas fa-fw text-white"></i>
								</span>
							</div>
							<div
								v-if="['single', 'multi'].includes(questionsWrapper.question_type)"
								class="py-3 px-8 rounded-3 fw-bold bg-light">
								{{ questionsWrapper.optionCount}} Opsi
							</div>
							<div class="py-3 px-8 rounded-3 fw-bold bg-light">
								Bobot Soal Manual
							</div>
						</div>
					</div>
					<button
						class="btn btn-primary"
						@click="editorData = questionsWrapper">
						<i class="fas fa-list me-1"></i>
						EDITOR
					</button>
				</header>

				<hr class="border border-light opacity-100 mb-8 mt-0">

				<div class="d-flex flex-column gap-8">
					<template v-for="(question, questionIndex) in questionsWrapper.questions" :key="question.question_id">
						<component
							v-if="questionComponentMap.hasOwnProperty(questionsWrapper.question_type)"
							:is="questionComponentMap[questionsWrapper.question_type]"
							:order-number="resolveOrderNumber(wrapperIndex, questionIndex)"
							v-bind="{ question, wrapperIndex, questionIndex }" />
					</template>
				</div>
			</section>
		</div>

		<div class="row mt-8">
			<div class="col-3 offset-9">
				<button
					class="btn btn-primary btn-lg w-100"
					@click="cacheQuestionsData(true)">
					SELANJUTNYA
					<i class="fas fa-angle-double-right ms-2"></i>
				</button>
			</div>
		</div>

		<EditorModal
			v-bind="{ editorData }"
			@close-modal="editorData = {}" />

		<AddQuestionWrapperModal
			:show="isShowAddQuestion"
			@close-modal="isShowAddQuestion = false" />
	</div>
</template>

<style>

#soal-ujian .questions-wrapper {
	max-height: 90vh !important;
	overflow-y: scroll;
	overflow-x: hidden;
}
#soal-ujian .questions-wrapper-header {
	position: sticky;
	top: 0;
	z-index: 5;
}
#soal-ujian .question-editor {
	min-height: 140px;
}
#soal-ujian .option-editor {
	min-height: 35px;
}
#soal-ujian .pulse-ring {
	left: 6.5px;
	top: 2px;
}
#soal-ujian .option-editor.form-control,
#soal-ujian .question-editor.form-control {
	font-weight: normal;
	font-size: 1em;
	color: #333;
	padding: 12px 8px 0 !important;
}
</style>