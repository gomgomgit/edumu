<script setup>
import { nextTick, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

import Spinner from '@/components/Spinner.vue'

import useQuestionsData from './composables/useQuestionsData.js'
import EditorModal from './components/EditorModal.vue'
import AddQuestionWrapperModal from './components/AddQuestionWrapperModal.vue'
// import AttachmentModal from './components/AttachmentModal.vue'
import QuestionSingle from './components/QuestionSingle.vue'
import QuestionMulti from './components/QuestionMulti.vue'
import QuestionEssay from './components/QuestionEssay.vue'
import QuestionMatch from './components/QuestionMatch.vue'
import swalConfig from './constants/swalConfig'
import { useToast } from 'vue-toast-notification'

const router = useRouter()
const route = useRoute()

const {
	guruOption, mapelOption, questionsData, isNoQuestion, isLoading, isChanged, isSaving, questionTypeLabels,
	getData, addQuestion, removeQuestion, loadQuestionsData, cacheQuestionsData, submitQuestionsData, resetQuestionsData, resolveOrderNumber
} = useQuestionsData()

const questionComponentMap = {
	single: QuestionSingle,
	multi: QuestionMulti,
	essay: QuestionEssay,
	match: QuestionMatch,
}

const editorData = ref({})
const wrapperRefs = ref([])
const isShowAddQuestion = ref(false)
const lastCached = ref(new Date())

function getTypeLabel (questionType) {
	return questionTypeLabels.find(type => type.key === questionType)
}

function handleAction (type, wrapperIndex) {
	switch (type) {
		case 'remove': removeQuestion(wrapperIndex, questionsData.question_types[wrapperIndex].questions.length - 1); break
		case 'add': addQuestion(wrapperIndex, questionsData.question_types[wrapperIndex].questions.length - 1); break
	}

	nextTick(() => {
		const el = wrapperRefs.value[wrapperIndex]
		el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
	})
}

async function handleSubmit () {
	await submitQuestionsData()
}

const examIdParam = computed(() => route.params?.exam_id)

watch(
	examIdParam,
	function (examId) {
		resetQuestionsData()
		loadQuestionsData(examId)
	},
	{ immediate: true }
)

onMounted(() => {
	getData()
})
</script>

<template>
  <div>
    <div class="card mb-5 mb-xxl-8">
      <div class="card-body py-6">
        <div>
          <h2 class="fs-1 fw-bold py-6">{{pageType == 'edit' && questionId ? 'Edit' : 'Tambah'}} Soal</h2>
        </div>
        <div class="separator border-black-50 border-2 my-6"></div>
        <div class="d-flex flex-column gap-4"> 
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Nama Guru</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select filterable v-model="questionsData.create_by" class="w-100" placeholder="Pilih Guru">
                <template v-for="guru in guruOption">
                  <el-option :value="guru.user_id" :label="guru.user_nama"></el-option>
                </template>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="col-3 pt-3">
              <p class="m-0 fs-4 fw-bold">Mata Pelajaran</p>
            </div>
            <div class="col-9 align-items-center d-flex gap-4">
              <el-select filterable v-model="questionsData.mapel_id" class="w-100" placeholder="Pilih Mata Pelajaran">
                <template v-for="mapel in mapelOption">
                  <el-option :value="mapel.mapel_id" :label="mapel.mapel_nama"></el-option>
                </template>
              </el-select>
            </div>
          </div>
				</div>

        <div class="separator border-black-50 border-2 my-6"></div>
				<div id="soal-ujian" class="pt-5">
					<div v-if="isLoading" class="my-10 d-flex justify-content-center align-items-center">
						<Spinner />
					</div>

					<div v-else>
						<header class="d-flex justify-content-between align-items-start mb-10">
							<div>
								<h2>Buat Soal Manual</h2>
								<div class="text-muted">Buat soal dan jawaban apda editor text</div>
							</div>
							<div class="d-flex gap-4">
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
								:ref="templateRef => wrapperRefs[wrapperIndex] = templateRef"
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

											<!-- <div class="py-3 px-8 rounded-3 fw-bold bg-light">
												Bobot Soal Manual
											</div> -->
										</div>
									</div>

									<div class="d-flex gap-6">
										<button
											class="btn btn-primary"
											@click="editorData = questionsWrapper">
											<i class="fas fa-list me-1"></i>
											EDITOR
										</button>

										<div class="question-action">
											<el-tooltip
												class="box-item"
												effect="light"
												content="Hapus Soal Terakhir"
												placement="top-end">
												<div class="question-remove" role="button" @click="handleAction('remove', wrapperIndex)">
													<img src="figma-icon/question-remove.png" alt="" />
												</div>
											</el-tooltip>
											<el-tooltip
												class="box-item"
												effect="light"
												content="Tambah Soal"
												placement="bottom-end">
												<div class="question-add" role="button" @click="handleAction('add', wrapperIndex)">
													<img src="figma-icon/question-add.png" alt="" />
												</div>
											</el-tooltip>
										</div>
									</div>
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
							<div class="col-3">
								<!-- <button
									class="btn btn-secondary btn-lg w-100"
									@click="handleBack">
									<i class="fas fa-angle-double-left me-2"></i>
									Kembali
								</button> -->
							</div>
							<div class="col-3 offset-6">
								<div
									v-if="isSaving"
									class="d-flex justify-content-center">
									<Spinner />
								</div>
								<button
									v-else
									class="btn btn-primary btn-lg w-100"
									@click="handleSubmit">
									Simpan Soal
								</button>
							</div>
						</div>

						<EditorModal
							v-bind="{ editorData }"
							@close-modal="editorData = {}" />

						<AddQuestionWrapperModal
							:show="isShowAddQuestion"
							@close-modal="isShowAddQuestion = false" />

						<AttachmentModal />
					</div>
				</div>
			</div>
		</div>
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
	cursor: text;
}

#soal-ujian .question-action {
	width: 50px;
	height: 50px;
	position: relative;
	transform: rotate(-45deg);
	/* background: slateblue; */
}

#soal-ujian .question-remove {
	width: 50px;
	height: 25px;
	cursor: pointer;
	overflow: hidden;
	transform-origin: bottom;
	transition: transform ease .25s;
	/* background: khaki; */
}

#soal-ujian .question-remove img {
	transform: rotate(45deg);
	position: relative;
	width: 35px;
	top: 4px;
	left: 8px;
}

#soal-ujian .question-add {
	width: 50px;
	height: 25px;
	cursor: pointer;
	overflow: hidden;
	transform-origin: top;
	transition: transform ease .25s;
	/* background: salmon; */
}

#soal-ujian .question-add img {
	transform: rotate(45deg);
	position: relative;
	width: 35px;
	bottom: 13px;
	left: 7.3px;
}

#soal-ujian .question-action :where(.question-add, .question-remove):hover {
	transform: scale(1.2);
}
</style>