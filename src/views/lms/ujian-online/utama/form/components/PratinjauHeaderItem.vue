<script setup>
defineProps({
	color: String,
	icon: String,
	content: String,
	title: { type: String, required: false }
})
</script>

<template>
	<section class="d-flex align-items-center">
		<div
			class="flex-shrink-0 bg-opacity-25 rounded-3 me-5 w-40px h-40px d-flex justify-content-center align-items-center"
			:class="'bg-' + color">
			<!-- <i class="fas fa-fw fs-1" :class="[icon, 'text-' + color]"></i> -->
			<i class="uil h1 mb-0" :class="[icon, 'text-' + color]"></i>
		</div>
		<div>
			<div v-if="title" class="fw-bolder lh-lg" :class="'text-' + color">{{ title }}</div>
			<div :class="{'small': title}">{{ content }}</div>
		</div>
	</section>
</template>