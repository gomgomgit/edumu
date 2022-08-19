<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification';

const router = useRouter()
const route = useRoute()

const tabs = computed(() => ([{
	to: '/lms/ujian-online/utama/form/pengaturan/' + route.params?.exam_id,
	title: 'Pengaturan',
	subtitle: 'Ujian Online',
	route: 'lms-ujian-online-utama-form-pengaturan',
	iconNormal: 'figma-icon/favorite-chart-dark.png',
	iconActive: 'figma-icon/favorite-chart-light.png',
},{
	to: '/lms/ujian-online/utama/form/soal-ujian/' + route.params?.exam_id,
	title: 'Soal Ujian',
	subtitle: 'Buat soal dan jawaban',
	route: 'lms-ujian-online-utama-form-soal-ujian',
	iconNormal: 'figma-icon/message-add-1-dark.png',
	iconActive: 'figma-icon/message-add-1-light.png',
},{
	to: '/lms/ujian-online/utama/form/pratinjau/' + route.params?.exam_id,
	title: 'Pratinjau',
	subtitle: 'Ujian Online',
	route: 'lms-ujian-online-utama-form-pratinjau',
	iconNormal: 'figma-icon/gallery-favorite-dark.png',
	iconActive: 'figma-icon/gallery-favorite-light.png',
}]))

function handleTabClick (tab) {
	if (!route.params?.exam_id) return useToast().warning('Buat event ujian online terlebih dahulu!')
	router.push(tab.to)
}
</script>

<template>
	<div class="card">
		<div class="card-body">
			<div class="row">
				<section class="col-md-3">
					<div class="w-100 h-100 d-flex justify-content-center align-items-center">
						<span class="display-4 me-3">3</span>
						<div>
							<div class="fs-4 fw-bold">Langkah Praktis</div>
							<div class="text-muted">Buat event ujian online</div>
						</div>
					</div>
				</section>

				<div class="col-md-9 bg-light p-3 rounded-3">
					<div class="row">
						<section
							class="col-md-4"
							v-for="(tab, index) in tabs"
							:key="index">
							<div
								role="button"
								class="w-100 d-block py-4 ps-6 rounded-3"
								:class="{ 'bg-primary': route.name === tab.route }"
								@click="handleTabClick(tab)">
								<div class="d-flex align-items-center">
									<img
										class="me-5"
										:src="route.name === tab.route ? tab.iconActive : tab.iconNormal"
										:alt="tab.title">
									<div>
										<div
											:class="route.name === tab.route ? 'text-white' : 'text-black'"
											class="fs-4 fw-bold">
											{{ tab.title }}
										</div>
										<div :class="route.name === tab.route ? 'text-white-50' : 'text-muted'">
											{{ tab.subtitle }}
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>

			<div class="separator border-black-50 border-2 mb-3 mt-5"></div>

			<router-view v-slot="{ Component, route }">
				<transition :name="route.meta.transition || 'slide-fade'">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
	</div>
</template>