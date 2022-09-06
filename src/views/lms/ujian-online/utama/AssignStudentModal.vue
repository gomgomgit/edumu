<script setup>
import Modal from '@/components/modals/CustomModal.vue';
import { isEmpty } from 'validate.js';
import { computed } from 'vue';

const props = defineProps({
	activeData: { type: Object, default: () => ({}) }
})

const isShow = computed(() => !isEmpty(props.activeData))

</script>

<template>
	<Modal
		title="Pilih Siswa Remedial"
		:show="isShow"
		@closeModal="activeData = {}"
		@confirm="activeData = {}"
		@dismiss="activeData = {}">

		{{ JSON.stringify(activeData) }}
	</Modal>
</template>