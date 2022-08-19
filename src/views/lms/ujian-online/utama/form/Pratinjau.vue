<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { Sortable } from "sortablejs-vue3";
import { useRoute, useRouter } from 'vue-router';

import PratinjauHeaderItem from './components/PratinjauHeaderItem.vue';
import useQuestionsData from './composables/useQuestionsData';
import useExamData from './composables/useExamData';
import Spinner from '@/components/Spinner.vue';

const router = useRouter()
const route = useRoute()

const { isLoading: isLoadingQuestions, questionsData, loadQuestionsData } = useQuestionsData();
const { isLoading: isLoadingExam, examData, loadExamData } = useExamData();

const mergedQuestions = ref([]);
const drag = ref(false);

const examTime = 90

const examTimePercentage = computed(() => {
	const time = examTime - 1
	const minutesPerhour = 60
	const percent = Math.ceil((time % minutesPerhour) / minutesPerhour * 100)
	return percent + 1
})

function handleBack() {
	if (!confirm('Data yang anda ubah di halaman ini tidak akan tersimpan. Tetap ke halaman sebelumnya?')) {
		router.back()
	}
}

function onDragEnd (event) {
	if (!event) return

	const item = mergedQuestions.value.splice(event.oldIndex, 1)[0];
	mergedQuestions.value.splice(event.newIndex, 0, item);

	mergedQuestions.value = mergedQuestions.value.map((question, index) => ({
		...question,
		ehq_order: index + 1
	}))
}

watchEffect(() => {
	mergedQuestions.value = questionsData.question_types
		.map(type => type.questions)
		.flat()
		.map((question, index) => ({
			...question,
			ehq_order: index + 1
		}))
})

onMounted(() => {
	loadQuestionsData(route.params.exam_id)
	loadExamData(route.params.exam_id)
})
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
								content="Tryout Kimia Dasar Semester Genap 2022 Kelas IPA" />

							<section class="d-flex align-items-center">
								<img
									src="https://architecture.ou.edu/wp-content/uploads/2018/07/ANGELAPERSON-1447-300x300.jpg"
									alt="foto guru"
									class="rounded-circle w-40px h-40px me-4 flex-shrink-0">
								<div>Linda Merryana Saputri S.Pd</div>
							</section>

							<section class="bg-primary bg-opacity-25 py-3 px-6 rounded-3 text-primary fw-bold align-self-start">
								Kimia Dasar
							</section>
						</div>

						<div class="header-section-item-right p-5 d-flex flex-column gap-8">
							<PratinjauHeaderItem
								color="info"
								icon="uil-edit"
								title="Jumlah Soal"
								content="25 Soal" />

							<PratinjauHeaderItem
								color="success"
								icon="uil-clipboard-notes"
								title="Bentuk Soal"
								content="20 PG, 5 Essay" />

							<PratinjauHeaderItem
								color="danger"
								icon="uil-comment-alt-notes"
								title="Total Nilai"
								content="100" />
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
										content="Rabu, 03/04/2022 09:00" />

									<PratinjauHeaderItem
										color="info"
										icon="uil-clock"
										title="Waktu Selesai"
										content="Kamis, 04/04/2022 12:00" />
								</div>

								<el-progress
									type="circle"
									:percentage="examTimePercentage"
									:stroke-width="10">
									<div class="text-black-50 text-center fs-1 fw-light">{{ examTime }}</div>
									<div class="text-black-50 text-center small">menit</div>
								</el-progress>
							</section>

							<section class="d-flex">
								<div class="h-40px w-40px bg-secondary bg-opacity-75 rounded-start d-flex justify-content-center align-items-center flex-shrink-0">
									<i class="uil uil-globe text-muted h1 mb-0"></i>
								</div>
								<div class="h-40px px-3 bg-secondary bg-opacity-25 rounded-end d-flex align-items-center flex-grow-1 text-muted">
									Jakarta - Indonesia, WIB (GMT +07:00)
								</div>
							</section>
						</div>

						<div class="header-section-item-right p-5 d-flex flex-column gap-8">
							<PratinjauHeaderItem
								color="success"
								icon="uil-user-circle"
								title="Kelas Peserta" />

							<section class="d-flex flex-wrap gap-3">
								<el-tag
									v-for="n in 5"
									:key="n"
									size="small"
									closable>
									XII IPA {{ n }}
								</el-tag>
							</section>
						</div>
					</div>
				</section>
			</header>

			<sortable
				v-if="mergedQuestions?.length"
				class="list-group questions-wrapper bg-light rounded-3 px-5 pb-5 mt-8"
				:list="mergedQuestions"
				item-key="question_id"
				:options="{
					animation: 200,
					ghostClass: 'opacity-50',
					handle: '.drag-handle'
				}"
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
								<i class="uil uil-draggabledots fs-1"></i>
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
					<button
						class="btn btn-primary btn-lg w-100">
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
	cursor: move;
}
.flip-list-move {
	transition: transform 0.5s;
}
</style>