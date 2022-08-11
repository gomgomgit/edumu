<script setup>
import { computed } from 'vue';
import PratinjauHeaderItem from './components/PratinjauHeaderItem.vue';

const examTime = 90

const examTimePercentage = computed(() => {
	const time = examTime - 1
	const minutesPerhour = 60
	const percent = Math.ceil((time % minutesPerhour) / minutesPerhour * 100)
	return percent + 1
})
</script>

<template>
	<div id="pratinjau-ujian">
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
</style>