<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [{
	to: '/lms/ujian-online/utama/form/pengaturan',
	title: 'Pengaturan',
	subtitle: 'Ujian Online',
	route: 'lms-ujian-online-utama-form-pengaturan',
	iconNormal: 'figma-icon/favorite-chart-dark.png',
	iconActive: 'figma-icon/favorite-chart-light.png',
},{
	to: '/lms/ujian-online/utama/form/soal-ujian',
	title: 'Soal Ujian',
	subtitle: 'Buat soal dan jawaban',
	route: 'lms-ujian-online-utama-form-soal-ujian',
	iconNormal: 'figma-icon/message-add-1-dark.png',
	iconActive: 'figma-icon/message-add-1-light.png',
},{
	to: '/lms/ujian-online/utama/form/pratinjau',
	title: 'Pratinjau',
	subtitle: 'Ujian Online',
	route: 'lms-ujian-online-utama-form-pratinjau',
	iconNormal: 'figma-icon/gallery-favorite-dark.png',
	iconActive: 'figma-icon/gallery-favorite-light.png',
}]
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

				<section
					class="col-md-3"
					v-for="(tab, index) in tabs"
					:key="index">
					<router-link
						class="w-100 d-flex align-items-center py-4 ps-6 border border-2 rounded-3"
						active-class="border-primary bg-primary shadow-sm"
						:to="tab.to">
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
					</router-link>
				</section>
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