<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { Sortable } from "sortablejs-vue3";
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

import Spinner from '@/components/Spinner.vue';
import PratinjauHeaderItem from './components/PratinjauHeaderItem.vue';
import useQuestionsData from './composables/useQuestionsData';
import useExamData from './composables/useExamData';
import swalConfig from './constants/swalConfig.js';
import { useToast } from 'vue-toast-notification';

const router = useRouter()
const route = useRoute()

const { isLoading: isLoadingQuestions, isSaving: isSavingQuestions, isChanged: isChangedQuestions, questionsData, loadQuestionsData, submitQuestionsData } = useQuestionsData();
const { isLoading: isLoadingExam, isSaving: isSavingExam, isChanged: isChangedExam, examData, rawExamData, loadExamData, saveExamData } = useExamData();

const mergedQuestions = ref([]);
const isDragging = ref(false);

const getStartDate = computed(() => reformatDate(examData.exam_start_date))
const getEndDate = computed(() => reformatDate(examData.exam_end_date))
const getTotalScore = computed(() => {
	let totalScore = 0;
	for (const wrapper of questionsData.question_types) {
		for (const question of wrapper.questions) {
			totalScore += parseInt(question.score) || 0
		}
	}
	return totalScore
})

const currentTimezone = computed(() => {
	const dateStr = new Date().toTimeString()
	const zoneTypeMap = {
		'(Western Indonesia Time)': 'WIB',
		'(Central Indonesia Time)': 'WITA',
		'(Eastern Indonesia Time)': 'WIT',
	}

	const zoneName = Intl.DateTimeFormat().resolvedOptions().timeZone
	const gmt = 'GMT +' + dateStr.substring(13, 15) + ':00'
	const zoneType = dateStr.substring(17).trim()

	return `${zoneName}, ${zoneTypeMap[zoneType]} (${gmt})`
})

const examTimePercentage = computed(() => {
	if (!examData.exam_time_limit) return 1

	const time = parseInt(examData.exam_time_limit) - 1
	const minutesPerhour = 60
	const percent = Math.ceil((time % minutesPerhour) / minutesPerhour * 100)
	return percent + 1
})

const questionCountByType = computed(() => {
	const label = {
		single: 'PG',
		multi: 'PGK',
		essay: 'essay',
		match: 'pencocokan',
	}
	const res = []

	for (const wrapper of questionsData.question_types) {
		res.push(wrapper.questions.length + ' ' + label[wrapper.question_type])
	}

	return res.join(', ')
})

function reformatDate (val) {
	if (!val) return ''
	const dateObj = new Date(val)
	return dateObj.toLocaleDateString('id-ID', {
		weekday: 'long',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	})
}

async function handleBack() {
	if (isChangedQuestions.value) {
		const res = await Swal.fire(swalConfig)
		if (!res.isConfirmed) return
	}

	isChangedQuestions.value = false
	router.back()
}

function onDragStart(event) {
	if (event) isDragging.value = true
}

function onDragEnd (event) {
	if (!event) return

	isDragging.value = false

	const item = mergedQuestions.value.splice(event.oldIndex, 1)[0];
	mergedQuestions.value.splice(event.newIndex, 0, item);

	mergedQuestions.value = mergedQuestions.value.map((question, index) => ({
		...question,
		ehq_order: index + 1
	}))

	isChangedQuestions.value = true
}

async function submitReorderedQuestions () {
	for (const question of mergedQuestions.value) {
		questionsData
			.question_types[question.originalWrapperIndex]
			.questions[question.originalQuestionIndex]
			.ehq_order = question.ehq_order
	}

	const bypassOrderNumber = true
	await submitQuestionsData(bypassOrderNumber)
}

async function openSubmitPopup () {
	const swalConfirm = Swal.mixin({
		customClass: {
			confirmButton: 'btn btn-lg btn-info',
			denyButton: 'btn btn-lg btn-primary'
		},
		buttonsStyling: false
	})

	const confirmRes = await swalConfirm.fire({
		title: 'Simpan dan Aktifkan Ujian?',
		html: `<p class="lh-lg">Ujian yang telah diaktifkan akan terlihat oleh siswa dan tidak dapat diubah lagi.</p>
			<p class="lh-lg mb-0">Ujian juga dapat diaktifkan melalui halaman daftar ujian</p>`,
		icon: 'question',
		showDenyButton: true,
		confirmButtonText: 'Simpan dan Aktifkan',
		denyButtonText: 'Hanya Simpan',
		// reverseButtons: true,
	})

	if (confirmRes.isDismissed) return

	try {
		await submitReorderedQuestions()

		if (confirmRes.isConfirmed) {
			examData.exam_status = 1
			await saveExamData(route.params.exam_id, true)
		}

		await Swal.fire(
			'SELAMAT!',
			`<div class="lh-lg">${examData.exam_title} berhasil disimpan!</div>`,
			'success'
		)

		router.push('/lms/ujian-online/utama')
	} catch (err) {
		console.log(err)
		useToast().error('terjadi masalah saat menyimpan ujian')
	}
}


const questionsSignature = computed(() => questionsData.exam_id + '-' + questionsData.question_types.length)
const examIdParam = computed(() => route.params?.exam_id)

watch(
	examIdParam,
	function (examId) {
		loadQuestionsData(examId)
		loadExamData(examId)
	},
	{ immediate: true }
)

watch(
	questionsSignature,
	() => {
		const formattedQuestions = []

		for (const originalWrapperIndex in questionsData.question_types) {
			const wrapper = questionsData.question_types[originalWrapperIndex]
			for (const originalQuestionIndex in wrapper.questions) {
				const question = wrapper.questions[originalQuestionIndex]
				formattedQuestions.push({
					...question,
					originalWrapperIndex,
					originalQuestionIndex
				})
			}
		}

		mergedQuestions.value = formattedQuestions
	},
	{ immediate: true, deep: true }
)

/* watchEffect(() => {
	const formattedQuestions = []

	for (const originalWrapperIndex in questionsData.question_types) {
		const wrapper = questionsData.question_types[originalWrapperIndex]
		for (const originalQuestionIndex in wrapper.questions) {
			const question = wrapper.questions[originalQuestionIndex]
			formattedQuestions.push({
				...question,
				originalWrapperIndex,
				originalQuestionIndex
			})
		}
	}

	mergedQuestions.value = formattedQuestions
}) */
</script>

<template>
	<div id="pratinjau-ujian">
		<div v-if="isLoadingExam || isLoadingQuestions" class="my-10 d-flex justify-content-center align-items-center">
			<Spinner />
		</div>

		<div v-else>
			<header class="row mt-6">
				<section class="col-6">
					<div class="border border-2 rounded-3 d-flex h-100">
						<div class="header-section-item-left p-5 d-flex flex-column gap-8">
							<PratinjauHeaderItem
								color="warning"
								icon="uil-atom"
								:content="examData.exam_title" />

							<PratinjauHeaderItem
								color="danger"
								icon="uil-user-circle"
								:content="rawExamData.user_nama" />

							<!-- <section class="d-flex align-items-center">
								<img
									src="https://architecture.ou.edu/wp-content/uploads/2018/07/ANGELAPERSON-1447-300x300.jpg"
									alt="foto guru"
									class="rounded-circle w-40px h-40px me-4 flex-shrink-0">
								<div>Linda Merryana Saputri S.Pd</div>
							</section> -->

							<section class="bg-primary bg-opacity-25 py-3 px-6 rounded-3 text-primary fw-bold align-self-start">
								{{ rawExamData.mapel_nama }}
							</section>
						</div>

						<div class="header-section-item-right p-5 d-flex flex-column gap-8">
							<PratinjauHeaderItem
								color="info"
								icon="uil-edit"
								title="Jumlah Soal"
								:content="mergedQuestions.length + ' Soal'" />

							<PratinjauHeaderItem
								color="success"
								icon="uil-clipboard-notes"
								title="Bentuk Soal"
								:content="questionCountByType" />

							<PratinjauHeaderItem
								color="danger"
								icon="uil-comment-alt-notes"
								title="Total Nilai"
								:content="getTotalScore" />
						</div>
					</div>
				</section>

				<section class="col-6">
					<div class="border border-2 rounded-3 d-flex h-100">
						<div class="header-section-item-left p-5 d-flex flex-column gap-8">
							<section class="d-flex justify-content-between">
								<div class="flex-shrink-0 d-flex flex-column gap-8">
									<PratinjauHeaderItem
										color="primary"
										icon="uil-stopwatch"
										title="Waktu Mulai"
										:content="getStartDate" />

									<PratinjauHeaderItem
										color="info"
										icon="uil-clock"
										title="Waktu Selesai"
										:content="getEndDate" />
								</div>

								<el-progress
									type="circle"
									:percentage="examTimePercentage"
									:stroke-width="10">
									<div class="text-black-50 text-center fs-1 fw-light">{{ examData.exam_time_limit || 0 }}</div>
									<div class="text-black-50 text-center small">menit</div>
								</el-progress>
							</section>

							<section class="d-flex">
								<div class="h-40px w-40px bg-secondary bg-opacity-75 rounded-start d-flex justify-content-center align-items-center flex-shrink-0">
									<i class="uil uil-globe text-muted h1 mb-0"></i>
								</div>
								<div class="h-40px px-3 bg-secondary bg-opacity-25 rounded-end d-flex align-items-center flex-grow-1 text-muted">
									<!-- Jakarta - Indonesia, WIB (GMT +07:00) -->
									{{ currentTimezone }}
								</div>
							</section>
						</div>

						<div class="header-section-item-right p-5 d-flex flex-column gap-8">
							<PratinjauHeaderItem
								color="success"
								icon="uil-users-alt"
								title="Kelas Peserta" />

							<section
								v-if="rawExamData?.kelas?.length"
								class="d-flex flex-wrap gap-3">
								<el-tag
									v-for="kelas in rawExamData.kelas"
									:key="kelas.kelas_id"
									size="small">
									{{ kelas.kelas_nama }}
								</el-tag>
							</section>
						</div>
					</div>
				</section>
			</header>

			<sortable
				v-if="mergedQuestions?.length"
				class="questions-wrapper bg-light rounded-3 px-5 pb-5 mt-8"
				:list="mergedQuestions"
				item-key="question_id"
				:options="{
					animation: 200,
					ghostClass: 'opacity-50',
					handle: '.drag-handle'
				}"
				@start="onDragStart"
				@end="onDragEnd">
				<template #item="{ element }">
					<div class="d-flex gap-5 mt-5" :key="element.question_id">
						<div class="bg-white rounded-3 align-strecth w-70px fs-2 fw-bold text-black-50 d-flex justify-content-center align-items-center flex-shrink-0">
							{{ element.ehq_order }}
						</div>

						<div class="question-item bg-white rounded-3 flex-grow-1 py-4 d-flex">
							<div
								class="flex-grow-1 px-5"
								v-html="element.question_text">
							</div>
							<div class="drag-handle border-start w-70px d-flex align-items-center justify-content-center flex-shrink-0">
								<el-tooltip
									class="box-item"
									effect="light"
									content="tahan dan geser ke atas/bawah"
									placement="top-end">
									<i class="uil uil-arrows-v-alt fs-1"></i>
									<!-- <i class="uil uil-draggabledots fs-1"></i> -->
								</el-tooltip>
							</div>
						</div>
					</div>
				</template>
			</sortable>

			<section class="row mt-8">
				<div class="col-3">
					<button
						class="btn btn-secondary btn-lg w-100"
						@click="handleBack">
						<i class="fas fa-angle-double-left me-2"></i>
						SEBELUMNYA
					</button>
				</div>
				<div class="col-3 offset-6">
					<div v-if="isSavingQuestions || isSavingExam" class="d-flex justify-content-center">
						<Spinner />
					</div>
					<button
						v-else
						class="btn btn-primary btn-lg w-100"
						@click="openSubmitPopup">
						SIMPAN
						<i class="fas fa-angle-double-right ms-2"></i>
					</button>
				</div>
			</section>
		</div>
	</div>
</template>

<style>
#pratinjau-ujian .header-section-item-left {
	width: 62.5%;
	border-right: 2px #EFF2F5 dashed;
}
#pratinjau-ujian .header-section-item-right {
	width: 37.5%;
}
#pratinjau-ujian :where(.el-progress-circle, .el-progress) {
	width: 100px !important;
	height: 100px !important;
}
#pratinjau-ujian .questions-wrapper {
	width: 100%;
	max-height: 70vh;
	overflow-y: scroll;
}
#pratinjau-ujian .question-item {
	min-height: 80px;
}
#pratinjau-ujian .drag-handle {
	cursor: -webkit-grab;
	cursor: grab;
}
.flip-list-move {
	transition: transform 0.5s;
}
</style>